import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
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

async function upsertBatch(properties: PropertySummary[]) {
  let skipped = 0
  for (const p of properties) {
    try {
      const dbProp = await (db as any).property.upsert({
        where:  { listingId: p.id },
        create: propertyToDb(p),
        update: propertyToDb(p),
        select: { id: true },
      })

      if (p.thumbnail) {
        await (db as any).propertyImage.deleteMany({ where: { propertyId: dbProp.id, order: 0 } })
        await (db as any).propertyImage.create({
          data: { propertyId: dbProp.id, url: p.thumbnail, order: 0 },
        })
      }
    } catch (err) {
      skipped++
      console.warn(`[sync] skip ${p.id}: ${String(err).slice(0, 120)}`)
    }
  }
  if (skipped > 0) console.warn(`[sync] skipped ${skipped} bad records this batch`)
}

export async function syncAll(log: (msg: string) => void = console.log): Promise<number> {
  const adapter = getMLSAdapter()
  const PAGE_SIZE = 100
  let page = 1
  let total = 0

  const job = await (db as any).syncJob.create({
    data: { provider: 'proptx', status: 'running' },
  })

  try {
    while (true) {
      log(`[sync] page ${page}…`)
      const result = await adapter.searchListings({}, page, PAGE_SIZE)
      if (result.properties.length === 0) break

      await upsertBatch(result.properties)
      total += result.properties.length
      log(`[sync] upserted ${total} so far`)

      if (result.properties.length < PAGE_SIZE) break
      page++
    }

    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'completed', recordsSynced: total, completedAt: new Date() },
    })
    log(`[sync] done — ${total} listings`)
  } catch (err) {
    await (db as any).syncJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: String(err), completedAt: new Date() },
    })
    throw err
  }

  return total
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
