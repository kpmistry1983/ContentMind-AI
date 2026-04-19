'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function UpgradedBanner() {
  const params = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(params.get('upgraded') === 'true')

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
      router.replace('/dashboard')
    }, 8000)
    return () => clearTimeout(timer)
  }, [visible, router])

  if (!visible) return null

  return (
    <div
      className="mb-5 flex items-center justify-between rounded-xl px-4 py-3"
      style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e' }}
    >
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#166534' }}>
        Welcome! Your plan is now active. Enjoy your upgraded missions.
      </p>
      <button
        onClick={() => { setVisible(false); router.replace('/dashboard') }}
        className="ml-4 text-green-600 hover:text-green-800 transition-colors text-xl leading-none w-6 h-6 flex items-center justify-center"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
