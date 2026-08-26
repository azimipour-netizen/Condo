export interface PropTypeCfg {
  typeSlug: string
  dbType: string
  plural: string
  singular: string
  hubTitle: string
  cityTitle: (city: string) => string
  metaDesc: (city: string) => string
  buyerGuides: Array<{ href: string; label: string }>
}

export const PROP_TYPE_CFGS: PropTypeCfg[] = [
  {
    typeSlug: 'condos-for-sale',
    dbType: 'condo',
    plural: 'Condos',
    singular: 'Condo',
    hubTitle: 'Condos for Sale in the GTA',
    cityTitle: (city) => `Condos for Sale in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® condo listings for sale in ${city}, Ontario. Real-time prices, photos, and property details for condominiums and condo-apartments.`,
    buyerGuides: [
      { href: '/blog/can-first-time-buyers-buy-a-condo-in-toronto', label: 'Can first-time buyers buy a condo in Toronto?' },
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/what-is-the-first-time-home-buyer-tax-credit', label: 'First-time home buyer tax credit (HBTC)' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
    ],
  },
  {
    typeSlug: 'detached-homes-for-sale',
    dbType: 'detached',
    plural: 'Detached Homes',
    singular: 'Detached Home',
    hubTitle: 'Detached Homes for Sale in the GTA',
    cityTitle: (city) => `Detached Homes for Sale in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® detached home listings for sale in ${city}, Ontario. Real-time prices, photos, and property details for single-family detached houses.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/do-i-need-a-home-inspection', label: 'Do I need a home inspection?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/what-closing-costs-do-home-buyers-pay', label: 'What closing costs do buyers pay?' },
    ],
  },
  {
    typeSlug: 'semi-detached-homes-for-sale',
    dbType: 'semi-detached',
    plural: 'Semi-Detached Homes',
    singular: 'Semi-Detached Home',
    hubTitle: 'Semi-Detached Homes for Sale in the GTA',
    cityTitle: (city) => `Semi-Detached Homes for Sale in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® semi-detached home listings for sale in ${city}, Ontario. Real-time prices, photos, and property details for semi-detached houses.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/what-closing-costs-do-home-buyers-pay', label: 'What closing costs do buyers pay?' },
      { href: '/blog/difference-between-firm-and-conditional-offer', label: 'Firm vs. conditional offers explained' },
    ],
  },
  {
    typeSlug: 'townhouses-for-sale',
    dbType: 'townhouse',
    plural: 'Townhouses',
    singular: 'Townhouse',
    hubTitle: 'Townhouses for Sale in the GTA',
    cityTitle: (city) => `Townhouses for Sale in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® townhouse listings for sale in ${city}, Ontario. Real-time prices, photos, and property details for freehold and condo townhouses.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/what-closing-costs-do-home-buyers-pay', label: 'What closing costs do buyers pay?' },
      { href: '/blog/what-is-the-first-time-home-buyer-tax-credit', label: 'First-time home buyer tax credit (HBTC)' },
    ],
  },
]

export function findPropTypeCfg(typeSlug: string): PropTypeCfg | undefined {
  return PROP_TYPE_CFGS.find(c => c.typeSlug === typeSlug)
}
