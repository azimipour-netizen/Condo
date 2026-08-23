import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers'
import TopNav from '@/components/TopNav'
import FooterWrapper from '@/components/FooterWrapper'
import CookieBanner from '@/components/CookieBanner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://condohill.com'

export const metadata: Metadata = {
  title: { default: 'Condohill — Toronto Real Estate', template: '%s | Condohill' },
  description: 'Find your next home in the Greater Toronto Area. AI-powered search for condos, detached homes, townhouses and more.',
  metadataBase: new URL(BASE),
  openGraph: {
    siteName: 'Condohill',
    type: 'website',
    locale: 'en_CA',
    title: 'Condohill — Toronto Real Estate',
    description: 'Find your next home in the Greater Toronto Area. AI-powered search for condos, detached homes, townhouses and more.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Condohill — Toronto Real Estate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Condohill — Toronto Real Estate',
    description: 'Find your next home in the Greater Toronto Area. AI-powered search for condos, detached homes, townhouses and more.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Condohill',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh flex flex-col">
        <Providers>
          <TopNav />
          <div className="flex-1 min-h-0 flex flex-col">{children}</div>
          <FooterWrapper />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
