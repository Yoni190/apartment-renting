<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\ApartmentImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Notifications\ListingApproved;
use App\Notifications\ListingRejected;
use App\Notifications\ListingMoreInfoRequested;
use App\Models\ApartmentVerificationDocument;
use Illuminate\Support\Facades\Auth;
use App\Models\Log as LogModel;


class ApartmentController extends Controller
{
    function index(Request $request) {
        try {
            $query = Apartment::query();
            
            // Filter by verification status if provided
            if($request->filled('verification_status')) {
                $query->where('verification_status', $request->verification_status);
            }


        if($request->filled('owner')) {
            $query->whereHas('owner', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->owner . '%');
            });
        }

        if($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if($request->filled('address')) {
            $query->where('address', 'like', '%' . $request->address . '%');
        }

        if($request->filled('bedrooms')) {
            $query->where('bedrooms', 'like', '%' . $request->bedrooms . '%');
        }

        if($request->filled('bathrooms')) {
            $query->where('bathrooms', 'like', '%' . $request->bathrooms . '%');
        }

        if ($request->min_price !== null) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price !== null) {
            $query->where('price', '<=', $request->max_price);
        }
        
        if ($request->min_size !== null) {
            $query->where('size', '>=', $request->min_size);
        }

        if ($request->max_size !== null) {
            $query->where('size', '<=', $request->max_size);
        }



        if($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Get max values before pagination
        $max_price_query = clone $query;
        $max_price = $request->max_price ? $request->max_price : ($max_price_query->max('price') ?? 1000000);
        
        $max_size_query = clone $query;
        $max_size = $request->max_size ? $request->max_size : ($max_size_query->max('size') ?? 1000);

        $apartments = $query->with(['images', 'owner'])
            ->whereNotNull('user_id')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        

            return view('web.admin.apartment.apartments', compact('apartments', 'max_price', 'max_size'));
        } catch (\Exception $e) {
            Log::error('Admin apartments index error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            // Return an empty paginator to keep the view happy instead of calling paginate() on a collection
            $emptyPaginator = new \Illuminate\Pagination\LengthAwarePaginator([], 0, 10);
            return view('web.admin.apartment.apartments', [
                'apartments' => $emptyPaginator,
                'max_price' => 1000000,
                'max_size' => 1000,
                // provide a load_error variable to the view instead of chaining withErrors
                'load_error' => 'Error loading apartments: ' . $e->getMessage(),
                ]);
        }
    }

    public function toggleStatus(Apartment $apartment){
        $apartment->status = $apartment->status === 1 ? 0 : 1;
        $apartment->save();

        return redirect()->back()->with('message', $apartment->title . "'s status updated successfully");
    }

    public function toggleFeatured(Apartment $apartment) {
        $apartment->is_featured = $apartment->is_featured === 1 ? 0 : 1;
        $apartment->save();

        return redirect()->back()->with('message', $apartment->title . "'s featured status updated successfully");
    }

    public function approve(Apartment $apartment) {
        $apartment->verification_status = 'approved';
        $apartment->verified_at = now();
        // verified_by column references users.id in the schema. Admins are stored
        // in a separate `admins` table, so writing the admin id here causes a
        // foreign key violation. Instead, keep the DB FK untouched (set null)
        // and record the approving admin inside the apartment meta for audit.
        $apartment->verified_by = null;
        $admin = auth('admin')->user();
        if ($admin) {
            $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
            $meta['verified_by_admin'] = [
                'id' => $admin->id,
                'name' => $admin->name ?? null,
                'email' => $admin->email ?? null,
            ];
            $apartment->meta = $meta;
        }
        $apartment->rejection_reason = null;
        $apartment->save();

        // Notify owner (non-blocking)
        try {
            if ($apartment->owner) {
                $apartment->owner->notify(new ListingApproved($apartment));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send listing approved notification: ' . $e->getMessage());
        }

        return redirect()->back()->with('message', $apartment->title . ' has been approved');
    }

    public function reject(Request $request, Apartment $apartment) {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000'
        ]);

        $apartment->verification_status = 'rejected';
        $apartment->verified_at = now();
        // see note in approve(): do not write admin id into verified_by (FK -> users)
        $apartment->verified_by = null;
        $apartment->rejection_reason = $request->input('rejection_reason');
        $admin = auth('admin')->user();
        if ($admin) {
            $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
            $meta['verified_by_admin'] = [
                'id' => $admin->id,
                'name' => $admin->name ?? null,
                'email' => $admin->email ?? null,
            ];
            $apartment->meta = $meta;
        }
        $apartment->save();

