import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMLSAdapter } from '@/lib/mls/adapter'
import PropertyDetailView from '@/components/property/PropertyDetailView'
import { auth } from '@/auth'
import { db } from '@/lib/db'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const adapter = getMLSAdapter()
  const property = await adapter.getListing(id)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: `${property.title} — $${property.price.toLocaleString()}`,
    description: property.description.slice(0, 155),
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const adapter = getMLSAdapter()
  const property = await adapter.getListing(id)
  if (!property) notFound()

  let initialSaved = false
  try {
    const session = await auth()
    if (session?.user?.id) {
      const row = await (db as any).savedProperty.findUnique({
        where: { userId_propertyId: { userId: session.user.id, propertyId: property.id } },
      })
      initialSaved = !!row
    }
  } catch {}

  // Compute AVM from comparables
  let avm: { low: number; high: number; estimate: number; comparableCount: number } | null = null
  if (property.sqft) {
    try {
      const all = await adapter.searchListings({}, 1, 100)
      const comps = all.properties.filter(c =>
        c.id !== property.id &&
        c.propertyType === property.propertyType &&
        c.sqft != null &&
        Math.abs(c.sqft - property.sqft!) / property.sqft! <= 0.4
      )
      if (comps.length >= 1) {
        const avgPpsf = comps.reduce((sum, c) => sum + c.price / c.sqft!, 0) / comps.length
        const estimate = Math.round((avgPpsf * property.sqft) / 5000) * 5000
        avm = {
          estimate,
          low: Math.round(estimate * 0.92 / 5000) * 5000,
          high: Math.round(estimate * 1.08 / 5000) * 5000,
          comparableCount: comps.length,
        }
      }
    } catch {}
  }

  return <PropertyDetailView property={property} initialSaved={initialSaved} avm={avm} />
}
