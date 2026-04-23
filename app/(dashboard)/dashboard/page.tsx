import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import CommandCenter from './_components/CommandCenter'
import UpgradedBanner from './_components/UpgradedBanner'
import type { Mission, Profile } from '@/types/index'

const MONTHLY_LIMITS: Record<Profile['subscription_tier'], number | null> = {
  free: 10,
  starter: 30,
  pro: null,
  agency: null,
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  const isProfileComplete =
    !!profile?.niche &&
    !!profile?.brand_voice &&
    Array.isArray(profile?.active_platforms) &&
    profile.active_platforms.length > 0

  if (!isProfileComplete) {
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
            Let&apos;s set up your strategy
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: 1.6,
            }}
          >
            ContentMind AI needs to know your niche and brand voice before it can generate your
            daily missions.
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

  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [{ data: missions }, { count: usageCount }] = await Promise.all([
    supabase
      .from('missions')
      .select('*')
      .eq('user_id', user.id)
      .eq('due_date', today)
      .neq('status', 'dismissed')
      .order('created_at', { ascending: true }),
    supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('action', 'generate_plan')
      .gte('created_at', monthStart.toISOString()),
  ])

  const limit = MONTHLY_LIMITS[profile.subscription_tier]
  const canGenerateMore = limit === null || (usageCount ?? 0) < limit

  return (
    <>
      <Suspense fallback={null}>
        <UpgradedBanner />
      </Suspense>
      <CommandCenter
        initialMissions={(missions ?? []) as Mission[]}
        niche={profile.niche ?? 'Your Niche'}
        canGenerateMore={canGenerateMore}
        firstName={(profile.full_name ?? user.email ?? '').split(' ')[0]}
      />
    </>
  )
}
