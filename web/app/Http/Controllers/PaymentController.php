<?php

namespace App\Http\Controllers;

use Chapa\Chapa\Facades\Chapa as Chapa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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

    public function initialize(Request $request)
    {
        $user = Auth::user();

        $amount = (float) $request->input('amount'); // cast to float
        $planType = $request->input('plan_type', 'basic');

        $reference = $this->reference;

        $data = [
            'amount' => $amount,
            'email' => $user->email,
            'tx_ref' => $reference,
            'currency' => 'ETB',
            'callback_url' => route('callback', [$reference]),
            'first_name' => $user->name ?? 'User',
            'last_name' => ' ',
            'phone_number' => $user->phone_number ?? null,
            "customization" => [
                "title" => ucfirst($planType) . " Plan",
                "description" => "Subscription for {$planType} plan"
            ]
        ];

        try {
            $payment = Chapa::initializePayment($data);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Payment initialization failed: ' . $e->getMessage());
        }

        if ($payment['status'] !== 'success') {
            return redirect()->back()->with('error', 'Something went wrong while initiating payment. Response: ' . json_encode($payment));
        }

        return redirect($payment['data']['checkout_url']);
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

            return redirect()->route('user.client.dashboard')
                             ->with('success', "Your {$planType} plan subscription was successful!");
        }

        return redirect()->route('subscription.page')->with('error', 'Payment failed or canceled.');
    }
}
