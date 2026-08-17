export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="aspect-[4/3] bg-[color:var(--border)] rounded-2xl mb-4" />
          <div className="h-8 bg-[color:var(--border)] rounded w-2/3 mb-3" />
          <div className="h-4 bg-[color:var(--border)] rounded w-1/3 mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 bg-[color:var(--border)] rounded" style={{ width: `${85 - i * 7}%` }} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-[color:var(--border)] rounded-2xl" />
          <div className="h-32 bg-[color:var(--border)] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
