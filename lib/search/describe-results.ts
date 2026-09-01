import type { SearchFilters, SearchResult } from '@/types/search'

/**
 * Writes the reply text for a search the deterministic parser handled, so the
 * fast path doesn't need a model call just to produce a sentence. Kept plain
 * and factual: it states what was searched and what came back, and never
 * characterises listings (that would require actually reading them).
 */

function money(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

const TYPE_LABELS: Record<string, [string, string]> = {
  condo: ['condo', 'condos'],
  detached: ['detached home', 'detached homes'],
  'semi-detached': ['semi-detached home', 'semi-detached homes'],
  townhouse: ['townhouse', 'townhouses'],
  multiplex: ['multiplex', 'multiplexes'],
  vacant_land: ['lot', 'lots'],
  commercial: ['commercial property', 'commercial properties'],
}

/** "3+ bed condos for lease in North York under $3K/mo" */
export function describeSearch(f: SearchFilters, plural = true): string {
  const lease = f.transactionType === 'lease'
  const parts: string[] = []

  if (f.bedroomsMin === 0 && f.bedroomsMax === 0) parts.push('studio')
  else if (f.bedroomsMin) parts.push(`${f.bedroomsMin}+ bed`)
  if (f.bathroomsMin) parts.push(`${f.bathroomsMin}+ bath`)

  const types = f.propertyTypes?.length
    ? f.propertyTypes
        .map(t => TYPE_LABELS[t]?.[plural ? 1 : 0] ?? t)
        .join(' / ')
    : plural ? 'listings' : 'listing'
  parts.push(types)

  parts.push(lease ? 'for lease' : 'for sale')

  const loc = f.location?.value
  if (loc) parts.push(`in ${loc}`)

  const suffix = lease ? '/mo' : ''
  if (f.priceMin && f.priceMax) parts.push(`between ${money(f.priceMin)}${suffix} and ${money(f.priceMax)}${suffix}`)
  else if (f.priceMax) parts.push(`under ${money(f.priceMax)}${suffix}`)
  else if (f.priceMin) parts.push(`over ${money(f.priceMin)}${suffix}`)

  if (f.sqftMin) parts.push(`over ${f.sqftMin.toLocaleString()} sq ft`)
  if (f.parkingMin) parts.push(`with ${f.parkingMin}+ parking`)
  else if (f.hasParking) parts.push('with parking')

  return parts.join(' ')
}

/**
 * One short line — the results panel next to the chat already renders every
 * returned listing as a card (photo, price, beds/baths, address), so this
 * deliberately does NOT enumerate them. Mirrors the "after a plain search"
 * rule in lib/ai/system-prompt.ts, which keeps the LLM path just as terse.
 */
export function describeResults(result: SearchResult, filters: SearchFilters): string {
  const { total } = result
  const desc = describeSearch(filters)

  if (total === 0) {
    return `No active ${desc} right now. Try widening the price range or a nearby area, or tell me what to change.`
  }

  return `Found ${total.toLocaleString()} ${desc} — check these out and let me know if you'd like any changes.`
}
