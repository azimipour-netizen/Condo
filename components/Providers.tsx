'use client'

import { SessionProvider } from 'next-auth/react'
import CompareBar from '@/components/layout/CompareBar'
import { SavedProvider } from '@/components/SavedContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SavedProvider>
        {children}
        <CompareBar />
      </SavedProvider>
    </SessionProvider>
  )
}
