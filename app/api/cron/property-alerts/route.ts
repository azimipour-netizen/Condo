import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notify } from '@/lib/notify'
import { sendEmail, emailPropertyAlert } from '@/lib/email'

// Called by a cron service (Vercel Cron, GitHub Actions, etc.)
// Protect with a secret: GET /api/cron/property-alerts?secret=CRON_SECRET
// Add CRON_SECRET to .env.local

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = req.headers.get('authorization')
    const querySecret = req.nextUrl.searchParams.get('secret')
    const validHeader = authHeader === `Bearer ${secret}`
    const validQuery = querySecret === secret
    if (!validHeader && !validQuery) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // Properties synced in the last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [newProperties, savedSearches] = await Promise.all([
      (db as any).property.findMany({
        where: { status: 'active', syncedAt: { gte: since } },
        select: {
          id: true, title: true, price: true, propertyType: true,
          bedrooms: true, city: true, neighbourhood: true, listingId: true,
        },
      }),
      (db as any).savedSearch.findMany({
        where: { alertsEnabled: true },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
    ])

    if (newProperties.length === 0) {
      return NextResponse.json({ ok: true, matched: 0, message: 'No new properties' })
    }

    let totalMatches = 0
    const appUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    for (const search of savedSearches) {
      const filters = search.filters as Record<string, any>

      const matches = newProperties.filter((p: any) => {
        if (filters.priceMin && Number(p.price) < filters.priceMin) return false
        if (filters.priceMax && Number(p.price) > filters.priceMax) return false
        if (filters.bedroomsMin && p.bedrooms < filters.bedroomsMin) return false
        if (filters.propertyTypes?.length && !filters.propertyTypes.includes(p.propertyType)) return false
        if (filters.location?.type === 'city' && filters.location.value &&
          p.city.toLowerCase() !== filters.location.value.toLowerCase()) return false
        if (filters.location?.type === 'neighbourhood' && filters.location.value &&
          !p.neighbourhood?.toLowerCase().includes(filters.location.value.toLowerCase())) return false
        return true
      })

      if (matches.length === 0) continue
      totalMatches += matches.length

      const user = search.user
      const listStr = matches.slice(0, 5).map((p: any) =>
        `• ${p.title} — $${Number(p.price).toLocaleString()} (${p.city})\n  ${appUrl}/property/${p.id}`
      ).join('\n')

      // Telegram alert to agent
      notify(
        `🔔 <b>Property Alert Match</b>\n` +
        `Search: "${search.name}" — ${user.name ?? user.email}\n` +
        `${matches.length} new match${matches.length !== 1 ? 'es' : ''}:\n${listStr}`
      )

      if (user.email) {
        const tmpl = emailPropertyAlert(user.name ?? 'there', search.name, matches.slice(0, 10), appUrl)
        await sendEmail({ to: user.email, ...tmpl }).catch(() => {})
      }

      await (db as any).savedSearch.update({
        where: { id: search.id },
        data: { lastAlertedAt: new Date() },
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, newListings: newProperties.length, matched: totalMatches })
  } catch (err) {
    console.error('[CRON/property-alerts]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
