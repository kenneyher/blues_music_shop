'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface Product {
  id: number;
  format: string;
  quantity: number;
  price: number;
  album: {
    title: string;
    artist: {
      name: string;
    };
    genres: {
      id: number;
      name: string;
    }[];
  };
}

interface PageProps {
  products: {
    data: Product[];
    // Update to match Laravel's full pagination object
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    current_page: number;
    from: number;
    to: number;
    total: number;
  };
  filters: {
    search?: string;
    format?: string;
  };
}

export default function Inventory({ products, filters }: PageProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const updateParams = (search: string, format: string | null) => {
    router.get(
      '/admin/inventory',
      {
        search,
        format,
      },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleFormatFilter = (format: string | null) => {
    const newFormat = format === filters.format ? null : format;
    updateParams(searchTerm, newFormat);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Inventory</h1>
          <p>Manage your vinyl records and CDs inventory across all formats.</p>
        </div>

        {/* Filters */}
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, artist, or SKU..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['Vinyl', 'CD'].map((format) => (
                  <Button
                    key={format}
                    variant={filters.format === format ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFormatFilter(format)}
                  >
                    {format}
                  </Button>
                ))}
              </div>
              <Link href={'/admin/inventory/create'}>
                <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/75">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="mt-6 border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Items</CardTitle>
                <CardDescription>
                  Showing {products.from} to {products.to} of {products.total}{' '}
                  results
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Artist
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Format
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Stock
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.data.map((item) => {
                    return (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer border-b border-border hover:bg-muted/50"
                        onClick={() =>
                          router.visit(`/admin/inventory/${item.id}/edit`)
                        }
                      >
                        <TableCell className="font-medium text-foreground">
                          {item.album.title}
                        </TableCell>
                        <TableCell>{item.album.artist.name}</TableCell>
                        <TableCell>{item.format}</TableCell>
                        <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.quantity < 25 ? 'destructive' : 'default'
                            }
                          >
                            {item.quantity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {products.data.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {products.links.length > 3 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Page {products.current_page} of {products.links.length - 2}
                </div>
                <div className="flex gap-1">
                  {products.links.map((link, i) => (
                    <Button
                      key={i}
                      variant={link.active ? 'default' : 'outline'}
                      size="sm"
                      disabled={!link.url}
                      // 👇 ADD preserveScroll: true
                      onClick={() =>
                        link.url &&
                        router.visit(link.url, { preserveScroll: true })
                      }
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
