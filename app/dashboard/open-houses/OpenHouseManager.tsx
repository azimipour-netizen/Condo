'use client'

import { useState } from 'react'

interface OpenHouse {
  id: string
  propertyId: string
  startsAt: string
  endsAt: string
  notes: string | null
  property: { title: string; listingId: string } | null
}

interface Property {
  id: string
  title: string
  listingId: string
}

interface Props {
  openHouses: OpenHouse[]
  properties: Property[]
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('en-CA', opts)
}

// YYYY-MM-DDTHH:MM for datetime-local inputs
function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function OpenHouseManager({ openHouses: initial, properties }: Props) {
  const [list, setList] = useState(initial)
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? '')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!propertyId || !startsAt || !endsAt || saving) return
    if (new Date(endsAt) <= new Date(startsAt)) { setError('End must be after start'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/open-houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const { openHouse } = await res.json()
      const prop = properties.find(p => p.id === propertyId)
      setList(prev => [{ ...openHouse, property: prop ?? null }, ...prev].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      ))
      setStartsAt(''); setEndsAt(''); setNotes('')
    } catch {
      setError('Failed to create')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    await fetch(`/api/admin/open-houses/${id}`, { method: 'DELETE' })
    setList(prev => prev.filter(oh => oh.id !== id))
  }

  const upcoming = list.filter(oh => new Date(oh.startsAt) >= new Date())
  const past = list.filter(oh => new Date(oh.startsAt) < new Date())

  return (
    <div className="max-w-2xl">
      {/* Create form */}
      <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-5">Schedule open house</h2>
        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Property</label>
            <select
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.title} (#{p.listingId})</option>
              ))}
            </select>
            {properties.length === 0 && (
              <p className="text-xs text-[color:var(--text-faint)] mt-1">No properties in database yet.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Start</label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={e => setStartsAt(e.target.value)}
                min={toDatetimeLocal(new Date())}
                required
                className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">End</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={e => setEndsAt(e.target.value)}
                min={startsAt || toDatetimeLocal(new Date())}
                required
                className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Refreshments served, agents welcome"
              className="w-full text-sm border border-[color:var(--border)] rounded-xl px-3 py-2.5 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] outline-none focus:ring-1 focus:ring-[color:var(--accent)]"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!propertyId || !startsAt || !endsAt || saving || properties.length === 0}
            className="px-4 py-2 text-sm font-semibold bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] disabled:opacity-40 text-white rounded-xl transition-colors"
          >
            {saving ? 'Scheduling…' : 'Schedule'}
          </button>
        </form>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
            Upcoming · {upcoming.length}
          </h2>
          <div className="space-y-2">
            {upcoming.map(oh => (
              <div key={oh.id} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[color:var(--foreground)]">
                    {fmt(oh.startsAt, { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' · '}
                    {fmt(oh.startsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                    {' – '}
                    {fmt(oh.endsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                  <p className="text-xs text-[color:var(--text-muted)] truncate">{oh.property?.title}</p>
                  {oh.notes && <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{oh.notes}</p>}
                </div>
                <button
                  onClick={() => remove(oh.id)}
                  className="shrink-0 text-xs text-[color:var(--text-faint)] hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
            Past · {past.length}
          </h2>
          <div className="space-y-2 opacity-60">
            {past.map(oh => (
              <div key={oh.id} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl px-4 py-3">
                <p className="text-sm text-[color:var(--foreground)]">
                  {fmt(oh.startsAt, { weekday: 'short', month: 'short', day: 'numeric' })}
                  {' · '}
                  {fmt(oh.startsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                  {' – '}
                  {fmt(oh.endsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
                <p className="text-xs text-[color:var(--text-muted)] truncate">{oh.property?.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No open houses scheduled yet.</p>
        </div>
      )}
    </div>
  )
}
