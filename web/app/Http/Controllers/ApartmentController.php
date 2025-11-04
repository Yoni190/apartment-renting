<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;

class ApartmentController extends Controller
{
    function index(Request $request) {
        $query = Apartment::query();


        if($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }


        if($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $apartments = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return view('web.admin.apartments', compact('apartments'));
    }

    public function toggleStatus(Apartment $apartment){
        $apartment->status = $apartment->status === 1 ? 0 : 1;
        $apartment->save();

        return redirect()->back()->with('message', "$apartment->title's status updated successfully");
    }
}
