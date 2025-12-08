<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'album.artist',
            'album.genres',
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('album', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('artist', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('genres', function ($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
            })->orWhere('sku', 'like', "%{$search}%");
        }

        if ($request->filled('format')) {
            $query->where('format', $request->input('format'));
        }

        return Inertia::render('admin/inventory', [
            'products' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'format']),
        ]);
    }
}
