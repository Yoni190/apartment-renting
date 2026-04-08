<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Optional: redirect subscribed users
        if ($user->subscribed) {
            return redirect()->route('user.client.dashboard')
                             ->with('info', 'You are already subscribed.');
        }

        return view('web.client.subscription'); // Make sure this Blade exists
    }
}
