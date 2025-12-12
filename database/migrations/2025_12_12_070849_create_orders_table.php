<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\OrderStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Status Management
            $table->enum('status', array_column(OrderStatus::cases(), 'value'))->default(OrderStatus::PENDING->value);
            $table->string('payment_method')->default('credit_card');
            
            // Financials
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->string('shipping_method')->default('standard');
            $table->string('card_last_four', 4)->nullable();
            
            // Address Snapshots
            $table->json('shipping_address');
            $table->json('billing_address');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
