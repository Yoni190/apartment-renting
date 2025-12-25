<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Apartment;
use App\Models\TourBooking;

class OwnerController extends Controller
{
    public function dashboard()
    {
        $request = request();
        $q = $request->input('q', null);

        $user = Auth::user();
        if (!$user) return redirect()->route('login');

        // apartments owned by user
        $listings = Apartment::where('user_id', $user->id)->with(['openHours'])->get();

        // owner's bookings for their apartments; allow simple search by listing title or client name/email
        $bookingQuery = TourBooking::whereIn('listing_id', $listings->pluck('id'))->with('user','listing')->latest();
        if ($q) {
            $bookingQuery->whereHas('listing', function($b) use ($q) {
                $b->where('title', 'like', "%$q%");
            })->orWhereHas('user', function($u) use ($q) {
                $u->where('name', 'like', "%$q%")->orWhere('email', 'like', "%$q%");
            });
        }
        $bookings = $bookingQuery->get();

        // database notifications (latest)
        // use database notifications relation if available, otherwise fetch from notifications table
        try {
            $notifications = method_exists($user, 'notifications') ? $user->notifications()->latest()->get() : collect([]);
        } catch (\Throwable $e) {
            $notifications = collect([]);
        }

        return view('web.owner.dashboard', compact('listings','bookings','notifications','q'));
    }

    public function showListing(Apartment $apartment)
    {
        $apartment->load('images','owner');
        $bookingId = request()->input('booking_id');
        return view('web.owner.apartment_detail', ['listing' => $apartment, 'booking_id' => $bookingId]);
    }

    public function clientProfile(TourBooking $booking)
    {
        $booking->load('user','listing');
        $user = $booking->user;
        return view('web.owner.client_profile', ['booking' => $booking, 'user' => $user]);
    }
}
