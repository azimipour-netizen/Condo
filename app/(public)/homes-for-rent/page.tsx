import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('homes-for-rent')!

export const metadata: Metadata = {
  title: 'Homes for Rent in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® rental listings across the Greater Toronto Area. Find apartments, condos, houses, and townhouses for rent in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function HomesForRentPage() {
  return <PropTypeHubPage config={config} />
}
