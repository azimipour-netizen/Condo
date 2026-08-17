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

const API_URL   = (process.env.MLS_API_URL ?? 'https://query.ampre.ca/odata').replace(/\/$/, '')
const IDX_TOKEN = process.env.MLS_IDX_TOKEN ?? ''
const VOW_TOKEN = process.env.MLS_VOW_TOKEN ?? ''

async function reso<T>(path: string, params: Record<string, string> = {}, useVow = false): Promise<T> {
  const token = (useVow && VOW_TOKEN) ? VOW_TOKEN : IDX_TOKEN
  const url = new URL(`${API_URL}/${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) throw new Error(`PropTx API error: ${res.status} ${path}`)
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
  const loc = {
    latitude:     r.Latitude   ? Number(r.Latitude)   : null,
    longitude:    r.Longitude  ? Number(r.Longitude)  : null,
    displayMode:  'approximate' as const,
    address:      r.UnparsedAddress ?? null,
    neighbourhood: r.SubdivisionName ?? r.CommunityName ?? null,
    city:         r.City ?? 'Toronto',
    province:     r.StateOrProvince ?? 'ON',
    postalCode:   r.PostalCode ?? null,
  }

  // Photos come via $expand=Media or MediaURL fields
  const mediaItems: Array<{ Order: number; MediaURL: string }> =
    r.Media ?? []
  const images = mediaItems
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m, i) => ({ url: m.MediaURL, order: i, alt: null }))

  const features: string[] = []
  if (r.Heating) features.push(`Heating: ${r.Heating}`)
  if (r.Cooling) features.push(`Cooling: ${r.Cooling}`)
  if (r.GarageType) features.push(`Garage: ${r.GarageType}`)
  if (r.WaterSource) features.push(`Water: ${r.WaterSource}`)
  if (r.Appliances) features.push(...String(r.Appliances).split(',').map((s: string) => s.trim()))

  const transactionType = (r.TransactionType ?? '').toLowerCase().includes('lease') ? 'lease' : 'sale'

  return {
    id:             r.ListingKey ?? r.ListingId,
    listingId:      r.ListingId  ?? r.ListingKey,
    status:         mapStatus(r.StandardStatus),
    transactionType,
    price:          Number(r.ListPrice ?? 0),
    propertyType:   mapPropertyType(r.PropertyType ?? '', r.PropertySubType ?? ''),
    bedrooms:       Number(r.BedroomsTotal ?? 0),
    bathroomsTotal: Number(r.BathroomsTotalInteger ?? r.BathroomsTotal ?? 0),
    parkingSpaces:  Number(r.ParkingTotal ?? 0),
    sqft:           r.LivingArea ? Number(r.LivingArea) : null,
    lotSize:        r.LotSizeArea ? `${r.LotSizeArea} ${r.LotSizeUnits ?? 'sqft'}` : null,
    yearBuilt:      r.YearBuilt   ? Number(r.YearBuilt) : null,
    maintenanceFee: r.AssociationFee ? Number(r.AssociationFee) : null,
    taxes:          r.TaxAnnualAmount ? Number(r.TaxAnnualAmount) : null,
    title:          r.UnparsedAddress ?? `${r.BedroomsTotal ?? '?'}BR in ${r.City ?? 'Toronto'}`,
    description:    r.PublicRemarks ?? '',
    features,
    location:       loc,
    images,
    virtualTourUrl: r.VirtualTourURLUnbranded ?? r.VirtualTourURLBranded ?? null,
    listedAt:       r.ListingContractDate ?? r.OnMarketDate ?? new Date().toISOString(),
    updatedAt:      r.ModificationTimestamp ?? new Date().toISOString(),
  }
}

function toSummary(p: Property): PropertySummary {
  return {
    id:             p.id,
    status:         p.status,
    price:          p.price,
    propertyType:   p.propertyType,
    bedrooms:       p.bedrooms,
    bathroomsTotal: p.bathroomsTotal,
    parkingSpaces:  p.parkingSpaces,
    sqft:           p.sqft,
    title:          p.title,
    location:       p.location,
    thumbnail:      p.images[0]?.url ?? null,
    listedAt:       p.listedAt,
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
  if (filters.sqftMin) parts.push(`LivingArea ge ${filters.sqftMin}`)
  if (filters.sqftMax) parts.push(`LivingArea le ${filters.sqftMax}`)

  if (filters.propertyTypes?.length) {
    const resoSubTypes = filters.propertyTypes.map(mapToResoSubType)
    const clause = resoSubTypes.map(t => `PropertySubType eq '${t}'`).join(' or ')
    parts.push(`(${clause})`)
  }

  const loc = filters.location
  if (loc?.type === 'city' && loc.value) {
    parts.push(`City eq '${loc.value.replace(/'/g, "''")}'`)
  }
  if (loc?.type === 'neighbourhood' && loc.value) {
    parts.push(`(contains(SubdivisionName,'${loc.value.replace(/'/g, "''")}') or contains(CommunityName,'${loc.value.replace(/'/g, "''")}'))`)
  }

  const bbox = filters.bbox ?? loc?.bbox
  if (bbox && loc?.type === 'bbox') {
    parts.push(`Latitude ge ${bbox.south} and Latitude le ${bbox.north}`)
    parts.push(`Longitude ge ${bbox.west} and Longitude le ${bbox.east}`)
  }

  if (loc?.type === 'radius' && loc.center && loc.radiusKm) {
    // Approximate bounding box for radius (RESO geo functions vary by provider)
    const deg = loc.radiusKm / 111
    const { latitude: lat, longitude: lng } = loc.center
    parts.push(`Latitude ge ${lat - deg} and Latitude le ${lat + deg}`)
    parts.push(`Longitude ge ${lng - deg} and Longitude le ${lng + deg}`)
  }

  return parts.join(' and ')
}

function mapToResoSubType(t: PropertyType): string {
  switch (t) {
    case 'detached':      return 'Single Family Residence'
    case 'semi-detached': return 'Semi-Detached'
    case 'townhouse':     return 'Townhouse'
    case 'condo':         return 'Condominium'
    case 'multiplex':     return 'Multiplex'
    case 'vacant_land':   return 'Unimproved Land'
    case 'commercial':    return 'Commercial'
    default:              return 'Single Family Residence'
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
        $expand: 'Media($select=MediaURL,Order)',
        $select: [
          'ListingKey','ListingId','StandardStatus','TransactionType',
          'ListPrice','PropertyType','PropertySubType',
          'BedroomsTotal','BathroomsTotalInteger','ParkingTotal',
          'LivingArea','LotSizeArea','LotSizeUnits','YearBuilt',
          'AssociationFee','TaxAnnualAmount',
          'UnparsedAddress','City','StateOrProvince','PostalCode',
          'SubdivisionName','CommunityName','Latitude','Longitude',
          'PublicRemarks','ListingContractDate','ModificationTimestamp',
          'VirtualTourURLUnbranded',
        ].join(','),
        $orderby: 'ModificationTimestamp desc',
      }),
      reso<{ '@odata.count': number }>('Property/$count', { $filter }),
    ])

    const total = countData['@odata.count'] ?? data.value.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties = data.value.map((r: any) => toSummary(normalize(r)))

    return { properties, total, page, totalPages: Math.ceil(total / limit), appliedFilters: filters }
  }

  async getListing(id: string): Promise<Property | null> {
    try {
      const data = await reso<{ value: unknown[] }>('Property', {
        $filter:  `ListingKey eq '${id}' or ListingId eq '${id}'`,
        $expand:  'Media($select=MediaURL,Order)',
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
      $expand:  'Media($select=MediaURL,Order)',
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
