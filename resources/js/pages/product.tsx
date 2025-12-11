import { Button } from '@/components/ui/button';
import ShopLayout from '@/layouts/shop-layout';
import { Head } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Product {
  id: number;
  title: string;
  format: string;
  price: number;
  sku: string;
  description: string;
  imageSrc: string;
  quantity: number;
  artist: string;
  genres: string[];
}

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    router.post('/cart', {
      product_id: product.id,
      quantity: quantity
    });
  };

  return (
    <ShopLayout>
      <div className="relative min-h-screen min-w-full bg-background font-sans text-foreground overflow-hidden">
        <Head title={product.title} />

        {/* --- BACKGROUND GRADIENTS (Fixed) --- */}
        {/* Left Glow (Bottom-Left) */}
        <div className="pointer-events-none fixed bottom-[10rem] left-[-10em] z-0 h-1/2 w-sm rounded-full bg-accent/50 blur-[120px]" />
        
        {/* Right Glow (Top-Right) */}
        <div className="pointer-events-none fixed top-0 right-[-10em] z-0 h-1/2 w-sm rounded-full bg-linear-to-br from-accent to-primary/50 blur-[120px]" />

        {/* --- MAIN CONTENT --- */}
        {/* Added relative and z-10 to ensure content sits ABOVE the gradients */}
        <main className="container relative z-10 mx-auto flex flex-col justify-center gap-12 px-4 py-12 lg:flex-row lg:py-20">
          
          {/* --- LEFT COLUMN: Sticky Image --- */}
          <div className="relative overflow-visible lg:w-lg">
            <div className="sticky top-25 lg:top-24">
              <div className="flex items-center justify-center rounded-sm bg-muted/50 p-8 backdrop-blur-sm">
                <img
                  src={product.imageSrc}
                  alt={product.title}
                  className="w-full max-w-xl rounded-sm object-contain shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Product Details --- */}
          <div className="flex flex-col gap-6 lg:w-lg">
            {/* Header Info */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-accent">
                {product.title}
              </h1>
              <h2 className="text-2xl font-bold text-primary">
                {product.artist}
              </h2>
              <p className="mt-2 text-2xl text-muted-foreground">
                {product.format}
              </p>
            </div>

            {/* Price & Shipping */}
            <div>
              <p className="text-2xl font-medium text-primary text-shadow-[0_0_0.5em] text-shadow-primary">
                ${product.price.toFixed(2)} USD
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="cursor-pointer underline">Shipping</span>{' '}
                calculated at checkout.
              </p>
            </div>

            {/* SKU */}
            <p className="text-xs tracking-wider text-gray-500 uppercase">
              {product.sku}
            </p>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm mb-2 font-bold">Quantity</label>
              <div className="flex h-12 w-32 items-center overflow-hidden rounded-sm border border-foreground bg-background/50 backdrop-blur-sm">
                <button
                  onClick={handleDecrement}
                  className="flex h-full w-10 items-center justify-center transition-colors hover:bg-muted"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex h-full flex-1 items-center justify-center text-lg font-bold">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.quantity}
                  className="flex h-full w-10 items-center justify-center transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="default"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="h-12 w-full text-lg font-bold shadow-lg"
            >
              {product.quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </Button>

            {/* Product Description */}
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </main>
      </div>
    </ShopLayout>
  );
}