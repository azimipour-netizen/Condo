import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'Ontario Land Transfer Tax Rebate for First-Time Buyers',
  description: 'How the Ontario and Toronto first-time home buyer land transfer tax rebates work — eligibility, maximum amounts, and how to claim up to $8,475 combined.',
  alternates: { canonical: '/land-transfer-tax-rebate-first-time-buyers-ontario' },
}

const BODY_HTML = `
<p>Ontario charges land transfer tax on every property purchase, and buyers in Toronto pay a second, municipal land transfer tax on top of it. First-time buyers, however, can claim a rebate against both — reducing or eliminating the tax entirely on a typical purchase. Here's how the two rebates actually work.</p>

<h2>The Provincial Rebate</h2>
<p>Ontario offers a land transfer tax rebate of up to $4,000 for first-time home buyers. If your purchase price is below $368,000, the rebate covers the entire provincial land transfer tax, meaning you pay nothing. Above that price, you receive the full $4,000 rebate and pay tax only on the remainder.</p>

<h2>The Toronto Municipal Rebate</h2>
<p>Buyers purchasing within the City of Toronto pay an additional Municipal Land Transfer Tax (MLTT) — but first-time buyers can also claim a Toronto rebate of up to $4,475. If your purchase price is below $400,000, this rebate covers the entire municipal tax.</p>

<h2>Combined Savings</h2>
<p>A first-time buyer purchasing in Toronto can claim both rebates together — up to $4,000 provincially and up to $4,475 municipally, for a combined saving of up to $8,475. Buyers purchasing outside Toronto (anywhere else in the GTA) only pay the provincial tax, so only the $4,000 provincial rebate applies, since there's no municipal land transfer tax outside Toronto.</p>

<h2>Who Qualifies as a First-Time Buyer</h2>
<p>To qualify for either rebate, you must never have owned a home anywhere in the world — not just in Canada — and you must occupy the property as your principal residence within nine months of the purchase closing. If you're buying with a spouse, your spouse's ownership history also affects eligibility: if your spouse owned a home while being your spouse, you generally cannot claim the rebate, even if you personally have never owned property.</p>

<h2>How to Claim the Rebate</h2>
<p>Both rebates are normally applied automatically by your real estate lawyer at closing, directly reducing the land transfer tax you pay rather than requiring you to pay in full and apply for a refund afterward. Confirm with your lawyer before closing that they've applied for both the provincial and (if applicable) Toronto rebate on your behalf.</p>

<h2>FAQ</h2>
<h3>How much is the Ontario first-time home buyer land transfer tax rebate?</h3>
<p>Up to $4,000, which fully covers the provincial land transfer tax on purchases below $368,000.</p>
<h3>Is there an additional rebate for buying in Toronto?</h3>
<p>Yes — first-time buyers in Toronto can also claim up to $4,475 against the Toronto Municipal Land Transfer Tax, for a combined saving of up to $8,475 with the provincial rebate.</p>
<h3>Do I qualify if I owned a home outside Canada?</h3>
<p>No — the "never owned a home" requirement applies worldwide, not just in Canada.</p>
<h3>What if my spouse owned a home before we were together?</h3>
<p>Generally, only your spouse's ownership history while you were spouses affects your eligibility — but confirm your specific situation with your real estate lawyer, since the rules can be nuanced.</p>
<h3>Do I need to apply for the rebate separately after closing?</h3>
<p>Usually not — your real estate lawyer typically applies both rebates directly at closing, reducing the tax you actually pay rather than requiring a refund claim afterward.</p>

<p>Ready to start house-hunting as a first-time buyer? Browse <a href="/homes-for-sale">current GTA homes for sale on Condohill</a>, or see our full <a href="/blog/how-much-is-land-transfer-tax-in-ontario">Ontario land transfer tax calculation guide</a>.</p>

<h2>Sources</h2>
<p>Rebate figures and eligibility rules per <a href="https://www.ontario.ca/page/land-transfer-tax" target="_blank" rel="noopener noreferrer">ontario.ca</a> and the <a href="https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/" target="_blank" rel="noopener noreferrer">City of Toronto's MLTT page</a>. This is general information, not tax advice — confirm your specific eligibility with your real estate lawyer.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="Ontario Land Transfer Tax Rebate for First-Time Buyers"
      summary="How the Ontario and Toronto first-time buyer land transfer tax rebates work, and how to claim up to $8,475 combined."
      breadcrumbLabel="First-Time Buyer Land Transfer Tax Rebate"
      path="/land-transfer-tax-rebate-first-time-buyers-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
