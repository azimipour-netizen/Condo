/**
 * Curated GTA municipality list for programmatic SEO landing pages
 * (/homes-for-sale/[city]). Deliberately NOT auto-generated from every
 * distinct `city` value in the DB — AMPRE's feed covers all of Ontario
 * (Kawartha Lakes, Prince Edward County, Kingston...), and a Toronto-focused
 * platform diluting its own city pages with far-out-of-market municipalities
 * would work against the SEO goal, not for it.
 *
 * `dbValue` is what actually appears in Property.city. Toronto is a special
 * case: AMPRE splits it into district codes ("Toronto C01", "Toronto W05"...),
 * so there is no single literal value — every real row's city starts with
 * "Toronto ", which the query layer below matches with `startsWith`.
 */
export interface GtaCity {
  slug: string
  name: string
  /** Exact Property.city match, or null for Toronto's startsWith case. */
  dbValue: string | null
  /** Multiple exact Property.city values (e.g. Toronto sub-districts for a neighbourhood). */
  dbValues?: string[]
  /** One line of real, defensible local color — not filler. */
  blurb: string
}

export const GTA_CITIES: GtaCity[] = [
  { slug: 'toronto',        name: 'Toronto',        dbValue: null,             blurb: 'Canada\'s largest city — from downtown high-rises to family neighbourhoods across the old City of Toronto, North York, Scarborough, Etobicoke, York, and East York.' },
  { slug: 'north-york',    name: 'North York',     dbValue: null,             dbValues: ['Toronto C06', 'Toronto C07', 'Toronto C14', 'Toronto C15'], blurb: 'A former city now part of Toronto, stretching from Steeles Avenue to Lawrence Avenue — home to Willowdale, Bayview Village, Bathurst Manor, and some of the city\'s most sought-after school catchments.' },
  { slug: 'mississauga',    name: 'Mississauga',     dbValue: 'Mississauga',    blurb: 'The GTA\'s second-largest city, anchored by Square One and a growing downtown core along the Hurontario LRT corridor.' },
  { slug: 'brampton',       name: 'Brampton',        dbValue: 'Brampton',       blurb: 'One of Canada\'s fastest-growing cities, known for new-build subdivisions and a large, established South Asian community.' },
  { slug: 'vaughan',        name: 'Vaughan',         dbValue: 'Vaughan',        blurb: 'Home to Vaughan Mills and Canada\'s Wonderland, with newer master-planned communities and strong transit growth around the Vaughan subway extension.' },
  { slug: 'markham',        name: 'Markham',         dbValue: 'Markham',       blurb: 'A tech and business hub in York Region with top-ranked schools and one of the GTA\'s largest Chinese-Canadian communities.' },
  { slug: 'richmond-hill',  name: 'Richmond Hill',   dbValue: 'Richmond Hill', blurb: 'Family-oriented York Region community along Yonge Street, known for its schools and Lake Wilcox.' },
  { slug: 'oakville',       name: 'Oakville',        dbValue: 'Oakville',      blurb: 'An affluent lakefront town in Halton Region with a historic downtown harbour and highly-rated schools.' },
  { slug: 'burlington',     name: 'Burlington',      dbValue: 'Burlington',    blurb: 'A Lake Ontario waterfront city between Toronto and Hamilton, with a walkable downtown and the Royal Botanical Gardens.' },
  { slug: 'milton',         name: 'Milton',          dbValue: 'Milton',        blurb: 'One of Canada\'s fastest-growing towns, at the base of the Niagara Escarpment in Halton Region.' },
  { slug: 'ajax',           name: 'Ajax',            dbValue: 'Ajax',          blurb: 'A Durham Region lakefront town with a growing waterfront trail and GO Transit access into downtown Toronto.' },
  { slug: 'pickering',      name: 'Pickering',       dbValue: 'Pickering',     blurb: 'A Durham Region community on Lake Ontario, undergoing major growth around its downtown and waterfront.' },
  { slug: 'whitby',         name: 'Whitby',          dbValue: 'Whitby',        blurb: 'A Durham Region town known for its historic downtown, marina, and family-friendly subdivisions.' },
  { slug: 'oshawa',         name: 'Oshawa',          dbValue: 'Oshawa',        blurb: 'The largest city in Durham Region, historically tied to automotive manufacturing and now a growing university town.' },
  { slug: 'newmarket',      name: 'Newmarket',       dbValue: 'Newmarket',     blurb: 'A York Region town with a historic Main Street and the Upper Canada Mall.' },
  { slug: 'aurora',         name: 'Aurora',          dbValue: 'Aurora',        blurb: 'A York Region town known for its heritage downtown and Sheppard\'s Bush conservation area.' },
  { slug: 'caledon',        name: 'Caledon',         dbValue: 'Caledon',       blurb: 'A largely rural Peel Region municipality known for estate properties, the Caledon Trailway, and the Niagara Escarpment.' },
  { slug: 'halton-hills',   name: 'Halton Hills',    dbValue: 'Halton Hills',  blurb: 'A Halton Region municipality combining the towns of Georgetown and Acton with a mix of small-town and rural properties.' },
  { slug: 'east-gwillimbury', name: 'East Gwillimbury', dbValue: 'East Gwillimbury', blurb: 'One of the fastest-growing York Region municipalities, known for larger lots and semi-rural living.' },
  { slug: 'georgina',       name: 'Georgina',        dbValue: 'Georgina',      blurb: 'A York Region municipality on the shore of Lake Simcoe, popular for waterfront and cottage-style properties.' },
  { slug: 'king',           name: 'King City',       dbValue: 'King',         blurb: 'An affluent, largely rural York Region township known for equestrian estates and the village of King City.' },
]

export const GTA_CITY_SLUGS = new Set(GTA_CITIES.map(c => c.slug))

export function findGtaCity(slug: string): GtaCity | undefined {
  return GTA_CITIES.find(c => c.slug === slug)
}

/** Prisma `where` clause fragment for this city's Property.city field. */
export function cityWhereClause(city: GtaCity): Record<string, unknown> {
  if (city.dbValues) return { city: { in: city.dbValues } }
  return city.dbValue ? { city: city.dbValue } : { city: { startsWith: 'Toronto' } }
}
