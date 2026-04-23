'use client'

import { useState, useCallback } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

const PLATFORMS = ['LinkedIn', 'X (Twitter)', 'Instagram', 'Newsletter', 'TikTok'] as const
type Platform = (typeof PLATFORMS)[number]

interface RemixOutput {
  platform: string
  content: string
  char_count: number
  angle: string
  formatting_notes: string
}

function SkeletonCard() {
  return (
    <Card>
      <div className="animate-pulse flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 rounded-full" style={{ background: 'var(--color-chip-bg)' }} />
          <div className="h-4 w-16 rounded" style={{ background: 'var(--color-chip-bg)' }} />
        </div>
        <div className="h-3 w-40 rounded" style={{ background: 'var(--color-chip-bg)' }} />
        <div className="flex flex-col gap-2 mt-1">
          <div className="h-3 w-full rounded" style={{ background: 'var(--color-chip-bg)' }} />
          <div className="h-3 w-5/6 rounded" style={{ background: 'var(--color-chip-bg)' }} />
          <div className="h-3 w-4/6 rounded" style={{ background: 'var(--color-chip-bg)' }} />
        </div>
      </div>
    </Card>
  )
}

function OutputCard({ output }: { output: RemixOutput }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(output.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output.content])

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <Chip active>{output.platform}</Chip>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#6b7280' }}>
          {output.char_count.toLocaleString()} chars
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', fontStyle: 'italic', color: '#6b7280', marginBottom: 10 }}>
        {output.angle}
      </p>

      <pre
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {output.content}
      </pre>

      <div className="flex items-start justify-between gap-4 mt-4">
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.5 }}>
          {output.formatting_notes}
        </p>
        <Button variant="ghost" onClick={copy} className="shrink-0 text-xs px-3 py-1.5">
          {copied ? 'Copied ✓' : 'Copy'}
        </Button>
      </div>
    </Card>
  )
}

export default function RemixPage() {
  const [seedContent, setSeedContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [outputs, setOutputs] = useState<RemixOutput[] | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast, showToast, dismiss } = useToast()

  function togglePlatform(p: Platform) {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const canSubmit = seedContent.trim().length > 0 && selectedPlatforms.length > 0

  async function handleRemix() {
    if (!canSubmit || loading) return
    setLoading(true)
    setOutputs(null)
    try {
      const res = await fetch('/api/remix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed_content: seedContent, platforms: selectedPlatforms }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.upgrade) {
          showToast('Upgrade to remix more content.', 'error')
        } else {
          showToast(data.error ?? 'Something went wrong.', 'error')
        }
        return
      }
      setOutputs(data.outputs)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
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
            Remix
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: '#6b7280', marginTop: 6, fontSize: '0.95rem' }}>
            One idea. Every platform.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 items-start">

          {/* LEFT — Input panel */}
          <Card>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Your Seed Content</label>
                <textarea
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  placeholder="Paste a tweet, LinkedIn post, article paragraph, or raw idea — ContentMind AI will transform it for every platform you choose."
                  value={seedContent}
                  onChange={e => setSeedContent(e.target.value)}
                />
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#9ca3af' }}>
                  {seedContent.length.toLocaleString()} characters
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Remix for these platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        background: selectedPlatforms.includes(p) ? 'var(--color-primary)' : 'var(--color-chip-bg)',
                        color: selectedPlatforms.includes(p) ? '#ffffff' : 'var(--color-chip-text)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                disabled={!canSubmit || loading}
                onClick={handleRemix}
              >
                {loading ? 'Remixing…' : 'Remix My Content'}
              </Button>
            </div>
          </Card>

          {/* RIGHT — Output panel */}
          <div className="flex flex-col gap-4">
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {!loading && outputs && outputs.map(output => (
              <OutputCard key={output.platform} output={output} />
            ))}

            {!loading && !outputs && (
              <div
                className="rounded-2xl p-10 flex items-center justify-center"
                style={{ border: '2px dashed #e1e3e4', minHeight: 240 }}
              >
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#9ca3af', textAlign: 'center' }}>
                  Your remixed content will appear here.
                </p>
              </div>
            )}
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

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  background: 'var(--color-surface-card)',
  border: '1px solid #e5e7eb',
}
