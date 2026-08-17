'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters'); return }
    if (password !== confirm) { setErrorMsg('Passwords do not match'); return }
    setErrorMsg('')
    setStatus('saving')

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setErrorMsg(data.error ?? 'Something went wrong')
      setStatus('error')
    } else {
      setStatus('done')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-500">Invalid or missing reset token.{' '}
        <Link href="/forgot-password" className="underline">Request a new link.</Link>
      </p>
    )
  }

  if (status === 'done') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-sm text-emerald-600">
        Password updated. Redirecting to sign in…
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Confirm password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"
        />
      </div>
      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'saving'}
        className="w-full py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition"
      >
        {status === 'saving' ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-2">Set new password</h1>
        <p className="text-sm text-[color:var(--muted)] mb-6">Choose a strong password (min. 8 characters).</p>
        <Suspense fallback={<div className="text-sm text-[color:var(--muted)]">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
