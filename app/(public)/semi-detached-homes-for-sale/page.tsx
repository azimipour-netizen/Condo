import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('semi-detached-homes-for-sale')!

export const metadata: Metadata = {
  title: 'Semi-Detached Homes for Sale in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® semi-detached home listings across the Greater Toronto Area. Search semi-detached houses for sale in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function SemiDetachedHomesForSalePage() {
  return <PropTypeHubPage config={config} />
}
