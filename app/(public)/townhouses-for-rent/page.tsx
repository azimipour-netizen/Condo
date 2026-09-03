import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('townhouses-for-rent')!

export const metadata: Metadata = {
  title: 'Townhouses for Rent in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® townhouse rental listings across the Greater Toronto Area. Search freehold and condo townhouses for rent in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
  alternates: { canonical: '/townhouses-for-rent' },
}

export default function TownhousesForRentPage() {
  return <PropTypeHubPage config={config} />
}
