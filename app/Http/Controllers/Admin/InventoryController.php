<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        // ... (Same as before)
        $query = Product::with(['album.artist', 'album.genres']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('album', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('artist', function ($aq) use ($search) {
                        $aq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('genres', function ($gq) use ($search) {
                        $gq->where('name', 'like', "%{$search}%");
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

    public function create()
    {
        return Inertia::render('admin/create', [
            'genres' => Genre::orderBy('name')->get(),
            'artists' => Artist::orderBy('name')->select('id', 'name')->get(),
            'albums' => Album::with('artist')->orderBy('title')->select('id', 'title', 'artist_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // ... (Same validation rules as before) ...
            'artist_selection' => 'required|string',
            'artist_id' => 'nullable|required_if:artist_selection,existing|exists:artists,id',
            'new_artist_name' => 'nullable|required_if:artist_selection,new|string|max:255',
            'new_artist_bio' => 'nullable|string',
            'new_artist_image' => 'nullable|image|max:2048',

            'album_selection' => 'required|string',
            'album_id' => 'nullable|required_if:album_selection,existing|exists:albums,id',
            'new_album_title' => 'nullable|required_if:album_selection,new|string|max:255',
            'new_album_release_date' => 'nullable|date',

            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',
            'format' => 'required|in:Vinyl,CD,Cassette',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku',
            'product_image' => 'nullable|image|max:2048',

            // NEW: Description
            'description' => 'nullable|string',
        ]);

        // ... (Artist/Album creation logic same as before) ...
        // [Copy the Artist/Album resolution logic from previous step here]

        // --- REPEATING LOGIC FOR CONTEXT ---
        $artistId = null;
        if ($request->artist_selection === 'existing') {
            $artistId = $request->artist_id;
        } else {
            $artistPath = $request->file('new_artist_image') ? $request->file('new_artist_image')->store('artists', 'public') : null;
            $artist = Artist::create([
                'name' => $request->new_artist_name,
                'bio' => $request->new_artist_bio,
                'img_path' => $artistPath,
            ]);
            $artistId = $artist->id;
        }

        $albumId = null;
        if ($request->album_selection === 'existing') {
            $albumId = $request->album_id;
        } else {
            $albumPath = $request->file('new_album_image') ? $request->file('new_album_image')->store('albums', 'public') : null;
            $album = Album::create([
                'title' => $request->new_album_title,
                'artist_id' => $artistId,
                'release_date' => $request->new_album_release_date,
            ]);
            $albumId = $album->id;
        }

        $album = Album::find($albumId);
        $album->genres()->syncWithoutDetaching($request->genre_ids);

        // --- CREATE PRODUCT ---
        $productPath = $request->file('product_image') ? $request->file('product_image')->store('products', 'public') : null;

        Product::create([
            'album_id' => $albumId,
            'format' => $request->format,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'sku' => $request->sku,
            'img_path' => $productPath,
            'description' => $request->description, // Added
        ]);

        return redirect('/admin/inventory')->with('success', 'Product created successfully!');
    }

    // --- NEW: EDIT PAGE ---
    public function edit($id)
    {
        $product = Product::with(['album.artist', 'album.genres'])->findOrFail($id);

        return Inertia::render('admin/edit', [
            'product' => $product,
            'genres' => Genre::orderBy('name')->get(),
            // We only really need options if we want to allow changing the album/artist entirely
            // For this example, let's assume we are mostly editing Product details,
            // but we'll pass the lists just in case you want to swap the album.
            'artists' => Artist::orderBy('name')->select('id', 'name')->get(),
            'albums' => Album::with('artist')->orderBy('title')->select('id', 'title', 'artist_id')->get(),
        ]);
    }

    // --- NEW: UPDATE LOGIC ---
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $album = $product->album;

        $validated = $request->validate([
            // --- PRODUCT FIELDS ---
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0', // Renamed from stock_quantity
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'format' => 'required|in:Vinyl,CD,Cassette',
            'product_image' => 'nullable|image|max:2048', // Image is now here

            // --- ALBUM FIELDS ---
            'album_title' => 'required|string|max:255',
            'release_date' => 'nullable|date',
            // Removed album_image validation

            // --- GENRES ---
            'genre_ids' => 'required|array|min:1', 
            'genre_ids.*' => 'exists:genres,id',
        ]);

        // 1. Handle PRODUCT Image Upload
        if ($request->hasFile('product_image')) {
            // Delete old image if it exists
            if ($product->img_path && Storage::disk('public')->exists($product->img_path)) {
                Storage::disk('public')->delete($product->img_path);
            }
            
            // Store new one
            $path = $request->file('product_image')->store('products', 'public');
            $product->img_path = $path;
        }

        // 2. Update Album Info (Title & Date only)
        $album->update([
            'title' => $validated['album_title'],
            'release_date' => $validated['release_date'],
        ]);

        // 3. Sync Genres
        $album->genres()->sync($validated['genre_ids']);

        // 4. Update Product Info
        $product->update([
            'price' => $validated['price'],
            'quantity' => $validated['quantity'], // Renamed
            'sku' => $validated['sku'],
            'description' => $validated['description'],
            'format' => $validated['format'],
            // img_path is saved above if changed
        ]);

        return redirect('/admin/inventory')->with('success', 'Product updated successfully!');
    }
}
