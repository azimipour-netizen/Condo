import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('townhouses-for-sale')!

export const metadata: Metadata = {
  title: 'Townhouses for Sale in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® townhouse listings across the Greater Toronto Area. Search freehold and condo townhouses for sale in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
  alternates: { canonical: '/townhouses-for-sale' },
}

export default function TownhousesForSalePage() {
  return <PropTypeHubPage config={config} />
}
