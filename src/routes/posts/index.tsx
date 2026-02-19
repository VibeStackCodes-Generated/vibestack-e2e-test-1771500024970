import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/posts/')({
  component: PostsPage,
})

function PostsPage() {
  const [search, setSearch] = useState('')
  const { data: rows = [], isPending } = useQuery({
    queryKey: ['posts', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
  const filtered = search ? rows.filter((row: Record<string, unknown>) => String(row.title ?? '').toLowerCase().includes(search.toLowerCase())) : rows

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">La Piazza Manager</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/entities/">Entities</Link><Link to="/menu-items/">Menu Items</Link><Link to="/posts/">Posts</Link><Link to="/comments/">Comments</Link><Link to="/testimonials/">Testimonials</Link><Link to="/services-pages/">Services Pages</Link><Link to="/pages/">Pages</Link><Link to="/site-settings/">Site Settings</Link><Link to="/reservations/">Reservations</Link><Link to="/menu-categories/">Menu Categories</Link><Link to="/restaurant-tables/">Restaurant Tables</Link><Link to="/orders/">Orders</Link><Link to="/order-items/">Order Items</Link></div>
      </header>
      <main className="mx-auto max-w-6xl p-6 gap-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl font-[family-name:var(--font-display)]">Posts</h1>
          <Input className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((row: Record<string, unknown>) => (
            <Link key={String(row.id)} to={"/posts/" + String(row.id)} className="group block">
              <Card className="rounded-[0.375rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">{row.featured_image ? <img src={String(row.featured_image)} alt={String(row.title ?? '')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <img src={`https://picsum.photos/seed/posts-${String(row.id)}/900/700`} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}</div>
                <CardHeader><CardTitle className="font-[family-name:var(--font-display)]">{String(row.title ?? 'Untitled')}</CardTitle></CardHeader>
                <CardContent className="space-y-1"><p className="text-sm text-muted-foreground">{String(row.slug ?? '—')}</p><p className="text-sm text-muted-foreground">{String(row.content ?? '—')}</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
