<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $fillable = [
        'name',
    ];

    public function albums()
    {
        return $this->belongsToMany(Album::class, 'album_genre');
    }
}
