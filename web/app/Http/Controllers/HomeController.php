<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
use App\Models\TourBooking;

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
            'role' => 0,
            'status' => 1
        ]);

        Auth::login($user);

        return redirect()->route('owner.dashboard')
        ->with('success', 'Account Created Successfully');

    }

    public function loginView() {
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

    public function about() {
        return view('web.about');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
            'status' => 1,
        ];

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();


            if(Auth::user()->role === 1) {
                return redirect()->route('user.client.home')
                            ->with('success', 'Logged in successfully!');
            } else {
                return redirect()->route('owner.dashboard')
                            ->with('success', 'Logged in successfully!');
            }

            
        }

        return back()->with('error', 'The provided credentials do not match our records.');
    }

    public function favorites() {
        $user = Auth::user();

        $favorites = $user->favorites()->with('apartment')->latest()->get();

        return view('web.client.favorites', compact('favorites'));
    }

    public function destroyFavorite($id)
    {
        $user = Auth::user();

        $favorite = $user->favorites()->where('id', $id)->firstOrFail();

        $favorite->delete();

        return redirect()->back()->with('success', 'Removed from favorites.');
    }

    public function storeFavorite(Request $request)
    {
        $user = Auth::user();

        $exists = Favorite::where('user_id', $user->id)
            ->where('apartment_id', $request->apartment_id)
            ->exists();

        if (!$exists) {
            Favorite::create([
                'user_id' => $user->id,
                'apartment_id' => $request->apartment_id,
            ]);
        }

        return back()->with('success', 'Listing saved to favorites.');
    }

    public function tours()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $tours = TourBooking::with('listing')
            ->where('user_id', $user->id)
            ->latest('scheduled_at')
            ->get();

        return view('web.client.tours', compact('tours'));
    }

    public function apartments(Request $request)
    {
        $search = $request->query('search');

        $apartments = Apartment::with('mainImage')
            ->withAvg('reviews', 'rating')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->where('status', 1)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return view('web.client.apartments', compact('apartments', 'search'));
    }
}
