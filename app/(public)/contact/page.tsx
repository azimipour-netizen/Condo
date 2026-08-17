'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--text-faint)]"

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Contact</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Get in touch</h1>
        <p className="text-[color:var(--text-muted)] mt-2">
          Questions about a listing, the market, or buying in Toronto? We&apos;ll respond within one business day.
        </p>
      </div>

      {status === 'sent' ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✓</div>
          <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">Message sent!</h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            We&apos;ll get back to you at {form.email} within one business day.
          </p>
          <Link href="/"
            className="inline-block mt-6 text-sm text-[color:var(--accent)] hover:underline">
            Back to listings →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Name *</label>
              <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="jane@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} placeholder="416-555-0100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Subject *</label>
              <select required value={form.subject} onChange={set('subject')} className={inputCls}>
                <option value="">Select a topic</option>
                <option value="Buying inquiry">Buying inquiry</option>
                <option value="Selling inquiry">Selling inquiry</option>
                <option value="Rental inquiry">Rental inquiry</option>
                <option value="Open house question">Open house question</option>
                <option value="Market information">Market information</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Message *</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={set('message')}
              className={inputCls}
              placeholder="Tell us how we can help..."
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-500">Something went wrong. Please try again or email us directly.</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 bg-[color:var(--accent)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition text-sm"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-[color:var(--border)] grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-medium text-[color:var(--foreground)] mb-1">Email</p>
          <a href="mailto:azimipour@gmail.com" className="text-[color:var(--accent)] hover:underline">azimipour@gmail.com</a>
        </div>
        <div>
          <p className="font-medium text-[color:var(--foreground)] mb-1">Response time</p>
          <p className="text-[color:var(--text-muted)]">Within 1 business day</p>
        </div>
      </div>
    </div>
  )
}
