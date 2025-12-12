<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {

        $user = Auth::user();

        // Fetch addresses and group them by type (shipping/billing)
        $addresses = $user->addresses()
            ->orderBy('is_default', 'desc') // Show defaults first
            ->get()
            ->groupBy('type');

        return Inertia::render('profile', [
            'user' => $user,
            'shippingAddresses' => $addresses->get('shipping', []),
            'billingAddresses' => $addresses->get('billing', []),
            'ordersCount' => $user->orders()->count(),
        ]);
    }

    public function storeAddress(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:shipping,billing',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'is_default' => 'boolean',
        ]);

        $user = $request->user();

        // If setting as default, unset previous default for this type
        if ($validated['is_default']) {
            $user->addresses()
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        $user->addresses()->create($validated);

        return redirect()->back();
    }

    public function updateDefaultAddress(Request $request)
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'type' => 'required|in:shipping,billing',
        ]);

        $user = $request->user();

        // Unset previous default
        $user->addresses()
            ->where('type', $validated['type'])
            ->update(['is_default' => false]);

        // Set new default
        $user->addresses()
            ->where('id', $validated['address_id'])
            ->update(['is_default' => true]);

        return redirect()->back();
    }

    public function destroyAddress(Request $request)
    {
        $user = $request->user();

        $address = $user->addresses()->where('id', $request->id)->firstOrFail();

        $address->delete();

        return redirect()->back();
    }
}
