import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const ping = useMutation({ mutationFn: async () => supabase.auth.getSession() })
  const { data: rows = [] } = useQuery({
    queryKey: ['entities', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase.from('entities').select('*').limit(9)
      if (error) throw error
      return data ?? []
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b py-5 text-center">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)]">La Piazza Manager</h2>
        <div className="mt-2 flex justify-center gap-6 text-sm"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/entities/">Entities</Link><Link to="/menu-items/">Menu Items</Link><Link to="/posts/">Posts</Link><Link to="/comments/">Comments</Link><Link to="/testimonials/">Testimonials</Link><Link to="/services-pages/">Services Pages</Link><Link to="/pages/">Pages</Link><Link to="/site-settings/">Site Settings</Link><Link to="/reservations/">Reservations</Link><Link to="/menu-categories/">Menu Categories</Link><Link to="/restaurant-tables/">Restaurant Tables</Link><Link to="/orders/">Orders</Link><Link to="/order-items/">Order Items</Link></div>
      </header>
      <section className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1761110731010-a26c8c605e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NTQ4MTd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaXRhbGlhbiUyMHJlc3RhdXJhbnQlMjB0YWJsZSUyMHNldHRpbmclMjB3aGl0ZSUyMHRhYmxlY2xvdGglMjB3aW5lJTIwZ2xhc3NlcyUyMHdhcm0lMjBsaWdodHxlbnwwfDB8fHwxNzcxNTAwMDI0fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Champagne bottle and glasses with flowers" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 gap-6">
          <div className="max-w-3xl text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-display)]">Run La Piazza’s dining room with calm, confident control.</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">Manage menus, tables, reservations, and orders—securely for every staff shift.</p>
            <Link to="/entities/"><Button className="mt-8 transition-all duration-200">Open today’s reservations</Button></Link>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl p-6 gap-6 py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-[family-name:var(--font-display)]">Featured Entities</h2>
          <Button variant="outline" className="transition-all duration-200" onClick={() => ping.mutate()}>Refresh</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rows.map((row: Record<string, unknown>) => (
            <Link key={String(row.id)} to={"/entities/" + String(row.id)} className="group block">
              <Card className="rounded-[0.375rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">{row.image_url ? <img src={String(row.image_url)} alt={String(row.name ?? '')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <img src={`https://picsum.photos/seed/entities-${String(row.id)}/900/700`} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}</div>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)]">{String(row.name ?? 'Untitled')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1"><p className="text-sm text-muted-foreground">{String(row.slug ?? '—')}</p><p className="text-sm text-muted-foreground">{String(row.description ?? '—')}</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {rows.length === 0 && <p className="mt-6 text-sm text-muted-foreground">No reservations yet for today—add the first booking to get started.</p>}
      </main>
      <footer className="relative mt-16 border-t">
        <img src="https://images.unsplash.com/photo-1769230361493-f1f365a99878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NTQ4MTd8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwaXRhbGlhbiUyMHJlc3RhdXJhbnQlMjB0YWJsZSUyMHNldHRpbmclMjB3aGl0ZSUyMHRhYmxlY2xvdGglMjB3aW5lJTIwZ2xhc3NlcyUyMHdhcm0lMjBsaWdodHxlbnwwfDB8fHwxNzcxNTAwMDI0fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="A beautifully set round table with floral centerpiece." className="h-52 w-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-sm text-white">Made for service, built for La Piazza.</div>
      </footer>
    </div>
  )
}
