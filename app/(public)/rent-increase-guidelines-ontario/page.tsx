import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: '2026 Ontario Rent Increase Guideline: What Landlords and Tenants Should Know',
  description: 'Ontario’s 2026 rent increase guideline is 2.1%. Here’s what it applies to, what it doesn’t, and the correct notice period landlords must give.',
  alternates: { canonical: '/rent-increase-guidelines-ontario' },
}

const BODY_HTML = `
<p>Ontario's rent increase guideline sets the maximum a landlord can raise rent, without approval from the Landlord and Tenant Board (LTB), for most private residential rentals in the province. For 2026, that guideline is 2.1% — the lowest cap in four years, down from 2.5% in each of the previous three years.</p>

<h2>How the Guideline Is Set</h2>
<p>The Ministry of Municipal Affairs and Housing calculates the guideline each year based on Ontario's Consumer Price Index over a set 12-month window, but the guideline is capped by law at a maximum of 2.5% regardless of how high actual inflation runs. That cap is why the guideline hasn't simply tracked inflation directly in recent years.</p>

<h2>Which Units the Guideline Applies To</h2>
<p>The guideline applies to most private residential rental units first occupied for residential purposes on or before November 15, 2018. If your unit meets that criteria, your landlord cannot raise rent by more than 2.1% in 2026 without LTB approval for an above-guideline increase (typically only granted for specific circumstances like major capital repairs or extraordinary utility cost increases).</p>

<h2>Which Units Are Exempt</h2>
<p>Buildings first occupied for residential purposes after November 15, 2018 are exempt from the guideline entirely — a landlord can raise rent on those units by any amount. This exemption was introduced to encourage new purpose-built rental construction, and it's one of the most commonly misunderstood rules among both new landlords and tenants moving into newer buildings.</p>

<h2>Notice and Frequency Rules</h2>
<p>Regardless of whether a unit is guideline-capped or exempt, a landlord can only raise rent once every 12 months at minimum from the tenant's last increase, and must give at least 90 days' written notice before the increase takes effect. These timing rules apply even to exempt units — only the percentage cap is different.</p>

<h2>What If a Landlord Raises Rent Above the Guideline Without Approval?</h2>
<p>If your unit is subject to the guideline and your landlord raises rent above 2.1% for 2026 without LTB approval, you're not required to pay the excess amount — you can dispute the increase with the Landlord and Tenant Board.</p>

<h2>FAQ</h2>
<h3>What is Ontario's rent increase guideline for 2026?</h3>
<p>2.1% — the maximum most landlords can raise rent without LTB approval for units first occupied on or before November 15, 2018.</p>
<h3>Does the guideline apply to all rental units in Ontario?</h3>
<p>No. Units first occupied for residential purposes after November 15, 2018 are exempt entirely, meaning a landlord can raise rent on those units by any amount, subject to the standard notice rules.</p>
<h3>How much notice does my landlord need to give for a rent increase?</h3>
<p>At least 90 days' written notice, regardless of whether the unit is guideline-capped or exempt.</p>
<h3>How often can my rent be increased?</h3>
<p>No more than once every 12 months, measured from your last rent increase.</p>
<h3>Can a landlord raise rent above the guideline?</h3>
<p>Only with Landlord and Tenant Board approval for an above-guideline increase, typically granted only for specific circumstances like major capital repairs or extraordinary utility cost increases.</p>

<p>Searching for a new place instead? Browse <a href="/homes-for-rent">current GTA homes for rent on Condohill</a>.</p>

<h2>Sources</h2>
<p>Ontario Ministry of Municipal Affairs and Housing, 2026 rent increase guideline, and the <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer">Landlord and Tenant Board</a>. This is general information, not legal advice.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="2026 Ontario Rent Increase Guideline: What Landlords and Tenants Should Know"
      summary="Ontario's 2026 rent increase guideline is 2.1% — what it applies to, what's exempt, and the correct notice period landlords must give."
      breadcrumbLabel="Ontario Rent Increase Guideline"
      path="/rent-increase-guidelines-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
