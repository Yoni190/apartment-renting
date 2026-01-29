<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'entity_type',
        'entity_id',
        'entity_name',
        'action',
    ];

    public function admin() {
        return $this->belongsTo(Admin::class);
    }

    public function getEntityNameAttribute()
    {
        return match($this->entity_type) {
            'User' => optional(User::find($this->entity_id))->name ?? 'Deleted User',
            'Apartment' => optional(Apartment::find($this->entity_id))->title ?? 'Deleted Apartment',
            default => 'N/A',
        };
    }

    public function entity()
    {
        return $this->morphTo(null, 'entity_type', 'entity_id');
    }
}
