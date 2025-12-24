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

// get apartments for authenticated owner
Route::middleware('auth:sanctum')->get('/my-apartments', function (Request $request) {
    $user = $request->user();
    $apartments = Apartment::where('user_id', $user->id)->get();
    $apartments->load('images');
    return $apartments;
});

// create a new apartment (owner)
Route::middleware('auth:sanctum')->post('/apartments', function (Request $request) {
    $user = $request->user();

    $request->validate([
        'title' => ['required', 'string', 'max:255'],
        'address' => ['nullable', 'string', 'max:255'],
        'price' => ['nullable', 'string', 'max:100'],
        'description' => ['nullable', 'string'],
    ]);

    $apartment = Apartment::create([
        'title' => $request->title,
        'address' => $request->address,
        'price' => $request->price,
        'description' => $request->description,
        'user_id' => $user->id,
        // database column `status` is a tinyInteger; store numeric status (1 = active)
        'status' => 1
    ]);

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