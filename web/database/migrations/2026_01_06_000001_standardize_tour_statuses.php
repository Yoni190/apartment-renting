<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\TourBooking;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Normalize existing status values to canonical statuses.
        // This migration is defensive: it attempts to map common lower-case or underscored
        // variants to the canonical platform statuses.
        DB::table('tour_bookings')->orderBy('id')->chunk(100, function ($rows) {
            foreach ($rows as $r) {
                $old = $r->status;
                $norm = TourBooking::normalizeStatus($old);
                if ($norm !== $old) {
                    DB::table('tour_bookings')->where('id', $r->id)->update(['status' => $norm]);
                } else {
                    // If status is not one of the allowed set, attempt to uppercase-first mapping
                    if (!in_array($old, TourBooking::allowedStatuses(), true)) {
                        $lower = strtolower((string) $old);
                        // attempt mapping for known words
                        $map = [
                            'pending' => TourBooking::STATUS_PENDING,
                            'approved' => TourBooking::STATUS_APPROVED,
                            'rejected' => TourBooking::STATUS_REJECTED,
                            'canceled' => TourBooking::STATUS_CANCELED,
                            'cancelled' => TourBooking::STATUS_CANCELED,
                            'completed' => TourBooking::STATUS_COMPLETED,
                            'no_show' => TourBooking::STATUS_NO_SHOW,
                            'no-show' => TourBooking::STATUS_NO_SHOW,
                        ];
                        if (isset($map[$lower])) {
                            DB::table('tour_bookings')->where('id', $r->id)->update(['status' => $map[$lower]]);
                        }
                    }
                }
            }
        });

        // Change column default to canonical Pending (string). We won't change type; just alter default.
        if (Schema::hasTable('tour_bookings')) {
            Schema::table('tour_bookings', function (Blueprint $table) {
                // MySQL allows changing default via alter; Laravel's change() requires doctrine/dbal which may
                // not be installed. We'll issue a raw SQL statement to change the default safely.
            });

            // Attempt to alter default using raw SQL (works for MySQL). If not MySQL, this may be ignored.
            try {
                $driver = DB::getDriverName();
                if ($driver === 'mysql') {
                    DB::statement("ALTER TABLE `tour_bookings` ALTER `status` SET DEFAULT 'Pending'");
                } elseif ($driver === 'pgsql') {
                    DB::statement("ALTER TABLE tour_bookings ALTER COLUMN status SET DEFAULT 'Pending'");
                } else {
                    // skip for other drivers
                }
            } catch (\Exception $e) {
                // ignore failures to change default; semantics will be enforced in app logic
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert default to 'pending' lowercase to preserve original behavior if rolling back
        try {
            $driver = DB::getDriverName();
            if ($driver === 'mysql') {
                DB::statement("ALTER TABLE `tour_bookings` ALTER `status` SET DEFAULT 'pending'");
            } elseif ($driver === 'pgsql') {
                DB::statement("ALTER TABLE tour_bookings ALTER COLUMN status SET DEFAULT 'pending'");
            }
        } catch (\Exception $e) {
            // ignore
        }
    }
};
