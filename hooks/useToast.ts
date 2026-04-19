'use client'

import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  variant: 'success' | 'error'
  id: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, variant: 'success' | 'error') => {
    setToast({ message, variant, id: Date.now() })
  }, [])

  const dismiss = useCallback(() => {
    setToast(null)
  }, [])

  return { toast, showToast, dismiss }
}
