<?php

use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\AdminAuth\DashboardController;
use App\Http\Controllers\AdminAuth\HeroSectionController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\OfferController as AdminOfferController;
use App\Http\Controllers\AdminAuth\PackagesController;
use App\Http\Controllers\AdminAuth\CompanyInfoController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AIJournalController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserBookingsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CompanyAuth\CompanyController;
use App\Http\Controllers\CompanyAuth\CompanyDashboardController;
use App\Http\Controllers\CompanyAuth\CompanyDestinationController;
use App\Http\Controllers\CompanyAuth\CompanyOfferController;
use App\Http\Controllers\CompanyAuth\CompanyPackageController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

// ===================================================
//! Public API Routes (Must be FIRST - No middleware)
// ===================================================

Route::prefix('api')->group(function () {
    // AI Journal APIs (Public)
    Route::get('/journals', [AIJournalController::class, 'index']);
    Route::get('/journals/details', [AIJournalController::class, 'show']);
    Route::get('/journal-categories', [AIJournalController::class, 'categories']);

    // Document Processing (Public for testing)
    Route::post('/process-document', [DocumentController::class, 'process']);
    Route::get('/download-document/{id}', [DocumentController::class, 'download']);
    Route::put('/update-document/{id}', [DocumentController::class, 'update']);
    Route::post('/ai-improve-document', [DocumentController::class, 'aiImprove']);
});

// ===================================================
//! Authentication Routes
// ===================================================
require __DIR__ . '/auth.php';

// ===================================================
//! Public Routes
// ===================================================

Route::get('/', function () {
    return redirect('/home');
});

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');
Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');

Route::get('/destinations', [DestinationController::class, 'allDestinations'])->name('destinations.index');
Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');
Route::get('/upload-paper', fn() => Inertia::render('UploadPaper/Index'))->name('upload-paper');
Route::get('/UploadPaper', [PackagesController::class, 'indexPublic'])->name('UploadPaper.index');
Route::get('/UploadPaper/{UploadPaper}', [PackagesController::class, 'show'])->name('UploadPaper.show');
Route::get('/offers', [OfferController::class, 'index'])->name('offers');
Route::get('/offers/{offer}', [OfferController::class, 'show'])->name('offers.show');

Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/search/live', [SearchController::class, 'live'])->name('search.live');
Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');

// ===================================================
//! Admin & Company Authentication
// ===================================================

Route::post('/company/login', [CompanyController::class, 'login'])->name('company.login');
Route::get('/admin/login', [LoginController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [LoginController::class, 'store'])->name('admin.login.submit');

// ===================================================
//! Protected Routes - Users
// ===================================================

Route::middleware(['auth:web', 'verified', 'active'])->group(function () {
    Route::get('/UserBookings', [UserBookingsController::class, 'index'])->name('bookings.index');
    Route::get('/book', [BookingController::class, 'create'])->name('book.create');
    Route::post('/book', [BookingController::class, 'store'])->name('book.store');
    Route::delete('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{bookingId}/rate', [UserBookingsController::class, 'submitRating'])->name('bookings.rate');

    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
    });
});

Route::middleware(['auth:web', 'verified'])->prefix('api')->name('api.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'getProfile'])->name('profile.get');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/user', [UserController::class, 'getUser'])->name('user.get');
    Route::post('/update', [UserController::class, 'updateUser'])->name('user.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::put('/profile/deactivate', [ProfileController::class, 'deactivate'])->name('profile.deactivate');
});

