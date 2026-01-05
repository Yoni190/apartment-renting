<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Api;

class SettingController extends Controller
{
        public function saveAPI(Request $request)
        {
            $request->validate([
                'name' => 'required|string|max:100',
                'key' => 'nullable|string|max:255',
                'provider' => 'required|string|max:100',
            ]);

            $api = Api::firstOrNew(['type' => 'payment']);

            $api->name = $request->name;
            $api->api_provider = $request->provider;
            $api->type = 'payment';

            if ($request->filled('key')) {
                $api->api_key = encrypt($request->key);
            }

            $api->save();

            return redirect()
                ->route('admin.settings')
                ->with('message', 'API Settings saved successfully!');
        }

}
