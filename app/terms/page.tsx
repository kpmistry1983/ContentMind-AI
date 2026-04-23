import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — ContentMind AI',
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: '#6b7280', marginBottom: 48 }}>
          Last updated: April 2026
        </p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using ContentMind AI, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the service. These terms apply to all users, including free and paid subscribers.',
          },
          {
            title: '2. Description of Service',
            body: 'ContentMind AI is an AI-powered content strategy platform that provides personalized content missions, a strategy hub for brand voice management, and a remix engine for multi-platform content generation. The service is operated by Sun Mistry LLC.',
          },
          {
            title: '3. Account Responsibilities',
            body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information when creating your account and keep it up to date. You may not share your account with others or use the service for any unlawful purpose.',
          },
          {
            title: '4. Acceptable Use',
            body: 'You agree not to use ContentMind AI to generate content that is illegal, harmful, defamatory, or violates the rights of others. You may not attempt to reverse-engineer, scrape, or misuse the platform. We reserve the right to suspend accounts that violate these terms.',
          },
          {
            title: '5. Intellectual Property',
            body: 'The content you create using ContentMind AI belongs to you. ContentMind AI retains ownership of the platform, its design, underlying technology, and AI systems. You grant us a limited license to process your inputs solely to provide the service.',
          },
          {
            title: '6. Subscriptions & Billing',
            body: 'Paid plans are billed monthly or annually via Stripe. You may cancel your subscription at any time from your account settings — cancellation takes effect at the end of your current billing period. We do not offer refunds for partial billing periods unless required by law.',
          },
          {
            title: '7. Service Availability',
            body: 'We strive to maintain high availability but do not guarantee uninterrupted access to ContentMind AI. We may perform maintenance, updates, or experience outages. We are not liable for any losses resulting from service unavailability.',
          },
          {
            title: '8. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Sun Mistry LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of ContentMind AI. Our total liability to you shall not exceed the amount you paid us in the past 12 months.',
          },
          {
            title: '9. Changes to Terms',
            body: 'We may update these terms from time to time. We will notify you of material changes via email or an in-app notice. Continued use of the service after changes take effect constitutes acceptance of the updated terms.',
          },
          {
            title: '10. Contact',
            body: 'For questions about these terms, contact us at: hello@sunmistry.com',
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
          <Link href="/privacy" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.825rem', color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}
