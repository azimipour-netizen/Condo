'use client'

import { useState } from 'react'

export default function BroadcastPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ sent: number; total: number; errors?: string[] } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSend() {
    if (!subject.trim() || !message.trim()) return
    setStatus('sending')
    setResult(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Unknown error')
        setStatus('error')
      } else {
        setResult(data)
        setStatus('done')
      }
    } catch {
      setErrorMsg('Network error')
      setStatus('error')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Email Broadcast</h1>
        <p className="text-sm text-[color:var(--muted)] mt-1">Send an email to all registered users.</p>
      </div>

      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="New listings available in your area!"
            className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1.5">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={8}
            placeholder="Write your message here..."
            className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors resize-y"
          />
        </div>

        {status === 'done' && result && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-600">
            Sent to {result.sent} of {result.total} users.
            {result.errors && result.errors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs">Show errors ({result.errors.length})</summary>
                <ul className="mt-1 text-xs space-y-0.5">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </details>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={status === 'sending' || !subject.trim() || !message.trim()}
          className="w-full py-2.5 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status === 'sending' ? 'Sending…' : 'Send to all users'}
        </button>
      </div>
    </div>
  )
}
