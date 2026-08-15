'use client'

import { useState } from 'react'
import type { Property } from '@/types/property'

interface Props {
  property: Property
  onClose: () => void
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ShowingRequestModal({ property: p, onClose }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('submitting')
    try {
      const res = await fetch('/api/showings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: p.id, listingId: p.listingId, ...form }),
      })
      if (!res.ok) throw new Error('Request failed')
      setState('success')
    } catch {
      setState('error')
    }
  }

  function field(id: string, label: string, type = 'text', required = true) {
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type={type}
          required={required}
          value={form[id as keyof typeof form]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[color:var(--border)]">
          <div>
            <h2 className="text-base font-semibold text-[color:var(--foreground)]">Request a Showing</h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-1 line-clamp-1">{p.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {state === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[color:var(--accent)]/10 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-semibold text-[color:var(--foreground)] mb-2">Request sent!</p>
            <p className="text-sm text-[color:var(--text-muted)] mb-6">
              We'll contact you within 24 hours to confirm your showing.
            </p>
            <button onClick={onClose} className="text-sm font-medium text-[color:var(--accent)] hover:underline">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {field('name', 'Full name')}
            {field('email', 'Email address', 'email')}
            {field('phone', 'Phone number', 'tel', false)}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="preferredDate" className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
                  Preferred date<span className="text-red-400 ml-0.5">*</span>
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  required
                  value={form.preferredDate}
                  onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                  className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
                  Preferred time
                </label>
                <select
                  id="preferredTime"
                  value={form.preferredTime}
                  onChange={e => setForm(f => ({ ...f, preferredTime: e.target.value }))}
                  className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
                >
                  <option value="">Any time</option>
                  <option>Morning (9am–12pm)</option>
                  <option>Afternoon (12pm–5pm)</option>
                  <option>Evening (5pm–7pm)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
                Message (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Any questions about the property?"
                className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--accent)] transition-colors resize-none placeholder:text-[color:var(--text-faint)]"
              />
            </div>

            {state === 'error' && (
              <p className="text-xs text-red-400">Something went wrong. Please try again or call us directly.</p>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="w-full bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {state === 'submitting' ? 'Sending…' : 'Send Request'}
            </button>

            <p className="text-xs text-center text-[color:var(--text-faint)]">
              By submitting you agree to be contacted by our team. No spam.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
