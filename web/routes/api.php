<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Apartment;
use App\Models\ListingOpenHour;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;
use App\Services\RecommendationService;
// Helper: normalize common meta fields so clients receive consistent shapes
// e.g. amenities, utilities may be sent as JSON strings or comma lists — store as arrays
function normalizeMetaFields(array $meta): array {
    // Normalize amenities and utilities to arrays
    foreach (['amenities', 'utilities'] as $k) {
        if (array_key_exists($k, $meta)) {
            $v = $meta[$k];
            if (is_string($v)) {
                $s = trim($v);
                // try JSON decode
                $decoded = null;
                try { $decoded = json_decode($s, true); } catch (\Exception $e) { $decoded = null; }
                if (is_array($decoded)) {
                    $meta[$k] = array_values(array_filter(array_map('strval', $decoded)));
                } else {
                    // split by comma or newline
                    $parts = preg_split('/\r?\n|,/', $s);
                    $parts = array_map('trim', $parts);
                    $parts = array_values(array_filter($parts, fn($x) => $x !== ''));
                    $meta[$k] = $parts;
                }
            } elseif (is_array($v)) {
                $meta[$k] = array_values(array_filter(array_map('strval', $v)));
            } else {
                // other types -> cast to string and split
                $meta[$k] = [strval($v)];
            }
        }
    }

    // Normalize location JSON strings to arrays/objects
    if (array_key_exists('location', $meta) && is_string($meta['location'])) {
        try {
            $decoded = json_decode($meta['location'], true);
            if (is_array($decoded)) $meta['location'] = $decoded;
        } catch (\Exception $e) {
            // leave as-is
        }
    }

    // Normalize open_for_tour
    if (array_key_exists('open_for_tour', $meta) && is_string($meta['open_for_tour'])) {
        try {
            $decoded = json_decode($meta['open_for_tour'], true);
            if (is_array($decoded)) $meta['open_for_tour'] = $decoded;
        } catch (\Exception $e) {
            // leave
        }
    }

    return $meta;
}


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

Route::get('/apartment-list', function (Request $request) {
    // Only return active and admin-approved listings for clients
    $apartments = Apartment::where('status', 1)
        ->where('verification_status', 'approved')
        ->get();

    $apartments->load('images');
    
    // Check if authenticated user has favorited each apartment
    $token = $request->bearerToken();
    if ($token) {
        try {
            $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;
            if ($user) {
                $favoriteIds = DB::table('favorites')
                    ->where('user_id', $user->id)
                    ->pluck('apartment_id')
                    ->toArray();
                
                foreach ($apartments as $apartment) {
                    $apartment->is_favorite = in_array($apartment->id, $favoriteIds);
                }
            }
        } catch (\Exception $e) {
            // Ignore token errors
        }
    }

    return $apartments;
});

// get single apartment details
Route::get('/apartments/{apartment}', function (Request $request, Apartment $apartment) {
    // Check if listing is active and user permissions
    $token = $request->bearerToken();
    $user = null;
    $isOwner = false;
    
    if ($token) {
        try {
            $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;
            if ($user) {
                // Allow owners to view their own listings even if inactive
                $isOwner = $apartment->user_id === $user->id;
            }
        } catch (\Exception $e) {
            // Ignore token errors
        }
    }
    
    // If listing is inactive and user is not the owner, return 404
    if ($apartment->status != 1 && !$isOwner) {
        return response()->json(['message' => 'Listing not found or unavailable'], 404);
    }
    
    $apartment->load('images', 'owner');
    
    // Check if authenticated user has favorited this apartment
    if ($user) {
        $apartment->is_favorite = DB::table('favorites')
            ->where('user_id', $user->id)
            ->where('apartment_id', $apartment->id)
            ->exists();
    } else {
        $apartment->is_favorite = false;
    }
    
    return $apartment;
});

