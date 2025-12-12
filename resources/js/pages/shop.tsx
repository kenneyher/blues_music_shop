'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Loader2 } from 'lucide-react';
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
    links: any[]; // Laravel pagination links
    total: number;
  };
  filters: {
    search?: string;
    sort?: string;
    availability?: string;
  };
}

export default function Shop({
  products = { data: [], links: [], total: 0 },
  filters = {},
}: ShopProps) {
  console.log('products:', products);
  console.log('filters:', filters);
  const safeFilters = Array.isArray(filters) ? {} : (filters ?? {});

  const [sort, setSort] = useState(safeFilters.sort || 'date_new');
  const [search, setSearch] = useState(safeFilters.search || '');

  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const updateFilters = (newFilters: any) => {
    router.get(
      '/shop',
      {
        ...safeFilters,
        ...newFilters,
      },
      // ...
    );
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateFilters({ sort: value });
  };

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    // Simple toggle logic: if checking one, uncheck the other in URL logic,
    // or just send the single selected value.
    // For this example, we'll assume single selection for simplicity.
    const newVal = checked ? value : '';
    updateFilters({ availability: newVal });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search });
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
          setTimeout(() => setAddedToCart(null), 500);
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

        {/* --- MAIN CONTENT --- */}
        <main className="container mx-auto px-4 py-8 md:px-12">
          {/* Breadcrumbs */}
          <div className="mb-6 text-xs text-gray-500">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="font-bold text-gray-800">Exclusives</span>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-[#1a1a1a]">Exclusives</h1>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* --- SIDEBAR FILTERS --- */}
            <aside className="w-full flex-shrink-0 md:w-64">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-[#5bcbf5]">
                  Sort by:
                </span>
                <span className="text-xs text-gray-500">
                  {products.total} results
                </span>
              </div>

              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="mb-8 h-10 w-full rounded-none border-black text-sm font-bold">
                  <SelectValue placeholder="Date, new to old" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_new">Date, new to old</SelectItem>
                  <SelectItem value="date_old">Date, old to new</SelectItem>
                  <SelectItem value="price_low">Price, low to high</SelectItem>
                  <SelectItem value="price_high">Price, high to low</SelectItem>
                </SelectContent>
              </Select>

              <div className="mb-2 text-sm font-bold text-[#5bcbf5]">
                Filter:
              </div>

              <Accordion
                type="multiple"
                defaultValue={['availability']}
                className="w-full"
              >
                <AccordionItem value="availability" className="border-black">
                  <AccordionTrigger className="py-3 text-sm font-bold hover:no-underline">
                    Availability
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-2 flex items-center gap-2">
                      <Checkbox
                        id="instock"
                        checked={filters.availability === 'instock'}
                        onCheckedChange={(c) =>
                          handleAvailabilityChange('instock', c as boolean)
                        }
                      />
                      <label
                        htmlFor="instock"
                        className="cursor-pointer text-sm"
                      >
                        In Stock
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="outstock"
                        checked={filters.availability === 'outstock'}
                        onCheckedChange={(c) =>
                          handleAvailabilityChange('outstock', c as boolean)
                        }
                      />
                      <label
                        htmlFor="outstock"
                        className="cursor-pointer text-sm"
                      >
                        Out of Stock
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </aside>

            {/* --- PRODUCT GRID --- */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {products.data.map((product) => (
                  <div key={product.id} className="group flex flex-col">
                    {/* Image Container */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative mb-4 aspect-square cursor-pointer overflow-hidden border border-gray-200 bg-gray-100">
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
                            (e.target as HTMLImageElement).src =
                              '/storage/products/placeholder.png';
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
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

                    {/* Add to Cart Button */}
                    <Button
                      className="h-9 w-full rounded-sm text-xs font-bold tracking-wider"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id}
                    >
                      {addingToCart === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : addedToCart === product.id ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              {/* --- PAGINATION (Simple) --- */}
              <div className="mt-12 flex justify-center gap-2">
                {products.links.map((link, i) =>
                  link.url ? (
                    <Link
                      key={i}
                      href={link.url}
                      className={`border px-3 py-1 text-sm ${link.active ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="border border-gray-200 px-3 py-1 text-sm text-gray-300"
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
