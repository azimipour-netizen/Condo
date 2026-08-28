import type { Metadata } from 'next'
import { findGtaCity, GTA_CITIES } from '@/lib/seo/gta-cities'
import { PropTypeCityPage } from '@/components/property-type/PropTypeCityPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('multiplex-for-sale')!

interface Props {
  params: Promise<{ city: string }>
  searchParams: Promise<{ page?: string }>
}

export function generateStaticParams() {
  return GTA_CITIES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = findGtaCity(slug)
  if (!city) return { title: 'Not Found' }
  return {
    title: config.cityTitle(city.name),
    description: config.metaDesc(city.name),
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { city: slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  return <PropTypeCityPage config={config} citySlug={slug} page={page} />
}
