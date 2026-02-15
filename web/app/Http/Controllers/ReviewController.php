<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(Request $request, Apartment $apartment) {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $existingReview = Review::where('user_id', $request->user()->id)
                            ->where('apartment_id', $apartment->id)
                            ->first();
        
        if($existingReview){ 
            return response()->json([
                'message' => 'You have already reviewed this apartment.'
            ], 409);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'apartment_id' => $apartment->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review
        ], 201);

    }

    public function index(Apartment $apartment) {
        $reviews = Review::with('user:id,name')
                ->where('apartment_id', $apartment->id)
                ->latest()
                ->get();
                
        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($reviews->avg('rating'), 1),
            'total_reviews' => $reviews->count(),
        ]);
    }

    public function storeWeb(Request $request)
    {
        $request->validate([
            'apartment_id' => 'required|exists:apartments,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $existingReview = Review::where('user_id', auth()->id())
            ->where('apartment_id', $request->apartment_id)
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this apartment.');
        }

        Review::create([
            'user_id' => auth()->id(),
            'apartment_id' => $request->apartment_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Review added!');
    }
}
