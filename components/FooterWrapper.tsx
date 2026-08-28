'use client'

import { usePathname } from 'next/navigation'
import { Footer5 as Footer } from './footer-5'

// Routes where footer should not appear (full-screen viewport experiences)
const NO_FOOTER_ROUTES = ['/search']

export default function FooterWrapper() {
  const pathname = usePathname()
  if (NO_FOOTER_ROUTES.some(r => pathname === r || pathname.startsWith(r + '?'))) return null
  return <Footer />
}
