import Link from 'next/link'
import { Zap, Target, Shuffle, ArrowRight, Check, X } from 'lucide-react'

const FEATURES = [
  {
    icon: Target,
    title: 'Strategy Hub',
    description:
      'Define your niche, brand voice, and target audience once. ContentMind AI remembers everything and builds every piece of content around your positioning.',
  },
  {
    icon: Zap,
    title: 'Daily Mission Engine',
    description:
      'Wake up to a personalized content action plan — titles, hooks, and rationale already written. No blank page. No guessing what to post.',
  },
  {
    icon: Shuffle,
    title: 'Remix Engine',
    description:
      'Turn one piece of content into five. Paste any post and instantly get platform-native rewrites for LinkedIn, Instagram, X, and more.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Define Your Strategy',
    description:
      'Tell ContentMind AI your niche, brand voice, and target audience. Takes 5 minutes. It remembers everything — you never repeat yourself.',
  },
  {
    number: '02',
    title: 'Get Your Daily Mission',
    description:
      'Wake up to a personalized content plan with titles, hooks, and platform angles pre-written. Open the app, pick your mission, start creating.',
  },
  {
    number: '03',
    title: 'Remix & Publish',
    description:
      'Turn one piece of content into five. Get platform-native versions for LinkedIn, Instagram, X, and more — ready to post in seconds.',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started, no card needed.',
    features: ['10 missions/month', 'Strategy Hub', 'Core content generation'],
    cta: 'Start Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$19',
    description: 'For consistent creators.',
    features: ['30 missions/month', 'All platforms', 'Priority support'],
    cta: 'Get Started',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For serious builders.',
    features: ['Unlimited missions', 'Advanced remix engine', 'Analytics'],
    cta: 'Go Pro',
    href: '/signup',
    highlight: false,
  },
]

