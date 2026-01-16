<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NationalIdController extends Controller
{
    public function verify(Request $request) {
        $request->validate([
            'national_id' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        $record = NationalId::where('national_id', $request->national_id)
            ->where('is_active', true)
            ->first();

        if(!$record) {
            return response->json([
                'valid' => false,
                'reason' => 'ID not found'
            ], 404);
        }

        if(strcasecmp($record->first_name . ' ' . $record->last_name, $request->first_name . ' ' . $request->last_name) !== 0) {
            return response->json([
                'valid' => false,
                'reason' => 'Name mismatch'
            ], 403);
        }

        return response->json([
            'valid' => true,
            'status' => 'active'
        ]);
    }
}
