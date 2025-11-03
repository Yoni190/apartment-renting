<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function admins() {
        return $this->hasMany(Admin::class, 'admin_role_id');
    }
}
