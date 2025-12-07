<?php

namespace Database\Seeders;

use App\Models\Album;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->admin()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('12345678'),
        ]);

        $rock = Genre::create(['name' => 'Rock']);
        $blues = Genre::create(['name' => 'Blues']);
        $jazz = Genre::create(['name' => 'Jazz']);
        $pop = Genre::create(['name' => 'Pop']);

        $beatles = Artist::create([
            'name' => 'The Beatles',
            'bio' => 'An English rock band formed in Liverpool in 1960.',
            'img_path' => 'artists/thebeatles.jpg',
        ]);
        $mj = Artist::create([
            'name' => 'Michael Jackson',
            'bio' => 'An American singer, songwriter, and dancer, dubbed the "King of Pop".',
            'img_path' => 'artists/michaeljackson.jpg',
        ]);
        $frank = Artist::create([
            'name' => 'Frank Sinatra',
            'bio' => 'An American singer and actor, one of the best-selling music artists of all time.',
            'img_path' => 'artists/franksinatra.jpg',
        ]);

        $abbey = Album::create([
            'title' => 'Abbey Road',
            'artist_id' => $beatles->id,
            'release_date' => '1969-09-26',
        ]);
        $thriller = Album::create([
            'title' => 'Thriller',
            'artist_id' => $mj->id,
            'release_date' => '1982-11-30',
        ]);
        $myway = Album::create([
            'title' => 'My Way',
            'artist_id' => $frank->id,
            'release_date' => '1969-03-14',
        ]);

        $abbey->genres()->attach([$rock->id, $blues->id]);
        $thriller->genres()->attach([$pop->id, $rock->id]);
        $myway->genres()->attach([$jazz->id]);

        Product::create([
            'album_id' => $abbey->id,
            'format' => 'Vinyl',
            'price' => 29.99,
            'quantity' => 50,
            'img_path' => 'albums/abbeyroad.jpg',
            'sku' => 'ABBEY-VINYL-001',
            'description' => 'Classic Abbey Road album on vinyl.',
        ]);
        Product::create([
            'album_id' => $thriller->id,
            'format' => 'Vinyl',
            'price' => 25.65,
            'quantity' => 24,
            'img_path' => 'albums/thriller.jpg',
            'sku' => 'THRILLER-VINYL-001',
            'description' => 'Classic Thriller album on vinyl.',
        ]);
        Product::create([
            'album_id' => $thriller->id,
            'format' => 'CD',
            'price' => 12.00,
            'quantity' => 94,
            'img_path' => 'albums/thriller.jpg',
            'sku' => 'THRILLER-CD-001',
            'description' => 'Classic Thriller album on CD.',
        ]);
        Product::create([
            'album_id' => $myway->id,
            'format' => 'Vinyl',
            'price' => 43.60,
            'quantity' => 48,
            'img_path' => 'albums/myway.jpg',
            'sku' => 'MYWAY-VINYL-002',
            'description' => 'Studio Album My Way on vinyl.',
        ]);
    }
}
