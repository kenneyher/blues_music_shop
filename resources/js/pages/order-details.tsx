'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, MapPin, Truck } from 'lucide-react';

// Define types based on your DB structure
interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  image: string;
}

interface Address {
  first_name: string;
  last_name: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total_price: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
}

export default function OrderDetails({ order }: { order: Order }) {
  // Format Date
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ShopLayout>
      <Head title={`Order #${order.id}`} />

      <div className="container mx-auto min-h-[80vh] px-4 py-12">
        {/* --- HEADER --- */}
        <div className="mb-8">
          <Link
            href={'/my-orders'}
            className="mb-4 flex items-center text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Order #{order.id}
              </h1>
              <p className="mt-1 text-gray-500">Placed on {orderDate}</p>
            </div>
            <div className="flex items-center gap-3">
              {order.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {order.status === 'pending' && (
                <Clock className="h-5 w-5 text-gray-500" />
              )}
              <Badge className="text-sm tracking-wide uppercase">
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- LEFT COLUMN: ITEMS --- */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border-3 border-accent shadow-[0_0_0.75rem] shadow-accent">
                      <img
                        src={item.image}
                        alt={item.product.album.artist}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold">{item.product.album.title}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × $
                        {Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right font-bold">
                      ${Number(item.unit_price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mobile-only Summary could go here if needed */}
          </div>

          {/* --- RIGHT COLUMN: SUMMARY & ADDRESSES --- */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${Number(order.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    ${Number(order.shipping_cost).toFixed(2)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${Number(order.subtotal) + Number(order.shipping_cost)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Truck className="h-4 w-4" /> Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p className="font-bold text-black">
                  {order.shipping_address.first_name}{' '}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_line_1}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" /> Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p className="font-bold text-black">
                  {order.billing_address.first_name}{' '}
                  {order.billing_address.last_name}
                </p>
                <p>{order.billing_address.address_line_1}</p>
                <p>
                  {order.billing_address.city}, {order.billing_address.state}{' '}
                  {order.billing_address.postal_code}
                </p>
                <p>{order.billing_address.country}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
