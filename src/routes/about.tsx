import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const ping = useMutation({ mutationFn: async () => supabase.auth.getSession() })
  useQuery({ queryKey: ['about', 'warm'], queryFn: async () => ({ ok: true }) })

  return (
    <div className="p-6 gap-6">
      <Card className="rounded-[0.375rem] border border-border shadow-sm transition-all duration-200 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-3xl font-[family-name:var(--font-display)]">About La Piazza Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>La Piazza Manager is your all-in-one restaurant management system for keeping service smooth from open to close. Maintain menu categories and items with pricing, dietary tags, availability, and prep times, while tracking tables across indoor, outdoor, bar, and private seating. Staff can securely sign in to manage today’s reservations and move orders from open to paid with clear item-by-item statuses and special instructions.</p>
          <button className="underline transition-all duration-200" onClick={() => ping.mutate()}>Check session</button>
        </CardContent>
      </Card>
    </div>
  )
}
