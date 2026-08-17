import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Condohill collects, uses, and protects your personal information.',
}

const EFFECTIVE_DATE = 'August 1, 2026'

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-sm text-[color:var(--text-muted)] mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-[color:var(--foreground)] mb-2">Privacy Policy</h1>
      <p className="text-sm text-[color:var(--text-muted)] mb-10">Effective date: {EFFECTIVE_DATE}</p>

      <div className="space-y-8 text-sm text-[color:var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold mb-3">1. Information we collect</h2>
          <p className="text-[color:var(--text-muted)]">
            We collect information you provide directly — name, email, phone — when you register, request a showing,
            ask a question, or contact us. We also collect usage data: pages viewed, properties viewed, search filters
            used, and session identifiers (stored in sessionStorage, not persistent cookies). We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">2. How we use your information</h2>
          <ul className="list-disc pl-5 space-y-1 text-[color:var(--text-muted)]">
            <li>To facilitate showing requests and property inquiries</li>
            <li>To send you listings that match your saved searches (opt-in)</li>
            <li>To improve site functionality and understand user behaviour</li>
            <li>To communicate about your account and transactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">3. Cookies</h2>
          <p className="text-[color:var(--text-muted)]">
            We use a session cookie required for authentication. We use sessionStorage (not cookies) for anonymous
            analytics session IDs. You may decline non-essential cookies via the banner shown on first visit.
            Declining does not affect core site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">4. Data retention</h2>
          <p className="text-[color:var(--text-muted)]">
            Account data is retained as long as your account is active. Showing requests and questions are retained
            for 3 years for record-keeping purposes. You may request deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">5. Third-party services</h2>
          <p className="text-[color:var(--text-muted)]">
            We use Neon (PostgreSQL hosting), Vercel (hosting and image storage), and Resend (transactional email).
            Each has its own privacy policy. We do not share your data with real estate boards or other agents.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">6. Your rights</h2>
          <p className="text-[color:var(--text-muted)]">
            Under PIPEDA and Ontario privacy law, you have the right to access, correct, or delete your personal
            information. Contact us at{' '}
            <a href="mailto:azimipour@gmail.com" className="text-[color:var(--accent)] hover:underline">
              azimipour@gmail.com
            </a>{' '}
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3">7. Contact</h2>
          <p className="text-[color:var(--text-muted)]">
            Questions? Email{' '}
            <a href="mailto:azimipour@gmail.com" className="text-[color:var(--accent)] hover:underline">
              azimipour@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
