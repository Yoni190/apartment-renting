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
        'size'
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }

}
