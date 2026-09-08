import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'What Happens If a Home Inspection Finds a Problem?',
  description: 'What your options actually are when a home inspection finds an issue in Ontario — negotiating repairs, a price reduction, or walking away.',
  alternates: { canonical: '/home-inspection-finds-a-problem' },
}

const BODY_HTML = `
<p>Finding a problem during a home inspection isn't automatically a deal-breaker — it's information, and what you do with it depends on the severity of the issue and how your offer was structured. This guide covers the realistic options buyers have when an inspection turns up something unexpected.</p>

<h2>Your Options Depend on Your Offer's Conditions</h2>
<p>If your Agreement of Purchase and Sale included a home inspection condition — a set number of business days to have the property inspected and satisfy yourself with the results — you generally have three paths once an issue is found:</p>
<ol>
  <li><strong>Negotiate for repairs or a price reduction.</strong> You can go back to the seller and ask that a specific issue be fixed before closing, or request a reduction in price to account for the cost of fixing it yourself after closing.</li>
  <li><strong>Proceed as-is.</strong> If the issue is minor or you're comfortable handling it yourself, you can waive the condition and proceed with the purchase unchanged.</li>
  <li><strong>Walk away.</strong> If the inspection condition is still open and unsatisfied, you can use it to exit the agreement entirely, with your deposit returned, since the deal was never made firm.</li>
</ol>
<p>Without a home inspection condition in your offer — common in competitive markets where buyers waive conditions to be more competitive — you don't have this negotiating leverage, and any issue found becomes something you're responsible for after closing regardless. This is exactly why <a href="/blog/do-i-need-a-home-inspection">a home inspection condition</a> matters, particularly in a market where waiving conditions is common.</p>

<h2>How Serious Is the Issue, Really?</h2>
<p>Not every finding warrants renegotiating. A home inspector's report typically distinguishes between:</p>
<ul>
  <li><strong>Cosmetic or minor maintenance items</strong> — things like a dripping faucet or worn caulking, expected in almost any home and not usually worth renegotiating over.</li>
  <li><strong>Moderate issues</strong> — an aging furnace nearing the end of its expected life, or a roof that will need replacement within a few years — worth factoring into your decision, even if not urgent.</li>
  <li><strong>Major or safety issues</strong> — structural problems, active water infiltration, knob-and-tube wiring, or similar issues that carry real cost or safety implications and typically justify a serious conversation with the seller.</li>
</ul>

<h2>How to Approach Renegotiating</h2>
<p>If you decide to negotiate, get at least one repair estimate for the specific issue before going back to the seller — a vague request based only on the inspector's description is weaker than a request backed by an actual contractor quote. Your realtor can help frame the request and gauge how much room there realistically is to negotiate, which depends heavily on how competitive the market was for that specific property.</p>

<h2>What If There's No Inspection Condition?</h2>
<p>If your offer didn't include an inspection condition, you can still arrange a pre-inspection before submitting an offer in some cases, or do a walk-through inspection immediately after an unconditional offer is accepted purely for your own information — though in the latter case, you have no legal ability to renegotiate based on what's found, since the deal is already firm. Buyers in highly competitive markets sometimes accept this trade-off deliberately to make their offer more attractive, understanding the risk involved.</p>

<h2>FAQ</h2>
<h3>Can I back out of a home purchase if the inspection finds a problem?</h3>
<p>Yes, if your offer included a home inspection condition that hasn't yet been satisfied or waived — you can use it to exit the agreement with your deposit returned.</p>
<h3>Can I ask the seller to fix a problem found during inspection?</h3>
<p>Yes — this is a common outcome. You or your realtor can request specific repairs or a price reduction, though the seller isn't obligated to agree, and the outcome often depends on how competitive the original offer process was.</p>
<h3>What if I already waived my inspection condition?</h3>
<p>Without an open inspection condition, you generally don't have contractual leverage to renegotiate based on what an inspection finds after the fact — this is the main risk of waiving the condition in a competitive offer.</p>
<h3>Is every issue found in an inspection a big deal?</h3>
<p>No — most inspections turn up some minor, expected maintenance items in any home. The question is whether an issue is moderate or major enough to justify negotiating, which your inspector's report and a contractor estimate can help clarify.</p>
<h3>Should I get a repair estimate before negotiating with the seller?</h3>
<p>Yes — a specific contractor estimate for the exact issue gives your negotiating request more weight than a general concern based on the inspector's description alone.</p>

<p>Working through an inspection finding on a current offer? <a href="/contact">Contact our team</a> for guidance specific to your situation.</p>

<h2>Sources</h2>
<p>This is general information, not legal advice — consult your realtor and, where appropriate, a real estate lawyer for guidance specific to your Agreement of Purchase and Sale.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="What Happens If a Home Inspection Finds a Problem?"
      summary="Your real options when an inspection turns up an issue — negotiating repairs, a price reduction, or walking away, depending on your offer’s conditions."
      breadcrumbLabel="Inspection Finds a Problem"
      path="/home-inspection-finds-a-problem"
      bodyHtml={BODY_HTML}
    />
  )
}
