import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'Ontario’s 10-Day Cooling-Off Period for New Condos',
  description: 'How Ontario’s 10-day cooling-off period works for new condo purchases — when it starts, how to cancel, and how deposits are refunded.',
  alternates: { canonical: '/condo-cooling-off-period-ontario' },
}

const BODY_HTML = `
<p>Ontario's Condominium Act, 1998 gives purchasers of a new (pre-construction) condominium unit a 10-day cooling-off period — a window to cancel the Agreement of Purchase and Sale for any reason, without penalty. This right applies specifically to new condo purchases from a developer, not resale condos bought from an existing owner.</p>

<h2>When Does the 10-Day Clock Start?</h2>
<p>The cooling-off period begins on the later of two dates: the day you receive a fully signed copy of the Agreement of Purchase and Sale, or the day you receive the developer's disclosure statement along with the required Condo Buyers' Guide. These are calendar days, not business days — weekends and holidays count toward the 10 days, so the window is shorter in practice than 10 business days would be.</p>

<h2>How Do I Actually Cancel?</h2>
<p>To exercise this right, you or your lawyer must deliver written notice of rescission to the developer or the developer's lawyer within the 10-day window. A few things to know:</p>
<ul>
  <li>A verbal request, or a message passed only through your real estate agent, is not sufficient — the notice must go in writing to the developer or their lawyer directly.</li>
  <li>No specific form is required for the rescission notice.</li>
  <li>You don't need to provide a reason for cancelling.</li>
</ul>

<h2>Getting Your Deposit Back</h2>
<p>Once a valid rescission notice is delivered within the window, the developer is required to refund all money you've deposited, plus any applicable interest, without penalty or charge. This is a legal entitlement, not something the developer can refuse or negotiate down.</p>

<h2>A Second Rescission Window Is Possible</h2>
<p>If a developer later makes a material change to the disclosure statement after your original 10-day period has already passed, you may be entitled to a second 10-day rescission window, starting from the date you receive the amended disclosure. This protects buyers from being locked in if the developer significantly changes material terms of the project after the initial sale.</p>

<h2>Does This Apply to Resale Condos?</h2>
<p>No. The 10-day statutory cooling-off period applies specifically to new condominium units purchased directly from a developer under the Condominium Act's disclosure regime. A resale condo purchase follows the standard Agreement of Purchase and Sale process, with any right to back out governed by whatever conditions were negotiated into that specific offer — not a statutory cooling-off right.</p>

<h2>FAQ</h2>
<h3>How many days do I have to cancel a new condo purchase in Ontario?</h3>
<p>10 calendar days from the later of receiving the fully signed Agreement of Purchase and Sale, or the developer's disclosure statement and Condo Buyers' Guide.</p>
<h3>Do I need a reason to cancel during the cooling-off period?</h3>
<p>No — you can rescind for any reason, or no reason at all, as long as written notice is delivered within the 10-day window.</p>
<h3>Will I get my full deposit back if I cancel?</h3>
<p>Yes — the developer must refund all deposited money plus applicable interest, without penalty, once a valid rescission notice is delivered on time.</p>
<h3>Does the 10-day cooling-off period apply to resale condos?</h3>
<p>No — it applies only to new condominium units purchased from a developer, not resale purchases between private parties.</p>
<h3>What happens if the developer changes the project after my cooling-off period ends?</h3>
<p>If the developer makes a material change to the disclosure statement, you may be entitled to a second 10-day rescission window from the date you receive the amended disclosure.</p>

<p>Considering a pre-construction condo purchase? <a href="/pre-construction-condo-deposit-structure">See how deposit structures typically work</a>, or browse <a href="/condos-for-sale/toronto">current Toronto condo listings</a> to compare resale options.</p>

<h2>Sources</h2>
<p>This guide reflects Ontario's <a href="https://www.ontario.ca/laws/statute/98c19" target="_blank" rel="noopener noreferrer">Condominium Act, 1998</a>. This is general information, not legal advice — consult a real estate lawyer before signing or attempting to rescind any agreement.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="Ontario’s 10-Day Cooling-Off Period for New Condos"
      summary="How the statutory 10-day rescission period works for new condo purchases — when it starts, how to cancel in writing, and deposit refunds."
      breadcrumbLabel="Condo Cooling-Off Period"
      path="/condo-cooling-off-period-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
