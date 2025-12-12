'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Package, Search } from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: number;
  customer: string;
  email: string;
  date: string;
  status: string;
  total: number;
  items_count: number;
  shipping_method: string;
}

interface PageProps {
  orders: {
    data: Order[];
    links: any[];
    total: number;
  };
  filters: {
    status?: string;
    search?: string;
    sort?: string;
    dir?: string;
  };
  statusCounts: Record<string, number>;
  statuses: string[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders({
  orders,
  filters,
  statusCounts,
  statuses,
}: PageProps) {
  const [search, setSearch] = useState(filters.search || '');

  const updateFilters = (newFilters: Record<string, any>) => {
    return;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const totalOrders = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout>
      <Head title="Order Management" />

      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track customer orders
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{totalOrders} total orders</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={!filters.status ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ status: null })}
          >
            All ({totalOrders})
          </Button>
          {statuses.map((status) => (
            <Button
              key={status}
              variant={filters.status === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ status })}
              className="capitalize"
            >
              {status} ({statusCounts[status] || 0})
            </Button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Input
              placeholder="Search by order ID, customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <Select
            value={`${filters.sort || 'created_at'}-${filters.dir || 'desc'}`}
            onValueChange={(val) => {
              const [sort, dir] = val.split('-');
              updateFilters({ sort, dir });
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest first</SelectItem>
              <SelectItem value="created_at-asc">Oldest first</SelectItem>
              <SelectItem value="total-desc">Highest value</SelectItem>
              <SelectItem value="total-asc">Lowest value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Items
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.data.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono font-semibold">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {order.items_count} item
                        {order.items_count !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.links.length > 3 && (
            <div className="flex justify-center gap-1 border-t p-4">
              {orders.links.map((link, i) =>
                link.url ? (
                  <Link
                    key={i}
                    href={link.url}
                    className={`rounded px-3 py-1 text-sm ${
                      link.active
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ) : (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}