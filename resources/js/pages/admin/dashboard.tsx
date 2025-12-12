'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Package, Users, Disc3, ShoppingBag } from 'lucide-react';

interface DashboardProps {
  stats: {
    users: number;
    products: number;
    vinyl: number;
    cd: number;
    orders: number;
  };
}

export default function AdminDashboard({ stats }: DashboardProps) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: <Package className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50',
    },
    {
      title: 'Vinyl Products',
      value: stats.vinyl,
      icon: <Disc3 className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50',
    },
    {
      title: 'CD Products',
      value: stats.cd,
      icon: <Disc3 className="h-6 w-6 text-pink-500" />,
      color: 'bg-pink-50',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: <ShoppingBag className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-50',
    },
  ];

  return (
    <DashboardLayout>
      <Head title="Admin Dashboard" />

      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of current store statistics.
        </p>

        {/* --- Cards Grid --- */}
        <div className="grid gap-6 grid-rows-2 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.title}
              className={`rounded-lg shadow-sm border ${card.color}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}