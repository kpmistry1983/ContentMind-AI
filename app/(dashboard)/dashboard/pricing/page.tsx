import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/index'
import UpgradeButton from './_components/UpgradeButton'

interface Plan {
  key: Profile['subscription_tier']
  name: string
  price: number
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    features: ['10 missions / month', '3 remixes / month', '1 platform'],
  },
  {
    key: 'starter',
    name: 'Starter',
    price: 19,
    features: ['30 missions / month', '10 remixes / month', '3 platforms', 'Email support'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 39,
    features: ['Unlimited missions', 'Unlimited remixes', 'All platforms', 'Priority support'],
    popular: true,
  },
  {
    key: 'agency',
    name: 'Agency',
    price: 79,
    features: [
      'Everything in Pro',
      '5 brand profiles',
      'White-label exports',
      'Dedicated support',
    ],
  },
]

export default async function PricingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single<Pick<Profile, 'subscription_tier'>>()

  const currentTier = profile?.subscription_tier ?? 'free'

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1
          style={{
            fontFamily: 'var(--font-manrope)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
          }}
        >
          Choose Your Plan
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            color: '#6b7280',
            marginTop: 8,
            fontSize: '0.95rem',
          }}
        >
          Upgrade anytime. Cancel anytime.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {PLANS.map(plan => (
          <div key={plan.key} className="flex flex-col items-center gap-2">
            {plan.popular ? (
              <Chip active>Most Popular</Chip>
            ) : (
              <div style={{ height: 26 }} />
            )}

            <div
              className="w-full rounded-2xl"
              style={plan.popular ? { boxShadow: '0 0 0 2px #4343d5' } : undefined}
            >
            <Card className="flex flex-col gap-5">
              {/* Plan name */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: 6,
                  }}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 700,
                      fontSize: '2.5rem',
                      color: 'var(--color-text-primary)',
                      lineHeight: 1,
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      color: '#6b7280',
                    }}
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2
                      size={15}
                      style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.83rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.45,
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <UpgradeButton plan={plan.key} planName={plan.name} currentTier={currentTier} />
            </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
