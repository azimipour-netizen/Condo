import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'What Is a Condo Status Certificate? A Buyer’s Guide',
  description: 'What an Ontario condo status certificate actually contains, why buyers need one before waiving conditions, and what red flags to look for.',
  alternates: { canonical: '/condo-status-certificate-explained' },
}

const BODY_HTML = `
<p>A status certificate is a package of documents an Ontario condominium corporation is legally required to provide about a specific unit and the building as a whole. For a condo buyer, it's one of the most important pieces of due diligence in the entire purchase — arguably more important than a home inspection would be for a freehold property, since it reveals the building's financial and legal health in ways a walk-through never could.</p>

<h2>What's Actually in a Status Certificate</h2>
<p>A status certificate typically includes: the current reserve fund balance and the corporation's reserve fund study, the current budget and any planned fee increases, whether there are any outstanding legal proceedings involving the corporation, whether any special assessments have been levied or are being considered, the declaration, bylaws, and rules governing the building, and confirmation of whether the specific unit has any outstanding fees, liens, or violations.</p>

<h2>Why the Reserve Fund Matters Most</h2>
<p>The reserve fund is the corporation's savings account for major future repairs — roof replacement, elevator overhauls, building envelope work. A healthy reserve fund relative to the building's age and the reserve fund study's recommendations suggests the corporation is prepared for upcoming capital costs. A reserve fund that's significantly underfunded relative to what the study recommends is a real warning sign: it often means a special assessment (an unplanned, sometimes substantial one-time charge to all owners) is more likely down the road.</p>

<h2>Red Flags to Look For</h2>
<ul>
  <li>A reserve fund balance well below what the reserve fund study recommends for the building's age</li>
  <li>Ongoing or threatened litigation involving the corporation</li>
  <li>A recent or pending special assessment</li>
  <li>Frequent maintenance fee increases well above typical inflation</li>
  <li>A high proportion of units in arrears on their maintenance fees</li>
</ul>
<p>None of these automatically disqualify a purchase, but each is worth discussing with your realtor and, for anything unclear or concerning, a real estate lawyer before you remove your conditions.</p>

<h2>How and When to Get One</h2>
<p>Your realtor typically requests the status certificate on your behalf once your offer is accepted, usually as part of a status certificate review condition in your Agreement of Purchase and Sale. Ontario condominium corporations are required to provide it within a set number of days of a request, and there's a fee (typically around $100, though the corporation can charge more for certain requests) to obtain it.</p>

<h2>Should a Lawyer Review It?</h2>
<p>Yes — a status certificate runs to dozens or sometimes hundreds of pages of financial statements, bylaws, and legal disclosures, and it's genuinely difficult for a non-specialist to interpret the financial health signals correctly. Most real estate lawyers offer a status certificate review as part of, or alongside, their closing services, and it's worth the cost given how much financial exposure a poorly-funded reserve or ongoing litigation can represent.</p>

<h2>FAQ</h2>
<h3>What is a condo status certificate?</h3>
<p>A package of legally required documents about a specific unit and its condominium corporation — covering the reserve fund, budget, legal proceedings, and building rules — used by buyers to assess a building's financial and legal health before completing a purchase.</p>
<h3>Who provides the status certificate?</h3>
<p>The condominium corporation (usually through its property management company), typically requested by your realtor on your behalf after your offer is accepted.</p>
<h3>What's the biggest red flag in a status certificate?</h3>
<p>A reserve fund balance significantly below what the reserve fund study recommends for the building's age — it often signals a special assessment is more likely in the future.</p>
<h3>Should I have a lawyer review the status certificate?</h3>
<p>Yes — most real estate lawyers offer this as part of their services, and it's worth the cost given how difficult the financial disclosures are to interpret without specialized review.</p>
<h3>Does every condo purchase require a status certificate condition?</h3>
<p>It's not legally mandatory to include one, but it's strongly recommended for virtually every resale condo purchase — waiving it means buying without knowing the building's true financial position.</p>

<p>Ready to start your condo search? Browse <a href="/condos-for-sale">current GTA condos for sale on Condohill</a>.</p>

<h2>Sources</h2>
<p>Ontario's Condominium Act, 1998. This is general information, not legal advice — have your real estate lawyer review any status certificate before you waive conditions.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="What Is a Condo Status Certificate? A Buyer’s Guide"
      summary="What an Ontario condo status certificate contains, why buyers need one before waiving conditions, and what red flags to look for."
      breadcrumbLabel="Condo Status Certificate Explained"
      path="/condo-status-certificate-explained"
      bodyHtml={BODY_HTML}
    />
  )
}
