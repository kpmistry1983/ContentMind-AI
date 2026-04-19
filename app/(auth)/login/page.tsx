'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = getSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-surface-high)',
    border: '1px solid rgba(245, 158, 11, 0.12)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontFamily: 'var(--font-inter), Arial, sans-serif',
    fontSize: '0.95rem',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Brand */}
            <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)', textAlign: 'center', margin: 0 }}>
              ContentMind AI
            </p>

            {/* Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <h1 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', margin: 0, textAlign: 'center' }}>
                Welcome back
              </h1>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.95rem', color: '#a16207', textAlign: 'center', margin: 0 }}>
                Your daily missions are waiting.
              </p>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '12px 16px',
                background: 'var(--color-surface-high)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '10px',
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                opacity: googleLoading ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {googleLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <GoogleIcon />}
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(245, 158, 11, 0.12)' }} />
              <span style={{ fontSize: '0.8rem', color: '#92400e', fontFamily: 'var(--font-inter)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(245, 158, 11, 0.12)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.25)' }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.25)' }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#92400e' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'var(--color-error)', margin: 0 }}>
                  {error}
                </p>
              )}

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
              </Button>
            </form>

            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#92400e', textAlign: 'center', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                Sign up →
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
