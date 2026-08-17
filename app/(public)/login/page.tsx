'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const callbackUrl = params.get('callbackUrl') ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-xl font-bold text-[color:var(--foreground)]">Toronto Realty</span>
        </Link>

        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-[color:var(--foreground)] mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[color:var(--text-muted)]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[color:var(--accent)] hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent"
                placeholder="••••••••"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-[color:var(--text-muted)] text-center mt-6">
            No account?{' '}
            <Link href="/register" className="text-[color:var(--accent)] hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
