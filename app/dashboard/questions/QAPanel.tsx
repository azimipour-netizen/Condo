'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Answer {
  id: string
  text: string
  createdAt: string
  agent: { name: string | null; email: string }
}

interface Question {
  id: string
  text: string
  createdAt: string
  propertyId: string
  user: { name: string | null; email: string }
  answers: Answer[]
  property: { title: string; listingId: string } | null
}

interface Props {
  questions: Question[]
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function QuestionCard({ q, onAnswered }: { q: Question; onAnswered: (qid: string, answer: Answer) => void }) {
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(q.answers.length === 0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/properties/${q.propertyId}/questions/${q.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Failed')
      const { answer } = await res.json()
      onAnswered(q.id, answer)
      setDraft('')
    } catch {
      setError('Failed to submit — try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-[color:var(--bg-surface-2)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-medium text-[color:var(--foreground)]">
              {q.user.name ?? q.user.email.split('@')[0]}
            </span>
            <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(q.createdAt)}</span>
            {q.property && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] text-[color:var(--text-muted)] truncate max-w-[200px]">
                {q.property.title}
              </span>
            )}
          </div>
          <p className="text-sm text-[color:var(--foreground)] leading-relaxed">{q.text}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {q.answers.length > 0 ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              Answered
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
              Pending
            </span>
          )}
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`text-[color:var(--text-faint)] transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-[color:var(--border)] px-4 py-4 space-y-4">
          {/* Existing answers */}
          {q.answers.map(a => (
            <div key={a.id} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" fill="var(--accent)" />
                </svg>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-semibold text-[color:var(--accent)]">{a.agent.name ?? 'You'}</span>
                  <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(a.createdAt)}</span>
                </div>
                <p className="text-sm text-[color:var(--foreground)] leading-relaxed">{a.text}</p>
              </div>
            </div>
          ))}

          {/* Reply form */}
          <form onSubmit={submit} className="flex gap-3 items-start">
            <div className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl overflow-hidden focus-within:border-[color:var(--accent)] focus-within:ring-1 focus-within:ring-[color:var(--accent)]/20 transition-all">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e as any) } }}
                placeholder={q.answers.length > 0 ? 'Add another answer…' : 'Write your answer…'}
                rows={2}
                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-3 pb-2">
                {error && <p className="text-xs text-red-500">{error}</p>}
                {!error && q.property && (
                  <Link
                    href={`/property/${q.propertyId}`}
                    target="_blank"
                    className="text-[10px] text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors"
                  >
                    View listing ↗
                  </Link>
                )}
                <button
                  type="submit"
                  disabled={!draft.trim() || submitting}
                  className="ml-auto px-3.5 py-1.5 text-xs font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {submitting ? 'Sending…' : 'Answer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default function QAPanel({ questions: initial }: Props) {
  const [questions, setQuestions] = useState(initial)

  function handleAnswered(qid: string, answer: Answer) {
    setQuestions(prev => prev.map(q =>
      q.id === qid ? { ...q, answers: [...q.answers, answer] } : q
    ))
  }

  const pending = questions.filter(q => q.answers.length === 0)
  const answered = questions.filter(q => q.answers.length > 0)

  return (
    <div>
      {questions.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-[color:var(--text-muted)] text-sm">No questions yet.</p>
          <p className="text-[color:var(--text-faint)] text-xs mt-1">Buyer questions appear here when submitted on listing pages.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                Needs answer · {pending.length}
              </h2>
              <div className="space-y-2">
                {pending.map(q => <QuestionCard key={q.id} q={q} onAnswered={handleAnswered} />)}
              </div>
            </section>
          )}

          {answered.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                Answered · {answered.length}
              </h2>
              <div className="space-y-2">
                {answered.map(q => <QuestionCard key={q.id} q={q} onAnswered={handleAnswered} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
