<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'listing_id',
        'read_at',
        'sender_deleted',
        'receiver_deleted',
        'reply_to_id',
        'media_url',
        'media_type'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'sender_deleted' => 'boolean',
        'receiver_deleted' => 'boolean',
        'reply_to_id' => 'integer',
        'media_url' => 'string',
        'media_type' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Optionally load sender/receiver relationships if needed in future
    public function sender()
    {
        return $this->belongsTo(\App\Models\User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(\App\Models\User::class, 'receiver_id');
    }
}
