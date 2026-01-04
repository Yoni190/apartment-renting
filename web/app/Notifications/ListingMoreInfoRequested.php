<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Apartment;

class ListingMoreInfoRequested extends Notification
{
    use Queueable;

    protected $apartment;
    protected $messageText;
    protected $adminId;

    public function __construct(Apartment $apartment, $messageText = null, $adminId = null)
    {
        $this->apartment = $apartment;
        $this->messageText = $messageText;
        $this->adminId = $adminId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'listing_more_info',
            'apartment_id' => $this->apartment->id,
            'title' => $this->apartment->title,
            'message' => $this->messageText ?? 'Admin has requested more information about your listing.',
            'requested_by' => $this->adminId,
        ];
    }
}
