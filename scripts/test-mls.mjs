/**
 * Test PropTx / TRREB RESO API connection
 * Run: node scripts/test-mls.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local manually
const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env.local')
const env = {}
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  env[key] = val
}

const API_URL   = (env.MLS_API_URL ?? '').replace(/\/$/, '')
const IDX_TOKEN = env.MLS_IDX_TOKEN
const VOW_TOKEN = env.MLS_VOW_TOKEN

console.log('\n── PropTx MLS Connection Test ──────────────────────')
console.log('API URL   :', API_URL)
console.log('IDX Token :', IDX_TOKEN ? IDX_TOKEN.slice(0, 6) + '...' : '(MISSING)')
console.log('VOW Token :', VOW_TOKEN ? VOW_TOKEN.slice(0, 6) + '...' : '(MISSING)')
console.log('────────────────────────────────────────────────────\n')

if (!API_URL || !IDX_TOKEN) {
  console.error('ERROR: Missing MLS_API_URL or MLS_IDX_TOKEN in .env.local')
  process.exit(1)
}

const token = IDX_TOKEN
console.log('1. Using static IDX Bearer token (no OAuth needed)\n')

// Step 2: Fetch 3 active listings
console.log('2. Querying Property feed (top 3 active listings)...')
try {
  const url = `${API_URL}/Property?$filter=StandardStatus eq 'Active'&$top=3&$select=ListingKey,ListingId,ListPrice,BedroomsTotal,City,PropertySubType,StandardStatus,UnparsedAddress`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
    },
  })
  const body = await res.json()
  if (!res.ok) {
    console.error('   FAILED:', res.status, JSON.stringify(body, null, 2))
    process.exit(1)
  }
  const listings = body.value ?? []
  console.log(`   OK — received ${listings.length} listings\n`)
  for (const l of listings) {
    console.log(`   ${l.ListingKey ?? l.ListingId} | $${l.ListPrice?.toLocaleString()} | ${l.BedroomsTotal}BR | ${l.PropertySubType} | ${l.City}`)
    if (l.UnparsedAddress) console.log(`   ${l.UnparsedAddress}`)
    console.log()
  }
} catch (err) {
  console.error('   FAILED (network):', err.message)
  process.exit(1)
}

// Step 3: Count total active listings
console.log('3. Counting total active listings...')
try {
  const url = `${API_URL}/Property/$count?$filter=StandardStatus eq 'Active'`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/plain',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
    },
  })
  if (!res.ok) {
    console.warn('   WARN: $count not supported or returned', res.status)
  } else {
    const count = await res.text()
    console.log(`   OK — ${parseInt(count).toLocaleString()} active listings total\n`)
  }
} catch (err) {
  console.warn('   WARN:', err.message)
}

console.log('── All tests passed ─────────────────────────────────\n')
