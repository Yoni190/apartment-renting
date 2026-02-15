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

    public function storeOpenHours(Request $request, $listingId)
    {
        // Optional: clear existing hours (so user can reset)
        ListingOpenHour::where('listing_id', $listingId)->delete();

        $daysMap = [
            'Sunday' => 0,
            'Monday' => 1,
            'Tuesday' => 2,
            'Wednesday' => 3,
            'Thursday' => 4,
            'Friday' => 5,
            'Saturday' => 6,
        ];

        foreach ($request->days_from as $index => $fromDay) {

            $toDay = $request->days_to[$index];
            $startTime = $request->time_from[$index];
            $endTime = $request->time_to[$index];

            $startIndex = $daysMap[$fromDay];
            $endIndex = $daysMap[$toDay];

            
            if ($startIndex <= $endIndex) {
                $range = range($startIndex, $endIndex);
            } else {
                $range = array_merge(
                    range($startIndex, 6),
                    range(0, $endIndex)
                );
            }

            foreach ($range as $day) {
                ListingOpenHour::create([
                    'listing_id' => $listingId,
                    'day_of_week' => $day,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);
            }
        }

        return back()->with('success', 'Open hours saved successfully!');
    }

    public function storeWeb(Request $request, Apartment $apartment)
    {
        $request->validate([
            'date' => 'required|date',
            'time' => 'required', // HH:MM or HH:MM:SS
            'note' => 'nullable|string'
        ]);

        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Combine date and time into Carbon instance
        try {
            $scheduled = Carbon::parse($request->input('date').' '.$request->input('time'));
        } catch (\Exception $e) {
            return back()->withErrors(['time' => 'Invalid date or time']);
        }

        // Get the day of week
        $dayOfWeek = $scheduled->dayOfWeek; // 0=Sun, 1=Mon, etc.

        // Find open hours for that day
        $slots = $apartment->openHours()->where('day_of_week', $dayOfWeek)->get();

        if ($slots->isEmpty()) {
            return back()->withErrors(['time' => 'No tours are available on this day.']);
        }

        // Check if selected time falls within any open slot
        $valid = false;
        foreach ($slots as $slot) {
            $start = Carbon::parse($slot->start_time);
            $end   = Carbon::parse($slot->end_time);
            $scheduledTime = Carbon::parse($scheduled->format('H:i')); // only time

            if ($scheduledTime->between($start, $end)) {
                $valid = true;
                break;
            }
        }

        if (!$valid) {
            return back()->withErrors(['time' => 'Selected time is outside available tour hours.']);
        }

        // Save booking
        $booking = TourBooking::create([
            'listing_id'   => $apartment->id,
            'user_id'      => $user->id,
            'scheduled_at' => $scheduled,
            'status'       => TourBooking::STATUS_PENDING,
            'note'         => $request->input('note'),
        ]);

        // Notify owner
        if ($apartment->owner) {
            $apartment->owner->notify(new TourRequested($booking));
        }

        return redirect()->back()->with('success', 'Tour requested — owner will receive a notification.');
    }
}
