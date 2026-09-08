import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'How the Mortgage Stress Test Works in Canada',
  description: 'How Canada’s mortgage stress test qualifying rate works in 2026, why it exists, and how it affects how much home you can actually afford.',
  alternates: { canonical: '/mortgage-stress-test-explained' },
}

const BODY_HTML = `
<p>Canada's mortgage stress test requires lenders to qualify homebuyers at a higher interest rate than the actual rate on their mortgage, ensuring buyers can still afford their payments if rates rise or their financial situation changes. It applies to virtually every mortgage from a federally regulated lender in Canada, including in the GTA, regardless of your down payment size.</p>

<h2>What Rate Do I Actually Get Qualified At?</h2>
<p>As of 2026, the stress test qualifying rate is the greater of two numbers: your contract rate plus 2 percentage points, or a fixed floor of 5.25%. This floor was introduced in June 2021 and has remained unchanged since. In practice, with most insured five-year fixed rates currently between 4.5% and 5.5%, the contract-plus-2% calculation almost always ends up higher than the 5.25% floor and is therefore the number used.</p>

<table>
  <thead><tr><th>Your contract rate</th><th>You're qualified at</th></tr></thead>
  <tbody>
    <tr><td>4.5%</td><td>6.5%</td></tr>
    <tr><td>5.0%</td><td>7.0%</td></tr>
    <tr><td>5.5%</td><td>7.5%</td></tr>
  </tbody>
</table>

<h2>Why Does the Stress Test Exist?</h2>
<p>The Office of the Superintendent of Financial Institutions (OSFI), the federal regulator overseeing Canadian banks, introduced the stress test to reduce the risk of widespread mortgage defaults if interest rates rise after a buyer takes out a mortgage. By qualifying buyers at a higher rate than they'll actually pay, the rule builds in a financial buffer against future rate increases or income disruptions.</p>

<h2>How This Affects What You Can Afford</h2>
<p>The stress test doesn't change your actual mortgage payment — you still pay based on your real contract rate — but it does limit how large a mortgage you can qualify for in the first place, since your income has to support the higher, hypothetical qualifying payment, not just your real one. This is why some buyers find their approved mortgage amount is lower than what their income seems like it should support at their actual rate.</p>

<h2>Does the Stress Test Apply to Everyone?</h2>
<p>It applies to mortgages from federally regulated lenders — the large banks and most mainstream lenders — regardless of whether your down payment is above or below 20%. Some private and provincially regulated lenders aren't subject to the federal stress test, though they often have their own, sometimes stricter, qualifying criteria and typically charge higher rates in exchange for more flexible qualification.</p>

<h2>Has OSFI Changed the Stress Test Recently?</h2>
<p>OSFI confirmed in early 2026 that the stress test rules remain unchanged from prior years — the 5.25% floor and the contract-plus-2% comparison both continue to apply. OSFI reviews the policy periodically, so buyers should confirm the current rule with their mortgage professional at the time they're applying, since it can change.</p>

<h2>FAQ</h2>
<h3>What is the current mortgage stress test rate in Canada?</h3>
<p>As of 2026, it's the greater of your contract rate plus 2 percentage points, or a fixed floor of 5.25%.</p>
<h3>Does the stress test apply if I have a 20% down payment?</h3>
<p>Yes — the federal stress test applies to mortgages from federally regulated lenders regardless of down payment size or whether the mortgage is insured.</p>
<h3>Will I actually pay the stress test rate on my mortgage?</h3>
<p>No — the stress test rate is used only to determine how much you qualify to borrow. You pay your actual contract rate on the mortgage itself.</p>
<h3>Can I avoid the stress test?</h3>
<p>Some private and provincially regulated lenders aren't subject to the federal stress test, though they typically charge higher rates and may have their own stricter qualifying rules in exchange for that flexibility.</p>
<h3>Why did OSFI introduce the mortgage stress test?</h3>
<p>To reduce the risk of widespread mortgage defaults by ensuring buyers can afford their payments even if interest rates rise after they take out their mortgage.</p>

<p>Ready to see what you might qualify for? See our guide on <a href="/blog/how-to-get-mortgage-pre-approval">getting mortgage pre-approval</a>, then browse <a href="/homes-for-sale/toronto">current GTA listings</a> in your price range.</p>

<h2>Sources</h2>
<p>This guide reflects the <a href="https://www.osfi-bsif.gc.ca/en" target="_blank" rel="noopener noreferrer">Office of the Superintendent of Financial Institutions (OSFI)</a>'s published guidelines. Rates and rules can change — confirm current requirements with a mortgage professional before applying. This is general information, not financial advice.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="How the Mortgage Stress Test Works in Canada"
      summary="Canada’s 2026 stress test qualifying rate, why it exists, and how it limits what mortgage amount you can actually qualify for."
      breadcrumbLabel="Mortgage Stress Test"
      path="/mortgage-stress-test-explained"
      bodyHtml={BODY_HTML}
    />
  )
}
