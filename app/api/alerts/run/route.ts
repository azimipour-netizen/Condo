import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, emailPropertyAlert } from '@/lib/email'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-alert-secret')
  if (!process.env.ALERT_SECRET || secret !== process.env.ALERT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searches = await (db as any).savedSearch.findMany({
    where: { alertsEnabled: true },
    include: { user: { select: { email: true, name: true } } },
  })

  let sent = 0

  for (const search of searches) {
    const since = search.lastAlertedAt ?? search.createdAt
    const filters = search.filters as Record<string, unknown>

    const where: Record<string, unknown> = {
      status: 'active',
      listedAt: { gt: since },
    }

    if (Array.isArray(filters.propertyTypes) && filters.propertyTypes.length > 0) {
      where.propertyType = { in: filters.propertyTypes }
    }
    const loc = filters.location as Record<string, unknown> | undefined
    if (loc?.type === 'city' && loc.value) {
      where.city = { equals: String(loc.value), mode: 'insensitive' }
    } else if (loc?.type === 'neighbourhood' && loc.value) {
      where.neighbourhood = { contains: String(loc.value), mode: 'insensitive' }
    }
    if (filters.priceMin || filters.priceMax) {
      where.price = {}
      if (filters.priceMin) (where.price as Record<string, unknown>).gte = Number(filters.priceMin)
      if (filters.priceMax) (where.price as Record<string, unknown>).lte = Number(filters.priceMax)
    }
    if (filters.bedroomsMin) where.bedrooms = { gte: Number(filters.bedroomsMin) }

    const newListings = await (db as any).property.findMany({
      where,
      take: 5,
      orderBy: { listedAt: 'desc' },
      select: { id: true, title: true, price: true, city: true, neighbourhood: true },
    })

    if (newListings.length === 0) continue

    if (search.user?.email) {
      const appUrl = process.env.NEXTAUTH_URL ?? 'https://condohill.com'
      const tmpl = emailPropertyAlert(search.user.name ?? 'there', search.name, newListings, appUrl)
      await sendEmail({ to: search.user.email, ...tmpl }).catch(() => {})
      sent++
    }

    await (db as any).savedSearch.update({
      where: { id: search.id },
      data: { lastAlertedAt: new Date() },
    })
  }

  return NextResponse.json({ checked: searches.length, sent })
}
