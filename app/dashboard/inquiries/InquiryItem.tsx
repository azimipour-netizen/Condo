'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function InquiryItem({ inq }: { inq: Inquiry }) {
  const router = useRouter()
  const [read, setRead] = useState(inq.read)
  const [deleted, setDeleted] = useState(false)
  const [busy, setBusy] = useState(false)

  if (deleted) return null

  async function markRead() {
    if (read || busy) return
    setBusy(true)
    await fetch(`/api/admin/inquiries/${inq.id}`, { method: 'PATCH' })
    setRead(true)
    setBusy(false)
    router.refresh()
  }

  async function deleteInquiry() {
    if (!confirm('Delete this inquiry?') || busy) return
    setBusy(true)
    await fetch(`/api/admin/inquiries/${inq.id}`, { method: 'DELETE' })
    setDeleted(true)
    setBusy(false)
    router.refresh()
  }

  return (
    <div
      className={`bg-[color:var(--bg-surface)] border rounded-2xl p-5 transition-colors ${
        read ? 'border-[color:var(--border)]' : 'border-[color:var(--accent)]/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">
            {inq.name}
            {!read && (
              <span className="ml-2 inline-block px-1.5 py-0.5 bg-[color:var(--accent)] text-white text-xs rounded font-medium">
                New
              </span>
            )}
          </p>
          <p className="text-xs text-[color:var(--text-muted)]">
            <a href={`mailto:${inq.email}`} className="hover:underline">{inq.email}</a>
            {inq.phone && <span> · {inq.phone}</span>}
          </p>
        </div>
        <p className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{formatDate(inq.createdAt)}</p>
      </div>
      <p className="text-xs font-medium text-[color:var(--accent)] mb-1">{inq.subject}</p>
      <p className="text-sm text-[color:var(--foreground)] leading-relaxed whitespace-pre-wrap">{inq.message}</p>
      <div className="mt-3 flex items-center gap-4">
        <a href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
          className="text-xs text-[color:var(--accent)] hover:underline">Reply →</a>
        {!read && (
          <button onClick={markRead} disabled={busy}
            className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] disabled:opacity-50 transition-colors">
            Mark read
          </button>
        )}
        <button onClick={deleteInquiry} disabled={busy}
          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors ml-auto">
          Delete
        </button>
      </div>
    </div>
  )
}
