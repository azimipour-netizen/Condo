'use client'
import { useEffect, useState } from 'react'

interface Stats {
  neighbourhood: string
  count: number
  avgPrice: number | null
  minPrice: number | null
  maxPrice: number | null
}

const fmt = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

export default function NeighbourhoodStats({ propertyId }: { propertyId: string }) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/neighbourhood-stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStats(d))
      .catch(() => {})
  }, [propertyId])

  if (!stats || stats.count === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">
        {stats.neighbourhood} market
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[color:var(--bg-surface-2)] rounded-xl p-3 text-center">
          <p className="text-xs text-[color:var(--muted)]">Active listings</p>
          <p className="text-xl font-bold text-[color:var(--foreground)] mt-0.5">{stats.count}</p>
        </div>
        {stats.avgPrice && (
          <div className="bg-[color:var(--bg-surface-2)] rounded-xl p-3 text-center">
            <p className="text-xs text-[color:var(--muted)]">Avg price</p>
            <p className="text-sm font-bold text-[color:var(--foreground)] mt-0.5 tabular-nums">{fmt(Math.round(stats.avgPrice / 1000) * 1000)}</p>
          </div>
        )}
        {stats.minPrice && stats.maxPrice && (
          <div className="bg-[color:var(--bg-surface-2)] rounded-xl p-3 text-center">
            <p className="text-xs text-[color:var(--muted)]">Price range</p>
            <p className="text-[10px] font-semibold text-[color:var(--foreground)] mt-0.5 tabular-nums leading-tight">
              {fmt(Math.round(stats.minPrice / 1000) * 1000)}<br/>
              — {fmt(Math.round(stats.maxPrice / 1000) * 1000)}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
