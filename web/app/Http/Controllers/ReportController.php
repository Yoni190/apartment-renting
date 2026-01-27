<?php

namespace App\Http\Controllers;

use PDF;
use App\Models\User;
use App\Models\Apartment;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function download()
    {
        // Real data from the dashboard
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

        $months = array_map(function($m) { 
            return date('M', mktime(0,0,0,$m,1)); 
        }, array_keys($userGrowth));

        $data = [
            'totalUsers' => $totalUsers,
            'totalApartments' => $totalApartments,
            'activeApartments' => $activeApartments,
            'recentApartments' => $recentApartments,
            'userGrowth' => $userGrowth,
            'apartmentsGrowth' => $apartmentsGrowth,
            'months' => $months,
        ];

        $pdf = PDF::loadView('web.admin.reports.summary', $data);

        return $pdf->download('apartment_report.pdf');
    }
}
