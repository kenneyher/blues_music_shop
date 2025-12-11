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
                        ? '/storage/'.$product->img_path
                        : ($product->album->img_path ? '/storage/'.$product->album->img_path : 'storage/products/placeholder.png'),
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
                        ? '/storage/'.$product->img_path
                        : 'storage/products/placeholder.png',
                ];
            });

        return Inertia::render('home', [
            'newArrivals' => $newArrivals,
            'featured' => $featured,
        ]);
    }

    // --- NEW: Shop / Catalog Page ---
    public function index(Request $request)
    {
        $query = Product::with(['album.artist']);

        // 1. Search Filter
        if ($request->search) {
            $query->whereHas('album', function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhereHas('artist', function ($sq) use ($request) {
                        $sq->where('name', 'like', '%'.$request->search.'%');
                    });
            });
        }

        // 2. Availability Filter
        if ($request->availability === 'instock') {
            $query->where('quantity', '>', 0);
        } elseif ($request->availability === 'outstock') {
            $query->where('quantity', '=', 0);
        }

        // 3. Sorting
        switch ($request->sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'date_old':
                $query->oldest();
                break;
            default: // 'date_new'
                $query->latest();
                break;
        }

        // 4. Pagination
        $products = $query->paginate(12)->withQueryString()->through(fn ($p) => $this->mapProduct($p));

        return Inertia::render('shop', [ // <--- Ensure this matches your file name
            'products' => $products,
            'filters' => (object) $request->only(['search', 'sort', 'availability']),
        ]);
    }

    // Helper to keep mapping consistent
    private function mapProduct($product)
    {
        return [
            'id' => $product->id,
            'title' => $product->album->title,
            'artist' => $product->album->artist->name,
            'price' => (float) $product->price,
            'img' => $product->img_path
                ? '/storage/'.$product->img_path
                : ($product->album->img_path ? '/storage/'.$product->album->img_path : '/storage/products/placeholder.png'),
            // Logic for "Sale" badge (optional, assume false for now)
            'isSale' => false,
        ];
    }

    public function show($id)
    {
        // 1. Fetch the product with Album and Artist info
        $product = Product::with(['album.artist', 'album.genres'])->findOrFail($id);

        // 3. Map to the specific interface expected by the Frontend
        $productProps = [
            'id' => $product->id,
            'title' => $product->album->title,
            'format' => $product->format,
            'price' => (float) $product->price,
            'sku' => $product->sku ?? ('SKU-'.str_pad($product->id, 6, '0', STR_PAD_LEFT)),
            'imageSrc' => $product->img_path
                ? '/storage/'.$product->img_path
                : ($product->album->img_path ? '/storage/'.$product->album->img_path : '/storage/products/placeholder.png'),
            'description' => $product->description ?? 'No description available.',
            'quantity' => $product->quantity, // Useful for disabling the "Add to Cart" button
            'artist' => $product->album->artist->name,
            'genres' => $product->album->genres->pluck('name')->toArray(),
        ];

        // 4. Render the Product Detail page
        return Inertia::render('product', [
            'product' => $productProps,
        ]);
    }
}
