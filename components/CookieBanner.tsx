'use client'

import { useState, useEffect } from 'react'

const KEY = 'cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl shadow-xl p-3 sm:p-5 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/*
            The full sentence wrapped to 3 lines on a 375px viewport, pushing
            the banner's height to ~190px — on the homepage that's tall
            enough to sit directly over the AI search box's submit button
            (confirmed live: getBoundingClientRect showed the button's
            bottom edge below the banner's top edge). Shorter copy on
            mobile keeps it to 1-2 lines instead of restructuring the
            homepage layout around the banner's height.
          */}
          <p className="text-sm text-[color:var(--foreground)] flex-1 leading-snug sm:leading-relaxed">
            <span className="sm:hidden">
              We use cookies to improve your experience.{' '}
              <a href="/privacy-policy" className="underline underline-offset-2">Privacy policy</a>
            </span>
            <span className="hidden sm:inline">
              We use cookies to improve your experience and analyze site traffic. By accepting, you consent to their use in accordance with our{' '}
              <a href="/privacy-policy" className="underline underline-offset-2 hover:text-[color:var(--accent)] transition-colors">privacy policy</a>.
            </span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-sm text-[color:var(--muted)] border border-[color:var(--border)] rounded-xl hover:border-[color:var(--foreground)] transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-4 py-2 text-sm font-semibold bg-[color:var(--accent)] text-white rounded-xl hover:opacity-90 transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
