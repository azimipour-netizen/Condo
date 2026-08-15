'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnswerForm({ questionId, propertyId }: { questionId: string; propertyId: string }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/properties/${propertyId}/questions/${questionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })
      if (res.ok) {
        setText('')
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your answer…"
        className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] focus:border-[color:var(--accent)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={!text.trim() || submitting}
        className="px-4 py-2 text-xs font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors shrink-0"
      >
        {submitting ? 'Sending…' : 'Answer'}
      </button>
    </form>
  )
}
