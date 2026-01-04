<?php

// approve_test.php
// Bootstraps the Laravel application and attempts to mark a pending apartment as approved
// This is a local test helper to verify we don't get a FK constraint when setting verification fields.

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Apartment;
use Illuminate\Support\Facades\Log;

// Try to find a pending apartment, fallback to any apartment
$apartment = Apartment::where('verification_status', 'pending')->first() ?? Apartment::first();

if (! $apartment) {
    echo "NO_APARTMENTS_FOUND\n";
    exit(1);
}

$original = $apartment->toArray();

try {
    $apartment->verification_status = 'approved';
    $apartment->verified_at = now();
    $apartment->verified_by = null; // Do not write admin id into FK column

    $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
    $meta['verified_by_admin'] = [
        'id' => 1,
        'name' => 'Automated Tester',
        'email' => 'tester@example.com',
    ];
    $apartment->meta = $meta;

    $apartment->rejection_reason = null;
    $apartment->save();

    echo "OK: Apartment {$apartment->id} approved. verified_by is: ";
    echo var_export($apartment->verified_by, true) . "\n";
    echo "meta.verified_by_admin: " . json_encode($apartment->meta['verified_by_admin']) . "\n";
    exit(0);
} catch (\Illuminate\Database\QueryException $qe) {
    echo "DB_ERROR: " . $qe->getMessage() . "\n";
    exit(2);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(3);
}
