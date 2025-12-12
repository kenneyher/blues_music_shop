'use client';

import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Search, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const { auth, cart } = usePage<PageProps>().props;
  const user = auth.user;
  const cartCount = cart ? cart.count : 0;

  return (
    <header className="z-50 w-full bg-accent text-accent-foreground shadow-sm">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-xl font-bold tracking-tighter">Blue's Music</div>

        <div className="hidden gap-8 text-sm font-medium md:flex">
          <Link href="/shop" className="hover:underline">
            Catalog
          </Link>
        </div>

        <div className="flex items-center gap-4">

          {/* --- AUTH BUTTONS --- */}
          {user ? (
            // IF LOGGED IN: Show Profile & Logout
            <div className="flex items-center gap-2">
              <Link href="/profile">
                {/* Or /admin/dashboard based on role */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 font-bold hover:bg-primary hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                  {user.first_name}
                </Button>
              </Link>

              {/* Logout must be a POST request */}
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-background hover:bg-primary hover:text-accent-foreground"
                onClick={() => router.post('/logout')} // Triggers the POST request directly
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // IF GUEST: Show Log In
            <Link href="/login">
              <Button variant="ghost" className="font-bold">
                Log in
              </Button>
            </Link>
          )}

          <div className="mx-2 hidden h-6 w-px bg-gray-300 md:block"></div>

          <Link href="/cart/index" className="relative">
            <Button
              size="icon"
              className="relative rounded-full bg-black text-white hover:bg-black/80"
            >
              <ShoppingCart className="h-4 w-4" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