// ===================================================
//! Admin Routes
// ===================================================

Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [AdminController::class, 'getAdminProfile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
    Route::post('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update.post');
    Route::post('/profile/password', [AdminController::class, 'updateAdminPassword'])->name('profile.password');

    Route::prefix('company-info')->name('company-info.')->group(function () {
        Route::get('/', [CompanyInfoController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-active', [CompanyInfoController::class, 'toggleActive'])->name('toggle-active');
        Route::delete('/{id}', [CompanyInfoController::class, 'destroy'])->name('destroy');
        Route::post('/{companyId}/destination/{id}/toggle-active', [CompanyInfoController::class, 'toggleDestinationActive'])->name('destination.toggle-active');
        Route::delete('/{companyId}/destination/{id}', [CompanyInfoController::class, 'destroyDestination'])->name('destination.destroy');
        Route::post('/{companyId}/offer/{id}/toggle-active', [CompanyInfoController::class, 'toggleOfferActive'])->name('offer.toggle-active');
        Route::delete('/{companyId}/offer/{id}', [CompanyInfoController::class, 'destroyOffer'])->name('offer.destroy');
        Route::post('/{companyId}/UploadPaper/{id}/toggle-active', [CompanyInfoController::class, 'togglePackageActive'])->name('UploadPaper.toggle-active');
        Route::delete('/{companyId}/UploadPaper/{id}', [CompanyInfoController::class, 'destroyPackage'])->name('UploadPaper.destroy');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('toggle-status');
    });

    Route::get('/messages', [AdminController::class, 'showContacts'])->name('messages');
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');

    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [DestinationController::class, 'index'])->name('index');
        Route::post('/', [DestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [DestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [DestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [DestinationController::class, 'toggleFeatured'])->name('toggle-featured');
    });

    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [AdminOfferController::class, 'index'])->name('index');
        Route::post('/', [AdminOfferController::class, 'store'])->name('store');
        Route::put('/{id}', [AdminOfferController::class, 'update'])->name('update');
        Route::delete('/{id}', [AdminOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle', [AdminOfferController::class, 'toggleActive'])->name('toggle');
    });

    Route::prefix('hero')->name('hero.')->group(function () {
        Route::get('/', [HeroSectionController::class, 'index'])->name('index');
        Route::post('/', [HeroSectionController::class, 'store'])->name('store');
        Route::post('/{id}', [HeroSectionController::class, 'update'])->name('update');
        Route::patch('/{id}/toggle', [HeroSectionController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{id}', [HeroSectionController::class, 'destroy'])->name('delete');
    });

    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [PackagesController::class, 'index'])->name('index');
        Route::post('/', [PackagesController::class, 'store'])->name('store');
        Route::post('/{UploadPaper}', [PackagesController::class, 'update'])->name('update.post');
        Route::put('/{UploadPaper}', [PackagesController::class, 'update'])->name('update');
        Route::patch('/{UploadPaper}/toggle-featured', [PackagesController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{UploadPaper}', [PackagesController::class, 'destroy'])->name('destroy');
    });
});

// ===================================================
//! Company Routes
// ===================================================

Route::middleware(['auth:company', 'verified'])->prefix('company')->name('company.')->group(function () {
    Route::post('/logout', [CompanyController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [CompanyDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [CompanyController::class, 'profile'])->name('profile');
    Route::put('/profile', [CompanyController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [CompanyController::class, 'updatePassword'])->name('profile.password');

    Route::post('/bookings/{bookingId}/rate', [UserBookingsController::class, 'submitRating'])->name('bookings.rate');
    Route::delete('/bookings/{id}/cancel', [CompanyDashboardController::class, 'cancelBooking'])->name('bookings.cancel');
    Route::patch('/bookings/{id}/confirm', [CompanyDashboardController::class, 'confirmBooking'])->name('bookings.confirm');

    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [CompanyDestinationController::class, 'index'])->name('index');
        Route::post('/', [CompanyDestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [CompanyDestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [CompanyDestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [CompanyDestinationController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::patch('/{destination}/toggle-active', [CompanyDestinationController::class, 'toggleActive'])->name('toggle-active');
    });

    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [CompanyOfferController::class, 'index'])->name('index');
        Route::post('/', [CompanyOfferController::class, 'store'])->name('store');
        Route::put('/{offer}', [CompanyOfferController::class, 'update'])->name('update');
        Route::delete('/{offer}', [CompanyOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{offer}/toggle-active', [CompanyOfferController::class, 'toggleActive'])->name('toggle-active');
    });

    Route::prefix('UploadPaper')->name('UploadPaper.')->group(function () {
        Route::get('/', [CompanyPackageController::class, 'index'])->name('index');
        Route::post('/', [CompanyPackageController::class, 'store'])->name('store');
        Route::put('/{UploadPaper}', [CompanyPackageController::class, 'update'])->name('update');
        Route::delete('/{UploadPaper}', [CompanyPackageController::class, 'destroy'])->name('destroy');
        Route::patch('/{UploadPaper}/toggle-featured', [CompanyPackageController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::patch('/{UploadPaper}/toggle-active', [CompanyPackageController::class, 'toggleActive'])->name('toggle-active');
    });
});

// ===================================================
//! Chat Bot
// ===================================================

Route::post('/chatbot', [ChatBotController::class, 'handleChat'])->name('chatbot.handle');

// ===================================================
//! Fallback
// ===================================================

Route::get('/404', fn() => Inertia::render('Errors/404'))->name('404');
Route::fallback(fn() => Inertia::render('Errors/404'));
