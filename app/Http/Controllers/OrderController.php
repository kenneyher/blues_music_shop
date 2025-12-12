<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    // =============================================
    // USER METHODS
    // =============================================

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
                    'total' => $order->total,
                    'items_count' => $order->items_count,
                ];
            });

        return Inertia::render('orders', [
            'orders' => $orders
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['items.product.album'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $this->transformOrderItems($order);

        return Inertia::render('order-details', [
            'order' => $order
        ]);
    }

    public function store(Request $request)
    {
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
            'card_number' => 'required|string|min:13|max:19',
            'card_expiry' => 'required|string|size:5',
            'card_cvc' => 'required|string|min:3|max:4',
        ];

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

        $sessionCart = session()->get('cart', []);
        $cartItems = isset($sessionCart['items']) ? $sessionCart['items'] : $sessionCart;

        if (empty($cartItems)) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shipping = $validated['shipping_method'] === 'express' ? 15.00 : 0.00;
        $tax = $subtotal * 0.08;
        $total = $subtotal + $shipping + $tax;

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
                'card_last_four' => substr($validated['card_number'], -4),
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                ]);

                $product = Product::find($item['id']);
                if ($product) {
                    $product->decrement('quantity', $item['quantity']);
                }
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

    // =============================================
    // ADMIN METHODS
    // =============================================

    public function adminIndex(Request $request)
    {
        $query = Order::with('user')->withCount('items');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by order ID or customer name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('dir', 'desc');
        $query->orderBy($sortField, $sortDir);

        $orders = $query->paginate(15)->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'customer' => $order->user->name ?? 'Guest',
                'email' => $order->user->email ?? 'N/A',
                'date' => $order->created_at->format('M d, Y H:i'),
                'status' => $order->status,
                'total' => $order->total,
                'items_count' => $order->items_count,
                'shipping_method' => $order->shipping_method,
            ];
        });

        // Get status counts for filter badges
        $statusCounts = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search', 'sort', 'dir']),
            'statusCounts' => $statusCounts,
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        ]);
    }

    public function adminShow($id)
    {
        $order = Order::with(['user', 'items.product.album.artist'])->findOrFail($id);

        $this->transformOrderItems($order);

        return Inertia::render('admin/order-details', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'customer' => [
                    'name' => $order->user->name ?? 'Guest',
                    'email' => $order->user->email ?? 'N/A',
                ],
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'shipping_method' => $order->shipping_method,
                'payment_method' => $order->payment_method,
                'card_last_four' => $order->card_last_four,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'shipping_cost' => $order->shipping_cost,
                'total' => $order->total,
                'items' => $order->items,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'updated_at' => $order->updated_at->format('M d, Y H:i'),
            ],
            'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        ]);
    }

    public function adminUpdate(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => $validated['status']]);

        // If cancelled, restore product quantities
        if ($validated['status'] === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('quantity', $item->quantity);
                }
            }
        }

        return redirect()->back()->with('success', 'Order status updated to ' . ucfirst($validated['status']));
    }

    // =============================================
    // HELPER METHODS
    // =============================================

    private function transformOrderItems(Order $order): void
    {
        $order->items->transform(function ($item) {
            $item->image = '/storage/products/placeholder.png';
            $item->title = 'Unknown Product';
            $item->artist = 'Unknown Artist';

            if ($item->product) {
                $item->image = $item->product->img_path
                    ? '/storage/' . $item->product->img_path
                    : ($item->product->album->img_path
                        ? '/storage/' . $item->product->album->img_path
                        : $item->image);
                $item->title = $item->product->album->title ?? 'Unknown';
                $item->artist = $item->product->album->artist->name ?? 'Unknown';
            }

            return $item;
        });
    }
}