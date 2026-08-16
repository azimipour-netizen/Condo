'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'
import ShowingRequestModal from './ShowingRequestModal'
import SaveButton from './SaveButton'
import PropertyQA from './PropertyQA'
import MortgageCalculator from './MortgageCalculator'
import CompareButton from './CompareButton'
import { recordView } from '@/lib/recently-viewed'

const SinglePropertyMap = dynamic(() => import('@/components/map/SinglePropertyMap'), { ssr: false })

interface AVM {
  estimate: number
  low: number
  high: number
  comparableCount: number
}

interface Props {
  property: Property
  initialSaved?: boolean
  avm?: AVM | null
}

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', 'semi-detached': 'Semi-Detached', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Vacant Land', commercial: 'Commercial',
}

export default function PropertyDetailView({ property: p, initialSaved, avm }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    recordView({
      id: p.id,
      title: p.title,
      price: p.price,
      thumbnail: p.images[0]?.url ?? null,
      propertyType: p.propertyType,
      city: p.location.city,
      bedrooms: p.bedrooms,
    })
  }, []) // eslint-disable-line

  const displayLocation = [p.location.address, p.location.neighbourhood, p.location.city]
    .filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {/* Nav */}
      <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <span className="text-[color:var(--border)]">|</span>
          <span className="text-xs text-[color:var(--text-muted)]">MLS® {p.listingId}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div>
            {/* Image gallery */}
            {p.images.length > 0 && (
              <div className="mb-6">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[color:var(--bg-surface-2)] mb-2">
                  <img
                    src={p.images[activeImg]?.url}
                    alt={p.images[activeImg]?.alt ?? p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {p.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {p.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={[
                          'shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                          i === activeImg ? 'border-[color:var(--accent)]' : 'border-transparent opacity-60 hover:opacity-100',
                        ].join(' ')}
                      >
                        <img src={img.url} alt={img.alt ?? ''} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--foreground)] mb-1" style={{ textWrap: 'balance' }}>
              {p.title}
            </h1>
            <p className="text-[color:var(--text-muted)] text-sm mb-6">{displayLocation}</p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Bedrooms', value: p.bedrooms },
                { label: 'Bathrooms', value: p.bathroomsTotal },
                { label: 'Parking', value: p.parkingSpaces || '—' },
                { label: 'Interior', value: p.sqft ? `${p.sqft.toLocaleString()} sqft` : '—' },
              ].map(s => (
                <div key={s.label} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold tabular text-[color:var(--foreground)]">{s.value}</p>
                  <p className="text-xs text-[color:var(--text-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">About this property</h2>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{p.description}</p>
            </section>

            {/* Features */}
            {p.features.length > 0 && (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">Features & amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {p.features.map(f => (
                    <span key={f} className="px-3 py-1.5 text-xs bg-[color:var(--bg-surface-2)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)]">
                      {f}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Listing details */}
            <section>
              <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">Listing details</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Property type', value: TYPE_LABELS[p.propertyType] },
                  { label: 'MLS®', value: p.listingId },
                  ...(p.yearBuilt ? [{ label: 'Year built', value: p.yearBuilt }] : []),
                  ...(p.lotSize ? [{ label: 'Lot size', value: p.lotSize }] : []),
                  ...(p.taxes ? [{ label: 'Property taxes', value: `$${p.taxes.toLocaleString()}/yr` }] : []),
                  ...(p.maintenanceFee ? [{ label: 'Maintenance fee', value: `$${p.maintenanceFee.toLocaleString()}/mo` }] : []),
                ].map(d => (
                  <div key={d.label} className="flex justify-between py-2 border-b border-[color:var(--border)] text-sm">
                    <span className="text-[color:var(--text-muted)]">{d.label}</span>
                    <span className="font-medium text-[color:var(--foreground)] tabular">{d.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="lg:sticky lg:top-6 space-y-4 self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-6">
              <p className="text-3xl font-bold tabular text-[color:var(--foreground)] mb-1">
                ${p.price.toLocaleString()}
              </p>
              <p className="text-sm text-[color:var(--text-muted)] mb-4">{TYPE_LABELS[p.propertyType]} · {p.location.city}</p>

              {avm && (
                <div className="mb-5 p-3 rounded-xl bg-[color:var(--bg-surface-2)] border border-[color:var(--border)]">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-1">Estimated Market Value</p>
                  <p className="text-base font-bold text-[color:var(--foreground)] tabular">
                    ${avm.low.toLocaleString()} – ${avm.high.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-[color:var(--text-faint)] mt-0.5">
                    Based on {avm.comparableCount} comparable listing{avm.comparableCount !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
              >
                Request a Showing
              </button>

              <div className="mb-3">
                <SaveButton propertyId={p.id} initialSaved={initialSaved} size="md" />
              </div>

              <CompareButton propertyId={p.id} />
            </div>

            {/* Mortgage Calculator — sale listings only */}
            {p.transactionType === 'sale' && (
              <MortgageCalculator
                price={p.price}
                maintenanceFee={p.maintenanceFee}
                propertyTaxes={p.taxes}
              />
            )}

            {/* Location */}
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">Location</h3>
              {p.location.displayMode !== 'hidden' && (
                <p className="text-sm text-[color:var(--text-muted)] mb-3">{displayLocation}</p>
              )}
              {p.location.displayMode === 'approximate' && (
                <p className="text-xs text-[color:var(--text-faint)]">Approximate location shown. Exact address provided upon confirmed showing.</p>
              )}
              <div className="aspect-[4/3] rounded-xl overflow-hidden mt-2">
                {p.location.latitude != null && p.location.longitude != null ? (
                  <SinglePropertyMap
                    lat={Number(p.location.latitude)}
                    lng={Number(p.location.longitude)}
                    title={p.title}
                    approximate={p.location.displayMode === 'approximate'}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[color:var(--bg-surface-2)] flex items-center justify-center">
                    <p className="text-xs text-[color:var(--text-faint)]">Location not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Q&A section — full-width below main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <PropertyQA propertyId={p.id} />
      </div>

      {showModal && (
        <ShowingRequestModal property={p} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
