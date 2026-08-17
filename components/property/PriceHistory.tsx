'use client'
import { useEffect, useState } from 'react'

interface Point { price: number; recordedAt: string }

const fmt = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

export default function PriceHistory({ propertyId }: { propertyId: string }) {
  const [history, setHistory] = useState<Point[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/price-history`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setHistory(d); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [propertyId])

  if (!loaded || history.length < 2) return null

  const prices = history.map(h => h.price)
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const range = maxP - minP || 1

  const latest = history[history.length - 1]
  const prev = history[history.length - 2]
  const diff = latest.price - prev.price
  const pct = ((diff / prev.price) * 100).toFixed(1)

  // SVG sparkline: 200×48
  const W = 200; const H = 48; const PAD = 4
  const points = history.map((h, i) => {
    const x = PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2)
    const y = H - PAD - ((h.price - minP) / range) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">Price history</h2>
      <div className="bg-[color:var(--bg-surface-1)] border border-[color:var(--border)] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-[color:var(--foreground)] tabular-nums">{fmt(latest.price)}</span>
          <span className={`text-xs font-semibold tabular-nums ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-emerald-500' : 'text-[color:var(--muted)]'}`}>
            {diff > 0 ? '+' : ''}{fmt(diff)} ({pct}%)
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12 overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {history.map((_, i) => {
            const x = PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2)
            const y = H - PAD - ((history[i].price - minP) / range) * (H - PAD * 2)
            return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--accent)" />
          })}
        </svg>
        <div className="mt-3 space-y-1.5">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between text-xs text-[color:var(--muted)]">
              <span>{new Date(h.recordedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="tabular-nums font-medium text-[color:var(--foreground)]">{fmt(h.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
