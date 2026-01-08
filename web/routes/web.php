<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ApartmentVerificationDocumentController;

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

Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');


Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'home'])
        ->name('user.renter.home');
    Route::post('/logout', [HomeController::class, 'logout'])->name('logout');
    // Owner area
    Route::get('/owner/dashboard', [App\Http\Controllers\OwnerController::class, 'dashboard'])->name('owner.dashboard');
        Route::get('/owner/listing/{apartment}', [App\Http\Controllers\OwnerController::class, 'showListing'])->name('owner.listing.show');
        Route::get('/owner/booking/{booking}/client', [App\Http\Controllers\OwnerController::class, 'clientProfile'])->name('owner.booking.client');
    // Tour booking routes (clients)
    Route::get('/apartments/{apartment}/book-tour', [App\Http\Controllers\TourBookingController::class, 'create'])->name('bookings.create');
    Route::post('/apartments/{apartment}/book-tour', [App\Http\Controllers\TourBookingController::class, 'store'])->name('bookings.store');
});

Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function() {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::get('/apartments', [ApartmentController::class, 'index'])->name('admin.apartments');
        // Show single apartment details (admin view)
        Route::get('/apartments/{apartment}/view', [ApartmentController::class, 'show'])->name('admin.apartments.show');
        // Preview verification document (admin only, inline preview)
        Route::get('/apartments/verification-docs/{doc}/preview', [ApartmentVerificationDocumentController::class, 'preview'])->name('admin.apartments.verification.preview');
            // Preview meta-stored files by path (admin only)
            Route::get('/apartments/{apartment}/verification-preview', [ApartmentVerificationDocumentController::class, 'previewMeta'])->name('admin.apartments.verification.preview_meta');
    Route::post('/apartments/{apartment}/approve', [ApartmentController::class, 'approve'])->name('admin.apartments.approve');
    Route::post('/apartments/{apartment}/reject', [ApartmentController::class, 'reject'])->name('admin.apartments.reject');
    Route::post('/apartments/{apartment}/request-more-info', [ApartmentController::class, 'requestMoreInfo'])->name('admin.apartments.requestMoreInfo');
        Route::get('/apartment/add', [ApartmentController::class, 'addApartmentView'])->name('admin.apartments.add');
        Route::get('/apartment/edit/{apartment}', [ApartmentController::class, 'editApartmentView'])->name('admin.apartments.edit');
        Route::post('/apartment/edit-apartment/{apartment}', [ApartmentController::class, 'editApartment'])->name('admin.edit-apartment');
        Route::post('/apartment/add-apartment', [ApartmentController::class, 'addApartment'])->name('admin.add-apartment');
        Route::delete('/apartments/{apartment}/delete', [ApartmentController::class, 'delete'])->name('admin.apartments.destroy');
    // Verification documents for apartments (admin only)
    Route::get('/apartment/{apartment}/verification-docs', [ApartmentVerificationDocumentController::class, 'index'])->name('admin.apartments.verification.index');
    Route::post('/apartment/{apartment}/verification-docs', [ApartmentVerificationDocumentController::class, 'store'])->name('admin.apartments.verification.store');
    Route::get('/apartments/verification-docs/{doc}/download', [ApartmentVerificationDocumentController::class, 'download'])->name('admin.apartments.verification.download');
    Route::get('/apartments/{apartment}/verification-download', [ApartmentVerificationDocumentController::class, 'downloadMeta'])->name('admin.apartments.verification.download_meta');
    Route::delete('/apartments/verification-docs/{doc}', [ApartmentVerificationDocumentController::class, 'destroy'])->name('admin.apartments.verification.destroy');
        Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
        Route::post('/save-settings', [SettingController::class, 'saveAPI'])->name('admin.settings.save');
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
