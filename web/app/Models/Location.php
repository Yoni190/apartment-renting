<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

     protected $fillable = [
        'sub_city',
        'woreda',
        'kebele',
        'special_area_name'
     ];

     public function apartment()
    {
        return $this->hasOne(Apartment::class);
    }
}
