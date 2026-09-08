import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'What Is a Bully Offer in Ontario Real Estate?',
  description: 'What a bully offer (pre-emptive offer) is, the disclosure rules sellers and agents must follow under TRESA, and the risks for buyers.',
  alternates: { canonical: '/what-is-a-bully-offer' },
}

const BODY_HTML = `
<p>A bully offer — also called a pre-emptive offer — is a purchase offer submitted before a seller's scheduled offer date, aiming to secure a home before other buyers get the chance to compete on the planned date. Bully offers typically pair a higher price with fewer conditions and a short deadline, a combination designed to pressure a seller into accepting immediately rather than waiting.</p>

<h2>How a Bully Offer Works</h2>
<p>When a listing is set up with a future offer date — a common strategy in competitive markets — a bully offer arrives before that date, forcing the seller to decide whether to accept it right away, wait for the scheduled date anyway, or use the early offer to prompt other interested buyers to submit early too. The buyer submitting a bully offer is betting that a strong enough offer, delivered before competition can organize, beats waiting for a bidding war.</p>

<h2>What Rules Apply Under Ontario Law?</h2>
<p>Ontario real estate rules require the listing agent to inform other potential buyers that a pre-emptive offer has been received, since those buyers may be planning to wait for the scheduled offer date. Under the Trust in Real Estate Services Act (TRESA), effective December 1, 2023, agents have a legal obligation to present all offers to their clients in a timely, transparent manner — meaning a bully offer must be disclosed to the seller promptly, not held back until the scheduled date.</p>

<h2>Can a Seller Refuse to Accept Early Offers?</h2>
<p>Yes. A seller can sign a written direction — using Form 244 — stating that they do not want to receive or be notified of any offers registered before the scheduled offer date. This effectively blocks the bully-offer strategy on that specific listing, and sellers who want to avoid the pressure and complexity of pre-emptive offers can choose this option upfront.</p>

<h2>What Buyers Are Entitled to Know</h2>
<p>Under TRESA, a buyer who submits a written offer is entitled to know how many competing written offers exist, but is not automatically entitled to see their contents. A seller can choose, in writing, to share some or all details of competing offers — but if they do, that information must be shared equally with every offer-maker, not selectively.</p>

<h2>Risks of Submitting a Bully Offer</h2>
<ul>
  <li><strong>Fewer conditions, less protection</strong> — a bully offer's competitive edge usually comes from waiving financing and inspection conditions, which increases your risk if something goes wrong after the deal is firm.</li>
  <li><strong>Overpaying without full competitive information</strong> — since you're bidding before seeing what other buyers might offer, there's a real chance you paid more than necessary for a home you might have won anyway on the scheduled date.</li>
  <li><strong>No guarantee it works</strong> — a seller who's confident in their scheduled offer date may simply decline a bully offer and proceed as planned.</li>
</ul>

<h2>FAQ</h2>
<h3>What is the difference between a bully offer and a regular offer?</h3>
<p>A bully offer is submitted before a seller's scheduled offer date specifically to preempt competition, typically with a higher price, fewer conditions, and a short deadline, while a regular offer is submitted on or after the planned date alongside any other offers.</p>
<h3>Can a seller refuse a bully offer?</h3>
<p>Yes — a seller can sign Form 244 instructing their agent not to accept or even present any offers submitted before the scheduled offer date.</p>
<h3>Do I have to disclose that I received a bully offer to other buyers?</h3>
<p>Yes — Ontario rules require the listing agent to inform other potential buyers that a pre-emptive offer has been received, since those buyers may be planning around the original scheduled date.</p>
<h3>Is a bully offer legal in Ontario?</h3>
<p>Yes, bully offers are a legal and fairly common strategy in competitive Ontario markets, subject to the disclosure rules under TRESA and any seller-imposed restrictions like Form 244.</p>
<h3>Should I make a bully offer as a buyer?</h3>
<p>It depends on how strongly you want a specific property and your risk tolerance for waiving conditions — discuss the trade-offs with your realtor before deciding, since the strategy only works if the offer is genuinely strong enough to motivate an early acceptance.</p>

<p>Navigating a competitive offer situation? See our related guide on <a href="/multiple-offers-bidding-wars-gta">multiple offers and bidding wars in the GTA</a>, or <a href="/contact">contact our team</a> for guidance on your specific situation.</p>

<h2>Sources</h2>
<p>This guide reflects Ontario's <a href="https://www.reco.on.ca/" target="_blank" rel="noopener noreferrer">Trust in Real Estate Services Act, 2023 (TRESA)</a> disclosure requirements. This is general information, not legal advice.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="What Is a Bully Offer in Ontario Real Estate?"
      summary="How pre-emptive offers work, the TRESA disclosure rules that apply, and how sellers can block them with Form 244."
      breadcrumbLabel="Bully Offers Explained"
      path="/what-is-a-bully-offer"
      bodyHtml={BODY_HTML}
    />
  )
}
