'use client'

import { SessionProvider } from 'next-auth/react'
import CompareBar from '@/components/layout/CompareBar'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CompareBar />
    </SessionProvider>
  )
}
