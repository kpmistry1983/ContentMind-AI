import { redirect } from 'next/navigation'
import TopNav from '@/components/dashboard/TopNav'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_tier')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name ?? user.email ?? ''
  const tier = profile?.subscription_tier ?? 'free'
  const avatarLetter = fullName.charAt(0).toUpperCase() || '?'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav avatarLetter={avatarLetter} fullName={fullName} tier={tier} />

      {/* Main content */}
      <main
        style={{ background: 'var(--color-surface)', padding: '40px 48px' }}
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>

      <ScrollToTop />
    </div>
  )
}
