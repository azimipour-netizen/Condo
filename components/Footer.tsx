import Link from 'next/link'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t-2 border-[color:var(--border)] bg-[color:var(--bg-surface)] shrink-0 mt-auto shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold text-[color:var(--foreground)] uppercase tracking-wider mb-3">Search</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              <li><Link href="/?transactionType=sale" className="hover:text-[color:var(--accent)] transition-colors">Homes for Sale</Link></li>
              <li><Link href="/?transactionType=lease" className="hover:text-[color:var(--accent)] transition-colors">Homes for Rent</Link></li>
              <li><Link href="/?propertyType=condo" className="hover:text-[color:var(--accent)] transition-colors">Condos</Link></li>
              <li><Link href="/?propertyType=detached" className="hover:text-[color:var(--accent)] transition-colors">Detached Homes</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[color:var(--foreground)] uppercase tracking-wider mb-3">Neighbourhoods</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              <li><Link href="/neighbourhoods/yorkville" className="hover:text-[color:var(--accent)] transition-colors">Yorkville</Link></li>
              <li><Link href="/neighbourhoods/king-west" className="hover:text-[color:var(--accent)] transition-colors">King West</Link></li>
              <li><Link href="/neighbourhoods/annex" className="hover:text-[color:var(--accent)] transition-colors">The Annex</Link></li>
              <li><Link href="/neighbourhoods" className="hover:text-[color:var(--accent)] transition-colors">All neighbourhoods →</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[color:var(--foreground)] uppercase tracking-wider mb-3">Tools</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              <li><Link href="/mortgage-calculator" className="hover:text-[color:var(--accent)] transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/open-houses" className="hover:text-[color:var(--accent)] transition-colors">Open Houses</Link></li>
              <li><Link href="/account/favorites" className="hover:text-[color:var(--accent)] transition-colors">Saved Listings</Link></li>
              <li><Link href="/account/saved-searches" className="hover:text-[color:var(--accent)] transition-colors">Saved Searches</Link></li>
              <li><Link href="/contact" className="hover:text-[color:var(--accent)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[color:var(--foreground)] uppercase tracking-wider mb-3">Company</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted)]">
              <li><Link href="/about" className="hover:text-[color:var(--accent)] transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-[color:var(--accent)] transition-colors">Market Updates</Link></li>
              <li><a href="mailto:azimipour@gmail.com" className="hover:text-[color:var(--accent)] transition-colors">Contact</a></li>
              <li><Link href="/dashboard" className="hover:text-[color:var(--accent)] transition-colors">Agent Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[color:var(--muted)]">
            © {YEAR} Condohill Real Estate · Toronto, Ontario · Not intended to solicit buyers or sellers currently under contract.
          </p>
          <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
            <Link href="/privacy" className="hover:text-[color:var(--accent)] transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[color:var(--accent)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
