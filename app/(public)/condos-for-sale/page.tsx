import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('condos-for-sale')!

export const metadata: Metadata = {
  title: 'Condos for Sale in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® condo listings across the Greater Toronto Area. Search condos for sale in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function CondosForSalePage() {
  return <PropTypeHubPage config={config} />
}
