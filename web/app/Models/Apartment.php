<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'status',
        'address',
        'bedrooms',
        'bathrooms',
        'is_featured',
        'size',
        'meta',
        'user_id'
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    // Always expose a rejection_reason in API responses. The admin UI may store this
    // as a dedicated column or inside the meta JSON. Prefer the column if present,
    // otherwise fall back to meta.rejection_reason.
    protected $appends = ['rejection_reason'];

    public function getRejectionReasonAttribute()
    {
        // If the underlying attribute exists (DB column), return it.
        if (array_key_exists('rejection_reason', $this->attributes) && $this->attributes['rejection_reason'] !== null) {
            return $this->attributes['rejection_reason'];
        }

        // Otherwise, try meta
        if (is_array($this->meta) && array_key_exists('rejection_reason', $this->meta)) {
            return $this->meta['rejection_reason'];
        }

        return null;
    }

    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function images() {
        return $this->hasMany(ApartmentImage::class);
    }

    public function openHours()
    {
        return $this->hasMany(ListingOpenHour::class, 'listing_id');
    }

    public function bookings()
    {
        return $this->hasMany(TourBooking::class, 'listing_id');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function averageRating() {
        return $this->reviews()->avg('rating');
    }

}
