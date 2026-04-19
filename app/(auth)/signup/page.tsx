'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = getSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (authError) {
      setError(
        authError.message.toLowerCase().includes('already')
          ? 'An account with this email already exists.'
          : authError.message
      )
      setLoading(false)
      return
    }

    fetch('/api/auth/welcome', { method: 'POST' })

    router.push('/dashboard/strategy')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#f3f4f5',
    border: 'none',
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
            <p
              style={{
                fontFamily: 'var(--font-manrope), Arial, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--color-primary)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              ContentMind AI
            </p>

            {/* Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-manrope), Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Create your account
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-inter), Arial, sans-serif',
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Cure content paralysis. Start free.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #4343d540' }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #4343d540' }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
              />

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #4343d540' }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6b7280',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p
                  style={{
                    fontFamily: 'var(--font-inter), Arial, sans-serif',
                    fontSize: '0.875rem',
                    color: 'var(--color-error)',
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
              </Button>
            </form>

            {/* Sign in link */}
            <p
              style={{
                fontFamily: 'var(--font-inter), Arial, sans-serif',
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center',
                margin: 0,
              }}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
              >
                Sign in →
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
