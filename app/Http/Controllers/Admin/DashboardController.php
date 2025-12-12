<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $vinylProducts = Product::where('format', 'Vinyl')->count();
        $cdProducts = Product::where('format', 'CD')->count();
        $totalOrders = Order::count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'products' => $totalProducts,
                'vinyl' => $vinylProducts,
                'cd' => $cdProducts,
                'orders' => $totalOrders,
            ],
        ]);
    }
}