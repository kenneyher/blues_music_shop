'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input'; // <--- Ensure you import Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

// Define the shape of your data
interface Product {
  id: number;
  artist: string;
  title: string;
  price: number;
  img: string;
  isSale: boolean;
}

interface ShopProps {
  products: {
    data: Product[];
    links: any[];
    total: number;
  };
  allGenres: string[]; // <--- New Prop from Controller
  filters: {
    search?: string;
    sort?: string;
    genre?: string; // <--- Changed from availability
  };
}

export default function Shop({
  products = { data: [], links: [], total: 0 },
  allGenres = [],
  filters = {},
}: ShopProps) {
  
  const safeFilters = Array.isArray(filters) ? {} : (filters ?? {});

  const [sort, setSort] = useState(safeFilters.sort || 'date_new');
  const [search, setSearch] = useState(safeFilters.search || '');
  
  // Cart Loading States
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const updateFilters = (newFilters: any) => {
    router.get(
      '/shop',
      {
        ...safeFilters,
        ...newFilters,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  // --- HANDLERS ---

  const handleSortChange = (value: string) => {
    setSort(value);
    updateFilters({ sort: value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search });
  };

  // Logic to handle multiple genres (e.g. ?genre=Rock,Pop)
  const handleGenreChange = (genre: string, checked: boolean) => {
    const currentGenres = safeFilters.genre ? safeFilters.genre.split(',') : [];
    
    let newGenres;
    if (checked) {
        newGenres = [...currentGenres, genre];
    } else {
        newGenres = currentGenres.filter((g: string) => g !== genre);
    }

    // Join array back to comma string, or undefined if empty
    updateFilters({ genre: newGenres.length > 0 ? newGenres.join(',') : null });
  };

  const handleAddToCart = (productId: number) => {
    setAddingToCart(productId);
    setAddedToCart(null);

    router.post(
      '/cart',
      { product_id: productId, quantity: 1 },
      {
        preserveScroll: true,
        onSuccess: () => {
          setAddingToCart(null);
          setAddedToCart(productId);
          setTimeout(() => setAddedToCart(null), 1500);
        },
        onError: () => {
          setAddingToCart(null);
        },
      },
    );
  };

  return (
    <ShopLayout>
      <div className="min-h-screen bg-background font-sans">
        <Head title="Catalog" />

        <main className="container mx-auto px-4 py-8 md:px-12">
          {/* Breadcrumbs */}
          <div className="mb-6 text-xs text-gray-500">
            <Link href="/home" className="hover:underline">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-bold text-gray-800">Catalog</span>
          </div>

          <h1 className="mb-8 text-3xl font-bold text-[#1a1a1a]">Catalog</h1>

          <div className="flex flex-col gap-8 md:flex-row">
            
            {/* --- SIDEBAR FILTERS --- */}
            <aside className="w-full flex-shrink-0 md:w-64">
              
              {/* 1. SEARCH BAR */}
              <form onSubmit={handleSearch} className="mb-8 relative">
                <Input 
                    placeholder="Search artist, album..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-8"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Sort Dropdown */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#5bcbf5]">Sort by:</span>
                <span className="text-xs text-gray-500">{products.total} results</span>
              </div>

              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="mb-8 h-10 w-full rounded-md border-input text-sm font-bold">
                  <SelectValue placeholder="Date, new to old" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_new">Date, new to old</SelectItem>
                  <SelectItem value="date_old">Date, old to new</SelectItem>
                  <SelectItem value="price_low">Price, low to high</SelectItem>
                  <SelectItem value="price_high">Price, high to low</SelectItem>
                </SelectContent>
              </Select>

              <div className="mb-2 text-sm font-bold text-[#5bcbf5]">Filter:</div>

              <Accordion type="multiple" defaultValue={['genres']} className="w-full">
                
                {/* 2. GENRE FILTER (Replaced Availability) */}
                <AccordionItem value="genres" className="border-border">
                  <AccordionTrigger className="py-3 text-sm font-bold hover:no-underline">
                    Genres
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
                        {allGenres.map((genre) => {
                            const isChecked = safeFilters.genre 
                                ? safeFilters.genre.split(',').includes(genre)
                                : false;

                            return (
                                <div key={genre} className="flex items-center gap-2">
                                <Checkbox
                                    id={`genre-${genre}`}
                                    checked={isChecked}
                                    onCheckedChange={(c) =>
                                        handleGenreChange(genre, c as boolean)
                                    }
                                />
                                <label
                                    htmlFor={`genre-${genre}`}
                                    className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {genre}
                                </label>
                                </div>
                            );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </aside>

            {/* --- PRODUCT GRID --- */}
            <div className="flex-1">
              {products.data.length === 0 ? (
                  <div className="py-20 text-center text-gray-500">
                      No products found matching your filters.
                  </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {products.data.map((product) => (
                    <div key={product.id} className="group flex flex-col">
                        <Link href={`/product/${product.id}`}>
                        <div className="relative mb-4 aspect-square cursor-pointer overflow-hidden border border-gray-200 bg-gray-100 rounded-md">
                            {product.isSale && (
                            <span className="absolute top-0 left-0 z-10 bg-[#5bcbf5] px-2 py-1 text-[10px] font-bold text-white uppercase">
                                Sale
                            </span>
                            )}
                            <img
                            src={product.img}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/storage/products/placeholder.png';
                            }}
                            />
                        </div>
                        </Link>

                        <div className="flex flex-1 flex-col gap-1">
                        <div className="text-[11px] font-bold tracking-wide text-accent uppercase">
                            {product.artist}
                        </div>
                        <Link href={`/product/${product.id}`}>
                            <h3 className="line-clamp-2 min-h-[2.5em] cursor-pointer text-sm leading-tight font-bold text-gray-900 transition-colors group-hover:text-primary">
                            {product.title}
                            </h3>
                        </Link>
                        <div className="mt-1 mb-3 text-sm text-gray-600">
                            ${product.price.toFixed(2)}
                        </div>
                        </div>

                        <Button
                        className="h-9 w-full rounded-sm text-xs font-bold tracking-wider"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart === product.id}
                        >
                        {addingToCart === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : addedToCart === product.id ? (
                            <>
                            <Check className="mr-1 h-4 w-4" /> Added
                            </>
                        ) : (
                            'Add to Cart'
                        )}
                        </Button>
                    </div>
                    ))}
                </div>
              )}

              {/* PAGINATION */}
              <div className="mt-12 flex justify-center gap-2">
                {products.links.map((link, i) =>
                  link.url ? (
                    <Link
                      key={i}
                      href={link.url}
                      className={`rounded px-3 py-1 text-sm border ${link.active ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="border border-gray-200 rounded px-3 py-1 text-sm text-gray-300"
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ShopLayout>
  );
}