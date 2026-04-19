'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import type { Profile } from '@/types/index'

interface Props {
  plan: Profile['subscription_tier']
  planName: string
  currentTier: Profile['subscription_tier']
}

export default function UpgradeButton({ plan, planName, currentTier }: Props) {
  const [loading, setLoading] = useState(false)

  const isCurrent = plan === currentTier

  if (isCurrent || plan === 'free') {
    return (
      <Button variant="ghost" className="w-full" disabled>
        Current Plan
      </Button>
    )
  }

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed. Check Vercel env vars for Stripe keys.')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="primary" className="w-full" disabled={loading} onClick={handleUpgrade}>
      {loading ? 'Redirecting…' : `Upgrade to ${planName}`}
    </Button>
  )
}
