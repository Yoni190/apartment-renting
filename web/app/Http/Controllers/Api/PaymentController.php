<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;

class PaymentController extends Controller
{
    public function initialize(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated user'
            ], 401);
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'plan_type' => 'required|string'
        ]);

        $refNo = strtoupper(Str::random(10));

        $payload = [
            "amount" => $request->amount,
            "currency" => "ETB",
            "email" => $user->email,
            "first_name" => $user->name,
            "last_name" => "",
            "tx_ref" => $refNo,
            "return_url" => config('app.url') . "/api/pay/verify?reference=" . $refNo,
            "customization" => [
                "title" => ucfirst($request->plan_type) . " Plan",
                "description" => "Mobile subscription"
            ]
        ];

        if ($user->phone_number) {
            $payload["phone_number"] = $user->phone_number;
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('CHAPA_SECRET_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.chapa.co/v1/transaction/initialize', $payload);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Chapa failed',
                'error' => $response->body()
            ], 500);
        }

        return response()->json([
            'checkout_url' => $response->json('data.checkout_url'),
            'reference' => $refNo
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'reference' => 'required|string'
        ]);

        $data = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('CHAPA_SECRET_KEY'),
        ])->get("https://api.chapa.co/v1/transaction/verify/" . $request->reference);

        if ($data->json('status') === 'success') {

            $user = $request->user();

            $planType = $data->json('data.customization.title') ?? 'basic';

            $user->update([
                'subscribed' => 1,
                'plan_type' => strtolower($planType),
                'subscription_expires_at' => Carbon::now()->addYear(),
            ]);

            return response()->json([
                'message' => 'Subscription successful'
            ]);
        }

        return response()->json([
            'message' => 'Payment not verified'
        ], 400);
    }
}