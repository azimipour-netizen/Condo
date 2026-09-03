import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  // www.condohill.com and condohill.com both resolve to this same app
  // (confirmed live: identical 200 OK from the same nginx instance on both
  // hosts, no redirect between them) — the whole site was independently
  // crawlable and indexable under two hostnames, splitting canonical signal
  // and diluting authority between them. This is the app-level fix; no
  // nginx/edge config change needed since both hostnames already reach here.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.condohill.com' }],
        destination: 'https://condohill.com/:path*',
        permanent: true,
      },
    ]
  },
  // Stops the framework fingerprint (`X-Powered-By: Next.js`) from leaking
  // in every response header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'cdn.realtor.ca' },
      { protocol: 'https', hostname: '*.rets.io' },
      { protocol: 'https', hostname: '*.mlsmedia.ca' },
      { protocol: 'https', hostname: 'trreb-image.ampre.ca' },
      { protocol: 'https', hostname: '*.ampre.ca' },
    ],
  },
};

export default nextConfig;
