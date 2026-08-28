"use client";

import Image from "next/image";
import Link from "next/link";

const YEAR = new Date().getFullYear();

const NAV = [
  {
    heading: "Explore",
    links: [
      { label: "Homes for Sale", href: "/homes-for-sale" },
      { label: "Homes for Rent", href: "/homes-for-rent" },
      { label: "Condos for Sale", href: "/condos-for-sale" },
      { label: "Detached Homes", href: "/detached-homes-for-sale" },
      { label: "Townhouses", href: "/townhouses-for-sale" },
    ],
  },
  {
    heading: "Neighbourhoods",
    links: [
      { label: "Yorkville", href: "/neighbourhoods/yorkville" },
      { label: "King West", href: "/neighbourhoods/king-west" },
      { label: "The Annex", href: "/neighbourhoods/annex" },
      { label: "All neighbourhoods →", href: "/neighbourhoods" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Market Updates", href: "/blog" },
      { label: "Mortgage Calculator", href: "/mortgage-calculator" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/condohill",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/condohill",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/condohill",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:condohill.inc@gmail.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

export function Footer5() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[color:var(--background)]">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
          style={{ backgroundColor: "#1B2D55" }}
        >
          {/* Gradient columns */}
          <div className="absolute inset-0 flex flex-row items-end justify-center pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => {
              const distFromCenter = Math.abs(i - 4);
              const height = Math.max(20, 90 - distFromCenter * 15);
              const opacity = Math.max(0.1, 1.0 - distFromCenter * 0.2);
              return (
                <div
                  key={i}
                  className="flex-1 relative"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, rgba(0,0,0,${opacity * 0.25}) 0%, rgba(0,0,0,0) 100%)`,
                  }}
                />
              );
            })}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="flex flex-col space-y-6 sm:space-y-8">
              <div className="flex items-center">
                <Image
                  src="/logo4.jpg"
                  alt="RE/MAX Find Properties Brokerage"
                  width={480}
                  height={140}
                  className="w-72 sm:w-[420px] h-auto rounded-lg"
                  priority
                />
              </div>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-sm font-medium">
                Toronto&apos;s trusted real estate platform. Discover homes, condos, and investment
                properties across the GTA&apos;s most sought-after neighbourhoods.
              </p>

              <p className="text-sm text-white/70 leading-relaxed">
                45 Harbour Square #4<br />
                Toronto, ON, Canada<br />
                <a href="tel:9059096600" className="hover:text-white transition-colors">905-909-6600</a>
              </p>

              <div className="flex items-center gap-4">
                {SOCIALS.map(({ svg, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D9488] hover:bg-neutral-100 transition-colors duration-200"
                    aria-label={label}
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
              {NAV.map(({ heading, links }) => (
                <div key={heading} className="flex flex-col space-y-4">
                  <h3 className="text-lg font-medium tracking-tight text-white/90">{heading}</h3>
                  <ul className="space-y-3">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between w-full gap-3 text-sm text-[color:var(--text-muted)] font-medium">
          <p>© {YEAR} Condohill Real Estate · Toronto, Ontario · Not intended to solicit buyers or sellers currently under contract.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[color:var(--accent)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[color:var(--accent)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer5;
