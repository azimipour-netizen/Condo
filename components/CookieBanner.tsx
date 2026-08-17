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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl shadow-xl p-4 sm:p-5 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-sm text-[color:var(--foreground)] flex-1 leading-relaxed">
            We use cookies to improve your experience and analyze site traffic. By accepting, you consent to their use in accordance with our privacy policy.
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
