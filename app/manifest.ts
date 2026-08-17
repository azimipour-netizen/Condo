import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Condohill — Toronto Real Estate',
    short_name: 'Condohill',
    description: 'Find homes, condos, and investment properties across the GTA.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#F5F7FA',
    theme_color: '#0D9488',
    categories: ['real estate', 'lifestyle', 'business'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'New Search',
        short_name: 'Search',
        description: 'Start a new property search',
        url: '/',
        icons: [{ src: '/icons/icon.svg', sizes: 'any' }],
      },
      {
        name: 'Saved Properties',
        short_name: 'Saved',
        description: 'View your saved listings',
        url: '/account/favorites',
        icons: [{ src: '/icons/icon.svg', sizes: 'any' }],
      },
    ],
    screenshots: [],
  }
}
