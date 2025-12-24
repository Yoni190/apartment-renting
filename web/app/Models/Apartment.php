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

    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function images() {
        return $this->hasMany(ApartmentImage::class);
    }

}
