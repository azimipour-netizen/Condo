"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin, Mail } from "lucide-react";

const YEAR = new Date().getFullYear();

const NAV = [
  {
    heading: "Explore",
    links: [
      { label: "Homes for Sale", href: "/?transactionType=sale" },
      { label: "Homes for Rent", href: "/?transactionType=lease" },
      { label: "Condos", href: "/?propertyType=condo" },
      { label: "Detached Homes", href: "/?propertyType=detached" },
      { label: "Open Houses", href: "/open-houses" },
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
      { label: "Agent Login", href: "/dashboard" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, href: "https://instagram.com/condohill", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/condohill", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com/company/condohill", label: "LinkedIn" },
  { icon: Mail, href: "mailto:condohill.inc@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[color:var(--background)]">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
          style={{ backgroundColor: "#0D9488" }}
        >
          {/* Subtle gradient columns */}
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
            {/* Brand column */}
            <div className="flex flex-col space-y-6 sm:space-y-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">Condohill</span>
              </div>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-sm font-medium">
                Toronto&apos;s trusted real estate platform. Discover homes, condos, and investment
                properties across the city&apos;s most sought-after neighbourhoods.
              </p>

              <div className="flex items-center gap-4">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D9488] hover:bg-neutral-100 transition-colors duration-200"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
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
            <Link href="/privacy" className="hover:text-[color:var(--accent)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[color:var(--accent)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
