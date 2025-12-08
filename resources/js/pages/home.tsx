'use client';

import { Button } from '@/components/ui/button';
import { PageProps } from '@/types'; // Ensure you have your types defined
import { Head, Link, router, usePage } from '@inertiajs/react'; // <--- Import usePage
import { ArrowUpRight, LogOut, Search, ShoppingCart, User } from 'lucide-react';

// Interface for Product data
interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  img: string;
}

export default function Home({
  newArrivals = [],
  featured = [],
}: {
  newArrivals?: Product[];
  featured?: Product[];
}) {
  // 1. Get the authenticated user from shared props
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  console.log(newArrivals, featured);

  return (
    <>
      <Head title="Welcome" />

      <div className="min-h-screen bg-[#FDFBF7] font-sans text-black selection:bg-black selection:text-white">
        {/* --- NAVBAR --- */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="text-xl font-bold tracking-tighter">Blue's Music</div>

          <div className="hidden gap-8 text-sm font-medium md:flex">
            <Link href="/shop" className="hover:underline">
              Catalog
            </Link>
            <Link href="#" className="hover:underline">
              News
            </Link>
            <Link href="#" className="hover:underline">
              Collections
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 cursor-pointer text-gray-600 hover:text-black" />

            {/* --- AUTH BUTTONS --- */}
            {user ? (
              // IF LOGGED IN: Show Profile & Logout
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  {' '}
                  {/* Or /admin/dashboard based on role */}
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 font-bold"
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
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => router.post('logout')} // Triggers the POST request directly
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // IF GUEST: Show Log In
              <Link href="login">
                <Button variant="ghost" className="font-bold">
                  Log in
                </Button>
              </Link>
            )}

            <div className="mx-2 hidden h-6 w-px bg-gray-300 md:block"></div>

            <Button
              size="icon"
              className="rounded-full bg-black text-white hover:bg-black/80"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <header className="relative w-full overflow-hidden px-6 pt-12 pb-24 md:px-12 md:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="relative z-10 max-w-xl">
              <h1 className="mb-8 text-7xl leading-[0.9] font-black tracking-tighter md:text-9xl">
                Record <br />
                & vinyl <br />
                market
              </h1>
              <p className="mb-10 max-w-sm text-lg leading-relaxed font-medium text-gray-600 md:text-xl">
                Expand your vinyl record collection and find the perfect record
                player with us.
              </p>

              <Link href="/shop">
                <div className="group inline-flex cursor-pointer items-center gap-0 rounded-full border border-black p-1 pl-6 transition-all duration-300 hover:bg-black hover:text-white">
                  <span className="mr-4 text-lg font-bold">
                    select in the catalog
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="pointer-events-none absolute top-0 right-[-15%] h-[60vw] max-h-[800px] w-[60vw] max-w-[800px] animate-[spin_20s_linear_infinite] opacity-90 md:right-[-10%] md:h-[45vw] md:w-[45vw]">
              {/* Replace with your local asset if preferred */}
              <img
                src="https://pngimg.com/uploads/vinyl/vinyl_PNG33.png"
                alt="Vinyl Record"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </header>

        {/* --- NEW PRODUCTS SECTION --- */}
        <section className="px-6 py-16 md:px-12">
          <div className="mb-8 flex items-end justify-between border-b border-black pb-4">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              new products
            </h2>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-bold hover:underline md:flex"
            >
              [watch all] <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {newArrivals.map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button className="rounded-full bg-white text-black hover:bg-white/90">
                      Quick View
                    </Button>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg leading-tight font-bold group-hover:underline">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.artist}</p>
                  </div>
                  <span className="rounded-full border border-black px-2 py-0.5 text-sm font-bold">
                    ${item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- FEATURED SECTION --- */}
        <section className="bg-white px-6 py-16 md:px-12">
          <div className="mb-8 flex items-end justify-between border-b border-black pb-4">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              featured vinyls
            </h2>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-bold hover:underline md:flex"
            >
              [watch all] <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {featured.map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="group cursor-pointer rounded-xl p-4 transition-colors hover:bg-gray-50"
              >
                <div className="mb-4 flex aspect-[4/3] items-center justify-center">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-md mb-1 font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.artist}</p>
                  <p className="mt-2 font-bold">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-black px-6 py-12 text-center text-white md:px-12 md:text-left">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <h2 className="mb-2 text-2xl font-bold">Blue's Music Shop</h2>
              <p className="text-sm text-gray-400">
                © 2025 All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">
                Instagram
              </a>
              <a href="#" className="hover:text-white">
                Twitter
              </a>
              <a href="#" className="hover:text-white">
                Facebook
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
