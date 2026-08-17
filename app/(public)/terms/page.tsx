import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of the Condohill real estate platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Terms of Use</span>
      </nav>

      <h1 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">Terms of Use</h1>
      <p className="text-sm text-[color:var(--text-muted)] mb-10">Last updated: August 1, 2026</p>

      <div className="space-y-8 text-sm text-[color:var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold mb-3">1. Acceptance</h2>
          <p className="text-[color:var(--text-muted)]">
            By accessing Condohill you agree to these terms. If you do not agree, do not use this site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">2. Listing information</h2>
          <p className="text-[color:var(--text-muted)]">
            Property information is provided for informational purposes only and may not be current or accurate.
            Estimated market values (AVM) are computer-generated estimates — not appraisals, not guarantees of
            value. Always verify with a licensed professional before making any real estate decision.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">3. Not a solicitation</h2>
          <p className="text-[color:var(--text-muted)]">
            This site is not intended to solicit buyers or sellers already under contract with another registrant.
            Condohill is operated under RECO regulations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">4. User accounts</h2>
          <p className="text-[color:var(--text-muted)]">
            You are responsible for keeping your credentials confidential. Accounts may be suspended for misuse,
            abusive behaviour toward staff, or attempts to scrape or reproduce listing data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">5. Intellectual property</h2>
          <p className="text-[color:var(--text-muted)]">
            All site content, design, and software is the property of Condohill unless otherwise noted.
            Reproduction without written permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">6. Limitation of liability</h2>
          <p className="text-[color:var(--text-muted)]">
            Condohill is not liable for any loss or damages arising from reliance on information on this site,
            inaccurate listing data, or technical failures. The site is provided &quot;as is&quot;.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">7. Governing law</h2>
          <p className="text-[color:var(--text-muted)]">
            These terms are governed by the laws of Ontario, Canada.
          </p>
        </section>
      </div>
    </div>
  )
}
