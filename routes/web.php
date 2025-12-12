<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/home', [CatalogController::class, 'home'])->name('home');
Route::get('/product', function () {
    return Inertia::render('product');
})->name('product');
Route::get('/product/{id}', [CatalogController::class, 'show'])->name('catalog.show');
Route::get('/shop', [CatalogController::class, 'index'])->name('shop.index');

Route::get('/cart/index', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.add');
Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

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
    
                Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    
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
    Route::get('/profile', [UserController::class, 'index'])->name('profile');
    Route::post('/profile/address', [UserController::class, 'storeAddress'])->name('profile.address.store');
    Route::post('/profile/address/default', [UserController::class, 'updateDefaultAddress'])->name('profile.address.updateDefault');
    Route::post('/profile/address/delete', [UserController::class, 'destroyAddress'])->name('profile.address.delete');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/orders', [OrderController::class, 'adminIndex'])->name('admin.orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'adminShow'])->name('admin.orders.show');
    Route::patch('/orders/{id}', [OrderController::class, 'adminUpdate'])->name('admin.orders.update');
});

//  Group for Customers only
// Route::middleware(['auth', 'role:customer'])->group(function () {
//     Route::get('/my-orders', [OrderController::class, 'index']);
// });