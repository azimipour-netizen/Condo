import Link from 'next/link'

export const metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-[color:var(--accent)] leading-none mb-4">404</p>
        <h1 className="text-2xl font-semibold text-[color:var(--foreground)] mb-2">
          Page not found
        </h1>
        <p className="text-[color:var(--text-muted)] mb-8 text-sm leading-relaxed">
          The listing or page you&apos;re looking for may have been removed, sold, or the URL is incorrect.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors"
          >
            New search
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 border border-[color:var(--border)] text-[color:var(--foreground)] text-sm font-medium rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
