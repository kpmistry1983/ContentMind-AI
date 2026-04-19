import { redirect } from 'next/navigation'
import Chip from '@/components/ui/Chip'
import SidebarNav from '@/components/dashboard/SidebarNav'
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        style={{ width: 240, minWidth: 240, background: 'var(--color-surface-low)', borderRight: '1px solid rgba(245,158,11,0.08)' }}
        className="flex flex-col h-full"
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-5">
          <span
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--color-primary)',
            }}
          >
            ContentMind AI
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>

        {/* User section */}
        <div className="px-4 py-5 flex items-center gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#ffffff',
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '0.95rem',
              flexShrink: 0,
            }}
            className="flex items-center justify-center"
          >
            {avatarLetter}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span
              className="truncate"
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
              }}
            >
              {fullName}
            </span>
            <Chip>{tier}</Chip>
          </div>
        </div>
      </aside>

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
