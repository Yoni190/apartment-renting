<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    function showLogin() {
        return view('web.admin.login');
    }

    function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        return redirect()->route('admin.dashboard');
    }

    function dashboard() {
        return view('web.admin.dashboard');
    }

    function users() {
        return view('web.admin.users');
    }
}
