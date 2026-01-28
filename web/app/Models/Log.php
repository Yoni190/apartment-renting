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
}
