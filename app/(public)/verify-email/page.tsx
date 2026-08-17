'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

function VerifyContent() {
  const params = useSearchParams()
  const success = params.get('success')
  const error = params.get('error')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function resend() {
    setSending(true)
    await fetch('/api/auth/send-verification', { method: 'POST' })
    setSending(false)
    setSent(true)
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14L11 19L22 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[color:var(--foreground)] mb-2">Email verified!</h1>
        <p className="text-sm text-[color:var(--muted)] mb-6">Your account is now fully active.</p>
        <Link href="/" className="px-5 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
          Browse listings
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-[color:var(--foreground)] mb-2">Link expired</h1>
        <p className="text-sm text-[color:var(--muted)] mb-6">
          {error === 'expired' ? 'This verification link has expired.' : 'Invalid verification link.'}
        </p>
        {sent ? (
          <p className="text-sm text-emerald-600">New verification email sent — check your inbox.</p>
        ) : (
          <button onClick={resend} disabled={sending}
            className="px-5 py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition">
            {sending ? 'Sending…' : 'Send new link'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold text-[color:var(--foreground)] mb-2">Check your email</h1>
      <p className="text-sm text-[color:var(--muted)] mb-6 max-w-xs mx-auto">
        We sent a verification link to your email address. Click it to activate your account.
      </p>
      {sent ? (
        <p className="text-sm text-emerald-600">Resent — check your inbox.</p>
      ) : (
        <button onClick={resend} disabled={sending}
          className="text-sm text-[color:var(--accent)] hover:underline disabled:opacity-60">
          {sending ? 'Sending…' : 'Resend email'}
        </button>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="text-sm text-[color:var(--muted)] text-center">Loading…</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
}
