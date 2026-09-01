import type { SearchFilters } from '@/types/search'
import type { PropertyType } from '@/types/property'
import { GTA_CITIES } from '@/lib/seo/gta-cities'
import { TORONTO_NEIGHBOURHOODS } from '@/lib/seo/toronto-neighbourhoods'
import { TORONTO_COMMUNITIES } from '@/lib/search/toronto-communities'

/**
 * Deterministic natural-language to SearchFilters parser.
 *
 * Property searches are overwhelmingly formulaic ("2 bedroom condo for rent in
 * North York", "detached under 900k scarborough"), and resolving those with a
 * Claude call costs money on every single search while adding latency. This
 * parser handles the formulaic majority for free; the AI route falls back to
 * Claude whenever confidence is `low`.
 *
 * The safety property that makes that fallback trustworthy: every span this
 * parser understands is *consumed* out of the string, and anything left over
 * that isn't a stopword forces `low`. So "condo north york near a good school"
 * does NOT quietly become a plain North York condo search - the unmatched
 * "good school" sends the whole query to Claude, which is what should happen.
 * The parser only claims a query it can account for end to end.
 */

export interface ParsedQuery {
  filters: SearchFilters
  /** `high` means every token was accounted for - safe to skip the LLM. */
  confidence: 'high' | 'low'
  /** Human-readable list of what was understood (for logging/debugging). */
  matched: string[]
  /** Leftover meaningful words. Non-empty implies confidence is `low`. */
  unresolved: string[]
}

/**
 * Filler that carries no filter meaning. Anything here may be left over
 * without downgrading confidence. Deliberately conservative: a word only
 * belongs here if ignoring it cannot change which listings match.
 */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'i', 'im', 'me', 'my', 'we', 'us', 'you',
  'is', 'am', 'are', 'be', 'was', 'do', 'does', 'did',
  'looking', 'look', 'searching', 'search', 'seeking', 'seek', 'find', 'show',
  'want', 'wants', 'wanted', 'need', 'needs', 'needed', 'like', 'would', 'love',
  'get', 'please', 'hi', 'hello', 'hey', 'thanks', 'thank',
  'for', 'in', 'at', 'on', 'of', 'to', 'with', 'and', 'or', 'near', 'around',
  'some', 'any', 'something', 'anything', 'available', 'currently',
  'house', 'houses', 'home', 'homes', 'property', 'properties',
  'listing', 'listings', 'place', 'places', 'unit', 'units', 'options', 'area',
  'that', 'which', 'has', 'have', 'ideally', 'preferably', 'maybe',
])

/** Longest alternatives first so "semi detached" wins over "detached". */
const PROPERTY_TYPES: [RegExp, PropertyType][] = [
  [/\bsemi[-\s]?detached\b|\bsemis\b/g, 'semi-detached'],
  [/\btown\s?homes?\b|\btown\s?houses?\b/g, 'townhouse'],
  [/\bvacant\s+land\b|\bbuilding\s+lots?\b/g, 'vacant_land'],
  [/\bdetached\b/g, 'detached'],
  [/\bcondos?\b|\bapartments?\b|\bapts?\b/g, 'condo'],
  [/\bduplex(?:es)?\b|\btriplex(?:es)?\b|\bfourplex(?:es)?\b|\bmultiplex(?:es)?\b/g, 'multiplex'],
  [/\bcommercial\b|\bretail\s+space\b|\boffice\s+space\b/g, 'commercial'],
]

/** Money with an optional $ and k/m/million suffix. */
const MONEY = String.raw`\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|m|mil|million|thousand)?\b`

function toAmount(num: string, suffix?: string): number | null {
  const n = Number(num.replace(/,/g, ''))
  if (!isFinite(n)) return null
  const s = (suffix ?? '').toLowerCase()
  if (s === 'k' || s === 'thousand') return Math.round(n * 1_000)
  if (s === 'm' || s === 'mil' || s === 'million') return Math.round(n * 1_000_000)
  return Math.round(n)
}

/**
 * Guard against reading a bare count as a price ("under 3 bedrooms"). A number
 * is money only when it is marked as money - a $ sign, a k/m suffix, or a
 * magnitude no bedroom count would ever reach.
 */
function isPlausiblePrice(raw: string, amount: number): boolean {
  return /[$]/.test(raw) || /\d\s*(k|m|mil|million|thousand)\b/i.test(raw) || amount >= 1000
}

