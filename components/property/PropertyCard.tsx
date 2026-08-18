import type { PropertySummary } from '@/types/property'
import Link from 'next/link'
import Image from 'next/image'
import SaveButton from './SaveButton'

interface Props {
  property: PropertySummary
  compact?: boolean
  isSelected?: boolean
  isActive?: boolean
  onToggleCompare?: () => void
  canCompare?: boolean
}

const TYPE_LABELS: Record<string, string> = {
  detached: 'Detached',
  'semi-detached': 'Semi-Detached',
  townhouse: 'Townhouse',
  condo: 'Condo',
  multiplex: 'Multiplex',
  vacant_land: 'Vacant Land',
  commercial: 'Commercial',
}

export default function PropertyCard({ property: p, compact, isSelected, isActive, onToggleCompare, canCompare = true }: Props) {
  const streetAddress = p.location.address
  const subLocation = [p.location.neighbourhood, p.location.city].filter(Boolean).join(', ')

  if (compact) {
    return (
      <div className="group flex gap-4 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 hover:border-[color:var(--accent)] transition-colors">
        {p.thumbnail && (
          <Link href={`/property/${p.id}`} className="shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[color:var(--bg-surface-2)]">
              <Image src={p.thumbnail} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/property/${p.id}`} className="min-w-0">
              <p className="text-base font-bold tabular text-[color:var(--foreground)]">${p.price.toLocaleString()}</p>
              {streetAddress && <p className="text-xs font-medium text-[color:var(--foreground)] truncate mt-0.5">{streetAddress}</p>}
              <p className="text-xs text-[color:var(--text-muted)] truncate">{subLocation}</p>
            </Link>
            <span className="shrink-0 text-xs bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] px-2 py-0.5 rounded-full">
              {TYPE_LABELS[p.propertyType] ?? p.propertyType}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-[color:var(--text-muted)]">
            <BedBath beds={p.bedrooms} baths={p.bathroomsTotal} />
            {p.parkingSpaces > 0 && <span>{p.parkingSpaces}P</span>}
            {p.sqft && <span>{p.sqft.toLocaleString()} sqft</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={[
      'group bg-[color:var(--bg-surface)] border rounded-2xl overflow-hidden transition-all',
      isActive ? 'border-[color:var(--accent)] shadow-lg' : 'border-[color:var(--border)] hover:border-[color:var(--accent)] hover:shadow-lg',
    ].join(' ')}>
      {/* Image */}
      <Link href={`/property/${p.id}`} className="block relative aspect-[4/3] bg-[color:var(--bg-surface-2)] overflow-hidden">
        {p.thumbnail ? (
          <Image
            src={p.thumbnail}
            alt={p.title}
            fill
            className={`object-cover transition-transform duration-500 ${p.status === 'sold' ? 'grayscale' : 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[color:var(--text-faint)]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 28V14L16 4L28 14V28H20V20H12V28H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-[color:var(--bg-surface)]/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-[color:var(--foreground)]">
            {TYPE_LABELS[p.propertyType] ?? p.propertyType}
          </span>
        </div>
        {p.status === 'sold' && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Sold
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/property/${p.id}`}>
            {p.status === 'sold' ? (
              <div>
                <p className="text-xs text-[color:var(--text-muted)] font-medium mb-0.5">Sold for</p>
                <p className="text-xl font-bold tabular text-[color:var(--text-muted)]">
                  ${p.price.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold tabular text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors">
                ${p.price.toLocaleString()}
              </p>
            )}
          </Link>
          <div className="flex items-center gap-1.5">
            <SaveButton propertyId={p.id} />
            <button
              onClick={onToggleCompare}
              disabled={!canCompare && !isSelected}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
              className={[
                'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-colors',
                isSelected
                  ? 'bg-[color:var(--accent)] border-[color:var(--accent)] text-white'
                  : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6H11M6 1V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {streetAddress && <p className="text-sm font-medium text-[color:var(--foreground)] mb-0.5 truncate">{streetAddress}</p>}
        <p className="text-xs text-[color:var(--text-muted)] mb-3 truncate">{subLocation}</p>

        <div className="flex items-center gap-4 text-sm text-[color:var(--text-muted)] mb-3">
          <BedBath beds={p.bedrooms} baths={p.bathroomsTotal} />
          {p.parkingSpaces > 0 && (
            <span className="flex items-center gap-1">
              <ParkingIcon /> {p.parkingSpaces}
            </span>
          )}
          {p.sqft && (
            <span className="ml-auto text-xs tabular">{p.sqft.toLocaleString()} sqft</span>
          )}
        </div>

        {/* Extra specs row */}
        {(p.lotSize || p.maintenanceFee || p.taxes || p.yearBuilt) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-[color:var(--text-faint)] border-t border-[color:var(--border)] pt-2">
            {p.lotSize && <span>Lot: {p.lotSize}</span>}
            {p.yearBuilt && <span>Built: {p.yearBuilt}</span>}
            {p.maintenanceFee && <span>Maint: ${p.maintenanceFee.toLocaleString()}/mo</span>}
            {p.taxes && <span>Tax: ${p.taxes.toLocaleString()}/yr</span>}
          </div>
        )}

        {/* Description excerpt */}
        {p.description && (
          <p className="text-xs text-[color:var(--text-faint)] line-clamp-2 mb-2">{p.description}</p>
        )}

        {/* Listed date */}
        {p.listedAt && (
          <p className="text-[10px] text-[color:var(--text-faint)] mt-auto">
            Listed {new Date(p.listedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}

function BedBath({ beds, baths }: { beds: number; baths: number }) {
  return (
    <>
      <span className="flex items-center gap-1">
        <BedIcon />
        <span className="tabular">{beds}</span>
      </span>
      <span className="flex items-center gap-1">
        <BathIcon />
        <span className="tabular">{baths}</span>
      </span>
    </>
  )
}

function BedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 9V5.5C1 4.4 1.9 3.5 3 3.5H10C11.1 3.5 12 4.4 12 5.5V9M1 9H12M1 9V11M12 9V11M3 3.5V2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5H11V9C11 10.1 10.1 11 9 11H4C2.9 11 2 10.1 2 9V6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2 6.5V3C2 2.4 2.4 2 3 2H4.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ParkingIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 9.5V4H7C8.1 4 9 4.7 9 5.75C9 6.8 8.1 7.5 7 7.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