const COMPARISON = [
  { feature: 'Remembers your niche & voice', us: true, them: false },
  { feature: 'Platform-native formatting', us: true, them: false },
  { feature: 'Daily content plan — pre-written', us: true, them: false },
  { feature: 'One-click multi-platform remix', us: true, them: false },
  { feature: 'No prompt engineering needed', us: true, them: false },
  { feature: 'Time to first post', us: '< 2 min', them: '30+ min' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>

      {/* Nav */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'var(--color-surface-low)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
            ContentMind AI
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                color: '#9ca3af',
                textDecoration: 'none',
                padding: '8px 16px',
              }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1a0a00',
                background: 'var(--gradient-primary)',
                borderRadius: 10,
                padding: '9px 20px',
                textDecoration: 'none',
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 100,
            padding: '5px 16px',
            marginBottom: 28,
          }}
        >
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
            AI-POWERED CONTENT STRATEGY
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-manrope)',
            fontWeight: 800,
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
            margin: '0 auto 24px',
            maxWidth: 780,
          }}
        >
          Stop staring at a blank page.{' '}
          <span style={{ color: 'var(--color-primary)' }}>Start creating with intent.</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#9ca3af',
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '0 auto 40px',
          }}
        >
          ContentMind AI turns your niche and brand voice into a daily content action plan — with hooks,
          titles, and platform-specific angles already written for you.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/signup"
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1a0a00',
              background: 'var(--gradient-primary)',
              borderRadius: 12,
              padding: '14px 32px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Start Free — No Card Required <ArrowRight size={18} />
          </Link>
        </div>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#4b5563', marginTop: 20 }}>
          No credit card · Cancel anytime · Setup in 5 minutes
        </p>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            marginTop: 64,
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '5+', label: 'hours saved per week' },
            { value: '< 2 min', label: 'to your first post' },
            { value: '5×', label: 'content from one idea' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>
                {value}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', margin: '4px 0 0' }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-text-primary)',
              marginBottom: 12,
            }}
          >
            Everything you need to publish consistently
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af', maxWidth: 480, margin: '0 auto' }}>
            Three tools. One system. Zero content paralysis.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              style={{
                background: 'var(--color-surface-card)',
                borderRadius: 20,
                padding: 32,
                border: '1px solid rgba(245, 158, 11, 0.08)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Icon size={22} color="var(--color-primary)" />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: 10,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: '#9ca3af',
                  lineHeight: 1.65,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--color-surface-low)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--color-text-primary)',
                marginBottom: 12,
              }}
            >
              Up and running in minutes
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af' }}>
              No onboarding calls. No learning curve.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 32,
            }}
          >
            {STEPS.map(({ number, title, description }) => (
              <div key={number} style={{ position: 'relative' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    fontWeight: 800,
                    fontSize: '3rem',
                    color: 'rgba(245, 158, 11, 0.18)',
                    margin: '0 0 12px',
                    lineHeight: 1,
                  }}
                >
                  {number}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: 10,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.9rem',
                    color: '#9ca3af',
                    lineHeight: 1.65,
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview — Daily Mission card */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-text-primary)',
              marginBottom: 12,
            }}
          >
            Here&apos;s what you wake up to
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af' }}>
            A ready-to-use content mission — no prompting required.
          </p>
        </div>

        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            background: 'var(--color-surface-card)',
            borderRadius: 20,
            border: '1px solid rgba(245, 158, 11, 0.2)',
            boxShadow: '0 0 60px rgba(245,158,11,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={16} color="var(--color-primary)" />
              <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                Today&apos;s Mission
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#1a0a00',
                background: 'var(--gradient-primary)',
                borderRadius: 100,
                padding: '3px 10px',
              }}
            >
              LinkedIn
            </span>
          </div>

          {/* Card body */}
          <div style={{ padding: '28px 28px 32px' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Title
              </p>
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)', lineHeight: 1.45 }}>
                The Counter-Intuitive Truth About LinkedIn Growth Most Founders Miss
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Hook
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.925rem', color: '#d1d5db', lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;Most SaaS founders are posting more content and getting fewer results. Here&apos;s the one shift that changed everything for me...&rdquo;
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Angle
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.6 }}>
                Challenge a common belief in your niche — that more volume equals more reach. Share how strategic positioning beats posting frequency, using your own product as a case study.
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#4b5563', margin: 0 }}>
              Generated from your Strategy Hub · Tailored to your brand voice
            </p>
            <Link
              href="/signup"
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: '0.825rem',
                color: '#1a0a00',
                background: 'var(--gradient-primary)',
                borderRadius: 8,
                padding: '8px 16px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Get yours free
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--color-surface-low)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--color-text-primary)',
                marginBottom: 12,
              }}
            >
              ContentMind AI vs. just using ChatGPT
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af' }}>
              ChatGPT is a blank canvas. ContentMind AI is a content system built for you.
            </p>
          </div>

          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 160px 160px',
              gap: 0,
              borderRadius: '16px 16px 0 0',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              borderBottom: 'none',
            }}
          >
            <div style={{ background: 'var(--color-surface-card)', padding: '14px 20px' }} />
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderLeft: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '14px 20px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)', margin: 0 }}>
                ContentMind AI
              </p>
            </div>
            <div
              style={{
                background: 'var(--color-surface-card)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                padding: '14px 20px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                ChatGPT
              </p>
            </div>
          </div>

          {/* Table rows */}
          {COMPARISON.map(({ feature, us, them }, i) => (
            <div
              key={feature}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 160px 160px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: 'none',
                borderRadius: i === COMPARISON.length - 1 ? '0 0 16px 16px' : 0,
                overflow: 'hidden',
              }}
            >
              <div style={{ background: 'var(--color-surface-card)', padding: '14px 20px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>
                  {feature}
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  borderLeft: '1px solid rgba(245, 158, 11, 0.15)',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {typeof us === 'boolean' ? (
                  us ? (
                    <Check size={17} color="var(--color-primary)" />
                  ) : (
                    <X size={17} color="#4b5563" />
                  )
                ) : (
                  <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.825rem', color: 'var(--color-primary)', margin: 0 }}>{us}</p>
                )}
              </div>
              <div
                style={{
                  background: 'var(--color-surface-card)',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {typeof them === 'boolean' ? (
                  them ? (
                    <Check size={17} color="#9ca3af" />
                  ) : (
                    <X size={17} color="#4b5563" />
                  )
                ) : (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', margin: 0 }}>{them}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof strip */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#6b7280' }}>
          Built for{' '}
          {['LinkedIn Creators', 'SaaS Founders', 'Coaches', 'Consultants', 'Agency Owners'].map((label, i, arr) => (
            <span key={label}>
              <span style={{ color: '#d1d5db', fontWeight: 500 }}>{label}</span>
              {i < arr.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-text-primary)',
              marginBottom: 12,
            }}
          >
            Simple, transparent pricing
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? 'var(--color-surface-card)' : 'var(--color-surface-low)',
                borderRadius: 20,
                padding: 32,
                border: plan.highlight
                  ? '2px solid rgba(245, 158, 11, 0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.highlight ? '0 0 40px rgba(245,158,11,0.08)' : 'none',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--gradient-primary)',
                    borderRadius: 100,
                    padding: '3px 14px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    color: '#1a0a00',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                {plan.name}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', marginBottom: 20 }}>
                {plan.description}
              </p>
              <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '2.25rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                {plan.price}
                <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: '0.9rem', color: '#6b7280' }}> /month</span>
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#d1d5db' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  borderRadius: 10,
                  padding: '12px 20px',
                  ...(plan.highlight
                    ? { background: 'var(--gradient-primary)', color: '#1a0a00' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-primary)', border: '1px solid rgba(255,255,255,0.1)' }),
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginTop: 32,
            flexWrap: 'wrap',
          }}
        >
          {['No credit card required', 'Cancel anytime', 'Secure payments via Stripe', 'Your data is never used to train AI'].map((label) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={13} color="var(--color-primary)" />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#6b7280' }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 96px' }}>
        <div
          style={{
            background: 'var(--color-surface-card)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: 24,
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: 'var(--color-text-primary)',
              marginBottom: 16,
            }}
          >
            Ready to cure content paralysis?
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', color: '#9ca3af', marginBottom: 32 }}>
            Set up your strategy in 5 minutes. Get your first missions immediately.
          </p>
          <Link
            href="/signup"
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1a0a00',
              background: 'var(--gradient-primary)',
              borderRadius: 12,
              padding: '14px 36px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Start Free Today <ArrowRight size={18} />
          </Link>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#4b5563', marginTop: 16 }}>
            No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
            ContentMind AI
          </span>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/login" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/signup" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Sign Up</Link>
            <Link href="/dashboard/pricing" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/privacy" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#4b5563' }}>
            © {new Date().getFullYear()} Sun Mistry LLC. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
