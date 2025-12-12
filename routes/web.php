<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::get('/home', [CatalogController::class, 'home'])->name('home');
Route::get('/product', function () {
    return Inertia::render('product');
})->name('product');
Route::get('/product/{id}', [CatalogController::class, 'show'])->name('catalog.show');
Route::get('/shop', [CatalogController::class, 'index'])->name('shop.index');

Route::get('/cart/index', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.add');
Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('root');

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

Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

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

Route::middleware('auth')->group(function () {
    // Process the checkout
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
    
    // View the confirmation / receipt
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
});

//  Group for Customers only
// Route::middleware(['auth', 'role:customer'])->group(function () {
//     Route::get('/my-orders', [OrderController::class, 'index']);
// });