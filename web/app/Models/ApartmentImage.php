<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'path'
    ];

    protected $appends = ['url'];

    protected $hidden = [];

    public function apartment() {
        return $this->belongsTo(Apartment::class);  
    }

    public function getUrlAttribute() {
        // Return a publicly accessible URL for the stored image
        return asset('storage/' . $this->path);
    }
}
