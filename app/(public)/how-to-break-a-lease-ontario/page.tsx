import type { Metadata } from 'next'
import { SeoContentPage } from '@/components/content/SeoContentPage'

export const metadata: Metadata = {
  title: 'How to Break a Lease Early in Ontario',
  description: 'Your real options for ending a lease early in Ontario — the N9 and N11 forms, notice periods, lease assignment, and what happens if you just leave.',
  alternates: { canonical: '/how-to-break-a-lease-ontario' },
}

const BODY_HTML = `
<p>Breaking a lease early in Ontario is more restricted than many tenants expect — you generally can't just give notice and leave partway through a fixed-term lease the way you could on a month-to-month tenancy. This guide covers the real, legal ways to end a tenancy early, and what happens if you don't follow them.</p>

<h2>If You're on a Fixed-Term Lease</h2>
<p>During a fixed-term lease (a one-year lease, for example), you generally cannot use the standard tenant's notice form to end the tenancy before the term is up, unless your landlord has arbitrarily refused to let you assign the lease to a new tenant. Outside of that specific exception, ending a fixed-term lease early normally requires either your landlord's agreement or a valid legal reason.</p>

<h2>If You're on a Month-to-Month Tenancy</h2>
<p>Once a fixed term ends and converts to month-to-month (as most Ontario leases do by default, since a lease doesn't legally require you to leave when the term ends), you can end the tenancy at any time using an N9 — Tenant's Notice to End the Tenancy. The standard notice period is 60 days, with the termination date aligned to the last day of your rental period.</p>

<h2>Lease Assignment</h2>
<p>If you're locked into a fixed-term lease but need to leave, you can ask your landlord for permission to assign the lease to a new tenant, who takes over your remaining term. If your landlord unreasonably refuses or simply doesn't respond within seven days, you can then serve an N9 with only 30 days' notice — even mid-lease. This is one of the few legal paths out of a fixed-term lease without your landlord's active cooperation.</p>

<h2>Mutual Agreement (N11)</h2>
<p>If both you and your landlord agree to end the tenancy early, you can sign an N11 — Mutual Agreement to End the Tenancy — which lets you set any termination date you both agree to, with no minimum notice period required. This is often the simplest route if your landlord is willing to cooperate, since it avoids the assignment process entirely.</p>

<h2>What Happens If You Just Leave?</h2>
<p>Leaving a fixed-term lease without a valid N9, N11, or approved assignment doesn't end your legal obligation to pay rent. Your landlord generally has a duty to try to re-rent the unit at a reasonable effort and re-rate, but you can still be held responsible for rent until the unit is re-rented or the lease term ends, whichever comes first. This is why using one of the legal exit routes above — rather than simply moving out — matters even if your landlord seems unlikely to pursue it.</p>

<h2>FAQ</h2>
<h3>Can I break my lease early just by giving notice?</h3>
<p>Only if you're on a month-to-month tenancy. During a fixed-term lease, standard notice generally isn't enough unless your landlord has refused a reasonable assignment request.</p>
<h3>What is an N9 form?</h3>
<p>The Landlord and Tenant Board form a tenant uses to give notice ending a tenancy — typically 60 days' notice for month-to-month tenancies, or 30 days if used after a refused lease assignment.</p>
<h3>What is an N11 form?</h3>
<p>A Mutual Agreement to End the Tenancy, signed by both landlord and tenant, ending the tenancy on any date they agree to with no minimum notice period.</p>
<h3>Can I assign my lease to someone else?</h3>
<p>Yes, with your landlord's permission. If they unreasonably refuse or don't respond within seven days, you can then serve an N9 with only 30 days' notice, even mid-lease.</p>
<h3>What happens if I just move out without proper notice?</h3>
<p>You may still owe rent until the unit is re-rented or the lease term ends, since leaving without a valid N9, N11, or approved assignment doesn't end your legal obligation to pay.</p>

<p>Looking for your next place instead? Browse <a href="/homes-for-rent">current GTA homes for rent on Condohill</a>.</p>

<h2>Sources</h2>
<p>Ontario's Residential Tenancies Act, 2006 and the <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer">Landlord and Tenant Board</a>. This is general information, not legal advice — consult the LTB or a paralegal/lawyer for guidance specific to your tenancy.</p>
`

export default function Page() {
  return (
    <SeoContentPage
      title="How to Break a Lease Early in Ontario"
      summary="Your real options for ending a lease early — the N9 and N11 forms, notice periods, lease assignment, and what happens if you just leave."
      breadcrumbLabel="Breaking a Lease Early"
      path="/how-to-break-a-lease-ontario"
      bodyHtml={BODY_HTML}
    />
  )
}
