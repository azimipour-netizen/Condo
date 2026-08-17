'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-[color:var(--error)] leading-none mb-4">!</p>
        <h1 className="text-2xl font-semibold text-[color:var(--foreground)] mb-2">
          Something went wrong
        </h1>
        <p className="text-[color:var(--text-muted)] mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Our team has been notified. You can try refreshing the page or start a new search.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[color:var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[color:var(--accent-hover)] transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-[color:var(--border)] text-[color:var(--foreground)] text-sm font-medium rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors"
          >
            New search
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-[color:var(--text-faint)] font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
