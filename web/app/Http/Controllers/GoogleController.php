<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirect(Request $request) {

        session(['google_role' => $request->role]);

        return Socialite::driver('google')->redirect();
    }

    public function callback() {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $role = session('google_role', 1);

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => bcrypt(str()->random(16)),
                'phone_number' => null,
                'role' => $role
            ]
            );

        Auth::login($user);
        
        if ($role === 1) {
            return redirect()->route('user.client.home');
        } else {
            return redirect()->route('owner.dashboard');
        }
        
    }
}
