'use client'

import { useEffect, useRef, useId } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      remove: (id: string) => void
      reset: (id?: string) => void
    }
  }
}

let scriptPromise: Promise<void> | null = null
function loadTurnstile(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve()
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Turnstile failed to load'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

interface Props {
  /** Receives the token to send with the form, or '' when it expires. */
  onVerify: (token: string) => void
}

/**
 * Cloudflare Turnstile widget. Renders nothing when no site key is configured,
 * so local development and preview builds still work without Cloudflare.
 */
export default function Turnstile({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onVerifyRef = useRef(onVerify)
  onVerifyRef.current = onVerify
  const id = useId()

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let cancelled = false

    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onVerifyRef.current(''),
          'error-callback':   () => onVerifyRef.current(''),
          theme: 'auto',
        })
      })
      .catch(() => onVerifyRef.current(''))

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current) } catch { /* already gone */ }
        widgetId.current = null
      }
    }
  }, [id])

  if (!SITE_KEY) return null
  return <div ref={ref} className="flex justify-center" />
}

export const TURNSTILE_ENABLED = !!SITE_KEY
