'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shuffle, CreditCard, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Strategy', href: '/strategy', icon: Home },
  { label: 'Remix Engine', href: '/remix', icon: Shuffle },
  { label: 'Pricing', href: '/pricing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            style={active ? {
              background: '#ffffff',
              boxShadow: 'var(--shadow-card)',
              borderRadius: '10px',
            } : {}}
            className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
          >
            <Icon
              size={18}
              style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)', opacity: active ? 1 : 0.6 }}
            />
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                opacity: active ? 1 : 0.7,
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
