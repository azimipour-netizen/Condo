import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const API_URL   = (process.env.MLS_API_URL ?? 'https://query.ampre.ca/odata').replace(/\/$/, '')
const IDX_TOKEN = process.env.MLS_IDX_TOKEN ?? ''
const VOW_TOKEN = process.env.MLS_VOW_TOKEN ?? ''

async function reso<T>(path: string, params: Record<string, string>, useVow = false): Promise<T> {
  const token = useVow && VOW_TOKEN ? VOW_TOKEN : IDX_TOKEN
  const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  const res = await fetch(`${API_URL}/${path}?${qs}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
    },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`AMPRE ${res.status}`)
  return res.json() as Promise<T>
}

function isLease(transactionType: string): boolean {
  return (transactionType ?? '').toLowerCase().includes('lease')
}

// A lease listing is never "For Sale"/"Sold" — labelling one that way (the old
// behaviour) put a $2,700/mo rental in the table as if it were a sale price.
function eventLabel(status: string, transactionType: string): string {
  const lease = isLease(transactionType)
  switch ((status ?? '').toLowerCase()) {
    case 'active':     return lease ? 'For Rent' : 'For Sale'
    case 'closed':     return lease ? 'Leased'   : 'Sold'
    case 'sold':       return lease ? 'Leased'   : 'Sold'
    case 'expired':    return 'Expired'
    case 'terminated': return 'Terminated'
    case 'cancelled':  return 'Terminated'
    case 'suspended':  return 'Suspended'
    default:           return status
  }
}

/**
 * AMPRE's CloseDate is unreliable — records carry values like "3549-10-01"
 * (same trap getSoldPage() guards against). Anything outside a plausible
 * window is dropped rather than rendered as a real date. A close date modestly
 * in the future is legitimate: a firm sale completes on a scheduled date.
 */
function safeDate(v: unknown): string | null {
  if (!v) return null
  const d = new Date(String(v))
  if (isNaN(d.getTime())) return null
  const year = d.getUTCFullYear()
  const maxYear = new Date().getUTCFullYear() + 2
  if (year < 1990 || year > maxYear) return null
  return d.toISOString()
}

function odataStr(v: unknown): string {
  return String(v).replace(/'/g, "''")
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`listing-history:${getIP(req)}`, 30, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params

  // Sold/expired/terminated history comes from the VOW feed, which TRREB rules
  // restrict to registered users. Anonymous visitors get the IDX view only.
  const session = await auth()
  const useVow  = !!VOW_TOKEN && !!session?.user?.id

  try {
    const SELECT = 'ListingKey,StreetNumber,StreetName,City,UnitNumber,ApartmentNumber,PostalCode,ListPrice,TransactionType,StandardStatus,OriginalEntryTimestamp,ModificationTimestamp,CloseDate'

    // Fetch the current listing to get its address
    const current = await reso<{ value: unknown[] }>('Property', {
      $filter:  `ListingKey eq '${odataStr(id)}'`,
      $select:  SELECT,
      $top:     '1',
    }, useVow)

    if (!current.value.length) return NextResponse.json([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = current.value[0] as any
    const streetNumber = c.StreetNumber
    const streetName   = c.StreetName
    const city         = c.City
    // AMPRE populates one or the other depending on the board's data entry.
    const unit         = c.UnitNumber ?? c.ApartmentNumber ?? null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toRow = (r: any) => ({
      listingKey:      r.ListingKey,
      listPrice:       Number(r.ListPrice ?? 0),
      transactionType: isLease(r.TransactionType) ? 'lease' : 'sale',
      status:          eventLabel(r.StandardStatus, r.TransactionType),
      dateStart:       safeDate(r.OriginalEntryTimestamp),
      // An active listing hasn't ended. The old code fell back to
      // ModificationTimestamp, which rendered a bogus "Date End" on every
      // live listing.
      dateEnd:         (r.StandardStatus ?? '').toLowerCase() === 'active'
        ? null
        : safeDate(r.CloseDate) ?? safeDate(r.ModificationTimestamp),
    })

    if (!streetNumber || !streetName) {
      // Not enough address detail to match siblings — return this listing only.
      return NextResponse.json([toRow(c)])
    }

    // Match this UNIT's own history, not the whole building. Matching on
    // street + postal code alone pulled every other unit in the tower, which
    // is why a $499k condo's history listed $2,300 rentals from other suites.
    //
    // PostalCode is deliberately NOT part of the filter: a single building
    // reports several (159 Dundas St E carries both M5B 1E4 and M5B 0A9), so
    // constraining on it drops the unit's own earlier listings. City plus the
    // street pair is the stable identifier.
    const addressParts: string[] = [
      `StreetNumber eq '${odataStr(streetNumber)}'`,
      `contains(StreetName,'${odataStr(String(streetName).slice(0, 20))}')`,
    ]
    if (city) addressParts.push(`City eq '${odataStr(city)}'`)
    if (unit) {
      addressParts.push(`(UnitNumber eq '${odataStr(unit)}' or ApartmentNumber eq '${odataStr(unit)}')`)
    }

    const $filter = addressParts.join(' and ')

    // VOW token sees all statuses; IDX only sees Active
    const history = await reso<{ value: unknown[] }>('Property', {
      $filter,
      $select:  SELECT,
      $orderby: 'OriginalEntryTimestamp desc',
      $top:     '20',
    }, useVow)

    const rows = history.value.map(toRow)

    // A building-level match could still slip through for a freehold with no
    // unit number; guarantee the subject listing is present either way.
    if (!rows.some(r => r.listingKey === c.ListingKey)) rows.unshift(toRow(c))

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}
