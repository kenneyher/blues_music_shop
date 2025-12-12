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
        $query = Product::query()->with('album.artist');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('album', function ($albumQuery) use ($search) {
                    $albumQuery->where('title', 'like', "%{$search}%");
                })->orWhereHas('album.artist', function ($artistQuery) use ($search) {
                    $artistQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->format) {
            $query->where('format', $request->format);
        }

        $products = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/inventory', [
            'products' => $products,
            'filters' => $request->only(['search', 'format']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/create', [
            'genres' => Genre::orderBy('name')->get(),
            'artists' => Artist::orderBy('name')->select('id', 'name')->get(),
            'albums' => Album::with('artist')->orderBy('title')->get(['id', 'title', 'artist_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // ARTIST - matches frontend field names
            'artist_selection' => 'required|in:existing,new',
            'artist_id' => 'nullable|required_if:artist_selection,existing|exists:artists,id',
            'artist_name' => 'nullable|required_if:artist_selection,new|string|max:255',
            'artist_bio' => 'nullable|string',
            'artist_img' => 'nullable|image|max:2048',

            // ALBUM - matches frontend field names
            'album_selection' => 'required|in:existing,new',
            'album_id' => 'nullable|required_if:album_selection,existing|exists:albums,id',
            'album_title' => 'nullable|required_if:album_selection,new|string|max:255',
            'album_release_date' => 'nullable|date',

            // PRODUCT - matches frontend field names
            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',
            'format' => 'required|in:Vinyl,CD,Cassette',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku',
            'image' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        // 1. Resolve Artist
        $artistId = null;
        if ($request->artist_selection === 'existing') {
            $artistId = $request->artist_id;
        } else {
            $artistPath = null;
            if ($request->hasFile('artist_img')) {
                $artistPath = $request->file('artist_img')->store('artists', 'public');
            }

            $artist = Artist::create([
                'name' => $request->artist_name,
                'bio' => $request->artist_bio,
                'img_path' => $artistPath,
            ]);
            $artistId = $artist->id;
        }

        // 2. Resolve Album
        $albumId = null;
        if ($request->album_selection === 'existing') {
            $albumId = $request->album_id;
        } else {
            $album = Album::create([
                'title' => $request->album_title,
                'artist_id' => $artistId,
                'release_date' => $request->album_release_date,
            ]);
            $albumId = $album->id;
        }

        // 3. Sync Genres to Album
        $album = Album::find($albumId);
        $album->genres()->syncWithoutDetaching($request->genre_ids);

        // 4. Handle Product Image
        $productPath = null;
        if ($request->hasFile('image')) {
            $productPath = $request->file('image')->store('products', 'public');
        }

        // 5. Create Product
        Product::create([
            'album_id' => $albumId,
            'format' => $request->format,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'sku' => $request->sku,
            'img_path' => $productPath,
            'description' => $request->description,
        ]);

        return redirect('/admin/inventory')->with('success', 'Product created successfully!');
    }

    public function edit($id)
    {
        $product = Product::with(['album.artist', 'album.genres'])->findOrFail($id);

        return Inertia::render('admin/edit', [
            'product' => $product,
            'genres' => Genre::orderBy('name')->get(),
            'artists' => Artist::orderBy('name')->select('id', 'name')->get(),
            'albums' => Album::with('artist')->orderBy('title')->get(['id', 'title', 'artist_id']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $album = $product->album;

        $validated = $request->validate([
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'format' => 'required|in:Vinyl,CD,Cassette',
            'image' => 'nullable|image|max:2048',
            'album_title' => 'required|string|max:255',
            'album_release_date' => 'nullable|date',
            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',
        ]);

        // 1. Handle Product Image
        if ($request->hasFile('image')) {
            if ($product->img_path && Storage::disk('public')->exists($product->img_path)) {
                Storage::disk('public')->delete($product->img_path);
            }
            $product->img_path = $request->file('image')->store('products', 'public');
        }

        // 2. Update Album
        $album->update([
            'title' => $validated['album_title'],
            'release_date' => $validated['album_release_date'],
        ]);

        // 3. Sync Genres
        $album->genres()->sync($validated['genre_ids']);

        // 4. Update Product
        $product->update([
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'sku' => $validated['sku'],
            'description' => $validated['description'],
            'format' => $validated['format'],
        ]);

        return redirect('/admin/inventory')->with('success', 'Product updated successfully!');
    }
}