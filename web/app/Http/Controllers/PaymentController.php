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

        $amount = $request->input('amount'); // 2000 or 5000
        $planType = $request->input('plan_type'); // basic or premium

        $reference = $this->reference;

        $data = [
            'amount' => $amount,
            'email' => $user->email,
            'tx_ref' => $reference,
            'currency' => "ETB",
            'callback_url' => route('callback', [$reference]),
            'first_name' => $user->name,
            'last_name' => '',
            "customization" => [
                "title" => ucfirst($planType) . ' Plan Subscription',
                "description" => "Subscription for {$planType} plan"
            ]
        ];

        $payment = Chapa::initializePayment($data);

        if ($payment['status'] !== 'success') {
            return redirect()->back()->with('error', 'Something went wrong while initiating payment.');
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
