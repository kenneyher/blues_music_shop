<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'album_id',
        'format',
        'price',
        'quantity',
        'sku',
        'description',
        'img_path',
    ];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
