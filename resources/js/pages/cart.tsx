'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  img: string;
}

export default function Cart({ cart }: { cart: CartItem[] }) {
  const { data, setData, processing, errors, post } = useForm({
    method: 'POST',
    first_name: '',
    last_name: '',
    address_line: '',
    apartment: '',
    city: '',
    country: '',
    phone: '',
    payment: 'standard',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', data);
    console.log('Form errors:', errors);
    post('/orders');
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <ShopLayout>
      <Head title="Your Cart" />

      <div className="w-screen">
        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-xl text-gray-500">Your cart is empty.</p>
            <Link
              href="/shop"
              className="font-bold underline hover:text-blue-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex min-h-screen flex-col lg:flex-row">
            {/* LEFT: Form Section (scrollable) */}
            <section className="max-w-1/2 flex-1 overflow-y-auto border-muted-foreground/50 lg:border-r-2">
              <div className="mx-auto max-w-lg p-6 lg:p-12">
                <h1 className="mb-8 text-4xl font-bold tracking-tight">
                  Shopping Bag ({cart.length})
                </h1>

                <form onSubmit={handleSubmit}>
                  <h3 className="mb-4 text-lg font-semibold">Shipping</h3>
                  <div className="flex flex-row gap-4">
                    <div className="flex w-1/2 flex-col">
                      <Input
                        type="text"
                        value={data.first_name}
                        placeholder="First Name"
                        className="w-full"
                        onChange={(e) => setData('first_name', e.target.value)}
                      />
                      {errors.first_name && (
                        <p className="text-sm text-red-500">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 flex w-1/2 flex-col">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="w-full"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                      />
                      {errors.last_name && (
                        <p className="text-sm text-red-500">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex-col">
                    <Input
                      type="text"
                      placeholder="Address Line"
                      className="w-full"
                      value={data.address_line}
                      onChange={(e) => setData('address_line', e.target.value)}
                    />
                    {errors.address_line && (
                      <p className="mb-4 text-sm text-red-500">
                        {errors.address_line}
                      </p>
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="Appartment, suite, etc. (optional)"
                    className="mb-4 w-full"
                    value={data.apartment}
                    onChange={(e) => setData('apartment', e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Country"
                    className="mb-4 w-full"
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                  />
                  {errors.country && (
                    <span className="mb-4 text-sm text-red-500">
                      {errors.country}
                    </span>
                  )}
                  <Input
                    type="text"
                    placeholder="City"
                    className="mb-4 w-full"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                  />
                  {errors.city && (
                    <span className="mb-4 text-sm text-red-500">
                      {errors.city}
                    </span>
                  )}
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    className="mb-4 w-full"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                  />
                  {errors.phone && (
                    <span className="mb-4 text-sm text-red-500">
                      {errors.phone}
                    </span>
                  )}

                  <RadioGroup
                    defaultValue="standard"
                    className="flex-col gap-0"
                    value={data.payment}
                    onValueChange={(value) => setData('payment', value)}
                  >
                    <div className="flex flex-col rounded-t-md border-2 border-muted/50 p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="ml-2">
                          Standard Shipping - 7-15 Business Days
                        </Label>
                      </div>
                      <span className="ml-6 text-sm text-muted-foreground">
                        Deliveries can take more time depending on your
                        location.
                      </span>
                    </div>
                    <div className="flex flex-col rounded-b-md border-2 border-muted/50 p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="ml-2">
                          Express Shipping - 4-5 Business Days
                        </Label>
                      </div>
                      <span className="ml-6 text-sm text-muted-foreground">
                        International Rapid
                      </span>
                    </div>
                  </RadioGroup>

                  <h3 className="mt-6 mb-4 text-lg font-semibold">
                    Payment Method
                  </h3>

                  <Button
                    className="mt-4 h-12 w-full text-lg font-bold"
                    type="submit"
                  >
                    CHECKOUT
                  </Button>
                </form>
              </div>
            </section>

            {/* RIGHT: Products + Summary (sticky) */}
            <section className="bg-muted lg:w-1/2 lg:flex-shrink-0">
              <div className="sticky top-24 p-6 lg:p-8">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Image with quantity badge */}
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <div className="h-full w-full overflow-hidden rounded-md border-3 border-accent shadow-[0_0_0.75rem] shadow-accent">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white shadow-[0_0_0.75rem] shadow-accent">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-accent">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.artist}
                          </p>
                        </div>
                        <p className="text-md font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 space-y-3 border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-2xl font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-black text-tertiary text-shadow-[0_0_0.75rem] text-shadow-tertiary">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-400">
                      Calculated at checkout
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
