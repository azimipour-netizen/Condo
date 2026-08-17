import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)
const TOKEN = env.MLS_IDX_TOKEN
const API = 'https://query.ampre.ca/odata'

async function count(filter) {
  const qs = `$filter=${filter}&$top=1&$select=ListingKey`
  const url = `${API}/Property?${qs}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' }
  })
  if (!res.ok) return `ERROR ${res.status}`
  const d = await res.json()
  return d.value?.length ? `${d.value.length}+ results` : '0 results'
}

const tests = [
  ["Condo in Toronto", "StandardStatus eq 'Active' and PropertyType eq 'Residential Condo & Other' and contains(City,'Toronto')"],
  ["Condo Apartment subtype", "StandardStatus eq 'Active' and PropertySubType eq 'Condo Apartment'"],
  ["Detached", "StandardStatus eq 'Active' and PropertySubType eq 'Detached'"],
  ["Detached in Richmond Hill", "StandardStatus eq 'Active' and PropertySubType eq 'Detached' and City eq 'Richmond Hill'"],
  ["City contains Toronto", "StandardStatus eq 'Active' and contains(City,'Toronto')"],
  ["City eq Toronto (wrong)", "StandardStatus eq 'Active' and City eq 'Toronto'"],
  ["4 beds in Richmond Hill", "StandardStatus eq 'Active' and BedroomsTotal ge 4 and City eq 'Richmond Hill'"],
  ["Neighbourhood Waterfront", "StandardStatus eq 'Active' and contains(CityRegion,'Waterfront')"],
  ["Neighbourhood The Beaches", "StandardStatus eq 'Active' and contains(CityRegion,'Beaches')"],
]

for (const [label, filter] of tests) {
  const r = await count(filter)
  console.log(`${r.padEnd(15)} ${label}`)
}
