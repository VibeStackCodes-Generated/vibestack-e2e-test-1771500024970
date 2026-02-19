import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/order-items/$id')({
  component: OrderItemDetailPage,
})

function OrderItemDetailPage() {
  const { id } = Route.useParams()
  const { data: row, isPending, error } = useQuery({
    queryKey: ['order_items', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('order_items').select('*').eq('id', id).single()
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
        
        <h1 className="text-4xl font-[family-name:var(--font-display)]">{String(row.special_instructions ?? 'Order Item')}</h1>
        <section className="space-y-2"><h2 className="text-xl font-[family-name:var(--font-display)]">Details</h2><dl>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Order Id</dt>
                <dd className="text-sm mt-1">{String(row.order_id ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Menu Item Id</dt>
                <dd className="text-sm mt-1">{String(row.menu_item_id ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Special Instructions</dt>
                <dd className="text-sm mt-1">{String(row.special_instructions ?? '—')}</dd>
              </div></dl></section><section className="space-y-2"><h2 className="text-xl font-[family-name:var(--font-display)]">Properties</h2><dl>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Quantity</dt>
                <dd className="text-sm mt-1">{String(row.quantity ?? '—')}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Unit Price</dt>
                <dd className="text-sm mt-1">{Number(row.unit_price ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</dd>
              </div>
              <div className="py-2 border-b last:border-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
                <dd className="text-sm mt-1">{String(row.status ?? '—')}</dd>
              </div></dl></section>
        <Link to="/order-items/"><Button variant="outline" className="transition-all duration-200">Back to Order Items</Button></Link>
      </article>
    </div>
  )
}
