'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CreditCard, Lock } from 'lucide-react'; // Added icons for visual trust
import { useState } from 'react';

interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  img: string;
}

export default function Cart({ cart }: { cart: CartItem[] }) {
  const [sameAsBilling, setSameAsBilling] = useState<boolean>(true);

  const { data, setData, processing, errors, post } = useForm({
    method: 'POST',
    first_name: '',
    last_name: '',
    address_line: '',
    apartment: '',
    city: '',
    country: '',
    phone: '',
    payment: 'card',
    // New Card Fields
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    using_same_billing: true as boolean,

    payment_first_name: '',
    payment_last_name: '',
    payment_address_line: '',
    payment_apartment: '',
    payment_city: '',
    payment_country: '',
    payment_phone: '',
    shipping_method: 'standard',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/orders');
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <ShopLayout>
      <Head title="Checkout" />

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
            {/* LEFT: Form Section */}
            <section className="max-w-1/2 flex-1 overflow-y-auto border-muted-foreground/50 lg:border-r-2">
              <div className="mx-auto max-w-lg p-6 lg:p-12">
                <h1 className="mb-8 text-4xl font-bold tracking-tight">
                  Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                  {/* --- SHIPPING --- */}
                  <h3 className="mb-4 text-lg font-semibold">Shipping</h3>
                  <div className="rounded-md border bg-muted/10 p-4">
                    <div className="flex flex-row gap-4">
                      <div className="flex w-1/2 flex-col">
                        <Input
                          type="text"
                          value={data.first_name}
                          placeholder="First Name"
                          className="w-full"
                          onChange={(e) =>
                            setData('first_name', e.target.value)
                          }
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
                        onChange={(e) =>
                          setData('address_line', e.target.value)
                        }
                      />
                      {errors.address_line && (
                        <p className="mb-4 text-sm text-red-500">
                          {errors.address_line}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        className="w-full"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city}</p>
                      )}
                      <Input
                        type="text"
                        placeholder="Country"
                        className="w-full"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">{errors.country}</p>
                      )}
                    </div>

                    <Input
                      type="text"
                      placeholder="Phone Number"
                      className="mb-8 w-full"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && (
                      <p className="mb-4 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}

                    {/* --- SHIPPING METHOD --- */}
                    <h3 className="mb-4 text-lg font-semibold">
                      Shipping Method
                    </h3>
                    <RadioGroup
                      value={data.shipping_method}
                      onValueChange={(value) =>
                        setData('shipping_method', value)
                      }
                      defaultValue="standard"
                      className="mb-8 flex-col gap-0"
                    >
                      <div className="flex flex-col rounded-t-md border-2 border-muted/50 p-4">
                        <div className="flex items-center">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="ml-2 font-bold">
                            Standard Shipping
                          </Label>
                          <span className="ml-auto text-sm">Free</span>
                        </div>
                        <span className="ml-6 text-sm text-muted-foreground">
                          7-15 Business Days
                        </span>
                      </div>
                      <div className="flex flex-col rounded-b-md border-2 border-t-0 border-muted/50 p-4">
                        <div className="flex items-center">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="ml-2 font-bold">
                            Express Shipping
                          </Label>
                          <span className="ml-auto text-sm">$15.00</span>
                        </div>
                        <span className="ml-6 text-sm text-muted-foreground">
                          4-5 Business Days
                        </span>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* --- BILLING --- */}
                  <h3 className="mb-4 text-lg font-semibold">
                    Billing Address
                  </h3>
                  <div className="mb-6 flex items-center space-x-2 rounded-md border bg-muted/20 p-4">
                    <Switch
                      id="use-shipping-as-billing"
                      checked={data.using_same_billing}
                      onCheckedChange={(checked) => {
                        setData('using_same_billing', checked as boolean);
                        setSameAsBilling(Boolean(checked));
                      }}
                    />
                    <Label
                      htmlFor="use-shipping-as-billing"
                      className="cursor-pointer"
                    >
                      Same as shipping address
                    </Label>
                  </div>

                  {!sameAsBilling && (
                    <div className="mb-8 animate-in rounded-md border bg-muted/10 p-4 fade-in slide-in-from-top-2">
                      {/* ... (Your billing inputs here - shortened for brevity) ... */}
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="First Name"
                            value={data.payment_first_name}
                            onChange={(e) =>
                              setData('payment_first_name', e.target.value)
                            }
                          />
                          {errors.payment_first_name && (
                            <p className="text-sm text-red-500">
                              {errors.payment_first_name}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Last Name"
                            value={data.payment_last_name}
                            onChange={(e) =>
                              setData('payment_last_name', e.target.value)
                            }
                          />
                          {errors.payment_last_name && (
                            <p className="text-sm text-red-500">
                              {errors.payment_last_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <Input
                        placeholder="Address"
                        className="mb-4"
                        value={data.payment_address_line}
                        onChange={(e) =>
                          setData('payment_address_line', e.target.value)
                        }
                      />
                      {errors.payment_address_line && (
                        <p className="mb-4 text-sm text-red-500">
                          {errors.payment_address_line}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="City"
                            value={data.payment_city}
                            onChange={(e) =>
                              setData('payment_city', e.target.value)
                            }
                          />
                          {errors.payment_city && (
                            <p className="text-sm text-red-500">
                              {errors.payment_city}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Country"
                            value={data.payment_country}
                            onChange={(e) =>
                              setData('payment_country', e.target.value)
                            }
                          />
                          {errors.payment_country && (
                            <p className="text-sm text-red-500">
                              {errors.payment_country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- PAYMENT --- */}
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    Payment
                    <Lock className="h-4 w-4 text-gray-400" />
                  </h3>

                  <div className="space-y-4 rounded-md border-2 border-muted/50 bg-muted/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="font-bold">Credit Card</Label>
                      <div className="flex gap-2">
                        {/* Icons for Visa/Mastercard */}
                        <div className="h-6 w-10 rounded bg-gray-200"></div>
                        <div className="h-6 w-10 rounded bg-gray-200"></div>
                      </div>
                    </div>

                    <div className="relative">
                      <CreditCard className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Card Number"
                        className="pl-10"
                        maxLength={19}
                        value={data.card_number}
                        onChange={(e) => setData('card_number', e.target.value)}
                      />
                      {errors.card_number && (
                        <p className="text-sm text-red-500">
                          {errors.card_number}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="Expiration (MM/YY)"
                          maxLength={5}
                          value={data.card_expiry}
                          onChange={(e) =>
                            setData('card_expiry', e.target.value)
                          }
                        />
                        {errors.card_expiry && (
                          <p className="text-sm text-red-500">
                            {errors.card_expiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          placeholder="CVC"
                          maxLength={4}
                          value={data.card_cvc}
                          onChange={(e) => setData('card_cvc', e.target.value)}
                        />
                        {errors.card_cvc && (
                          <p className="text-sm text-red-500">
                            {errors.card_cvc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="mt-8 h-14 w-full text-lg font-bold shadow-lg"
                    type="submit"
                    disabled={processing}
                  >
                    {processing
                      ? 'PROCESSING...'
                      : `PAY $${subtotal.toFixed(2)}`}
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
