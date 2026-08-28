import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Condohill',
  description: 'Learn how Condohill collects, uses, and protects your personal information in accordance with PIPEDA and Ontario privacy law.',
}

const LAST_UPDATED = 'August 26, 2026'

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[color:var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <p className="text-xs font-semibold tracking-widest text-[color:var(--accent)] uppercase mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-bold text-[color:var(--foreground)] tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] mb-12">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-like space-y-10 text-[color:var(--text-muted)] text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">1. Who we are</h2>
            <p>
              Condohill (<strong className="text-[color:var(--foreground)]">"Condohill," "we," "us,"</strong> or <strong className="text-[color:var(--foreground)]">"our"</strong>) operates the website at{' '}
              <a href="https://condohill.ca" className="text-[color:var(--accent)] hover:underline">condohill.ca</a>{' '}
              and any related services (collectively, the <strong className="text-[color:var(--foreground)]">"Platform"</strong>). We are a Toronto-based real estate brokerage serving buyers, sellers, and renters across the Greater Toronto Area (GTA) in Ontario, Canada.
            </p>
            <p className="mt-3">
              This Privacy Policy explains what personal information we collect, why we collect it, how we use it, and your rights under the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable Ontario privacy law.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">2. Information we collect</h2>

            <h3 className="font-semibold text-[color:var(--foreground)] mb-2 mt-4">2.1 Information you provide</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[color:var(--foreground)]">Account registration:</strong> name, email address, and password when you create an account.</li>
              <li><strong className="text-[color:var(--foreground)]">Contact and inquiry forms:</strong> name, email address, phone number, and the content of your message.</li>
              <li><strong className="text-[color:var(--foreground)]">Saved searches and favourites:</strong> property search criteria and listings you save to your account.</li>
              <li><strong className="text-[color:var(--foreground)]">Mortgage calculator inputs:</strong> figures you enter to estimate payments (not stored to your profile).</li>
            </ul>

            <h3 className="font-semibold text-[color:var(--foreground)] mb-2 mt-5">2.2 Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[color:var(--foreground)]">Usage data:</strong> pages viewed, listings clicked, search queries, and time spent on pages.</li>
              <li><strong className="text-[color:var(--foreground)]">Device and browser data:</strong> IP address, browser type and version, operating system, and referring URL.</li>
              <li><strong className="text-[color:var(--foreground)]">Cookies and similar technologies:</strong> see Section 5 below.</li>
            </ul>

            <h3 className="font-semibold text-[color:var(--foreground)] mb-2 mt-5">2.3 MLS® listing data</h3>
            <p>
              Property listings displayed on the Platform are sourced from the Toronto Regional Real Estate Board (TRREB) MLS® System. This data includes property addresses, listing prices, agent names, and brokerage names as provided by the listing agent. We do not control this data and are bound by TRREB's data use policies.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">3. How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide, operate, and improve the Platform and its features.</li>
              <li>Respond to inquiries and provide customer support.</li>
              <li>Send property alerts, saved search notifications, and account-related communications.</li>
              <li>Send marketing communications where you have consented (you may unsubscribe at any time).</li>
              <li>Analyze usage patterns to improve search relevance and user experience.</li>
              <li>Comply with legal and regulatory obligations.</li>
              <li>Detect and prevent fraud, abuse, or unauthorized access.</li>
            </ul>
            <p className="mt-3">
              We collect only the information necessary for these purposes. We do not sell your personal information to third parties.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">4. Sharing your information</h2>
            <p>We may share your personal information with:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[color:var(--foreground)]">Real estate agents:</strong> when you submit an inquiry or book a showing, your contact information is shared with the relevant agent or brokerage to facilitate your request.</li>
              <li><strong className="text-[color:var(--foreground)]">Service providers:</strong> third-party vendors who help us operate the Platform (e.g., hosting, email delivery, analytics). These parties are contractually bound to use your information only as directed by us.</li>
              <li><strong className="text-[color:var(--foreground)]">Legal requirements:</strong> if required by law, court order, or government authority, or to protect our legal rights.</li>
              <li><strong className="text-[color:var(--foreground)]">Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>
            <p className="mt-3">
              We do not share your personal information with third parties for their own marketing purposes without your explicit consent.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">5. Cookies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Keep you signed in to your account.</li>
              <li>Remember your search preferences and saved listings.</li>
              <li>Understand how visitors use the Platform (analytics).</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect certain features, including saved searches and account sign-in.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">6. Data retention</h2>
            <p>
              We retain your personal information for as long as your account is active, or as needed to provide services and comply with our legal obligations. When you close your account, we delete or anonymize your personal information within a reasonable time, except where retention is required by law.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">7. Security</h2>
            <p>
              We use industry-standard security measures — including encrypted connections (HTTPS), access controls, and regular backups — to protect your personal information. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">8. Your rights</h2>
            <p>Under PIPEDA and applicable Ontario law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[color:var(--foreground)]">Access:</strong> request a copy of the personal information we hold about you.</li>
              <li><strong className="text-[color:var(--foreground)]">Correction:</strong> request that we correct inaccurate or incomplete information.</li>
              <li><strong className="text-[color:var(--foreground)]">Withdrawal of consent:</strong> withdraw consent to our use of your information for marketing at any time.</li>
              <li><strong className="text-[color:var(--foreground)]">Deletion:</strong> request deletion of your account and associated personal information, subject to legal retention requirements.</li>
              <li><strong className="text-[color:var(--foreground)]">Complaint:</strong> file a complaint with the Office of the Privacy Commissioner of Canada if you believe we have not handled your information appropriately.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@condohill.ca" className="text-[color:var(--accent)] hover:underline">privacy@condohill.ca</a>.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">9. Third-party links</h2>
            <p>
              The Platform may contain links to third-party websites (e.g., TRREB, CMHC, Government of Ontario). This Privacy Policy applies only to condohill.ca. We are not responsible for the privacy practices of third-party sites and encourage you to review their policies.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated by updating the "Last updated" date at the top of this page and, where appropriate, by email notification. Continued use of the Platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-3">11. Contact us</h2>
            <p>
              Questions or concerns about this Privacy Policy or our privacy practices? Contact us:
            </p>
            <div className="mt-3 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-5 space-y-1">
              <p><strong className="text-[color:var(--foreground)]">Condohill</strong></p>
              <p>Toronto, Ontario, Canada</p>
              <p>
                Email:{' '}
                <a href="mailto:privacy@condohill.ca" className="text-[color:var(--accent)] hover:underline">
                  privacy@condohill.ca
                </a>
              </p>
              <p>
                Website:{' '}
                <a href="https://condohill.ca" className="text-[color:var(--accent)] hover:underline">
                  condohill.ca
                </a>
              </p>
            </div>
            <p className="mt-4">
              You may also file a complaint with the{' '}
              <a
                href="https://www.priv.gc.ca/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] hover:underline"
              >
                Office of the Privacy Commissioner of Canada ↗
              </a>.
            </p>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[color:var(--border)] flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-[color:var(--accent)] hover:underline">Home</Link>
          <Link href="/contact" className="text-[color:var(--accent)] hover:underline">Contact</Link>
          <Link href="/about" className="text-[color:var(--accent)] hover:underline">About Condohill</Link>
          <Link href="/terms" className="text-[color:var(--accent)] hover:underline">Terms of Use</Link>
        </div>
      </div>
    </main>
  )
}
