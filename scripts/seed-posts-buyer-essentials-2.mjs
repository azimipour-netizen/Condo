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
    title: 'How Long Is Mortgage Pre-Approval Valid in Canada?',
    slug: 'how-long-is-mortgage-pre-approval-valid',
    metaDescription: 'Mortgage pre-approval in Canada is typically valid for 90–120 days, including the rate hold. Here\'s what to do when it expires and how to extend or renew.',
    summary: 'Mortgage pre-approval in Canada is typically valid for 90 to 120 days, after which the rate hold expires and the lender may need to re-verify your income and credit. This guide explains what happens when it expires and how to manage your timeline.',
    body: `<!-- Primary keyword: how long is mortgage pre-approval valid | Intent: informational | Word count target: 1500 -->

<p>Mortgage pre-approval in Canada is typically valid for 90 to 120 days — most lenders offer a 90-day window, though some extend to 120 days. The pre-approval includes both the commitment amount and a rate hold, meaning the lender locks in a specific interest rate for the duration of the pre-approval period. If you don't find a home and firm up on an offer within that window, the pre-approval expires and you'll need to apply again. For GTA buyers in a competitive market where the right home can appear suddenly, understanding this timeline helps you plan your search effectively.</p>

<p>Pre-approval validity is one of the practical details that buyers often don't ask about upfront. This guide covers how long pre-approvals last, what the rate hold means, what happens when a pre-approval expires, and how to handle timeline pressures. For context on getting pre-approved in the first place, see <a href="/blog/how-to-get-mortgage-pre-approval">how to get mortgage pre-approval in Canada</a>.</p>

<h2>Typical Pre-Approval Validity Windows</h2>

<table>
  <thead>
    <tr><th>Lender type</th><th>Typical validity period</th><th>Rate hold included</th></tr>
  </thead>
  <tbody>
    <tr><td>Major banks (TD, RBC, BMO, CIBC, Scotiabank)</td><td>90–120 days</td><td>Yes, for the same period</td></tr>
    <tr><td>Credit unions</td><td>60–90 days</td><td>Varies by institution</td></tr>
    <tr><td>Monoline lenders (via broker)</td><td>90–120 days</td><td>Yes</td></tr>
    <tr><td>Alternative (B) lenders</td><td>30–90 days</td><td>Varies</td></tr>
  </tbody>
</table>

<p>The rate hold is one of the most valuable parts of a pre-approval. If you lock in a rate of 4.5% today and rates rise to 5.2% before you find a home, your pre-approval rate protects you — as long as you firm up within the validity window. If rates fall below your pre-approval rate, most lenders will allow you to access the lower rate at time of commitment.</p>

<h2>What the Rate Hold Actually Covers</h2>

<p>A rate hold guarantees a specific rate for a specific product (e.g., 5-year fixed at 4.5%) for the duration of your pre-approval. What it doesn't do:</p>
<ul>
  <li>It doesn't guarantee you'll be approved for the specific property you choose — the lender still needs to approve the property</li>
  <li>It doesn't lock in your maximum purchase amount if your income, debts, or credit change</li>
  <li>It doesn't obligate you to use that lender — you can switch lenders before the mortgage funds</li>
</ul>

<p>The rate hold is conditional on your financial situation remaining as documented at pre-approval. A job change, new car loan, or significant credit card balance increase can void the rate hold and require re-underwriting. See also <a href="/blog/does-mortgage-pre-approval-guarantee-a-mortgage">does mortgage pre-approval guarantee a mortgage</a> for what can go wrong between pre-approval and closing.</p>

<h2>What Happens When Pre-Approval Expires</h2>

<p>When your pre-approval expires, you need to reapply. This means:</p>
<ul>
  <li>A new credit bureau pull (another hard inquiry on your credit)</li>
  <li>Updated income documents (recent pay stubs, updated bank statements)</li>
  <li>Re-qualification at whatever the current stress test rate is at that time</li>
  <li>A new rate hold at current market rates (which may be higher or lower than your expired rate)</li>
</ul>

<p>Renewal is straightforward if your employment, income, and debt load haven't changed. The practical cost is primarily the new hard credit pull and the time to re-submit documents. If rates have risen since your original pre-approval, you won't get your old rate back — you'll get whatever the current rate is at renewal.</p>

<h2>Managing Your Search Timeline</h2>

<p>In the GTA, where desirable properties in neighbourhoods like Leslieville, the Danforth, or Willowdale sell within days of listing, 90 days is a real constraint. Common buyer mistakes:</p>
<ul>
  <li>Getting pre-approved too early (before seriously searching) and letting it expire before finding a home</li>
  <li>Getting pre-approved too late and not having the commitment letter ready when the right property appears</li>
</ul>

<p>The right timing: get pre-approved when you're actively searching — when you've defined your criteria, budget, and target neighbourhoods, and you're prepared to make an offer within 90 days. If your search extends past 90 days, the renewal process is simple enough that it's not worth rushing into an unsuitable property to beat the clock.</p>

<p>What buyers often miss is that a pre-approval expiry doesn't mean starting from scratch. Most of your documents remain valid or need only minor updates. Your mortgage broker can often renew your pre-approval with a single phone call and a few fresh documents.</p>

<p>If you're actively searching, <a href="/homes-for-sale/toronto">browse GTA listings on Condohill</a> to get a realistic sense of what's available in your price range before you commit to a pre-approval timeline.</p>

<h2>FAQ</h2>

<h3>Can I extend my mortgage pre-approval?</h3>
<p>Yes. Most lenders will renew or extend a pre-approval if it expires before you've found a home. Contact your broker or lender before expiry, update your income documents and bank statements, and the lender will issue a new pre-approval. You'll receive a new rate hold at current rates, which may differ from your original rate.</p>

<h3>Does my pre-approval rate hold if I find a home close to expiry?</h3>
<p>Yes, as long as you have a firm, unconditional Agreement of Purchase and Sale submitted to the lender before the pre-approval expiry date. Once the lender formally approves the specific property and commits to advancing the mortgage, the rate is locked. If your conditional period extends past the pre-approval expiry, contact your lender to confirm how they handle the rate hold in that situation.</p>

<h3>What if rates drop below my pre-approval rate?</h3>
<p>Most lenders will honour a lower rate if rates fall before your mortgage funds. Confirm this with your lender or broker at pre-approval — some automatically apply the lower rate at commitment, while others require you to request it. This is more common with major bank pre-approvals than with some monoline lenders.</p>

<h3>Does pre-approval expiry hurt my credit?</h3>
<p>A pre-approval expiry itself doesn't hurt your credit. The only credit impact is the hard pull required when you reapply. Multiple mortgage hard inquiries within a 14–45 day window are typically treated as a single inquiry by credit bureaus, so shopping pre-approvals around renewal time has minimal impact on your score.</p>

<h3>Should I get pre-approved before starting my home search?</h3>
<p>Yes. In the GTA, offers move quickly, and sellers expect pre-approved buyers. Getting pre-approved before your search confirms your budget, signals seriousness to sellers and agents, and means you're ready to move when the right property appears. Time your pre-approval to when you're genuinely ready to make an offer within the 90-to-120-day window.</p>`,
  },
  {
    title: 'Does Mortgage Pre-Approval Guarantee a Mortgage?',
    slug: 'does-mortgage-pre-approval-guarantee-a-mortgage',
    metaDescription: 'Mortgage pre-approval does not guarantee financing. The property still needs to appraise, your income must stay consistent, and no major financial changes can occur. Here\'s what can go wrong.',
    summary: 'Mortgage pre-approval is not a guarantee that your mortgage will be approved. The property must still appraise at the purchase price, your income and debt situation must remain unchanged, and the lender must formally approve the specific property before advancing funds.',
    body: `<!-- Primary keyword: does mortgage pre-approval guarantee a mortgage | Intent: informational | Word count target: 1500 -->

<p>Mortgage pre-approval does not guarantee you'll receive a mortgage on a specific property. A pre-approval confirms that a lender is willing to lend you up to a certain amount based on your current financial profile — but the final mortgage is subject to the property being formally approved, your income remaining stable, and no significant changes to your debt or credit. Most pre-approved buyers do get their mortgage; the exceptions tend to involve predictable situations that buyers can avoid with proper planning. This guide covers what can go wrong between pre-approval and closing, and how to protect yourself.</p>

<p>Pre-approval gives you the confidence to make offers in the GTA with a financing condition — but understanding its limits prevents nasty surprises during the conditional period. See <a href="/blog/how-to-get-mortgage-pre-approval">how to get mortgage pre-approval</a> and <a href="/blog/how-long-is-mortgage-pre-approval-valid">how long pre-approval is valid</a> for the full context.</p>

<h2>What Pre-Approval Actually Confirms</h2>

<p>A pre-approval commits the lender to three things, subject to conditions:</p>
<ul>
  <li>A maximum loan amount based on your documented income, debts, and down payment</li>
  <li>A rate hold for the pre-approval period (typically 90–120 days)</li>
  <li>A preliminary assessment that your credit and income profile qualifies for their lending criteria</li>
</ul>

<p>What it does not confirm: that any specific property will be approved, that the property's value matches the purchase price, or that your financial situation will remain unchanged between pre-approval and closing.</p>

<h2>Reasons a Mortgage Falls Through After Pre-Approval</h2>

<h3>Property Doesn't Appraise at the Purchase Price</h3>

<p>Every lender requires an appraisal before advancing mortgage funds. The appraisal determines the property's market value as assessed by a licensed appraiser. If the appraised value comes in below the agreed purchase price — which happens in heated bidding war situations where buyers overpay — the lender will only advance funds based on the appraised value, not the contract price.</p>

<p>Example: You agreed to pay $1,000,000 with a 10% down payment ($100,000). The property appraises at $950,000. Your lender will advance 90% of $950,000 = $855,000 — not 90% of $1,000,000 = $900,000. The $45,000 gap is your responsibility to cover with additional cash, or the deal falls through. In multiple-offer situations where buyers waive the financing condition, this risk is entirely the buyer's.</p>

<h3>Income Changes Before Closing</h3>

<p>Losing your job, switching from full-time to part-time employment, taking unpaid leave, or changing from employed to self-employed between pre-approval and closing can all trigger the lender to re-underwrite or withdraw the mortgage commitment. Your lender verifies employment before advancing funds — often with a final call to your employer days before closing. A change at that point leaves you with very little time to find alternative financing.</p>

<h3>New Debt or Credit Changes</h3>

<p>Taking on new debt between pre-approval and closing is one of the most common reasons mortgages fall through. Financing a car, co-signing a loan, maxing out credit cards, or opening new credit accounts all affect your TDS ratio and can take you outside the qualifying threshold. What buyers often miss is that lenders often re-pull credit shortly before closing — a new debt that appeared after your original pre-approval will show up.</p>

<h3>Property Issues That Fail Lender Standards</h3>

<p>Not all properties qualify for all lenders' standard mortgage products. Issues that can cause a lender to decline the specific property include:</p>
<ul>
  <li>Condos with ongoing litigation or pending special assessments flagged in the status certificate</li>
  <li>Rural properties without potable water access</li>
  <li>Properties with major structural issues identified in an appraisal or inspection</li>
  <li>Non-warrantable condos (buildings with high investor-to-owner ratios or commercial on the main floor in some cases)</li>
  <li>Properties with a short-term rental history that doesn't fit residential mortgage criteria</li>
</ul>

<h3>Down Payment Source Issues</h3>

<p>If your down payment funds come from a source the lender can't verify or doesn't accept — such as borrowed money without disclosure, undocumented gift funds, or recent large deposits without a paper trail — the lender may require additional documentation or refuse the advance. <a href="/blog/what-documents-do-i-need-to-buy-a-house">Documenting your down payment properly from the start</a> avoids this scenario.</p>

<h2>How the Financing Condition Protects You</h2>

<p>Including a <strong>financing condition</strong> in your offer — typically 5 business days — gives you time to have the specific property formally approved by your lender before you're committed. If the lender declines the property or your formal mortgage commitment doesn't come through, you can exercise the condition and walk away with your deposit returned.</p>

<p>Waiving the financing condition (going firm without it) exposes you to all of the above risks. In the GTA's competitive market, buyers are sometimes pressured to waive conditions to compete. This is a meaningful risk and should only be considered with a thoroughly reviewed property, a confirmed appraisal, and a strong relationship with your lender. See <a href="/blog/what-is-a-firm-offer">what a firm offer means</a> and <a href="/blog/difference-between-firm-and-conditional-offer">the difference between a firm and conditional offer</a>.</p>

<p>Searching for your next home? <a href="/homes-for-sale/toronto">Browse active GTA listings on Condohill</a> and know what you're getting into financially before you make an offer.</p>

<h2>FAQ</h2>

<h3>Can a lender cancel a mortgage after pre-approval?</h3>
<p>Yes. A pre-approval is conditional, not a binding commitment to advance funds on any property. A lender can decline to proceed after pre-approval if the property doesn't appraise, your income changes, new debt appears, or the property has qualifying issues. A formal mortgage commitment letter, issued after the property is approved, is a stronger signal — but even then, lenders verify employment and credit before closing.</p>

<h3>What happens if the appraisal comes in low?</h3>
<p>If the appraisal is below the purchase price, the lender will only advance funds based on the appraised value. You must cover the gap with additional cash (increasing your effective down payment), negotiate the purchase price down with the seller, or find a different lender whose appraiser values the property differently. If you cannot cover the gap and the seller won't reduce the price, and you have a financing condition, you can exit the deal and receive your deposit back.</p>

<h3>Should I avoid taking on new debt before closing?</h3>
<p>Yes. Do not finance a car, open new credit cards, take out a personal loan, or co-sign any debt between your pre-approval and your mortgage closing. Lenders re-pull credit before advancing funds, and new debt can push your TDS ratio above qualifying limits. If you need a large purchase, wait until after your mortgage funds.</p>

<h3>Can my pre-approval be declined if I change jobs?</h3>
<p>It depends on the job change. Moving to a higher-paying role in the same field at the same or increased salary is generally fine. Switching from employed to self-employed, taking a pay cut, moving from permanent to contract, or starting a job with a probationary period can trigger re-underwriting. Inform your mortgage broker about any job change as soon as it happens so they can advise whether it affects your qualification.</p>`,
  },
  {
    title: 'Can I Buy a Home While Self-Employed in Ontario?',
    slug: 'can-i-buy-a-home-while-self-employed',
    metaDescription: 'Self-employed buyers can get mortgages in Ontario, but lenders need 2 years of income history and use your net income — not revenue. Here\'s how to qualify.',
    summary: 'Self-employed buyers can absolutely get a mortgage in Ontario, but the qualification process is more complex. Lenders require 2 years of T1 tax returns and Notices of Assessment and use your net income — not your gross revenue — which often creates challenges for buyers who write off significant business expenses.',
    body: `<!-- Primary keyword: buying a home while self-employed in Ontario | Intent: informational | Word count target: 1800 -->

<p>Self-employed Canadians can get mortgages and buy homes in Ontario — but the process works differently than it does for salaried employees. Lenders need to verify stable, consistent income, and for self-employed buyers, that means two years of T1 tax returns, Notices of Assessment, and often business financial statements. The complication: lenders use your <strong>net income after business expenses</strong>, not your gross revenue. Many self-employed buyers earn substantial revenue but report relatively low net income after legitimate write-offs — which reduces the mortgage they qualify for. This guide explains how self-employed mortgage qualification works in the GTA, what lenders look for, and how to improve your position.</p>

<p>If you're self-employed and starting to think about buying, the first step is understanding how lenders will see your income — before you've set a budget, before you're searching, and before you've built expectations around a purchase price. Getting pre-approved while self-employed takes more time and documentation than a standard salaried application. See <a href="/blog/what-documents-do-i-need-to-buy-a-house">all the documents needed to buy a house in Ontario</a> for the full list.</p>

<h2>What Lenders Need From Self-Employed Buyers</h2>

<p>Standard A-lenders (major banks, credit unions, monoline lenders) require:</p>
<ul>
  <li>Minimum 2 years of continuous self-employment in the same field or business</li>
  <li>Last 2 years' T1 general tax returns with all schedules (including T2125 Statement of Business Activities)</li>
  <li>Last 2 years' Notices of Assessment (NOA) from CRA, confirming no outstanding tax owing</li>
  <li>For incorporated businesses: T2 corporate tax returns and Notice of Assessment for the last 2 years, plus T4 and/or dividend records showing what you paid yourself</li>
  <li>3–6 months of business bank statements (some lenders require this)</li>
  <li>Business registration documents or Certificate of Incorporation</li>
  <li>Proof that HST/GST remittance is current (some lenders request this)</li>
</ul>

<h2>The Net Income Problem</h2>

<p>The core challenge for most self-employed buyers is that legitimate business deductions — home office, vehicle, equipment, meals, insurance, professional fees — reduce your taxable net income. Lenders qualifying you for a mortgage look at this net income number, not your gross revenue.</p>

<p>Example: You earn $180,000 in gross revenue. After legitimate deductions, your net income on Line 15000 of your T1 is $85,000. A lender using $85,000 as your qualifying income applies the stress test and debt ratios to that number — qualifying you for significantly less than a salaried person earning $180,000 would get.</p>

<p>Some lenders allow add-backs: non-cash deductions like Capital Cost Allowance (depreciation) can be added back to your net income for qualifying purposes, since they don't represent money you actually spent that year. Your mortgage broker should identify which add-backs your specific lender permits.</p>

<h2>Stated Income / Alt-A Programs</h2>

<p>For self-employed buyers whose T1 net income doesn't support the mortgage they need, alternative lenders offer <strong>stated income programs</strong> (also called self-employed or Alt-A programs). These programs use a lender-calculated income estimate based on industry norms for your business type, rather than your reported net income.</p>

<p>Alternative lenders offering these programs in Ontario include Home Trust, Equitable Bank, Fairstone Financial, and MCAP. Key differences from A-lending:</p>
<ul>
  <li>Interest rates typically 0.25–1.5% higher than A-lender rates</li>
  <li>Minimum down payment of 20% required (no CMHC insurance available on stated income products)</li>
  <li>Lender uses a reasonable income estimate for your industry, not your actual reported income</li>
  <li>Still requires 2 years of self-employment history and NOAs with no tax owing</li>
</ul>

<p>A <a href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers" target="_blank" rel="noopener noreferrer">CMHC-insured mortgage</a> (under 20% down) is generally not available through stated income programs, since CMHC requires full income documentation. With 20% or more down, alternative lenders can offer reasonable flexibility for established self-employed buyers.</p>

<h2>How to Strengthen Your Self-Employed Mortgage Application</h2>

<ul>
  <li><strong>Minimize write-offs in the 1–2 years before applying.</strong> Increasing your net income on T1s in the years you plan to buy — even if it means paying slightly more tax — directly increases your qualifying income.</li>
  <li><strong>Clear CRA balances.</strong> Outstanding income tax or HST/GST owing is a red flag for lenders and can result in outright declines. File on time and pay what's owing.</li>
  <li><strong>Build a larger down payment.</strong> More than 20% down opens alternative lender programs and reduces the loan amount relative to the property value.</li>
  <li><strong>Keep business and personal finances separate.</strong> Lenders want clean bank statements — business transactions mixed with personal spending create documentation problems.</li>
  <li><strong>Work with a mortgage broker who specializes in self-employed files.</strong> This is not an area where going directly to your bank is typically advantageous — brokers know which lenders are most flexible for specific self-employment structures.</li>
</ul>

<h2>Incorporated vs. Sole Proprietor</h2>

<p>How you structure your business affects mortgage qualification:</p>

<table>
  <thead>
    <tr><th></th><th>Sole proprietor</th><th>Incorporated (limited company)</th></tr>
  </thead>
  <tbody>
    <tr><td>Income lenders use</td><td>T1 net income (Line 15000)</td><td>T4 salary + dividends paid to you personally</td></tr>
    <tr><td>Documents required</td><td>T1 + T2125 + NOA</td><td>T1 + T2 + NOA + T4 slips + dividend records</td></tr>
    <tr><td>Common issue</td><td>Deductions reduce net income</td><td>Income left inside the corporation doesn't qualify you</td></tr>
  </tbody>
</table>

<p>For incorporated buyers, only the income you actually pay yourself — T4 salary or dividends — counts toward mortgage qualification. Corporate retained earnings, even if substantial, do not. This surprises many incorporated professionals who have significant wealth inside their corporation but modest personal taxable income.</p>

<h2>First-Time Buyers Who Are Self-Employed</h2>

<p>Self-employed first-time buyers qualify for all the same programs as any first-time buyer — the <a href="/blog/first-time-home-buyer-benefits-ontario">Ontario land transfer tax rebate, FHSA, HBP, and HBTC</a> — provided you meet the eligibility criteria for each. The self-employment status affects only the mortgage qualification process, not your eligibility for government incentives.</p>

<p>Searching for homes while navigating a self-employed application? <a href="/homes-for-sale/toronto">Browse GTA listings on Condohill</a> to get a feel for what's available in your target price range while you work through pre-approval.</p>

<h2>FAQ</h2>

<h3>How long do I need to be self-employed to get a mortgage in Ontario?</h3>
<p>Most A-lenders require a minimum of 2 years of self-employment history in the same business or field, with 2 years of T1 tax returns and Notices of Assessment. Some lenders will consider 1 year of self-employment if you can demonstrate a transition from the same employed field (e.g., an accountant going from firm employment to running their own accounting practice), but this is lender-specific and usually requires a larger down payment.</p>

<h3>Can I use my business income for a mortgage in Canada?</h3>
<p>Lenders use your net personal income, not your business's gross revenue. For sole proprietors, that's your T1 net income after deductions. For incorporated buyers, that's the salary and/or dividends you paid yourself personally. Income retained inside a corporation generally does not count toward mortgage qualification, even if the corporation is profitable.</p>

<h3>What is a stated income mortgage for self-employed buyers?</h3>
<p>A stated income mortgage lets alternative lenders use a reasonable income estimate for your industry rather than your actual reported net income. It's available with at least 20% down through lenders like Home Trust, Equitable Bank, and MCAP. Rates are typically 0.25–1.5% higher than A-lender rates. It's a useful option for self-employed buyers whose T1 net income understates their actual earning capacity due to legitimate business deductions.</p>

<h3>Do I need to show profit on my business to get a mortgage?</h3>
<p>Yes. Lenders want to see stable, positive net income over at least 2 years. Consistent losses on a business — even if the business is growing — raise serious concerns for mortgage lenders about your ability to service debt. Some lenders will average 2 years of income; if year 1 was low and year 2 was strong, the average may still be sufficient to qualify for the mortgage amount you need.</p>`,
  },
  {
    title: 'Can First-Time Buyers Buy a Condo in Toronto?',
    slug: 'can-first-time-buyers-buy-a-condo-in-toronto',
    metaDescription: 'First-time buyers can absolutely buy a condo in Toronto. All first-time buyer programs apply. Here\'s what\'s different about condo purchases and what to watch for.',
    summary: 'First-time buyers can purchase a condo in Toronto and qualify for all the same programs as house buyers — Ontario and Toronto land transfer tax rebates, FHSA, HBP, and HBTC. Condo purchases have some specific considerations around status certificates, maintenance fees, and pre-construction.',
    body: `<!-- Primary keyword: first-time buyer condo Toronto | Intent: informational | Word count target: 1600 -->

<p>First-time buyers can absolutely buy a condo in Toronto. All first-time buyer programs — the provincial and Toronto land transfer tax rebates, the First Home Savings Account (FHSA), the Home Buyers' Plan (HBP), and the First-Time Home Buyers' Tax Credit (HBTC) — apply to condo purchases exactly as they do to houses. For many first-time buyers in Toronto, a condo is the most realistic entry point into homeownership given typical detached and semi-detached price points. This guide covers how condo purchases work for first-time buyers, what's different from buying a house, and what to watch out for.</p>

<p>For all the programs available to you as a first-time buyer, see <a href="/blog/first-time-home-buyer-benefits-ontario">first-time home buyer benefits in Ontario</a>. For how buying a condo fits into the broader purchase process, see <a href="/blog/steps-to-buying-a-home-in-the-gta">steps to buying a home in the GTA</a>.</p>

<h2>What's Different About Buying a Condo vs. a House</h2>

<h3>Status Certificate</h3>

<p>The most important condo-specific document is the <strong>status certificate</strong> — a package of information about the condo corporation that the seller is required to provide on request within 10 days. Your lawyer must review the status certificate before you firm up (remove conditions). The certificate includes:</p>
<ul>
  <li>The condo corporation's financial statements and budget</li>
  <li>Reserve fund status and the most recent reserve fund study</li>
  <li>Any pending or threatened lawsuits against the corporation</li>
  <li>Outstanding special assessments or planned increases in maintenance fees</li>
  <li>Rules, bylaws, and declaration</li>
</ul>

<p>A weak reserve fund — one that's underfunded relative to the building's deferred maintenance needs — can result in a surprise special assessment of $10,000–$50,000+ per unit in the future. Your lawyer's status certificate review specifically looks for these red flags. Buyers who skip this review are taking on unknown liabilities. The status certificate condition in your offer should give you 5–10 business days for your lawyer's review.</p>

<h3>Maintenance Fees</h3>

<p>Condos have monthly maintenance fees (also called common expense fees) that cover building amenities, common area maintenance, utilities in the common elements, building insurance, and contributions to the reserve fund. In Toronto, maintenance fees range widely — from $300–$500/month for smaller units in newer buildings to $900–$1,500/month for larger units or buildings with extensive amenities (concierge, pool, gym, parking structure).</p>

<p>Maintenance fees affect your mortgage qualification. Lenders include 50% of the monthly maintenance fee in your GDS ratio calculation. A $700/month maintenance fee adds $350/month to your qualifying housing costs, reducing the mortgage you qualify for. Budget for this when calculating what you can afford.</p>

<h3>Condo Home Inspection</h3>

<p>A condo inspection costs less than a house inspection ($250–$400 vs. $400–$650) and is more limited in scope. The inspector examines your specific unit — HVAC, electrical, plumbing within the unit, appliances, windows, and visible defects — but cannot inspect shared building systems (roof, building envelope, elevators). The status certificate's financial documents and reserve fund study are your window into the building's overall condition, which is why both the inspection and the status certificate review matter.</p>

<h2>All First-Time Buyer Programs Apply to Condo Purchases</h2>

<table>
  <thead>
    <tr><th>Program</th><th>Applies to condo purchase?</th><th>Key details</th></tr>
  </thead>
  <tbody>
    <tr><td>Ontario LTT rebate</td><td>Yes</td><td>Up to $4,000 on provincial land transfer tax</td></tr>
    <tr><td>Toronto MLTT rebate</td><td>Yes</td><td>Up to $4,475 for condos within City of Toronto</td></tr>
    <tr><td>First Home Savings Account (FHSA)</td><td>Yes</td><td>Withdrawals for qualifying home purchase are tax-free</td></tr>
    <tr><td>Home Buyers' Plan (HBP)</td><td>Yes</td><td>Withdraw up to $60,000 from RRSP</td></tr>
    <tr><td>First-Time Home Buyers' Tax Credit</td><td>Yes</td><td>$10,000 non-refundable credit = $1,500 tax savings</td></tr>
    <tr><td>5% minimum down payment</td><td>Yes (under $500K)</td><td>10% on portion $500K–$1.499M; 20% over $1.5M</td></tr>
  </tbody>
</table>

<h2>Resale vs. Pre-Construction Condo</h2>

<p>First-time buyers considering condos face a choice between resale (existing, occupied) condos and pre-construction (off-plan, not yet built). Key differences:</p>

<ul>
  <li><strong>Resale:</strong> You see exactly what you're buying, take possession on closing day, and can use all first-time buyer programs. Status certificate review is standard practice. What you see is what you get.</li>
  <li><strong>Pre-construction:</strong> Lower entry price, longer timeline (typically 3–7 years to occupancy), and more uncertainty. Additional closing costs apply — HST on the purchase price (partially rebated for principal residences), development levies, education levies, and Tarion warranty enrollment fees — which can add 3–5% to the purchase price at closing. The FHSA is particularly useful for pre-construction purchases because you have years to accumulate the $40,000 lifetime maximum before the closing date.</li>
</ul>

<p>What first-time pre-construction buyers often miss: the HST rebate for new homes ($24,000 maximum for homes over $450,000) is only available if you occupy the unit as your principal residence — and you must apply for it. Many builders collect HST upfront and apply the rebate on your behalf; others pass the gross HST to you and leave you to claim the rebate yourself. Clarify this with the builder's lawyer before signing the purchase agreement.</p>

<h2>Condo vs. House: What Does Your Budget Get You?</h2>

<p>In Toronto's current market, a first-time buyer budget of $600,000–$800,000 can access a 1-bedroom or 1-bedroom-plus-den condo in most neighbourhoods — Leslieville, the Junction, North York, Scarborough — or a 2-bedroom condo in some areas. A comparable budget for a freehold house is insufficient for a detached home in most of Toronto but can reach into semi-detached territory in Scarborough or East York, or townhouse options further east or north. Condos offer the lower entry point for most first-time buyers staying within the city.</p>

<p>Ready to find your first condo in Toronto? <a href="/homes-for-sale/toronto">Browse active Toronto listings on Condohill</a> and filter by property type to see what's available in your price range.</p>

<h2>FAQ</h2>

<h3>Do first-time buyer land transfer tax rebates apply to condo purchases?</h3>
<p>Yes. The Ontario first-time buyer provincial land transfer tax rebate (up to $4,000) and the Toronto municipal land transfer tax rebate (up to $4,475) both apply to condo purchases within their respective jurisdictions, exactly as they do for house purchases. The property type doesn't affect eligibility — what matters is that it's your principal residence and you qualify as a first-time buyer.</p>

<h3>Can I use the Home Buyers' Plan to buy a condo?</h3>
<p>Yes. The Home Buyers' Plan allows you to withdraw up to $60,000 from your RRSP tax-free for any qualifying home purchase — house, condo, townhouse, or new construction. The qualifying home must be your principal residence, and you must intend to occupy it within one year of purchase.</p>

<h3>What is a status certificate and do I need to review it?</h3>
<p>A status certificate is a package of documents about the condo corporation — its financials, reserve fund status, bylaws, rules, and any outstanding legal claims or special assessments. Every condo buyer should have their real estate lawyer review it before firming up on a purchase. A status certificate condition in your offer (typically 5–10 business days) gives your lawyer time to flag any red flags such as an underfunded reserve fund or pending litigation.</p>

<h3>Are maintenance fees included in mortgage qualification calculations?</h3>
<p>Yes. Lenders include 50% of the monthly maintenance fee in your GDS (Gross Debt Service) ratio. A $600/month maintenance fee adds $300/month to your qualifying housing costs. This reduces the mortgage you qualify for compared to a house purchase at the same price point. Factor maintenance fees into your budget from the start.</p>

<h3>What is the HST rebate for new condo purchases in Ontario?</h3>
<p>New construction condos are subject to HST (13%) on the purchase price. First-time buyers purchasing a new condo as their principal residence qualify for a federal HST new housing rebate of up to 36% of the federal portion (5%), capped at $6,300, and an Ontario new housing rebate. The combined maximum rebate for principal residences over $450,000 is approximately $24,000. How this is handled at closing depends on the builder — confirm with the builder's lawyer whether HST and the rebate are built into the purchase price or separate.</p>`,
  },
  {
    title: 'First-Time Home Buyer Benefits in Ontario',
    slug: 'first-time-home-buyer-benefits-ontario',
    metaDescription: 'Complete guide to first-time home buyer benefits in Ontario — land transfer tax rebates, FHSA, Home Buyers\' Plan, the tax credit, and how to combine them.',
    summary: 'Ontario first-time home buyers have access to several programs that reduce upfront costs and improve affordability: provincial and Toronto land transfer tax rebates, the First Home Savings Account (FHSA), the Home Buyers\' Plan (HBP), and the First-Time Home Buyers\' Tax Credit.',
    body: `<!-- Primary keyword: first-time home buyer benefits Ontario | Intent: informational | Word count target: 1900 -->

<p>First-time home buyers in Ontario have access to several programs that meaningfully reduce the upfront cost of purchasing. The most valuable for most buyers: the provincial land transfer tax rebate (up to $4,000), the Toronto municipal land transfer tax rebate for Toronto purchases (up to $4,475), the First Home Savings Account (FHSA), the Home Buyers' Plan (RRSP withdrawal), and the First-Time Home Buyers' Tax Credit. Used together strategically, these programs can save first-time buyers $15,000–$25,000 or more on their first purchase. This guide covers each benefit, what you get, and how to qualify.</p>

<p>Understanding which programs you qualify for before you start searching helps you set a realistic budget. The benefits listed here apply to resale homes, new construction, and condos equally, unless noted otherwise. For how these programs interact with the overall purchase process, see <a href="/blog/steps-to-buying-a-home-in-the-gta">steps to buying a home in the GTA</a>.</p>

<h2>Ontario Land Transfer Tax Rebate</h2>

<p>Every Ontario home purchase is subject to provincial land transfer tax. First-time buyers receive a rebate of up to <strong>$4,000</strong> on provincial land transfer tax. This rebate is applied at closing by your lawyer — you don't claim it separately on your taxes.</p>

<p>The rebate eliminates provincial LTT entirely on purchases up to approximately $368,000. On purchases above that threshold, the rebate reduces (but doesn't eliminate) the tax. For a $700,000 purchase, provincial LTT is $10,475 — after the $4,000 rebate, you pay $6,475.</p>

<p>To qualify: Canadian citizen or permanent resident, at least 18 years old, never previously owned a home anywhere in the world, spouse cannot have owned a home during the relationship, property must become your principal residence. See <a href="/blog/how-much-is-land-transfer-tax-in-ontario">how Ontario land transfer tax is calculated</a> for full rate details.</p>

<h2>Toronto Municipal Land Transfer Tax Rebate</h2>

<p>Buyers purchasing within the City of Toronto pay a second land transfer tax (the MLTT) at the same rates as the provincial tax. First-time Toronto buyers receive an additional rebate of up to <strong>$4,475</strong> on the MLTT.</p>

<p>Combined with the provincial rebate, first-time Toronto buyers can save up to <strong>$8,475</strong> in land transfer taxes. On a $700,000 Toronto purchase, combined LTT without rebates is $20,950. With both first-time buyer rebates, you pay approximately $12,475. The eligibility criteria are the same as the provincial rebate, and your lawyer applies both at closing. See <a href="/blog/what-is-toronto-municipal-land-transfer-tax">what the Toronto municipal land transfer tax is</a> for details on who pays it.</p>

<h2>First Home Savings Account (FHSA)</h2>

<p>The FHSA is the most powerful savings tool available to first-time buyers in Canada. Introduced in 2023, it combines the tax advantages of both an RRSP and a TFSA:</p>

<ul>
  <li>Contributions are <strong>tax-deductible</strong> (like an RRSP) — reducing your taxable income in the year you contribute</li>
  <li>Withdrawals for a qualifying home purchase are <strong>completely tax-free</strong> (like a TFSA) — you don't pay tax on the growth</li>
  <li>Annual contribution limit: <strong>$8,000</strong> per year</li>
  <li>Lifetime contribution limit: <strong>$40,000</strong></li>
  <li>Unused contribution room carries forward (max $8,000/year carryforward)</li>
</ul>

<p>Example: You open an FHSA today and contribute $8,000/year for 5 years, investing in a balanced ETF that grows at 6%/year. At withdrawal, you'd have roughly $47,000 — all tax-free at purchase. The $40,000 in contributions would also have reduced your taxable income by $40,000 over those 5 years, saving an additional $10,000–$20,000 in income tax depending on your marginal rate.</p>

<p>To qualify: Canadian resident, at least 18 years old, first-time buyer (did not own a principal residence at any time in the current year or the preceding 4 calendar years). The account must be opened with a bank, broker, or credit union offering FHSAs — available through most major Canadian financial institutions. Learn more at <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html" target="_blank" rel="noopener noreferrer">CRA's FHSA page</a>.</p>

<h2>Home Buyers' Plan (HBP)</h2>

<p>The Home Buyers' Plan allows first-time buyers to withdraw up to <strong>$60,000</strong> from their RRSP tax-free and use those funds for a qualifying home purchase. If you're purchasing with a partner who also qualifies as a first-time buyer, you can each withdraw $60,000 — a combined $120,000 from your RRSPs.</p>

<p>Key rules:</p>
<ul>
  <li>The RRSP funds must have been in the account for at least <strong>90 days</strong> before withdrawal</li>
  <li>You have 2 years after the year of purchase to start repayments, then <strong>15 years</strong> to repay the full amount</li>
  <li>Each year's required repayment is the total withdrawn divided by 15. If you don't repay in a given year, that year's repayment amount is added to your income and taxed</li>
  <li>You must be a Canadian resident and a first-time buyer (same 4-year rule)</li>
  <li>The home must be your principal residence, occupied within one year of purchase</li>
</ul>

<p>You can use both the FHSA and the HBP on the same home purchase — the two programs can be combined. See our detailed guide on <a href="/blog/what-is-the-home-buyers-plan">what the Home Buyers' Plan is and how it works</a>.</p>

<h2>First-Time Home Buyers' Tax Credit (HBTC)</h2>

<p>The HBTC is a $10,000 non-refundable federal tax credit available to first-time buyers in the year of purchase. At the 15% federal tax rate, it translates to a <strong>$1,500 reduction in federal income tax</strong> owing. If you and a co-purchaser both qualify as first-time buyers, you can split the credit (combined maximum $10,000).</p>

<p>Claim it on line 31270 of your T1 general tax return for the year you purchased. The credit reduces tax owing — if you owe less tax than $1,500, you receive the difference as a refund only up to the amount of tax you actually owe (it's non-refundable). See <a href="/blog/what-is-the-first-time-home-buyer-tax-credit">what the first-time home buyer tax credit is</a> for full details.</p>

<h2>Minimum Down Payment Rules for First-Time Buyers</h2>

<p>First-time buyers in Canada are subject to the same minimum down payment rules as all buyers. As of December 2024:</p>

<table>
  <thead>
    <tr><th>Purchase price</th><th>Minimum down payment</th></tr>
  </thead>
  <tbody>
    <tr><td>Under $500,000</td><td>5% of purchase price</td></tr>
    <tr><td>$500,000 – $1,499,999</td><td>5% of first $500K + 10% of the remainder</td></tr>
    <tr><td>$1,500,000 or more</td><td>20% of purchase price</td></tr>
  </tbody>
</table>

<p>For a $750,000 purchase: 5% × $500,000 ($25,000) + 10% × $250,000 ($25,000) = $50,000 minimum down (6.67%). For a $1,000,000 purchase: $25,000 + 10% × $500,000 ($50,000) = $75,000 minimum down (7.5%). Properties over $1.5M require 20% down regardless of first-time buyer status.</p>

<p>If your down payment is less than 20%, you must purchase <a href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers" target="_blank" rel="noopener noreferrer">CMHC mortgage default insurance</a>. The premium (2.8–4.0% of the mortgage amount) is added to your mortgage balance, and Ontario charges PST on the premium at closing.</p>

<h2>The First-Time Home Buyer Incentive (FTHBI) — Cancelled</h2>

<p>The federal First-Time Home Buyer Incentive (FTHBI), which provided a shared-equity mortgage of 5–10% from the federal government, was cancelled effective March 21, 2024. No new applications are accepted. If you've seen it referenced in older guides or resources, it is no longer available.</p>

<p>Ready to start your search? <a href="/homes-for-sale/toronto">Browse homes for sale across the GTA on Condohill</a> and filter by price to see what your budget can reach with first-time buyer programs applied.</p>

<h2>FAQ</h2>

<h3>Can I use both the FHSA and the Home Buyers' Plan when buying a home?</h3>
<p>Yes. You can use both programs on the same qualifying home purchase. Combined, they allow you to access up to $40,000 from your FHSA (tax-free) and up to $60,000 from your RRSP through the HBP, for a potential $100,000 in tax-advantaged funds toward your down payment. Both must meet their own eligibility conditions.</p>

<h3>What is the first-time buyer rule about owning a home previously?</h3>
<p>For most first-time buyer programs in Canada, "first-time buyer" means you have not owned a principal residence that you occupied at any time in the current calendar year or in any of the preceding 4 calendar years. If you owned a home 6 years ago, you may qualify again. The rules are identical for federal programs (FHSA, HBP, HBTC) and the provincial land transfer tax rebate; the Toronto MLTT rebate has similar criteria.</p>

<h3>Do first-time buyer programs apply to new construction and condos?</h3>
<p>Yes. All programs — LTT rebates, FHSA, HBP, and HBTC — apply to resale homes, new construction, and condo purchases equally, as long as the property becomes your principal residence and you meet the eligibility criteria for each program.</p>

<h3>What is the maximum land transfer tax rebate for first-time buyers in Toronto?</h3>
<p>First-time buyers purchasing within the City of Toronto can receive up to $4,000 from the provincial land transfer tax rebate and up to $4,475 from the Toronto municipal land transfer tax rebate — a combined maximum of $8,475. Both rebates are applied by your lawyer at closing without a separate application.</p>`,
  },
  {
    title: 'What Is the First-Time Home Buyer Tax Credit in Canada?',
    slug: 'what-is-the-first-time-home-buyer-tax-credit',
    metaDescription: 'The First-Time Home Buyers\' Tax Credit (HBTC) is a $10,000 non-refundable federal tax credit worth $1,500 in tax savings. Here\'s how to claim it on your return.',
    summary: 'The First-Time Home Buyers\' Tax Credit (HBTC) is a federal $10,000 non-refundable tax credit that reduces your income tax by $1,500 in the year you purchase your first home. You claim it on line 31270 of your T1 return.',
    body: `<!-- Primary keyword: first-time home buyer tax credit Canada | Intent: informational | Word count target: 1500 -->

<p>The First-Time Home Buyers' Tax Credit (HBTC) is a federal non-refundable tax credit available to Canadians who purchase their first home. The credit amount is $10,000, which at the 15% federal tax rate translates to a <strong>$1,500 reduction in federal income tax</strong> in the year you purchase. You claim it on line 31270 of your T1 general return — no application, no CRA registration, just the line on your taxes. For GTA buyers already stretching their budget on a first purchase, $1,500 returned through your tax refund is a welcome addition on top of the other programs available to first-time buyers.</p>

<p>The HBTC is one of several programs available to first-time buyers in Ontario. For the complete picture — including the FHSA, the Home Buyers' Plan, and land transfer tax rebates — see <a href="/blog/first-time-home-buyer-benefits-ontario">first-time home buyer benefits in Ontario</a>.</p>

<h2>How the Tax Credit Works</h2>

<p>A non-refundable tax credit reduces your federal income tax owing — but only up to the amount of tax you actually owe. It cannot create a refund beyond what you've already paid through payroll deductions or installments.</p>

<p>The calculation: $10,000 × 15% (the base federal tax rate) = <strong>$1,500 in federal tax savings</strong>.</p>

<p>Example: You purchase your first home in 2025 and file your T1 in spring 2026. You've had $12,000 withheld from your paycheques in 2025 and your total federal tax owing (before credits) is $11,000. The HBTC reduces your tax owing by $1,500, to $9,500 — so you receive a refund of $2,500 ($12,000 paid minus $9,500 owing). The HBTC contributed $1,500 of that refund.</p>

<p>If your total federal tax owing is less than $1,500 (for example, you have low income or other significant credits), the HBTC will reduce your tax to zero but cannot generate a refund beyond that — it's non-refundable.</p>

<h2>Who Qualifies for the HBTC</h2>

<p>To claim the First-Time Home Buyers' Tax Credit:</p>
<ul>
  <li>You must be a Canadian resident at the time of purchase</li>
  <li>You (or your spouse or common-law partner) must not have owned a qualifying home that you occupied as your principal residence at any time in the year of purchase or in the preceding 4 calendar years</li>
  <li>The home must be a qualifying home — a housing unit in Canada (house, condo, townhouse, mobile home) that you intend to occupy as your principal residence within one year of purchase</li>
  <li>The purchase agreement must have been completed (you must have acquired the home, not just signed a pre-construction agreement)</li>
</ul>

<p>The 4-year rule means repeat first-time buyers — those who haven't owned a principal residence in the past 4+ calendar years — can qualify again. If you owned a home but sold it 6 years ago and haven't owned since, you likely qualify today.</p>

<h2>Claiming the Credit — Joint Purchases</h2>

<p>If you're purchasing with a spouse or common-law partner, you can split the $10,000 credit between your two returns. The combined claim cannot exceed $10,000. Splitting makes sense when one partner has enough federal tax owing to use the full credit — if your tax savings are limited by low income on one return, splitting the credit with the higher-income partner captures more of the $1,500 benefit.</p>

<p>Both you and your co-purchaser must independently qualify as first-time buyers for each to claim any portion of the credit. If one of you previously owned a home (in the last 4 calendar years), that person cannot claim the HBTC for this purchase, though the qualifying partner can still claim their share.</p>

<h2>How to Claim It on Your T1</h2>

<ol>
  <li>File your T1 general return for the year in which you completed the home purchase</li>
  <li>Enter $10,000 on line 31270 ("Home buyers' amount") of your return</li>
  <li>Your tax software (or accountant) calculates the resulting $1,500 credit automatically</li>
  <li>No receipts or supporting documents need to be filed with CRA — but keep your purchase documents in case of a review</li>
</ol>

<p>The claim is made in the tax year when the home is acquired — generally when the closing date occurs and title transfers to you. For a home purchased in December, it's claimed on that year's return even if you moved in January. See <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31270-home-buyers-amount.html" target="_blank" rel="noopener noreferrer">CRA's guidance on line 31270</a> for the official eligibility criteria.</p>

<h2>HBTC vs. Other First-Time Buyer Programs</h2>

<table>
  <thead>
    <tr><th>Program</th><th>Benefit amount</th><th>When you receive it</th></tr>
  </thead>
  <tbody>
    <tr><td>Ontario LTT rebate</td><td>Up to $4,000</td><td>At closing (reduces tax owing)</td></tr>
    <tr><td>Toronto MLTT rebate</td><td>Up to $4,475</td><td>At closing (reduces tax owing)</td></tr>
    <tr><td>First-Time Home Buyers' Tax Credit</td><td>$1,500 federal tax savings</td><td>When you file your taxes that year</td></tr>
    <tr><td>FHSA (First Home Savings Account)</td><td>Tax deduction + tax-free growth</td><td>Deduction in contribution years; withdrawal at purchase</td></tr>
    <tr><td>Home Buyers' Plan (HBP)</td><td>Up to $60,000 RRSP withdrawal</td><td>Tax-free at withdrawal; repay over 15 years</td></tr>
  </tbody>
</table>

<p>The HBTC is the simplest program — one line on your tax return, no application, no ongoing obligations. It stacks on top of all other first-time buyer programs. Use it every time you qualify, as it costs nothing to claim and the $1,500 savings require no action beyond filing your taxes as normal.</p>

<p>Ready to find your first home in the GTA? <a href="/homes-for-sale/toronto">Browse active listings on Condohill</a> and factor the HBTC and other first-time buyer savings into your total budget.</p>

<h2>FAQ</h2>

<h3>How much is the first-time home buyer tax credit in Canada?</h3>
<p>The First-Time Home Buyers' Tax Credit is a $10,000 non-refundable federal tax credit. At the 15% base federal tax rate, this reduces your federal income tax owing by $1,500 in the year of purchase. It's claimed on line 31270 of your T1 general return.</p>

<h3>Is the first-time home buyer tax credit refundable?</h3>
<p>No. The HBTC is a non-refundable credit, meaning it can reduce your federal tax owing to zero, but it cannot generate a tax refund beyond what you've already paid. If you owe less than $1,500 in federal tax for the year, you only benefit up to the amount of tax you actually owe.</p>

<h3>Can both spouses claim the first-time home buyer tax credit?</h3>
<p>Yes, but the combined total cannot exceed $10,000. Both spouses or common-law partners can split the $10,000 credit in any proportion that adds up to $10,000, as long as both individually qualify as first-time buyers. Each partner's share is claimed on their own T1 return on line 31270.</p>

<h3>Can I claim the HBTC if I bought a pre-construction condo?</h3>
<p>You can claim the HBTC in the year the home is acquired — meaning the year the purchase legally closes and title transfers to you, not the year you signed the pre-construction purchase agreement. For a pre-construction condo signed in 2022 that closes in 2026, claim the credit on your 2026 T1 return.</p>

<h3>Does the HBTC apply to condos and townhouses?</h3>
<p>Yes. The HBTC applies to any qualifying home in Canada — detached houses, semi-detached houses, townhouses, condos, mobile homes — as long as it becomes your principal residence within one year of purchase and you otherwise qualify as a first-time buyer.</p>`,
  },
  {
    title: 'What Is the Home Buyers\' Plan (HBP)?',
    slug: 'what-is-the-home-buyers-plan',
    metaDescription: 'The Home Buyers\' Plan lets first-time buyers withdraw up to $60,000 from their RRSP tax-free to buy a home. Here\'s how it works, what the repayment rules are, and how to combine it with an FHSA.',
    summary: 'The Home Buyers\' Plan (HBP) allows first-time home buyers in Canada to withdraw up to $60,000 from their RRSP tax-free for a qualifying home purchase. You must repay the amount over 15 years. This guide covers eligibility, the withdrawal process, repayment rules, and how the HBP works alongside the FHSA.',
    body: `<!-- Primary keyword: Home Buyers' Plan Canada | Intent: informational | Word count target: 1700 -->

<p>The Home Buyers' Plan (HBP) is a federal program that allows first-time home buyers in Canada to withdraw up to <strong>$60,000 from their RRSP</strong> tax-free and use those funds toward the purchase of a qualifying home. As of the 2024 federal budget, the HBP limit increased from $35,000 to $60,000 per person — which means a couple purchasing together, where both qualify as first-time buyers, can access up to $120,000 from their RRSPs combined. The withdrawn funds must be repaid to your RRSP over 15 years, starting 2 years after the calendar year of your first withdrawal. This guide covers who qualifies, how to make the withdrawal, what the repayment schedule looks like, and how to combine the HBP with the First Home Savings Account (FHSA).</p>

<p>For all the programs available to first-time buyers, see <a href="/blog/first-time-home-buyer-benefits-ontario">first-time home buyer benefits in Ontario</a>. For how the HBP fits into your overall down payment strategy alongside the FHSA, see <a href="/blog/how-much-down-payment-to-buy-a-home">how much down payment you need to buy a home</a>.</p>

<h2>Who Qualifies for the Home Buyers' Plan</h2>

<p>To participate in the HBP, you must meet all of the following conditions:</p>
<ul>
  <li><strong>First-time buyer:</strong> You (and your spouse/common-law partner, if applicable) cannot have owned a principal residence that you occupied at any time in the current calendar year or the preceding 4 calendar years. This is the standard 4-year look-back rule used across most federal first-time buyer programs.</li>
  <li><strong>Written agreement:</strong> You must have a signed agreement to buy or build a qualifying home before October 1 of the year after your withdrawal</li>
  <li><strong>Canadian resident:</strong> You must be a Canadian resident at the time of the withdrawal and when you acquire the home</li>
  <li><strong>Intend to occupy:</strong> The home must be your principal residence, which you intend to move into within one year of acquiring it</li>
  <li><strong>RRSP funds aged 90 days:</strong> The funds you withdraw must have been in your RRSP for at least 90 days before the withdrawal date</li>
</ul>

<p>The 90-day rule catches buyers who try to contribute to their RRSP specifically for an imminent withdrawal. Contributions made within 90 days of the HBP withdrawal do not generate a deduction in the year of the HBP withdrawal — they must sit in the RRSP for 90 days before being eligible.</p>

<h2>How Much You Can Withdraw</h2>

<p>The maximum HBP withdrawal is <strong>$60,000 per person</strong> (as of 2024). This is a lifetime limit, not an annual limit. You can make multiple withdrawals across multiple calendar years as long as the total doesn't exceed $60,000 and all withdrawals are for the same qualifying home purchase.</p>

<p>For two first-time buyers purchasing together, the combined maximum is <strong>$120,000</strong>:</p>
<ul>
  <li>Buyer 1 withdraws up to $60,000 from their RRSP</li>
  <li>Buyer 2 withdraws up to $60,000 from their RRSP</li>
  <li>Each person's withdrawal and repayment are tracked separately by CRA</li>
</ul>

<p>You can only withdraw from your own RRSP — not your spouse's, even if your spouse is a joint purchaser. If your RRSP holds less than $60,000, you can only withdraw what's there.</p>

<h2>Making the HBP Withdrawal</h2>

<p>Contact your RRSP issuer (bank or investment firm) and complete <a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1036.html" target="_blank" rel="noopener noreferrer">CRA Form T1036 (Home Buyers' Plan Request to Withdraw Funds from an RRSP)</a>. Your issuer processes the withdrawal and issues the funds. No withholding tax is applied because the withdrawal is under the HBP program — it's tax-free at withdrawal, provided you repay it over time.</p>

<p>Keep the T4RSP slip your issuer sends — you'll need it for your tax return. You'll report the HBP withdrawal on Schedule 7 of your T1 return for the year of withdrawal, which tracks your HBP balance with CRA.</p>

<h2>Repayment Rules</h2>

<p>The HBP withdrawal is not a forgiven amount — it's an interest-free loan from your future self. You must repay the full amount to your RRSP over 15 years.</p>

<ul>
  <li><strong>When repayments start:</strong> 2 years after the calendar year of your first HBP withdrawal. If you withdrew in 2025, your first repayment year is 2027.</li>
  <li><strong>How much per year:</strong> The total withdrawn divided by 15. If you withdrew $60,000, you must repay $4,000/year for 15 years.</li>
  <li><strong>What happens if you don't repay a given year:</strong> The required repayment amount for that year is added to your income and taxed at your marginal rate. There's no interest or penalty beyond the tax consequence.</li>
  <li><strong>How to make repayments:</strong> Contribute to your RRSP and designate the contribution as an HBP repayment on Schedule 7 of your T1. Contributions not designated as repayments count as regular RRSP contributions (providing a deduction) but don't reduce your HBP outstanding balance.</li>
</ul>

<h2>Combining the HBP with the First Home Savings Account (FHSA)</h2>

<p>You can use both the HBP and the FHSA for the same qualifying home purchase. The two programs are designed to work together:</p>

<table>
  <thead>
    <tr><th></th><th>FHSA</th><th>Home Buyers' Plan (HBP)</th></tr>
  </thead>
  <tbody>
    <tr><td>Maximum amount</td><td>$40,000 lifetime contributions</td><td>$60,000 withdrawal</td></tr>
    <tr><td>Tax on withdrawal</td><td>None (fully tax-free)</td><td>None at withdrawal; taxed if not repaid</td></tr>
    <tr><td>Repayment required</td><td>No</td><td>Yes, over 15 years</td></tr>
    <tr><td>Best for</td><td>Tax-advantaged savings you don't repay</td><td>Existing RRSP savings</td></tr>
  </tbody>
</table>

<p>Strategy for first-time buyers with both accounts: withdraw from your FHSA first (no repayment required), then supplement with the HBP withdrawal from your RRSP. The FHSA is strictly better on a per-dollar basis because there's no repayment obligation — use it to its maximum before tapping RRSP funds.</p>

<h2>What Happens if You Don't Buy the Home</h2>

<p>If you make an HBP withdrawal but the home purchase falls through, you have until October 1 of the year after your withdrawal to use the funds for a qualifying purchase. If no qualifying purchase is made by that deadline, the full withdrawn amount must be returned to your RRSP before that date, or it will be included in your income for the withdrawal year. Contact CRA or a tax advisor immediately if your purchase doesn't close after an HBP withdrawal.</p>

<p>Ready to find your first home in the GTA? <a href="/homes-for-sale/toronto">Browse active listings on Condohill</a> and see what your budget can reach with FHSA and HBP funds factored in.</p>

<h2>FAQ</h2>

<h3>How much can I withdraw from my RRSP under the Home Buyers' Plan?</h3>
<p>The maximum HBP withdrawal is $60,000 per person, as of the 2024 federal budget (increased from $35,000). Two first-time buyers purchasing together can each withdraw $60,000, for a combined maximum of $120,000. The funds must have been in the RRSP for at least 90 days before withdrawal.</p>

<h3>When do I have to start repaying the Home Buyers' Plan?</h3>
<p>Repayments must begin 2 years after the calendar year of your first HBP withdrawal. If you first withdrew in 2025, your first repayment year is 2027. You then have 15 years to repay the full amount — $4,000/year on a $60,000 withdrawal. If you miss a year's repayment, that amount is added to your taxable income for that year.</p>

<h3>Can I use the Home Buyers' Plan and FHSA together?</h3>
<p>Yes. Both programs can be used on the same qualifying home purchase. The FHSA (up to $40,000 tax-free, no repayment required) and the HBP (up to $60,000, repay over 15 years) can be combined for a potential $100,000 per person in tax-advantaged funds toward a first home.</p>

<h3>What is the 90-day rule for RRSP withdrawals under the HBP?</h3>
<p>RRSP funds must have been in the account for at least 90 days before the HBP withdrawal date to be eligible. Contributions made within 90 days of the withdrawal are technically withdrawable, but those recent contributions cannot be deducted on your tax return for the withdrawal year. Plan your RRSP contributions at least 90 days before you intend to make an HBP withdrawal.</p>

<h3>Does the Home Buyers' Plan apply to pre-construction condos?</h3>
<p>Yes, provided you have a signed agreement to buy or build a qualifying home before October 1 of the year after your withdrawal. For pre-construction condos, the signed purchase agreement with the builder is the qualifying agreement, even if the building won't be complete for several years. Confirm the HBP eligibility timeline with your tax advisor based on your specific purchase agreement date and anticipated closing date.</p>

<h3>What happens to my HBP balance if I die or become a non-resident?</h3>
<p>If you become a non-resident of Canada, your entire remaining HBP balance becomes income in that year. In the case of death, the remaining HBP balance is generally included in the deceased's final return as income, unless a qualifying surviving spouse or common-law partner assumes the HBP balance. A tax advisor should be consulted in either situation.</p>`,
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
