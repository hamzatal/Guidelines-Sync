<?php

// ===================================================
//! Admin Authentication
// ===================================================

use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\AdminAuth\DashboardController;
use App\Http\Controllers\AdminAuth\HeroSectionController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\OfferController as AdminOfferController;
use App\Http\Controllers\AdminAuth\PackagesController;
use App\Http\Controllers\AdminAuth\CompanyInfoController;

// ===================================================
//! User Authentication
// ===================================================

use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\ChatGPTServices;

// ===================================================
//! Company Authentication
// ===================================================

use App\Http\Controllers\CompanyAuth\CompanyController;
use App\Http\Controllers\CompanyAuth\CompanyDashboardController;
use App\Http\Controllers\CompanyAuth\CompanyDestinationController;
use App\Http\Controllers\CompanyAuth\CompanyOfferController;
use App\Http\Controllers\CompanyAuth\CompanyPackageController;

// ===================================================
//! Middleware Imports
// ===================================================

// ===================================================
//! Authentication Routes (Keep Public)
//   (Laravel Breeze / Jetstream / Fortify routes)
// ===================================================

require __DIR__ . '/auth.php';

// ===================================================
//! Public Routes
// ===================================================

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// })->name('welcome');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index'])->name('home');

Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

Route::post('/contacts', [ContactController::class, 'store'])->name('contacts.store');

Route::get('/destinations', [DestinationController::class, 'allDestinations'])->name('destinations.index');
Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');

Route::get('/packages', [PackagesController::class, 'indexPublic'])->name('packages.index');
Route::get('/packages/{package}', [PackagesController::class, 'show'])->name('packages.show');

Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/search/live', [SearchController::class, 'live'])->name('search.live');

Route::get('/terms', fn() => Inertia::render('terms'))->name('terms');


// ===================================================
//! Upload Routes
// ===================================================
Route::get('/upload', [UploadController::class, 'create'])->name('upload.create');
Route::post('/upload', [UploadController::class, 'store'])->name('upload.process');
    
// ===================================================
//! Company Authentication Routes (Public + guest)
// ===================================================

Route::middleware('guest:company')->group(function () {
    Route::post('/company/login', [CompanyController::class, 'login'])->name('company.login');
});

// ===================================================
//! Admin Authentication Routes (Public + guest)
// ===================================================

Route::middleware('guest:admin')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [LoginController::class, 'store'])->name('admin.login.submit');
});

// ===================================================
//! Protected Routes - Regular Users Only
// ===================================================

Route::middleware(['auth:web', 'verified', 'active'])->group(function () {
    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'deactivate'])->name('deactivate');
        Route::post('/reactivate', [ProfileController::class, 'reactivate'])->name('reactivate');
    });
});

// ===================================================
//! API Routes (Regular Users Only)
// ===================================================

Route::middleware(['auth:web', 'verified'])->prefix('api')->name('api.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'getProfile'])->name('profile.get');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/user', [UserController::class, 'getUser'])->name('user.get');
    Route::post('/update', [UserController::class, 'updateUser'])->name('user.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::put('/profile/deactivate', [ProfileController::class, 'deactivate'])->name('profile.deactivate');
});

