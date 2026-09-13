import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'Fixed vs. Variable Mortgage Rate: How to Choose',
  description: 'The real trade-offs between a fixed and variable mortgage rate in Canada — how each responds to rate changes, penalty differences, and who each suits.',
  alternates: { canonical: '/fixed-vs-variable-mortgage-rate' },
}

const BODY_HTML = `
<p>Choosing between a fixed and variable mortgage rate is one of the first real decisions a GTA buyer makes once they're mortgage-approved, and it comes down less to which rate is "better" and more to how much rate uncertainty you're comfortable carrying over your mortgage term.</p>

<h2>How a Fixed Rate Works</h2>
<p>A fixed-rate mortgage locks your interest rate for the full term (commonly 5 years in Canada), so your payment stays the same regardless of what happens to broader interest rates during that period. You know your exact payment for the entire term, which makes budgeting straightforward and removes the risk of a payment increase if rates rise.</p>

<h2>How a Variable Rate Works</h2>
<p>A variable-rate mortgage is priced relative to your lender's prime rate, which moves with the Bank of Canada's policy rate. Some variable mortgages have a fixed payment where the portion going to principal vs. interest shifts as rates change; others (adjustable-rate) have a payment that changes directly with rate moves. Either way, your total interest cost over the term is directly exposed to future Bank of Canada decisions.</p>

<h2>Historical Trade-Off</h2>
<p>Historically, variable rates have on average cost borrowers less over the life of a mortgage than fixed rates, because lenders build a risk premium into fixed rates to compensate for locking in their own cost of funds. That historical average doesn't guarantee any specific outcome for a given term, though — it reflects long-run patterns across many rate cycles, not a prediction for the next five years.</p>

<h2>Breaking Your Mortgage Early</h2>
<p>This is where the two options diverge sharply in practice. Breaking a variable-rate mortgage early typically costs three months' interest. Breaking a fixed-rate mortgage early typically triggers an Interest Rate Differential (IRD) penalty, which compares your contract rate to the lender's current rate for a similar remaining term — and can be substantially larger than three months' interest, especially if rates have dropped since you signed. If you think there's a realistic chance you'll sell, refinance, or break your mortgage before the term ends, this penalty asymmetry is worth weighing heavily.</p>

<h2>Who Tends to Prefer Each</h2>
<ul>
  <li><strong>Fixed rate:</strong> buyers who want payment certainty, are stretching close to their maximum approved budget, or plan to hold the mortgage for the full term without breaking it.</li>
  <li><strong>Variable rate:</strong> buyers comfortable with some payment or cost uncertainty, who have room in their budget to absorb a rate increase, and who value the lower early-break penalty.</li>
</ul>

<h2>FAQ</h2>
<h3>Is a fixed or variable mortgage rate better?</h3>
<p>Neither is universally better — it depends on your comfort with rate uncertainty, how much budget flexibility you have, and how likely you are to break the mortgage before the term ends.</p>
<h3>Which is cheaper to break early?</h3>
<p>Variable-rate mortgages are typically cheaper to break, usually costing three months' interest, compared to a fixed-rate mortgage's Interest Rate Differential penalty, which can be significantly higher.</p>
<h3>Do variable rates always end up cheaper than fixed rates?</h3>
<p>Historically, variable rates have on average cost less over a mortgage's life, but this reflects long-run patterns, not a guarantee for any specific term.</p>
<h3>Can I switch from a variable rate to a fixed rate later?</h3>
<p>Many lenders allow a conversion to a fixed rate partway through a variable-rate term, though the available rate at that time depends on current market conditions — confirm this option with your specific lender before signing.</p>
<h3>Does my mortgage stress test change based on fixed vs. variable?</h3>
<p>No — Canada's mortgage stress test applies the same qualifying standard (your contract rate plus 2%, or 5.25%, whichever is higher) regardless of whether you choose fixed or variable.</p>

<p>Ready to get pre-approved? See <a href="/blog/how-to-get-mortgage-pre-approval">how mortgage pre-approval works</a>, or browse <a href="/homes-for-sale">current GTA homes for sale on Condohill</a>.</p>

<h2>Sources</h2>
<p>This is general information, not financial advice. Consult a licensed mortgage professional for guidance specific to your situation, and confirm current rates and terms directly with your lender.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="Fixed vs. Variable Mortgage Rate: How to Choose"
      summary="The real trade-offs between a fixed and variable mortgage rate — how each responds to rate changes, penalty differences, and who each suits."
      breadcrumbLabel="Fixed vs. Variable Mortgage Rate"
      path="/fixed-vs-variable-mortgage-rate"
      bodyHtml={BODY_HTML}
    />
  )
}
