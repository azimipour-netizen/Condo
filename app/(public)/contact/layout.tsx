import type { Metadata } from 'next'

// page.tsx is a client component (interactive form), which can't export
// `metadata` itself — this route previously had none at all and silently
// inherited the root layout's homepage title/description/canonical.
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Condohill for questions about buying, selling, or renting in the Greater Toronto Area.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
