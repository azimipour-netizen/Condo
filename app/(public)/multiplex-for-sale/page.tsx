import type { Metadata } from 'next'
import { PropTypeHubPage } from '@/components/property-type/PropTypeHubPage'
import { findPropTypeCfg } from '@/lib/seo/property-type-pages'

const config = findPropTypeCfg('multiplex-for-sale')!

export const metadata: Metadata = {
  title: 'Multiplexes for Sale in the GTA — Toronto, Mississauga & More',
  description:
    'Browse active MLS® multiplex listings across the Greater Toronto Area. Search multi-family income properties for sale in Toronto, Mississauga, Vaughan, Markham, and all GTA cities.',
}

export default function MultiplexForSalePage() {
  return <PropTypeHubPage config={config} />
}
