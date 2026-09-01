// Env must be loaded before lib/db is evaluated. Static imports hoist above
// this call, so the modules are pulled in dynamically below instead.
process.loadEnvFile('.env.local')

const { parseQuery } = await import('../lib/search/parse-query')
const { validateSearchFilters } = await import('../lib/search/validators')
const { searchListingsDb } = await import('../lib/search/db-search')
const { describeResults } = await import('../lib/search/describe-results')

/**
 * Exercises the no-LLM path against the real database: parse -> validate ->
 * query -> reply text. Verifies the returned listings actually satisfy the
 * query, which is the thing that would silently break.
 */

const QUERIES = [
  'i need condo for rent north york',
  'looking to rent a condo, 2 bedroom, North York',
  'looking to buy detached house , 4 bedroom in North York',
  '2 bed 2 bath condo mississauga with parking',
  'townhouse between 700k and 1.2m in markham',
  'condos under $650,000',
]

async function main() {
  for (const q of QUERIES) {
    const parsed = parseQuery(q)
    if (parsed.confidence !== 'high') {
      console.log(`\n"${q}"\n  -> falls back to Claude (${parsed.unresolved.join(' ')})`)
      continue
    }
    const filters = validateSearchFilters(parsed.filters)
    const t0 = Date.now()
    const result = await searchListingsDb(filters, 1, 20)
    const ms = Date.now() - t0

    console.log(`\n"${q}"  [${ms}ms, 0 tokens]`)
    console.log(`  filters: ${JSON.stringify(filters)}`)
    console.log(`  total:   ${result.total}`)

    // Verify the results honour the filters, rather than trusting the count.
    const bad: string[] = []
    for (const p of result.properties) {
      if (filters.transactionType && p.transactionType !== filters.transactionType) {
        bad.push(`${p.id} transactionType=${p.transactionType}`)
      }
      if (filters.bedroomsMin != null && p.bedrooms < filters.bedroomsMin) {
        bad.push(`${p.id} bedrooms=${p.bedrooms}`)
      }
      if (filters.priceMax != null && p.price > filters.priceMax) {
        bad.push(`${p.id} price=${p.price}`)
      }
      if (filters.priceMin != null && p.price < filters.priceMin) {
        bad.push(`${p.id} price=${p.price}`)
      }
      if (filters.propertyTypes?.length && !filters.propertyTypes.includes(p.propertyType)) {
        bad.push(`${p.id} type=${p.propertyType}`)
      }
      if (filters.location?.cityValues?.length && !filters.location.cityValues.includes(p.location.city)) {
        bad.push(`${p.id} city=${p.location.city}`)
      }
    }
    console.log(bad.length ? `  MISMATCHES: ${bad.slice(0, 5).join(', ')}` : '  all returned listings satisfy the filters')
    const cities = [...new Set(result.properties.map(p => p.location.city))]
    if (cities.length) console.log(`  cities:  ${cities.join(', ')}`)
    console.log(`  reply:   ${describeResults(result, filters)}`)
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
