<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Api;

class SettingController extends Controller
{
        public function saveAPI(Request $request) {
            $request->validate([
                'name' => 'required|string|max:100',
                'key' => 'required|string|max:255',
                'provider' => 'required|string|max:100'
            ]);

            Api::updateOrCreate(
                ['type' => 'payment'],
                [
                'name' => $request->name,
                'api_key' => encrypt($request->key),
                'api_provider' => $request->provider,
                'type' => 'payment'
                ]
            );

            return redirect()->route('admin.settings')
            ->with('message', 'API Settings saved successfully!');
        }
}
