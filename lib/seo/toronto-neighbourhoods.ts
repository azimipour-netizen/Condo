export interface TorontoNeighbourhood {
  slug: string
  name: string
  /** Short tagline shown in cards */
  description: string
  /** 2–3 sentence about block on the detail page */
  about: string
  /** Term used for DB `neighbourhood contains` query; defaults to name when absent */
  searchTerm?: string
}

export const TORONTO_NEIGHBOURHOODS: TorontoNeighbourhood[] = [
  // ── Original 12 ──────────────────────────────────────────────────────────
  {
    slug: 'annex',
    name: 'The Annex',
    description: 'Victorian homes, U of T, bookshops, and Bloor Street.',
    about: 'The Annex is one of Toronto\'s most storied neighbourhoods, stretching along Bloor Street West. Known for its Victorian and Edwardian homes, proximity to the University of Toronto, and a vibrant mix of students, professors, and long-time residents. You\'ll find independent bookstores, cafés, and some of the city\'s best restaurants.',
    searchTerm: 'Annex',
  },
  {
    slug: 'yorkville',
    name: 'Yorkville',
    description: 'Luxury condos, designer boutiques, and fine dining.',
    about: 'Yorkville is Toronto\'s most prestigious address. Once a bohemian enclave in the 1960s, it\'s now home to flagship designer stores, Michelin-starred restaurants, and some of the city\'s most sought-after luxury condominiums. A short walk to Rosedale and the ravine system.',
  },
  {
    slug: 'leslieville',
    name: 'Leslieville',
    description: 'Hip cafés, art galleries, and Queen Street East.',
    about: 'Leslieville is East Toronto\'s creative hub, anchored by Queen Street East. Former industrial buildings have been transformed into loft condos, art studios, and boutique restaurants. Family-friendly streets with excellent schools and a walkable commercial strip.',
  },
  {
    slug: 'king-west',
    name: 'King West',
    description: 'Trendy condos, rooftop patios, and tech startups.',
    about: 'King West (King Street West) is the heart of Toronto\'s condo boom. Once a garment district, it\'s now packed with glass towers, converted lofts, trendy restaurants, and some of the city\'s busiest nightlife. A hub for Toronto\'s tech and creative sector.',
    searchTerm: 'King West',
  },
  {
    slug: 'distillery',
    name: 'Distillery District',
    description: 'Victorian industrial lofts and cobblestone charm.',
    about: 'The Distillery District is a pedestrian-only historic district built on the site of the Gooderham and Worts Distillery. Beautifully preserved Victorian industrial architecture now houses galleries, restaurants, boutiques, and loft-style condominiums. Hosts the famous Toronto Christmas Market.',
    searchTerm: 'Distillery',
  },
  {
    slug: 'rosedale',
    name: 'Rosedale',
    description: 'Prestigious detached homes and ravine trails.',
    about: 'Rosedale is among Toronto\'s most exclusive addresses. Winding ravine-bordered streets are lined with grand detached homes, many dating from the late 19th century. Exceptional proximity to downtown, top private schools, and the Don Valley ravine trail system.',
  },
  {
    slug: 'forest-hill',
    name: 'Forest Hill',
    description: 'Stately homes, top schools, and quiet streets.',
    about: 'Forest Hill is a quiet, prestigious neighbourhood known for its grand single-family homes, manicured streets, and proximity to the city\'s top private schools. The area retains an almost village-like feel, with local shops along Spadina Road and easy TTC access.',
    searchTerm: 'Forest Hill',
  },
  {
    slug: 'beaches',
    name: 'The Beaches',
    description: 'Lakefront living, boardwalk, and family streets.',
    about: 'The Beaches (or "The Beach") is a lakefront neighbourhood in East Toronto with a distinct small-town feel. A 5 km boardwalk runs along Lake Ontario, and Queen Street East is lined with local shops and restaurants. Popular with young families and retirees alike.',
    searchTerm: 'Beach',
  },
  {
    slug: 'liberty-village',
    name: 'Liberty Village',
    description: 'Industrial-chic condos and weekend markets.',
    about: 'Liberty Village transformed from a Victorian industrial district into one of Toronto\'s densest condo neighbourhoods. The neighbourhood is popular with young professionals for its walkability, transit access, and proximity to the lakeshore. Farmers\' markets and community events make it feel more than just a condo cluster.',
    searchTerm: 'Liberty',
  },
  {
    slug: 'midtown',
    name: 'Midtown',
    description: 'Yonge & Eglinton — transit-rich and family-friendly.',
    about: 'Midtown Toronto, centred on Yonge Street and Eglinton Avenue, is one of the city\'s fastest-growing nodes. Excellent transit (subway + Eglinton Crosstown LRT), excellent schools, and a mix of high-rise condos and established low-rise neighbourhoods make it a top choice for families and professionals.',
    searchTerm: 'Mount Pleasant',
  },
  {
    slug: 'downtown-core',
    name: 'Downtown Core',
    description: 'Financial district, condos, and urban convenience.',
    about: 'The Downtown Core is Toronto\'s urban centre — home to Bay Street\'s financial towers, Union Station, the Entertainment District, and thousands of condominiums. Everything is walkable: PATH underground network, waterfront access, and the city\'s best transit connections.',
    searchTerm: 'Waterfront',
  },
  {
    slug: 'north-york',
    name: 'North York',
    description: 'Diverse communities, parks, and great value.',
    about: 'North York offers some of the GTA\'s best value relative to its transit access and amenities. A diverse, multicultural community with excellent subway access (Yonge line), large parks, and a growing restaurant scene along Yonge Street and Sheppard Avenue.',
    searchTerm: 'Willowdale',
  },

  // ── New 20 ───────────────────────────────────────────────────────────────
  {
    slug: 'corktown',
    name: 'Corktown',
    description: 'Toronto\'s oldest neighbourhood, revitalized with breweries and boutiques.',
    about: 'Corktown is one of Toronto\'s oldest surviving neighbourhoods, tucked between downtown and the Don River. Once an Irish immigrant enclave, it now attracts young professionals with its mix of Victorian rowhouses, converted lofts, and craft breweries. Excellent access to downtown via King or Queen streetcars.',
  },
  {
    slug: 'riverside',
    name: 'Riverside',
    description: 'Bohemian village feel between Queen East and the Don.',
    about: 'Riverside sits just east of the Don River along Queen Street East. A creative, arts-driven neighbourhood with independent restaurants, vintage shops, and a blend of Victorian homes and newer condos. Directly connected to downtown by the Queen streetcar and cycling infrastructure.',
  },
  {
    slug: 'parkdale',
    name: 'Parkdale',
    description: 'Eclectic Queen West community with a growing food scene.',
    about: 'Parkdale sits at the western end of Queen Street West, bordered by the Gardiner Expressway and High Park. A historically diverse community known for its Victorian housing stock, Tibetan and South Asian restaurants, and an increasingly vibrant arts and dining scene.',
  },
  {
    slug: 'roncesvalles',
    name: 'Roncesvalles Village',
    description: 'Tree-lined Polish village with cafés and family streets.',
    about: 'Roncesvalles Village is a compact, walkable neighbourhood just west of High Park. Known for its Polish heritage, independent cafés, family-friendly streets, and excellent transit connections along the 504 streetcar. Some of Toronto\'s most liveable streets for young families.',
    searchTerm: 'Roncesvalles',
  },
  {
    slug: 'high-park',
    name: 'High Park',
    description: 'Toronto\'s largest park flanked by family homes.',
    about: 'High Park is anchored by Toronto\'s largest park — 161 hectares of green space with trails, a zoo, a Japanese cherry blossom grove, and a bandshell. The surrounding streets are among the city\'s most desirable, lined with detached homes and quiet residential avenues. Subway access via High Park and Keele stations.',
    searchTerm: 'High Park',
  },
  {
    slug: 'junction',
    name: 'The Junction',
    description: 'Former rail hub turned creative arts and dining district.',
    about: 'The Junction developed around the intersection of Toronto\'s old rail yards and has transformed into one of the city\'s most interesting commercial streets. Dundas Street West is lined with independent restaurants, antique shops, art galleries, and craft breweries. A mix of Victorian homes and new infill development.',
    searchTerm: 'Junction',
  },
  {
    slug: 'bloor-west-village',
    name: 'Bloor West Village',
    description: 'Walkable village strip with top schools and family homes.',
    about: 'Bloor West Village is a thriving commercial strip along Bloor Street West, known for its independent shops, seasonal festivals, and family-oriented streets. Among Toronto\'s most consistently desirable neighbourhoods for families, with excellent schools and subway access at Jane and Runnymede stations.',
    searchTerm: 'Bloor West',
  },
  {
    slug: 'danforth',
    name: 'Greektown / The Danforth',
    description: 'Danforth Avenue — Greek culture, terraces, and family streets.',
    about: 'The Danforth (Greektown) stretches along Danforth Avenue east of the Don River, known for its Greek restaurants, festival atmosphere, and the Taste of the Danforth each August. A mature neighbourhood with semi-detached homes, subway access at Broadview and Chester stations, and solid value relative to the downtown core.',
    searchTerm: 'Danforth',
  },
  {
    slug: 'leaside',
    name: 'Leaside',
    description: 'Planned Garden City suburb with top schools and bungalows.',
    about: 'Leaside is one of Toronto\'s most coveted family neighbourhoods — a planned Garden City community developed in the 1920s with wide streets, mature trees, and a mix of bungalows and two-storey homes. Top-ranked public schools, minimal high-rise development, and the Eglinton Crosstown LRT stop make it perennially popular.',
  },
  {
    slug: 'lawrence-park',
    name: 'Lawrence Park',
    description: 'Ravine-bordered detached homes and top school catchments.',
    about: 'Lawrence Park is one of Toronto\'s most prestigious neighbourhoods, developed in the 1920s as a planned garden suburb. Large detached homes sit on generous lots bordering Alexander Muir Memorial Gardens and Blythwood Ravine. Proximity to Upper Canada College and the Toronto French School keeps demand consistently high.',
    searchTerm: 'Lawrence Park',
  },
  {
    slug: 'cabbagetown',
    name: 'Cabbagetown',
    description: 'Victorian rowhouse preservation and Don Valley access.',
    about: 'Cabbagetown contains one of the largest concentrations of Victorian residential architecture in North America, designated as a Heritage Conservation District. Meticulously preserved rowhouses line Spruce, Amelia, and Winchester streets. Walking distance to the Don Valley trail system and a short ride to downtown.',
  },
  {
    slug: 'st-lawrence',
    name: 'St. Lawrence Market Area',
    description: 'Historic market, lofts, and walkable downtown lifestyle.',
    about: 'The St. Lawrence neighbourhood is anchored by the St. Lawrence Market, one of North America\'s oldest and best-regarded public markets. A mix of 19th-century commercial buildings converted to lofts, purpose-built condos, and retained heritage structures. Among the most walkable locations in Toronto, minutes from the Financial District.',
    searchTerm: 'St. Lawrence',
  },
  {
    slug: 'waterfront',
    name: 'Toronto Waterfront',
    description: 'Lakefront condos along Queens Quay and Harbourfront.',
    about: 'The Toronto Waterfront stretches along Lake Ontario from Ontario Place to the Port Lands. Harbourfront Centre anchors a strip of cultural institutions, parks, and marinas, while Queens Quay Boulevard is lined with condominium towers. Home to Corus Quay, Sugar Beach, and the revitalized Sherbourne Common park.',
    searchTerm: 'Waterfront',
  },
  {
    slug: 'west-queen-west',
    name: 'West Queen West',
    description: 'Toronto\'s art gallery strip and design district.',
    about: 'West Queen West, between Bathurst and Dufferin, has been repeatedly named one of the world\'s coolest neighbourhoods. Home to galleries, design shops, boutique hotels, restaurants, and a vibrant nightlife scene. A mix of Victorian commercial buildings and newer residential developments along an active streetcar corridor.',
    searchTerm: 'Queen West',
  },
  {
    slug: 'trinity-bellwoods',
    name: 'Trinity Bellwoods',
    description: 'Park culture, Queen West cafés, and converted Victorian houses.',
    about: 'Trinity Bellwoods is defined by its 14-hectare park, which functions as the neighbourhood\'s living room every summer weekend. The surrounding streets — Shaw, Euclid, Palmerston — are lined with Victorian detached and semi-detached homes. Queen Street West provides a busy strip of cafés, restaurants, and boutiques.',
    searchTerm: 'Trinity',
  },
  {
    slug: 'kensington',
    name: 'Kensington Market',
    description: 'Eclectic independent market and multicultural hub.',
    about: 'Kensington Market is one of Toronto\'s most distinctive urban spaces — a dense cluster of vintage shops, international food stalls, fishmongers, and cafés in Victorian rowhouses. Designated a National Historic Site of Canada, Kensington is a pedestrian-friendly enclave bordered by College Street and Spadina Avenue.',
    searchTerm: 'Kensington',
  },
  {
    slug: 'willowdale',
    name: 'Willowdale',
    description: 'Yonge Street corridor — condos and top North York schools.',
    about: 'Willowdale is a central North York neighbourhood running along Yonge Street between Sheppard and Steeles avenues. Known for its concentration of Korean businesses, excellent public schools, and growing residential towers along Yonge. Direct subway access and proximity to the North York City Centre make it popular with families and investors.',
  },
  {
    slug: 'scarborough',
    name: 'Scarborough',
    description: 'Diverse east Toronto district with ravines and waterfront.',
    about: 'Scarborough is Toronto\'s east-end district, home to the Scarborough Bluffs, Rouge National Urban Park, and a highly diverse, multicultural community. Property prices are typically lower than the downtown core while offering more space — detached homes, bungalows, and smaller low-rise condos dominate the housing stock.',
    searchTerm: 'Scarborough',
  },
  {
    slug: 'etobicoke',
    name: 'Etobicoke',
    description: 'West Toronto\'s waterfront and Humber River communities.',
    about: 'Etobicoke is Toronto\'s west-end district, stretching from the Humber River to the Mississauga border. Diverse housing stock ranges from lakefront condos in Mimico to large family homes in the Kingsway and Islington. The Long Branch, Mimico, and Humber Bay Shore areas attract buyers seeking lakeside living at lower price points than downtown.',
    searchTerm: 'Etobicoke',
  },
  {
    slug: 'east-york',
    name: 'East York',
    description: 'Bungalow belt with ravines and excellent value.',
    about: 'East York is a compact former borough now part of Toronto, stretching from the Don Valley east toward Victoria Park Avenue. Known for its well-maintained post-war bungalows, ravine lots, and prices that represent solid value relative to the downtown core. The future Ontario Line subway (East Harbour station) is expected to meaningfully improve transit access.',
    searchTerm: 'East York',
  },
]

export const NEIGHBOURHOOD_SLUGS = new Set(TORONTO_NEIGHBOURHOODS.map(n => n.slug))

export function findNeighbourhood(slug: string): TorontoNeighbourhood | undefined {
  return TORONTO_NEIGHBOURHOODS.find(n => n.slug === slug)
}
