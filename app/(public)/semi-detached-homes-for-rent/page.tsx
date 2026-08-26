import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('semi-detached-homes-for-rent')!

export const metadata: Metadata = {
  title: 'Semi-Detached Houses for Rent in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® semi-detached house rental listings across the Greater Toronto Area. Search semi-detached homes for rent in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function SemiDetachedHomesForRentPage() {
  return <PropTypeHubPage config={config} />
}
