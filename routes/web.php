<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Enums\UserRole;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\CatalogController;

Route::get('/home', [CatalogController::class, 'home'])->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/welcome', function () {
        return Inertia::render('welcome');
    });

    // ... your existing login routes ...
    Route::get('/login', [AuthController::class, 'createLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);

    // --- NEW REGISTRATION ROUTES ---
    Route::get('/register', [AuthController::class, 'createRegistration'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/inventory', 
            [InventoryController::class, 'index']
        )->name('admin.inventory');

        Route::get('/inventory/create', 
            [InventoryController::class, 'create']
        )->name('admin.inventory.create');

        Route::post('/inventory', [InventoryController::class, 'store'])->name('admin.inventory.store');
    
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');

    
    // NEW ROUTES
        Route::get('/inventory/{id}/edit', [InventoryController::class, 'edit'])->name('admin.inventory.edit');
        Route::put('/inventory/{id}', [InventoryController::class, 'update'])->name('admin.inventory.update');
    }
);
//  Group for Customers only
// Route::middleware(['auth', 'role:customer'])->group(function () {
//     Route::get('/my-orders', [OrderController::class, 'index']);
// });