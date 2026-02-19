import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/entities/$id')({
  component: EntityDetailPage,
})

function EntityDetailPage() {
  const { id } = Route.useParams()
  const { data: row, isPending, error } = useQuery({
    queryKey: ['entities', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('entities').select('*').eq('id', id).single()
      if (error) throw error
      return data as Record<string, unknown>
    },
  })

  if (isPending) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-destructive">{error.message}</div>
  if (!row) return <div className="p-8">Not found</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">La Piazza Manager</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/entities/">Entities</Link><Link to="/menu-items/">Menu Items</Link><Link to="/posts/">Posts</Link><Link to="/comments/">Comments</Link><Link to="/testimonials/">Testimonials</Link><Link to="/services-pages/">Services Pages</Link><Link to="/pages/">Pages</Link><Link to="/site-settings/">Site Settings</Link><Link to="/reservations/">Reservations</Link><Link to="/menu-categories/">Menu Categories</Link><Link to="/restaurant-tables/">Restaurant Tables</Link><Link to="/orders/">Orders</Link><Link to="/order-items/">Order Items</Link></div>
      </header>
      <article className="mx-auto max-w-3xl p-6 gap-6 py-12 space-y-8">
        {Boolean(row.image_url) && <img src={String(row.image_url)} alt={String(row.name ?? '')} className="w-full max-h-[70vh] object-cover rounded-[var(--radius)]" />}
        <h1 className="text-4xl font-[family-name:var(--font-display)]">{String(row.name ?? 'Entity')}</h1>
        <section className="space-y-2"><h2 className="text-xl font-[family-name:var(--font-display)]">Details</h2><dl>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
                <dd className="text-sm mt-1">{String(row.name ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Slug</dt>
                <dd className="text-sm mt-1">{String(row.slug ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Description</dt>
                <dd className="text-sm mt-1">{String(row.description ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Image Url</dt>
                <dd className="text-sm mt-1">{String(row.image_url ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Created At</dt>
                <dd className="text-sm mt-1">{row.created_at ? new Date(String(row.created_at)).toLocaleDateString() : '—'}</dd>
              </div></dl></section>
        <Link to="/entities/"><Button variant="outline" className="transition-all duration-200">Back to Entities</Button></Link>
      </article>
    </div>
  )
}
