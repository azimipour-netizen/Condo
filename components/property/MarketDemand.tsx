interface Props {
  activeCount: number
  soldCount90d: number
  monthsOfSupply: number
  label: 'seller' | 'balanced' | 'buyer'
}

const COPY: Record<Props['label'], { title: string; color: string; dot: string }> = {
  seller:   { title: "Seller's Market",  color: 'text-red-600 dark:text-red-400',       dot: 'bg-red-500' },
  balanced: { title: 'Balanced Market',  color: 'text-amber-600 dark:text-amber-400',   dot: 'bg-amber-500' },
  buyer:    { title: "Buyer's Market",   color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
}

// Position along a 0–6+ month gauge, clamped so extreme values don't overflow the bar.
function gaugePosition(months: number): number {
  return Math.min(Math.max(months, 0), 6) / 6 * 100
}

export default function MarketDemand({ activeCount, soldCount90d, monthsOfSupply, label }: Props) {
  const copy = COPY[label]

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-1">Market demand</h3>
      <p className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${copy.color}`}>
        <span className={`w-2 h-2 rounded-full ${copy.dot}`} />
        {copy.title}
      </p>

      <div className="relative h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 mb-1">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[color:var(--foreground)] shadow"
          style={{ left: `calc(${gaugePosition(monthsOfSupply)}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[color:var(--text-faint)] mb-3">
        <span>Seller's</span>
        <span>Balanced</span>
        <span>Buyer's</span>
      </div>

      <p className="text-xs text-[color:var(--text-muted)]">
        {monthsOfSupply} month{monthsOfSupply !== 1 ? 's' : ''} of supply — {activeCount.toLocaleString()} active, {soldCount90d.toLocaleString()} sold in the last 90 days, same type &amp; city.
      </p>
    </div>
  )
}
