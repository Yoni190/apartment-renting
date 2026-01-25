<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\AdminRole;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'admin_role_id'
    ];


    protected $hidden = [
        'password'
    ];


    public function role() {
        return $this->belongsTo(AdminRole::class, 'admin_role_id');
    }

    public function logs() {
        return $this->hasMany(Log::class);
    }
}
