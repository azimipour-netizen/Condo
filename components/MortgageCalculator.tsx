'use client'

import { useState, useEffect } from 'react'

function calcMonthly(price: number, down: number, rate: number, years: number): number {
  const principal = price - down
  if (principal <= 0) return 0
  const r = rate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const inputCls = "w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-xl px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors tabular-nums"

interface Props {
  defaultPrice?: number
  compact?: boolean
}

export default function MortgageCalculator({ defaultPrice = 800000, compact = false }: Props) {
  const [price, setPrice] = useState(defaultPrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(5.25)
  const [years, setYears] = useState(25)

  const down = Math.round(price * downPct / 100)
  const monthly = calcMonthly(price, down, rate, years)
  const totalPaid = monthly * years * 12
  const totalInterest = totalPaid - (price - down)
  const insured = downPct < 20

  return (
    <div className={compact ? '' : 'max-w-lg'}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
            Home Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--text-muted)]">$</span>
            <input
              type="number"
              min={100000}
              max={10000000}
              step={5000}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className={`${inputCls} pl-6`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[color:var(--text-muted)]">Down Payment</label>
            <span className="text-xs text-[color:var(--foreground)] tabular-nums font-medium">
              {downPct}% · ${down.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={downPct}
            onChange={e => setDownPct(Number(e.target.value))}
            className="w-full accent-[color:var(--accent)] h-1.5 rounded"
          />
          {insured && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              CMHC mortgage insurance required (down {'<'} 20%)
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
              Interest Rate (%)
            </label>
            <input
              type="number"
              min={0.5}
              max={15}
              step={0.05}
              value={rate}
              onChange={e => setRate(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--text-muted)] mb-1.5">
              Amortization
            </label>
            <select value={years} onChange={e => setYears(Number(e.target.value))} className={inputCls}>
              {[10, 15, 20, 25, 30].map(y => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/20 rounded-xl p-4">
        <p className="text-xs text-[color:var(--text-muted)] mb-1">Monthly Payment</p>
        <p className="text-3xl font-bold text-[color:var(--accent)] tabular-nums">
          ${monthly.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          <span className="text-base font-normal text-[color:var(--text-muted)]">/mo</span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[color:var(--text-muted)]">
          <div>
            <span className="block font-medium text-[color:var(--foreground)]">
              ${(price - down).toLocaleString()}
            </span>
            Mortgage amount
          </div>
          <div>
            <span className="block font-medium text-[color:var(--foreground)]">
              ${Math.max(0, totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            Total interest
          </div>
        </div>
      </div>

      <p className="text-xs text-[color:var(--text-muted)] mt-3 leading-relaxed">
        Estimate only. Does not include property tax, insurance, or CMHC premium. Consult a licensed mortgage professional.
      </p>
    </div>
  )
}
