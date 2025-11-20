<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;
use App\Models\User;

class ApartmentController extends Controller
{
    function index(Request $request) {
        $query = Apartment::query();


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



        if($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $max_price = $request->max_price ? $request->max_price : (clone $query)->max('price');

        $apartments = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();
        
        

        return view('web.admin.apartment.apartments', compact('apartments', 'max_price'));
    }

    public function toggleStatus(Apartment $apartment){
        $apartment->status = $apartment->status === 1 ? 0 : 1;
        $apartment->save();

        return redirect()->back()->with('message', "$apartment->title's status updated successfully");
    }

    public function addApartmentView() {
        $users = User::all();
        return  view('web.admin.apartment.add-apartment', compact('users'));
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
            'owner' => 'required|exists:users,id',
        ]);

        Apartment::create([
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

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment added successfully!');
    }

    public function delete(Apartment $apartment) {
        $apartment->delete();

        return redirect()->route('admin.apartments')
        ->with('message', 'Apartment deleted successfully!');
    }
}
