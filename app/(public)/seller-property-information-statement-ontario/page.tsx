import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'What Is a Seller Property Information Statement (SPIS)?',
  description: 'What Ontario’s Seller Property Information Statement (SPIS) covers, why it’s optional, and what buyers and sellers should know before relying on one.',
  alternates: { canonical: '/seller-property-information-statement-ontario' },
}

const BODY_HTML = `
<p>A Seller Property Information Statement (SPIS) is a standardized Ontario real estate form in which a seller discloses known facts about a property's condition — things like past water damage, renovations done without permits, or known defects. Unlike a status certificate for condos, an SPIS is entirely optional in Ontario, and whether one is provided varies by transaction.</p>

<h2>What Does an SPIS Cover?</h2>
<p>A completed SPIS typically addresses questions across several categories:</p>
<ul>
  <li><strong>Structural issues</strong> — known foundation problems, roof leaks, or past water damage.</li>
  <li><strong>Systems</strong> — the age and condition of the furnace, electrical panel, plumbing, and other major systems.</li>
  <li><strong>Renovations and permits</strong> — whether work was done with a building permit, which matters for both legal compliance and insurance purposes.</li>
  <li><strong>Environmental concerns</strong> — known issues like a history of flooding, mould, or underground oil tanks.</li>
  <li><strong>Legal matters</strong> — known encroachments, easements, or disputes affecting the property.</li>
</ul>

<h2>Why Is the SPIS Optional?</h2>
<p>Ontario doesn't legally require sellers to complete an SPIS, and many listing agents actively advise sellers against providing one — a completed SPIS can create legal exposure if a disclosed or undisclosed issue later becomes a dispute, since the document creates a written record a buyer can point to after closing. As a result, many Ontario resale transactions proceed without an SPIS at all.</p>

<h2>What This Means for Buyers</h2>
<p>Because an SPIS is optional and often not provided, buyers shouldn't rely on its absence as evidence a property has no issues — it simply means the seller chose not to complete the form, which is common practice, not a red flag by itself. This is exactly why a home inspection remains the buyer's primary tool for understanding a property's actual condition, rather than depending on seller disclosure. See <a href="/blog/do-i-need-a-home-inspection">why a home inspection matters</a> for more on this.</p>

<h2>If a Seller Does Provide One</h2>
<p>When an SPIS is provided and signed, it becomes part of the transaction record, and a seller can be held liable for statements later proven false — but only for what was actually asked and answered, not for every possible issue with the property. A seller answering "unknown" to a question isn't the same as a false statement, and buyers should read an SPIS carefully rather than treating it as a full guarantee of condition.</p>

<h2>FAQ</h2>
<h3>Is a Seller Property Information Statement mandatory in Ontario?</h3>
<p>No — an SPIS is entirely optional, and many Ontario sellers, on their agent's advice, choose not to provide one.</p>
<h3>Can I sue a seller if an SPIS turns out to be false?</h3>
<p>Potentially, if a seller made a knowingly false statement on a completed SPIS that caused you provable harm — but this is a legal question specific to your situation, and you should consult a real estate lawyer rather than assume based on general information.</p>
<h3>Should I still get a home inspection if there's no SPIS?</h3>
<p>Yes — a home inspection is your own independent assessment of a property's condition and is important whether or not a seller provides an SPIS.</p>
<h3>Does a condo status certificate replace an SPIS?</h3>
<p>No — a status certificate discloses the condo corporation's financial and legal condition and is a separate, distinct document from an SPIS, which addresses the specific unit or property.</p>
<h3>Why do agents advise sellers against completing an SPIS?</h3>
<p>A completed SPIS creates a written record that can expose a seller to liability if a disclosed issue is later disputed, which is why many listing agents recommend against providing one, particularly for older homes with an uncertain history.</p>

<p>Working with buyers or sellers who need clarity on disclosure? <a href="/contact">Contact our team</a>, or browse <a href="/homes-for-sale/toronto">current GTA listings</a>.</p>

<h2>Sources</h2>
<p>This is general information, not legal advice. For guidance specific to a transaction, consult a licensed Ontario real estate lawyer.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="What Is a Seller Property Information Statement (SPIS)?"
      summary="What an SPIS covers, why it’s optional in Ontario, and why a home inspection matters regardless of whether one is provided."
      breadcrumbLabel="Seller Property Information Statement"
      path="/seller-property-information-statement-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
