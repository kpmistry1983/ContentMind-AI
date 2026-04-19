'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Home, Shuffle, CreditCard, Settings, LogOut } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Strategy', href: '/dashboard/strategy', icon: Home },
  { label: 'Remix Engine', href: '/dashboard/remix', icon: Shuffle },
  { label: 'Pricing', href: '/dashboard/pricing', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            style={active ? {
              background: 'rgba(245, 158, 11, 0.12)',
              borderRadius: '10px',
            } : {}}
            className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-[10px] hover:bg-white/5"
          >
            <Icon
              size={18}
              style={{ color: active ? 'var(--color-primary)' : '#6b7280', flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-primary)' : '#9ca3af',
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-[10px] hover:bg-white/5 w-full mt-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <LogOut size={18} style={{ color: '#6b7280', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, color: '#9ca3af' }}>
          Sign Out
        </span>
      </button>
    </nav>
  )
}
