'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link } from '@inertiajs/react';
import { Package, ArrowRight } from 'lucide-react';

interface OrderSummary {
  id: number;
  date: string;
  status: string;
  total: number;
  items_count: number;
}

export default function MyOrders({ orders }: { orders: OrderSummary[] }) {
  
  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      case 'processing': return 'bg-blue-500 hover:bg-blue-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600'; // Pending
    }
  };

  return (
    <ShopLayout>
      <Head title="My Orders" />

      <div className="container mx-auto px-4 py-12 min-h-[60vh]">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
            <Link href="/shop">
                <Button variant="outline">Continue Shopping</Button>
            </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link href="/shop">
                <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.id.toString().padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </Button>
                        </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ShopLayout>
  );
}