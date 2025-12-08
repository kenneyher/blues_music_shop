<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Genre;
use App\Models\Artist;
use App\Models\Album;

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

    public function create() {
        return Inertia::render('admin/create', [
            'genres' => Genre::orderBy('name')->select('id', 'name')->get(),
            'artists' => Artist::orderBy('name')->select('id', 'name')->get(),
            'albums' => Album::orderBy('title')->select('id', 'title', 'artist_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'artist_selection' => 'required|string', // 'existing' or 'new'
            'artist_id' => 'nullable|required_if:artist_selection,existing|exists:artists,id',
            'artist_name' => 'nullable|required_if:artist_selection,new|string|max:255',
            'artist_bio' => 'nullable|string',
            'artist_img' => 'nullable|image|max:2048', // Max 2MB

            'album_selection' => 'required|string', // 'existing' or 'new'
            'album_id' => 'nullable|required_if:album_selection,existing|exists:albums,id',
            'album_title' => 'nullable|required_if:album_selection,new|string|max:255',
            'album_release_date' => 'nullable|date',

            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',

            'format' => 'required|string|in:CD,Vinyl',
            'sku' => 'required|string|max:255|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $artistId = null;
        if ($request->artist_selection === 'existing') {
            $artistId = $validated['artist_id'];
        } else {
            $artistImg = $request->file('artist_img') ? 
                $request->file('artist_img')->store('artists', 'public') 
                : null;
            
            $artist = Artist::create([
                'name' => $validated['artist_name'],
                'bio' => $validated['artist_bio'] ?? '',
                'image' => $artistImg,
            ]);
            $artistId = $artist->id;
        }

        $albumId = null;
        if ($request->album_selection === 'existing') {
            $albumId = $validated['album_id'];
        } else {
            $album = Album::create([
                'title' => $validated['album_title'],
                'artist_id' => $artistId,
                'release_date' => $validated['album_release_date'] ?? null,
            ]);
            $albumId = $album->id;
        }

        $album = Album::find($albumId);
        $album->genres()->syncWithoutDetaching($validated['genre_ids']);

        $imgPath = null;
        if ($request->hasFile('image')) {
            $imgPath = $request->file('image')->store('covers', 'public');
        }


        Product::create([
            'album_id' => $albumId,
            'format' => $validated['format'],
            'sku' => $validated['sku'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'image'=> $imgPath
        ]);

        return redirect()->route('admin.inventory')->with('success', 'Product added successfully!');
    }
}
