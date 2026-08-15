'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Registration failed.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, callbackUrl: '/', redirect: true })
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-xl font-bold text-[color:var(--foreground)]">Toronto Realty</span>
        </Link>

        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-[color:var(--foreground)] mb-6">Create account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)]">Full name</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent"
                placeholder="Jane Doe"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)]">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent"
                placeholder="you@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)]">Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent"
                placeholder="8+ characters"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-10 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-[color:var(--text-muted)] text-center mt-6">
            Already have one?{' '}
            <Link href="/login" className="text-[color:var(--accent)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
