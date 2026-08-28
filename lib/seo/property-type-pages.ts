export interface PropTypeCfg {
  typeSlug: string
  dbType: string | null          // null = all property types (no propertyType filter)
  transactionType: 'sale' | 'lease'
  plural: string
  singular: string
  hubTitle: string
  cityTitle: (city: string) => string
  metaDesc: (city: string) => string
  buyerGuides: Array<{ href: string; label: string }>
}

export const PROP_TYPE_CFGS: PropTypeCfg[] = [
  // ── For Sale ─────────────────────────────────────────────────────────────
  {
    typeSlug: 'condos-for-sale',
    dbType: 'condo',
    transactionType: 'sale',
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
    transactionType: 'sale',
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
    transactionType: 'sale',
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
    typeSlug: 'multiplex-for-sale',
    dbType: 'multiplex',
    transactionType: 'sale',
    plural: 'Multiplexes',
    singular: 'Multiplex',
    hubTitle: 'Multiplexes for Sale in the GTA',
    cityTitle: (city) => `Multiplexes for Sale in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® multiplex listings for sale in ${city}, Ontario. Real-time prices, photos, and property details for multiplexes and multi-family income properties.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/what-closing-costs-do-home-buyers-pay', label: 'What closing costs do buyers pay?' },
      { href: '/blog/what-to-inspect-before-buying-a-home', label: 'What to inspect before buying a home' },
    ],
  },
  {
    typeSlug: 'townhouses-for-sale',
    dbType: 'townhouse',
    transactionType: 'sale',
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

  // ── For Rent ─────────────────────────────────────────────────────────────
  {
    typeSlug: 'homes-for-rent',
    dbType: null,
    transactionType: 'lease',
    plural: 'Rentals',
    singular: 'Rental',
    hubTitle: 'Homes for Rent in the GTA',
    cityTitle: (city) => `Homes for Rent in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® rental listings in ${city}, Ontario. Real-time prices, photos, and property details for apartments, condos, houses, and townhouses for rent.`,
    buyerGuides: [
      { href: '/blog/how-much-house-can-i-afford', label: 'How much home can I afford to buy?' },
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
      { href: '/blog/what-is-the-home-buyers-plan', label: 'Home Buyers\' Plan — use your RRSP to buy' },
    ],
  },
  {
    typeSlug: 'condos-for-rent',
    dbType: 'condo',
    transactionType: 'lease',
    plural: 'Condos for Rent',
    singular: 'Condo for Rent',
    hubTitle: 'Condos for Rent in the GTA',
    cityTitle: (city) => `Condos for Rent in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® condo rental listings in ${city}, Ontario. Real-time prices, photos, and property details for condominiums and apartments for rent.`,
    buyerGuides: [
      { href: '/blog/can-first-time-buyers-buy-a-condo-in-toronto', label: 'Ready to buy? Condos for first-time buyers' },
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Steps to buying a home in the GTA' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/what-is-the-first-time-home-buyer-tax-credit', label: 'First-time home buyer tax credit (HBTC)' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
    ],
  },
  {
    typeSlug: 'detached-homes-for-rent',
    dbType: 'detached',
    transactionType: 'lease',
    plural: 'Detached Houses for Rent',
    singular: 'Detached House for Rent',
    hubTitle: 'Detached Houses for Rent in the GTA',
    cityTitle: (city) => `Detached Houses for Rent in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® detached house rental listings in ${city}, Ontario. Real-time prices, photos, and property details for single-family detached homes for rent.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Thinking of buying? Steps to buy a home' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/is-now-a-good-time-to-buy-a-home', label: 'Is now a good time to buy in the GTA?' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
    ],
  },
  {
    typeSlug: 'semi-detached-homes-for-rent',
    dbType: 'semi-detached',
    transactionType: 'lease',
    plural: 'Semi-Detached Houses for Rent',
    singular: 'Semi-Detached House for Rent',
    hubTitle: 'Semi-Detached Houses for Rent in the GTA',
    cityTitle: (city) => `Semi-Detached Houses for Rent in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® semi-detached house rental listings in ${city}, Ontario. Real-time prices, photos, and property details for semi-detached homes for rent.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Thinking of buying? Steps to buy a home' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/is-now-a-good-time-to-buy-a-home', label: 'Is now a good time to buy in the GTA?' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
    ],
  },
  {
    typeSlug: 'townhouses-for-rent',
    dbType: 'townhouse',
    transactionType: 'lease',
    plural: 'Townhouses for Rent',
    singular: 'Townhouse for Rent',
    hubTitle: 'Townhouses for Rent in the GTA',
    cityTitle: (city) => `Townhouses for Rent in ${city}`,
    metaDesc: (city) =>
      `Browse active MLS® townhouse rental listings in ${city}, Ontario. Real-time prices, photos, and property details for freehold and condo townhouses for rent.`,
    buyerGuides: [
      { href: '/blog/steps-to-buying-a-home-in-the-gta', label: 'Thinking of buying? Steps to buy a home' },
      { href: '/blog/how-much-house-can-i-afford', label: 'How much house can I afford?' },
      { href: '/blog/how-much-down-payment-to-buy-a-home', label: 'How much down payment do you need?' },
      { href: '/blog/first-time-home-buyer-benefits-ontario', label: 'First-time home buyer benefits in Ontario' },
      { href: '/blog/what-is-the-home-buyers-plan', label: 'Home Buyers\' Plan — use your RRSP to buy' },
    ],
  },
]

export const SALE_CFGS = PROP_TYPE_CFGS.filter(c => c.transactionType === 'sale')
export const RENT_CFGS = PROP_TYPE_CFGS.filter(c => c.transactionType === 'lease')

export function findPropTypeCfg(typeSlug: string): PropTypeCfg | undefined {
  return PROP_TYPE_CFGS.find(c => c.typeSlug === typeSlug)
}
