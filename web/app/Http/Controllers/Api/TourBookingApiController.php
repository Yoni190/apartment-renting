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
        $bookingQuery = TourBooking::whereIn('listing_id', $listings)->with(['user','listing'])->latest();
        $bookings = $bookingQuery->get();

        return response()->json(['bookings' => $bookings]);
    }

    // Authenticated client: return bookings made by the authenticated user
    public function clientBookings(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $bookings = TourBooking::where('user_id', $user->id)->with(['listing','listing.owner'])->latest()->get();

        return response()->json(['bookings' => $bookings]);
    }

    // Owner can update a booking status (approve/reject)
    public function updateStatus(Request $request, TourBooking $booking)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        // Only listing owner may update status
        $listing = $booking->listing;
        if (!$listing || $listing->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected,pending'
        ]);

        $booking->status = $request->input('status');
        $booking->save();

        // Notify the requester about status change
        try {
            $requester = $booking->user;
            if ($requester) {
                // use Laravel notifications if available; send a simple notification
                $requester->notify(new \App\Notifications\TourStatusUpdated($booking));
            }
        } catch (\Exception $e) {
            // ignore notification failures
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
            'status' => 'pending',
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
