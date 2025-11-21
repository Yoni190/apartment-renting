<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;

class HomeController extends Controller
{
    public function index() {
        $featuredApartments = Apartment::where('is_featured', 1)->take(6)->get();
        return view('web.client.home', compact('featuredApartments'));
    }

    public function register() {
        return view('web.client.renter.register');
    }
}
