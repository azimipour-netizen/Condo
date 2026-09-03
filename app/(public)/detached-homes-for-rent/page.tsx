import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('detached-homes-for-rent')!

export const metadata: Metadata = {
  title: 'Detached Houses for Rent in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® detached house rental listings across the Greater Toronto Area. Search single-family homes for rent in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
  alternates: { canonical: '/detached-homes-for-rent' },
}

export default function DetachedHomesForRentPage() {
  return <PropTypeHubPage config={config} />
}