        // Notify owner (non-blocking) including rejection reason
        try {
            if ($apartment->owner) {
                $apartment->owner->notify(new ListingRejected($apartment, $apartment->rejection_reason));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send listing rejected notification: ' . $e->getMessage());
        }

        return redirect()->back()->with('message', $apartment->title . ' has been rejected');
    }

    /**
     * Admin requests more info from owner about a listing.
     * This will send a notification to the owner with the admin message.
     */
    public function requestMoreInfo(Request $request, Apartment $apartment)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $msg = $request->input('message');

        try {
            if ($apartment->owner) {
                $apartment->owner->notify(new ListingMoreInfoRequested($apartment, $msg, auth('admin')->id()));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send listing more-info notification: ' . $e->getMessage());
        }

        return redirect()->back()->with('message', 'Request for more information sent to owner.');
    }

    public function addApartmentView() {
        $users = User::all();
        return  view('web.admin.apartment.add-apartment', compact('users'));
    }

    /**
     * Show full apartment details to admin including verification information.
     */
    public function show(Apartment $apartment)
    {
        // Eager load related data useful for admin review
        $apartment->load(['images', 'owner', 'openHours', 'bookings']);

        // Load verification documents grouped by type (latest per type)
        $docsRaw = ApartmentVerificationDocument::where('apartment_id', $apartment->id)->orderBy('created_at', 'desc')->get();
        $docsByType = [];
        foreach ($docsRaw as $d) {
            if (!array_key_exists($d->document_type, $docsByType)) {
                $ext = pathinfo($d->file_path, PATHINFO_EXTENSION);
                $mime = null;
                $fullPathCandidates = [
                    storage_path('app/' . ltrim($d->file_path, '/')),
                    storage_path('app/public/' . ltrim($d->file_path, '/')),
                ];
                foreach ($fullPathCandidates as $fp) {
                    if (file_exists($fp)) { $mime = @mime_content_type($fp) ?: null; break; }
                }
                $docsByType[$d->document_type] = [
                    'model' => $d,
                    'extension' => strtolower($ext),
                    'mime' => $mime,
                ];
            }
        }

        // Normalize common legacy document_type keys to the canonical names (same logic as show())
        $aliases = [
            'authorization_letter' => 'rental_authorization_letter',
            'authorization' => 'rental_authorization_letter',
            'ownership_doc' => 'ownership_certificate',
            'ownership' => 'ownership_certificate',
            'agent_id' => 'agent_authorization_letter',
            'nationalid' => 'national_id',
        ];
        $normalized = [];
        foreach ($docsByType as $k => $v) {
            $canonical = $aliases[$k] ?? $k;
            if (!array_key_exists($canonical, $normalized)) {
                $normalized[$canonical] = $v;
            }
        }
        $expected = ['national_id','ownership_certificate','utility_bill','rental_authorization_letter','agent_authorization_letter'];
        foreach ($expected as $key) {
            if (!array_key_exists($key, $normalized)) $normalized[$key] = null;
        }
        $docsByType = $normalized;

        // Normalize common legacy document_type keys to the canonical names
        $aliases = [
            'authorization_letter' => 'rental_authorization_letter',
            'authorization' => 'rental_authorization_letter',
            'ownership_doc' => 'ownership_certificate',
            'ownership' => 'ownership_certificate',
            'agent_id' => 'agent_authorization_letter',
            'nationalid' => 'national_id',
        ];

        $normalized = [];
        foreach ($docsByType as $k => $v) {
            $canonical = $aliases[$k] ?? $k;
            if (!array_key_exists($canonical, $normalized)) {
                $normalized[$canonical] = $v;
            }
        }

        // Ensure expected canonical keys exist (null when missing) so the view can rely on them
        $expected = ['national_id','ownership_certificate','utility_bill','rental_authorization_letter','agent_authorization_letter'];
        foreach ($expected as $key) {
            if (!array_key_exists($key, $normalized)) $normalized[$key] = null;
        }

        $docsByType = $normalized;

        // Also include any verification documents stored inside apartment meta (legacy shape)
        $metaDocs = $apartment->meta['verification']['documents'] ?? ($apartment->meta['verification_documents'] ?? null);
        if (is_array($metaDocs)) {
            foreach ($metaDocs as $mk => $mpath) {
                $canonical = $aliases[$mk] ?? $mk;
                if (empty($normalized[$canonical])) {
                    // try to resolve mime for the stored path
                    $mime = null;
                    $fullPathCandidates = [
                        storage_path('app/' . ltrim($mpath, '/')),
                        storage_path('app/public/' . ltrim($mpath, '/')),
                    ];
                    foreach ($fullPathCandidates as $fp) {
                        if (file_exists($fp)) { $mime = @mime_content_type($fp) ?: null; break; }
                    }
                    $normalized[$canonical] = [
                        'model' => null,
                        'meta_path' => $mpath,
                        'extension' => strtolower(pathinfo($mpath, PATHINFO_EXTENSION)),
                        'mime' => $mime,
                    ];
                }
            }
        }

        $docsByType = $normalized;

        return view('web.admin.apartment.show-apartment', compact('apartment', 'docsByType'));
    }

