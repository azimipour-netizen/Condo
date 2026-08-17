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

import type { IMLSAdapter } from '../types'
import type { Property, PropertySummary, PropertyType, PropertyStatus } from '@/types/property'
import type { SearchFilters, SearchResult } from '@/types/search'
import { geocodeBatch } from '@/lib/geo/geocode'

const API_URL   = (process.env.MLS_API_URL ?? 'https://query.ampre.ca/odata').replace(/\/$/, '')
const IDX_TOKEN = process.env.MLS_IDX_TOKEN ?? ''
const VOW_TOKEN = process.env.MLS_VOW_TOKEN ?? ''

async function reso<T>(path: string, params: Record<string, string> = {}, useVow = false): Promise<T> {
  const token = (useVow && VOW_TOKEN) ? VOW_TOKEN : IDX_TOKEN

  // Bypass URLSearchParams: it encodes $ → %24 (breaks OData param names like $filter)
  // and ' → %27 (AMPRE rejects encoded apostrophes in string literals). OData expressions
  // are valid query-string content as-is, so we concatenate without encoding.
  const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  const rawUrl = `${API_URL}/${path}${qs ? '?' + qs : ''}`
  const res = await fetch(rawUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`PropTx API error: ${res.status} ${path} — ${body.slice(0, 300)}`)
  }
  return res.json() as Promise<T>
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

function buildFilter(filters: SearchFilters): string {
  const parts: string[] = ["StandardStatus eq 'Active'"]

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

  const loc = filters.location
  if (loc?.type === 'city' && loc.value) {
    const v = loc.value.replace(/'/g, "''")
    // AMPRE stores Toronto as district codes: "Toronto C01", "Toronto E02", etc.
    // Any value containing "toronto" needs a contains() match, not an eq match.
    if (v.toLowerCase().includes('toronto')) {
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

  async searchListings(filters: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
    const skip = (page - 1) * limit
    const $filter = buildFilter(filters)

    const [data, countData] = await Promise.all([
      reso<{ value: unknown[] }>('Property', {
        $filter,
        $top:    String(limit),
        $skip:   String(skip),
        // AMPRE: nested $select inside $expand returns empty body — use bare $expand=Media
        // Only include confirmed RESO Data Dictionary fields; TRREB-specific fields
        // (KitchensTotal, Basement1, CrossStreet, HeatType, ListPriceUnit) cause 400.
        $expand: 'Media',
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
      }),
      reso<{ '@odata.count': number }>('Property/$count', { $filter }).catch(() => null),
    ])

    const total = countData?.['@odata.count'] ?? data.value.length
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

    return { properties, total, page, totalPages: Math.ceil(total / limit), appliedFilters: filters }
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

  async getUpdatedListings(since: Date): Promise<Property[]> {
    const iso = since.toISOString()
    const data = await reso<{ value: unknown[] }>('Property', {
      $filter:  `ModificationTimestamp gt ${iso}`,
      $expand:  'Media',
      $top:     '500',
      $orderby: 'ModificationTimestamp asc',
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.value.map((r: any) => normalize(r))
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
