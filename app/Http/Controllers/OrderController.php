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
            ->withCount('items')
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
        // 1. Validate Shipping Address
        $rules = [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'address_line' => 'required|string|max:100',
            'apartment' => 'nullable|string|max:50',
            'city' => 'required|string|max:50',
            'country' => 'required|string|max:50',
            'phone' => 'nullable|string|max:20',
            'shipping_method' => 'required|in:standard,express',
            'using_same_billing' => 'required|boolean',
            // Card fields (basic validation - use Stripe in production!)
            'card_number' => 'required|string|min:13|max:19',
            'card_expiry' => 'required|string|size:5',
            'card_cvc' => 'required|string|min:3|max:4',
        ];

        // Add billing validation if different from shipping
        if (!$request->boolean('using_same_billing')) {
            $rules['payment_first_name'] = 'required|string|max:50';
            $rules['payment_last_name'] = 'required|string|max:50';
            $rules['payment_address_line'] = 'required|string|max:100';
            $rules['payment_apartment'] = 'nullable|string|max:50';
            $rules['payment_city'] = 'required|string|max:50';
            $rules['payment_country'] = 'required|string|max:50';
            $rules['payment_phone'] = 'nullable|string|max:20';
        }

        $validated = $request->validate($rules);

        // 2. Get Cart from Session
        $sessionCart = session()->get('cart', []);
        $cartItems = isset($sessionCart['items']) ? $sessionCart['items'] : $sessionCart;

        if (empty($cartItems)) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        // 3. Calculate Totals
        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shipping = $validated['shipping_method'] === 'express' ? 15.00 : 0.00;
        $tax = $subtotal * 0.08;
        $total = $subtotal + $shipping + $tax;

        // 4. Build Address Arrays
        $shippingAddress = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'address_line' => $validated['address_line'],
            'apartment' => $validated['apartment'] ?? null,
            'city' => $validated['city'],
            'country' => $validated['country'],
            'phone' => $validated['phone'] ?? null,
        ];

        $billingAddress = $validated['using_same_billing']
            ? $shippingAddress
            : [
                'first_name' => $validated['payment_first_name'],
                'last_name' => $validated['payment_last_name'],
                'address_line' => $validated['payment_address_line'],
                'apartment' => $validated['payment_apartment'] ?? null,
                'city' => $validated['payment_city'],
                'country' => $validated['payment_country'],
                'phone' => $validated['payment_phone'] ?? null,
            ];

        // 5. Create Order
        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'payment_method' => 'credit_card',
                'shipping_method' => $validated['shipping_method'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shipping,
                'total' => $total,
                'shipping_address' => $shippingAddress,
                'billing_address' => $billingAddress,
                // Don't store full card number! In production use Stripe token
                'card_last_four' => substr($validated['card_number'], -4),
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                ]);
            }

            session()->forget('cart');
            DB::commit();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Order failed: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $order = Order::with(['items.product.album'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $order->items->transform(function ($item) {
            $item->image = '/storage/products/placeholder.png';

            if ($item->product) {
                $item->image = $item->product->img_path
                    ? '/storage/' . $item->product->img_path
                    : ($item->product->album->img_path
                        ? '/storage/' . $item->product->album->img_path
                        : $item->image);
            }

            return $item;
        });

        return Inertia::render('order-details', [
            'order' => $order
        ]);
    }
}