    public function editApartmentView(Apartment $apartment) {
        $apartment->load('images');

        // Load verification documents to prefill the edit form
        $docsRaw = \App\Models\ApartmentVerificationDocument::where('apartment_id', $apartment->id)->orderBy('created_at','desc')->get();
        $docsByType = [];
        foreach ($docsRaw as $d) {
            if (!array_key_exists($d->document_type, $docsByType)) {
                $ext = pathinfo($d->file_path, PATHINFO_EXTENSION);
                $mime = null;
                $fullPath = storage_path('app/' . $d->file_path);
                if (file_exists($fullPath)) {
                    $mime = @mime_content_type($fullPath) ?: null;
                }
                $docsByType[$d->document_type] = [
                    'model' => $d,
                    'extension' => strtolower($ext),
                    'mime' => $mime,
                ];
            }
        }

        // Normalize legacy keys and include meta-stored docs (same logic as show())
        $aliases = [
            'authorization_letter' => 'rental_authorization_letter',
            'authorization' => 'rental_authorization_letter',
            'ownership_doc' => 'ownership_certificate',
            'ownership' => 'ownership_certificate',
            'agent_id' => 'agent_authorization_letter',
            'nationalid' => 'national_id',
        ];
        $normalized = [];
        foreach ($docsByType as $k => $v) {
            $canonical = $aliases[$k] ?? $k;
            if (!array_key_exists($canonical, $normalized)) {
                $normalized[$canonical] = $v;
            }
        }
        // include meta docs
        $metaDocs = $apartment->meta['verification']['documents'] ?? ($apartment->meta['verification_documents'] ?? null);
        if (is_array($metaDocs)) {
            foreach ($metaDocs as $mk => $mpath) {
                $canonical = $aliases[$mk] ?? $mk;
                if (empty($normalized[$canonical])) {
                    $mime = null;
                    $fullPath = storage_path('app/' . ltrim($mpath, '/'));
                    if (file_exists($fullPath)) {
                        $mime = @mime_content_type($fullPath) ?: null;
                    }
                    $normalized[$canonical] = [
                        'model' => null,
                        'meta_path' => $mpath,
                        'extension' => strtolower(pathinfo($mpath, PATHINFO_EXTENSION)),
                        'mime' => $mime,
                    ];
                }
            }
        }
        $expected = ['national_id','ownership_certificate','utility_bill','rental_authorization_letter','agent_authorization_letter'];
        foreach ($expected as $key) {
            if (!array_key_exists($key, $normalized)) $normalized[$key] = null;
        }
        $docsByType = $normalized;

        $users = User::all();
        return  view('web.admin.apartment.edit-apartment', compact('apartment', 'users','docsByType'));
    }

