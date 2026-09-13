import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'Tenant Rights in Ontario: A Practical Guide for Renters',
  description: 'What Ontario tenants are actually entitled to under the Residential Tenancies Act — rent increases, repairs, entry notice, and how the Landlord and Tenant Board works.',
  alternates: { canonical: '/tenant-rights-ontario' },
}

const BODY_HTML = `
<p>Most residential tenancies in Ontario are governed by the Residential Tenancies Act, 2006, and enforced through the Landlord and Tenant Board (LTB). Whether you're renting a condo, an apartment, or a house, this framework sets out clear rules for rent increases, repairs, entry notice, and how a tenancy can be ended — regardless of what your lease says.</p>

<h2>Rent Increases</h2>
<p>For most units first occupied on or before November 15, 2018, a landlord can only raise rent once every 12 months, by no more than the province's annual rent increase guideline, and only with at least 90 days' written notice. Ontario's 2026 guideline is 2.1%. Units first occupied for residential purposes after November 15, 2018 are exempt from the guideline entirely, meaning a landlord can raise rent by any amount for those units — though the 90-day notice and once-per-12-months rules still apply.</p>

<h2>Repairs and Maintenance</h2>
<p>Landlords in Ontario are legally required to keep a rental unit in a good state of repair and comply with health, safety, housing, and maintenance standards — this obligation exists regardless of what's written in the lease, and a tenant generally cannot be required to waive it. If a landlord doesn't make necessary repairs, a tenant can file an application with the LTB.</p>

<h2>Entry Notice</h2>
<p>A landlord must give at least 24 hours' written notice before entering a rental unit for most purposes (repairs, showing the unit to a prospective tenant or buyer, inspections), and can only enter between 8 a.m. and 8 p.m. unless the tenant agrees otherwise. A landlord can enter without notice only in a genuine emergency.</p>

<h2>Ending a Tenancy</h2>
<p>A landlord can only end a tenancy for specific reasons set out in the Act — such as the landlord or a family member moving in, non-payment of rent, or major renovations — and must use the correct LTB notice form with the proper notice period. A tenant generally cannot simply be asked to leave without one of these legal grounds. See our guide on <a href="/how-to-break-a-lease-ontario">how a tenant can end a lease early</a> for the tenant-initiated side of this.</p>

<h2>Security Deposits and Last Month's Rent</h2>
<p>Ontario landlords cannot charge a security or damage deposit — the only deposit permitted is a last month's rent deposit, which must be applied to the final month of the tenancy and must earn interest annually at a rate set by the province.</p>

<h2>The Landlord and Tenant Board</h2>
<p>The LTB is the tribunal that resolves most landlord-tenant disputes in Ontario — rent increases above the guideline, eviction applications, maintenance disputes, and more. Either a landlord or a tenant can file an application, and hearings can be held in person, by video, or in writing depending on the type of application.</p>

<h2>FAQ</h2>
<h3>How much notice does a landlord need to give before entering my unit?</h3>
<p>At least 24 hours' written notice for most purposes, and only between 8 a.m. and 8 p.m., except in a genuine emergency.</p>
<h3>Can my landlord raise my rent by any amount?</h3>
<p>Only if your unit was first occupied after November 15, 2018. Older units are capped at Ontario's annual rent increase guideline (2.1% for 2026), with at least 90 days' written notice and no more than one increase per 12 months.</p>
<h3>Can my landlord charge a security deposit?</h3>
<p>No — Ontario landlords cannot charge a security or damage deposit. The only deposit allowed is a last month's rent deposit, which must earn annual interest.</p>
<h3>What can I do if my landlord won't make repairs?</h3>
<p>You can file an application with the Landlord and Tenant Board, which can order the landlord to complete the repairs and, in some cases, award a rent abatement.</p>
<h3>Can my landlord evict me without a reason?</h3>
<p>No — a landlord can only end a tenancy for specific reasons set out in the Residential Tenancies Act, using the correct LTB notice and notice period.</p>

<p>Searching for your next rental? Browse <a href="/homes-for-rent">current GTA homes for rent on Condohill</a>.</p>

<h2>Sources</h2>
<p>Ontario's Residential Tenancies Act, 2006 and the <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer">Landlord and Tenant Board</a>. This is general information, not legal advice — consult the LTB or a paralegal/lawyer for guidance specific to your tenancy.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="Tenant Rights in Ontario: A Practical Guide for Renters"
      summary="What Ontario tenants are actually entitled to under the Residential Tenancies Act — rent increases, repairs, entry notice, and the Landlord and Tenant Board."
      breadcrumbLabel="Tenant Rights in Ontario"
      path="/tenant-rights-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
