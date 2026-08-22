import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { primeGeocodeCache } from '@/lib/geo/geocode'
import type { PropertySummary } from '@/types/property'

function toDbType(t: string): string {
  return t.replace('-', '_') // semi-detached → semi_detached
}

function safeNum(v: unknown, max: number): number {
  const n = Number(v)
  if (!isFinite(n) || n < 0) return 0
  return Math.min(n, max)
}

function safeLatLng(v: unknown, max: number): number | null {
  const n = Number(v)
  if (!isFinite(n)) return null
  if (Math.abs(n) > max) return null
  return n
}

function propertyToDb(p: PropertySummary) {
  return {
    providerId: 'proptx',
    listingId:  p.id,
    status:     p.status as string,
    price:      safeNum(p.price, 9_999_999_999),
    propertyType:   toDbType(p.propertyType) as string,
    bedrooms:       safeNum(p.bedrooms, 99),
    bathroomsTotal: safeNum(p.bathroomsTotal, 99.9),
    parkingSpaces:  safeNum(p.parkingSpaces, 999),
    sqft:           p.sqft != null ? safeNum(p.sqft, 2_147_483_647) : null,
    lotSize:        p.lotSize ?? null,
    yearBuilt:      p.yearBuilt ?? null,
    maintenanceFee: p.maintenanceFee != null ? safeNum(p.maintenanceFee, 99_999_999) : null,
    taxes:          p.taxes != null ? safeNum(p.taxes, 99_999_999) : null,
    transactionType: p.transactionType,
    title:       p.title,
    description: p.description ?? '',
    features:    p.features ?? [],
    latitude:    p.location.latitude  != null ? safeLatLng(p.location.latitude,  90)  : null,
    longitude:   p.location.longitude != null ? safeLatLng(p.location.longitude, 180) : null,
    displayMode: 'approximate' as string,
    address:      p.location.address ?? null,
    neighbourhood: p.location.neighbourhood ?? null,
    city:     p.location.city ?? 'Toronto',
    province: p.location.province ?? 'ON',
    postalCode: p.location.postalCode ?? null,
    listedAt:  p.listedAt ? new Date(p.listedAt) : new Date(),
    syncedAt:  new Date(),
  }
}

// pg's default pool holds 10 connections; staying under it keeps every worker
// writing instead of queueing for a socket.
const UPSERT_CONCURRENCY = 6

async function upsertOne(p: PropertySummary, existingThumb: string | undefined) {
  const data = propertyToDb(p)
  let id: string

  try {
    const row = await (db as any).property.upsert({
      where:  { listingId: p.id },
      create: data,
      update: data,
      select: { id: true },
    })
    id = row.id
  } catch (err) {
    // Concurrent workers can both miss on the same listingId and race to insert.
    // The loser sees a unique-constraint error; the row exists by then, so update.
    if (!String(err).includes('P2002')) throw err
    const row = await (db as any).property.update({
      where:  { listingId: p.id },
      data,
      select: { id: true },
    })
    id = row.id
  }

  // Only touch PropertyImage when the thumbnail actually changed — the delete+create
  // pair was costing two extra Neon round trips per listing on every single run.
  if (p.thumbnail && existingThumb !== p.thumbnail) {
    await (db as any).propertyImage.deleteMany({ where: { propertyId: id, order: 0 } })
    await (db as any).propertyImage.create({
      data: { propertyId: id, url: p.thumbnail, order: 0 },
    })
  }
}

