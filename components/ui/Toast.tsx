'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ToastProps {
  message: string
  variant: 'success' | 'error'
  onDismiss: () => void
}

export default function Toast({ message, variant, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true))
    const dismiss = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 4000)
    return () => {
      cancelAnimationFrame(enter)
      clearTimeout(dismiss)
    }
  }, [onDismiss])

  const styles = {
    success: {
      background: '#f0fdf4',
      borderLeft: '4px solid #22c55e',
    },
    error: {
      background: '#fff0ee',
      borderLeft: '4px solid var(--color-error)',
    },
  }

  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle
  const iconColor = variant === 'success' ? '#22c55e' : 'var(--color-error)'

  return (
    <div
      role="alert"
      className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg max-w-sm transition-all duration-300"
      style={{
        ...styles[variant],
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
      }}
    >
      <Icon size={18} style={{ color: iconColor, marginTop: 2, flexShrink: 0 }} />
      <p className="text-sm leading-snug" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-inter)' }}>
        {message}
      </p>
    </div>
  )
}
