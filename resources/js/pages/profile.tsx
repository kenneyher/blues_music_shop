'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  MapPin,
  Moon,
  Package,
  Plus,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// --- TYPES ---
interface Address {
  id: number;
  first_name: string;
  last_name: string;
  address_line: string;
  city: string;
  country: string;
  is_default: boolean;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  initials?: string;
}

interface ProfileProps {
  user: User;
  shippingAddresses: Address[];
  billingAddresses: Address[];
  ordersCount: number;
}

// --- MAIN PAGE COMPONENT ---
export default function Profile({
  user,
  shippingAddresses,
  billingAddresses,
  ordersCount,
}: ProfileProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  const [isDark, setIsDark] = useState(false);

  // Track active tab to know which address type to add
  const [activeTab, setActiveTab] = useState('shipping');

  // Theme Logic
  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ShopLayout>
      <Head title="My Profile" />

      <div className="container mx-auto min-h-[80vh] max-w-5xl px-4 py-12">
        {/* --- HEADER --- */}
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar className="h-24 w-24 border-2 border-muted">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent text-2xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Link href="/my-orders">
                <Button className="gap-2">
                  <Package className="h-4 w-4" />
                  My Orders
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-white px-1.5 py-0.5 text-xs text-black"
                  >
                    {ordersCount}
                  </Badge>
                </Button>
              </Link>

              {/* Theme Toggle */}
              <div className="flex items-center gap-2 rounded-full border border-input bg-background px-3 py-1.5 shadow-sm">
                <Sun
                  className={`h-4 w-4 ${
                    !isDark ? 'text-yellow-500' : 'text-muted-foreground'
                  }`}
                />
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-slate-700"
                />
                <Moon
                  className={`h-4 w-4 ${
                    isDark ? 'text-blue-400' : 'text-muted-foreground'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS & CONTENT --- */}
        <Tabs
          defaultValue="shipping"
          className="space-y-6"
          onValueChange={(val) => setActiveTab(val)}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="shipping">Shipping Addresses</TabsTrigger>
              <TabsTrigger value="billing">Billing Addresses</TabsTrigger>
            </TabsList>

            {/* 🔥 ADD NEW BUTTON (Triggers Dialog) */}
            <CreateAddressDialog type={activeTab} />
          </div>

          <TabsContent value="shipping" className="space-y-4">
            {shippingAddresses.length === 0 ? (
              <EmptyState type="shipping" />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shippingAddresses.map((addr) => (
                  <AddressCard key={addr.id} address={addr} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            {billingAddresses.length === 0 ? (
              <EmptyState type="billing" />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {billingAddresses.map((addr) => (
                  <AddressCard key={addr.id} address={addr} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ShopLayout>
  );
}

// --- HELPER COMPONENTS ---

function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center text-muted-foreground">
      <MapPin className="mb-2 h-10 w-10 opacity-20" />
      <p>No {type} addresses saved.</p>
    </div>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <Card className="group relative overflow-hidden transition-colors hover:border-accent/50">
      {address.is_default ? (
        <div className="absolute top-0 right-0 rounded-bl-lg bg-accent px-3 py-1 text-xs font-bold text-white">
          <span>DEFAULT</span>
        </div>
      ) : <></>}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          {address.first_name} {address.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>{address.address_line}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p className="mt-2 text-xs font-bold text-muted-foreground/50 uppercase">
          {address.country}
        </p>

        <div className="flex gap-2 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
            Make default
          </Button>
          <span className="text-muted-foreground/30">|</span>
          <Button variant="link" className="h-auto p-0 text-xs text-red-500">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- CREATE ADDRESS DIALOG FORM ---
function CreateAddressDialog({ type }: { type: string }) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    type: type, // Pre-fill with active tab (shipping/billing)
    first_name: '',
    last_name: '',
    address_line: '',
    city: '',
    country: '',
    is_default: false,
  });

  // Sync form type if the user switches tabs while modal is closed
  useEffect(() => {
    setData('type', type);
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile/address', {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add {type === 'shipping' ? 'Shipping' : 'Billing'} Address
          </DialogTitle>
          <DialogDescription>
            Add a new address to your account for faster checkout.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                required
              />
              {errors.first_name && (
                <span className="text-xs text-red-500">
                  {errors.first_name}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.address_line}
              onChange={(e) => setData('address_line', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={data.country}
                onChange={(e) => setData('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="default-mode"
              checked={data.is_default}
              onCheckedChange={(checked) => setData('is_default', checked)}
            />
            <Label htmlFor="default-mode">Set as default address</Label>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
