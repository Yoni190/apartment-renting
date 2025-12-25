<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\TourBooking;

class TourRequested extends Notification
{
    use Queueable;

    protected $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(TourBooking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation for database channel.
     */
    public function toDatabase($notifiable)
    {
        $listing = $this->booking->listing;
        return [
            'booking_id' => $this->booking->id,
            'listing_id' => $listing->id,
            'listing_title' => $listing->title,
            'client_id' => $this->booking->user_id,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'status' => $this->booking->status,
        ];
    }
}