// get apartments for authenticated owner
Route::middleware('auth:sanctum')->get('/my-apartments', function (Request $request) {
    $user = $request->user();
    // Return all listings belonging to the authenticated user. Do NOT filter by
    // verification_status here — owners should see pending / rejected / approved.
    $apartments = Apartment::where('user_id', $user->id)->with('images')->get();

    // Ensure the client receives verification_status and rejection_reason.
    // The Apartment model exposes rejection_reason (from column or meta) via an accessor.
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
        // mark new listings as pending verification for admin review
        'verification_status' => 'pending',
    ];

    // Capture any extra fields into meta (utilities, amenities, deposit, open_for_tour, location, etc.)
    $known = array_keys($apartmentData);
    $meta = $request->except($known);
    // Remove uploaded files from meta if present
    if ($request->hasFile('images')) {
        unset($meta['images']);
    }

    // Normalize common meta fields for consistent client consumption
    if (!empty($meta)) {
        $meta = normalizeMetaFields($meta);
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

    // If owner provided open_for_tour metadata, create listing_open_hours entries.
    // Expected shape: open_for_tour: { date_from, date_to, time_from, time_to }
    if (!empty($meta['open_for_tour'])) {
        $oft = $meta['open_for_tour'];
        if (is_string($oft)) {
            $oft = json_decode($oft, true);
        }
        if (is_array($oft)) {
            $timeFrom = $oft['time_from'] ?? null;
            $timeTo = $oft['time_to'] ?? null;
            $dateFrom = $oft['date_from'] ?? null;
            $dateTo = $oft['date_to'] ?? null;

            // Server-side validation: only allow dates from today onward and reject past times
            try {
                $today = \Carbon\Carbon::today();
                if ($dateFrom) {
                    $dFrom = \Carbon\Carbon::parse($dateFrom)->startOfDay();
                    if ($dFrom->lt($today)) {
                        return response()->json(['message' => 'open_for_tour.date_from must be today or a future date'], 422);
                    }
                }
                if ($dateTo) {
                    $dTo = \Carbon\Carbon::parse($dateTo)->startOfDay();
                    if ($dTo->lt($today)) {
                        return response()->json(['message' => 'open_for_tour.date_to must be today or a future date'], 422);
                    }
                }
                if ($dateFrom && $dateTo) {
                    $dFrom = \Carbon\Carbon::parse($dateFrom)->startOfDay();
                    $dTo = \Carbon\Carbon::parse($dateTo)->startOfDay();
                    if ($dTo->lt($dFrom)) {
                        return response()->json(['message' => 'open_for_tour.date_to must be the same or after date_from'], 422);
                    }
                }
            } catch (\Exception $e) {
                // ignore parse errors here; will handle downstream
            }

            if ($timeFrom && $timeTo) {
                // normalize to HH:MM:SS
                $fmtTimeFrom = strlen($timeFrom) === 5 ? $timeFrom . ':00' : $timeFrom;
                $fmtTimeTo = strlen($timeTo) === 5 ? $timeTo . ':00' : $timeTo;

                // if the owner provided an explicit date range starting today, ensure the provided start time isn't already past
                try {
                    if ($dateFrom) {
                        $startDateTime = \Carbon\Carbon::parse($dateFrom . ' ' . $fmtTimeFrom);
                        if ($startDateTime->lt(\Carbon\Carbon::now())) {
                            return response()->json(['message' => 'open_for_tour.time_from for the starting date must not be in the past'], 422);
                        }
                    }
                } catch (\Exception $e) {
                    // ignore parse failure
                }

                $days = [];
                if ($dateFrom && $dateTo) {
                    try {
                        $start = Carbon::parse($dateFrom);
                        $end = Carbon::parse($dateTo);
                        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                            $days[] = $d->dayOfWeek;
                        }
                        $days = array_values(array_unique($days));
                    } catch (\Exception $e) {
                        // fallback: make available all days
                        $days = range(0,6);
                    }
                } else {
                    // if no dates provided, assume owner meant all days of the week
                    $days = range(0,6);
                }

                foreach ($days as $dow) {
                    $exists = ListingOpenHour::where('listing_id', $apartment->id)
                        ->where('day_of_week', $dow)
                        ->where('start_time', $fmtTimeFrom)
                        ->where('end_time', $fmtTimeTo)
                        ->exists();
                    if (!$exists) {
                        ListingOpenHour::create([
                            'listing_id' => $apartment->id,
                            'day_of_week' => $dow,
                            'start_time' => $fmtTimeFrom,
                            'end_time' => $fmtTimeTo,
                        ]);
                    }
                }
            }
        }
    }

    $apartment->load('images');

    // Return a friendly message to the owner — listing is visible to owner but pending admin verification
    // Also return the created apartment payload so existing owner UI (mobile/web) that expects the created
    // apartment can continue to function without changes.
    return response()->json([
        'message' => 'Listing submitted and awaiting admin verification.',
        'apartment' => $apartment
    ], 201);
});

