<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Admin;
use App\Models\AdminRole;
use App\Models\Api;
use App\Models\Apartment;
use App\Models\Log;
use Illuminate\Support\Facades\Hash;


class AdminController extends Controller
{
    function index(Request $request) {
        $query = Admin::query();

        if($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $admins = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return view('web.admin.admins.admins', compact('admins'));
    }

    function delete(Admin $admin) {
        if(auth()->id() == $admin->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $admin->delete();


        return redirect()->route('admin.admins.index')->with('message', "$admin->name has been deleted successfully");
    }

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
    
 
    public function dashboard()
    {
        $totalUsers = User::count();
        $totalApartments = Apartment::count();
        $activeApartments = Apartment::where('status', 1)->count();
        $recentApartments = Apartment::with('owner')->latest()->take(5)->get();

        // Monthly new users
        $userGrowth = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        // Monthly apartments added
        $apartmentsGrowth = Apartment::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $labels = array_map(function($m){ return date('M', mktime(0,0,0,$m,1)); }, array_keys($userGrowth));

        return view('web.admin.dashboard', compact(
            'totalUsers', 'totalApartments', 'activeApartments',
            'recentApartments', 'userGrowth', 'apartmentsGrowth', 'labels'
        ));
    }


    function apartments() {
        return view('web.admin.apartments');
    }

    function addView() {
        $roles = AdminRole::all();
        return view('web.admin.admins.add', compact('roles'));
    }

    function add(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|unique:admins|email|max:255',
            'password' => 'required|max:255',
            'role' => 'required|exists:admin_roles,id',
        ]);

        $admin = new Admin();
        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->admin_role_id = $request->role;
        $admin->password = Hash::make($request->password);
        $admin->save();

        return redirect()->route('admin.admins.index')
        ->with('message', 'Admin created successfully!');
    }

    function settings() {
        $paymentApi = Api::where('type', 'payment')
        ->first(['name', 'api_key', 'api_provider']);

      if ($paymentApi) {
            $paymentApi->api_key = decrypt($paymentApi->api_key);

            $length = strlen($paymentApi->api_key);
            if ($length > 8) {
                // Mask all characters except first 4 and last 4
                $paymentApi->masked_key = substr($paymentApi->api_key, 0, 4) 
                    . str_repeat('*', $length - 8) 
                    . substr($paymentApi->api_key, -4);
            } else {
                // If too short, just mask everything except the first character
                $paymentApi->masked_key = substr($paymentApi->api_key, 0, 1) 
                    . str_repeat('*', max(0, $length - 1));
            }
        }

        return view('web.admin.settings', compact('paymentApi'));
    }

    public function logs(Request $request)
    {
        $query = Log::with('admin')->orderBy('created_at', 'desc');

        // Filters
        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $logs = $query->paginate(10)->withQueryString();

        $admins = Admin::orderBy('name')->get();

        return view('web.admin.logs', compact('logs', 'admins'));
    }

}
