'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  name: string
  email: string
}

export default function SettingsForm({ name: initialName, email }: Props) {
  const router = useRouter()
  // Profile
  const [name, setName] = useState(initialName ?? '')
  const [profileStatus, setProfileStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Password
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pwError, setPwError] = useState('')

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || profileStatus === 'saving') return
    setProfileStatus('saving')
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      setProfileStatus(res.ok ? 'saved' : 'error')
      if (res.ok) {
        setTimeout(() => setProfileStatus('idle'), 2500)
        router.refresh()
      }
    } catch {
      setProfileStatus('error')
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (next !== confirm) { setPwError('Passwords do not match'); return }
    if (next.length < 8) { setPwError('Minimum 8 characters'); return }
    if (pwStatus === 'saving') return
    setPwStatus('saving')
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, next }),
      })
      if (res.ok) {
        setPwStatus('saved')
        setCurrent(''); setNext(''); setConfirm('')
        setTimeout(() => setPwStatus('idle'), 2500)
      } else {
        const { error } = await res.json()
        setPwError(error ?? 'Failed')
        setPwStatus('idle')
      }
    } catch {
      setPwStatus('idle')
      setPwError('Network error')
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Profile */}
      <section className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-5">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Display name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-[color:var(--text-faint)] mt-1">Email cannot be changed</p>
          </div>
          <button
            type="submit"
            disabled={!name.trim() || profileStatus === 'saving'}
            className="px-4 py-2 text-sm font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            {profileStatus === 'saving' ? 'Saving…' : profileStatus === 'saved' ? 'Saved!' : profileStatus === 'error' ? 'Error — try again' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-5">Change password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Current password</label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              autoComplete="current-password"
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">New password</label>
            <input
              type="password"
              value={next}
              onChange={e => setNext(e.target.value)}
              autoComplete="new-password"
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)] transition"
            />
          </div>
          {pwError && <p className="text-xs text-red-500">{pwError}</p>}
          <button
            type="submit"
            disabled={!current || !next || !confirm || pwStatus === 'saving'}
            className="px-4 py-2 text-sm font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            {pwStatus === 'saving' ? 'Updating…' : pwStatus === 'saved' ? 'Password updated!' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}