// Update an apartment (owner)
Route::middleware('auth:sanctum')->patch('/apartments/{apartment}', function (Request $request, Apartment $apartment) {
    $user = $request->user();
    if (!$user || $apartment->user_id !== $user->id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $data = $request->only(['title','address','price','description','bedrooms','bathrooms','size','property_type','purpose','floor','furnishing','available_from','min_stay','contact_phone','contact_method']);

    // merge meta fields if provided
    $meta = $apartment->meta ?? [];
    $incomingMeta = $request->input('meta', []);
    if (is_string($incomingMeta)) {
        try { $incomingMeta = json_decode($incomingMeta, true) ?? []; } catch (\Exception $e) { $incomingMeta = []; }
    }
    $meta = array_merge($meta, $incomingMeta ?: []);
    // normalize incoming meta so amenities/utilities are arrays etc.
    $meta = normalizeMetaFields($meta);

    // Server-side validation for open_for_tour in updates as well
    if (!empty($meta['open_for_tour'])) {
        $oft = $meta['open_for_tour'];
        if (is_string($oft)) {
            $oft = json_decode($oft, true) ?: [];
        }
        if (is_array($oft)) {
            $dateFrom = $oft['date_from'] ?? null;
            $dateTo = $oft['date_to'] ?? null;
            $timeFrom = $oft['time_from'] ?? null;

            try {
                $today = \Carbon\Carbon::today();
                if ($dateFrom) {
                    $dFrom = \Carbon\Carbon::parse($dateFrom)->startOfDay();
                    if ($dFrom->lt($today)) {
                        return response()->json(['message' => 'open_for_tour.date_from must be today or a future date'], 422);
                    }
                }
                if ($dateTo) {
                    $dTo = \Carbon\Carbon::parse($dateTo)->startOfDay();
                    if ($dTo->lt($today)) {
                        return response()->json(['message' => 'open_for_tour.date_to must be today or a future date'], 422);
                    }
                }
                if ($dateFrom && $dateTo) {
                    $dFrom = \Carbon\Carbon::parse($dateFrom)->startOfDay();
                    $dTo = \Carbon\Carbon::parse($dateTo)->startOfDay();
                    if ($dTo->lt($dFrom)) {
                        return response()->json(['message' => 'open_for_tour.date_to must be the same or after date_from'], 422);
                    }
                }
                if ($timeFrom && $dateFrom) {
                    $fmtTimeFrom = strlen($timeFrom) === 5 ? $timeFrom . ':00' : $timeFrom;
                    $startDateTime = \Carbon\Carbon::parse($dateFrom . ' ' . $fmtTimeFrom);
                    if ($startDateTime->lt(\Carbon\Carbon::now())) {
                        return response()->json(['message' => 'open_for_tour.time_from for the starting date must not be in the past'], 422);
                    }
                }
            } catch (\Exception $e) {
                // ignore parse errors; downstream code may handle
            }
        }
    }

    if (!empty($meta)) $data['meta'] = $meta;

    // Determine if this apartment was previously approved by admin
    $wasPreviouslyApproved = $apartment->verification_status === 'approved';

    $apartment->fill($data);
    $apartment->save();

    // If it was approved before, reset verification state so admin re-verifies the update
    if ($wasPreviouslyApproved) {
        $apartment->verification_status = 'pending';
        $apartment->verified_at = null;
        $apartment->verified_by = null;
        // Do not modify images or other fields
        $apartment->save();
    }

    // Return a friendly message plus the apartment payload so owner UI can continue to function
    return response()->json([
        'message' => 'Listing Update submitted and awaiting admin verification.',
        'apartment' => $apartment->fresh()->load('images')
    ]);
});

// Delete an apartment (owner)
Route::middleware('auth:sanctum')->delete('/apartments/{apartment}', function (Request $request, Apartment $apartment) {
    $user = $request->user();
    if (!$user || $apartment->user_id !== $user->id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    // Remove images (DB records). Storage cleanup left to a later pass.
    try {
        \App\Models\ApartmentImage::where('apartment_id', $apartment->id)->delete();
    } catch (\Exception $e) {
        // ignore
    }

    $apartment->delete();
    return response()->json(['message' => 'Deleted']);
});

// Deactivate / set status for an apartment (owner)
Route::middleware('auth:sanctum')->post('/apartments/{apartment}/deactivate', function (Request $request, Apartment $apartment) {
    $user = $request->user();
    if (!$user || $apartment->user_id !== $user->id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    $active = $request->input('active');
    $apartment->status = $active ? 1 : 0;
    $apartment->save();
    return response()->json(['message' => 'Status updated', 'status' => $apartment->status]);
});


Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
        'role' => 'required|in:0,1'
    ]);

    $user = User::where('email', $request->email)->first();

    if( !$user || ! Hash::check($request->password, $user->password)){
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    // Role mismatch
    if ((int) $user->role !== (int) $request->role) {
        return response()->json([
            'message' => 'You are not allowed to login with this role.'
        ], 403);
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

// Favorites endpoints
Route::middleware('auth:sanctum')->post('/apartments/{apartment}/favorite', function (Request $request, Apartment $apartment) {
    $user = $request->user();
    
    $exists = DB::table('favorites')
        ->where('user_id', $user->id)
        ->where('apartment_id', $apartment->id)
        ->exists();
    
    if ($exists) {
        return response()->json(['message' => 'Already favorited'], 400);
    }
    
    DB::table('favorites')->insert([
        'user_id' => $user->id,
        'apartment_id' => $apartment->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    return response()->json(['message' => 'Added to favorites', 'favorited' => true]);
});

Route::middleware('auth:sanctum')->delete('/apartments/{apartment}/favorite', function (Request $request, Apartment $apartment) {
    $user = $request->user();
    
    DB::table('favorites')
        ->where('user_id', $user->id)
        ->where('apartment_id', $apartment->id)
        ->delete();
    
    return response()->json(['message' => 'Removed from favorites', 'favorited' => false]);
});

Route::middleware('auth:sanctum')->get('/favorites', function (Request $request) {
    $user = $request->user();
    
    $favoriteIds = DB::table('favorites')
        ->where('user_id', $user->id)
        ->pluck('apartment_id');
    
    // Only return active favorites (status = 1)
    $apartments = Apartment::whereIn('id', $favoriteIds)
        ->where('status', 1)
        ->with('images', 'owner')
        ->get();
    
    return $apartments;
});

// Tour booking API (mobile clients)
Route::get('/apartments/{apartment}/open-hours', [App\Http\Controllers\Api\TourBookingApiController::class, 'openHours']);
Route::middleware('auth:sanctum')->post('/apartments/{apartment}/book-tour', [App\Http\Controllers\Api\TourBookingApiController::class, 'store']);
// Owner bookings (authenticated)
Route::middleware('auth:sanctum')->get('/owner/bookings', [App\Http\Controllers\Api\TourBookingApiController::class, 'ownerBookings']);
// Client bookings (authenticated) - list tours requested by the authenticated user
Route::middleware('auth:sanctum')->get('/my-tours', [App\Http\Controllers\Api\TourBookingApiController::class, 'clientBookings']);
// Update booking status (owner only) - expects { status: 'approved'|'rejected'|'pending' }
Route::middleware('auth:sanctum')->patch('/tour-bookings/{booking}', [App\Http\Controllers\Api\TourBookingApiController::class, 'updateStatus']);

// Recommendations endpoint
Route::get('/recommendations', function (Request $request) {
    $filters = $request->only(['location','min_price','max_price','bedrooms','property_type','furnished','limit']);

    $token = $request->bearerToken();
    $user = null;
    if ($token) {
        try {
            $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;
        } catch (\Exception $e) {
            // ignore
        }
    }

    $service = new RecommendationService();
    $results = $service->recommend($filters, $user);

    // Only return owner-provided fields (do not fabricate data). We already eager-loaded images/owner.
    return response()->json($results);
});