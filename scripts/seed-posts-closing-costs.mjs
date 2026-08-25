import { createRequire } from 'module'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const posts = [
  {
    title: 'What Closing Costs Do Home Buyers Pay in Ontario?',
    slug: 'what-closing-costs-do-home-buyers-pay',
    metaDescription: 'Closing costs in Ontario run 1.5–4% of the purchase price. Full breakdown of every fee GTA home buyers pay: land transfer tax, legal fees, title insurance, and more.',
    summary: 'Closing costs in Ontario typically run 1.5–4% of the purchase price on top of your down payment. This guide breaks down every fee GTA buyers pay on closing day — land transfer tax, legal fees, CMHC insurance, title insurance, and more.',
    body: `<!-- Primary keyword: closing costs for home buyers in Ontario | Intent: informational | Word count target: 1900 -->

<p>Closing costs are the fees and expenses you pay on top of your down payment when buying a home in Ontario. For most GTA buyers, closing costs run between 1.5% and 4% of the purchase price — on a $900,000 home, that's $13,500 to $36,000 due on closing day. Knowing what closing costs to expect, and budgeting for them separately from your down payment, is one of the most important steps in <a href="/blog/steps-to-buying-a-home-in-the-gta">buying a home in the GTA</a>.</p>

<p>Many first-time buyers are caught off guard by closing costs because they aren't included in the mortgage. Your lender finances the purchase price; closing costs come out of your own pocket. This guide breaks down every closing cost Ontario home buyers pay, with current figures for Toronto and the surrounding GTA.</p>

<h2>Ontario Land Transfer Tax</h2>

<p>Land transfer tax is the largest single closing cost most buyers pay. Ontario charges a provincial land transfer tax on every property purchase, calculated on a sliding scale based on the purchase price:</p>

<table>
  <thead>
    <tr><th>Purchase price</th><th>Tax rate</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to $55,000</td><td>0.5%</td></tr>
    <tr><td>$55,001 – $250,000</td><td>1.0%</td></tr>
    <tr><td>$250,001 – $400,000</td><td>1.5%</td></tr>
    <tr><td>$400,001 – $2,000,000</td><td>2.0%</td></tr>
    <tr><td>Over $2,000,000</td><td>2.5%</td></tr>
  </tbody>
</table>

<p>On a $900,000 purchase, Ontario land transfer tax works out to approximately $16,475. Use the <a href="https://www.ontario.ca/page/land-transfer-tax" target="_blank" rel="noopener noreferrer">Ontario Land Transfer Tax calculator on ontario.ca</a> to get an exact figure for your purchase price.</p>

<h3>Toronto Municipal Land Transfer Tax</h3>

<p>If you're buying within the City of Toronto — not Mississauga, Markham, Vaughan, or other GTA municipalities, but specifically the City of Toronto — you also pay a <strong>municipal land transfer tax (MLTT)</strong> at the same rates as the provincial tax. This effectively doubles land transfer tax for Toronto buyers.</p>

<p>On a $900,000 Toronto purchase, you'd pay approximately $16,475 in provincial LTT plus another $16,475 in municipal LTT — roughly $32,950 combined. Buyers in Mississauga, Brampton, Vaughan, Markham, and other municipalities outside the City of Toronto pay only the provincial tax. This is one of the largest cost differences between buying inside and outside Toronto, and it's worth factoring into your search area decisions.</p>

<h3>First-Time Buyer Land Transfer Tax Rebates</h3>

<p>First-time home buyers receive meaningful rebates on land transfer tax. Ontario provides a rebate of up to <strong>$4,000</strong> on provincial land transfer tax. Toronto provides an additional rebate of up to <strong>$4,475</strong> on the municipal land transfer tax. Together, first-time Toronto buyers can save up to $8,475 — which effectively eliminates LTT entirely on purchases below approximately $368,000.</p>

<p>To qualify, you must be a Canadian citizen or permanent resident, at least 18 years old, and you must never have owned a home anywhere in the world. Your spouse also cannot have owned a home while they were your spouse. If you're a first-time buyer, confirm your eligibility with your lawyer before closing.</p>

<h2>Legal Fees and Disbursements</h2>

<p>A real estate lawyer is mandatory for every property purchase in Ontario — there's no way around this closing cost. Your lawyer handles the title search, prepares closing documents, receives mortgage funds from your lender, and registers the transfer of title. Legal fees typically run <strong>$1,500–$2,500</strong> depending on the purchase price, transaction complexity, and the firm.</p>

<p>In addition to the quoted legal fee, you'll pay <strong>disbursements</strong> — out-of-pocket expenses your lawyer incurs on your behalf, including title search fees, government registration fees, and courier costs. Disbursements typically add $300–$700 on top. Always ask for a total estimate that includes disbursements so you're comparing apples to apples when shopping for a lawyer.</p>

<h2>Title Insurance</h2>

<p>Title insurance protects you against defects in the title to your property — issues with ownership that could affect your right to the home. Common claims include survey errors, unknown liens, building permit violations, encroachments from neighbouring properties, and fraud. The premium is a one-time cost paid at closing, typically <strong>$250–$400</strong> for most residential purchases in the GTA.</p>

<p>While title insurance isn't legally required in Ontario, virtually every lender requires it, and most real estate lawyers recommend it regardless. The premium is small relative to the protection it provides against six-figure title disputes.</p>

<h2>Home Inspection Fee</h2>

<p>A <a href="/blog/do-i-need-a-home-inspection">home inspection</a> is typically conducted during the conditional period before you firm up on the purchase. Inspections in the GTA cost <strong>$400–$650</strong> for a standard house; condos run slightly less at $250–$400 since the inspector focuses on the unit rather than shared building systems.</p>

<p>The inspection fee is paid directly to the inspector, usually on the day of the inspection. Even when buyers waive the inspection condition in competitive multiple-offer situations, the inspection cost is worth including in your closing cost budget — many buyers conduct pre-offer inspections on properties they're serious about before submitting.</p>

<h2>Mortgage-Related Costs</h2>

<h3>Mortgage Default Insurance (CMHC)</h3>

<p>If your down payment is less than 20% of the purchase price, you're required by federal law to purchase <strong>mortgage default insurance</strong> through CMHC, Sagen, or Canada Guaranty. The premium is a percentage of your mortgage amount:</p>

<table>
  <thead>
    <tr><th>Down payment</th><th>Insurance premium</th></tr>
  </thead>
  <tbody>
    <tr><td>5% – 9.99%</td><td>4.00% of mortgage</td></tr>
    <tr><td>10% – 14.99%</td><td>3.10% of mortgage</td></tr>
    <tr><td>15% – 19.99%</td><td>2.80% of mortgage</td></tr>
  </tbody>
</table>

<p>The premium itself is typically added to your mortgage balance — but Ontario charges <strong>PST on the CMHC premium at 8%</strong>, and that PST must be paid as a closing cost; it cannot be rolled into the mortgage. On a $20,000 CMHC premium, the PST owing at closing is $1,600. See <a href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers" target="_blank" rel="noopener noreferrer">CMHC's mortgage insurance page</a> for current premium rates and eligibility details.</p>

<h3>Mortgage Appraisal</h3>

<p>Your lender will typically order an appraisal to confirm the property is worth what you agreed to pay for it. Appraisal fees in the GTA run <strong>$300–$500</strong> and are usually paid by the buyer, either at closing or billed directly during underwriting. Some lenders waive or cover this cost — ask your mortgage broker upfront before assuming it's yours to pay.</p>

<h2>Property Tax Adjustments</h2>

<p>On closing, your lawyer prepares a <strong>statement of adjustments</strong> that accounts for property taxes. If the seller has already paid property taxes beyond the closing date, you reimburse them for your share. If taxes are unpaid, you receive a credit. Property tax adjustments aren't an extra cost per se — they're a timing reconciliation — but they do affect your final closing day payment, sometimes by several thousand dollars depending on where you are in the tax cycle.</p>

<h2>Other Costs to Budget For</h2>

<h3>Home Insurance</h3>
<p>Lenders require proof of home insurance before advancing mortgage funds. You need a policy active on closing day. Annual premiums in the GTA vary by property type, location, and coverage level, but budget <strong>$1,500–$3,000/year</strong> for a detached house, or $400–$800/year for a condo unit.</p>

<h3>Moving Costs</h3>
<p>Professional movers in Toronto typically charge <strong>$800–$2,500</strong> for a local move, depending on the volume of your belongings and the date. Weekend and end-of-month moves cost more. Book at least 4–6 weeks in advance — movers fill up fast around popular closing dates.</p>

<h2>Complete Closing Cost Summary</h2>

<table>
  <thead>
    <tr><th>Cost item</th><th>Typical range</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Ontario Land Transfer Tax</td><td>~1.5–2% of price</td><td>Rebate up to $4,000 for first-time buyers</td></tr>
    <tr><td>Toronto Municipal LTT</td><td>~1.5–2% of price</td><td>City of Toronto only; rebate up to $4,475</td></tr>
    <tr><td>Legal fees + disbursements</td><td>$1,800–$3,200</td><td>Shop for quotes; ask for all-in estimate</td></tr>
    <tr><td>Title insurance</td><td>$250–$400</td><td>One-time premium at closing</td></tr>
    <tr><td>Home inspection</td><td>$400–$650 (house), $250–$400 (condo)</td><td>Paid during conditional period</td></tr>
    <tr><td>Mortgage appraisal</td><td>$300–$500</td><td>Sometimes covered by lender</td></tr>
    <tr><td>PST on CMHC premium</td><td>8% of premium</td><td>Only if down payment under 20%</td></tr>
    <tr><td>Property tax adjustment</td><td>Credit or debit</td><td>Calculated by your lawyer at closing</td></tr>
    <tr><td>Home insurance (year 1)</td><td>$1,500–$3,000</td><td>Required before lender advances funds</td></tr>
    <tr><td>Moving costs</td><td>$800–$2,500</td><td>Varies by volume and timing</td></tr>
  </tbody>
</table>

<p>For a $900,000 purchase with 20% down (no CMHC) outside Toronto: budget $20,000–$25,000 in total closing costs. Inside the City of Toronto: $35,000–$40,000 due to the MLTT. First-time buyers reduce those totals by $4,000–$8,475 through LTT rebates.</p>

<p>For a fuller picture of what you need saved before buying, see our guide on <a href="/blog/how-much-down-payment-to-buy-a-home">how much down payment you need</a> and the <a href="/blog/how-much-house-can-i-afford">full affordability breakdown for GTA buyers</a>.</p>

<h2>When Do You Pay Closing Costs?</h2>

<p>Most closing costs are due on the <strong>closing date</strong>. Your lawyer will send a statement of adjustments a few days before closing showing exactly what you owe — typically the balance of your purchase price (minus your deposit), land transfer taxes, legal fees, and any property tax adjustments. You'll pay by certified cheque or wire transfer.</p>

<p>A few costs come earlier: the home inspection is paid when it happens (during the conditional period), and the mortgage appraisal may be charged during underwriting. For a timeline of what happens between accepted offer and closing day, see <a href="/blog/what-happens-after-offer-is-accepted">what happens after your offer is accepted</a>.</p>

<h2>Can Closing Costs Be Added to Your Mortgage?</h2>

<p>In Canada, closing costs generally cannot be rolled into your mortgage — they must be paid from your own funds on closing day. The one exception is the CMHC mortgage default insurance premium, which can be added to the mortgage balance (but not the Ontario PST on that premium, which must be paid at closing).</p>

<p>This is why mortgage brokers consistently advise GTA buyers to keep their closing cost savings in a separate account from their down payment. Depleting your down payment for closing costs affects your loan-to-value ratio and may require CMHC insurance when you didn't plan for it. Budget for both separately from the start.</p>

<p>Ready to find your next home? <a href="/homes-for-sale/toronto">Browse homes for sale across the GTA on Condohill</a> and use our search filters to find properties within your full budget — down payment and closing costs included.</p>

<h2>FAQ</h2>

<h3>How much are closing costs when buying a home in Ontario?</h3>
<p>Closing costs in Ontario typically run 1.5% to 4% of the purchase price, separate from the down payment. On a $900,000 home, expect $13,500–$36,000 in closing costs. Buyers in the City of Toronto pay significantly more due to the municipal land transfer tax, which roughly doubles LTT compared to other GTA municipalities.</p>

<h3>Do first-time home buyers in Ontario pay less in closing costs?</h3>
<p>Yes. First-time buyers receive a provincial land transfer tax rebate of up to $4,000, and Toronto first-time buyers receive an additional municipal LTT rebate of up to $4,475. Combined, first-time Toronto buyers can save up to $8,475. To qualify, you must never have owned a home anywhere in the world, and your spouse cannot have owned a home during the relationship.</p>

<h3>Who pays closing costs in Ontario — the buyer or the seller?</h3>
<p>Both buyer and seller pay their own closing costs, which are different. Buyers pay land transfer tax, legal fees, title insurance, home inspection, and appraisal. Sellers typically pay real estate commission and their own legal fees to discharge their mortgage and transfer title. Neither party pays the other's closing costs.</p>

<h3>Do condo buyers in the GTA pay the same closing costs as house buyers?</h3>
<p>Standard closing costs are the same: land transfer tax, legal fees, title insurance, and a home inspection. Condo inspections cost less ($250–$400 vs. $400–$650). If buying a pre-construction condo, additional costs apply — including HST on the purchase price (partially rebated for principal residences), development levies, and occupancy fees — which can add 3–5% beyond standard closing costs.</p>

<h3>Can I negotiate who pays closing costs in Ontario?</h3>
<p>Land transfer tax is set by law and non-negotiable. Legal fees are set by your lawyer. What buyers sometimes negotiate in a softer market is a seller credit — where the seller agrees to lower their net proceeds and the buyer uses that credit to offset closing costs. This is less common in the GTA's typically competitive market but is legitimate when a property has been sitting or the market favours buyers.</p>

<h3>When exactly do I pay closing costs in Ontario?</h3>
<p>Most closing costs are paid on the closing date itself — the day ownership legally transfers. Your lawyer will provide a statement of adjustments 2–5 business days before closing with the exact amount you owe. The home inspection is paid during the conditional period, and the mortgage appraisal may be billed during underwriting. Arrive at closing with a certified cheque or wire transfer for the exact amount your lawyer specifies.</p>

<h3>Are closing costs tax-deductible in Canada for a principal residence?</h3>
<p>For an owner-occupied principal residence, closing costs are not tax-deductible. For a rental property purchase, legal fees and land transfer tax can be added to the property's adjusted cost base, reducing capital gains when you eventually sell. Speak with a Canadian accountant about your specific situation. The <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22100-carrying-charges-interest-expenses/legal-fees.html" target="_blank" rel="noopener noreferrer">CRA's guidance on legal fees</a> covers what's deductible for investment properties.</p>`,
  },
]

async function main() {
  const admin = await db.user.findFirst({ where: { role: 'admin' } })
  if (!admin) { console.error('No admin user found'); process.exit(1) }
  console.log(`Using author: ${admin.email}`)
  console.log(`Publishing ${posts.length} posts...`)

  for (const post of posts) {
    const existing = await db.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) { console.log(`  skip: ${post.slug}`); continue }
    await db.blogPost.create({
      data: { ...post, published: true, publishedAt: new Date(), coverImageUrl: null, authorId: admin.id },
    })
    console.log(`  published: ${post.slug}`)
  }
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect().then(() => pool.end()))
