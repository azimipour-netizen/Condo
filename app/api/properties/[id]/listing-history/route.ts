import { NextRequest, NextResponse } from 'next/server'
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

function eventLabel(status: string): string {
  switch ((status ?? '').toLowerCase()) {
    case 'active':     return 'For Sale'
    case 'closed':     return 'Sold'
    case 'sold':       return 'Sold'
    case 'expired':    return 'Expired'
    case 'terminated': return 'Terminated'
    case 'cancelled':  return 'Terminated'
    case 'suspended':  return 'Suspended'
    default:           return status
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rl = ratelimit(`listing-history:${getIP(req)}`, 30, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const { id } = await params

  try {
    // Fetch the current listing to get its address
    const current = await reso<{ value: unknown[] }>('Property', {
      $filter:  `ListingKey eq '${id}'`,
      $select:  'ListingKey,StreetNumber,StreetName,PostalCode,ListPrice,StandardStatus,OriginalEntryTimestamp,ModificationTimestamp,CloseDate',
      $top:     '1',
    }, !!VOW_TOKEN)

    if (!current.value.length) return NextResponse.json([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = current.value[0] as any
    const streetNumber = c.StreetNumber
    const streetName   = c.StreetName
    const postalCode   = c.PostalCode

    if (!postalCode && !streetNumber) {
      // Fallback: just return the current listing
      return NextResponse.json([{
        listingKey: c.ListingKey,
        listPrice:  Number(c.ListPrice ?? 0),
        status:     eventLabel(c.StandardStatus),
        dateStart:  c.OriginalEntryTimestamp ?? null,
        dateEnd:    c.CloseDate ?? null,
      }])
    }

    // Build address filter — match same street+postal across all statuses
    const addressParts: string[] = []
    if (postalCode) addressParts.push(`PostalCode eq '${postalCode.replace(/'/g, "''")}'`)
    if (streetNumber) addressParts.push(`StreetNumber eq '${String(streetNumber).replace(/'/g, "''")}'`)
    if (streetName) addressParts.push(`contains(StreetName,'${String(streetName).replace(/'/g, "''").slice(0, 20)}')`)

    const $filter = addressParts.join(' and ')

    // VOW token sees all statuses; IDX only sees Active
    const useVow = !!VOW_TOKEN
    const history = await reso<{ value: unknown[] }>('Property', {
      $filter,
      $select:  'ListingKey,ListPrice,StandardStatus,OriginalEntryTimestamp,ModificationTimestamp,CloseDate',
      $orderby: 'OriginalEntryTimestamp desc',
      $top:     '20',
    }, useVow)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = history.value.map((r: any) => ({
      listingKey: r.ListingKey,
      listPrice:  Number(r.ListPrice ?? 0),
      status:     eventLabel(r.StandardStatus),
      dateStart:  r.OriginalEntryTimestamp ?? null,
      dateEnd:    r.CloseDate ?? r.ModificationTimestamp ?? null,
    }))

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}
