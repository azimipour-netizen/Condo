'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', 'semi-detached': 'Semi-Detached', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Vacant Land', commercial: 'Commercial',
}

interface Props {
  properties: Property[]
}

type Section = {
  label: string
  rows: { label: string; value: (p: Property) => string | null }[]
}

const SECTIONS: Section[] = [
  {
    label: 'Key Facts',
    rows: [
      { label: 'Bedrooms', value: p => String(p.bedrooms) },
      { label: 'Bathrooms', value: p => String(p.bathroomsTotal) },
      { label: 'Parking', value: p => p.parkingSpaces ? String(p.parkingSpaces) : '—' },
      { label: 'Interior', value: p => p.sqft ? `${p.sqft.toLocaleString()} sqft` : '—' },
    ],
  },
  {
    label: 'Property',
    rows: [
      { label: 'Type', value: p => TYPE_LABELS[p.propertyType] ?? p.propertyType },
      { label: 'Status', value: p => p.status.charAt(0).toUpperCase() + p.status.slice(1) },
      { label: 'Transaction', value: p => p.transactionType === 'sale' ? 'For Sale' : 'For Lease' },
      { label: 'Year Built', value: p => p.yearBuilt ? String(p.yearBuilt) : '—' },
      { label: 'Lot Size', value: p => p.lotSize ?? '—' },
    ],
  },
  {
    label: 'Financials',
    rows: [
      {
        label: 'Price',
        value: p => p.transactionType === 'lease'
          ? `$${p.price.toLocaleString()}/mo`
          : `$${p.price.toLocaleString()}`,
      },
      { label: 'Property Tax', value: p => p.taxes ? `$${p.taxes.toLocaleString()}/yr` : '—' },
      { label: 'Maintenance', value: p => p.maintenanceFee ? `$${p.maintenanceFee.toLocaleString()}/mo` : '—' },
    ],
  },
  {
    label: 'Location',
    rows: [
      { label: 'Neighbourhood', value: p => p.location.neighbourhood ?? '—' },
      { label: 'City', value: p => p.location.city },
      { label: 'Province', value: p => p.location.province },
    ],
  },
]

function fmtPrice(p: Property) {
  return p.transactionType === 'lease'
    ? `$${p.price.toLocaleString()}/mo`
    : `$${p.price.toLocaleString()}`
}

export default function CompareView({ properties: initial }: Props) {
  const [properties, setProperties] = useState(initial)
  const router = useRouter()

  function removeProperty(id: string) {
    const next = properties.filter(p => p.id !== id)
    setProperties(next)
    // update localStorage
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('compareIds') ?? '[]')
      const updated = stored.filter(x => x !== id)
      localStorage.setItem('compareIds', JSON.stringify(updated))
      window.dispatchEvent(new Event('compare-updated'))
    } catch {}
    // update URL
    if (next.length === 0) {
      router.push('/')
    } else {
      router.replace(`/compare?ids=${next.map(p => p.id).join(',')}`)
    }
  }

  const colCount = properties.length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: `${colCount * 220 + 180}px` }}>
          {/* Property header cards */}
          <thead>
            <tr>
              <th className="w-44 min-w-[11rem]" />
              {properties.map(p => (
                <th key={p.id} className="px-3 pb-5 align-top text-left font-normal">
                  <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-[color:var(--bg-surface-2)] overflow-hidden">
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="300px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[color:var(--text-faint)]">
                            <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M2 22L10 14L15 19L20 13L30 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <p className="text-lg font-bold tabular-nums text-[color:var(--accent)] mb-0.5">
                        {fmtPrice(p)}
                      </p>
                      <Link
                        href={`/property/${p.id}`}
                        className="text-sm font-semibold text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors leading-snug block mb-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-[color:var(--text-muted)] mb-3">
                        MLS® {p.listingId}
                      </p>
                      <button
                        onClick={() => removeProperty(p.id)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs text-[color:var(--text-muted)] hover:text-red-400 border border-[color:var(--border)] hover:border-red-400/40 rounded-lg py-1.5 transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M2 2L9 9M9 2L2 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {SECTIONS.map(section => (
              <Fragment key={section.label}>
                {/* Section header */}
                <tr className="border-t border-[color:var(--border)]">
                  <td
                    colSpan={colCount + 1}
                    className="pt-5 pb-2 px-0"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                      {section.label}
                    </span>
                  </td>
                </tr>

                {/* Data rows */}
                {section.rows.map((row, ri) => {
                  const values = properties.map(p => row.value(p))
                  const allSame = values.every(v => v === values[0])
                  return (
                    <tr
                      key={row.label}
                      className={ri % 2 === 0 ? 'bg-[color:var(--bg-surface-2)]/40' : ''}
                    >
                      <td className="py-2.5 pr-4 text-xs text-[color:var(--text-muted)] font-medium align-middle whitespace-nowrap">
                        {row.label}
                      </td>
                      {values.map((val, vi) => (
                        <td
                          key={vi}
                          className={[
                            'px-3 py-2.5 text-sm align-middle',
                            !allSame && val !== '—'
                              ? 'font-semibold text-[color:var(--foreground)]'
                              : 'text-[color:var(--foreground)]',
                          ].join(' ')}
                        >
                          {val ?? '—'}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </Fragment>
            ))}

            {/* Features row */}
            <tr key="section-features" className="border-t border-[color:var(--border)]">
              <td colSpan={colCount + 1} className="pt-5 pb-2 px-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Features
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 text-xs text-[color:var(--text-muted)] font-medium align-top whitespace-nowrap">
                Amenities
              </td>
              {properties.map(p => (
                <td key={p.id} className="px-3 py-2.5 align-top">
                  {p.features.length === 0 ? (
                    <span className="text-sm text-[color:var(--foreground)]">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {p.features.map(f => (
                        <span
                          key={f}
                          className="px-2 py-0.5 text-xs bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* View full detail links */}
      <div
        className="mt-8 grid gap-3"
        style={{ gridTemplateColumns: `11rem repeat(${colCount}, 1fr)` }}
      >
        <div />
        {properties.map(p => (
          <Link
            key={p.id}
            href={`/property/${p.id}`}
            className="flex items-center justify-center gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            View Details
          </Link>
        ))}
      </div>
    </div>
  )
}
