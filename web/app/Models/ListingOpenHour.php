<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingOpenHour extends Model
{
    use HasFactory;

    protected $table = 'listing_open_hours';

    protected $fillable = [
        'listing_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    public function listing()
    {
        return $this->belongsTo(Apartment::class, 'listing_id');
    }
}
