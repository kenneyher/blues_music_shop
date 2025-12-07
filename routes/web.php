<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Enums\UserRole;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\InventoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware('guest')->group(function () {
    // ... your existing login routes ...
    Route::get('/login', [AuthController::class, 'createLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);

    // --- NEW REGISTRATION ROUTES ---
    Route::get('/register', [AuthController::class, 'createRegistration'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home');
});

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/inventory', 
            [InventoryController::class, 'index']
        )->name('admin.inventory');
    
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');
    }
);
//  Group for Customers only
// Route::middleware(['auth', 'role:customer'])->group(function () {
//     Route::get('/my-orders', [OrderController::class, 'index']);
// });