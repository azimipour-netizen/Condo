import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers'
import TopNav from '@/components/TopNav'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: 'Toronto Realty AI', template: '%s — Toronto Realty AI' },
  description: 'Find your next home in the Greater Toronto Area. Describe what you\'re looking for and our AI will find matching properties.',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <Providers>
          <TopNav />
          <div className="flex-1 min-h-0 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
