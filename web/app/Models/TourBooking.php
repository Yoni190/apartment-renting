<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourBooking extends Model
{
    use HasFactory;

    protected $table = 'tour_bookings';

    protected $fillable = [
        'listing_id',
        'user_id',
        'scheduled_at',
        'status',
        'note',
    ];

    protected $dates = ['scheduled_at'];

    // Canonical statuses used across the platform.
    public const STATUS_PENDING = 'Pending';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_CANCELLATION_REQUESTED = 'Cancellation Requested';
    public const STATUS_CANCELED = 'Canceled';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_NO_SHOW = 'No Show';
    public const STATUS_REJECTED = 'Rejected';

    public static function allowedStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_CANCELLATION_REQUESTED,
            self::STATUS_CANCELED,
            self::STATUS_COMPLETED,
            self::STATUS_NO_SHOW,
            self::STATUS_REJECTED,
        ];
    }

    // Normalize various incoming status representations to canonical statuses
    public static function normalizeStatus(?string $status): ?string
    {
        if ($status === null) return null;
        $s = trim((string) $status);
        if ($s === '') return null;

        // Map common lower-cased / underscored variants to canonical values
        $map = [
            'pending' => self::STATUS_PENDING,
            'approved' => self::STATUS_APPROVED,
            'rejected' => self::STATUS_REJECTED,
            'canceled' => self::STATUS_CANCELED,
            'cancelled' => self::STATUS_CANCELED,
            'cancellation_requested' => self::STATUS_CANCELLATION_REQUESTED,
            'cancellation requested' => self::STATUS_CANCELLATION_REQUESTED,
            'cancellation-requested' => self::STATUS_CANCELLATION_REQUESTED,
            'cancellationrequested' => self::STATUS_CANCELLATION_REQUESTED,
            'completed' => self::STATUS_COMPLETED,
            'no_show' => self::STATUS_NO_SHOW,
            'no-show' => self::STATUS_NO_SHOW,
            'noshow' => self::STATUS_NO_SHOW,
        ];

        $lower = strtolower($s);
        if (isset($map[$lower])) return $map[$lower];

        // If already matches a canonical status (case-sensitive), return as-is
        foreach (self::allowedStatuses() as $canon) {
            if (strcasecmp($canon, $s) === 0) return $canon;
        }

        // Unknown status: return original trimmed string (caller will validate)
        return $s;
    }

    public function listing()
    {
        return $this->belongsTo(Apartment::class, 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
