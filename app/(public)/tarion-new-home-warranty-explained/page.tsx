import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'Tarion New Home Warranty: What’s Actually Covered',
  description: 'How Tarion’s new home warranty works in Ontario — the 1, 2, and 7-year coverage periods, deposit protection limits, and the 2026 registration change.',
  alternates: { canonical: '/tarion-new-home-warranty-explained' },
}

const BODY_HTML = `
<p>Tarion is Ontario's new home warranty program, providing mandatory protection for buyers of new homes and condos built by licensed builders and developers. Every new home and condo unit in Ontario is required to be enrolled, giving buyers legal recourse if a builder's work doesn't meet the required standard.</p>

<h2>The Three Warranty Periods</h2>
<p>Tarion's coverage is structured across three time periods, each addressing different types of issues:</p>
<table>
  <thead><tr><th>Warranty period</th><th>What it covers</th></tr></thead>
  <tbody>
    <tr><td>1-year warranty</td><td>General construction defects, unauthorized substitutions, and whether the home is fit for habitation</td></tr>
    <tr><td>2-year warranty</td><td>Defects and Ontario Building Code violations related to health and safety, including water penetration issues</td></tr>
    <tr><td>7-year warranty</td><td>Major structural defects only</td></tr>
  </tbody>
</table>

<h2>Coverage Limits</h2>
<p>Tarion's warranty protection has a maximum coverage limit of $300,000 per home. For condominiums, the building's common elements carry separate coverage of up to $2.5 million, in addition to individual unit coverage.</p>

<h2>Deposit Protection</h2>
<p>Tarion also protects the deposit you pay a builder before closing, though the limit differs by property type:</p>
<ul>
  <li><strong>Freehold homes:</strong> deposits protected up to $100,000.</li>
  <li><strong>Condominiums:</strong> deposits over $20,000 are separately protected through trust and excess-deposit provisions under the Condominium Act, 1998, rather than through Tarion's freehold deposit fund directly.</li>
</ul>

<h2>Important 2026 Change: Freehold Registration Deadline</h2>
<p>For purchase agreements signed on or after April 1, 2026, freehold buyers need to register their purchase with Tarion within 45 days of signing to qualify for the maximum deposit protection. Buyers who register late, or don't register at all, fall under a separate, more limited protection fund — making this registration step something buyers and their lawyers need to actively track rather than assume happens automatically.</p>

<h2>How to Make a Tarion Claim</h2>
<p>If you discover a covered defect, you submit a claim directly to Tarion within the applicable warranty period (1, 2, or 7 years, depending on the issue), rather than pursuing the builder directly through small claims court in most cases. Tarion investigates the claim and can order the builder to fix the issue or, in some cases, arrange for repairs and seek reimbursement from the builder itself.</p>

<h2>FAQ</h2>
<h3>What is the maximum Tarion warranty coverage for a new home?</h3>
<p>$300,000 per home, with condominium common elements separately covered up to $2.5 million.</p>
<h3>Is Tarion warranty mandatory for new homes in Ontario?</h3>
<p>Yes — every new home and condo unit built by a licensed Ontario builder or developer is required to be enrolled in the Tarion program.</p>
<h3>How much of my deposit is protected if a builder goes out of business?</h3>
<p>Freehold home deposits are protected up to $100,000. Condo deposits over $20,000 are protected separately under the Condominium Act, 1998's trust provisions.</p>
<h3>What is the 2026 Tarion registration deadline?</h3>
<p>For agreements signed on or after April 1, 2026, freehold buyers should register with Tarion within 45 days of signing to qualify for maximum deposit protection.</p>
<h3>Does Tarion cover cosmetic issues?</h3>
<p>Tarion's coverage is structured around construction defects, code violations, and structural issues within specific timeframes — always review current Tarion guidelines for what qualifies, since not every issue with a new home is covered.</p>

<p>Considering a pre-construction purchase? See our <a href="/pre-construction-condo-deposit-structure">guide to typical deposit structures</a>, or browse <a href="/homes-for-sale/toronto">current GTA listings</a> for resale alternatives.</p>

<h2>Sources</h2>
<p>This guide reflects information published by <a href="https://www.tarion.com/homeowners/the-new-home-warranty" target="_blank" rel="noopener noreferrer">Tarion Warranty Corporation</a>. Always confirm current coverage details directly with Tarion, since limits and rules can be updated. This is general information, not legal advice.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="Tarion New Home Warranty: What’s Actually Covered"
      summary="The 1, 2, and 7-year Tarion coverage periods, deposit protection limits, and the new 2026 freehold registration deadline."
      breadcrumbLabel="Tarion New Home Warranty"
      path="/tarion-new-home-warranty-explained"
      bodyHtml={BODY_HTML}
    />
  )
}
