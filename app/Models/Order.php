<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'payment_method',
        'subtotal',
        'shipping_cost',
        'shipping_method',
        'card_last_four',
        'shipping_address',
        'billing_address',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
    ];

    protected $appends = ['total'];

    // ---- Relations ----
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ---- Accessors ----
    public function getTotalAttribute(): float
    {
        return round($this->subtotal + $this->shipping_cost, 2);
    }
}