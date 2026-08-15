import { Fragment } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMLSAdapter } from '@/lib/mls/adapter'
import type { Property } from '@/types/property'

export const metadata: Metadata = { title: 'Compare Properties' }

const FIELD_GROUPS = [
  {
    label: 'Price',
    fields: [
      { key: 'price', label: 'Asking price', fmt: (v: unknown) => v ? `$${(v as number).toLocaleString()}` : 'â€”' },
      { key: 'taxes', label: 'Property taxes/yr', fmt: (v: unknown) => v ? `$${(v as number).toLocaleString()}` : 'â€”' },
      { key: 'maintenanceFee', label: 'Maintenance fee/mo', fmt: (v: unknown) => v ? `$${(v as number).toLocaleString()}` : 'â€”' },
    ],
  },
  {
    label: 'Property',
    fields: [
      { key: 'propertyType', label: 'Type', fmt: (v: unknown) => TYPE_LABELS[(v as string)] ?? v },
      { key: 'bedrooms', label: 'Bedrooms', fmt: String },
      { key: 'bathroomsTotal', label: 'Bathrooms', fmt: String },
      { key: 'parkingSpaces', label: 'Parking', fmt: (v: unknown) => v ? String(v) : 'â€”' },
      { key: 'sqft', label: 'Interior size', fmt: (v: unknown) => v ? `${(v as number).toLocaleString()} sqft` : 'â€”' },
      { key: 'yearBuilt', label: 'Year built', fmt: (v: unknown) => v ? String(v) : 'â€”' },
      { key: 'lotSize', label: 'Lot size', fmt: (v: unknown) => (v as string | undefined) ?? 'â€”' },
    ],
  },
  {
    label: 'Location',
    fields: [
      { key: 'neighbourhood', label: 'Neighbourhood', fmt: (_: unknown, p: Property) => p.location.neighbourhood ?? 'â€”' },
      { key: 'city', label: 'City', fmt: (_: unknown, p: Property) => p.location.city },
    ],
  },
]

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', 'semi-detached': 'Semi-Detached', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Vacant Land', commercial: 'Commercial',
}

function getValue(p: Property, key: string): unknown {
  if (key === 'neighbourhood') return p.location.neighbourhood
  if (key === 'city') return p.location.city
  return (p as unknown as Record<string, unknown>)[key]
}

interface Props {
  searchParams: Promise<{ ids?: string }>
}

export default async function ComparePage({ searchParams }: Props) {
  const { ids: rawIdsParam } = await searchParams
  const rawIds = rawIdsParam ?? ''
  const ids = rawIds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)

  if (ids.length < 1) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--text-muted)] mb-4">No properties to compare.</p>
          <Link href="/" className="text-[color:var(--accent)] text-sm font-medium hover:underline">Start searching</Link>
        </div>
      </div>
    )
  }

  const adapter = getMLSAdapter()
  const properties = (await Promise.all(ids.map(id => adapter.getListing(id)))).filter(Boolean) as Property[]

  if (properties.length === 0) notFound()

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {/* Nav */}
      <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
          <span className="text-[color:var(--border)]">|</span>
          <h1 className="text-sm font-semibold text-[color:var(--foreground)]">Comparing {properties.length} properties</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          {/* Property headers */}
          <thead>
            <tr>
              <th className="w-40 text-left" />
              {properties.map(p => (
                <th key={p.id} className="pb-6 px-4 align-top">
                  <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
                    {p.images[0] && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <Link href={`/property/${p.id}`} className="text-base font-bold tabular text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors">
                        ${p.price.toLocaleString()}
                      </Link>
                      <p className="text-xs text-[color:var(--text-muted)] mt-1 line-clamp-2">{p.title}</p>
                      <Link
                        href={`/property/${p.id}`}
                        className="mt-3 block text-center text-xs font-medium border border-[color:var(--accent)] text-[color:var(--accent)] rounded-lg py-1.5 hover:bg-[color:var(--accent-dim)] transition-colors"
                      >
                        View listing
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {FIELD_GROUPS.map(group => (
              <Fragment key={group.label}>
                {/* Group header */}
                <tr>
                  <td colSpan={properties.length + 1} className="pt-6 pb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                    {group.label}
                  </td>
                </tr>
                {group.fields.map(field => {
                  const values = properties.map(p => {
                    const raw = getValue(p, field.key)
                    return field.fmt(raw, p)
                  })
                  const allSame = values.every(v => v === values[0])
                  return (
                    <tr key={field.key} className="border-b border-[color:var(--border)]">
                      <td className="py-3 pr-4 text-xs text-[color:var(--text-muted)] font-medium">{field.label}</td>
                      {values.map((v, i) => (
                        <td
                          key={i}
                          className={[
                            'py-3 px-4 text-sm font-medium tabular text-center',
                            !allSame && v !== values[0] ? 'text-[color:var(--accent)]' : 'text-[color:var(--foreground)]',
                          ].join(' ')}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
