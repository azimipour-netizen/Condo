export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '')
}

/**
 * Turns an author-written post body into render-ready HTML plus a table of
 * contents. Two authoring styles are supported: plain text (no '<' at all —
 * the common case for quick market updates) gets paragraph-wrapped on blank
 * lines; anything containing real tags is assumed to be author-written HTML
 * (h2/h3/p/ul/etc — the norm for longer SEO guides) and passed through as-is
 * except for injecting id attributes onto headings so the TOC can link to them.
 */
export function renderBody(raw: string): { html: string; toc: TocEntry[] } {
  const isHtml = raw.includes('<')
  const html = isHtml
    ? raw
    : raw
        .split(/\n\s*\n/)
        .map(block => block.trim())
        .filter(Boolean)
        .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
        .join('\n')

  const toc: TocEntry[] = []
  const seen = new Set<string>()
  const withIds = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = stripTags(inner).trim()
    if (!text) return match
    let id = slugifyHeading(text) || 'section'
    let n = 2
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`
    seen.add(id)
    toc.push({ id, text, level: Number(level) as 2 | 3 })

    const hasId = /\bid=/.test(attrs)
    const newAttrs = hasId ? attrs : `${attrs} id="${id}"`
    return `<h${level}${newAttrs}>${inner}</h${level}>`
  })

  return { html: withIds, toc }
}

/** Rough reading time from visible word count. */
export function readingMinutes(html: string): number {
  const words = stripTags(html).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
}

function decodeEntities(text: string): string {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, ref: string) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10)
      return isNaN(code) ? m : String.fromCodePoint(code)
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? m
  })
}

export interface FaqEntry {
  question: string
  answer: string
}

/**
 * Pulls Q&A pairs out of the blog's standard FAQ block (`<h2>FAQ</h2>`
 * followed by `<h3>question</h3><p>answer</p>` pairs — the exact format the
 * conblog authoring skill writes) for FAQPage JSON-LD. Regex-based rather
 * than a real HTML parser: this only ever runs against the site's own
 * authored blog content (not user input), in a single well-defined,
 * consistently-authored shape.
 */
export function extractFaqs(html: string): FaqEntry[] {
  const section = html.match(/<h2[^>]*>\s*FAQ\s*<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/i)
  if (!section) return []

  const faqs: FaqEntry[] = []
  const pairRe = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
  let m: RegExpExecArray | null
  while ((m = pairRe.exec(section[1])) !== null) {
    const question = decodeEntities(stripTags(m[1]).trim())
    const answer = decodeEntities(stripTags(m[2]).trim())
    if (question && answer) faqs.push({ question, answer })
  }
  return faqs
}
