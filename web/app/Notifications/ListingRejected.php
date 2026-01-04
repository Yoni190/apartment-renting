<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Apartment;

class ListingRejected extends Notification
{
    use Queueable;

    protected $apartment;
    protected $reason;

    public function __construct(Apartment $apartment, $reason = null)
    {
        $this->apartment = $apartment;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'listing_rejected',
            'apartment_id' => $this->apartment->id,
            'title' => $this->apartment->title,
            'message' => 'Your listing has been rejected by admin.',
            'rejection_reason' => $this->reason ?? $this->apartment->rejection_reason,
            'verified_by' => $this->apartment->verified_by,
            'verified_by_admin' => $this->apartment->meta['verified_by_admin'] ?? null,
            'verified_at' => optional($this->apartment->verified_at)->toDateTimeString(),
        ];
    }
}
