<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Artist;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Album>
 */
class AlbumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3), // Generate a 3-word title
            'release_date' => fake()->date(),
            'img_path' => 'albums/default.jpg',
            // If no artist is provided, create a new one automatically
            'artist_id' => Artist::factory(),
        ];
    }
}