// ===================================================
//! Admin Protected Routes
// ===================================================

Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin authentication
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Company info
    Route::get('/company-info', [CompanyInfoController::class, 'index'])->name('company-info.index');
    Route::post('/company-info/{id}/toggle-active', [CompanyInfoController::class, 'toggleActive'])->name('company-info.toggle-active');
    Route::delete('/company-info/{id}', [CompanyInfoController::class, 'destroy'])->name('company-info.destroy');
    Route::post('/company-info/{companyId}/destination/{id}/toggle-active', [CompanyInfoController::class, 'toggleDestinationActive'])->name('company-info.destination.toggle-active');
    Route::delete('/company-info/{companyId}/destination/{id}', [CompanyInfoController::class, 'destroyDestination'])->name('company-info.destination.destroy');
    Route::post('/company-info/{companyId}/offer/{id}/toggle-active', [CompanyInfoController::class, 'toggleOfferActive'])->name('company-info.offer.toggle-active');
    Route::delete('/company-info/{companyId}/offer/{id}', [CompanyInfoController::class, 'destroyOffer'])->name('company-info.offer.destroy');
    Route::post('/company-info/{companyId}/package/{id}/toggle-active', [CompanyInfoController::class, 'togglePackageActive'])->name('company-info.package-toggle-active');
    Route::delete('/company-info/{companyId}/package/{id}', [CompanyInfoController::class, 'destroyPackage'])->name('company-info.package.destroy');

    // Admin dashboard and profile
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [AdminController::class, 'getAdminProfile'])->name('profile');
    Route::put('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
    Route::post('/profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update.post');
    Route::post('/profile/password', [AdminController::class, 'updateAdminPassword'])->name('profile.password');

    // User management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('toggle-status');
    });

    // Messages and contacts
    Route::get('/messages', [AdminController::class, 'showContacts'])->name('messages');
    Route::get('/contacts', [AdminController::class, 'showContacts'])->name('contacts');
    Route::patch('/messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');

    // Destinations management
    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [DestinationController::class, 'index'])->name('index');
        Route::post('/', [DestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [DestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [DestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [DestinationController::class, 'toggleFeatured'])->name('toggle-featured');
    });

    // Offers management
    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [AdminOfferController::class, 'index'])->name('index');
        Route::post('/', [AdminOfferController::class, 'store'])->name('store');
        Route::put('/{id}', [AdminOfferController::class, 'update'])->name('update');
        Route::delete('/{id}', [AdminOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/toggle', [AdminOfferController::class, 'toggleActive'])->name('toggle');
    });

    // Hero section management
    Route::prefix('hero')->name('hero.')->group(function () {
        Route::get('/', [HeroSectionController::class, 'index'])->name('index');
        Route::post('/', [HeroSectionController::class, 'store'])->name('store');
        Route::post('/{id}', [HeroSectionController::class, 'update'])->name('update');
        Route::patch('/{id}/toggle', [HeroSectionController::class, 'toggleActive'])->name('toggle');
        Route::delete('/{id}', [HeroSectionController::class, 'destroy'])->name('delete');
    });

    // Packages management
    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [PackagesController::class, 'index'])->name('index');
        Route::post('/', [PackagesController::class, 'store'])->name('store');
        Route::post('/{package}', [PackagesController::class, 'update'])->name('update.post');
        Route::put('/{package}', [PackagesController::class, 'update'])->name('update');
        Route::patch('/{package}/toggle-featured', [PackagesController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{package}', [PackagesController::class, 'destroy'])->name('destroy');
    });
});

// ===================================================
//! Company Protected Routes
// ===================================================

Route::middleware(['auth:company', 'verified'])->prefix('company')->name('company.')->group(function () {
    // Company authentication
    Route::post('/logout', [CompanyController::class, 'logout'])->name('logout');

    // Company dashboard and profile
    Route::get('/dashboard', [CompanyDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [CompanyController::class, 'profile'])->name('profile');
    Route::put('/profile', [CompanyController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [CompanyController::class, 'updatePassword'])->name('profile.password');

    // Company bookings management
    Route::delete('/bookings/{id}/cancel', [CompanyDashboardController::class, 'cancelBooking'])->name('bookings.cancel');
    Route::patch('/bookings/{id}/confirm', [CompanyDashboardController::class, 'confirmBooking'])->name('bookings.confirm');

    // Company destinations management
    Route::prefix('destinations')->name('destinations.')->group(function () {
        Route::get('/', [CompanyDestinationController::class, 'index'])->name('index');
        Route::post('/', [CompanyDestinationController::class, 'store'])->name('store');
        Route::put('/{destination}', [CompanyDestinationController::class, 'update'])->name('update');
        Route::delete('/{destination}', [CompanyDestinationController::class, 'destroy'])->name('destroy');
        Route::patch('/{destination}/toggle-featured', [CompanyDestinationController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::patch('/{destination}/toggle-active', [CompanyDestinationController::class, 'toggleActive'])->name('toggle-active');
    });

    // Company offers management
    Route::prefix('offers')->name('offers.')->group(function () {
        Route::get('/', [CompanyOfferController::class, 'index'])->name('index');
        Route::post('/', [CompanyOfferController::class, 'store'])->name('store');
        Route::put('/{offer}', [CompanyOfferController::class, 'update'])->name('update');
        Route::delete('/{offer}', [CompanyOfferController::class, 'destroy'])->name('destroy');
        Route::patch('/{offer}/toggle-active', [CompanyOfferController::class, 'toggleActive'])->name('toggle-active');
    });

    // Company packages management
    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [CompanyPackageController::class, 'index'])->name('index');
        Route::post('/', [CompanyPackageController::class, 'store'])->name('store');
        Route::put('/{package}', [CompanyPackageController::class, 'update'])->name('update');
        Route::delete('/{package}', [CompanyPackageController::class, 'destroy'])->name('destroy');
        Route::patch('/{package}/toggle-featured', [CompanyPackageController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::patch('/{package}/toggle-active', [CompanyPackageController::class, 'toggleActive'])->name('toggle-active');
    });
});

// ===================================================
//! Chat Bot Routes
// ===================================================

Route::post('/chatbot', function (Request $request) {
    $chat = new ChatGPTServices();
    $response = $chat->handleUserMessage($request->input('message'));

    return response()->json(['response' => $response]);
});
Route::post('/chatbot', [ChatBotController::class, 'handleChat'])->name('chatbot.handle');

// ===================================================
//! Fallback Routes
// ===================================================

Route::get('/404', fn() => Inertia::render('Errors/404'))->name('404');
Route::fallback(fn() => Inertia::render('Errors/404'));
