<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Album;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'format' => fake()->randomElement(['Vinyl', 'CD']),
            'price' => fake()->randomFloat(2, 15, 60), // Random price between 15.00 and 60.00
            'quantity' => fake()->numberBetween(0, 100),
            'sku' => strtoupper(fake()->unique()->bothify('???-#####')), // e.g. "ABC-12345"
            'description' => fake()->paragraph(),
            'img_path' => 'albums/default.jpg',

            // If no album is provided, create a new one automatically
            'album_id' => Album::factory(),
        ];
    }

    public function randomPrice(): int 
    {
        return (int) fake()->randomFloat(2, 15, 60);
    }

}
