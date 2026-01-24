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
}
