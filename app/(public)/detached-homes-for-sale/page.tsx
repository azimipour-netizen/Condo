import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('detached-homes-for-sale')!

export const metadata: Metadata = {
  title: 'Detached Homes for Sale in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® detached home listings across the Greater Toronto Area. Search single-family houses for sale in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function DetachedHomesForSalePage() {
  return <PropTypeHubPage config={config} />
}
