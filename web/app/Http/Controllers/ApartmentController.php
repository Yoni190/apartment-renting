<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\ApartmentImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


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
        $apartment->verified_by = auth('admin')->id();
        $apartment->rejection_reason = null;
        $apartment->save();

        return redirect()->back()->with('message', $apartment->title . ' has been approved');
    }

    public function reject(Request $request, Apartment $apartment) {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000'
        ]);

        $apartment->verification_status = 'rejected';
        $apartment->verified_at = now();
        $apartment->verified_by = auth('admin')->id();
        $apartment->rejection_reason = $request->input('rejection_reason');
        $apartment->save();

        return redirect()->back()->with('message', $apartment->title . ' has been rejected');
    }

    public function addApartmentView() {
        $users = User::all();
        return  view('web.admin.apartment.add-apartment', compact('users'));
    }

    public function editApartmentView(Apartment $apartment) {
        $apartment->load('images');

        $users = User::all();
        return  view('web.admin.apartment.edit-apartment', compact('apartment', 'users'));
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
        ]);

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

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment edited successfully!');
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

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment added successfully!');
    }

    public function delete(Apartment $apartment) {
        $apartment->delete();

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment deleted successfully!');
    }
}
