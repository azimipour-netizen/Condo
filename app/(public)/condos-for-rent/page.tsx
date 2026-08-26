import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('condos-for-rent')!

export const metadata: Metadata = {
  title: 'Condos for Rent in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® condo rental listings across the Greater Toronto Area. Search condos and apartments for rent in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function CondosForRentPage() {
  return <PropTypeHubPage config={config} />
}
