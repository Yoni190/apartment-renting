<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function toggleStatus(User $user){
        $user->status = $user->status === 1 ? 0 : 1;
        $user->save();

        return redirect()->back()->with('success', 'User Status updated successfully');
    }
}
