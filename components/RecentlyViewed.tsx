'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecent, type RecentEntry } from '@/lib/recently-viewed'

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentEntry[]>([])

  useEffect(() => {
    setItems(getRecent().slice(0, 6))
  }, [])

  if (items.length < 2) return null

  return (
    <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-sm font-semibold text-[color:var(--foreground)] mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {items.map(item => (
            <Link key={item.id} href={`/property/${item.id}`}
              className="group block bg-[color:var(--background)] border border-[color:var(--border)] rounded-xl overflow-hidden hover:border-[color:var(--accent)] transition-colors">
              <div className="aspect-video relative bg-[color:var(--bg-surface-2)]">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.title} fill sizes="200px" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[color:var(--text-faint)] text-xl">⊠</div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-[color:var(--foreground)] truncate leading-tight">{item.title}</p>
                <p className="text-xs text-[color:var(--accent)] font-semibold tabular-nums mt-0.5">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
