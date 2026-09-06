'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Turnstile, { TURNSTILE_ENABLED } from '@/components/security/Turnstile'

// Client-only: MapLibre touches window/canvas at import time.
const SinglePropertyMap = dynamic(() => import('@/components/map/SinglePropertyMap'), { ssr: false })

// 45 Harbour Square #4, Toronto — geocoded once (OpenStreetMap Nominatim,
// street-level match, place_rank 30) since this is a fixed office address,
// not something to re-resolve on every page load. lib/geo/geocode.ts is
// deliberately FSA-centroid only (postal-code precision, chosen for the
// property sync to avoid re-introducing the Google Geocoding API billing
// risk it replaced) — too coarse to pin an actual building.
const OFFICE = { lat: 43.6406408, lng: -79.3773371 }

/**
 * Four named contacts, per the user's request ("I will provide the photo
 * and phone number of 4 people"). Real photos/names/direct numbers are
 * pending — placeholder here is an honest "pending" label and an
 * initials-style avatar (the same pattern TopNav.tsx already uses for a
 * signed-in user), never a stock photo standing in for a real, named
 * person who doesn't exist on this team.
 */
const CONTACTS = [
  { role: 'General enquiries', name: 'Name pending', phone: '9059096600', avatar: null as string | null },
  { role: 'Buying', name: 'Name pending', phone: '9059096600', avatar: null as string | null },
  { role: 'Selling', name: 'Name pending', phone: '9059096600', avatar: null as string | null },
  { role: 'Rentals', name: 'Name pending', phone: '9059096600', avatar: null as string | null },
]

const fieldClass =
  'w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-surface-2)] px-4 py-3 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-faint)] transition-colors duration-200 focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/20'
const labelClass = 'mb-2 block text-sm font-medium text-[color:var(--foreground)]'

function fmtPhone(digits: string) {
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function ContactPage() {
  const reduce = useReducedMotion()

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  // Honeypot: hidden from real users; bots that autofill every field trip it.
  // NOT the same thing as a visible "Company" field — the template this page
  // is based on has one of those, but that name collides with this honeypot
  // param on the API side, so it was dropped rather than silently marking
  // every real visitor who typed their company name as a bot.
  const [company, setCompany] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setErrorMsg('Please complete the verification check.')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken, company }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'Something went wrong. Please try again or email us directly.')
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setErrorMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
    }
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }
  const nudge: Variants = {
    hover: { x: 2, y: -2, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="w-full bg-[color:var(--background)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <nav className="text-sm text-[color:var(--text-muted)] mb-10">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Contact</span>
        </nav>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h1
              variants={item}
              className="font-serif text-4xl leading-[1.1] tracking-tight text-[color:var(--foreground)] sm:text-5xl"
            >
              Reach the right agent, <em className="italic">first time</em>.
            </motion.h1>

            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {CONTACTS.map(c => (
                <motion.div key={c.role} variants={item}>
                  <h3 className="font-serif text-lg italic text-[color:var(--text-muted)]">
                    {c.role}
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-[color:var(--accent)] text-white text-sm font-bold flex items-center justify-center shrink-0 border border-[color:var(--border)]">
                      {c.role[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[color:var(--foreground)]">
                        {c.name}
                      </p>
                      <motion.a
                        href={`tel:${c.phone}`}
                        whileHover={reduce ? undefined : 'hover'}
                        className="mt-0.5 inline-flex max-w-full cursor-pointer items-center gap-1 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                      >
                        <span className="truncate">{fmtPhone(c.phone)}</span>
                        <motion.span variants={nudge} className="shrink-0">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </motion.span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={item}
              className="mt-12 grid gap-x-8 gap-y-10 border-t border-[color:var(--border)] pt-10 sm:grid-cols-2"
            >
              <div>
                <h3 className="font-serif text-lg italic text-[color:var(--text-muted)]">
                  Find us
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--foreground)]">
                  45 Harbour Square #4
                  <br />
                  Toronto, ON
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg italic text-[color:var(--text-muted)]">
                  Talk to us
                </h3>
                <a
                  href="tel:9059096600"
                  className="mt-4 inline-block cursor-pointer text-sm text-[color:var(--foreground)] transition-colors hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                >
                  905-909-6600
                </a>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
                  We&apos;ll respond within one business day.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="mt-10 rounded-2xl overflow-hidden border border-[color:var(--border)] h-72">
              <SinglePropertyMap lat={OFFICE.lat} lng={OFFICE.lng} title="Condohill — 45 Harbour Square #4" />
            </motion.div>
          </motion.div>

          {status === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] p-8 text-center sm:p-10"
            >
              <div className="text-4xl mb-3">✓</div>
              <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">Message sent!</h2>
              <p className="text-sm text-[color:var(--text-muted)]">
                We&apos;ll get back to you at {form.email} within one business day.
              </p>
              <Link href="/" className="inline-block mt-6 text-sm text-[color:var(--accent)] hover:underline">
                Back to listings →
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] p-6 sm:p-8 lg:p-10"
            >
              <h2 className="font-serif text-3xl leading-[1.15] tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                Or fill in the form: <br />
                we&apos;ll reach out.
              </h2>

              <div className="mt-8 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c11-name" className={labelClass}>Full name *</label>
                    <input
                      id="c11-name" type="text" autoComplete="name" placeholder="Jane Smith"
                      required value={form.name} onChange={set('name')} className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="c11-email" className={labelClass}>Email *</label>
                    <input
                      id="c11-email" type="email" autoComplete="email" placeholder="jane@example.com"
                      required value={form.email} onChange={set('email')} className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c11-phone" className={labelClass}>Phone</label>
                    <input
                      id="c11-phone" type="tel" autoComplete="tel" placeholder="416-555-0100"
                      value={form.phone} onChange={set('phone')} className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="c11-subject" className={labelClass}>Type of enquiry *</label>
                    <div className="relative">
                      <select
                        id="c11-subject" required value={form.subject} onChange={set('subject')}
                        className={`${fieldClass} cursor-pointer appearance-none pr-10 invalid:text-[color:var(--text-faint)]`}
                      >
                        <option value="" disabled>Please select</option>
                        <option value="Buying inquiry">Buying inquiry</option>
                        <option value="Selling inquiry">Selling inquiry</option>
                        <option value="Rental inquiry">Rental inquiry</option>
                        <option value="Open house question">Open house question</option>
                        <option value="Market information">Market information</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="c11-message" className={labelClass}>Message *</label>
                  <textarea
                    id="c11-message" rows={5} placeholder="Tell us how we can help..."
                    required value={form.message} onChange={set('message')} className={`${fieldClass} resize-none`}
                  />
                </div>
              </div>

              {/* Honeypot — visually hidden, never shown to real users */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="c11-company">Company</label>
                <input
                  id="c11-company" name="company" type="text" tabIndex={-1} autoComplete="off"
                  value={company} onChange={e => setCompany(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <Turnstile onVerify={setTurnstileToken} />
              </div>

              {errorMsg && <p className="mt-4 text-sm text-red-500">{errorMsg}</p>}

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={reduce || status === 'sending' ? undefined : { y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="mt-6 w-full cursor-pointer rounded-full bg-[color:var(--accent)] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}
