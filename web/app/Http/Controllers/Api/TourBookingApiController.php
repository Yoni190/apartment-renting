<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\ListingOpenHour;
use App\Models\TourBooking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Notifications\TourRequested;

class TourBookingApiController extends Controller
{
    // Public: return open hours for a listing
    public function openHours(Apartment $apartment)
    {
        $hours = $apartment->openHours()->orderBy('day_of_week')->get();
        return response()->json($hours);
    }

    // Authenticated owner: return bookings for owner's apartments
    public function ownerBookings(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $listings = Apartment::where('user_id', $user->id)->pluck('id');
    // eager-load listing images and owner so mobile can display thumbnails without extra requests
    $bookingQuery = TourBooking::whereIn('listing_id', $listings)->with(['user','listing.images','listing.owner'])->latest();
        $bookings = $bookingQuery->get();

        return response()->json(['bookings' => $bookings]);
    }

    // Authenticated client: return bookings made by the authenticated user
    public function clientBookings(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

    // include listing images for client-side thumbnails
    $bookings = TourBooking::where('user_id', $user->id)->with(['listing.images','listing.owner','user'])->latest()->get();

        return response()->json(['bookings' => $bookings]);
    }

    // Owner can update a booking status (approve/reject)
    public function updateStatus(Request $request, TourBooking $booking)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);
        // Determine role: listing owner or booking requester
        $listing = $booking->listing;
        $isListingOwner = $listing && $listing->user_id === $user->id;
        $isRequester = $booking->user_id === $user->id;

        $request->validate([
            'status' => 'required|string'
        ]);

        // Normalize incoming status
        $incoming = $request->input('status');
        $normalized = TourBooking::normalizeStatus($incoming);
        if (!in_array($normalized, TourBooking::allowedStatuses(), true)) {
            return response()->json(['message' => 'Invalid status provided'], 422);
        }

        // Business rules for allowed transitions (supports Pending and Approved flows):
        // - Listing owner may change Pending -> Approved or Pending -> Rejected
        // - Requester (client) may change Pending -> Canceled
        // - If booking is Approved and scheduled in the future:
        //     * If >= 24 hours away, requester may cancel directly -> Canceled
        //     * If < 24 hours away, requester may request cancellation -> Cancellation Requested
        // All other transitions are disallowed.
        $current = $booking->status;

        if ($isListingOwner) {
            // Owners may act on Pending bookings (approve/reject) or on Cancellation Requested (approve cancellation / revert to Approved)
            if ($current === TourBooking::STATUS_PENDING) {
                if (!in_array($normalized, [TourBooking::STATUS_APPROVED, TourBooking::STATUS_REJECTED], true)) {
                    return response()->json(['message' => 'Owners may only set status to Approved or Rejected for pending bookings'], 422);
                }
            } elseif ($current === TourBooking::STATUS_CANCELLATION_REQUESTED) {
                if (!in_array($normalized, [TourBooking::STATUS_CANCELED, TourBooking::STATUS_APPROVED], true)) {
                    return response()->json(['message' => 'Owners may only Approve (Canceled) or Reject (revert to Approved) cancellation requests'], 422);
                }
                } elseif ($current === TourBooking::STATUS_APPROVED) {
                    // If the booking is approved but the scheduled time has passed, allow owner to mark Completed or No Show
                    $scheduled = $booking->scheduled_at ? Carbon::parse($booking->scheduled_at) : null;
                    if (!$scheduled) {
                        return response()->json(['message' => 'Scheduled time missing; cannot perform post-tour actions'], 422);
                    }

                    $now = Carbon::now();
                    if ($scheduled->gt($now)) {
                        return response()->json(['message' => 'Post-tour actions are only allowed after the scheduled time has passed'], 422);
                    }

                    if (!in_array($normalized, [TourBooking::STATUS_COMPLETED, TourBooking::STATUS_NO_SHOW], true)) {
                        return response()->json(['message' => 'Owners may only set status to Completed or No Show after the tour time'], 422);
                    }
                } else {
                return response()->json(['message' => 'Owners may only act on Pending or Cancellation Requested bookings'], 422);
            }
        } elseif ($isRequester) {
            // Client actions
            if ($current === TourBooking::STATUS_PENDING) {
                if ($normalized !== TourBooking::STATUS_CANCELED) {
                    return response()->json(['message' => 'Clients may only cancel pending bookings (status Canceled)'], 422);
                }
            } elseif ($current === TourBooking::STATUS_APPROVED) {
                // Determine how far away the scheduled time is
                $scheduled = $booking->scheduled_at ? Carbon::parse($booking->scheduled_at) : null;
                if (!$scheduled) {
                    return response()->json(['message' => 'Cannot determine scheduled time for this booking'], 422);
                }

                $now = Carbon::now();
                if ($scheduled->lte($now)) {
                    return response()->json(['message' => 'Cannot modify bookings at or after the scheduled time'], 422);
                }

                $hoursUntil = $now->diffInHours($scheduled);
                if ($hoursUntil >= 24) {
                    // Direct cancellation allowed
                    if ($normalized !== TourBooking::STATUS_CANCELED) {
                        return response()->json(['message' => 'Client may only cancel (status Canceled) when tour is >= 24 hours away'], 422);
                    }
                } else {
                    // Less than 24 hours: only allow cancellation requests
                    if ($normalized !== TourBooking::STATUS_CANCELLATION_REQUESTED) {
                        return response()->json(['message' => 'Tour is less than 24 hours away; please request cancellation instead'], 422);
                    }
                }
            } else {
                return response()->json(['message' => 'Clients may only modify Pending or Approved bookings'], 422);
            }
        } else {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $booking->status = $normalized;
        $booking->save();

        // Notify the relevant party about status change
        try {
            $requester = $booking->user; // the client/requester
            $owner = $booking->listing ? $booking->listing->owner : null;

            // If the listing owner performed the action, notify the requester
            if ($isListingOwner && $requester) {
                $requester->notify(new \App\Notifications\TourStatusUpdated($booking));
            }

            // If the requester (client) performed the action (e.g. canceled), notify the listing owner
            if ($isRequester && $owner) {
                // owners may be stored as collections or a single user; guard accordingly
                if (is_iterable($owner)) {
                    foreach ($owner as $o) {
                        try { $o->notify(new \App\Notifications\TourStatusUpdated($booking)); } catch (\Exception $e) { }
                    }
                } else {
                    try { $owner->notify(new \App\Notifications\TourStatusUpdated($booking)); } catch (\Exception $e) { }
                }
            }
        } catch (\Exception $e) {
            // ignore notification failures to avoid blocking the API
        }

        return response()->json(['booking' => $booking]);
    }

    // Authenticated: create booking (JSON)
    public function store(Request $request, Apartment $apartment)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required',
            'note' => 'nullable|string'
        ]);

        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        try {
            $scheduled = Carbon::parse($request->input('date').' '.$request->input('time'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date/time provided'], 422);
        }

        // Validate against the listing's open_for_tour meta (authoritative)
        $meta = $apartment->meta ?? [];
        $oft = $meta['open_for_tour'] ?? null;
        if ($oft && is_string($oft)) {
            $oft = json_decode($oft, true);
        }

        if (!is_array($oft) || empty($oft['time_from']) || empty($oft['time_to'])) {
            return response()->json(['message' => 'This listing does not accept tour requests (no open hours set).'], 422);
        }

        // Date must fall within date_from..date_to if provided
        $dateFrom = !empty($oft['date_from']) ? Carbon::parse($oft['date_from'])->startOfDay() : null;
        $dateTo = !empty($oft['date_to']) ? Carbon::parse($oft['date_to'])->endOfDay() : null;
        if ($dateFrom && $scheduled->lt($dateFrom)) {
            return response()->json(['message' => 'Selected date is before the allowed tour window.'], 422);
        }
        if ($dateTo && $scheduled->gt($dateTo)) {
            return response()->json(['message' => 'Selected date is after the allowed tour window.'], 422);
        }

        // Time must be between time_from and time_to
        $timeFrom = Carbon::createFromFormat('H:i', str_pad($oft['time_from'], 5, '0', STR_PAD_LEFT));
        $timeTo = Carbon::createFromFormat('H:i', str_pad($oft['time_to'], 5, '0', STR_PAD_LEFT));
        $candidateTime = Carbon::createFromFormat('H:i', $scheduled->format('H:i'));
        if ($candidateTime->lt($timeFrom) || $candidateTime->gt($timeTo)) {
            return response()->json(['message' => 'Selected time is outside the listing open hours.'], 422);
        }

        $booking = TourBooking::create([
            'listing_id' => $apartment->id,
            'user_id' => $user->id,
            'scheduled_at' => $scheduled,
            // Store canonical Pending status
            'status' => \App\Models\TourBooking::STATUS_PENDING,
            'note' => $request->input('note'),
        ]);

        // notify owner
        $owner = $apartment->owner;
        if ($owner) {
            $owner->notify(new TourRequested($booking));
        }

        return response()->json(['message' => 'Booking created', 'booking' => $booking], 201);
    }
}
