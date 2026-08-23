'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'
import ShowingRequestModal from './ShowingRequestModal'
import SaveButton from './SaveButton'
import PropertyQA from './PropertyQA'
import MortgageCalculator from './MortgageCalculator'
import CompareButton from './CompareButton'
import { recordView } from '@/lib/recently-viewed'
import { usePageView } from '@/hooks/usePageView'
import OpenHouseSection from './OpenHouseSection'
import NeighbourhoodStats from './NeighbourhoodStats'
import PriceHistory from './PriceHistory'
import ShareButtons from '@/components/ShareButtons'
import RoomDetails from './RoomDetails'
import ComparablesSection from './ComparablesSection'
import MarketDemand from './MarketDemand'

const SinglePropertyMap = dynamic(() => import('@/components/map/SinglePropertyMap'), { ssr: false })

interface AVM {
  estimate: number
  low: number
  high: number
  comparableCount: number
}

interface MarketDemandData {
  activeCount: number
  soldCount90d: number
  monthsOfSupply: number
  label: 'seller' | 'balanced' | 'buyer'
}

interface Props {
  property: Property
  initialSaved?: boolean
  avm?: AVM | null
  marketDemand?: MarketDemandData | null
}

interface HistoryRow {
  listingKey: string
  listPrice: number
  status: string
  dateStart: string | null
  dateEnd: string | null
}

function ListingHistory({ propertyId, currentPrice, currentStatus, listedAt, listingKey }: {
  propertyId: string
  currentPrice: number
  currentStatus: string
  listedAt: string
  listingKey: string
}) {
  const [rows, setRows] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/listing-history`)
      .then(r => r.ok ? r.json() : [])
      .then((data: HistoryRow[]) => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [propertyId])

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

  const displayRows: HistoryRow[] = rows.length > 0 ? rows : [{
    listingKey,
    listPrice: currentPrice,
    status: currentStatus === 'active' ? 'For Sale' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1),
    dateStart: listedAt,
    dateEnd: null,
  }]

  const statusColor = (s: string) => {
    const ls = s.toLowerCase()
    if (ls.includes('sale') || ls === 'active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    if (ls.includes('sold') || ls === 'closed') return 'bg-red-500/10 text-red-600 dark:text-red-400'
    if (ls.includes('terminated') || ls.includes('expired')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    return 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)]'
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-4">Listing history</h2>
      {loading ? (
        <div className="h-20 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl animate-pulse" />
      ) : (
        <div className="border border-[color:var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--bg-surface-2)] border-b border-[color:var(--border)]">
                {['Date Listed', 'Date End', 'Price', 'Event', 'MLS #'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((r, i) => (
                <tr key={r.listingKey + i} className={`border-b border-[color:var(--border)] last:border-0 ${i % 2 === 1 ? 'bg-[color:var(--bg-surface-2)]/50' : 'bg-[color:var(--bg-surface)]'}`}>
                  <td className="px-4 py-3 text-[color:var(--text-muted)] tabular">{fmtDate(r.dateStart)}</td>
                  <td className="px-4 py-3 text-[color:var(--text-muted)] tabular">{fmtDate(r.dateEnd)}</td>
                  <td className="px-4 py-3 font-semibold text-[color:var(--foreground)] tabular">${r.listPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--text-faint)] text-xs font-mono">{r.listingKey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const vid = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v') ?? u.pathname.split('/').pop()
      if (vid) return `https://www.youtube.com/embed/${vid}?autoplay=0&rel=0`
    }
    // Matterport
    if (u.hostname.includes('matterport.com')) {
      const m = url.match(/m=([^&]+)/)
      if (m) return `https://my.matterport.com/show/?m=${m[1]}&play=1`
      return url
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const vid = u.pathname.split('/').pop()
      if (vid) return `https://player.vimeo.com/video/${vid}`
    }
    return url
  } catch {
    return null
  }
}

function VirtualTourEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = getEmbedUrl(url)
  if (!embedUrl) return null
  return (
    <div className="aspect-video rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--bg-surface-2)]">
      <iframe
        src={embedUrl}
        title={`Virtual tour — ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached', 'semi-detached': 'Semi-Detached', townhouse: 'Townhouse',
  condo: 'Condo', multiplex: 'Multiplex', vacant_land: 'Vacant Land', commercial: 'Commercial',
}

export default function PropertyDetailView({ property: p, initialSaved, avm, marketDemand }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const router = useRouter()
  usePageView(p.id)

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ title: p.title, text: `${p.title} — $${p.price.toLocaleString()}`, url })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setActiveImg(i => (i + 1) % p.images.length)
      if (e.key === 'ArrowLeft') setActiveImg(i => (i - 1 + p.images.length) % p.images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, p.images.length])

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
    <div className="bg-[color:var(--background)]">
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
          {/* min-w-0 is required here: CSS Grid items default to min-width:auto,
              so a wide descendant (the comparables card row's overflow-x-auto,
              or a long table) can force this whole column past the 1fr track
              width instead of scrolling internally — pushing the entire page
              into unwanted horizontal scroll. */}
          <div className="min-w-0">
            {/* Image gallery */}
            {p.images.length > 0 && (
              <div className="mb-6">
                <div
                  className="aspect-[16/9] max-h-[55vh] rounded-2xl overflow-hidden bg-[color:var(--bg-surface-2)] mb-2 relative group cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                >
                  <Image
                    src={p.images[activeImg]?.url}
                    alt={p.images[activeImg]?.alt ?? p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-3">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {p.images.length > 1 ? `1 / ${p.images.length} · Click to expand` : 'Click to expand'}
                    </span>
                  </div>
                </div>
                {p.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {p.images.slice(0, 20).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={[
                          'relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                          i === activeImg ? 'border-[color:var(--accent)]' : 'border-transparent opacity-60 hover:opacity-100',
                        ].join(' ')}
                      >
                        <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" sizes="80px" />
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

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm">
              {[
                { icon: '🛏', label: `${p.bedrooms} bed${p.bedrooms !== 1 ? 's' : ''}` },
                { icon: '🚿', label: `${p.bathroomsTotal} bath${p.bathroomsTotal !== 1 ? 's' : ''}` },
                ...(p.parkingSpaces > 0 ? [{ icon: '🚗', label: `${p.parkingSpaces} parking` }] : []),
                ...(p.sqft ? [{ icon: '📐', label: `${p.sqft.toLocaleString()} sqft` }]
                  : p.sqftRange ? [{ icon: '📐', label: `${p.sqftRange} sqft` }] : []),
                ...(p.lotSize ? [{ icon: '🏡', label: p.lotSize }] : []),
              ].map(s => (
                <span key={s.label} className="flex items-center gap-1.5 text-[color:var(--text-muted)]">
                  <span className="text-base">{s.icon}</span>
                  <span className="font-medium text-[color:var(--foreground)]">{s.label}</span>
                </span>
              ))}
              <span className="text-[color:var(--text-faint)]">·</span>
              <span className="text-[color:var(--text-muted)]">
                Listed {new Date(p.listedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              {p.daysOnMarket != null && (
                <span className="text-xs bg-[color:var(--bg-surface)] border border-[color:var(--border)] px-2 py-0.5 rounded-full text-[color:var(--text-muted)]">
                  {p.daysOnMarket}d on market
                </span>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">About this property</h2>
                <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{p.description}</p>
              </section>
            )}

            {/* Virtual tour */}
            {p.virtualTourUrl && (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-3">Virtual tour</h2>
                <VirtualTourEmbed url={p.virtualTourUrl} title={p.title} />
              </section>
            )}

            {/* Comprehensive property information — TRREB style */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-[color:var(--foreground)] mb-4">Property information</h2>

              {/* Key specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)] rounded-xl overflow-hidden mb-6">
                {[
                  { label: 'Bedrooms', value: p.bedrooms || '—' },
                  { label: 'Bathrooms', value: p.bathroomsTotal || '—' },
                  { label: 'Parking', value: p.parkingSpaces || '—' },
                  { label: 'Interior', value: p.sqft ? `${p.sqft.toLocaleString()} sqft` : p.sqftRange ? `${p.sqftRange} sqft` : '—' },
                  { label: 'Lot size', value: p.lotSize ?? '—' },
                  { label: 'Year built', value: p.yearBuilt ?? '—' },
                  ...(p.rooms ? [{ label: 'Total rooms', value: p.rooms }] : []),
                  ...(p.kitchens ? [{ label: 'Kitchens', value: p.kitchens }] : []),
                  ...(p.basement ? [{ label: 'Basement', value: p.basement }] : []),
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-surface)] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)] mb-1">{s.label}</p>
                    <p className="text-sm font-semibold text-[color:var(--foreground)] tabular">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Systems & features */}
              {p.features.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)] mb-2">Systems & features</p>
                  <div className="flex flex-wrap gap-2">
                    {p.features.map(f => (
                      <span key={f} className="px-3 py-1.5 text-xs bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-full text-[color:var(--foreground)]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Two-column details table */}
              <div className="grid sm:grid-cols-2 gap-x-8">
                {[
                  { label: 'Property type', value: TYPE_LABELS[p.propertyType] },
                  { label: 'Transaction', value: p.transactionType === 'lease' ? 'Lease' : 'For Sale' },
                  { label: 'MLS®', value: p.listingId },
                  { label: 'Status', value: p.status.charAt(0).toUpperCase() + p.status.slice(1) },
                  ...(p.crossStreet ? [{ label: 'Cross street', value: p.crossStreet }] : []),
                  ...(p.taxes ? [{ label: 'Property taxes', value: `$${p.taxes.toLocaleString()}/yr` }] : []),
                  ...(p.maintenanceFee ? [{ label: 'Maintenance fee', value: `$${p.maintenanceFee.toLocaleString()}/mo` }] : []),
                  ...(p.daysOnMarket != null ? [{ label: 'Days on market', value: `${p.daysOnMarket} day${p.daysOnMarket !== 1 ? 's' : ''}` }] : []),
                  { label: 'Listed on', value: new Date(p.listedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) },
                  { label: 'Last updated', value: new Date(p.updatedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) },
                  { label: 'City', value: p.location.city },
                  ...(p.location.neighbourhood ? [{ label: 'Community', value: p.location.neighbourhood }] : []),
                  ...(p.location.postalCode ? [{ label: 'Postal code', value: p.location.postalCode }] : []),
                ].map(d => (
                  <div key={d.label} className="flex justify-between py-2.5 border-b border-[color:var(--border)] text-sm">
                    <span className="text-[color:var(--text-muted)] shrink-0 pr-4">{d.label}</span>
                    <span className="font-medium text-[color:var(--foreground)] text-right tabular">{d.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Room dimensions */}
            <RoomDetails propertyId={p.listingId} />

            {/* Listing history */}
            <ListingHistory propertyId={p.id} currentPrice={p.price} currentStatus={p.status} listedAt={p.listedAt} listingKey={p.listingId} />

            {/* Comparable sold / active listings */}
            <ComparablesSection
              propertyId={p.listingId}
              city={p.location.city}
              propertyType={p.propertyType}
              sqft={p.sqft}
              bedroomsMin={Math.max(p.bedrooms - 1, 0)}
            />
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

              <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
                <ShareButtons title={p.title} />
              </div>

              <button
                onClick={handleShare}
                className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 border border-[color:var(--border)] rounded-xl text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] hover:border-[color:var(--foreground)] transition-colors"
              >
                {shareStatus === 'copied' ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Link copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="2.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M4 6.2L9.6 3.3M4 7.8L9.6 10.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    Share listing
                  </>
                )}
              </button>
            </div>

            {/* Mortgage Calculator — sale listings only */}
            {p.transactionType === 'sale' && (
              <MortgageCalculator
                price={p.price}
                maintenanceFee={p.maintenanceFee}
                propertyTaxes={p.taxes}
              />
            )}

            {/* Market demand */}
            {marketDemand && <MarketDemand {...marketDemand} />}

            {/* Open Houses */}
            <OpenHouseSection propertyId={p.id} />

            {/* Neighbourhood stats */}
            <NeighbourhoodStats propertyId={p.id} />

            {/* Price history */}
            <PriceHistory propertyId={p.id} />

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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={() => setLightbox(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 shrink-0" onClick={e => e.stopPropagation()}>
            <span className="text-white/60 text-sm">{activeImg + 1} / {p.images.length}</span>
            <button
              onClick={() => setLightbox(false)}
              className="text-white/70 hover:text-white transition-colors p-1.5"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-4 min-h-0" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images[activeImg]?.url}
              alt={p.images[activeImg]?.alt ?? p.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Prev/Next */}
          {p.images.length > 1 && (
            <div className="flex items-center justify-center gap-4 py-4 shrink-0" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setActiveImg(i => (i - 1 + p.images.length) % p.images.length)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              {/* Thumbnail strip */}
              <div className="flex gap-1.5 max-w-sm overflow-x-auto">
                {p.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={[
                      'relative shrink-0 w-12 h-9 rounded overflow-hidden transition-opacity',
                      i === activeImg ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80',
                    ].join(' ')}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveImg(i => (i + 1) % p.images.length)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
