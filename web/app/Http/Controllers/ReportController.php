<?php

namespace App\Http\Controllers;
use PDF;

use Illuminate\Http\Request;

class ReportController extends Controller
{

    public function download() {
        //Dummy Data
        $data = [
                'totalUsers' => 1200,
                'totalSales' => 54000,
                'totalOrders' => 320,
                'monthlySales' => [5000, 7000, 8000, 6500, 9000, 11000],
                'months' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            ];

        $pdf = PDF::loadView('web.admin.reports.summary', $data);

        return $pdf->download('apartment_report.pdf');
    }
    
}
