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

  return <PropertyDetailView property={property} initialSaved={initialSaved} />
}
