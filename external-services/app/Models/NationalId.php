<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NationalId extends Model
{
    protected $fillable = [
        'national_id',
        'full_name',
        'date_of_birth',
        'is_active'
    ];
}
