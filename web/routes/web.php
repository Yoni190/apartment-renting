<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function() {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::get('/apartments', [ApartmentController::class, 'index'])->name('admin.apartments');
        Route::get('/apartment/add', [ApartmentController::class, 'addApartment'])->name('admin.apartments.add');
        Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
        Route::get('/admins', [AdminController::class, 'index'])->name('admin.admins.index');
        Route::delete('/{admin}/delete', [AdminController::class, 'delete'])->name('admin.delete');
        Route::patch('/users/{user}/status', [UserController::class, 'toggleStatus'])->name('admin.users.toggleStatus');
        Route::patch('/apartments/{apartment}/status', [ApartmentController::class, 'toggleStatus'])->name('admin.apartments.toggleStatus');
        Route::get('/admin/report/download', [ReportController::class, 'download'])
        ->name('admin.downloadReport');
    });
    
});




Route::get('/help', function () {
    return view('web.help');
});
