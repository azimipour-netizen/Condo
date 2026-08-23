'use client'

import { useEffect, useState } from 'react'

interface Room {
  type: string
  level: string | null
  length: number | null
  width: number | null
  units: string | null
  dimensions: string | null
  features: string[]
}

export default function RoomDetails({ propertyId }: { propertyId: string }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/rooms`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Room[]) => setRooms(data))
      .catch(() => setRooms([]))
      .finally(() => setLoaded(true))
  }, [propertyId])

  // Not every listing board populates PropertyRooms — hide the section
  // entirely rather than show an empty table.
  if (!loaded || rooms.length === 0) return null

  function formatDims(r: Room): string {
    if (r.dimensions) return r.dimensions
    if (r.length && r.width) {
      const unit = r.units === 'Meters' ? 'm' : 'ft'
      return `${r.length} x ${r.width} ${unit}`
    }
    return '—'
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-4">Room dimensions</h2>
      <div className="border border-[color:var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--bg-surface-2)] border-b border-[color:var(--border)]">
              {['Room', 'Level', 'Dimensions', 'Features'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((r, i) => (
              <tr key={i} className={`border-b border-[color:var(--border)] last:border-0 ${i % 2 === 1 ? 'bg-[color:var(--bg-surface-2)]/50' : 'bg-[color:var(--bg-surface)]'}`}>
                <td className="px-4 py-3 font-medium text-[color:var(--foreground)]">{r.type}</td>
                <td className="px-4 py-3 text-[color:var(--text-muted)]">{r.level ?? '—'}</td>
                <td className="px-4 py-3 text-[color:var(--text-muted)] tabular">{formatDims(r)}</td>
                <td className="px-4 py-3 text-[color:var(--text-faint)] text-xs">{r.features.length > 0 ? r.features.join(', ') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
