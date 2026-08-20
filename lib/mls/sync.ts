import { db } from '@/lib/db'
import { getMLSAdapter } from '@/lib/mls/adapter'
import type { PropertySummary } from '@/types/property'

function toDbType(t: string): string {
  return t.replace('-', '_') // semi-detached → semi_detached
}

function propertyToDb(p: PropertySummary) {
  return {
    providerId: 'proptx',
    listingId:  p.id,
    status:     p.status as string,
    price:      p.price,
    propertyType:   toDbType(p.propertyType) as string,
    bedrooms:       p.bedrooms,
    bathroomsTotal: p.bathroomsTotal,
    parkingSpaces:  p.parkingSpaces,
    sqft:           p.sqft ?? null,
    lotSize:        p.lotSize ?? null,
    yearBuilt:      p.yearBuilt ?? null,
    maintenanceFee: p.maintenanceFee ?? null,
    taxes:          p.taxes ?? null,
    transactionType: p.transactionType,
    title:       p.title,
    description: p.description ?? '',
    features:    p.features ?? [],
    latitude:    p.location.latitude,
    longitude:   p.location.longitude,
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
  for (const p of properties) {
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
  }
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
