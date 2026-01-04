<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentVerificationDocument extends Model
{
    use HasFactory;

    protected $table = 'apartment_verification_documents';

    protected $fillable = [
        'apartment_id',
        'document_type',
        'file_path',
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }
}
