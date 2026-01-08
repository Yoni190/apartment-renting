<?php
// One-off script: import verification file paths stored in apartment.meta['verification']['documents']
// into the apartment_verification_documents table if no DB row exists yet.
// Run from project web folder: php scripts/fix_meta_docs_to_db.php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Apartment;
use App\Models\ApartmentVerificationDocument;

$created = [];
$checked = 0;
foreach (Apartment::all() as $ap) {
    $checked++;
    $meta = is_array($ap->meta) ? $ap->meta : [];
    $docs = $meta['verification']['documents'] ?? ($meta['verification_documents'] ?? null);
    if (!is_array($docs)) continue;

    foreach ($docs as $k => $p) {
        // Normalize canonical key mapping (simple aliases)
        $aliases = [
            'authorization_letter' => 'rental_authorization_letter',
            'authorization' => 'rental_authorization_letter',
            'ownership_doc' => 'ownership_certificate',
            'ownership' => 'ownership_certificate',
            'agent_id' => 'agent_authorization_letter',
            'nationalid' => 'national_id',
        ];
        $canonical = $aliases[$k] ?? $k;

        $exists = ApartmentVerificationDocument::where('apartment_id', $ap->id)
            ->where('document_type', $canonical)
            ->exists();
        if (!$exists) {
            ApartmentVerificationDocument::create([
                'apartment_id' => $ap->id,
                'document_type' => $canonical,
                'file_path' => $p,
            ]);
            $created[] = ['apartment' => $ap->id, 'type' => $canonical, 'path' => $p];
        }
    }
}

echo json_encode(['checked' => $checked, 'created' => $created], JSON_PRETTY_PRINT) . PHP_EOL;
