import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — ContentMind AI',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      <nav
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'var(--color-surface-low)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
            ContentMind AI
          </Link>
        </div>
      </nav>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none', marginBottom: 40 }}
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <h1 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--color-text-primary)', marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#6b7280', marginBottom: 48 }}>
          Last updated: April 2026
        </p>

        {[
          {
            title: '1. Information We Collect',
            body: 'We collect information you provide directly when you create an account (name, email address), the content strategy details and brand voice information you enter into the Strategy Hub, usage data such as missions generated and remixes created, and payment information processed securely by Stripe. We do not store full credit card numbers.',
          },
          {
            title: '2. How We Use Your Information',
            body: 'We use your information to provide and improve ContentMind AI, generate personalized content missions and remixes using your strategy settings, send transactional emails (account confirmation, subscription updates), and respond to support requests. We do not sell your personal data to third parties.',
          },
          {
            title: '3. Your Content Is Not Used to Train AI',
            body: 'The content you create, your brand voice settings, and your strategy data are never used to train AI models — ours or anyone else\'s. Your content is yours.',
          },
          {
            title: '4. Data Storage & Security',
            body: 'Your data is stored securely using Supabase infrastructure with encryption at rest and in transit. We follow industry-standard practices to protect your information against unauthorized access.',
          },
          {
            title: '5. Third-Party Services',
            body: 'We use Stripe for payment processing, Supabase for database and authentication, OpenAI for content generation (your data is subject to OpenAI\'s data processing terms), and Resend for transactional email delivery.',
          },
          {
            title: '6. Data Retention',
            body: 'We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.',
          },
          {
            title: '7. Your Rights',
            body: 'You have the right to access, correct, or delete your personal data at any time. You can manage most settings from your account page. To request full data deletion or export, contact us at the email below.',
          },
          {
            title: '8. Contact',
            body: 'If you have questions about this policy, email us at: hello@sunmistry.com',
          },
        ].map(({ title, body }) => (
          <section key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: 10 }}>
              {title}
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.75 }}>
              {body}
            </p>
          </section>
        ))}
      </article>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <Link href="/terms" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