    public function editApartment(Request $request, Apartment $apartment) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'size' => 'nullable|numeric|min:0',
            'owner' => 'required|exists:users,id',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            // verification fields
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:50',
            'is_agent' => 'nullable',
            'national_id' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'ownership_certificate' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'utility_bill' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'rental_authorization_letter' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'agent_authorization_letter' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
        ]);

        // Capture previous verification status so we can reset verification fields
        $wasPreviouslyApproved = $apartment->verification_status === 'approved';

        // Preserve the initial verification data (one-time snapshot) so we
        // can compare before/after owner edits. Store under meta.verification.previous
        // but only if a snapshot doesn't already exist (we keep the first values).
        $currentMeta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
        $currentMeta['verification'] = $currentMeta['verification'] ?? [];
        if (empty($currentMeta['verification']['previous'])) {
            // Build a snapshot of the non-file verification fields
            $snapshot = [
                'captured_at' => now()->toDateTimeString(),
                'owner_name' => $currentMeta['owner_name'] ?? null,
                'owner_phone' => $currentMeta['owner_phone'] ?? null,
                'is_agent' => $currentMeta['is_agent'] ?? null,
                'agent_id' => $currentMeta['verification']['agent_id'] ?? null,
                'agent_phone' => $currentMeta['verification']['agent_phone'] ?? null,
                'verification' => $currentMeta['verification'] ?? null,
                'documents' => [],
            ];

            // Include any persisted verification documents from the DB (latest per type)
            try {
                $docs = ApartmentVerificationDocument::where('apartment_id', $apartment->id)->orderBy('created_at','desc')->get();
                foreach ($docs as $d) {
                    if (!array_key_exists($d->document_type, $snapshot['documents'])) {
                        $snapshot['documents'][$d->document_type] = $d->file_path;
                    }
                }
            } catch (\Exception $e) {
                // don't block the edit if docs can't be read; log for diagnosis
                Log::warning('Failed to snapshot verification documents for apartment ' . $apartment->id . ': ' . $e->getMessage());
            }

            // Also include any legacy meta-stored document paths
            if (!empty($currentMeta['verification']['documents']) && is_array($currentMeta['verification']['documents'])) {
                foreach ($currentMeta['verification']['documents'] as $k => $v) {
                    if (empty($snapshot['documents'][$k])) $snapshot['documents'][$k] = $v;
                }
            }

            // Store the snapshot in meta and persist immediately so further errors don't lose it.
            $currentMeta['verification']['previous'] = $snapshot;
            $apartment->meta = $currentMeta;
            try { $apartment->save(); } catch (\Exception $e) { Log::warning('Failed to save verification snapshot for apartment ' . $apartment->id . ': ' . $e->getMessage()); }
        }

        $apartment->update([
            'title' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'status' => 1,
            'address' => $request->address,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'size' => $request->size,
            'user_id' => $request->owner,
        ]);

        // Persist verification meta
        $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
        $meta['owner_name'] = $request->input('owner_name');
        $meta['owner_phone'] = $request->input('owner_phone');
        $meta['is_agent'] = $request->filled('is_agent') ? true : false;
    // also keep a verification sub-structure for the admin UI
    $meta['verification'] = $meta['verification'] ?? [];
    $meta['verification']['full_name'] = $request->input('owner_name');
    if ($request->filled('owner_email')) $meta['verification']['email'] = $request->input('owner_email');
    $meta['verification']['is_agent'] = $request->filled('is_agent') ? true : false;
    if ($request->filled('agent_id')) $meta['verification']['agent_id'] = $request->input('agent_id');
    if ($request->filled('agent_phone')) $meta['verification']['agent_phone'] = $request->input('agent_phone');
    $apartment->meta = $meta;
    $apartment->save();

        // Handle removed images
        if ($request->filled('removed_images')) {
            $removedImageIds = explode(',', $request->removed_images);
            
            foreach ($removedImageIds as $imageId) {
                $image = ApartmentImage::find($imageId);
                if ($image && $image->apartment_id === $apartment->id) {
                    // Delete file from storage
                    Storage::disk('public')->delete($image->path);
                    // Delete record from database
                    $image->delete();
                }
            }
        }
         // Handle new image uploads
        if ($request->hasFile('images')) {
            $existingImageCount = $apartment->images()->count();
            
            foreach ($request->file('images') as $index => $image) {
                // Generate unique filename
                $filename = 'apartment_' . $apartment->id . '_' . time() . '_' . ($existingImageCount + $index + 1) . '.' . $image->getClientOriginalExtension();
                
                // Store image
                $imagePath = $image->storeAs('apartments', $filename, 'public');
                
                // Create apartment image record
                ApartmentImage::create([
                    'apartment_id' => $apartment->id,
                    'path' => $imagePath,
                ]);
            }
        }

        // Handle verification document uploads and store in apartment_verification_documents
        $verificationFields = ['national_id','ownership_certificate','utility_bill','rental_authorization_letter','agent_authorization_letter'];
        foreach ($verificationFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('apartment_verifications/' . $apartment->id, $filename, 'local');
                \App\Models\ApartmentVerificationDocument::create([
                    'apartment_id' => $apartment->id,
                    'document_type' => $field,
                    'file_path' => $path,
                ]);
                // persist also in meta.verification.documents for the admin UI fallback
                $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
                $meta['verification'] = $meta['verification'] ?? [];
                $meta['verification']['documents'] = $meta['verification']['documents'] ?? [];
                $meta['verification']['documents'][$field] = $path;
                $apartment->meta = $meta;
                $apartment->save();
            }
        }

        // If this apartment was previously approved, mark it pending again and clear verification metadata
        if ($wasPreviouslyApproved) {
            $apartment->verification_status = 'pending';
            $apartment->verified_at = null;
            $apartment->verified_by = null;
            // Keep any rejection_reason untouched (should be null for approved), do not alter images or other fields
            $apartment->save();
        }

        LogModel::create([
            'admin_id' => Auth::id(),
            'entity_type' => 'Apartment',
            'entity_id' => $apartment->id,
            'action' => 'Update'
        ]);

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment edited successfully! The listing will be re-verified by an admin.');
    }

    public function addApartment(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'size' => 'nullable|numeric|min:0',
            'featured' => 'required',
            'owner' => 'required|exists:users,id',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
            // verification fields
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:50',
            'is_agent' => 'nullable',
            'national_id' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'ownership_certificate' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'utility_bill' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'rental_authorization_letter' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'agent_authorization_letter' => 'sometimes|file|mimes:jpeg,png,jpg,pdf|max:51200',
        ]);

        $apartment = Apartment::create([
            'title' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'status' => 1,
            'address' => $request->address,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'size' => $request->size,
            'is_featured' => $request->featured,
            'user_id' => $request->owner,
        ]);

        // Persist verification meta (non-file fields) into meta JSON
        $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
        $meta['owner_name'] = $request->input('owner_name');
        $meta['owner_phone'] = $request->input('owner_phone');
        $meta['is_agent'] = $request->filled('is_agent') ? true : false;
    // Keep a verification sub-structure for backwards compatibility and admin view
    $meta['verification'] = $meta['verification'] ?? [];
    $meta['verification']['full_name'] = $request->input('owner_name');
    if ($request->filled('owner_email')) $meta['verification']['email'] = $request->input('owner_email');
    $meta['verification']['is_agent'] = $request->filled('is_agent') ? true : false;
    if ($request->filled('agent_id')) $meta['verification']['agent_id'] = $request->input('agent_id');
    if ($request->filled('agent_phone')) $meta['verification']['agent_phone'] = $request->input('agent_phone');
        $apartment->meta = $meta;
        $apartment->save();

        if($request->hasFile('images')) {
            foreach($request->file('images') as $index => $image) {
                // Unique file name
                $filename = time() . '_' . uniqid() . '_' . $image->getClientOriginalName();

                // Store image in storage/app/public/apartments
                $imagePath = $image->storeAs('apartments', $filename, 'public');

                // Store in apartment images
                ApartmentImage::create([
                    'apartment_id' => $apartment->id,
                    'path' => $imagePath,
                ]);
            }
        }

        // Handle verification document uploads and store in apartment_verification_documents
        $verificationFields = ['national_id','ownership_certificate','utility_bill','rental_authorization_letter','agent_authorization_letter'];
        foreach ($verificationFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('apartment_verifications/' . $apartment->id, $filename, 'local');
                \App\Models\ApartmentVerificationDocument::create([
                    'apartment_id' => $apartment->id,
                    'document_type' => $field,
                    'file_path' => $path,
                ]);
                // also persist a reference in the apartment meta (backwards compatibility)
                $meta = is_array($apartment->meta) ? $apartment->meta : (array) ($apartment->meta ?? []);
                $meta['verification'] = $meta['verification'] ?? [];
                $meta['verification']['documents'] = $meta['verification']['documents'] ?? [];
                $meta['verification']['documents'][$field] = $path;
                $apartment->meta = $meta;
                $apartment->save();
            }
        }

        LogModel::create([
            'admin_id' => Auth::id(),
            'entity_type' => 'Apartment',
            'entity_id' => $apartment->id,
            'action' => 'Create'
        ]);

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment added successfully!');
    }

    public function delete(Apartment $apartment) {
        $apartment->delete();

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment deleted successfully!');
    }

    public function search(Request $request) {
        $query = $request->query('q');
        $bedrooms = $request->query('bedrooms'); // 1, 2, 3
        $priceRange = $request->query('price_range'); // low, medium, high

        if(!$query) {
            return response()->json([]);
        }

        $apartments = Apartment::with('images')
                        ->where('title', 'LIKE', "%{$query}%");

        // Apply bedroom filter
        if($bedrooms) {
            $apartments->where('bedrooms', '>=', $bedrooms);
        }

        // Apply price filter
        if($priceRange) {
            if($priceRange === 'low') {
                $apartments->where('price', '<', 10000); // example
            } elseif($priceRange === 'medium') {
                $apartments->whereBetween('price', [10000, 20000]);
            } elseif($priceRange === 'high') {
                $apartments->where('price', '>', 2000);
            }
        }

        $apartments = $apartments->get();

        return response()->json($apartments);
    }

}
