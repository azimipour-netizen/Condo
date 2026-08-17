'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setStatus('sent')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-2">Forgot password</h1>
        <p className="text-sm text-[color:var(--muted)] mb-6">
          Enter your email and we&apos;ll send a reset link if an account exists.
        </p>

        {status === 'sent' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-sm text-emerald-600">
            Check your inbox — a reset link is on its way.
            <div className="mt-4">
              <Link href="/login" className="text-[color:var(--accent)] hover:underline text-xs">Back to sign in</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition"
            >
              {status === 'sending' ? 'Sending…' : 'Send reset link'}
            </button>
            <p className="text-center text-xs text-[color:var(--muted)]">
              <Link href="/login" className="hover:text-[color:var(--accent)]">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
