'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Showing {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  preferredAt: string
  message: string | null
  createdAt: string
  property: { id: string; title: string; listingId: string } | null
}

interface Question {
  id: string
  text: string
  createdAt: string
  propertyId: string
  user: { name: string | null; email: string }
  answers: { id: string }[]
  property: { id: string; title: string; listingId: string } | null
}

interface Props {
  showings: Showing[]
  questions: Question[]
}

type LeadType = 'showing' | 'question'
type Lead = { type: LeadType; ts: string } & (
  | { type: 'showing'; data: Showing }
  | { type: 'question'; data: Question }
)

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

const SHOWING_STATUS_COLORS: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  pending_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  scheduled: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

export default function LeadsPipeline({ showings, questions }: Props) {
  const [filter, setFilter] = useState<'all' | 'showing' | 'question'>('all')
  const [search, setSearch] = useState('')

  const leads: Lead[] = useMemo(() => {
    const s: Lead[] = showings.map(d => ({ type: 'showing', ts: d.createdAt, data: d }))
    const q: Lead[] = questions.map(d => ({ type: 'question', ts: d.createdAt, data: d }))
    return [...s, ...q].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
  }, [showings, questions])

  const filtered = useMemo(() => leads.filter(l => {
    if (filter !== 'all' && l.type !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    if (l.type === 'showing') {
      const d = l.data as Showing
      return d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) ||
        (d.property?.title ?? '').toLowerCase().includes(q)
    } else {
      const d = l.data as Question
      return (d.user.name ?? '').toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        d.text.toLowerCase().includes(q) ||
        (d.property?.title ?? '').toLowerCase().includes(q)
    }
  }), [leads, filter, search])

  const showingCount = leads.filter(l => l.type === 'showing').length
  const questionCount = leads.filter(l => l.type === 'question').length
  const pendingShowings = showings.filter(s => s.status === 'requested' || s.status === 'pending_review').length
  const unanswered = questions.filter(q => q.answers.length === 0).length

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total leads', value: leads.length },
          { label: 'Showing requests', value: showingCount },
          { label: 'Pending showings', value: pendingShowings, accent: pendingShowings > 0 },
          { label: 'Unanswered Q&A', value: unanswered, accent: unanswered > 0 },
        ].map(s => (
          <div key={s.label} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4">
            <p className={`text-2xl font-bold tabular-nums ${s.accent ? 'text-[color:var(--accent)]' : 'text-[color:var(--foreground)]'}`}>{s.value}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, property…"
          className="flex-1 max-w-xs text-sm border border-[color:var(--border)] rounded-xl px-3 py-2 bg-[color:var(--bg-surface)] text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
        />
        <div className="flex items-center gap-1 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-1">
          {(['all', 'showing', 'question'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                filter === f ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--text-muted)] hover:text-[color:var(--foreground)]',
              ].join(' ')}
            >
              {f === 'all' ? `All (${leads.length})` : f === 'showing' ? `Showings (${showingCount})` : `Questions (${questionCount})`}
            </button>
          ))}
        </div>
        <span className="text-xs text-[color:var(--text-faint)] ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No leads yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => lead.type === 'showing' ? (
            <ShowingCard key={`s-${(lead.data as Showing).id}`} s={lead.data as Showing} />
          ) : (
            <QuestionCard key={`q-${(lead.data as Question).id}`} q={lead.data as Question} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShowingCard({ s }: { s: Showing }) {
  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-3 flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="#d97706" strokeWidth="1.3" />
          <path d="M4.5 1v3M9.5 1v3M1 6h12" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[color:var(--foreground)]">{s.name}</span>
          <span className="text-xs text-[color:var(--text-muted)]">{s.email}</span>
          {s.phone && <span className="text-xs text-[color:var(--text-muted)]">· {s.phone}</span>}
          <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(s.createdAt)}</span>
        </div>
        <p className="text-xs text-[color:var(--text-muted)] mt-0.5 truncate">
          Showing request · {s.property?.title ?? s.property?.listingId ?? '—'}
          {s.preferredAt && ` · ${new Date(s.preferredAt).toLocaleDateString('en-CA')}`}
        </p>
        {s.message && <p className="text-xs text-[color:var(--text-faint)] mt-0.5 truncate">{s.message}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${SHOWING_STATUS_COLORS[s.status] ?? ''}`}>
          {s.status.replace('_', ' ')}
        </span>
        <Link href="/dashboard/showings" className="text-xs text-[color:var(--accent)] hover:underline">View ↗</Link>
      </div>
    </div>
  )
}

function QuestionCard({ q }: { q: Question }) {
  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-3 flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.3" />
          <path d="M7 4.5C7 4.5 6 4.5 6 5.5C6 6.5 7 6.5 7 7.5" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="7" cy="9.5" r="0.6" fill="var(--accent)" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[color:var(--foreground)]">{q.user.name ?? q.user.email.split('@')[0]}</span>
          <span className="text-xs text-[color:var(--text-muted)]">{q.user.email}</span>
          <span className="text-[10px] text-[color:var(--text-faint)]">{timeAgo(q.createdAt)}</span>
        </div>
        <p className="text-xs text-[color:var(--text-muted)] mt-0.5 truncate">{q.property?.title ?? '—'}</p>
        <p className="text-xs text-[color:var(--foreground)] mt-1 line-clamp-2">{q.text}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {q.answers.length === 0 ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Pending</span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Answered</span>
        )}
        <Link href="/dashboard/questions" className="text-xs text-[color:var(--accent)] hover:underline">Reply ↗</Link>
      </div>
    </div>
  )
}
