<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        // 1. Get Session Data
        $sessionData = session()->get('cart', []);

        // 2. Handle both structures (Direct items OR wrapped in 'items' key)
        // This fixes the conflict between your store() method and your comments.
        if (isset($sessionData['items'])) {
            $items = $sessionData['items'];
        } else {
            $items = $sessionData;
        }

        $user = auth()->user();
        $defaultShipping = $user ? $user->addresses()->where('type', 'shipping')->where('is_default', true)->first() : null;
        $defaultBilling = $user ? $user->addresses()->where('type', 'billing')->where('is_default', true)->first() : null;

        return Inertia::render('cart', [
            'cart' => array_values($items),
            'defaultShipping' => $defaultShipping,
            'defaultBilling' => $defaultBilling,
        ]);

    }

    public function store(Request $request)
    {
        $product = Product::with('album.artist')->findOrFail($request->product_id);
        $quantity = $request->input('quantity', 1);

        $cart = session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $quantity;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'title' => $product->album->title,
                'artist' => $product->album->artist->name,
                'price' => $product->price,
                'img' => $product->img_path
                    ? '/storage/'.$product->img_path
                    : ($product->album->img_path ? '/storage/'.$product->album->img_path : 'storage/products/placeholder.png'),
                'quantity' => $quantity,
                'max_quantity' => $product->stock_quantity,
            ];
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request, $id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $request->input('quantity', $cart[$id]['quantity']);
            session()->put('cart', $cart);

            return redirect()->back()->with('success', 'Cart updated successfully!');
        }

        return redirect()->back()->with('error', 'Product not found in cart.');
    }

    public function destroy($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]); // Removes the item from the array
            session()->put('cart', $cart); // Save the new state

            return redirect()->back()->with('success', 'Item removed from cart.');
        }

        return redirect()->back()->with('error', 'Item not found in cart.');
    }
}
