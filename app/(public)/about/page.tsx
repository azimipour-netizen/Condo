import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Condohill is a Toronto-based real estate brokerage helping buyers and sellers navigate the GTA market with AI-powered search and personalized service.',
  alternates: { canonical: '/about' },
}

const stats = [
  { value: '12+', label: 'Years in Toronto real estate' },
  { value: '2,400+', label: 'Transactions closed' },
  { value: '$2.1B+', label: 'In property sales' },
  { value: '4.9★', label: 'Average client rating' },
]

const values = [
  {
    title: 'Honest advice',
    body: 'We tell you what you need to hear, not what you want to hear — before, during, and after every transaction.',
  },
  {
    title: 'Data-driven',
    body: 'Every recommendation is backed by current market data, comparable sales, and neighbourhood analytics.',
  },
  {
    title: 'Technology-forward',
    body: 'Our AI-powered search helps you find the right home faster, and our tools keep you informed at every step.',
  },
  {
    title: 'Community-focused',
    body: 'We live and work in the GTA. Our knowledge of neighbourhoods, transit, and school zones is first-hand.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-[color:var(--background)]">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-[color:var(--accent)] uppercase mb-4">
          About Condohill
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[color:var(--foreground)] tracking-tight leading-tight mb-6">
          Toronto real estate,<br />done right
        </h1>
        <p className="text-lg text-[color:var(--text-muted)] leading-relaxed max-w-xl mx-auto">
          We combine deep local knowledge with modern technology to help buyers, sellers, and investors make confident decisions in the Greater Toronto Area.
        </p>
      </section>

      {/* Stats */}
      <section className="border-y border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[color:var(--accent)] mb-1">{s.value}</p>
              <p className="text-xs text-[color:var(--text-muted)] leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-4">Our mission</h2>
        <p className="text-[color:var(--text-muted)] leading-relaxed mb-4">
          The GTA real estate market moves fast. Buyers and sellers deserve a team that moves faster — one that responds to every question, explains every offer, and advocates for their best interests without hesitation.
        </p>
        <p className="text-[color:var(--text-muted)] leading-relaxed">
          Condohill was built to close the gap between what clients expect and what traditional brokerages deliver. We use technology to handle the routine so our agents can focus on what matters: your transaction.
        </p>
      </section>

      {/* Values */}
      <section className="bg-[color:var(--bg-surface)] border-y border-[color:var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-10">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="w-1.5 rounded-full bg-[color:var(--accent)] flex-shrink-0 mt-1" style={{ minHeight: '1.5rem' }} />
                <div>
                  <h3 className="font-semibold text-[color:var(--foreground)] mb-1">{v.title}</h3>
                  <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-3">Ready to get started?</h2>
        <p className="text-[color:var(--text-muted)] mb-8">
          Search available listings, or reach out to speak with an agent directly.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/"
            className="px-5 py-2.5 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors"
          >
            Search listings
          </a>
          <Link
            href="/contact"
            className="px-5 py-2.5 border border-[color:var(--border)] text-[color:var(--foreground)] text-sm font-medium rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  )
}
