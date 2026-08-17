'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageView(propertyId?: string) {
  const pathname = usePathname()

  useEffect(() => {
    let sessionId = sessionStorage.getItem('sid')
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2)
      sessionStorage.setItem('sid', sessionId)
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, propertyId, sessionId }),
    }).catch(() => {})
  }, [pathname, propertyId])
}
