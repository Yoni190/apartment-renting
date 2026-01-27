<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function index(Request $request) {
        $query = User::query();

        if($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return view('web.admin.users', compact('users'));
    }

    public function toggleStatus(User $user){
        $user->status = $user->status === 1 ? 0 : 1;
        $user->save();

        Log::create([
            'admin_id' => Auth::id(),
            'entity_type' => User::class,
            'entity_id' => $user->id,
            'action' => 'Change Status',
        ]);

        return redirect()->back()->with('message', "$user->name's status updated successfully");
    }
}
