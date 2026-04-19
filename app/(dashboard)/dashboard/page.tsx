import Link from 'next/link'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('niche, brand_voice, active_platforms')
    .eq('id', user.id)
    .single()

  const isComplete =
    !!profile?.niche &&
    !!profile?.brand_voice &&
    Array.isArray(profile?.active_platforms) &&
    profile.active_platforms.length > 0

  if (isComplete) {
    return (
      <p style={{ fontFamily: 'var(--font-inter)', color: '#6b7280', fontSize: '0.95rem' }}>
        Your dashboard is loading…
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="w-full max-w-[480px] flex flex-col gap-5 text-center">
        <h1
          style={{
            fontFamily: 'var(--font-manrope)',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            lineHeight: 1.25,
          }}
        >
          Let's set up your strategy
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            color: '#6b7280',
            lineHeight: 1.6,
          }}
        >
          ContentMind AI needs to know your niche and brand voice before it can
          generate your daily missions.
        </p>
        <Link href="/dashboard/strategy" className="block">
          <Button variant="primary" className="w-full">
            Set Up My Profile
          </Button>
        </Link>
      </Card>
    </div>
  )
}
