/**
 * PropTx / TRREB RESO Web API adapter (AMPRE)
 *
 * Authentication: Static Bearer token (no OAuth — token issued by PropTx portal)
 * Protocol:       RESO Web API (OData 4.0)
 * Data platform:  AMPRE (query.ampre.ca/odata)
 *
 * Required env vars:
 *   MLS_API_URL       — https://query.ampre.ca/odata
 *   MLS_IDX_TOKEN     — IDX Bearer token from syndication.ampre.ca/tokens
 *   MLS_VOW_TOKEN     — VOW Bearer token (for authenticated user queries)
 */

import type { IMLSAdapter, SoldListing, PropertyRoom } from '../types'
import type { Property, PropertySummary, PropertyType, PropertyStatus } from '@/types/property'
import type { SearchFilters, SearchResult } from '@/types/search'
import { geocodeBatch } from '@/lib/geo/geocode'

const API_URL   = (process.env.MLS_API_URL ?? 'https://query.ampre.ca/odata').replace(/\/$/, '')
const IDX_TOKEN = process.env.MLS_IDX_TOKEN ?? ''
const VOW_TOKEN = process.env.MLS_VOW_TOKEN ?? ''

const MAX_RETRIES = 5
const RETRYABLE_STATUS = new Set([500, 502, 503, 504])

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function reso<T>(path: string, params: Record<string, string> = {}, useVow = false): Promise<T> {
  const token = (useVow && VOW_TOKEN) ? VOW_TOKEN : IDX_TOKEN

  // Bypass URLSearchParams: it encodes $ → %24 (breaks OData param names like $filter)
  // and ' → %27 (AMPRE rejects encoded apostrophes in string literals). OData expressions
  // are valid query-string content as-is, so we concatenate without encoding.
  const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  const rawUrl = `${API_URL}/${path}${qs ? '?' + qs : ''}`

  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // AbortSignal.timeout guards against a hung socket: undici surfaces those as
      // "TypeError: terminated", which would otherwise kill a long sync run.
      const res = await fetch(rawUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
        signal: AbortSignal.timeout(60_000),
        next: { revalidate: 300 },
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        // Only genuinely transient statuses are worth a retry. Notably 501 is NOT:
        // AMPRE answers $count with "no processor for interface", forever.
        const transient = res.status === 429 || RETRYABLE_STATUS.has(res.status)
        if (!transient) {
          throw new Error(`PropTx API error: ${res.status} ${path} — ${body.slice(0, 300)}`)
        }
        throw new Error(`PropTx API ${res.status} ${path} — ${body.slice(0, 200)}`)
      }
      return await res.json() as T
    } catch (err) {
      lastErr = err
      const msg = String(err)
      const permanent = msg.includes('PropTx API error:')
      if (permanent || attempt === MAX_RETRIES) break
      const backoff = Math.min(2 ** attempt * 1000, 30_000)
      console.warn(`[reso] attempt ${attempt}/${MAX_RETRIES} failed (${msg.slice(0, 120)}), retrying in ${backoff}ms`)
      await sleep(backoff)
    }
  }
  throw lastErr
}

// ─── Field mapping ───────────────────────────────────────────────────────────

// RESO PropertyType/SubType → our PropertyType
function mapPropertyType(type: string, subType: string): PropertyType {
  const sub = (subType ?? '').toLowerCase()
  const t   = (type ?? '').toLowerCase()

  if (sub.includes('condo') || sub.includes('apartment') || t.includes('residential income')) return 'condo'
  if (sub.includes('semi')) return 'semi-detached'
  if (sub.includes('town') || sub.includes('row')) return 'townhouse'
  if (sub.includes('detached') || sub.includes('single family')) return 'detached'
  if (sub.includes('multiplex') || sub.includes('duplex') || sub.includes('triplex')) return 'multiplex'
  if (t.includes('land') || sub.includes('vacant')) return 'vacant_land'
  if (t.includes('commercial') || t.includes('business')) return 'commercial'
  return 'detached'
}

