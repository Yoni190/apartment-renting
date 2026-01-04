<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Apartment;

class ListingApproved extends Notification
{
    use Queueable;

    protected $apartment;

    public function __construct(Apartment $apartment)
    {
        $this->apartment = $apartment;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'listing_approved',
            'apartment_id' => $this->apartment->id,
            'title' => $this->apartment->title,
            'message' => 'Your listing has been approved by admin.',
            // verified_by may be null (schema references users). Provide admin info from meta if available.
            'verified_by' => $this->apartment->verified_by,
            'verified_by_admin' => $this->apartment->meta['verified_by_admin'] ?? null,
            'verified_at' => optional($this->apartment->verified_at)->toDateTimeString(),
        ];
    }
}
