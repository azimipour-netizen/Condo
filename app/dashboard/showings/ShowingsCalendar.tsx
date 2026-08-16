'use client'

import { useState, useMemo } from 'react'

interface Showing {
  id: string
  name: string
  email: string
  preferredAt: string | null
  status: string
  property: { title: string } | null
}

interface Props {
  showings: Showing[]
}

const STATUS_DOT: Record<string, string> = {
  requested: 'bg-amber-400',
  pending_review: 'bg-blue-400',
  confirmed: 'bg-green-400',
  scheduled: 'bg-teal-400',
  cancelled: 'bg-red-400',
  completed: 'bg-gray-400',
}

const STATUS_LABELS: Record<string, string> = {
  requested: 'Requested', pending_review: 'Pending', confirmed: 'Confirmed',
  scheduled: 'Scheduled', cancelled: 'Cancelled', completed: 'Completed',
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function ShowingsCalendar({ showings }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  // Map date key → showings
  const byDate = useMemo(() => {
    const map: Record<string, Showing[]> = {}
    for (const s of showings) {
      if (!s.preferredAt) continue
      const key = toDateKey(new Date(s.preferredAt))
      ;(map[key] ??= []).push(s)
    }
    return map
  }, [showings])

  // Build calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const monthLabel = new Date(year, month).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
  const todayKey = toDateKey(today)
  const selectedShowings = selected ? (byDate[selected] ?? []) : []

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="text-sm font-semibold text-[color:var(--foreground)]">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-[color:var(--text-muted)] py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-[color:var(--border)] border border-[color:var(--border)] rounded-xl overflow-hidden">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="bg-[color:var(--background)] h-16" />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayShowings = byDate[key] ?? []
          const isToday = key === todayKey
          const isSelected = key === selected
          return (
            <button
              key={i}
              onClick={() => setSelected(k => k === key ? null : key)}
              className={[
                'bg-[color:var(--bg-surface)] h-16 flex flex-col p-1.5 text-left transition-colors hover:bg-[color:var(--bg-surface-2)]',
                isSelected ? 'ring-2 ring-inset ring-[color:var(--accent)]' : '',
              ].join(' ')}
            >
              <span className={[
                'text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full',
                isToday ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--foreground)]',
              ].join(' ')}>
                {day}
              </span>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {dayShowings.slice(0, 3).map(s => (
                  <span key={s.id} className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s.status] ?? 'bg-gray-400'}`} />
                ))}
                {dayShowings.length > 3 && (
                  <span className="text-[9px] text-[color:var(--text-faint)]">+{dayShowings.length - 3}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {Object.entries(STATUS_DOT).map(([k, cls]) => (
          <div key={k} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${cls}`} />
            <span className="text-xs text-[color:var(--text-faint)]">{STATUS_LABELS[k]}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="mt-4 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4">
          <p className="text-xs font-semibold text-[color:var(--text-muted)] mb-3">
            {new Date(selected + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {selectedShowings.length === 0 ? (
            <p className="text-sm text-[color:var(--text-faint)]">No showings this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedShowings.map(s => (
                <div key={s.id} className="flex items-start gap-3 py-2 border-b border-[color:var(--border)] last:border-0">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[s.status] ?? 'bg-gray-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{s.name}</p>
                    <p className="text-xs text-[color:var(--text-muted)] truncate">{s.property?.title}</p>
                    <p className="text-xs text-[color:var(--text-faint)]">{STATUS_LABELS[s.status]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
