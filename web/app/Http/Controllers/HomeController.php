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

        $featuredApartments->load('images');
        
        return view('web.home', compact('featuredApartments'));
    }

    public function home() {
        $featuredApartments = Apartment::where('is_featured', 1)->take(6)->get();

        $featuredApartments->load('images');
        return view('web.client.home', compact('featuredApartments'));
    }

    public function registerView() {
        return view('web.client.register');
    }

    public function ownerRegisterView() {
        return view('web.owner.register');
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
            'role' => 1,
            'status' => 1
        ]);

        Auth::login($user);

        return redirect()->route('user.client.home')
        ->with('success', 'Account created successfully!');
    }

    public function ownerRegister(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'telNo' => 'required|unique:users,phone_number',
            'fan' => 'required|unique:users,fan',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->telNo,
            'fan' => $request->fan,
            'password' => Hash::make($request->password),
            'role' => 1,
            'status' => 1
        ]);

        return redirect()->route('owner.dashboard')
        ->with('success', 'Account Created Successfully');

    }

    public function login() {
        return view('web.client.login');
    }

    public function logout(Request $request) {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Logged out successfully');
    }

    public function apartmentDetails(Apartment $apartment) {
        return view('web.client.apartment-details', compact('apartment'));
    }

    public function profile() {
        return view('web.client.profile');
    }

    public function editProfileView() {
        return view('web.client.edit-profile');
    }

    public function editProfile(Request $request)
    {
        $user = auth()->user();

        $validatedData = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user->update($validatedData);

        return redirect()->route('user.client.profile')->with('success', 'Profile updated successfully!');
    }
}
