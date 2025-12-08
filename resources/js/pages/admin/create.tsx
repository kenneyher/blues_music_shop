'use client';

import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox'; 
import { ArrowLeft, Save, PlusCircle, Music } from 'lucide-react';

interface Option {
  id: number;
  name?: string;
  title?: string;
}

interface PageProps {
    genres: Option[];
    artists: Option[];
    albums: Option[];
}

export default function CreateProduct({ genres, artists, albums }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    // ARTIST STATE
    artist_selection: 'existing', // 'existing' | 'new'
    artist_id: '',
    artist_name: '',
    artist_bio: '',
    artist_img: null as File | null,

    // ALBUM STATE
    album_selection: 'existing', // 'existing' | 'new'
    album_id: '',
    album_title: '',
    album_release_date: '',

    // PRODUCT STATE
    genre_ids: [] as number[], // Array for multi-select
    format: 'Vinyl',
    price: '',
    quantity: '',
    sku: '',
    image: null as File | null,
    description: '',
  });

  console.log(albums)

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use hardcoded URL as requested
    post('/admin/inventory');
  };

  // Helper for Multi-Select Genres
  const toggleGenre = (id: number) => {
    const current = data.genre_ids;
    if (current.includes(id)) {
        setData('genre_ids', current.filter(gId => gId !== id));
    } else {
        setData('genre_ids', [...current, id]);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/inventory">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        <form onSubmit={submit} className="space-y-8">
            
            {/* --- SECTION 1: ARTIST --- */}
            <Card className="border-l-4 rounded-sm border-l-blue-500">
                <CardHeader><CardTitle>1. Artist</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Artist</Label>
                        <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={data.artist_selection === 'new' ? 'new' : data.artist_id}
                            onChange={(e) => {
                                if (e.target.value === 'new') {
                                    setData('artist_selection', 'new');
                                } else {
                                    setData((prev) => ({ ...prev, artist_selection: 'existing', artist_id: e.target.value }));
                                }
                            }}
                        >
                            <option value="" disabled>-- Choose an Artist --</option>
                            {artists.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                            <option value="new" className="font-bold text-blue-600">+ Create New Artist</option>
                        </select>
                        {errors.artist_id && <p className="text-red-500 text-sm">{errors.artist_id}</p>}
                    </div>

                    {/* Conditional Fields for NEW Artist */}
                    {data.artist_selection === 'new' && (
                        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>New Artist Name</Label>
                                    <Input 
                                        placeholder="e.g. Pink Floyd"
                                        value={data.artist_name}
                                        onChange={e => setData('artist_name', e.target.value)}
                                    />
                                    {errors.artist_name && <p className="text-red-500 text-sm">{errors.artist_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Artist Photo</Label>
                                    <Input type="file" onChange={e => setData('artist_img', e.target.files?.[0] || null)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea 
                                    className="w-full min-h-[80px] p-2 border rounded-md bg-background"
                                    placeholder="Short biography..."
                                    value={data.artist_bio}
                                    onChange={e => setData('artist_bio', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* --- SECTION 2: ALBUM --- */}
            <Card className="border-l-4 rounded-sm border-l-purple-500">
                <CardHeader><CardTitle>2. Album</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Album</Label>
                        <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={data.album_selection === 'new' ? 'new' : data.album_id}
                            onChange={(e) => {
                                if (e.target.value === 'new') {
                                    setData('album_selection', 'new');
                                } else {
                                    setData((prev) => ({ ...prev, album_selection: 'existing', album_id: e.target.value }));
                                }
                            }}
                        >
                            <option value="" disabled>-- Choose an Album --</option>
                            {/* Filter albums if an artist is selected to make it smarter */}
                            {albums
                                .filter(album => data.artist_selection === 'new' ? true : String(album.artist_id) === String(data.artist_id))
                                .map((a) => (
                                <option key={a.id} value={a.id}>{a.title}</option>
                            ))}
                            <option value="new" className="font-bold text-purple-600">+ Create New Album</option>
                        </select>
                         {/* Helper text if list is empty because of filtering */}
                         {data.artist_selection === 'existing' && data.artist_id && albums.filter(a => String(a.artist_id) === String(data.artist_id)).length === 0 && (
                            <p className="text-sm text-muted-foreground">No albums found for this artist. Create one!</p>
                        )}
                        {errors.album_id && <p className="text-red-500 text-sm">{errors.album_id}</p>}
                    </div>

                    {/* Conditional Fields for NEW Album */}
                    {data.album_selection === 'new' && (
                        <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>New Album Title</Label>
                                    <Input 
                                        placeholder="e.g. Dark Side of the Moon"
                                        value={data.album_title}
                                        onChange={e => setData('album_title', e.target.value)}
                                    />
                                    {errors.album_title && <p className="text-red-500 text-sm">{errors.album_title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Release Date</Label>
                                    <Input 
                                        type="date"
                                        value={data.album_release_date}
                                        onChange={e => setData('album_release_date', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- GENRES (Multi-Select) --- */}
                    <div className="mt-6 pt-6 border-t">
                        <Label className="mb-3 block text-md font-semibold">Genres (Select all that apply)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {genres.map((g) => (
                                <div key={g.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox" 
                                        id={`genre-${g.id}`}
                                        checked={data.genre_ids.includes(g.id)}
                                        onChange={() => toggleGenre(g.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label 
                                        htmlFor={`genre-${g.id}`} 
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {g.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.genre_ids && <p className="text-red-500 text-sm mt-2">{errors.genre_ids}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* --- SECTION 3: PRODUCT DETAILS --- */}
            <Card className='rounded-sm'>
                <CardHeader><CardTitle>3. Inventory Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Price ($)</Label>
                            <Input 
                                type="number" step="0.01" 
                                value={data.price} onChange={e => setData('price', e.target.value)}
                            />
                             {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input 
                                type="number" 
                                value={data.quantity} onChange={e => setData('quantity', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input 
                                placeholder="VIN-001"
                                value={data.sku} onChange={e => setData('sku', e.target.value)}
                            />
                            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <select 
                                className="w-full p-2 border rounded-md bg-background"
                                value={data.format} onChange={e => setData('format', e.target.value)}
                            >
                                <option value="Vinyl">Vinyl</option>
                                <option value="CD">CD</option>
                                <option value="Cassette">Cassette</option>
                            </select>
                        </div>
                         {/* Product Specific Image (Optional, if different from Album Cover) */}
                        <div className="space-y-2">
                            <Label>Product specific image (Optional)</Label>
                            <Input type="file" onChange={e => setData('image', e.target.files?.[0] || null)} />
                        </div>
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-3"> {/* Use col-span to make it full width */}
                        <Label>Description</Label>
                        <Textarea 
                            placeholder="Describe the condition, tracklist, or other details..."
                            className="min-h-[100px]"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={processing} className="w-full h-12 text-lg">
                {processing ? 'Saving...' : 'Create Product'}
                {!processing && <Save className="ml-2 h-5 w-5" />}
            </Button>

        </form>
      </div>
    </DashboardLayout>
  );
}