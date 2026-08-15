'use client'

import { useState, useMemo } from 'react'

interface Props {
  price: number
  maintenanceFee?: number | null
  propertyTaxes?: number | null
}

const AMORT_OPTIONS = [15, 20, 25, 30]

// Canadian mortgages compound semi-annually
function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12)
  const r = Math.pow(1 + annualRate / 200, 1 / 6) - 1 // effective monthly rate
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmt(n: number) {
  return n.toLocaleString('en-CA', { maximumFractionDigits: 0 })
}

export default function MortgageCalculator({ price, maintenanceFee, propertyTaxes }: Props) {
  const [open, setOpen] = useState(false)
  const [dpMode, setDpMode] = useState<'pct' | 'amt'>('pct')
  const [dpPct, setDpPct] = useState(20)
  const [dpAmt, setDpAmt] = useState(Math.round(price * 0.2))
  const [rate, setRate] = useState(5.49)
  const [amort, setAmort] = useState(25)

  const downPayment = dpMode === 'pct' ? Math.round(price * dpPct / 100) : dpAmt
  const principal = Math.max(0, price - downPayment)
  const dpPercent = price > 0 ? (downPayment / price) * 100 : 0

  const monthly = useMemo(() => monthlyPayment(principal, rate, amort), [principal, rate, amort])
  const totalPaid = monthly * amort * 12
  const totalInterest = totalPaid - principal

  const monthlyTax = propertyTaxes ? propertyTaxes / 12 : 0
  const monthlyMaint = maintenanceFee ?? 0
  const totalMonthly = monthly + monthlyTax + monthlyMaint

  // CMHC insurance required if <20% down
  const needsCMHC = dpPercent < 20 && price < 1_500_000

  function handleDpPct(v: number) {
    const clamped = Math.min(95, Math.max(0, v))
    setDpPct(clamped)
    setDpAmt(Math.round(price * clamped / 100))
  }

  function handleDpAmt(v: number) {
    const clamped = Math.min(price, Math.max(0, v))
    setDpAmt(clamped)
    setDpPct(Math.round((clamped / price) * 100 * 10) / 10)
  }

  return (
    <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Mortgage Calculator</p>
          {!open && (
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5 tabular-nums">
              ~${fmt(Math.round(totalMonthly))}/mo · 20% down · {rate}%
            </p>
          )}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`text-[color:var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-[color:var(--border)] pt-4">
          {/* Down payment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[color:var(--foreground)]">Down Payment</label>
              <div className="flex rounded-lg overflow-hidden border border-[color:var(--border)] text-xs">
                {(['pct', 'amt'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setDpMode(m)}
                    className={`px-2.5 py-1 transition-colors ${dpMode === m ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--text-muted)] hover:text-[color:var(--foreground)]'}`}
                  >
                    {m === 'pct' ? '%' : '$'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {dpMode === 'pct' ? (
                <input
                  type="number" min={0} max={95} step={1} value={dpPct}
                  onChange={e => handleDpPct(Number(e.target.value))}
                  className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors tabular-nums"
                />
              ) : (
                <input
                  type="number" min={0} max={price} step={1000} value={dpAmt}
                  onChange={e => handleDpAmt(Number(e.target.value))}
                  className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors tabular-nums"
                />
              )}
            </div>
            <p className="text-xs text-[color:var(--text-faint)] mt-1 tabular-nums">
              {dpMode === 'pct' ? `$${fmt(downPayment)}` : `${dpPercent.toFixed(1)}%`} of purchase price
            </p>
            {needsCMHC && (
              <p className="text-xs text-amber-500 mt-1">CMHC insurance required for &lt;20% down</p>
            )}
          </div>

          {/* Rate */}
          <div>
            <label className="text-xs font-medium text-[color:var(--foreground)] mb-1.5 block">Interest Rate (%)</label>
            <input
              type="number" min={0} max={20} step={0.05} value={rate}
              onChange={e => setRate(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] transition-colors tabular-nums"
            />
          </div>

          {/* Amortization */}
          <div>
            <label className="text-xs font-medium text-[color:var(--foreground)] mb-1.5 block">Amortization</label>
            <div className="grid grid-cols-4 gap-1.5">
              {AMORT_OPTIONS.map(y => (
                <button
                  key={y}
                  onClick={() => setAmort(y)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${amort === y ? 'bg-[color:var(--accent)] text-white' : 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] border border-[color:var(--border)]'}`}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-[color:var(--bg-surface-2)] rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[color:var(--text-muted)]">Principal + Interest</span>
              <span className="text-sm font-semibold tabular-nums text-[color:var(--foreground)]">${fmt(Math.round(monthly))}/mo</span>
            </div>
            {monthlyTax > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[color:var(--text-muted)]">Property Tax</span>
                <span className="text-sm tabular-nums text-[color:var(--foreground)]">${fmt(Math.round(monthlyTax))}/mo</span>
              </div>
            )}
            {monthlyMaint > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[color:var(--text-muted)]">Maintenance Fee</span>
                <span className="text-sm tabular-nums text-[color:var(--foreground)]">${fmt(Math.round(monthlyMaint))}/mo</span>
              </div>
            )}
            <div className="border-t border-[color:var(--border)] pt-2.5 flex justify-between items-center">
              <span className="text-xs font-semibold text-[color:var(--foreground)]">Est. Monthly Total</span>
              <span className="text-lg font-bold tabular-nums text-[color:var(--accent)]">${fmt(Math.round(totalMonthly))}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[color:var(--bg-surface-2)] rounded-lg p-3 text-center">
              <p className="text-xs text-[color:var(--text-muted)]">Total Interest</p>
              <p className="text-sm font-semibold tabular-nums text-[color:var(--foreground)] mt-0.5">${fmt(Math.round(totalInterest))}</p>
            </div>
            <div className="bg-[color:var(--bg-surface-2)] rounded-lg p-3 text-center">
              <p className="text-xs text-[color:var(--text-muted)]">Loan Amount</p>
              <p className="text-sm font-semibold tabular-nums text-[color:var(--foreground)] mt-0.5">${fmt(principal)}</p>
            </div>
          </div>

          <p className="text-[10px] text-[color:var(--text-faint)] leading-relaxed">
            Estimate only. Canadian semi-annual compounding. Does not include CMHC premium, closing costs, or insurance.
          </p>
        </div>
      )}
    </div>
  )
}
