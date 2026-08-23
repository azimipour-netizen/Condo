'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Comp {
  id: string
  listingId: string
  price: number
  soldDate: string | null
  bedrooms: number
  bathroomsTotal: number
  sqft: number | null
  address: string | null
  neighbourhood: string | null
  thumbnail: string | null
}

interface Props {
  propertyId: string
  city: string
  propertyType: string
  sqft: number | null
  bedroomsMin: number
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

function CompCard({ c, sold }: { c: Comp; sold: boolean }) {
  return (
    <Link
      href={`/property/${c.listingId}`}
      className="shrink-0 w-56 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] overflow-hidden hover:border-[color:var(--border-strong)] transition-colors"
    >
      <div className="relative w-full h-32 bg-[color:var(--bg-surface-2)]">
        {c.thumbnail && (
          <Image src={c.thumbnail} alt={c.address ?? ''} fill className="object-cover" sizes="224px" />
        )}
        {sold && (
          <span className="absolute top-2 left-2 bg-[color:var(--foreground)] text-[color:var(--background)] text-[10px] font-semibold px-2 py-0.5 rounded-full">
            SOLD
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[color:var(--foreground)] tabular">
          {formatPrice(c.price)}
          {sold && c.soldDate && (
            <span className="ml-1.5 text-[10px] font-normal text-[color:var(--text-faint)]">
              {new Date(c.soldDate).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </p>
        <p className="text-xs text-[color:var(--text-muted)] truncate mt-0.5">{c.address ?? c.neighbourhood ?? '—'}</p>
        <p className="text-[11px] text-[color:var(--text-faint)] mt-1">
          {c.bedrooms} bd · {c.bathroomsTotal} ba{c.sqft ? ` · ${c.sqft.toLocaleString()} sqft` : ''}
        </p>
      </div>
    </Link>
  )
}

export default function ComparablesSection({ propertyId, city, propertyType, sqft, bedroomsMin }: Props) {
  const [sold, setSold] = useState<Comp[]>([])
  const [active, setActive] = useState<Comp[]>([])
  const [soldNeedsAuth, setSoldNeedsAuth] = useState(false)
  const [tab, setTab] = useState<'sold' | 'active'>('active')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({ city, propertyType, bedroomsMin: String(bedroomsMin) })
    if (sqft) params.set('sqft', String(sqft))

    fetch(`/api/properties/${propertyId}/comparables?${params}`)
      .then(r => r.ok ? r.json() : { sold: [], active: [], soldRequiresAuth: true })
      .then(data => {
        setSold(data.sold ?? [])
        setActive(data.active ?? [])
        setSoldNeedsAuth(!!data.soldRequiresAuth)
        if ((data.sold?.length ?? 0) > 0) setTab('sold')
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [propertyId, city, propertyType, sqft, bedroomsMin])

  if (!loaded || (sold.length === 0 && active.length === 0 && !soldNeedsAuth)) return null

  const items = tab === 'sold' ? sold : active

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[color:var(--foreground)]">Comparable listings</h2>
        <div className="flex items-center gap-1 p-1 rounded-full bg-[color:var(--bg-surface-2)] border border-[color:var(--border)]">
          <button
            onClick={() => setTab('sold')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${tab === 'sold' ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--text-muted)]'}`}
          >
            Sold
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${tab === 'active' ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--text-muted)]'}`}
          >
            For Sale
          </button>
        </div>
      </div>

      {tab === 'sold' && soldNeedsAuth ? (
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] px-4 py-6 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">
            <Link href="/login" className="font-semibold text-[color:var(--accent)] hover:underline">Sign in</Link>
            {' '}to see nearby sold prices.
          </p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-[color:var(--text-faint)]">No comparable {tab === 'sold' ? 'sold' : 'active'} listings nearby right now.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map(c => <CompCard key={c.id} c={c} sold={tab === 'sold'} />)}
        </div>
      )}
    </section>
  )
}