async function upsertBatch(properties: PropertySummary[]) {
  let skipped = 0
  let reported = false
  const queue = [...properties]

  // One read for the whole page instead of a nested relation select per row.
  const thumbs = new Map<string, string>()
  try {
    const rows = await (db as any).property.findMany({
      where:  { listingId: { in: properties.map(p => p.id) } },
      select: { listingId: true, images: { where: { order: 0 }, select: { url: true }, take: 1 } },
    })
    for (const r of rows) {
      if (r.images[0]?.url) thumbs.set(r.listingId, r.images[0].url)
    }
  } catch (err) {
    console.warn(`[sync] thumbnail prefetch failed, will rewrite images: ${String(err).slice(0, 120)}`)
  }

  // Neon round trips dominate sync time; running them sequentially left the
  // connection idle between each one. Fan out to a bounded worker pool instead.
  async function worker() {
    while (queue.length > 0) {
      const p = queue.shift()
      if (!p) break
      try {
        await upsertOne(p, thumbs.get(p.id))
      } catch (err) {
        skipped++
        // Print one full error per batch — the truncated form hides which field
        // Prisma actually rejected, which is the only useful part.
        if (!reported) {
          reported = true
          console.warn(`[sync] FIRST FAILURE ${p.id}:\n${String(err).slice(0, 1500)}`)
          console.warn(`[sync] payload: ${JSON.stringify(propertyToDb(p)).slice(0, 800)}`)
        } else {
          console.warn(`[sync] skip ${p.id}`)
        }
      }
    }
  }

  await Promise.all(Array.from({ length: UPSERT_CONCURRENCY }, worker))
  if (skipped > 0) console.warn(`[sync] skipped ${skipped} bad records this batch`)
}

const CHECKPOINT      = resolve(process.cwd(), '.sync-checkpoint.json')
const SOLD_CHECKPOINT = resolve(process.cwd(), '.sync-sold-checkpoint.json')

function readCheckpoint(file = CHECKPOINT): { skip: number; total: number } {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8'))
    if (typeof raw.skip === 'number' && typeof raw.total === 'number') return raw
  } catch { /* no checkpoint yet — start from zero */ }
  return { skip: 0, total: 0 }
}

function writeCheckpoint(skip: number, total: number, file = CHECKPOINT) {
  try {
    writeFileSync(file, JSON.stringify({ skip, total, at: new Date().toISOString() }))
  } catch (err) {
    console.warn(`[sync] checkpoint write failed: ${err}`)
  }
}

export async function syncAll(log: (msg: string) => void = console.log): Promise<number> {
  const adapter = getMLSAdapter() as any
  const PAGE_SIZE = 100

  // Resume from the last completed page so a crash costs one page, not the whole run.
  const cp = readCheckpoint()
  let skip  = cp.skip
  let total = cp.total
  if (skip > 0) log(`[sync] resuming at offset ${skip} (${total} already synced)`)

  // Reuse coordinates already resolved in earlier runs instead of re-geocoding them.
  const known = await (db as any).property.findMany({
    where:  { postalCode: { not: null }, latitude: { not: null } },
    select: { postalCode: true, latitude: true, longitude: true },
    distinct: ['postalCode'],
  })
  log(`[sync] geocode cache primed with ${primeGeocodeCache(known)} postal codes`)

  const job = await (db as any).syncJob.create({
    data: { provider: 'proptx', status: 'running' },
  })

  try {
    while (true) {
      log(`[sync] offset ${skip}…`)
      const properties = await adapter.getSyncPage(skip, PAGE_SIZE)
      if (properties.length === 0) break

      await upsertBatch(properties)
      total += properties.length
      skip  += PAGE_SIZE
      writeCheckpoint(skip, total)
      log(`[sync] upserted ${total} so far`)

      if (properties.length < PAGE_SIZE) break
    }

    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'completed', recordsSynced: total, completedAt: new Date() },
    })
    // Full pass complete — clear the checkpoint so the next full run starts fresh.
    try { unlinkSync(CHECKPOINT) } catch { /* already gone */ }
    log(`[sync] done — ${total} listings`)
  } catch (err) {
    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: String(err), completedAt: new Date() },
    })
    log(`[sync] failed at offset ${skip} — checkpoint saved, rerun to resume`)
    throw err
  }

  return total
}

/**
 * Pull closed SALE listings from the VOW feed for AVM comparables.
 * Sold prices are VOW-restricted — gate their display behind login.
 */
