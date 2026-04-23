'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { Pencil } from 'lucide-react'
import type { Mission } from '@/types/index'

interface Props {
  initialMissions: Mission[]
  niche: string
  canGenerateMore: boolean
  firstName: string
}

const ACCENT: Record<Mission['status'], string> = {
  pending: '#d1d5db',
  in_progress: '#f59e0b',
  done: '#22c55e',
  dismissed: '#d1d5db',
}

function nextStatus(s: Mission['status']): Mission['status'] {
  if (s === 'pending') return 'in_progress'
  if (s === 'in_progress') return 'done'
  return s
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl overflow-hidden flex"
      style={{ minHeight: 176, background: 'var(--color-surface-card)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="w-1 shrink-0 bg-white/10" />
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-5 bg-white/10 rounded-full w-20" />
          <div className="h-4 bg-white/10 rounded w-12" />
        </div>
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-4/5" />
        <div className="mt-auto flex gap-2">
          <div className="h-8 bg-white/10 rounded-xl w-32" />
          <div className="h-8 bg-white/10 rounded-xl w-24" />
        </div>
      </div>
    </div>
  )
}

function CompassIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="#d1d5db" strokeWidth="2" />
      <line x1="32" y1="4" x2="32" y2="14" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="50" x2="32" y2="60" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="32" x2="14" y2="32" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="32" x2="60" y2="32" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
      <polygon points="32,14 29,32 32,29 35,32" fill="#4343d5" />
      <polygon points="32,50 29,32 32,35 35,32" fill="#d1d5db" />
      <circle cx="32" cy="32" r="3" fill="#4343d5" />
    </svg>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function CommandCenter({ initialMissions, niche, canGenerateMore: initCanGenerate, firstName }: Props) {
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [canGenerateMore, setCanGenerateMore] = useState(initCanGenerate)

  const visible = missions.filter(m => !dismissingIds.has(m.id))
  const allDone = visible.length > 0 && visible.every(m => m.status === 'done')
  const isEmpty = visible.length === 0 && !generating

  const handleStatusChange = useCallback(async (id: string, current: Mission['status']) => {
    const next = nextStatus(current)
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: next } : m))
    await fetch(`/api/missions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
  }, [])

  const handleCopyHook = useCallback(async (id: string, hook: string) => {
    await navigator.clipboard.writeText(hook)
    setCopiedId(id)
    setTimeout(() => setCopiedId(c => (c === id ? null : c)), 2000)
  }, [])

  const handleDismiss = useCallback((id: string) => {
    setDismissingIds(prev => new Set([...prev, id]))
    setTimeout(() => {
      setMissions(prev => prev.filter(m => m.id !== id))
      setDismissingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      fetch(`/api/missions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dismissed' }),
      })
    }, 300)
  }, [])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/missions/generate', { method: 'POST' })
      if (res.ok) {
        const { missions: newMissions } = await res.json()
        setMissions(prev => [...prev, ...(newMissions as Mission[])])
      } else if (res.status === 402) {
        setCanGenerateMore(false)
      }
    } finally {
      setGenerating(false)
    }
  }, [])

  return (
    <div className="flex gap-6">
      {/* LEFT — 65% */}
      <div className="flex flex-col gap-4" style={{ flex: '0 0 65%', minWidth: 0 }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 700,
                fontSize: '2rem',
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
              }}
            >
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                color: '#6b7280',
                marginTop: '0.3rem',
                fontSize: '0.95rem',
              }}
            >
              Here are your content missions for today.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 shrink-0">
            {visible.length > 0 && (
              <Chip>
                {visible.length} Mission{visible.length !== 1 ? 's' : ''}
              </Chip>
            )}
            <Link
              href="/dashboard/strategy"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] transition-colors hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}
            >
              <Pencil size={12} style={{ color: '#9ca3af' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: '#9ca3af' }}>Edit Strategy</span>
            </Link>
          </div>
        </div>

        {/* All-done banner */}
        {allDone && (
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: 'rgba(34, 197, 94, 0.08)', borderLeft: '4px solid #22c55e' }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#86efac' }}>
              Today&apos;s missions complete. Your content is working.
            </p>
            {canGenerateMore && (
              <Button
                variant="ghost"
                onClick={handleGenerate}
                disabled={generating}
                className="ml-4 text-sm py-1 px-3 shrink-0"
              >
                Generate 3 More
              </Button>
            )}
          </div>
        )}

        {/* Mission cards */}
        {visible.map(mission => (
          <div
            key={mission.id}
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'var(--color-surface-card)',
              boxShadow: 'var(--shadow-card)',
              opacity: dismissingIds.has(mission.id) ? 0 : 1,
              transform: dismissingIds.has(mission.id) ? 'scale(0.96)' : 'scale(1)',
              transition: dismissingIds.has(mission.id)
                ? 'opacity 300ms ease, transform 300ms ease'
                : 'transform 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              if (!dismissingIds.has(mission.id)) {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'scale(1.005)'
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'scale(1)'
              el.style.boxShadow = 'var(--shadow-card)'
            }}
          >
            {/* Accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0"
              style={{ width: 4, background: ACCENT[mission.status], borderRadius: '12px 0 0 12px' }}
            />

            {/* Content */}
            <div className="pl-5 pr-4 py-4">
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <Chip>{mission.platform}</Chip>
                <div className="flex items-center gap-2">
                  {mission.estimated_time && (
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                      }}
                    >
                      {mission.estimated_time}
                    </span>
                  )}
                  <button
                    onClick={() => handleDismiss(mission.id)}
                    className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
                    aria-label="Dismiss mission"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.375rem',
                }}
              >
                {mission.title}
              </h3>

              {/* Rationale */}
              {mission.rationale && (
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '0.375rem',
                  }}
                >
                  {mission.rationale}
                </p>
              )}

              {/* Hook preview */}
              {mission.hook && (
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontStyle: 'italic',
                    fontSize: '0.8rem',
                    color: '#4343d5',
                    marginBottom: '0.75rem',
                  }}
                >
                  &ldquo;{mission.hook.length > 80 ? `${mission.hook.slice(0, 80)}…` : mission.hook}&rdquo;
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {mission.status !== 'done' && (
                  <Button
                    variant="ghost"
                    onClick={() => handleStatusChange(mission.id, mission.status)}
                    className="text-xs py-1.5 px-3"
                  >
                    {mission.status === 'pending' ? 'Mark In Progress' : 'Mark Done'}
                  </Button>
                )}
                {mission.hook && (
                  <Button
                    variant="ghost"
                    onClick={() => handleCopyHook(mission.id, mission.hook!)}
                    className="text-xs py-1.5 px-3"
                  >
                    {copiedId === mission.id ? 'Copied ✓' : 'Copy Hook'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Skeleton cards while generating */}
        {generating && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col gap-6">
            {/* Greeting */}
            <div
              style={{ background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '28px 28px 24px' }}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-1">
                <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
                  {getGreeting()}, {firstName}! 👋
                </h2>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#6b7280' }}>
                  Your strategy is set. Hit the button and ContentMind AI will build your content plan for today.
                </p>
              </div>
              <Button variant="primary" onClick={handleGenerate} className="shrink-0">
                Generate Today&apos;s Plan
              </Button>
            </div>

            {/* How it works */}
            <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              How it works
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🎯', title: 'AI builds your plan', body: 'Each day you get 3 content missions tailored to your niche and platforms.' },
                { icon: '✍️', title: 'Get a ready-made hook', body: 'Every mission comes with an opening hook you can copy and post straight away.' },
                { icon: '📈', title: 'Track your progress', body: 'Mark missions in-progress or done — your momentum stays visible at a glance.' },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: 'var(--color-surface-card)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '20px' }} className="flex flex-col gap-2">
                  <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                  <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{title}</p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.55 }}>{body}</p>
                </div>
              ))}
            </div>

            {/* Niche reminder */}
            <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.15)', padding: '14px 18px' }} className="flex items-center gap-3">
              <span style={{ fontSize: '1.1rem' }}>🧭</span>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: '#9ca3af' }}>
                Your niche: <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{niche}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — 35% */}
      <div className="flex flex-col gap-4" style={{ flex: '0 0 35%', minWidth: 0 }}>
        <h2
          style={{
            fontFamily: 'var(--font-manrope)',
            fontWeight: 600,
            fontSize: '1.25rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Strategic Insights
        </h2>

        {/* Insight card 1 */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'var(--color-surface-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
              }}
            >
              Micro-Trend Alert
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              lineHeight: 1.55,
            }}
          >
            Short-form educational content is seeing 3× engagement rates this week. Consider adapting
            your next post to a &ldquo;myth vs. fact&rdquo; format for maximum reach.
          </p>
        </div>

        {/* Insight card 2 */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'var(--color-surface-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
              }}
            >
              Algorithm Shift
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              lineHeight: 1.55,
            }}
          >
            LinkedIn is currently prioritizing native documents and carousels. Posts with PDFs
            are getting 40% more impressions than plain text updates this month.
          </p>
        </div>

        {/* Core Topic Alignment circle */}
        <div className="flex flex-col items-center mt-2">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 180, height: 180, background: 'rgba(245, 158, 11, 0.1)', border: '2px solid rgba(245, 158, 11, 0.25)' }}
          >
            <div className="text-center px-6">
              <p
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.35rem',
                }}
              >
                Niche
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                {niche}
              </p>
            </div>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '0.5rem',
            }}
          >
            Core Topic Alignment
          </p>
        </div>
      </div>
    </div>
  )
}
