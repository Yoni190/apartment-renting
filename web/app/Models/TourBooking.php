<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourBooking extends Model
{
    use HasFactory;

    protected $table = 'tour_bookings';

    protected $fillable = [
        'listing_id',
        'user_id',
        'scheduled_at',
        'status',
        'note',
    ];

    protected $dates = ['scheduled_at'];

    public function listing()
    {
        return $this->belongsTo(Apartment::class, 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
