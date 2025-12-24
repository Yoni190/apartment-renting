<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Apartment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// update user profile (name, email, phone, optional password)
Route::middleware('auth:sanctum')->patch('/user', function (Request $request) {
    $user = $request->user();

    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        'phone_number' => ['nullable', 'string', 'max:30'],
        'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        'current_password' => ['required_with:password']
    ]);

    // if changing password, verify current password
    if ($request->filled('password')) {
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }
        $user->password = Hash::make($request->password);
    }

    $user->name = $request->name;
    $user->email = $request->email;
    if ($request->filled('phone_number')) {
        $user->phone_number = $request->phone_number;
    }

    $user->save();

    return $user;
});

// delete authenticated user
Route::middleware('auth:sanctum')->delete('/user', function (Request $request) {
    $user = $request->user();
    // revoke tokens
    $user->tokens()->delete();
    $user->delete();
    return response()->json(['message' => 'User deleted']);
});

Route::get('/apartment-list', function () {
    $apartments = Apartment::all();

    $apartments->load('images');

    return $apartments;
});

// get single apartment details
Route::get('/apartments/{apartment}', function (Apartment $apartment) {
    $apartment->load('images');
    return $apartment;
});

// get apartments for authenticated owner
Route::middleware('auth:sanctum')->get('/my-apartments', function (Request $request) {
    $user = $request->user();
    $apartments = Apartment::where('user_id', $user->id)->get();
    $apartments->load('images');
    return $apartments;
});

// create a new apartment (owner) - accepts multipart/form-data including images
Route::middleware('auth:sanctum')->post('/apartments', function (Request $request) {
    $user = $request->user();

    // Basic validation for core fields; additional fields are stored in `meta` JSON
    $request->validate([
        'title' => ['required', 'string', 'max:255'],
        'address' => ['nullable', 'string', 'max:255'],
        'price' => ['nullable', 'string', 'max:100'],
        'description' => ['nullable', 'string'],
        'bedrooms' => ['nullable', 'integer'],
        'bathrooms' => ['nullable', 'integer'],
        'size' => ['nullable', 'numeric'],
        'images.*' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
    ]);

    // Prepare apartment payload
    $apartmentData = [
        'title' => $request->input('title'),
        'address' => $request->input('address'),
        'price' => $request->input('price'),
        'description' => $request->input('description'),
        'bedrooms' => $request->input('bedrooms') ?? 1,
        'bathrooms' => $request->input('bathrooms') ?? 1,
        'size' => $request->input('size'),
        'user_id' => $user->id,
        'status' => 1,
    ];

    // Capture any extra fields into meta (utilities, amenities, deposit, open_for_tour, location, etc.)
    $known = array_keys($apartmentData);
    $meta = $request->except($known);
    // Remove uploaded files from meta if present
    if ($request->hasFile('images')) {
        unset($meta['images']);
    }

    if (!empty($meta)) {
        $apartmentData['meta'] = $meta;
    }

    $apartment = Apartment::create($apartmentData);

    // Handle image uploads and persist to storage + apartment_images table
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $image) {
            $filename = 'apartment_' . $apartment->id . '_' . time() . '_' . ($index + 1) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('apartments', $filename, 'public');

            // create ApartmentImage record
            \App\Models\ApartmentImage::create([
                'apartment_id' => $apartment->id,
                'path' => $imagePath,
            ]);
        }
    }

    $apartment->load('images');

    return response()->json($apartment, 201);
});


Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if( !$user || ! Hash::check($request->password, $user->password)){
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return $user->createToken($request->device_name)->plainTextToken;
});


Route::post('/register', function(Request $request) {
    logger($request->role);
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
        'device_name' => ['required'],
        'role' => ['required'],
        'fan' => ['required'],
        'phone_number' => ['nullable', 'string', 'max:30']
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
        'fan' => $request->fan,
        'phone_number' => $request->phone_number
    ]);


    return response()->json([
        'token' => $user->createToken($request->device_name)->plainTextToken
    ]);
});