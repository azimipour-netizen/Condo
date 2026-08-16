'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, unknown>
  createdAt: string
}

interface Props {
  initial: SavedSearch[]
}

function formatFilters(filters: Record<string, unknown>): string {
  const parts: string[] = []
  if (filters.location && typeof filters.location === 'object') {
    const loc = filters.location as { value?: string }
    if (loc.value) parts.push(loc.value)
  }
  if (filters.bedroomsMin) parts.push(`${filters.bedroomsMin}+ beds`)
  if (filters.priceMax) parts.push(`under $${Number(filters.priceMax).toLocaleString()}`)
  if (filters.priceMin) parts.push(`from $${Number(filters.priceMin).toLocaleString()}`)
  if (Array.isArray(filters.propertyTypes) && filters.propertyTypes.length > 0) {
    parts.push(filters.propertyTypes.join(', '))
  }
  return parts.length > 0 ? parts.join(' · ') : 'Any location, any type'
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d))
}

export default function SavedSearchList({ initial }: Props) {
  const [searches, setSearches] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function deleteSearch(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/account/saved-searches/${id}`, { method: 'DELETE' })
      if (res.ok) setSearches(prev => prev.filter(s => s.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-[color:var(--accent-dim)] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="var(--accent)" strokeWidth="1.8" />
            <path d="M18 18L22 22" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 11h6M11 8v6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[color:var(--foreground)] mb-1">No saved searches yet</p>
        <p className="text-sm text-[color:var(--text-muted)] max-w-xs mx-auto">
          Run a property search and click <strong>Save</strong> to keep track of it here.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Start searching
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {searches.map(s => (
        <div
          key={s.id}
          className="flex items-center justify-between gap-4 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl px-5 py-4 hover:border-[color:var(--accent)]/40 transition-colors"
        >
          <div className="min-w-0">
            <Link
              href={`/?q=${encodeURIComponent(s.name)}`}
              className="font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors text-sm"
            >
              {s.name}
            </Link>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5 truncate">
              {formatFilters(s.filters)}
            </p>
            <p className="text-xs text-[color:var(--text-faint)] mt-1">Saved {formatDate(s.createdAt)}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/?q=${encodeURIComponent(s.name)}`}
              className="text-xs font-medium text-[color:var(--accent)] border border-[color:var(--accent)] rounded-lg px-3 py-1.5 hover:bg-[color:var(--accent-dim)] transition-colors"
            >
              Search again
            </Link>
            <button
              onClick={() => deleteSearch(s.id)}
              disabled={deleting === s.id}
              className="text-xs text-[color:var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-40 p-1.5"
              aria-label="Delete saved search"
            >
              {deleting === s.id ? '…' : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M6 6.5v4M8 6.5v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
