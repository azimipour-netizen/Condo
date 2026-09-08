import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'What Is a Buyer Representation Agreement in Ontario?',
  description: 'What a Buyer Representation Agreement (BRA) is, why Ontario realtors require one, what it covers, and what to check before signing Form 300.',
  alternates: { canonical: '/buyer-representation-agreement-ontario' },
}

const BODY_HTML = `
<p>A Buyer Representation Agreement (BRA) is the written contract between you and a real estate brokerage that formally establishes your realtor's obligation to represent your interests when buying a home in Ontario. It's governed by the Real Estate Council of Ontario (RECO), and most brokerages now ask buyers to sign one at the start of a home search rather than waiting until an offer is ready.</p>

<h2>Why Do I Need to Sign a BRA?</h2>
<p>Ontario real estate law requires a brokerage to have a written representation agreement with a buyer before certain steps, including making an offer on their behalf. Without a signed BRA, an agent showing you homes may not have a formal, enforceable obligation to represent your interests — the agreement is what converts a casual house-hunting relationship into a legally defined one with fiduciary duties attached.</p>

<h2>What Does a BRA Actually Cover?</h2>
<p>The standard Ontario BRA is Form 300, and it typically sets out:</p>
<ul>
  <li><strong>The term of the agreement</strong> — how long the representation lasts, often 30, 60, or 90 days, sometimes longer.</li>
  <li><strong>Geographic scope</strong> — the area the agreement covers, since some agreements are limited to a specific city or region.</li>
  <li><strong>Commission structure</strong> — how much the buyer's agent is paid if you purchase a property during the agreement's term, and how that's handled if the seller isn't offering buyer-agent compensation.</li>
  <li><strong>The agent's role</strong> — including what happens if the same brokerage also represents the seller of a property you want to buy (multiple representation), a scenario with its own separate disclosure rules under Ontario's Trust in Real Estate Services Act (TRESA).</li>
</ul>

<h2>Designated Representation: A 2023 Change</h2>
<p>Since December 1, 2023, Ontario introduced designated representation as an option — under this model, one specific agent at a brokerage serves as your designated representative, while other agents at the same brokerage are expected to remain impartial, rather than the whole brokerage being bound to your interests. This is worth asking about explicitly when signing a BRA, since it changes what "your side" of the brokerage actually means if a colleague at the same firm represents a seller you're interested in.</p>

<h2>What to Check Before Signing</h2>
<ul>
  <li><strong>The exact end date</strong> — don't sign an open-ended term without a clear expiry you're comfortable with.</li>
  <li><strong>Whether it's exclusive</strong> — most BRAs commit you to working with that one brokerage for the term, meaning you generally can't simultaneously use a different agent to buy a property during that period.</li>
  <li><strong>How commission is handled if the seller doesn't offer buyer-agent compensation</strong> — this has become a more common negotiating point since TRESA's 2023 changes, and you should understand upfront whether you could be responsible for any portion of your agent's commission.</li>
</ul>

<h2>Can I Cancel a BRA?</h2>
<p>Terms for ending a BRA early are set out in the agreement itself and are negotiable — some brokerages will release a buyer from the agreement on request, particularly if the relationship isn't working, while others hold firm to the agreed term. Ask directly about the brokerage's policy before signing if this is a concern.</p>

<h2>FAQ</h2>
<h3>Is a Buyer Representation Agreement mandatory in Ontario?</h3>
<p>A brokerage is required to have a written representation agreement with a buyer before taking certain steps on their behalf, such as making an offer — in practice, most brokerages ask for a signed BRA before showing homes.</p>
<h3>What is Form 300 in Ontario real estate?</h3>
<p>Form 300 is the standard Buyer Representation Agreement form used across Ontario, setting out the term, commission, geographic scope, and the agent's role.</p>
<h3>Can I work with more than one realtor at the same time in Ontario?</h3>
<p>Generally no, if you've signed an exclusive BRA — most agreements commit you to one brokerage for the stated term.</p>
<h3>What is designated representation?</h3>
<p>Introduced in Ontario on December 1, 2023, designated representation means one specific agent at a brokerage represents you directly, while other agents at that brokerage are expected to remain impartial rather than automatically representing your interests too.</p>
<h3>Who pays my buyer's agent's commission?</h3>
<p>This varies by transaction and has become more explicitly negotiated since TRESA's 2023 changes — confirm the commission arrangement in your BRA before signing, including what happens if the seller doesn't offer buyer-agent compensation. See our guide to <a href="/blog/who-pays-real-estate-commission-when-buying">who pays commission when buying</a> for more detail.</p>

<p>Ready to start your search with a clear understanding of how representation works? <a href="/contact">Contact our team</a> or browse <a href="/homes-for-sale/toronto">current GTA listings</a> to get started.</p>

<h2>Sources</h2>
<p>This guide reflects the Real Estate Council of Ontario's (RECO) framework for buyer representation and Ontario's <a href="https://www.reco.on.ca/" target="_blank" rel="noopener noreferrer">Trust in Real Estate Services Act, 2023</a>. This is general information, not legal advice — consult a licensed Ontario realtor or lawyer for guidance specific to your situation.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="What Is a Buyer Representation Agreement in Ontario?"
      summary="What a BRA covers, why Ontario brokerages require one, and what to check — including 2023's designated representation option — before signing."
      breadcrumbLabel="Buyer Representation Agreement"
      path="/buyer-representation-agreement-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
