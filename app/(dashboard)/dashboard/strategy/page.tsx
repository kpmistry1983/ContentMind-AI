'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'

const VOICE_OPTIONS = ['Empathetic', 'Strategic', 'Minimalist', 'Authoritative', 'Clear'] as const
const PLATFORM_OPTIONS = ['LinkedIn', 'X (Twitter)', 'Instagram', 'Newsletter', 'TikTok'] as const

type BrandVoice = (typeof VOICE_OPTIONS)[number]
type Platform = (typeof PLATFORM_OPTIONS)[number]

interface FormState {
  niche: string
  brandVoice: BrandVoice | ''
  targetAudience: string
  painPoints: [string, string, string]
  contentPillars: string[]
  activePlatforms: Platform[]
}

const EMPTY_FORM: FormState = {
  niche: '',
  brandVoice: '',
  targetAudience: '',
  painPoints: ['', '', ''],
  contentPillars: [],
  activePlatforms: [],
}

export default function StrategyPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [pillarInput, setPillarInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { toast, showToast, dismiss } = useToast()
  const pillarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('niche, brand_voice, target_audience, audience_pain_points, content_pillars, active_platforms')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          niche: data.niche ?? '',
          brandVoice: (data.brand_voice as BrandVoice) ?? '',
          targetAudience: data.target_audience ?? '',
          painPoints: (data.audience_pain_points as [string, string, string]) ?? ['', '', ''],
          contentPillars: (data.content_pillars as string[]) ?? [],
          activePlatforms: (data.active_platforms as Platform[]) ?? [],
        })
      }
      setLoaded(true)
    }
    loadProfile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        niche: form.niche,
        brand_voice: form.brandVoice ? form.brandVoice.toLowerCase() : null,
        target_audience: form.targetAudience,
        audience_pain_points: form.painPoints,
        content_pillars: form.contentPillars,
        active_platforms: form.activePlatforms,
      })

      if (error) throw error
      showToast('Your strategy profile is live.', 'success')
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function togglePlatform(p: Platform) {
    setForm(f => ({
      ...f,
      activePlatforms: f.activePlatforms.includes(p)
        ? f.activePlatforms.filter(x => x !== p)
        : [...f.activePlatforms, p],
    }))
  }

  function handlePillarKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const value = pillarInput.trim()
    if (!value || form.contentPillars.includes(value) || form.contentPillars.length >= 5) return
    setForm(f => ({ ...f, contentPillars: [...f.contentPillars, value] }))
    setPillarInput('')
  }

  function removePillar(pillar: string) {
    setForm(f => ({ ...f, contentPillars: f.contentPillars.filter(p => p !== pillar) }))
  }

  function setPainPoint(index: number, value: string) {
    setForm(f => {
      const pts: [string, string, string] = [...f.painPoints] as [string, string, string]
      pts[index] = value
      return { ...f, painPoints: pts }
    })
  }

  return (
    <>
      {toast && (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismiss} />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-manrope)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Strategy Hub
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: '#6b7280', marginTop: 6, fontSize: '0.95rem' }}>
            Define your digital cartography.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-8 items-start">

          {/* LEFT — Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* 1. Niche */}
            <fieldset className="flex flex-col gap-2">
              <label style={labelStyle}>Your Niche</label>
              <input
                style={inputStyle}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                placeholder="e.g. B2B SaaS founder teaching systems thinking"
                value={form.niche}
                onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
              />
              <p style={helperStyle}>Be specific. "Entrepreneur" is too broad.</p>
            </fieldset>

            {/* 2. Brand Voice */}
            <fieldset className="flex flex-col gap-2">
              <label style={labelStyle}>Brand Voice</label>
              <div className="flex flex-wrap gap-2">
                {VOICE_OPTIONS.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, brandVoice: f.brandVoice === v ? '' : v }))}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      background: form.brandVoice === v ? 'var(--color-primary)' : 'var(--color-chip-bg)',
                      color: form.brandVoice === v ? '#ffffff' : 'var(--color-chip-text)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 3. Target Audience + Pain Points */}
            <fieldset className="flex flex-col gap-3">
              <label style={labelStyle}>Target Audience</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                placeholder="Describe who you're creating for"
                value={form.targetAudience}
                onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
              />
              <div className="flex flex-col gap-2">
                {([0, 1, 2] as const).map(i => (
                  <input
                    key={i}
                    style={inputStyle}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    placeholder={`Pain Point ${i + 1}`}
                    value={form.painPoints[i]}
                    onChange={e => setPainPoint(i, e.target.value)}
                  />
                ))}
              </div>
            </fieldset>

            {/* 4. Content Pillars */}
            <fieldset className="flex flex-col gap-2">
              <label style={labelStyle}>
                Content Pillars
                <span style={{ ...helperStyle, marginLeft: 8 }}>({form.contentPillars.length}/5)</span>
              </label>
              <input
                ref={pillarRef}
                style={inputStyle}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                placeholder="Type a topic and press Enter to add"
                value={pillarInput}
                onChange={e => setPillarInput(e.target.value)}
                onKeyDown={handlePillarKeyDown}
                disabled={form.contentPillars.length >= 5}
              />
              {form.contentPillars.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.contentPillars.map(p => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        background: 'var(--color-chip-bg)',
                        color: 'var(--color-chip-text)',
                      }}
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => removePillar(p)}
                        className="flex items-center opacity-60 hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${p}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </fieldset>

            {/* 5. Active Platforms */}
            <fieldset className="flex flex-col gap-2">
              <label style={labelStyle}>Active Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      background: form.activePlatforms.includes(p) ? 'var(--color-primary)' : 'var(--color-chip-bg)',
                      color: form.activePlatforms.includes(p) ? '#ffffff' : 'var(--color-chip-text)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Submit */}
            <Button type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </form>

          {/* RIGHT — Live Preview */}
          <div className="lg:sticky lg:top-10">
            <Card>
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 20 }}>
                Core Topic Alignment
              </p>

              {/* Niche circle */}
              <div className="flex justify-center mb-5">
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background: '#e1e3e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 600,
                      fontSize: form.niche.length > 40 ? '0.72rem' : form.niche.length > 20 ? '0.82rem' : '0.95rem',
                      color: 'var(--color-text-primary)',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      wordBreak: 'break-word',
                    }}
                  >
                    {form.niche || <span style={{ color: '#9ca3af', fontWeight: 400 }}>Your niche</span>}
                  </p>
                </div>
              </div>

              {/* Brand voice */}
              <div className="flex justify-center mb-4">
                {form.brandVoice ? (
                  <Chip active>{form.brandVoice}</Chip>
                ) : (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#9ca3af' }}>
                    No voice selected
                  </span>
                )}
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap justify-center gap-2">
                {form.activePlatforms.length > 0 ? (
                  form.activePlatforms.map(p => <Chip key={p}>{p}</Chip>)
                ) : (
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#9ca3af' }}>
                    No platforms selected
                  </span>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: 'var(--color-text-primary)',
}

const helperStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.75rem',
  color: '#9ca3af',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  background: 'var(--color-surface-card)',
  border: '1px solid #e5e7eb',
}
