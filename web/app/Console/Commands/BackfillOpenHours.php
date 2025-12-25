<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Apartment;
use App\Models\ListingOpenHour;
use Carbon\Carbon;

class BackfillOpenHours extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backfill:open-hours';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create listing_open_hours rows from apartments.meta.open_for_tour when present';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Scanning apartments for open_for_tour meta...');
        $apartments = Apartment::whereNotNull('meta')->get();
        $count = 0;
        foreach ($apartments as $a) {
            $meta = $a->meta ?? [];
            if (!$meta) continue;
            $oft = $meta['open_for_tour'] ?? null;
            if (!$oft) continue;
            if (is_string($oft)) {
                $oft = json_decode($oft, true);
            }
            if (!is_array($oft)) continue;
            $timeFrom = $oft['time_from'] ?? null;
            $timeTo = $oft['time_to'] ?? null;
            $dateFrom = $oft['date_from'] ?? null;
            $dateTo = $oft['date_to'] ?? null;
            if (!$timeFrom || !$timeTo) continue;
            $fmtTimeFrom = strlen($timeFrom) === 5 ? $timeFrom . ':00' : $timeFrom;
            $fmtTimeTo = strlen($timeTo) === 5 ? $timeTo . ':00' : $timeTo;

            $days = [];
            if ($dateFrom && $dateTo) {
                try {
                    $start = Carbon::parse($dateFrom);
                    $end = Carbon::parse($dateTo);
                    for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                        $days[] = $d->dayOfWeek;
                    }
                    $days = array_values(array_unique($days));
                } catch (\Exception $e) {
                    $days = range(0,6);
                }
            } else {
                $days = range(0,6);
            }

            foreach ($days as $dow) {
                $exists = ListingOpenHour::where('listing_id', $a->id)
                    ->where('day_of_week', $dow)
                    ->where('start_time', $fmtTimeFrom)
                    ->where('end_time', $fmtTimeTo)
                    ->exists();
                if (!$exists) {
                    ListingOpenHour::create([
                        'listing_id' => $a->id,
                        'day_of_week' => $dow,
                        'start_time' => $fmtTimeFrom,
                        'end_time' => $fmtTimeTo,
                    ]);
                    $count++;
                }
            }
        }

        $this->info("Backfilled $count open hour records.");
        return 0;
    }
}
