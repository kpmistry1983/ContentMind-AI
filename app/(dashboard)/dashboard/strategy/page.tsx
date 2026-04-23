'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'

const VOICE_OPTIONS = [
  { label: 'Strategic',      description: 'Frameworks, systems, clear logic',    emoji: '🎯' },
  { label: 'Empathetic',     description: 'Warm, human, story-driven',            emoji: '💛' },
  { label: 'Authoritative',  description: 'Expert, direct, confident',            emoji: '⚡' },
  { label: 'Minimalist',     description: 'Short, sharp, no fluff',               emoji: '✦' },
  { label: 'Clear',          description: 'Plain language, easy to follow',       emoji: '💡' },
] as const

const PLATFORM_OPTIONS = ['LinkedIn', 'X (Twitter)', 'Instagram', 'Newsletter', 'TikTok'] as const

const PLATFORM_ICONS: Record<string, string> = {
  'LinkedIn':    '💼',
  'X (Twitter)': '𝕏',
  'Instagram':   '📸',
  'Newsletter':  '📧',
  'TikTok':      '🎵',
}

const PILLAR_SUGGESTIONS = [
  'Behind the Scenes', 'Case Studies', 'Tips & Tactics', 'Mindset',
  'Industry News', 'Lessons Learned', 'Product Updates', 'Client Wins',
  'How-To Guides', 'Contrarian Takes', 'Personal Story', 'Tools & Resources',
]

const PAIN_PROMPTS = [
  { label: 'Daily frustration',  placeholder: "e.g. Can't find time to create consistent content" },
  { label: 'Failed attempts',    placeholder: 'e.g. Tried posting daily but burned out after a week' },
  { label: 'Desired outcome',    placeholder: 'e.g. Wake up to inbound leads from their content' },
]

const STEPS = ['Your Niche', 'Brand Voice', 'Audience', 'Content Pillars', 'Platforms']

type BrandVoice = typeof VOICE_OPTIONS[number]['label']
type Platform = typeof PLATFORM_OPTIONS[number]

interface NicheParts {
  audience: string
  goal: string
  method: string
}

interface FormState {
  nicheParts: NicheParts
  brandVoice: BrandVoice | ''
  targetAudience: string
  painPoints: [string, string, string]
  contentPillars: string[]
  activePlatforms: Platform[]
}

const EMPTY_FORM: FormState = {
  nicheParts: { audience: '', goal: '', method: '' },
  brandVoice: '',
  targetAudience: '',
  painPoints: ['', '', ''],
  contentPillars: [],
  activePlatforms: [],
}

function assembleNiche(p: NicheParts): string {
  if (!p.audience && !p.goal && !p.method) return ''
  return `I help ${p.audience} who want ${p.goal} by ${p.method}`
}

function parseNiche(niche: string): NicheParts {
  const m = niche.match(/^I help (.+) who want (.+) by (.+)$/)
  if (m) return { audience: m[1], goal: m[2], method: m[3] }
  return { audience: niche, goal: '', method: '' }
}

