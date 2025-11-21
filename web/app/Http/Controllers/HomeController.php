<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index() {
        $featuredApartments = Apartment::where('is_featured', 1)->take(6)->get();
        return view('web.client.home', compact('featuredApartments'));
    }

    public function home() {
        $featuredApartments = Apartment::where('is_featured', 1)->take(6)->get();
        return view('web.client.renter.home', compact('featuredApartments'));
    }

    public function registerView() {
        return view('web.client.renter.register');
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'telNo' => 'required|unique:users,phone_number',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->telNo,
            'password' => Hash::make($request->password),
            'role' => 0,
            'status' => 1
        ]);

        Auth::login($user);

        return redirect()->route('user.renter.home')
        ->with('success', 'Account created successfully!');
    }

    public function login() {
        return view('web.client.renter.login');
    }

    public function logout(Request $request) {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Logged out successfully');
    }
}
