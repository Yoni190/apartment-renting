<?php

namespace App\Http\Controllers;

use Chapa\Chapa\Facades\Chapa as Chapa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected $reference;

    public function __construct()
    {
        $this->reference = Chapa::generateReference();
    }

    public function index()
    {
        $user = auth()->user();

        if ($user->subscribed) {
            return redirect()->route('user.client.dashboard')
                             ->with('info', 'You are already subscribed.');
        }

        return view('web.owner.subscription');
    }


    public function callback($reference)
    {
        $data = Chapa::verifyTransaction($reference);

        if ($data['status'] === 'success') {
            $user = Auth::user();
            $planType = $data['data']['customization']['title'] ?? 'basic';
            $user->subscribed = 1;
            $user->plan_type = strtolower($planType);
            $user->subscription_expires_at = Carbon::now()->addYear(); // 1 year subscription
            $user->save();

            return redirect()->route('user.client.profile')
                             ->with('success', "Your {$planType} plan subscription was successful!");
        }

        return redirect()->route('web.owner.subscription')->with('error', 'Payment failed or canceled.');
    }


    public function initialize(Request $request)
    {
        $user = Auth::user();

        $amount = (float) $request->input('amount', 2000); // default to 2000
        $planType = $request->input('plan_type', 'basic');

        // Generate a unique reference
        $refNo = strtoupper(Str::random(10));

        $secretKey = env('CHAPA_SECRET_KEY');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $secretKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.chapa.co/v1/transaction/initialize', [
            "amount" => $amount,
            "currency" => "ETB",
            "first_name" => $user->name ?? 'User',
            "last_name" => '', 
            "email" => $user->email,
            "phone_number" => $user->phone_number ?? null,
            "tx_ref" => $refNo,
            "return_url" => route('callback', ['reference' => $refNo]), // callback route
            "customization" => [
                "title" => substr(ucfirst($planType) . " Plan", 0, 16), // Chapa max 16 chars
                "description" => "Subscription for {$planType} plan",
            ]
        ]);

        if ($response->successful()) {
            $checkoutUrl = $response->json('data.checkout_url');

            // Redirect user to Chapa checkout page
            return redirect()->away($checkoutUrl);
        } else {
            return redirect()->back()->with('error', 'Failed to initialize transaction: ' . $response->body());
        }
    }
}
