import Link from 'next/link'

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <p className="text-4xl font-bold text-[color:var(--foreground)] mb-2">404</p>
        <p className="text-[color:var(--text-muted)] mb-6">This listing is no longer available or doesn't exist.</p>
        <Link
          href="/"
          className="inline-block bg-[color:var(--accent)] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[color:var(--accent-hover)] transition-colors"
        >
          Search listings
        </Link>
      </div>
    </div>
  )
}
