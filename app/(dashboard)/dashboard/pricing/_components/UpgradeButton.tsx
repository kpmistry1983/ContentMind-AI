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
      const text = await res.text()
      if (!res.ok) {
        alert('Error ' + res.status + ': ' + text.substring(0, 300))
        return
      }
      const data = JSON.parse(text)
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'No checkout URL returned.')
      }
    } catch (err) {
      alert('Caught: ' + String(err))
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
