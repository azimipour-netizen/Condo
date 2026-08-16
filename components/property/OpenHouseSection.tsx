'use client'

import { useState, useEffect } from 'react'

interface OpenHouse {
  id: string
  startsAt: string
  endsAt: string
  notes: string | null
}

interface Props {
  propertyId: string
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('en-CA', opts)
}

export default function OpenHouseSection({ propertyId }: Props) {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/open-houses`)
      .then(r => r.json())
      .then(d => setOpenHouses(d.openHouses ?? []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [propertyId])

  if (!loaded || openHouses.length === 0) return null

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.5 1v3M9.5 1v3M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Open Houses
      </h3>
      <div className="space-y-2">
        {openHouses.map(oh => (
          <div key={oh.id} className="bg-[color:var(--bg-surface-2)] rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              {fmt(oh.startsAt, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {fmt(oh.startsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
              {' – '}
              {fmt(oh.endsAt, { hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>
            {oh.notes && <p className="text-xs text-[color:var(--text-faint)] mt-1">{oh.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