export async function syncSold(
  since: Date,
  log: (msg: string) => void = console.log,
): Promise<number> {
  const adapter = getMLSAdapter() as any
  if (typeof adapter.getSoldPage !== 'function') {
    throw new Error(`adapter "${adapter.name}" has no getSoldPage — sold sync needs the PropTx VOW feed`)
  }
  const PAGE_SIZE = 100

  const cp = readCheckpoint(SOLD_CHECKPOINT)
  let skip  = cp.skip
  let total = cp.total
  if (skip > 0) log(`[sync:sold] resuming at offset ${skip} (${total} already synced)`)

  const known = await (db as any).property.findMany({
    where:  { postalCode: { not: null }, latitude: { not: null } },
    select: { postalCode: true, latitude: true, longitude: true },
    distinct: ['postalCode'],
  })
  log(`[sync:sold] geocode cache primed with ${primeGeocodeCache(known)} postal codes`)

  const job = await (db as any).syncJob.create({
    data: { provider: 'proptx-vow', status: 'running' },
  })

  try {
    while (true) {
      log(`[sync:sold] offset ${skip}…`)
      const sold: Array<{ summary: PropertySummary; soldPrice: number | null; soldDate: Date | null }> =
        await adapter.getSoldPage(skip, PAGE_SIZE, since)
      if (sold.length === 0) break

      await upsertSoldBatch(sold)
      total += sold.length
      skip  += PAGE_SIZE
      writeCheckpoint(skip, total, SOLD_CHECKPOINT)
      log(`[sync:sold] upserted ${total} so far`)

      if (sold.length < PAGE_SIZE) break
    }

    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'completed', recordsSynced: total, completedAt: new Date() },
    })
    try { unlinkSync(SOLD_CHECKPOINT) } catch { /* already gone */ }
    log(`[sync:sold] done — ${total} sold listings`)
  } catch (err) {
    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: String(err), completedAt: new Date() },
    })
    log(`[sync:sold] failed at offset ${skip} — checkpoint saved, rerun to resume`)
    throw err
  }

  return total
}

async function upsertSoldBatch(
  items: Array<{ summary: PropertySummary; soldPrice: number | null; soldDate: Date | null }>,
) {
  let skipped = 0
  let reported = false
  const queue = [...items]

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift()
      if (!item) break
      const { summary, soldPrice, soldDate } = item
      const data = {
        ...propertyToDb(summary),
        status:    'sold' as string,
        soldPrice: soldPrice != null ? safeNum(soldPrice, 9_999_999_999) : null,
        soldDate,
      }
      try {
        await (db as any).property.upsert({
          where:  { listingId: summary.id },
          create: data,
          update: data,
          select: { id: true },
        })
      } catch (err) {
        skipped++
        if (!reported) {
          reported = true
          console.warn(`[sync:sold] FIRST FAILURE ${summary.id}:\n${String(err).slice(0, 1200)}`)
        }
      }
    }
  }

  await Promise.all(Array.from({ length: UPSERT_CONCURRENCY }, worker))
  if (skipped > 0) console.warn(`[sync:sold] skipped ${skipped} bad records this batch`)
}

export async function syncIncremental(
  since: Date,
  log: (msg: string) => void = console.log,
): Promise<number> {
  const adapter = getMLSAdapter()
  const listings = await (adapter as any).getUpdatedListings(since)

  const job = await (db as any).syncJob.create({
    data: { provider: 'proptx', status: 'running' },
  })

  try {
    await upsertBatch(listings.map((p: any) => ({
      ...p,
      thumbnail: p.images?.[0]?.url ?? null,
      location: {
        ...p.location,
        province: p.location?.province ?? 'ON',
      },
    })))

    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'completed', recordsSynced: listings.length, completedAt: new Date() },
    })
    log(`[sync:incremental] ${listings.length} listings updated`)
  } catch (err) {
    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: String(err), completedAt: new Date() },
    })
    throw err
  }

  return listings.length
}