export default function StrategyPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [step, setStep] = useState(0)
  const [pillarInput, setPillarInput] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast, showToast, dismiss } = useToast()

  useEffect(() => {
    async function load() {
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
          nicheParts: parseNiche(data.niche ?? ''),
          brandVoice: (data.brand_voice as BrandVoice) ?? '',
          targetAudience: data.target_audience ?? '',
          painPoints: (data.audience_pain_points as [string, string, string]) ?? ['', '', ''],
          contentPillars: (data.content_pillars as string[]) ?? [],
          activePlatforms: (data.active_platforms as Platform[]) ?? [],
        })
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        niche: assembleNiche(form.nicheParts),
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

  function togglePillar(p: string) {
    if (form.contentPillars.includes(p)) {
      setForm(f => ({ ...f, contentPillars: f.contentPillars.filter(x => x !== p) }))
    } else if (form.contentPillars.length < 5) {
      setForm(f => ({ ...f, contentPillars: [...f.contentPillars, p] }))
    }
  }

  function handlePillarKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const v = pillarInput.trim()
    if (!v || form.contentPillars.includes(v) || form.contentPillars.length >= 5) return
    setForm(f => ({ ...f, contentPillars: [...f.contentPillars, v] }))
    setPillarInput('')
  }

  function setPainPoint(i: number, value: string) {
    setForm(f => {
      const pts = [...f.painPoints] as [string, string, string]
      pts[i] = value
      return { ...f, painPoints: pts }
    })
  }

  const assembled = assembleNiche(form.nicheParts)

  return (
    <>
      {toast && <Toast key={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismiss} />}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-manrope)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Strategy Hub
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: '#6b7280', marginTop: 6, fontSize: '0.95rem' }}>
            Build your content strategy in 5 quick steps.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <button type="button" onClick={() => setStep(i)} className="flex flex-col items-center gap-1.5">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  background: i < step ? 'var(--color-primary)' : i === step ? 'rgba(245,158,11,0.15)' : 'var(--color-surface-card)',
                  border: i === step ? '2px solid var(--color-primary)' : i < step ? 'none' : '2px solid rgba(255,255,255,0.1)',
                }}>
                  {i < step
                    ? <Check size={14} color="#fff" />
                    : <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 600, color: i === step ? 'var(--color-primary)' : '#6b7280' }}>{i + 1}</span>
                  }
                </div>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.68rem', whiteSpace: 'nowrap', fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--color-primary)' : '#6b7280' }}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, marginBottom: 22, transition: 'background 0.2s', background: i < step ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>

          {/* Step 0 — Niche */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 style={stepTitleStyle}>Define your niche</h2>
                <p style={stepDescStyle}>Complete the sentence — it forces clarity on exactly who you serve.</p>
              </div>
              <div className="flex flex-col gap-5">
                <MadLibsRow prefix="I help" value={form.nicheParts.audience} onChange={v => setForm(f => ({ ...f, nicheParts: { ...f.nicheParts, audience: v } }))} placeholder="founders, marketers, coaches…" hint="Who is your primary audience?" />
                <MadLibsRow prefix="who want" value={form.nicheParts.goal} onChange={v => setForm(f => ({ ...f, nicheParts: { ...f.nicheParts, goal: v } }))} placeholder="grow on LinkedIn, land more clients…" hint="What outcome do they want?" />
                <MadLibsRow prefix="by" value={form.nicheParts.method} onChange={v => setForm(f => ({ ...f, nicheParts: { ...f.nicheParts, method: v } }))} placeholder="sharing systems & frameworks…" hint="How do you help them get there?" />
              </div>
              {assembled && (
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                    &ldquo;{assembled}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1 — Brand Voice */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 style={stepTitleStyle}>Pick your brand voice</h2>
                <p style={stepDescStyle}>Choose the tone that feels most like you. You can always change it later.</p>
              </div>
              <div className="flex flex-col gap-3">
                {VOICE_OPTIONS.map(v => {
                  const active = form.brandVoice === v.label
                  return (
                    <button key={v.label} type="button" onClick={() => setForm(f => ({ ...f, brandVoice: active ? '' : v.label }))}
                      className="flex items-center gap-4 w-full"
                      style={{ background: active ? 'rgba(245,158,11,0.1)' : 'var(--color-surface-low)', border: active ? '1.5px solid var(--color-primary)' : '1.5px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    >
                      <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{v.emoji}</span>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '0.9rem', color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{v.label}</span>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#9ca3af' }}>{v.description}</span>
                      </div>
                      {active && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Audience */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 style={stepTitleStyle}>Know your audience</h2>
                <p style={stepDescStyle}>Specificity is what separates forgettable content from content that converts.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>
                  Who are they?
                  <InfoTip text="Describe their role, industry, or life stage. The more specific, the better your content resonates." />
                </label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  placeholder="e.g. Early-stage SaaS founders (pre-revenue) trying to build an audience before they launch"
                  value={form.targetAudience}
                  onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label style={labelStyle}>
                  What drives them?
                  <InfoTip text="These 3 pain points will shape every piece of content you create — be brutally honest." />
                </label>
                {PAIN_PROMPTS.map((prompt, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>{prompt.label}</span>
                    <input style={inputStyle}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      placeholder={prompt.placeholder}
                      value={form.painPoints[i]}
                      onChange={e => setPainPoint(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Content Pillars */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 style={stepTitleStyle}>Choose your content pillars</h2>
                <p style={stepDescStyle}>Pick up to 5 topics you&apos;ll own. Tap a suggestion or type your own.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PILLAR_SUGGESTIONS.map(p => {
                  const selected = form.contentPillars.includes(p)
                  const disabled = !selected && form.contentPillars.length >= 5
                  return (
                    <button key={p} type="button" disabled={disabled} onClick={() => togglePillar(p)}
                      className="flex items-center gap-1.5"
                      style={{ background: selected ? 'rgba(245,158,11,0.12)' : 'var(--color-surface-low)', border: selected ? '1.5px solid var(--color-primary)' : '1.5px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 13px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s' }}
                    >
                      {selected && <Check size={11} color="var(--color-primary)" />}
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', fontWeight: selected ? 600 : 400, color: selected ? 'var(--color-primary)' : '#9ca3af' }}>{p}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>
                  Add your own&nbsp;
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>({form.contentPillars.length}/5 selected)</span>
                </label>
                <input style={inputStyle}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  placeholder="Type a topic and press Enter"
                  value={pillarInput}
                  onChange={e => setPillarInput(e.target.value)}
                  onKeyDown={handlePillarKeyDown}
                  disabled={form.contentPillars.length >= 5}
                />
                {form.contentPillars.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {form.contentPillars.map(p => (
                      <span key={p} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                        style={{ fontFamily: 'var(--font-inter)', background: 'var(--color-chip-bg)', color: 'var(--color-chip-text)' }}
                      >
                        {p}
                        <button type="button" onClick={() => togglePillar(p)} className="flex items-center opacity-60 hover:opacity-100 transition-opacity" aria-label={`Remove ${p}`}>
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 — Platforms */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 style={stepTitleStyle}>Where do you publish?</h2>
                <p style={stepDescStyle}>Select every platform where you want to build an audience.</p>
              </div>
              <div className="flex flex-col gap-3">
                {PLATFORM_OPTIONS.map(p => {
                  const active = form.activePlatforms.includes(p)
                  return (
                    <button key={p} type="button"
                      onClick={() => setForm(f => ({ ...f, activePlatforms: active ? f.activePlatforms.filter(x => x !== p) : [...f.activePlatforms, p] }))}
                      className="flex items-center gap-4 w-full"
                      style={{ background: active ? 'rgba(245,158,11,0.1)' : 'var(--color-surface-low)', border: active ? '1.5px solid var(--color-primary)' : '1.5px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    >
                      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{PLATFORM_ICONS[p]}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 500, fontSize: '0.9rem', flex: 1, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{p}</span>
                      {active && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={() => setStep(s => s - 1)}
            style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-white/5"
          >
            <ChevronLeft size={16} style={{ color: '#9ca3af' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: '#9ca3af' }}>Back</span>
          </button>

          {step === STEPS.length - 1 ? (
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Strategy'}
            </Button>
          ) : (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{ background: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Next</span>
              <ChevronRight size={16} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

function MadLibsRow({ prefix, value, onChange, placeholder, hint }: {
  prefix: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  hint: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, minWidth: 72, textAlign: 'right', flexShrink: 0 }}>
          {prefix}
        </span>
        <input
          style={inputStyle}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: '#9ca3af', paddingLeft: 84 }}>{hint}</p>
    </div>
  )
}

function InfoTip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative inline-flex align-middle ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700 }}>i</span>
      </button>
      {visible && (
        <div style={{ position: 'absolute', left: 22, top: -4, background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', zIndex: 10, width: 220 }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: '#d1d5db' }}>{text}</p>
        </div>
      )}
    </span>
  )
}

const stepTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-manrope)',
  fontWeight: 700,
  fontSize: '1.25rem',
  color: 'var(--color-text-primary)',
  marginBottom: 4,
}

const stepDescStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.85rem',
  color: '#9ca3af',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: 'var(--color-text-primary)',
  display: 'flex',
  alignItems: 'center',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  background: 'var(--color-surface-card)',
  border: '1px solid rgba(255,255,255,0.08)',
}
