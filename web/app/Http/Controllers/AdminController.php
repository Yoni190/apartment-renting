<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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

        $credentials = $request->only('email', 'password');


        if(Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard')->with('message', 'Logged In Successfully!');
        }

        return back()->withErrors([
            'email' => 'Invalid Credentials.'
        ]);        
    }

    function logout(Request $request) {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('admin.login')->with('message', 'You have been logged out successfully.');
    }
 
    function dashboard() {
        return view('web.admin.dashboard');
    }

    function users() {
        $users = User::select('id', 'name', 'email', 'role', 'status')->paginate(20);
        return view('web.admin.users', compact('users'));
    }

    function apartments() {
        return view('web.admin.apartments');
    }

    function settings() {
        return view('web.admin.settings');
    }
}
