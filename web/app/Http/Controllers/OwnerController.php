<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Apartment;
use App\Models\TourBooking;
use App\Models\ApartmentImage;

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

    public function addApartmentView() {
        return view('web.owner.add-apartment');
    }

    public function storeApartment(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'size' => 'nullable|numeric|min:0',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $apartment = Apartment::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'status' => 0,
            'address' => $request->address,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'size' => $request->size,
            'is_featured' => 0,
            'user_id' => auth()->user()->id,
        ]);

        if($request->hasFile('images')) {
            foreach($request->file('images') as $index => $image) {
                // Unique file name
                $filename = time() . '_' . uniqid() . '_' . $image->getClientOriginalName();

                // Store image in storage/app/public/apartments
                $imagePath = $image->storeAs('apartments', $filename, 'public');

                // Store in apartment images
                ApartmentImage::create([
                    'apartment_id' => $apartment->id,
                    'path' => $imagePath,
                ]);
            }
        }

        return redirect()->route('owner.dashboard')->with('success', 'Apartment Created Successfully!');
    }

    public function editApartmentView(Apartment $apartment) {
        return view('web.owner.edit-apartment', compact('apartment'));
    }

    public function editApartment(Request $request, Apartment $apartment)
    {
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'price' => 'required|numeric',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'size' => 'required|numeric',
            'description' => 'required|string',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        
        $apartment->update($validated);

        
        if ($request->hasFile('images')) {

            
            foreach ($apartment->images as $image) {
                \Storage::delete($image->path);
                $image->delete();
            }

            
            foreach ($request->file('images') as $file) {
                $path = $file->store('apartments', 'public');

                $apartment->images()->create([
                    'path' => $path
                ]);
            }
        }

        return redirect()
            ->route('owner.dashboard')
            ->with('success', 'Apartment updated successfully!');
    }

    public function destroy(Apartment $apartment)
    {   
        if ($apartment->user_id !== auth()->id()) {
            abort(403);
        }

        $apartment->bookings()->delete();

        foreach ($apartment->images as $image) {
            \Storage::delete($image->path);
            $image->delete();
        }

        $apartment->delete();

        return redirect()->route('owner.dashboard')
            ->with('success', 'Listing deleted successfully.');
    }
}

