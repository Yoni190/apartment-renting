<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NationalIdController;

Route::post('/verify-national-id', [NationalIdController::class, 'verify']);

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working!'
    ]);
});