export function parseQuery(raw: string): ParsedQuery {
  const filters: SearchFilters = {}
  const matched: string[] = []

  // Work on a lowercase copy; each recognised span is blanked out so it can't
  // be matched twice and doesn't count as leftover.
  // Apostrophes are dropped (not turned into a space) before the general
  // punctuation strip below, so "L'Amoreaux" -> "lamoreaux", a single token -
  // not split into "l" + "amoreaux". Location terms are normalized the exact
  // same way (see stripApostrophes below) so a name like that still matches.
  let rest = ` ${raw.toLowerCase().replace(/['’]/g, '').replace(/[^\w$%.,+\-\s]/g, ' ')} `

  const consume = (re: RegExp, onMatch: (m: RegExpExecArray) => boolean | void) => {
    const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
    const spans: [number, number][] = []
    let m: RegExpExecArray | null
    while ((m = rx.exec(rest)) !== null) {
      if (onMatch(m) !== false) spans.push([m.index, m.index + m[0].length])
      if (m[0].length === 0) rx.lastIndex++
    }
    for (const [s, e] of spans.reverse()) {
      rest = rest.slice(0, s) + ' '.repeat(e - s) + rest.slice(e)
    }
  }

  // Transaction type. Checked first so "for rent" is never treated as filler.
  consume(/\b(?:for\s+)?(?:rent|rental|rentals|renting|lease|leasing|leased)\b/g, () => {
    filters.transactionType = 'lease'
    matched.push('for lease')
  })
  if (!filters.transactionType) {
    consume(/\b(?:for\s+)?sale\b|\bto\s+buy\b|\bbuy\b|\bbuying\b|\bpurchase\b/g, () => {
      filters.transactionType = 'sale'
      matched.push('for sale')
    })
  }

  // Size before price: "over 1200 sqft" would otherwise be swallowed by the
  // price-minimum rule below and silently become priceMin = 1200.
  consume(/\b(?:over|above|at\s+least|min(?:imum)?)?\s*(\d[\d,]*)\s*(?:sq\.?\s?ft|sqft|square\s+feet|sf)\b/g, m => {
    const n = Number(m[1].replace(/,/g, ''))
    if (!isFinite(n) || n < 100) return false
    filters.sqftMin = n
    matched.push(`${n}+ sqft`)
  })

  // Price. Ranges first - "between 400k and 600k" must not read as a lone min.
  consume(new RegExp(String.raw`\b(?:between\s+)?${MONEY}\s*(?:-|to|and)\s*${MONEY}`, 'g'), m => {
    const lo = toAmount(m[1], m[2])
    const hi = toAmount(m[3], m[4])
    if (lo == null || hi == null) return false
    if (!isPlausiblePrice(m[0], lo) || !isPlausiblePrice(m[0], hi)) return false
    if (lo > hi) return false
    filters.priceMin = lo
    filters.priceMax = hi
    matched.push(`price ${lo}-${hi}`)
  })

  if (filters.priceMax == null) {
    consume(new RegExp(String.raw`\b(?:under|below|less\s+than|up\s+to|max(?:imum)?|no\s+more\s+than|cheaper\s+than|within)\s+${MONEY}`, 'g'), m => {
      const v = toAmount(m[1], m[2])
      if (v == null || !isPlausiblePrice(m[0], v)) return false
      filters.priceMax = v
      matched.push(`price max ${v}`)
    })
  }
  if (filters.priceMin == null) {
    consume(new RegExp(String.raw`\b(?:over|above|more\s+than|at\s+least|min(?:imum)?|starting\s+(?:at|from)|from)\s+${MONEY}`, 'g'), m => {
      const v = toAmount(m[1], m[2])
      if (v == null || !isPlausiblePrice(m[0], v)) return false
      filters.priceMin = v
      matched.push(`price min ${v}`)
    })
  }

  // Bedrooms / bathrooms.
  consume(/\b(?:studio|bachelor)\b/g, () => {
    filters.bedroomsMin = 0
    filters.bedroomsMax = 0
    matched.push('studio')
  })
  consume(/\b(\d+)\s*\+?\s*(?:bed(?:room)?s?|bdrms?|br)\b/g, m => {
    const n = Number(m[1])
    if (!isFinite(n) || n > 20) return false
    filters.bedroomsMin = n
    matched.push(`${n}+ bed`)
  })
  consume(/\b(\d+(?:\.5)?)\s*\+?\s*(?:bath(?:room)?s?|ba)\b/g, m => {
    const n = Number(m[1])
    if (!isFinite(n) || n > 20) return false
    filters.bathroomsMin = n
    matched.push(`${n}+ bath`)
  })

  // Parking / size.
  consume(/\b(\d+)\s*(?:car\s+)?(?:parking|garage)\s*(?:spots?|spaces?)?\b/g, m => {
    const n = Number(m[1])
    if (!isFinite(n) || n > 20) return false
    filters.parkingMin = n
    matched.push(`${n}+ parking`)
  })
  if (filters.parkingMin == null) {
    consume(/\b(?:with\s+)?(?:parking|garage)\b/g, () => {
      filters.hasParking = true
      matched.push('parking')
    })
  }
  // Property type.
  const types = new Set<PropertyType>()
  for (const [re, type] of PROPERTY_TYPES) {
    consume(re, () => { types.add(type) })
  }
  if (types.size) {
    filters.propertyTypes = [...types]
    matched.push(`type ${[...types].join('/')}`)
  }

  // Location. Longest name first so "richmond hill" beats a stray "hill" and
  // "north york" is never shortened to "york".
  // Raw MLS/TRREB district codes (Toronto's C01-C15, E01-E11, W01-W10) are a
  // fixed public numbering standard, and Property.city stores them literally
  // ("Toronto C12") - unlike a borough name (North York, Scarborough...),
  // which has no single matching city value and would need real-world area
  // knowledge to map correctly, a bare code needs no guessing. Checked before
  // the name-based loop below so it always wins on an exact code match.
  if (!filters.location) {
    consume(/\b(?:toronto\s+)?(c(?:0[1-9]|1[0-5])|e(?:0[1-9]|1[01])|w(?:0[1-9]|10))\b/g, m => {
      const code = `Toronto ${m[1].toUpperCase()}`
      filters.location = { type: 'city', value: code, cityValues: [code] }
      matched.push(`location ${code}`)
    })
  }

  interface LocEntry { term: string; label: string; apply: () => void }
  const locations: LocEntry[] = []

  // Verified TRREB community names (Array.sort is stable, so pushing these
  // first gives them priority over an equal-length TORONTO_NEIGHBOURHOODS
  // term below - an exact district-code match beats a neighbourhood-contains
  // fallback wherever both would resolve the same place, e.g. "Annex").
  for (const c of TORONTO_COMMUNITIES) {
    locations.push({
      term: c.name.toLowerCase(),
      label: c.name,
      apply: () => {
        filters.location = { type: 'city', value: c.code, cityValues: [c.code] }
      },
    })
  }
  for (const c of GTA_CITIES) {
    locations.push({
      term: c.name.toLowerCase(),
      label: c.name,
      apply: () => {
        // Toronto's former boroughs have no literal Property.city value - the
        // feed splits them into district codes. Passing those through exactly
        // is what stops a North York search returning Mimico and Scarborough.
        filters.location = c.dbValues?.length
          ? { type: 'city', value: c.name, cityValues: c.dbValues }
          : { type: 'city', value: c.dbValue ?? c.name }
      },
    })
  }
  for (const n of TORONTO_NEIGHBOURHOODS) {
    locations.push({
      term: n.name.toLowerCase().replace(/^the\s+/, ''),
      label: n.name,
      apply: () => {
        filters.location = { type: 'neighbourhood', value: n.searchTerm ?? n.name }
      },
    })
  }
  locations.sort((a, b) => b.term.length - a.term.length)

  for (const loc of locations) {
    if (filters.location) break
    // Mirrors the apostrophe removal applied to `rest` above - without it, a
    // term like "l'amoreaux" could never match "lamoreaux" in the text.
    const escaped = loc.term.replace(/['’]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (!new RegExp(String.raw`\b${escaped}\b`).test(rest)) continue
    consume(new RegExp(String.raw`\b${escaped}\b`, 'g'), () => { /* consume span only */ })
    loc.apply()
    matched.push(`location ${loc.label}`)
  }

  // Confidence.
  const unresolved = rest
    .split(/\s+/)
    .map(w => w.replace(/^[^\w$]+|[^\w$]+$/g, ''))
    .filter(Boolean)
    .filter(w => !STOPWORDS.has(w))

  // Nothing understood at all is a fallback case, not a "match everything" one.
  const understoodSomething = Object.keys(filters).length > 0
  const confidence: 'high' | 'low' =
    unresolved.length === 0 && understoodSomething ? 'high' : 'low'

  return { filters, confidence, matched, unresolved }
}
