'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/index'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free Plan',
  starter: 'Starter Plan',
  pro: 'Pro Plan',
  agency: 'Agency Plan',
}

const PLAN_SUMMARY: Record<string, string> = {
  free: '3 missions/month · Core content generation',
  starter: '20 missions/month · All platforms · Priority support',
  pro: 'Unlimited missions · Advanced remix engine · Analytics',
  agency: 'Everything in Pro · Team seats · White-label exports',
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast, showToast, dismiss } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>()

      if (data) {
        setProfile(data)
        setFullName(data.full_name ?? '')
      }
    }
    load()
  }, [router])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error
      showToast('Name updated.', 'success')
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        showToast('Could not open billing portal.', 'error')
      }
    } catch {
      showToast('Something went wrong.', 'error')
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Are you sure you want to sign out? To permanently delete all your data, please contact support.'
    )
    if (!confirmed) return

    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const tier = profile?.subscription_tier ?? 'free'
  const isPaid = tier !== 'free'

  return (
    <>
      {toast && (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismiss} />
      )}

      <div className="flex flex-col" style={{ gap: 8, marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-manrope)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Settings
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', color: '#6b7280', margin: 0 }}>
          Manage your account.
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 32, maxWidth: 560 }}>
        {/* Account */}
        <Card>
          <h2 style={{ fontFamily: 'var(--font-manrope)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 20px' }}>
            Account
          </h2>
          <form onSubmit={handleSaveName} className="flex flex-col" style={{ gap: 16 }}>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9375rem',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border, #e5e7eb)',
                  background: 'var(--color-surface-input, #ffffff)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="flex flex-col" style={{ gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9375rem',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--color-border, #e5e7eb)',
                  background: '#f9fafb',
                  color: '#9ca3af',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
            </div>

            <div>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Subscription */}
        <Card>
          <h2 style={{ fontFamily: 'var(--font-manrope)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 16px' }}>
            Subscription
          </h2>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div>
              <Chip active>{PLAN_LABELS[tier]}</Chip>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>
              {PLAN_SUMMARY[tier]}
            </p>
            {isPaid ? (
              <div>
                <Button variant="ghost" disabled={portalLoading} onClick={handleManageSubscription}>
                  {portalLoading ? 'Opening…' : 'Manage Subscription'}
                </Button>
              </div>
            ) : (
              <div>
                <Button variant="primary" onClick={() => router.push('/dashboard/pricing')}>
                  Upgrade Your Plan
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card style={{ background: '#fff0ee' }}>
          <h2 style={{ fontFamily: 'var(--font-manrope)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 12px' }}>
            Danger Zone
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#6b7280', margin: '0 0 16px' }}>
            Contact support to permanently delete all your data.
          </p>
          <Button
            variant="ghost"
            onClick={handleDeleteAccount}
            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
          >
            Delete Account
          </Button>
        </Card>
      </div>
    </>
  )
}
