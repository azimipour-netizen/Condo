import { parseQuery } from '../lib/search/parse-query'

/**
 * Two things must hold:
 *  1. Formulaic queries parse to the right filters at `high` confidence.
 *  2. Anything carrying meaning the parser cannot represent comes back `low`,
 *     so the AI route sends it to Claude instead of silently under-filtering.
 */

interface Case {
  q: string
  want: 'high' | 'low'
  /** Subset of filters that must match exactly (JSON-compared). */
  expect?: Record<string, unknown>
  why?: string
}

const CASES: Case[] = [
  // --- should be handled for free -----------------------------------------
  { q: 'i need condo for rent north york', want: 'high',
    expect: { transactionType: 'lease', propertyTypes: ['condo'] } },
  { q: 'looking to rent a condo, 2 bedroom, North York', want: 'high',
    expect: { transactionType: 'lease', bedroomsMin: 2, propertyTypes: ['condo'] } },
  // "Midtown" is not in TORONTO_NEIGHBOURHOODS and has no single Property.city
  // value, so the parser defers rather than guessing at district codes.
  { q: 'condo for rent , 3 bedroom , midtown toronto', want: 'low',
    why: 'unknown area name - deferring beats guessing the district codes' },
  { q: 'looking to buy detached house , 4 bedroom in North York', want: 'high',
    expect: { transactionType: 'sale', bedroomsMin: 4, propertyTypes: ['detached'] } },
  { q: 'detached under 900k scarborough', want: 'high',
    expect: { priceMax: 900000, propertyTypes: ['detached'] } },
  { q: '2 bed 2 bath condo mississauga with parking', want: 'high',
    expect: { bedroomsMin: 2, bathroomsMin: 2, hasParking: true, propertyTypes: ['condo'] } },
  { q: 'townhouse between 700k and 1.2m in markham', want: 'high',
    expect: { priceMin: 700000, priceMax: 1200000, propertyTypes: ['townhouse'] } },
  { q: 'semi detached vaughan', want: 'high',
    expect: { propertyTypes: ['semi-detached'] } },
  { q: 'studio apartment for lease', want: 'high',
    expect: { transactionType: 'lease', bedroomsMin: 0, bedroomsMax: 0, propertyTypes: ['condo'] } },
  { q: 'condos under $650,000', want: 'high',
    expect: { priceMax: 650000, propertyTypes: ['condo'] } },
  { q: '3br condo oakville over 1200 sqft', want: 'high',
    expect: { bedroomsMin: 3, sqftMin: 1200, propertyTypes: ['condo'] } },
  { q: 'show me homes in burlington', want: 'high' },

  // --- must fall through to Claude ----------------------------------------
  { q: 'looking for motivated sellers in toronto', want: 'low',
    why: 'free-text intent the parser cannot express' },
  { q: 'condo north york near a good school', want: 'low',
    why: 'unmatched qualifier must not be silently dropped' },
  { q: 'something walking distance to the subway', want: 'low' },
  { q: 'what is the average price in yorkville', want: 'low',
    why: 'a question, not a search' },
  { q: 'power of sale properties', want: 'low' },
  { q: 'compare these two listings for me', want: 'low' },
  { q: 'a place with a nice backyard for my dog', want: 'low' },
  { q: 'hello', want: 'low', why: 'nothing understood at all' },
]

let pass = 0
const failures: string[] = []

for (const c of CASES) {
  const r = parseQuery(c.q)
  const problems: string[] = []

  if (r.confidence !== c.want) {
    problems.push(`confidence ${r.confidence} (wanted ${c.want}); unresolved=[${r.unresolved.join(' ')}]`)
  }
  if (c.expect) {
    for (const [k, v] of Object.entries(c.expect)) {
      const got = (r.filters as Record<string, unknown>)[k]
      if (JSON.stringify(got) !== JSON.stringify(v)) {
        problems.push(`${k}: got ${JSON.stringify(got)}, wanted ${JSON.stringify(v)}`)
      }
    }
  }

  if (problems.length === 0) {
    pass++
    const loc = r.filters.location
    const locStr = loc ? ` @${loc.value}${loc.cityValues ? `(${loc.cityValues.length} codes)` : ''}` : ''
    console.log(`  ok   [${r.confidence.padEnd(4)}] ${c.q}${locStr}`)
  } else {
    failures.push(`  FAIL  ${c.q}\n          ${problems.join('\n          ')}`)
  }
}

console.log('')
if (failures.length) console.log(failures.join('\n'))
console.log(`\n${pass}/${CASES.length} passed`)

// Coverage estimate: share of the formulaic cases handled without an API call.
const free = CASES.filter(c => c.want === 'high').length
console.log(`${free} of ${CASES.length} sample queries would skip the LLM entirely`)

if (failures.length) process.exit(1)
