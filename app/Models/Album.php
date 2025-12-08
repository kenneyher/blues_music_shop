<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    protected $fillable = [
        'title',
        'artist_id',
        'release_date',
    ];

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'album_genre');
    }
}