function mapStatus(raw: string): PropertyStatus {
  switch ((raw ?? '').toLowerCase()) {
    case 'active':     return 'active'
    case 'closed':
    case 'sold':       return 'sold'
    case 'expired':    return 'expired'
    case 'terminated':
    case 'cancelled':  return 'terminated'
    case 'suspended':  return 'suspended'
    default:           return 'active'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(r: any): Property {
  // AMPRE does not expose Latitude/Longitude through any token tier
  const loc = {
    latitude:      null,
    longitude:     null,
    displayMode:   'approximate' as const,
    address:       r.UnparsedAddress ?? null,
    // CityRegion contains the neighbourhood code (e.g. "C01 - Waterfront Communities")
    neighbourhood: r.CityRegion ? r.CityRegion.replace(/^\w+\s*-\s*/, '') : null,
    city:          r.City ?? 'Toronto',
    province:      r.StateOrProvince ?? 'ON',
    postalCode:    r.PostalCode ?? null,
  }

  const mediaItems: Array<{ Order: number; MediaURL: string; MediaCategory?: string; MediaType?: string }> = r.Media ?? []
  const images = mediaItems
    .filter(m => (m.MediaCategory ?? 'Photo') === 'Photo' && m.MediaURL)
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .slice(0, 40)
    .map((m, i) => ({ url: m.MediaURL, order: i, alt: null }))

  const features: string[] = []
  if (r.HeatType) features.push(`Heating: ${Array.isArray(r.HeatType) ? r.HeatType.join(', ') : r.HeatType}`)
  if (r.Cooling?.length) features.push(`Cooling: ${Array.isArray(r.Cooling) ? r.Cooling.join(', ') : r.Cooling}`)
  if (r.GarageType) features.push(`Garage: ${r.GarageType}`)
  if (r.WaterSource?.length) features.push(`Water: ${Array.isArray(r.WaterSource) ? r.WaterSource.join(', ') : r.WaterSource}`)

  const transactionType = (r.TransactionType ?? '').toLowerCase().includes('lease') ? 'lease' : 'sale'

  const listedAt = r.OriginalEntryTimestamp ?? r.ModificationTimestamp ?? new Date().toISOString()
  const daysOnMarket = r.DaysOnMarket
    ? Number(r.DaysOnMarket)
    : listedAt
      ? Math.floor((Date.now() - new Date(listedAt).getTime()) / 86_400_000)
      : null

  return {
    id:             r.ListingKey,
    listingId:      r.ListingKey,
    status:         mapStatus(r.StandardStatus),
    transactionType,
    price:          Number(r.ListPrice ?? 0),
    propertyType:   mapPropertyType(r.PropertyType ?? '', r.PropertySubType ?? ''),
    bedrooms:       Number(r.BedroomsTotal ?? r.BedroomsAboveGrade ?? 0),
    bathroomsTotal: Number(r.BathroomsTotalInteger ?? 0),
    parkingSpaces:  Number(r.ParkingTotal ?? 0),
    // AMPRE has no LivingArea; BuildingAreaTotal is populated for commercial only
    sqft:           r.BuildingAreaTotal ? Number(r.BuildingAreaTotal) : null,
    lotSize:        r.LotSizeArea ? `${r.LotSizeArea} ${r.LotSizeUnits ?? 'sqft'}` : null,
    yearBuilt:      null,
    maintenanceFee: r.AssociationFee ? Number(r.AssociationFee) : null,
    taxes:          r.TaxAnnualAmount ? Number(r.TaxAnnualAmount) : null,
    title:          r.UnparsedAddress ?? `${r.BedroomsTotal ?? '?'}BR in ${r.City ?? 'Toronto'}`,
    description:    r.PublicRemarks ?? '',
    features,
    location:       loc,
    images,
    virtualTourUrl: r.VirtualTourURLUnbranded ?? r.VirtualTourURLBranded ?? null,
    listedAt,
    updatedAt:      r.ModificationTimestamp ?? listedAt,
    rooms:          r.RoomsTotal ? Number(r.RoomsTotal) : null,
    kitchens:       r.KitchensTotal ? Number(r.KitchensTotal) : null,
    basement:       r.Basement1 ?? null,
    crossStreet:    r.CrossStreet ?? null,
    daysOnMarket,
  }
}

function toSummary(p: Property): PropertySummary {
  return {
    id:              p.id,
    status:          p.status,
    transactionType: p.transactionType,
    price:           p.price,
    propertyType:    p.propertyType,
    bedrooms:        p.bedrooms,
    bathroomsTotal:  p.bathroomsTotal,
    parkingSpaces:   p.parkingSpaces,
    sqft:            p.sqft,
    lotSize:         p.lotSize,
    yearBuilt:       p.yearBuilt,
    maintenanceFee:  p.maintenanceFee,
    taxes:           p.taxes,
    title:           p.title,
    description:     p.description,
    features:        p.features,
    location:        p.location,
    thumbnail:       p.images[0]?.url ?? null,
    listedAt:        p.listedAt,
    updatedAt:       p.updatedAt,
  }
}

// ─── OData filter builder ────────────────────────────────────────────────────

function hasActiveFilters(filters: SearchFilters): boolean {
  return !!(
    filters.priceMin || filters.priceMax ||
    filters.bedroomsMin || filters.bathroomsMin ||
    filters.parkingMin || filters.hasParking ||
    filters.propertyTypes?.length ||
    filters.location
  )
}

function buildFilter(filters: SearchFilters): string {
  // Defaults to for-sale; the map's For Rent tab asks for leases explicitly.
  const parts: string[] = ["StandardStatus eq 'Active'"]
  parts.push(filters.transactionType === 'lease'
    ? "contains(TransactionType,'Lease')"
    : "not contains(TransactionType,'Lease')")

  if (filters.priceMin) parts.push(`ListPrice ge ${filters.priceMin}`)
  if (filters.priceMax) parts.push(`ListPrice le ${filters.priceMax}`)
  if (filters.bedroomsMin) parts.push(`BedroomsTotal ge ${filters.bedroomsMin}`)
  if (filters.bathroomsMin) parts.push(`BathroomsTotalInteger ge ${filters.bathroomsMin}`)
  if (filters.parkingMin || filters.hasParking) {
    parts.push(`ParkingTotal ge ${filters.parkingMin ?? 1}`)
  }
  // Note: LivingArea doesn't exist in AMPRE; sqft filters are skipped

  if (filters.propertyTypes?.length) {
    const clause = filters.propertyTypes.map(mapToAmpre).flat().join(' or ')
    if (clause) parts.push(`(${clause})`)
  }

  // Pre-amalgamation Toronto boroughs are not a queryable value anywhere in
  // AMPRE — City is always "Toronto <district code>" (e.g. "Toronto C06"),
  // never literally "North York", and CityRegion holds a plain neighbourhood
  // name, not the borough. `City eq 'North York'` matches zero rows, and
  // (before this fix) an unhandled value fell through with NO location
  // constraint at all — returning listings scattered across the whole
  // province. Narrowing to "somewhere in Toronto" is not precise, but it is
  // honest and bounded, unlike silently dropping the filter.
  const LEGACY_TORONTO_BOROUGHS = ['north york', 'etobicoke', 'scarborough', 'east york', 'toronto']

  const loc = filters.location
  if (loc?.type === 'city' && loc.value) {
    const v = loc.value.replace(/'/g, "''")
    if (LEGACY_TORONTO_BOROUGHS.includes(v.toLowerCase())) {
      parts.push("contains(City,'Toronto')")
    } else {
      parts.push(`City eq '${v}'`)
    }
  }
  if (loc?.type === 'neighbourhood' && loc.value) {
    const v = loc.value.replace(/'/g, "''")
    // CityRegion holds plain neighbourhood names ("Waterfront Communities C1", "The Beaches")
    // Also fall back to City contains for area-name searches
    parts.push(`(contains(CityRegion,'${v}') or contains(City,'${v}'))`)
  }
  if (loc?.type === 'intersection' && loc.value) {
    // AMPRE has no lat/lng, so there is no true proximity match available —
    // this was previously unhandled entirely, silently dropping the location
    // constraint and returning listings from anywhere in the province.
    // Matching either cross-street by name is an honest approximation: real
    // listings actually on Bayview or Sheppard, not a true radius around the
    // intersection, but a bounded, defensible result instead of nothing.
    const streets = loc.value
      .split(/\s+(?:and|&|\/|at|@)\s+/i)
      .map(s => s.trim().replace(/'/g, "''"))
      .filter(Boolean)
    if (streets.length > 0) {
      const clause = streets
        .map(s => `contains(StreetName,'${s}') or contains(UnparsedAddress,'${s}')`)
        .join(' or ')
      parts.push(`(${clause})`)
    }
  }

  // Note: AMPRE does not expose Latitude/Longitude — bbox and radius filters are skipped

  return parts.join(' and ')
}

// Returns one or more OData filter clauses for a property type.
// AMPRE uses TRREB-specific PropertyType/SubType values, not RESO standard names.
function mapToAmpre(t: PropertyType): string[] {
  switch (t) {
    case 'condo':
      // PropertyType "Residential Condo & Other" has literal & that breaks raw URL concat.
      // Use contains on SubType — matches Condo Apartment, Condo Townhouse, Det Condo, etc.
      return ["contains(PropertySubType,'Condo')"]
    case 'detached':
      return ["PropertySubType eq 'Detached'"]
    case 'semi-detached':
      return ["PropertySubType eq 'Semi-Detached'"]
    case 'townhouse':
      return [
        "PropertySubType eq 'Att/Row/Twnhouse'",
        "PropertySubType eq 'Condo Townhouse'",
        "PropertySubType eq 'Freehold Rowhouse'",
        "PropertySubType eq 'Link'",
      ]
    case 'multiplex':
      return [
        "PropertySubType eq 'Multiplex'",
        "PropertySubType eq 'Duplex'",
        "PropertySubType eq 'Triplex'",
      ]
    case 'vacant_land':
      return ["PropertySubType eq 'Vacant Land'"]
    case 'commercial':
      return ["PropertyType eq 'Commercial'"]
    default:
      return []
  }
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export class PropTxAdapter implements IMLSAdapter {
  readonly name = 'proptx'

  async searchListings(filters: SearchFilters, page = 1, limit?: number): Promise<SearchResult> {
    // No filters = default map view: fetch more pins. Active filters = smaller focused set.
    const effectiveLimit = limit ?? (hasActiveFilters(filters) ? 50 : 100)
    const skip = (page - 1) * effectiveLimit
    const $filter = buildFilter(filters)

    const data = await reso<{ value: unknown[]; '@odata.count'?: number }>('Property', {
        $filter,
        // Inline $count returns @odata.count alongside the page. The separate
        // /Property/$count path is NOT supported by AMPRE — it answers 501
        // "No processor for interface 'CountEntityCollec'".
        $count:  'true',
        $top:    String(effectiveLimit),
        $skip:   String(skip),
        // $expand=Media($top=1): fetch only the first photo per listing for thumbnails.
        // Full $expand=Media returned 20-40 images/listing → 5MB (over Next.js 2MB cache limit).
        // $top=1 limits to one image, keeping the total response small and cacheable.
        $expand: 'Media($top=1)',
        $select: [
          'ListingKey','StandardStatus','TransactionType',
          'ListPrice',
          'PropertyType','PropertySubType',
          'BedroomsTotal','BedroomsAboveGrade','BedroomsBelowGrade',
          'BathroomsTotalInteger','ParkingTotal',
          'BuildingAreaTotal','LotSizeArea','LotSizeUnits',
          'AssociationFee','TaxAnnualAmount',
          'UnparsedAddress','StreetNumber','StreetName','StreetSuffix',
          'City','CityRegion','StateOrProvince','PostalCode',
          'PublicRemarks',
          'OriginalEntryTimestamp','ModificationTimestamp',
          'VirtualTourURLUnbranded','VirtualTourURLBranded',
          'RoomsTotal','DaysOnMarket',
        ].join(','),
        $orderby: 'ModificationTimestamp desc',
    })

    // Fall back to an offset-derived floor if the feed omits the count, so paging
    // still advances instead of collapsing to a single page.
    const total = data['@odata.count'] ?? (skip + data.value.length)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalized = data.value.map((r: any) => normalize(r))

    // Geocode via postal code — AMPRE doesn't provide Latitude/Longitude
    const coords = await geocodeBatch(
      normalized.map(p => ({ postalCode: p.location.postalCode, city: p.location.city }))
    )
    const properties = normalized.map((p, i) => {
      if (coords[i]) {
        p.location.latitude  = coords[i]!.lat
        p.location.longitude = coords[i]!.lng
      }
      return toSummary(p)
    })

    return { properties, total, page, totalPages: Math.ceil(total / effectiveLimit), appliedFilters: filters }
  }

/**
   * Full-sync page fetch. Cursor-paginated on ListingKey rather than $skip:
   * AMPRE hard-rejects any request where $skip + $top exceeds 100,000 ("total
   * count result set cannot exceed 100000"), regardless of how many rows the
   * underlying dataset actually has — with ~100,571 total listings, offset
   * pagination hit that wall a few hundred rows from the end and could never
   * finish. A `ListingKey gt <cursor>` filter has no such ceiling, since there
   * is no $skip involved at all — this is standard OData keyset pagination.
   * ListingKey order is also stable, so a listing modified mid-run doesn't
   * reshuffle later pages and cause skips.
   */
  async getSyncPage(cursor: string | null, limit = 100): Promise<PropertySummary[]> {
    const data = await reso<{ value: unknown[] }>('Property', {
      ...(cursor ? { $filter: `ListingKey gt '${cursor.replace(/'/g, "''")}'` } : {}),
      $top:    String(limit),
      $expand: 'Media($top=1)',
      $select: [
        'ListingKey','StandardStatus','TransactionType',
        'ListPrice',
        'PropertyType','PropertySubType',
        'BedroomsTotal','BedroomsAboveGrade','BedroomsBelowGrade',
        'BathroomsTotalInteger','ParkingTotal',
        'BuildingAreaTotal','LotSizeArea','LotSizeUnits',
        'AssociationFee','TaxAnnualAmount',
        'UnparsedAddress','StreetNumber','StreetName','StreetSuffix',
        'City','CityRegion','StateOrProvince','PostalCode',
        'PublicRemarks',
        'OriginalEntryTimestamp','ModificationTimestamp',
        'VirtualTourURLUnbranded','VirtualTourURLBranded',
        'RoomsTotal','DaysOnMarket',
      ].join(','),
      $orderby: 'ListingKey asc',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalized = data.value.map((r: any) => normalize(r))
    const coords = await geocodeBatch(
      normalized.map(p => ({ postalCode: p.location.postalCode, city: p.location.city }))
    )
    return normalized.map((p, i) => {
      if (coords[i]) {
        p.location.latitude  = coords[i]!.lat
        p.location.longitude = coords[i]!.lng
      }
      return toSummary(p)
    })
  }

  /**
   * Sold (Closed) sale listings from the VOW feed, for AVM comparables.
   * Cursor-paginated on ListingKey — see getSyncPage for why (AMPRE rejects
   * any $skip + $top over 100,000, and this dataset has ~271k rows).
   *
   * Two data-quality traps this guards against:
   *  - CloseDate is unreliable (records carry values like "3549-10-01"), so the
   *    date window is applied to PurchaseContractDate instead.
   *  - Closed "For Lease" records report a MONTHLY RENT in ClosePrice. Mixing
   *    those into comparables would poison any valuation, so sales only.
   */
  async getSoldPage(cursor: string | null, limit = 100, since?: Date): Promise<SoldListing[]> {
    const clauses = [
      "StandardStatus eq 'Closed'",
      "TransactionType eq 'For Sale'",
    ]
    if (since) clauses.push(`PurchaseContractDate ge ${since.toISOString().slice(0, 10)}`)
    if (cursor) clauses.push(`ListingKey gt '${cursor.replace(/'/g, "''")}'`)

    const data = await reso<{ value: unknown[] }>('Property', {
      $filter:  clauses.join(' and '),
      $top:     String(limit),
      $select: [
        'ListingKey','StandardStatus','TransactionType',
        'ClosePrice','ListPrice','PurchaseContractDate','CloseDate',
        'PropertyType','PropertySubType',
        'BedroomsTotal','BathroomsTotalInteger','ParkingTotal',
        'BuildingAreaTotal','LotSizeArea','LotSizeUnits',
        'UnparsedAddress','City','CityRegion','StateOrProvince','PostalCode',
        'OriginalEntryTimestamp','ModificationTimestamp',
      ].join(','),
      $orderby: 'ListingKey asc',
    }, true) // VOW token — sold data is not in the IDX feed

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data.value ?? []) as any[]
    const normalized = rows.map(r => normalize(r))
    const coords = await geocodeBatch(
      normalized.map(p => ({ postalCode: p.location.postalCode, city: p.location.city }))
    )

    return normalized.map((p, i) => {
      if (coords[i]) {
        p.location.latitude  = coords[i]!.lat
        p.location.longitude = coords[i]!.lng
      }
      const raw = rows[i]
      const soldPrice = Number(raw.ClosePrice)
      const contract  = raw.PurchaseContractDate ? new Date(raw.PurchaseContractDate) : null
      return {
        summary:   toSummary(p),
        soldPrice: isFinite(soldPrice) && soldPrice > 0 ? soldPrice : null,
        soldDate:  contract && !isNaN(contract.getTime()) ? contract : null,
      }
    })
  }

  async getListing(id: string): Promise<Property | null> {
    try {
      const data = await reso<{ value: unknown[] }>('Property', {
        $filter:  `ListingKey eq '${id}'`,
        $expand:  'Media',
        $top:     '1',
      })
      if (!data.value.length) return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return normalize(data.value[0] as any)
    } catch {
      return null
    }
  }

  /**
   * Room-by-room dimensions from AMPRE's PropertyRooms resource — a separate
   * feed from Property itself. RoomLevel and RoomFeatures are frequently
   * empty depending on the listing board, so callers should treat them as
   * optional, not missing data.
   */
  async getPropertyRooms(listingKey: string): Promise<PropertyRoom[]> {
    try {
      const data = await reso<{ value: unknown[] }>('PropertyRooms', {
        $filter:  `ListingKey eq '${listingKey.replace(/'/g, "''")}'`,
        $orderby: 'Order asc',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data.value ?? []).map((r: any) => ({
        type:       r.RoomType ?? 'Room',
        level:      r.RoomLevel ?? null,
        length:     typeof r.RoomLength === 'number' ? r.RoomLength : null,
        width:      typeof r.RoomWidth === 'number' ? r.RoomWidth : null,
        units:      r.RoomLengthWidthUnits ?? null,
        dimensions: r.RoomDimensions ?? null,
        features:   Array.isArray(r.RoomFeatures) ? r.RoomFeatures.filter(Boolean) : [],
      }))
    } catch {
      return []
    }
  }

  async getUpdatedListings(since: Date): Promise<Property[]> {
    const iso = since.toISOString()
    const PAGE_SIZE = 100
    const all: Property[] = []
    let skip = 0
    while (true) {
      const data = await reso<{ value: unknown[] }>('Property', {
        $filter:  `ModificationTimestamp gt ${iso}`,
        $expand:  'Media($top=1)',
        $top:     String(PAGE_SIZE),
        $skip:    String(skip),
        $orderby: 'ModificationTimestamp asc',
      })
      const batch = data.value ?? []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      all.push(...batch.map((r: any) => normalize(r)))
      if (batch.length < PAGE_SIZE) break
      skip += PAGE_SIZE
    }
    return all
  }

  async ping(): Promise<boolean> {
    try {
      if (!IDX_TOKEN) return false
      const data = await reso<{ value: unknown[] }>('Property', { $top: '1', $select: 'ListingKey' })
      return Array.isArray(data.value)
    } catch {
      return false
    }
  }
}
