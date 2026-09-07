import { renderBody, extractFaqs } from '@/lib/content/render-body'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

interface Props {
  /** Rendered as the page's single <h1>. */
  title: string
  /** One-paragraph dek shown under the h1. */
  summary: string
  /** Breadcrumb's final (non-link) crumb — usually a short version of the title. */
  breadcrumbLabel: string
  /** URL path this page is served at, e.g. "/mississauga-home-buying-guide". */
  path: string
  /** Raw article HTML — same h2/h3/p/ul/table/a shape the blog's body uses. */
  bodyHtml: string
}

/**
 * Shared shell for standalone SEO content pages that are real routes but
 * intentionally not DB-backed blog posts and not linked from any nav —
 * discoverable only via sitemap.xml and their own internal/external links.
 * Reuses the blog's exact rendering pipeline (renderBody for heading IDs,
 * extractFaqs for FAQPage schema, the .article-body CSS class) so these
 * pages are visually and structurally consistent with /blog/[slug] without
 * duplicating that logic.
 */
export function SeoContentPage({ title, summary, breadcrumbLabel, path, bodyHtml }: Props) {
  const { html } = renderBody(bodyHtml)
  const faqs = extractFaqs(html)
  const url = `${BASE}${path}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabel },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: summary,
    url,
    publisher: { '@id': `${BASE}/#organization` },
    mainEntityOfPage: url,
  }

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <nav className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] mb-8">
        <a href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</a>
        <span>/</span>
        <span className="text-[color:var(--foreground)]">{breadcrumbLabel}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)] leading-tight text-balance">
          {title}
        </h1>
        <p className="text-lg text-[color:var(--text-muted)] mt-4 leading-relaxed max-w-3xl">{summary}</p>
      </header>

      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
