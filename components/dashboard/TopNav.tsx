'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Shuffle, CreditCard, Settings, LogOut } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Playbook', href: '/dashboard/strategy', icon: Home, exact: false },
  { label: 'Remix', href: '/dashboard/remix', icon: Shuffle, exact: false },
  { label: 'Pricing', href: '/dashboard/pricing', icon: CreditCard, exact: false },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, exact: false },
]

interface TopNavProps {
  avatarLetter: string
  fullName: string
  tier: string
}

export default function TopNav({ avatarLetter, fullName, tier }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <header
      style={{
        background: 'var(--color-surface-low)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: 64,
        flexShrink: 0,
      }}
      className="flex items-center px-6 w-full"
    >
      {/* Logo — clickable, links to dashboard */}
      <Link
        href="/dashboard"
        style={{
          fontFamily: 'var(--font-manrope)',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--color-primary)',
          flexShrink: 0,
          textDecoration: 'none',
        }}
      >
        ContentMind AI
      </Link>

      {/* Nav items — centered */}
      <nav className="flex items-center gap-1 flex-1 justify-center">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              style={active ? { background: 'rgba(245, 158, 11, 0.12)', borderRadius: 10 } : {}}
              className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-[10px] hover:bg-white/5"
            >
              <Icon size={16} style={{ color: active ? 'var(--color-primary)' : '#6b7280', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontWeight: active ? 600 : 400, color: active ? 'var(--color-primary)' : '#9ca3af' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex flex-col items-end">
          <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 500, fontSize: '0.8rem', color: 'var(--color-text-primary)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fullName}
          </span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tier}
          </span>
        </div>

        <div
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: '#ffffff', fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}
          className="flex items-center justify-center"
        >
          {avatarLetter}
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-2 transition-colors rounded-[10px] hover:bg-white/5"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={14} style={{ color: '#6b7280' }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#6b7280' }}>Sign out</span>
        </button>
      </div>
    </header>
  )
}
