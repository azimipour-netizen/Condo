import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'CMHC Mortgage Insurance Explained: Premiums, Rules, and the $1.5M Cap',
  description: 'How CMHC mortgage default insurance works in Canada — premium rates by down payment, the $1.5 million price cap, and who actually needs it.',
  alternates: { canonical: '/cmhc-mortgage-insurance-explained' },
}

const BODY_HTML = `
<p>Mortgage default insurance — commonly called CMHC insurance, after Canada Mortgage and Housing Corporation, its largest provider — protects the lender, not the buyer, if a borrower defaults on a mortgage with less than 20% down. It's mandatory in Canada any time a buyer puts down less than 20%, and it directly affects both what you can afford and what type of property you can buy with a smaller down payment.</p>

<h2>When Is Mortgage Insurance Required?</h2>
<p>Mortgage default insurance is mandatory for any purchase where the down payment is less than 20% of the purchase price — commonly called a "high-ratio" mortgage. Put down 20% or more, and you have a "conventional" mortgage, which doesn't require this insurance at all.</p>

<h2>The $1.5 Million Price Cap</h2>
<p>Mortgage default insurance is only available on properties priced up to $1,500,000 — a threshold raised from the previous $1,000,000 cap. Above $1.5 million, insured financing isn't available at any down payment level, meaning a buyer must put down at least 20% regardless of how much more than 20% they might otherwise choose to put down.</p>

<h2>Minimum Down Payment Rules</h2>
<p>For a home priced up to $500,000, the minimum down payment is 5%. For the portion of the price between $500,000 and $1.5 million, the minimum rises to 10% on that portion. Above $1.5 million, as noted, insurance isn't available and a full 20% minimum applies to the entire price.</p>

<h2>Premium Rates</h2>
<p>The insurance premium is calculated as a percentage of your mortgage amount and is typically added to your mortgage balance rather than paid upfront, based on your loan-to-value (LTV) ratio:</p>
<table>
  <thead><tr><th>Down payment</th><th>Loan-to-value</th><th>Typical premium</th></tr></thead>
  <tbody>
    <tr><td>5%</td><td>95%</td><td>~4.0% of the mortgage amount</td></tr>
    <tr><td>10%</td><td>90%</td><td>~3.1% of the mortgage amount</td></tr>
    <tr><td>15%</td><td>85%</td><td>~2.8% of the mortgage amount</td></tr>
  </tbody>
</table>
<p>An extended amortization beyond 25 years typically adds a surcharge on top of the standard premium. These figures are indicative and can change — confirm the exact current premium with your lender or mortgage broker before finalizing your financing.</p>

<h2>Who Pays For It, and Who Benefits?</h2>
<p>The buyer pays the premium, but the insurance itself protects the lender if the buyer defaults — it doesn't protect the buyer's equity or provide any direct benefit to them beyond making a low-down-payment mortgage possible in the first place. This distinction surprises some first-time buyers, who sometimes assume the insurance protects them personally.</p>

<h2>FAQ</h2>
<h3>Do I need CMHC insurance if I put down 20%?</h3>
<p>No — mortgage default insurance is only required when your down payment is less than 20% of the purchase price.</p>
<h3>Can I get an insured mortgage on a home over $1.5 million?</h3>
<p>No — mortgage default insurance isn't available above a $1.5 million purchase price at any down payment level; a minimum 20% down payment is required regardless.</p>
<h3>Who actually benefits from CMHC insurance — me or the lender?</h3>
<p>The lender. The insurance protects them if you default; it doesn't protect your equity or provide a direct benefit to you as the buyer, even though you pay the premium.</p>
<h3>Is CMHC the only mortgage default insurer in Canada?</h3>
<p>No — Sagen and Canada Guaranty are the other two private mortgage default insurers operating alongside CMHC, a Crown corporation.</p>
<h3>How is the premium usually paid?</h3>
<p>It's typically added to your mortgage principal and paid off over your amortization period, rather than paid as a separate upfront cost at closing.</p>

<p>Ready to see what fits your budget? Browse <a href="/homes-for-sale">current GTA homes for sale on Condohill</a>, or see <a href="/blog/how-to-get-mortgage-pre-approval">how mortgage pre-approval works</a>.</p>

<h2>Sources</h2>
<p>Premium rates and price cap per <a href="https://www.cmhc-schl.gc.ca/" target="_blank" rel="noopener noreferrer">CMHC</a>. This is general information, not financial advice — confirm current rates and eligibility with a licensed mortgage professional.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="CMHC Mortgage Insurance Explained: Premiums, Rules, and the $1.5M Cap"
      summary="How mortgage default insurance works in Canada — premium rates by down payment, the $1.5 million price cap, and who actually needs it."
      breadcrumbLabel="CMHC Mortgage Insurance Explained"
      path="/cmhc-mortgage-insurance-explained"
      bodyHtml={BODY_HTML}
    />
  )
}
