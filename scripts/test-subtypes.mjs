// Quick test: discover actual PropertySubType values in AMPRE
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)

const TOKEN = env.MLS_IDX_TOKEN
const API = 'https://query.ampre.ca/odata'

async function fetch2(path, params = {}) {
  const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  const url = `${API}/${path}${qs ? '?' + qs : ''}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' }
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

// Get 20 listings, inspect PropertyType + PropertySubType
const data = await fetch2('Property', {
  $top: '20',
  $select: 'ListingKey,PropertyType,PropertySubType,City,CityRegion,StandardStatus',
  $filter: "StandardStatus eq 'Active'",
  $orderby: 'ModificationTimestamp desc',
})

const subtypes = new Set()
const cities = new Set()
const regions = new Set()

for (const r of data.value) {
  subtypes.add(`${r.PropertyType} | ${r.PropertySubType}`)
  cities.add(r.City)
  if (r.CityRegion) regions.add(r.CityRegion)
}

console.log('\n=== PropertyType | PropertySubType ===')
for (const s of [...subtypes].sort()) console.log(' ', s)

console.log('\n=== City values ===')
for (const c of [...cities].sort()) console.log(' ', c)

console.log('\n=== CityRegion samples ===')
for (const r of [...regions].sort().slice(0, 20)) console.log(' ', r)
