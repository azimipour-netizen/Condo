'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Property {
  id: string
  listingId: string
  title: string
  status: string
  price: number
  propertyType: string
  bedrooms: number
  city: string
  listedAt: string
  virtualTourUrl?: string | null
  _count: { showingRequests: number }
}

interface Props {
  properties: Property[]
}

const STATUS_OPTIONS = ['active', 'sold', 'terminated', 'expired', 'suspended'] as const
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sold: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  terminated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  suspended: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', semi_detached: 'Semi', townhouse: 'Town',
  condo: 'Condo', multiplex: 'Multi', vacant_land: 'Land', commercial: 'Comm.',
}

function StatusCell({ property }: { property: Property }) {
  const [status, setStatus] = useState(property.status)
  const [saving, setSaving] = useState(false)

  async function change(next: string) {
    if (next === status || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) setStatus(next)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] ?? ''}`}>
        {status}
      </span>
      <select
        value={status}
        onChange={e => change(e.target.value)}
        disabled={saving}
        className="text-xs border border-[color:var(--border)] rounded-lg px-2 py-1 bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)] disabled:opacity-50"
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
    </div>
  )
}

function TourCell({ property }: { property: Property }) {
  const [url, setUrl] = useState(property.virtualTourUrl ?? '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ virtualTourUrl: url.trim() || null }),
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        title={url || 'Set virtual tour URL'}
        className={`text-xs px-2 py-1 rounded-lg border transition-colors ${url ? 'border-[color:var(--accent)] text-[color:var(--accent)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)]'}`}
      >
        {url ? '360° ✓' : '+ Tour'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
        placeholder="https://youtube.com/watch?v=..."
        className="text-xs border border-[color:var(--border)] rounded-lg px-2 py-1 bg-[color:var(--background)] text-[color:var(--foreground)] w-44 outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
      />
      <button onClick={save} disabled={saving} className="text-xs text-[color:var(--accent)] font-semibold disabled:opacity-50 px-1">✓</button>
      <button onClick={() => setEditing(false)} className="text-xs text-[color:var(--text-muted)] px-1">✕</button>
    </div>
  )
}

export default function PropertiesTable({ properties: initial }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = initial.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.listingId.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search title, MLS#, city…"
          className="flex-1 max-w-xs text-sm border border-[color:var(--border)] rounded-xl px-3 py-2 bg-[color:var(--bg-surface)] text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-[color:var(--border)] rounded-xl px-3 py-2 bg-[color:var(--bg-surface)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <span className="text-xs text-[color:var(--text-faint)] ml-auto">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">{search || filterStatus !== 'all' ? 'No listings match.' : 'No listings in database yet.'}</p>
        </div>
      ) : (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--border)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Listing</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Showings</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Tour</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--text-muted)]">Listed</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface-2)] transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-sm font-medium text-[color:var(--foreground)] truncate">{p.title}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">#{p.listingId} · {p.city}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[color:var(--text-muted)]">
                      {TYPE_LABELS[p.propertyType] ?? p.propertyType} · {p.bedrooms}bd
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[color:var(--foreground)] tabular-nums whitespace-nowrap">
                      ${Number(p.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusCell property={p} />
                    </td>
                    <td className="px-4 py-3 text-sm text-[color:var(--text-muted)] tabular-nums">
                      {p._count.showingRequests}
                    </td>
                    <td className="px-4 py-3">
                      <TourCell property={p} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                      {new Date(p.listedAt).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/properties/${p.id}/edit`}
                          className="text-xs text-[color:var(--accent)] hover:underline whitespace-nowrap">
                          Edit
                        </Link>
                        <Link href={`/property/${p.id}`} target="_blank"
                          className="text-xs text-[color:var(--muted)] hover:underline whitespace-nowrap">
                          View ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
