'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Save, Upload } from 'lucide-react';

interface Option {
  id: number;
  name?: string;
  title?: string;
}
interface Product {
  id: number;
  price: number;
  quantity: number; // Renamed
  sku: string;
  format: string;
  description: string;
  img_path: string | null; // Image is now here
  album_id: number;
  album: {
    id: number;
    title: string;
    release_date: string;
    artist_id: number;
    genres: { id: number; name: string }[];
  };
}

interface PageProps {
  product: Product;
  genres: Option[];
  albums: Option[];
  artists: Option[];
}

export default function EditProduct({ product, genres }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',

    // Product Data
    price: product.price,
    quantity: product.quantity, // Renamed
    sku: product.sku,
    format: product.format,
    description: product.description || '',
    product_image: null as File | null, // Moved here

    // Album Data
    album_title: product.album.title,
    release_date: product.album.release_date || '',

    // Relationships
    genre_ids: product.album.genres.map((g) => g.id),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/inventory/${product.id}`);
  };

  const toggleGenre = (id: number) => {
    const current = data.genre_ids;
    if (current.includes(id)) {
      setData(
        'genre_ids',
        current.filter((gId) => gId !== id),
      );
    } else {
      setData('genre_ids', [...current, id]);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/inventory">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-sm text-muted-foreground">
              Update inventory details
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-8">
          {/* --- SECTION 1: ALBUM INFO (No Image) --- */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle>1. Album Info</CardTitle>
              <p className="text-sm text-muted-foreground">
                Changes here affect ALL products linked to this album.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Album Title</Label>
                  <Input
                    value={data.album_title}
                    onChange={(e) => setData('album_title', e.target.value)}
                  />
                  {errors.album_title && (
                    <p className="text-sm text-red-500">{errors.album_title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Release Date</Label>
                  <Input
                    type="date"
                    value={data.release_date}
                    onChange={(e) => setData('release_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="mb-2 block">Genres</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {genres.map((g) => (
                    <div key={g.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`genre-${g.id}`}
                        checked={data.genre_ids.includes(g.id)}
                        onChange={() => toggleGenre(g.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary"
                      />
                      <label
                        htmlFor={`genre-${g.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {g.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.genre_ids && (
                  <p className="text-sm text-red-500">{errors.genre_ids}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* --- SECTION 2: PRODUCT & IMAGE --- */}
          <Card>
            <CardHeader>
              <CardTitle>2. Product & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* PRODUCT IMAGE UPLOAD */}
                <div className="flex w-full flex-col gap-3 md:w-1/3">
                  <Label>Product Image</Label>
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {data.product_image ? (
                      <img
                        src={URL.createObjectURL(data.product_image)}
                        alt="New Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : product.img_path ? (
                      <img
                        src={`/storage/${product.img_path}`}
                        alt="Current Product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="file"
                      className="hidden"
                      id="product-img-upload"
                      onChange={(e) =>
                        setData('product_image', e.target.files?.[0] || null)
                      }
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <label
                        htmlFor="product-img-upload"
                        className="flex cursor-pointer items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {data.product_image
                          ? 'Change Selection'
                          : 'Upload Image'}
                      </label>
                    </Button>
                  </div>
                  {errors.product_image && (
                    <p className="text-sm text-red-500">
                      {errors.product_image}
                    </p>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="grid w-full grid-cols-1 gap-4 md:w-2/3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={data.sku}
                      onChange={(e) => setData('sku', e.target.value)}
                    />
                    {errors.sku && (
                      <p className="text-sm text-red-500">{errors.sku}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <select
                      className="w-full rounded-md border bg-background p-2"
                      value={data.format}
                      onChange={(e) => setData('format', e.target.value)}
                    >
                      <option value="Vinyl">Vinyl</option>
                      <option value="CD">CD</option>
                      <option value="Cassette">Cassette</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.price}
                      onChange={(e) => setData('price', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label> {/* Renamed Label */}
                    <Input
                      type="number"
                      value={data.quantity}
                      onChange={(e) =>
                        setData('quantity', Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      className="min-h-[100px]"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={processing}
            className="h-12 w-full text-lg"
          >
            {processing ? 'Saving...' : 'Save All Changes'}
            {!processing && <Save className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
