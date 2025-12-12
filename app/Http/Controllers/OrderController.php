<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->withCount('items') // Efficiently count items without loading them all
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'date' => $order->created_at->format('M d, Y'),
                    'status' => ucfirst($order->status),
                    'total' => $order->subtotal + $order->shipping_cost,
                    'items_count' => $order->items_count,
                ];
            });

        return Inertia::render('orders', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validate the Address Data
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'address_line' => 'required|string|max:100',
            'city' => 'required|string|max:50',
            'appartment' => 'nullable|string|max:50',
            'country' => 'required|string|max:50',
            'phone' => 'nullable|string|max:20',
        ]);

        // 2. Get Cart from Session
        $sessionCart = session()->get('cart', []);
        
        // Handle your cart structure (wrapped in 'items' or direct)
        $cartItems = isset($sessionCart['items']) ? $sessionCart['items'] : $sessionCart;

        if (empty($cartItems)) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        // 3. Calculate Totals (Backend side for security)
        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shipping = 0; // Logic for shipping cost goes here (e.g., if $subtotal < 50)
        $tax = $subtotal * 0.08; // Example: 8% tax
        $total = $subtotal + $shipping + $tax;

        // 4. Create Order in Database (Use Transaction for safety)
        try {
            DB::beginTransaction();

            // A. Create the Master Order Record
            $order = Order::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'payment_method' => 'credit_card', // Placeholder
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'shipping_address' => $validated, // Save address snapshot
                'billing_address' => $validated,  // duplicating for now
            ]);

            // B. Create Order Items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'], // Snapshot of price
                ]);
            }

            // C. Clear the Cart Session
            session()->forget('cart');

            DB::commit();

            return redirect()->route('home', $order->id)->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Order failed: ' . $e->getMessage());
        }
    }

    // Display the Confirmation Page / Order Details
    public function show($id)
    {
        $order = Order::with(['items.product.album']) // Load product to get images
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        // Transform items to include the resolved image URL
        $order->items->transform(function ($item) {
            $item->image = '/storage/products/placeholder.png'; // Default
            
            if ($item->product) {
                $item->image = $item->product->img_path 
                    ? '/storage/' . $item->product->img_path 
                    : ($item->product->album->img_path ? '/storage/' . $item->product->album->img_path : $item->image);
            }
            
            return $item;
        });

        return Inertia::render('order-details', [
            'order' => $order
        ]);
    }
}