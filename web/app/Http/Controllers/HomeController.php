<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Apartment;

class HomeController extends Controller
{
    public function index() {
        $featuredApartments = Apartment::take(6)->get();
        return view('web.home', compact('featuredApartments'));
    }
}
