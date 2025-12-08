<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function home()
    {
        // 1. Fetch Latest Products (New Arrivals)
        $newArrivals = Product::with(['album.artist'])
            ->latest() // Order by created_at desc
            ->take(4)  // Get top 4
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->album->title,
                    'artist' => $product->album->artist->name,
                    'price' => $product->price,
                    // Use product image if available, otherwise fallback to album cover
                    'img' => $product->img_path
                        ? '/storage/' . $product->img_path
                        : ($product->album->img_path ? '/storage/' . $product->album->img_path : 'storage/products/placeholder.jpg'),
                ];
            });

        // 2. Fetch "Featured" or Specific Category (e.g., Vinyls)
        // Since you don't have "Turntables" in your DB yet, let's show random Vinyls here
        $featured = Product::with(['album.artist'])
            ->where('format', 'Vinyl')
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->album->title,
                    'artist' => $product->album->artist->name,
                    'price' => $product->price,
                    'img' => $product->img_path
                        ? '/storage/' . $product->img_path
                        : 'storage/products/placeholder.png',
                ];
            });

        return Inertia::render('home', [
            'newArrivals' => $newArrivals,
            'featured' => $featured,
        ]);
    }

    // You can add an index() method here later for the full "/shop" catalog page
}