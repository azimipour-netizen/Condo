'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
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
  user: { name: string | null; email: string }
  answers: Answer[]
}

interface Props {
  propertyId: string
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

function initials(user: { name: string | null; email: string }) {
  const src = user.name ?? user.email
  return src.split(/[\s@]/).map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function PropertyQA({ propertyId }: Props) {
  const { data: session, status } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/questions`)
      .then(r => r.json())
      .then(d => setQuestions(d.questions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [propertyId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/properties/${propertyId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        const { question } = await res.json()
        setQuestions(prev => [...prev, question])
        setDraft('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="border-t border-[color:var(--border)] pt-8 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[color:var(--foreground)]">
          Ask a Realtor
          {questions.length > 0 && (
            <span className="ml-2 text-xs font-normal text-[color:var(--text-muted)]">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </span>
          )}
        </h2>
        <span className="text-xs text-[color:var(--text-muted)]">Answered by licensed agents</span>
      </div>

      {/* Ask form */}
      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-[color:var(--accent)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {initials({ name: session.user?.name ?? null, email: session.user?.email ?? '' })}
            </span>
            <div className="flex-1 bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl overflow-hidden focus-within:border-[color:var(--accent)] focus-within:ring-1 focus-within:ring-[color:var(--accent)]/20 transition-all">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any) }
                }}
                placeholder="Ask about financing, neighbourhood, schools, zoning…"
                rows={2}
                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none leading-relaxed"
              />
              <div className="flex justify-end px-3 pb-2">
                <button
                  type="submit"
                  disabled={!draft.trim() || submitting}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {submitting ? 'Sending…' : 'Ask question'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[color:var(--text-muted)]">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm text-[color:var(--text-muted)]">
            <Link href="/login" className="text-[color:var(--accent)] font-medium hover:underline">Sign in</Link>
            {' '}to ask a licensed agent a question about this property.
          </p>
        </div>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-[color:var(--bg-surface-2)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[color:var(--bg-surface-2)] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <p className="text-sm text-[color:var(--text-faint)] text-center py-6">
          No questions yet — be the first to ask.
        </p>
      ) : (
        <div className="space-y-5">
          {questions.map(q => (
            <div key={q.id} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4">
              {/* Question */}
              <div className="flex gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] text-[10px] font-bold text-[color:var(--text-muted)] flex items-center justify-center shrink-0">
                  {initials(q.user)}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-medium text-[color:var(--foreground)]">
                      {q.user.name ?? q.user.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(q.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[color:var(--foreground)] leading-relaxed">{q.text}</p>
                </div>
              </div>

              {/* Answers */}
              {q.answers.length > 0 && (
                <div className="mt-3 ml-10 space-y-3">
                  {q.answers.map(a => (
                    <div key={a.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/20 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" fill="var(--accent)" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-semibold text-[color:var(--accent)]">
                            {a.agent.name ?? 'Agent'}
                          </span>
                          <span className="text-[10px] text-[color:var(--text-faint)] bg-[color:var(--accent)]/8 px-1.5 py-0.5 rounded-full">Licensed Agent</span>
                          <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(a.createdAt)}</span>
                        </div>
                        <p className="text-sm text-[color:var(--foreground)] leading-relaxed">{a.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {q.answers.length === 0 && (
                <p className="mt-2 ml-10 text-xs text-[color:var(--text-faint)] italic">Awaiting agent response…</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
