<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\TourBooking;
use App\Models\ListingOpenHour;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Notifications\TourRequested;

class TourBookingController extends Controller
{
    /**
     * Show a simple booking form (web) - lists open hours so frontend can limit choices.
     */
    public function create(Apartment $apartment)
    {
        // pass open hours to view
        $openHours = $apartment->openHours()->orderBy('day_of_week')->get();
        return view('web.owner.book_tour', ['listing' => $apartment, 'openHours' => $openHours]);
    }

    /**
     * Store a new booking.
     */
    public function store(Request $request, Apartment $apartment)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required', // expected HH:MM or time string
            'note' => 'nullable|string'
        ]);

        $user = Auth::user();
        if (!$user) return redirect()->route('login');

        // Combine date and time into Carbon
        try {
            $scheduled = Carbon::parse($request->input('date').' '.$request->input('time'));
        } catch (\Exception $e) {
            return back()->withErrors(['time' => 'Invalid date or time']);
        }

        // Validate against the listing's open_for_tour meta (authoritative)
        $meta = $apartment->meta ?? [];
        $oft = $meta['open_for_tour'] ?? null;
        if ($oft && is_string($oft)) {
            $oft = json_decode($oft, true);
        }

        if (!is_array($oft) || empty($oft['time_from']) || empty($oft['time_to'])) {
            return back()->withErrors(['time' => 'This listing does not accept tour requests (no open hours set).']);
        }

        // Date must fall within date_from..date_to if provided
        $dateFrom = !empty($oft['date_from']) ? Carbon::parse($oft['date_from'])->startOfDay() : null;
        $dateTo = !empty($oft['date_to']) ? Carbon::parse($oft['date_to'])->endOfDay() : null;
        if ($dateFrom && $scheduled->lt($dateFrom)) {
            return back()->withErrors(['time' => 'Selected date is before the allowed tour window.']);
        }
        if ($dateTo && $scheduled->gt($dateTo)) {
            return back()->withErrors(['time' => 'Selected date is after the allowed tour window.']);
        }

        // Time must be between time_from and time_to
        $timeFrom = Carbon::createFromFormat('H:i', str_pad($oft['time_from'], 5, '0', STR_PAD_LEFT));
        $timeTo = Carbon::createFromFormat('H:i', str_pad($oft['time_to'], 5, '0', STR_PAD_LEFT));
        $candidateTime = Carbon::createFromFormat('H:i', $scheduled->format('H:i'));
        if ($candidateTime->lt($timeFrom) || $candidateTime->gt($timeTo)) {
            return back()->withErrors(['time' => 'Selected time is outside the listing open hours.']);
        }

        // Save booking as pending
        $booking = TourBooking::create([
            'listing_id' => $apartment->id,
            'user_id' => $user->id,
            'scheduled_at' => $scheduled,
            'status' => \App\Models\TourBooking::STATUS_PENDING,
            'note' => $request->input('note'),
        ]);

        // Notify the owner (database notification)
        $owner = $apartment->owner;
        if ($owner) {
            $owner->notify(new TourRequested($booking));
        }

        return redirect()->back()->with('success', 'Tour requested — owner will receive a notification.');
    }
}
