import type { Metadata } from 'next'
import SearchHero from '@/components/ai/SearchHero'

export const metadata: Metadata = {
  title: 'Toronto Realty AI',
  description: 'Describe your ideal home and our AI finds matching properties across the GTA.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <SearchHero />
    </main>
  )
}
