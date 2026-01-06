<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\TourBooking;

class TourStatusUpdated extends Notification
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
        $scheduled = null;
        if (is_string($this->booking->scheduled_at)) {
            $scheduled = $this->booking->scheduled_at;
        } elseif ($this->booking->scheduled_at instanceof \DateTime) {
            $scheduled = $this->booking->scheduled_at->format('Y-m-d H:i:s');
        } elseif (method_exists($this->booking->scheduled_at, 'toDateTimeString')) {
            $scheduled = $this->booking->scheduled_at->toDateTimeString();
        }

        return [
            'booking_id' => $this->booking->id,
            'listing_id' => $listing->id ?? null,
            'listing_title' => $listing->title ?? null,
            'client_id' => $this->booking->user_id,
            'scheduled_at' => $scheduled,
            'status' => $this->booking->status,
            'message' => 'Your tour request status has been updated to: ' . $this->booking->status,
        ];
    }
}
