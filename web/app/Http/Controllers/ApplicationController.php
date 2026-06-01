<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\User;

class ApplicationController extends Controller
{
    /**
     * Home feed (featured + recent listings)
     */
    public function home(Request $request)
    {
        $featured = Listing::with('images')
            ->where('is_featured', 1)
            ->latest()
            ->take(6)
            ->get();

        $latest = Listing::with('images')
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'featured' => $featured,
            'latest' => $latest,
        ]);
    }

    /**
     * Get all listings (with pagination)
     */
    public function listings(Request $request)
    {
        $query = Listing::with('images');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('min_price') && $request->has('max_price')) {
            $query->whereBetween('price', [$request->min_price, $request->max_price]);
        }

        $listings = $query->latest()->paginate(10);

        return response()->json($listings);
    }

    /**
     * Single listing details
     */
    public function showListing($id)
    {
        $listing = Listing::with(['images', 'location'])
            ->findOrFail($id);

        return response()->json([
            'listing' => $listing
        ]);
    }

    /**
     * Search listings
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string'
        ]);

        $query = $request->query;

        $results = Listing::with('images')
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('address', 'LIKE', "%{$query}%")
            ->latest()
            ->get();

        return response()->json([
            'results' => $results
        ]);
    }

    /**
     * Get current authenticated user profile (app version)
     */
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Update user profile (mobile)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:100',
            'phone_number' => 'sometimes|string',
        ]);

        $user->update($request->only(['name', 'phone_number']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get app settings (if needed later)
     */
    public function settings()
    {
        return response()->json([
            'app_name' => config('app.name'),
            'currency' => 'ETB',
            'support_email' => 'support@gojoye.com'
        ]);
    }
}