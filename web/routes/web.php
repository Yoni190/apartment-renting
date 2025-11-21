<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\HomeController;

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

Route::get('/', [HomeController::class, 'index']);
Route::get('/renter/register', [HomeController::class, 'registerView'])->name('user.renter.register');
Route::post('/renter/register', [HomeController::class, 'register'])->name('user.renter.register-user');
Route::get('/login', [HomeController::class, 'login'])->name('login');

Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'home'])
        ->name('user.renter.home');
});

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function() {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::get('/apartments', [ApartmentController::class, 'index'])->name('admin.apartments');
        Route::get('/apartment/add', [ApartmentController::class, 'addApartmentView'])->name('admin.apartments.add');
        Route::get('/apartment/edit/{apartment}', [ApartmentController::class, 'editApartmentView'])->name('admin.apartments.edit');
        Route::post('/apartment/edit-apartment/{apartment}', [ApartmentController::class, 'editApartment'])->name('admin.edit-apartment');
        Route::post('/apartment/add-apartment', [ApartmentController::class, 'addApartment'])->name('admin.add-apartment');
        Route::delete('/apartments/{apartment}/delete', [ApartmentController::class, 'delete'])->name('admin.apartments.destroy');
        Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
        Route::get('/admins', [AdminController::class, 'index'])->name('admin.admins.index');
        Route::get('/admins/add', [AdminController::class, 'addView'])->name('admin.add');
        Route::post('/admins/add-admin', [AdminController::class, 'add'])->name('admin.add-admin');
        Route::delete('/{admin}/delete', [AdminController::class, 'delete'])->name('admin.delete');
        Route::patch('/users/{user}/status', [UserController::class, 'toggleStatus'])->name('admin.users.toggleStatus');
        Route::patch('/apartments/{apartment}/status', [ApartmentController::class, 'toggleStatus'])->name('admin.apartments.toggleStatus');
        Route::patch('/apartments/{apartment}/featured-status', [ApartmentController::class, 'toggleFeatured'])->name('admin.apartments.toggleFeatured');
        Route::get('/admin/report/download', [ReportController::class, 'download'])
        ->name('admin.downloadReport');
    });
    
});




Route::get('/help', function () {
    return view('web.help');
});
