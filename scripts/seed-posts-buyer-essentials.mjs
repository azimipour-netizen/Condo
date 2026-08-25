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
    title: 'How Much Is Land Transfer Tax in Ontario?',
    slug: 'how-much-is-land-transfer-tax-in-ontario',
    metaDescription: 'Ontario land transfer tax rates and calculations at common GTA price points. See exactly what you\'ll pay on a $700K–$1.2M purchase, plus first-time buyer rebates.',
    summary: 'Ontario land transfer tax is calculated on a sliding scale from 0.5% to 2.5% of the purchase price. This guide shows exact amounts at common GTA price points and explains the rebates available to first-time buyers.',
    body: `<!-- Primary keyword: land transfer tax Ontario | Intent: informational | Word count target: 1600 -->

<p>Land transfer tax in Ontario is charged on every residential property purchase and is typically the largest single closing cost a buyer pays. On a $900,000 home, Ontario land transfer tax works out to $14,475. If you're buying within the City of Toronto, a second municipal land transfer tax of the same amount applies, bringing the total to $28,950. Understanding how land transfer tax is calculated — and what rebates you may qualify for — is one of the most practical steps in planning your purchase budget. For a full picture of every fee due at closing, see our guide on <a href="/blog/what-closing-costs-do-home-buyers-pay">closing costs for Ontario home buyers</a>.</p>

<p>Land transfer tax is paid on closing day and cannot be rolled into your mortgage. It's a hard cost the buyer must bring to closing in cash (via certified cheque or wire), separate from the down payment.</p>

<h2>How Ontario Land Transfer Tax Is Calculated</h2>

<p>Ontario land transfer tax is charged on a sliding scale — each rate applies only to the portion of the purchase price within that bracket, similar to marginal income tax rates. You don't pay the top rate on the entire price.</p>

<table>
  <thead>
    <tr><th>Portion of purchase price</th><th>Tax rate</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to $55,000</td><td>0.5%</td></tr>
    <tr><td>$55,001 – $250,000</td><td>1.0%</td></tr>
    <tr><td>$250,001 – $400,000</td><td>1.5%</td></tr>
    <tr><td>$400,001 – $2,000,000</td><td>2.0%</td></tr>
    <tr><td>Over $2,000,000</td><td>2.5%</td></tr>
  </tbody>
</table>

<p>For a $900,000 purchase, the calculation breaks down as follows:</p>
<ul>
  <li>First $55,000 × 0.5% = $275</li>
  <li>$55,001–$250,000 ($195,000 range) × 1.0% = $1,950</li>
  <li>$250,001–$400,000 ($150,000 range) × 1.5% = $2,250</li>
  <li>$400,001–$900,000 ($500,000 range) × 2.0% = $10,000</li>
  <li><strong>Total Ontario LTT: $14,475</strong></li>
</ul>

<p>The <a href="https://www.ontario.ca/page/land-transfer-tax" target="_blank" rel="noopener noreferrer">Ontario land transfer tax calculator on ontario.ca</a> gives you the exact figure for any purchase price.</p>

<h2>Ontario Land Transfer Tax at Common GTA Price Points</h2>

<table>
  <thead>
    <tr><th>Purchase price</th><th>Ontario LTT</th><th>Toronto MLTT (if buying in Toronto)</th><th>Combined total in Toronto</th></tr>
  </thead>
  <tbody>
    <tr><td>$600,000</td><td>$8,475</td><td>$8,475</td><td>$16,950</td></tr>
    <tr><td>$700,000</td><td>$10,475</td><td>$10,475</td><td>$20,950</td></tr>
    <tr><td>$800,000</td><td>$12,475</td><td>$12,475</td><td>$24,950</td></tr>
    <tr><td>$900,000</td><td>$14,475</td><td>$14,475</td><td>$28,950</td></tr>
    <tr><td>$1,000,000</td><td>$16,475</td><td>$16,475</td><td>$32,950</td></tr>
    <tr><td>$1,200,000</td><td>$20,475</td><td>$20,475</td><td>$40,950</td></tr>
  </tbody>
</table>

<h2>City of Toronto Municipal Land Transfer Tax</h2>

<p>Buyers purchasing within the City of Toronto pay a second land transfer tax — the municipal land transfer tax (MLTT) — at the same sliding-scale rates as the provincial tax. The City of Toronto includes the former municipalities of North York, Scarborough, Etobicoke, York, and East York (all amalgamated in 1998). Buyers in Mississauga, Brampton, Markham, Vaughan, Oakville, and other 905 communities pay only the provincial tax.</p>

<p>This cost difference — typically $10,000–$20,000 depending on price — is one of the concrete financial reasons some buyers choose to search in the 905 region rather than within Toronto's city limits. See our full breakdown in <a href="/blog/what-is-toronto-municipal-land-transfer-tax">what the Toronto municipal land transfer tax is and who pays it</a>.</p>

<h2>First-Time Buyer Land Transfer Tax Rebates</h2>

<p>First-time home buyers in Ontario qualify for two rebates:</p>
<ul>
  <li><strong>Ontario provincial rebate:</strong> Up to $4,000, eliminating provincial LTT entirely on purchases up to roughly $368,000.</li>
  <li><strong>Toronto municipal rebate:</strong> Up to $4,475 on the MLTT, available only to first-time buyers purchasing within the City of Toronto.</li>
</ul>

<p>Combined, first-time Toronto buyers can reduce their land transfer tax bill by up to $8,475. On a $900,000 purchase, that brings the combined LTT from $28,950 down to approximately $20,475. Your lawyer applies both rebates on your behalf at closing — no separate application is needed.</p>

<p>To qualify, you must be a Canadian citizen or permanent resident, at least 18 years old, never have owned a home anywhere in the world, and your spouse cannot have owned a home while in the relationship with you. The home must be your principal residence. For a full list of programs available to first-time buyers, see <a href="/blog/first-time-home-buyer-benefits-ontario">first-time home buyer benefits in Ontario</a>.</p>

<h2>Who Pays Land Transfer Tax in Ontario?</h2>

<p>The buyer pays land transfer tax — not the seller. It is entirely the buyer's cost and is included in the statement of adjustments your lawyer prepares before closing. Land transfer tax is not negotiable and cannot be shared with the seller as part of offer negotiations in the standard Ontario Agreement of Purchase and Sale.</p>

<p>What buyers often miss is that land transfer tax applies to all property types equally — houses, condos, townhouses, and new construction. For pre-construction condos, LTT is calculated on the full purchase price including upgrades and adjustments as stated in the purchase agreement.</p>

<h2>Is Land Transfer Tax Deductible or Refundable?</h2>

<p>For owner-occupied principal residences, Ontario land transfer tax is neither tax-deductible nor refundable, except through the first-time buyer rebate. For rental or investment properties, land transfer tax can be added to the property's adjusted cost base, which reduces taxable capital gain when you eventually sell. Speak with a Canadian accountant about the investment property treatment specific to your situation.</p>

<p>Ready to find a home in the GTA? <a href="/homes-for-sale/toronto">Browse active listings on Condohill</a> and factor land transfer tax into your full budget from the start.</p>

<h2>FAQ</h2>

<h3>How much is land transfer tax on a $900,000 home in Ontario?</h3>
<p>Ontario land transfer tax on a $900,000 purchase is $14,475. If you're buying within the City of Toronto, the municipal land transfer tax adds another $14,475, for a combined total of $28,950. First-time buyers reduce this by up to $8,475 through provincial and Toronto rebates.</p>

<h3>When is land transfer tax paid in Ontario?</h3>
<p>Land transfer tax is paid on the closing date. Your real estate lawyer calculates and remits it to the Ontario government on your behalf as part of the closing process. You cannot pay in installments or defer it — it's due in full on closing day.</p>

<h3>Can land transfer tax be added to my mortgage?</h3>
<p>No. Land transfer tax must be paid from your own funds at closing. It cannot be rolled into your mortgage balance. This is one of the key reasons lenders and mortgage brokers advise buyers to budget for closing costs separately from their down payment.</p>

<h3>Does land transfer tax apply to condos in Ontario?</h3>
<p>Yes. Land transfer tax applies to all property types in Ontario — condos, townhouses, detached and semi-detached houses, and new construction. The calculation is the same for all property types based on the purchase price in the Agreement of Purchase and Sale.</p>

<h3>How do I claim the first-time buyer land transfer tax rebate?</h3>
<p>Your real estate lawyer claims the rebate on your behalf at closing. You don't file a separate application. The rebate reduces the land transfer tax owing at closing — so if your Ontario LTT is $10,475 and you qualify for the full $4,000 rebate, you pay $6,475 on closing day. The Toronto MLTT rebate works the same way.</p>

<h3>Is there land transfer tax outside Toronto in the GTA?</h3>
<p>Yes — Ontario's provincial land transfer tax applies everywhere in Ontario, including Mississauga, Brampton, Markham, Vaughan, and all 905 municipalities. Only the City of Toronto charges a second (municipal) land transfer tax. Buyers in the 905 region pay only the provincial tax.</p>`,
  },
  {
    title: 'What Is the Toronto Municipal Land Transfer Tax?',
    slug: 'what-is-toronto-municipal-land-transfer-tax',
    metaDescription: 'Toronto\'s municipal land transfer tax explained — who pays it, how much it costs, and why it doesn\'t apply outside the City of Toronto. Includes first-time buyer rebate details.',
    summary: 'The Toronto municipal land transfer tax (MLTT) is a second land transfer tax on top of Ontario\'s provincial tax, charged only on purchases within the City of Toronto. This guide explains the rates, who pays it, and how first-time buyers can reduce the bill.',
    body: `<!-- Primary keyword: Toronto municipal land transfer tax | Intent: informational | Word count target: 1500 -->

<p>The Toronto municipal land transfer tax (MLTT) is charged on every property purchase within the City of Toronto, on top of Ontario's provincial land transfer tax. It uses the same rate structure as the provincial tax, effectively doubling land transfer tax costs for Toronto buyers. On a $900,000 Toronto home, buyers pay $14,475 in provincial land transfer tax plus $14,475 in municipal land transfer tax — $28,950 combined. Buyers in Mississauga, Markham, Vaughan, and other GTA municipalities outside Toronto pay only the provincial amount.</p>

<p>Understanding the MLTT — and knowing exactly where it applies — matters for your budget and can influence where you choose to search for a home. This guide covers who pays it, how much it costs, where the geographic boundary falls, and what rebates first-time buyers qualify for. For the complete picture of closing costs in Ontario, see <a href="/blog/what-closing-costs-do-home-buyers-pay">what closing costs home buyers pay</a>.</p>

<h2>Toronto MLTT Rates</h2>

<p>The Toronto MLTT uses the same sliding-scale rate structure as Ontario's provincial land transfer tax:</p>

<table>
  <thead>
    <tr><th>Portion of purchase price</th><th>Tax rate</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to $55,000</td><td>0.5%</td></tr>
    <tr><td>$55,001 – $250,000</td><td>1.0%</td></tr>
    <tr><td>$250,001 – $400,000</td><td>1.5%</td></tr>
    <tr><td>$400,001 – $2,000,000</td><td>2.0%</td></tr>
    <tr><td>Over $2,000,000</td><td>2.5%</td></tr>
  </tbody>
</table>

<p>Because the MLTT mirrors the provincial rates exactly, Toronto buyers pay approximately double the land transfer tax compared to buyers in neighbouring 905 municipalities for the same purchase price.</p>

<h2>What the MLTT Costs at Common Toronto Price Points</h2>

<table>
  <thead>
    <tr><th>Purchase price</th><th>Ontario LTT</th><th>Toronto MLTT</th><th>Total LTT for Toronto buyer</th><th>905-region buyer pays</th></tr>
  </thead>
  <tbody>
    <tr><td>$700,000</td><td>$10,475</td><td>$10,475</td><td>$20,950</td><td>$10,475</td></tr>
    <tr><td>$900,000</td><td>$14,475</td><td>$14,475</td><td>$28,950</td><td>$14,475</td></tr>
    <tr><td>$1,100,000</td><td>$18,475</td><td>$18,475</td><td>$36,950</td><td>$18,475</td></tr>
    <tr><td>$1,400,000</td><td>$24,475</td><td>$24,475</td><td>$48,950</td><td>$24,475</td></tr>
  </tbody>
</table>

<p>The MLTT savings from buying just outside Toronto's city limits — in Mississauga vs. Etobicoke, for example — can amount to $10,000–$25,000 depending on the purchase price. For buyers with a tight closing cost budget, this difference is worth factoring into your search area decision.</p>

<h2>Where the Toronto MLTT Applies</h2>

<p>The Toronto MLTT applies within the current City of Toronto's municipal limits. Since the 1998 amalgamation, the City of Toronto includes six former municipalities:</p>
<ul>
  <li>The old City of Toronto (downtown, midtown, east end)</li>
  <li>North York</li>
  <li>Scarborough</li>
  <li>Etobicoke</li>
  <li>York</li>
  <li>East York</li>
</ul>

<p>All properties within these boundaries are subject to the MLTT. A common misconception is that Etobicoke or Scarborough buyers avoid the tax because they feel more suburban — they do not. The boundary is the City of Toronto's municipal limit, not the old pre-amalgamation city boundary.</p>

<p>Properties in Mississauga (even bordering Etobicoke), Brampton, Markham, Vaughan, Richmond Hill, Oakville, Pickering, and all other GTA municipalities outside Toronto's city limits pay only the provincial land transfer tax.</p>

<h2>First-Time Buyer Toronto MLTT Rebate</h2>

<p>First-time home buyers purchasing within the City of Toronto receive a rebate of up to <strong>$4,475</strong> on the municipal land transfer tax. This rebate is in addition to the provincial land transfer tax rebate of up to $4,000. Combined, first-time Toronto buyers can save up to $8,475.</p>

<p>On a $700,000 Toronto purchase, the combined LTT without rebates is $20,950. With both first-time buyer rebates ($4,000 provincial + $4,475 Toronto), the total drops to approximately $12,475 — a significant reduction. See the full list of programs available in our guide to <a href="/blog/first-time-home-buyer-benefits-ontario">first-time home buyer benefits in Ontario</a>.</p>

<p>To qualify for the Toronto MLTT rebate:</p>
<ul>
  <li>You must be a Canadian citizen or permanent resident, at least 18 years old</li>
  <li>You must never have owned a home anywhere in the world</li>
  <li>Your spouse cannot have owned a home while in the relationship with you</li>
  <li>The property must become your principal residence</li>
</ul>

<p>Your real estate lawyer claims the rebate at closing. No separate application is required.</p>

<h2>When Is the Toronto MLTT Paid?</h2>

<p>The MLTT is paid on closing day, at the same time as the provincial land transfer tax. Your lawyer remits both taxes to the appropriate government authorities on your behalf. Both appear itemized on the statement of adjustments you receive before closing.</p>

<p>What buyers often miss is that the MLTT cannot be financed or deferred. It must come from your own funds, separate from your down payment. When <a href="/blog/how-much-house-can-i-afford">calculating what you can afford</a>, always include both land transfer taxes in your closing cost budget if you're searching in Toronto.</p>

<h2>Does the Toronto MLTT Apply to Condos and New Builds?</h2>

<p>Yes. The MLTT applies to all property types within the City of Toronto, including resale condos, resale houses, new construction houses, and pre-construction condos. For pre-construction condos, the MLTT is calculated on the full closing price — which includes the purchase price plus any upgrade selections and builder adjustments. This can result in a higher-than-expected MLTT bill years after signing the original pre-construction agreement, since prices may have appreciated and upgrades add to the taxable amount.</p>

<p>If you're searching for a condo or house in Toronto, <a href="/homes-for-sale/toronto">browse active listings on Condohill</a> and include the MLTT in your total purchase budget alongside your down payment.</p>

<h2>FAQ</h2>

<h3>Does Etobicoke pay the Toronto municipal land transfer tax?</h3>
<p>Yes. Etobicoke became part of the City of Toronto in the 1998 amalgamation, so all Etobicoke properties are subject to the Toronto MLTT in addition to Ontario's provincial land transfer tax. The same applies to North York, Scarborough, York, and East York — all of which are now part of the City of Toronto.</p>

<h3>Does Mississauga pay the Toronto municipal land transfer tax?</h3>
<p>No. Mississauga is a separate municipality in Peel Region and is not part of the City of Toronto. Buyers in Mississauga pay only Ontario's provincial land transfer tax. The same applies to Brampton, Vaughan, Markham, Oakville, and all other 905-region municipalities.</p>

<h3>How much is the Toronto MLTT rebate for first-time buyers?</h3>
<p>First-time buyers in Toronto receive a rebate of up to $4,475 on the municipal land transfer tax. This is in addition to Ontario's provincial rebate of up to $4,000. Combined, eligible first-time Toronto buyers can reduce their land transfer tax bill by up to $8,475. Your lawyer applies the rebate at closing automatically.</p>

<h3>Is the Toronto MLTT tax-deductible?</h3>
<p>No, not for owner-occupied principal residences. The MLTT is a one-time closing cost with no deductibility for personal homebuyers. For rental or investment properties, land transfer taxes (both provincial and municipal) can be added to the property's adjusted cost base to reduce capital gains on eventual sale.</p>

<h3>Can the Toronto MLTT be added to my mortgage?</h3>
<p>No. The MLTT, like the provincial land transfer tax, must be paid from your own funds on closing day. Neither tax can be added to your mortgage balance. Budget for both taxes as separate closing costs when calculating your total cash requirement for closing.</p>

<h3>Who authorized the Toronto municipal land transfer tax?</h3>
<p>Toronto City Council authorized the MLTT under the City of Toronto Act, 2006, which grants Toronto unique taxing powers not available to other Ontario municipalities. Toronto is the only municipality in Ontario that charges a municipal land transfer tax — every other GTA municipality, including Mississauga and Markham, has the legislative authority to implement one but has chosen not to.</p>`,
  },
  {
    title: 'Who Pays Real Estate Commission When Buying a Home?',
    slug: 'who-pays-real-estate-commission-when-buying',
    metaDescription: 'In Ontario, the seller traditionally pays real estate commission — but new rules around Buyer Representation Agreements changed how this works. Here\'s what buyers need to know.',
    summary: 'The seller traditionally pays total real estate commission in Ontario, split between the listing agent and the buyer\'s agent. Recent changes to Buyer Representation Agreements mean buyers now have more visibility — and potential responsibility — for their agent\'s fee.',
    body: `<!-- Primary keyword: who pays real estate commission when buying a home | Intent: informational | Word count target: 1600 -->

<p>When buying a home in Ontario, buyers often assume they'll face a direct fee from their agent — but real estate commission works differently here. Traditionally, the seller pays the total commission out of the sale proceeds, and that amount is split between the listing agent and the buyer's agent. In most GTA transactions, buyers pay nothing directly to their agent at closing. Understanding how commission is structured — and what changed with Ontario's Buyer Representation Agreement rules — helps you know what to expect before you sign anything.</p>

<p>This matters especially for first-time buyers who are just beginning to understand the costs of <a href="/blog/steps-to-buying-a-home-in-the-gta">buying a home in the GTA</a>. Commission isn't listed in your closing cost statement the way land transfer tax is, but it affects the deal structure in ways buyers should understand.</p>

<h2>How Real Estate Commission Works in Ontario</h2>

<p>When a seller lists a property, they sign a listing agreement with their agent that specifies the total commission rate. That total commission is typically <strong>3.5–5% of the sale price</strong>, and it covers both the listing agent's fee and the <strong>cooperating commission</strong> offered to the buyer's agent.</p>

<p>For example, on a $900,000 sale with a 4% total commission:</p>
<ul>
  <li>Listing agent: 2% = $18,000</li>
  <li>Buyer's agent (cooperating commission): 2% = $18,000</li>
  <li>Total from seller: $36,000 + HST</li>
</ul>

<p>This means the buyer's agent is compensated by the seller — not the buyer — in most standard Ontario transactions. From the buyer's perspective, representation has historically been free.</p>

<h2>What Changed: Buyer Representation Agreements</h2>

<p>As of January 1, 2024, Ontario real estate registrants are required to have a signed <strong>Buyer Representation Agreement (BRA)</strong> in place before showing a buyer any properties. The BRA is a contract between you and your buyer's agent that specifies:</p>
<ul>
  <li>The properties the agreement covers (geographic area and property type)</li>
  <li>The duration of the agreement</li>
  <li>The buyer's agent's agreed compensation rate</li>
</ul>

<p>The BRA's compensation clause is now explicit where it was previously informal. If a seller offers a cooperating commission that's lower than the rate in your BRA, you may be required to make up the difference out of pocket. What buyers often miss is that this gap has always existed in theory — the BRA rules just made it more visible and legally binding.</p>

<p>In practice, most sellers continue to offer cooperating commissions that align with standard market rates, so most buyers don't pay their agent anything at closing. But it's worth asking your agent to explain the BRA's compensation terms clearly before signing.</p>

<h2>Typical Commission Rates in the GTA</h2>

<p>Commission rates are not regulated in Ontario and are fully negotiable. That said, common ranges in the GTA are:</p>

<table>
  <thead>
    <tr><th>Component</th><th>Typical rate</th><th>On a $900,000 sale</th></tr>
  </thead>
  <tbody>
    <tr><td>Listing agent commission</td><td>1.5–2.5%</td><td>$13,500–$22,500</td></tr>
    <tr><td>Cooperating (buyer's agent) commission</td><td>1.0–2.5%</td><td>$9,000–$22,500</td></tr>
    <tr><td>Total commission</td><td>3.0–5.0%</td><td>$27,000–$45,000</td></tr>
  </tbody>
</table>

<p>HST (13%) is charged on top of commission. On a $900,000 sale with 4% total commission ($36,000), the seller pays $40,680 including HST. Commission is paid from the sale proceeds at closing — the seller's lawyer deducts it before remitting the net to the seller.</p>

<h2>Does the Buyer Ever Pay Commission Directly?</h2>

<p>In most standard GTA resale transactions, no — the seller covers it. However, there are situations where a buyer might pay their agent directly:</p>
<ul>
  <li>A seller offering <strong>zero cooperating commission</strong> (increasingly rare but possible)</li>
  <li>A buyer's BRA compensation rate higher than what the seller offers</li>
  <li>A private sale where no commission structure exists</li>
  <li>A buyer who chooses to pay their agent a flat fee or retainer for specific services</li>
</ul>

<p>Before signing a BRA, ask: "If a seller offers less cooperating commission than your BRA rate, what happens?" A good agent will explain this clearly so you're not surprised.</p>

<h2>Commission on New Construction</h2>

<p>For new construction and pre-construction condos, commission structures vary by builder. Many builders pay buyer's agents directly through their own commission programs; some offer lower or no cooperating commissions on certain projects. If you're buying a new build with a buyer's agent, confirm before signing the purchase agreement that your agent's compensation is covered by the builder — or clarify who is responsible for it.</p>

<h2>Going Unrepresented: What Buyers Give Up</h2>

<p>Some buyers consider going unrepresented to force the seller to "keep" the buyer's agent commission as a price reduction. In Ontario, this rarely works the way buyers expect. The seller's agent typically keeps the full commission unless they've explicitly agreed to a reduction. And an unrepresented buyer loses access to market knowledge, negotiating experience, and the legal protections that come from proper representation in the Agreement of Purchase and Sale.</p>

<p>For more on what a buyer's agent actually does and whether you need one, see <a href="/blog/do-buyers-need-a-real-estate-agent">do buyers need a real estate agent</a> and <a href="/blog/how-does-a-buyers-agent-get-paid">how a buyer's agent gets paid</a>.</p>

<p>Looking for your next home? <a href="/homes-for-sale/toronto">Browse GTA listings on Condohill</a> and connect with an agent who can walk you through the process from offer to keys.</p>

<h2>FAQ</h2>

<h3>Does the buyer pay real estate commission in Ontario?</h3>
<p>In most Ontario transactions, no — the seller pays total commission from the sale proceeds, and that amount is split between the listing agent and the buyer's agent. Since January 2024, buyers must sign a Buyer Representation Agreement (BRA) specifying their agent's fee. If the seller's cooperating commission is less than the BRA rate, the buyer may need to make up the difference, but this is uncommon in most standard GTA resale deals.</p>

<h3>What is a typical buyer's agent commission in the GTA?</h3>
<p>Cooperating commissions offered to buyer's agents in the GTA typically range from 1.0% to 2.5% of the sale price. On a $900,000 home, this is $9,000–$22,500. The amount is set by the seller and their listing agent, not by the buyer. All commission rates in Ontario are negotiable.</p>

<h3>What is a Buyer Representation Agreement (BRA) in Ontario?</h3>
<p>A BRA is a legal contract between a buyer and a real estate agent that confirms the agent will represent the buyer's interests. Since January 1, 2024, Ontario agents must have a signed BRA before showing any properties. The BRA specifies the agreement's duration, coverage area, and the buyer's agent's compensation terms. Read the compensation clause carefully before signing.</p>

<h3>Can I negotiate the commission with my buyer's agent?</h3>
<p>Yes, commission rates in Ontario are fully negotiable. The BRA's compensation clause reflects what you and your agent have agreed to. That said, keep in mind that your agent's compensation ultimately comes from the cooperating commission the seller offers — you benefit from your agent's local market knowledge and negotiating experience regardless of where the money comes from.</p>

<h3>Does the seller pay HST on commission?</h3>
<p>Yes. Real estate commissions in Ontario are subject to HST at 13%. The seller pays both the commission rate and the HST on top. On a $36,000 total commission, HST adds $4,680, so the seller's total commission cost is $40,680. As a buyer, this doesn't directly affect you — it comes from the seller's proceeds.</p>`,
  },
  {
    title: 'Do Buyers Need a Real Estate Agent in Ontario?',
    slug: 'do-buyers-need-a-real-estate-agent',
    metaDescription: 'Buyers in Ontario don\'t legally need a real estate agent, but going unrepresented carries real risks. Here\'s what you give up — and when it might make sense.',
    summary: 'Buyers in Ontario are not legally required to have a real estate agent, but going unrepresented in the GTA means navigating legally binding contracts, competitive offers, and complex negotiations without professional help. Here\'s what you give up and what to consider.',
    body: `<!-- Primary keyword: do buyers need a real estate agent | Intent: informational | Word count target: 1600 -->

<p>Buyers in Ontario are not legally required to have a real estate agent. You can purchase a home on your own — search listings, tour properties, make an offer, and close the deal without a buyer's agent. Whether that's a good idea is a different question. In the GTA's market, where offers are legally binding, conditions are complex, and a missed deadline can cost you your deposit, most experienced buyers would answer: no, it's not worth going alone. This guide explains what a buyer's agent actually does, what you give up without one, and when unrepresented purchases make sense.</p>

<p>Since January 2024, Ontario agents must have a signed Buyer Representation Agreement (BRA) before showing a buyer any properties — which means choosing representation is an explicit commitment, not just a casual arrangement. Understanding the value you're getting before signing that agreement is a reasonable thing to want. See also <a href="/blog/who-pays-real-estate-commission-when-buying">who pays real estate commission when buying</a> and <a href="/blog/how-does-a-buyers-agent-get-paid">how a buyer's agent gets paid</a>.</p>

<h2>What a Buyer's Agent Does</h2>

<p>A buyer's agent's job goes well beyond showing houses. Their core value in the GTA market:</p>

<ul>
  <li><strong>Market knowledge:</strong> Access to recent comparable sales to advise on fair offer prices — not listed prices, which can be set intentionally low to trigger bidding wars.</li>
  <li><strong>Early access:</strong> Agents get notice of incoming listings before they appear on Realtor.ca, sometimes 24–48 hours before the public. In markets where desirable properties sell in days, this matters.</li>
  <li><strong>Offer preparation:</strong> Drafting the Agreement of Purchase and Sale (OREA form), selecting the right conditions, setting closing dates, and structuring deposit and irrevocability clauses correctly.</li>
  <li><strong>Negotiation:</strong> Advising on offer strategy — whether to come in at asking, above, or with conditions, and what competing offers (if any) might look like.</li>
  <li><strong>Due diligence coordination:</strong> Arranging the home inspection, flagging status certificate issues on condos, and tracking condition deadlines.</li>
  <li><strong>Transaction management:</strong> Coordinating with lawyers, mortgage brokers, and the listing agent through to closing.</li>
</ul>

<h2>What You Give Up Going Unrepresented</h2>

<p>An unrepresented buyer dealing with a listing agent faces a structural disadvantage: the listing agent's fiduciary duty is to the seller, not to you. They can share information, show the property, and facilitate a transaction, but they cannot advise you on what to offer, tell you what competing offers look like, or advocate for terms that protect your interests. In Ontario, a listing agent who also deals with an unrepresented buyer acts as a "designated representative" of the seller only — there is no neutral position.</p>

<p>Practical risks of going unrepresented:</p>
<ul>
  <li>Overpaying — without comparable sales data, buyers often anchor on list price rather than market value</li>
  <li>Missing condition clauses that protect your deposit (financing condition, inspection condition)</li>
  <li>Setting incorrect closing dates or deposit amounts that create legal complications</li>
  <li>Missing deadlines that default the deal</li>
  <li>Not knowing to ask for a status certificate on a condo or to review it with a lawyer</li>
</ul>

<h2>Does Going Unrepresented Save You Money?</h2>

<p>The common belief is that going unrepresented gives the seller flexibility to reduce the price by the buyer's agent commission amount. This rarely works in practice. The seller has already set their list price with their expected net in mind. The listing brokerage typically retains the full commission unless the seller explicitly agreed to a reduction for unrepresented buyers — which most sellers don't do, because it creates liability and complicates the transaction.</p>

<p>In a competitive multiple-offer situation — common in Toronto, Mississauga, and other GTA markets — an unrepresented buyer's offer is often viewed with skepticism. Listing agents sometimes advise their sellers to be cautious about accepting offers from unrepresented buyers because they're more likely to fall through due to inexperience.</p>

<h2>When Buyers Go Unrepresented</h2>

<p>There are situations where experienced buyers successfully navigate unrepresented purchases:</p>
<ul>
  <li>A repeat buyer who knows the neighbourhood, the market, and the contract process intimately</li>
  <li>A purchase from a family member or known party (private sale, no listing agent involved)</li>
  <li>A buyer who is themselves a licensed real estate professional</li>
</ul>

<p>For first-time buyers, buyers new to a GTA neighbourhood, or anyone purchasing in a competitive market, the risks of going unrepresented almost always outweigh any potential savings. When the seller is paying the buyer's agent commission anyway (which is the standard in Ontario), there is no direct cost to having representation.</p>

<h2>How to Choose a Buyer's Agent</h2>

<p>Interview two or three agents before signing a BRA. What to ask:</p>
<ul>
  <li>How many buyers have you represented in my target neighbourhood in the last 12 months?</li>
  <li>Can I speak with a recent buyer you represented?</li>
  <li>How do you advise on offer price — what comparable sales do you use?</li>
  <li>What does your BRA's compensation clause say, and what happens if a seller offers less?</li>
</ul>

<p>An agent who primarily lists properties in a different area is less valuable than one who deeply knows your target market. The GTA is large enough that neighbourhood-level knowledge genuinely matters — someone who knows Leslieville's resale condo market isn't necessarily the right agent for a detached house in Leaside.</p>

<p>Start your search on Condohill — <a href="/homes-for-sale/toronto">browse active GTA listings</a> and get a feel for the market before your first showing.</p>

<h2>FAQ</h2>

<h3>Is it legal to buy a house without a real estate agent in Ontario?</h3>
<p>Yes. Buyers in Ontario are not required to use a real estate agent. You can make an offer, negotiate, and close a purchase entirely on your own. However, the Agreement of Purchase and Sale is a legally binding contract, and the risks of errors or missed protections are significant for buyers unfamiliar with the process.</p>

<h3>Can I deal directly with the listing agent when buying?</h3>
<p>Yes. A listing agent can facilitate a transaction with an unrepresented buyer, but their fiduciary duty is to the seller. They cannot advise you on offer strategy, tell you what competing offers look like, or advocate for your interests. You are legally a customer, not a client, in that transaction.</p>

<h3>Does having a buyer's agent cost me anything?</h3>
<p>In most Ontario transactions, no. The seller pays total commission, including the buyer's agent's cooperating commission, from the sale proceeds. Since January 2024, buyers must sign a Buyer Representation Agreement specifying their agent's compensation. If the seller's cooperating commission matches the BRA rate — which it typically does in standard GTA deals — you pay nothing directly to your agent.</p>

<h3>What is a Buyer Representation Agreement and do I have to sign one?</h3>
<p>A BRA is a contract between you and your buyer's agent. Since January 1, 2024, Ontario agents must have a signed BRA before they can show you properties. The BRA commits both parties: the agent works exclusively for you within the agreed terms, and you agree to the agent's compensation structure. You can negotiate the BRA's terms, including its duration and geographic scope, before signing.</p>

<h3>What happens if I find the property myself — do I still need an agent?</h3>
<p>No. If you've found a listing independently (through Realtor.ca, condohill.ca, or any other source), you can still engage a buyer's agent to represent you on that transaction. The agent doesn't need to have been the one to find the property. Their value comes from offer strategy, contract preparation, and transaction management — not just finding listings.</p>`,
  },
  {
    title: 'How Does a Buyer\'s Agent Get Paid in Ontario?',
    slug: 'how-does-a-buyers-agent-get-paid',
    metaDescription: 'A buyer\'s agent in Ontario is typically paid by the seller through a cooperating commission. Here\'s how it works, what the BRA means for you, and when buyers pay directly.',
    summary: 'In Ontario, a buyer\'s agent is typically compensated through a cooperating commission paid by the seller. Since 2024, Buyer Representation Agreements make the compensation terms explicit. This guide explains how the money flows and what to watch for.',
    body: `<!-- Primary keyword: how does a buyer's agent get paid | Intent: informational | Word count target: 1500 -->

<p>A buyer's agent in Ontario is typically paid through a cooperating commission — an amount the seller sets aside when listing their property, specifically to compensate the buyer's agent who brings a successful offer. In most GTA transactions, the buyer pays nothing directly to their agent; the commission comes from the seller's sale proceeds at closing. Since January 2024, how a buyer's agent gets paid is formalized through a Buyer Representation Agreement (BRA) signed before any properties are shown. Understanding this structure means no surprises at closing.</p>

<p>For context on who pays what in a real estate transaction, read <a href="/blog/who-pays-real-estate-commission-when-buying">who pays real estate commission when buying a home</a>. For context on what you get in return, see <a href="/blog/do-buyers-need-a-real-estate-agent">do buyers need a real estate agent</a>.</p>

<h2>How the Commission Flow Works</h2>

<p>When a seller lists their property, they sign a listing agreement with their agent. That agreement specifies the total commission — typically 3.5–5% of the sale price — and within it, the amount the seller is offering as cooperating commission to any buyer's agent who brings a successful offer.</p>

<p>At closing, the buyer's purchase funds flow to the seller's lawyer, who deducts the total commission and remits it to both brokerages. The buyer's agent's portion — the cooperating commission — goes from the seller's proceeds through the listing brokerage to the buyer's brokerage, and then to the buyer's agent. The buyer never sees this money change hands; it happens as part of the closing disbursements.</p>

<table>
  <thead>
    <tr><th>Party</th><th>Pays or receives</th><th>Amount (example: $900K, 4% total commission)</th></tr>
  </thead>
  <tbody>
    <tr><td>Seller</td><td>Pays total commission</td><td>$36,000 + HST from sale proceeds</td></tr>
    <tr><td>Listing agent's brokerage</td><td>Receives listing side</td><td>~$18,000 + HST</td></tr>
    <tr><td>Buyer's agent's brokerage</td><td>Receives cooperating side</td><td>~$18,000 + HST</td></tr>
    <tr><td>Buyer</td><td>Pays nothing directly (in standard deal)</td><td>$0</td></tr>
  </tbody>
</table>

<h2>What the Buyer Representation Agreement Means for Payment</h2>

<p>Since January 1, 2024, Ontario real estate agents must have a signed BRA before showing a buyer any properties. The BRA includes a compensation clause stating what rate the buyer's agent expects. If the cooperating commission offered by the seller equals or exceeds that rate, the buyer pays nothing. If the seller offers less, the buyer may be contractually obligated to cover the gap.</p>

<p>Example: Your BRA specifies a 2.5% buyer's agent fee. You submit an offer on a home where the seller is offering a 1.5% cooperating commission. In that scenario, you'd owe your agent the 1.0% difference — $9,000 on a $900,000 purchase — at closing.</p>

<p>What buyers often miss is that this gap scenario is relatively uncommon in standard GTA resale transactions, where sellers typically offer cooperating commissions aligned with market norms. But it's worth clarifying with your agent before signing the BRA: ask what cooperating commission rate they expect, and what happens if a seller offers less.</p>

<h2>Can the BRA Compensation Be Negotiated?</h2>

<p>Yes. The compensation terms in a BRA are negotiable. What your agent agrees to accept, and what happens if the seller's cooperating commission falls short, is a matter between you and your agent before the agreement is signed. In practice, many agents will agree that they will not seek additional compensation from the buyer beyond what the seller offers — but this needs to be stated clearly in the BRA, not assumed.</p>

<h2>Buyer's Agent Compensation on New Construction</h2>

<p>New construction and pre-construction condo purchases have different commission structures. Builders typically pay buyer's agents directly through their own programs, separate from the OREA Agreement of Purchase and Sale. Some builders offer full cooperating commissions; others offer reduced amounts or nothing at all on certain developments.</p>

<p>If you're purchasing a pre-construction condo with a buyer's agent, confirm before signing the builder's purchase agreement whether the builder is paying your agent's commission and what amount. If the builder pays less than the BRA rate, you may owe the difference — or your agent and you may agree to proceed at whatever the builder offers.</p>

<h2>Flat-Fee and Alternative Compensation Arrangements</h2>

<p>Some buyers and agents agree to alternative compensation structures — a flat fee for specific services, a retainer, or an hourly rate. These arrangements are entirely legal in Ontario and may suit buyers who want limited representation (e.g., just offer preparation, not full search assistance). Any alternative arrangement should be clearly documented in the BRA's compensation clause.</p>

<p>Flat-fee buyer agents are less common in the GTA than in some other markets. The traditional cooperating commission model remains the dominant structure, and for most buyers, the standard arrangement — where the seller covers the buyer's agent fee — makes representation effectively free.</p>

<p>Ready to find your next home? <a href="/homes-for-sale/toronto">Browse GTA listings on Condohill</a> and connect with a buyer's agent who knows your target market.</p>

<h2>FAQ</h2>

<h3>Does the buyer pay the buyer's agent commission at closing?</h3>
<p>In most Ontario transactions, no. The seller pays total commission from the sale proceeds, including the cooperating commission for the buyer's agent. Since the BRA requirement came into effect in January 2024, if the seller's cooperating commission is lower than the BRA rate, the buyer may need to pay the difference. Ask your agent about this before signing the BRA.</p>

<h3>What happens if the seller offers no cooperating commission?</h3>
<p>If a seller offers zero cooperating commission and your BRA specifies a buyer's agent fee, you would be responsible for paying your agent directly at closing. This is relatively rare in standard resale transactions but can occur, particularly in private sales or with some new construction builders. Always check what cooperating commission a seller is offering before making an offer.</p>

<h3>How much does a buyer's agent earn on a $900,000 GTA purchase?</h3>
<p>A buyer's agent's cooperating commission on a $900,000 GTA purchase typically ranges from $9,000 to $22,500, depending on the commission rate offered (1.0–2.5%). After the brokerage split and HST, the agent's take-home is typically 60–80% of that amount, less brokerage fees. Actual agent income varies significantly by brokerage structure.</p>

<h3>Can I ask my buyer's agent to rebate part of their commission to me?</h3>
<p>Commission rebates from agents to buyers are permitted in Ontario and are legal. Some agents and discount brokerages offer to rebate a portion of their cooperating commission to buyers as an incentive. These arrangements should be disclosed in the BRA and to the seller's agent. Not all agents offer rebates, and lower-cost representation sometimes comes with fewer services.</p>`,
  },
  {
    title: 'What Documents Do I Need to Buy a House in Ontario?',
    slug: 'what-documents-do-i-need-to-buy-a-house',
    metaDescription: 'Complete list of documents needed to buy a house in Ontario — for mortgage pre-approval, the offer, and closing day. Know what to prepare before you start.',
    summary: 'Buying a home in Ontario requires different documents at different stages: income and ID documents for mortgage pre-approval, signed agreements during the offer stage, and certified funds on closing day. This guide covers every document you\'ll need.',
    body: `<!-- Primary keyword: documents needed to buy a house in Ontario | Intent: informational | Word count target: 1700 -->

<p>Buying a house in Ontario involves paperwork at multiple stages — mortgage pre-approval, the offer, and closing day each require different documents. Missing a single required document at the wrong moment can delay your pre-approval, slow down the conditional period, or create problems at closing. Knowing what to prepare ahead of time, and gathering these documents before you need them, makes the process significantly smoother. This guide covers every document required to buy a house in Ontario, organized by stage.</p>

<p>Getting your documents ready is one of the first practical steps in <a href="/blog/steps-to-buying-a-home-in-the-gta">buying a home in the GTA</a>. If you haven't started the pre-approval process yet, see <a href="/blog/how-to-get-mortgage-pre-approval">how to get mortgage pre-approval in Canada</a>.</p>

<h2>Documents for Mortgage Pre-Approval</h2>

<p>A mortgage pre-approval requires your lender or mortgage broker to verify your identity, income, employment, assets, and existing debts. These are the documents you'll need to submit:</p>

<h3>Identity</h3>
<ul>
  <li>Two pieces of government-issued photo ID (passport, driver's licence, or permanent resident card)</li>
  <li>Social Insurance Number (SIN) — required for the credit bureau pull</li>
</ul>

<h3>Employment and Income (Salaried Employees)</h3>
<ul>
  <li>Most recent T4 slip(s) — typically the last 2 years</li>
  <li>Most recent 2 pay stubs</li>
  <li>Letter of employment on company letterhead confirming your position, salary, and employment start date</li>
  <li>Last 2 years' T1 general tax returns (required by some lenders, especially for income verification when overtime or bonuses are part of your qualifying income)</li>
  <li>Last 2 years' Notices of Assessment (NOA) from CRA — confirming no outstanding tax owing</li>
</ul>

<h3>Employment and Income (Self-Employed)</h3>
<ul>
  <li>Last 2 years' T1 general tax returns with all schedules</li>
  <li>Last 2 years' Notices of Assessment (NOA)</li>
  <li>Last 2 years' business financial statements (T2125 schedule or corporate financials if incorporated)</li>
  <li>Business registration documents (Certificate of Incorporation or Master Business Licence)</li>
  <li>6 months of business bank statements (some lenders require this)</li>
</ul>

<p>Self-employed buyers face additional documentation requirements because lenders need to establish two years of stable income history. See <a href="/blog/can-i-buy-a-home-while-self-employed">buying a home while self-employed</a> for a full breakdown of what to expect.</p>

<h3>Down Payment and Assets</h3>
<ul>
  <li>90 days of bank statements for all accounts where your down payment is held</li>
  <li>RRSP, TFSA, and investment account statements if funds will come from those accounts</li>
  <li>Gift letter (if part of the down payment is a gift from a family member) — the letter must confirm the funds are a true gift with no repayment required</li>
  <li>RRSP Home Buyers' Plan withdrawal confirmation (if using the HBP)</li>
  <li>First Home Savings Account (FHSA) statements (if using FHSA funds)</li>
  <li>Sale proceeds confirmation if down payment comes from selling a previous home</li>
</ul>

<h3>Debts and Liabilities</h3>
<ul>
  <li>Most recent statements for all credit cards, car loans, student loans, lines of credit, and any other debts</li>
  <li>Lease agreement (if you have monthly rent obligations that will affect your TDS ratio)</li>
</ul>

<p>Lenders also pull your credit bureau report directly — you don't need to provide your credit score, but you should review your own credit report in advance to check for errors. <a href="https://www.equifax.com/personal/products/credit/report-and-score/" target="_blank" rel="noopener noreferrer">Equifax Canada</a> and <a href="https://www.transunion.ca/product/personal-credit-report" target="_blank" rel="noopener noreferrer">TransUnion Canada</a> each offer free annual credit reports.</p>

<h2>Documents at the Offer Stage</h2>

<p>Once you have an accepted offer, your agent will have handled the Agreement of Purchase and Sale (APS). During the conditional period, additional documents come into play:</p>

<ul>
  <li><strong>Accepted APS:</strong> Your lawyer and lender both need a copy of the signed agreement to proceed with title work and formal mortgage approval</li>
  <li><strong>Home inspection report:</strong> Provided by your inspector — your lawyer and lender may want to review it if there are significant findings</li>
  <li><strong>Status certificate:</strong> For condos, this is a package of documents about the condo corporation — your lawyer must review it during the status certificate condition period</li>
  <li><strong>Property disclosure statement:</strong> If the seller provided one (not legally required in Ontario but common in some transactions)</li>
  <li><strong>Survey:</strong> If the seller provides one and the property is freehold — your lawyer will review it, though title insurance typically compensates for survey issues</li>
</ul>

<h2>Documents for Closing Day</h2>

<p>By closing day, most of the heavy documentation work is done. What you need to bring or have ready:</p>

<ul>
  <li><strong>Two pieces of photo ID:</strong> Your lawyer will verify your identity again at the signing appointment</li>
  <li><strong>Certified cheque or bank draft:</strong> For the balance owing at closing (your lawyer will confirm the exact amount from the statement of adjustments, typically a few days before closing)</li>
  <li><strong>Wire transfer confirmation:</strong> If you're transferring funds electronically — confirm the amount and recipient account with your lawyer well in advance</li>
  <li><strong>Home insurance certificate:</strong> Proof that your home insurance policy is active on the closing date — your lender requires this before advancing mortgage funds</li>
  <li><strong>Void cheque or banking information:</strong> For your lender to set up the mortgage payment pre-authorization</li>
</ul>

<p>Your lawyer handles most of the closing documentation — the transfer of title, mortgage registration, and land transfer tax remittance — on your behalf. Your role on closing day is primarily to sign what your lawyer puts in front of you and provide the funds.</p>

<h2>Documents to Request From the Seller</h2>

<p>Through your agent and lawyer, you should request or confirm:</p>
<ul>
  <li>Utility bills (past 12 months) — to verify actual carrying costs and flag unusual consumption</li>
  <li>Property tax bills — to confirm annual tax amount and verify the property tax adjustment at closing</li>
  <li>Warranty documentation — for appliances, roof, HVAC, or other systems with existing warranties</li>
  <li>Renovation permits — to verify that any completed work was properly permitted</li>
  <li>Rental equipment agreements — for hot water heater, HVAC, or security system rentals that transfer to the new owner</li>
</ul>

<p>Rental equipment agreements are something buyers frequently overlook. A rented hot water heater carries a monthly cost of $40–$80/month and a buyout cost of $800–$2,000 — worth knowing before closing. Your <a href="/blog/what-to-inspect-before-buying-a-home">home inspection report</a> should flag any rental equipment on the property.</p>

<p><a href="/homes-for-sale/toronto">Browse homes for sale on Condohill</a> while you're gathering your documents — knowing your budget before you start searching makes the offer process faster when you find the right property.</p>

<h2>FAQ</h2>

<h3>What income documents do I need for a mortgage in Canada?</h3>
<p>Salaried employees need T4 slips from the last 2 years, 2 recent pay stubs, a letter of employment, and Notices of Assessment. Self-employed buyers need 2 years of T1 generals, NOAs, and business financial statements. All buyers need 90 days of bank statements showing their down payment funds.</p>

<h3>Do I need a lawyer to buy a house in Ontario?</h3>
<p>Yes. Every Ontario home purchase requires a real estate lawyer. Your lawyer conducts the title search, prepares closing documents, receives mortgage funds from your lender, remits land transfer tax, and registers the transfer of ownership. You cannot close a property purchase in Ontario without a lawyer.</p>

<h3>What is a gift letter for a mortgage down payment?</h3>
<p>A gift letter is a signed document from the family member who is gifting you money for your down payment. It must confirm the donor's name and relationship to you, the amount being gifted, the date, and a statement that the money is a true gift with no repayment required. Most lenders have their own gift letter template. Gifted funds from non-family members are treated differently and may not be accepted by all lenders.</p>

<h3>Do I need my Notice of Assessment to buy a home?</h3>
<p>Yes. Lenders require Notices of Assessment from the last 1–2 years to verify your reported income matches what CRA has on file, and to confirm you have no outstanding tax debt. If you filed late or have an installment balance owing to CRA, this needs to be disclosed and resolved before most lenders will proceed.</p>

<h3>What documents does my lawyer need when I buy a home?</h3>
<p>Your lawyer needs a copy of the signed Agreement of Purchase and Sale, your photo ID, and your mortgage commitment letter (which your lender sends directly or through your broker). For condos, they also need the status certificate package. On closing day, they coordinate receipt of mortgage funds from the lender and balance funds from you.</p>`,
  },
  {
    title: 'How to Get Mortgage Pre-Approval in Canada',
    slug: 'how-to-get-mortgage-pre-approval',
    metaDescription: 'How to get mortgage pre-approval in Canada — what documents you need, how the stress test works, and whether to use a broker or go directly to your bank.',
    summary: 'Mortgage pre-approval is a formal commitment from a lender to finance up to a specified amount, subject to the property meeting their standards. This guide covers the exact steps, required documents, the stress test, and the broker vs. bank decision.',
    body: `<!-- Primary keyword: mortgage pre-approval Canada | Intent: informational | Word count target: 1700 -->

<p>Mortgage pre-approval is one of the first concrete steps in buying a home in the GTA. A pre-approval is a formal commitment from a lender stating they will lend you up to a specific amount, at a specific rate, for a specific term — subject to the property meeting their standards and your financial situation remaining unchanged. Without it, you're searching for homes without knowing what you can actually afford, and sellers won't take your offers seriously. This guide walks through exactly how to get mortgage pre-approval in Canada, what documents you need, how the stress test works, and how to choose between a broker and going directly to your bank.</p>

<p>Pre-approval is different from a rate quote or an online mortgage calculator estimate. Those tools give you rough guidance. A pre-approval involves a full credit pull, income verification, and a formal commitment letter — the kind sellers and their agents recognize as a real signal that you're a qualified buyer ready to act. For context on the full purchase timeline, see <a href="/blog/steps-to-buying-a-home-in-the-gta">the steps to buying a home in the GTA</a>.</p>

<h2>What Documents You Need for Pre-Approval</h2>

<p>Lenders need to verify your identity, income, assets, and debts. Gather these before you start:</p>

<table>
  <thead>
    <tr><th>Document category</th><th>What to provide</th></tr>
  </thead>
  <tbody>
    <tr><td>Identity</td><td>Two government-issued photo IDs; Social Insurance Number</td></tr>
    <tr><td>Income (employed)</td><td>Last 2 T4 slips, 2 recent pay stubs, letter of employment</td></tr>
    <tr><td>Tax history</td><td>Last 2 years' Notices of Assessment (NOA) from CRA</td></tr>
    <tr><td>Down payment</td><td>90 days of bank statements showing accumulated funds</td></tr>
    <tr><td>Debts</td><td>Statements for all credit cards, loans, and lines of credit</td></tr>
  </tbody>
</table>

<p>For a full breakdown of every document required, including self-employment documentation, see <a href="/blog/what-documents-do-i-need-to-buy-a-house">what documents you need to buy a house in Ontario</a>.</p>

<h2>The Stress Test</h2>

<p>Every Canadian mortgage applicant must pass the federal mortgage stress test, regardless of down payment size. The stress test qualifies you at the <strong>higher of:</strong></p>
<ul>
  <li>Your contracted interest rate plus 2%, or</li>
  <li>5.25% (the regulatory floor)</li>
</ul>

<p>If your lender is offering a 5-year fixed rate of 4.5%, you'll be stress-tested at 6.5%. This means the lender calculates your GDS and TDS ratios — the percentages of your gross income going to housing costs and total debt — based on the higher qualifying rate, not the actual rate you'll pay. The stress test typically reduces a buyer's maximum purchase price by approximately 15–20% compared to what the actual payment would support.</p>

<p>The <a href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers" target="_blank" rel="noopener noreferrer">CMHC mortgage qualifier</a> tool can help you estimate how the stress test affects your maximum purchase price before you apply.</p>

<h2>GDS and TDS Ratios</h2>

<p>Lenders calculate two debt ratios:</p>
<ul>
  <li><strong>GDS (Gross Debt Service ratio):</strong> The percentage of gross monthly income going to housing costs (mortgage payment, property tax, heating, and 50% of condo fees if applicable). Maximum: 39% for most lenders.</li>
  <li><strong>TDS (Total Debt Service ratio):</strong> GDS plus all other monthly debt obligations (car loans, credit cards, student loans). Maximum: 44% for most lenders.</li>
</ul>

<p>If your existing debts are high, they reduce how much mortgage you qualify for. Paying down a car loan or line of credit before applying can meaningfully increase your maximum pre-approval amount.</p>

<h2>Mortgage Broker vs. Bank</h2>

<p>You can apply for pre-approval through your own bank or through a mortgage broker. The differences:</p>

<table>
  <thead>
    <tr><th></th><th>Bank directly</th><th>Mortgage broker</th></tr>
  </thead>
  <tbody>
    <tr><td>Lenders accessed</td><td>One</td><td>30+ lenders</td></tr>
    <tr><td>Rate comparison</td><td>Only their own products</td><td>Multiple lenders compared simultaneously</td></tr>
    <tr><td>Cost to buyer</td><td>Free</td><td>Free (broker paid by lender)</td></tr>
    <tr><td>Credit bureau impact</td><td>One hard pull</td><td>Multiple lenders accessed with one pull (soft pulls for rate shopping)</td></tr>
    <tr><td>Best for</td><td>Long-standing banking relationship with strong terms</td><td>First-time buyers, self-employed, or anyone wanting to compare rates</td></tr>
  </tbody>
</table>

<p>Mortgage brokers are compensated by the lender when your mortgage funds — their service costs you nothing as the borrower. They can access products from banks, credit unions, monoline lenders, and alternative lenders that aren't available directly to the public. For most first-time GTA buyers, a broker is the better starting point.</p>

<h2>Rate Hold</h2>

<p>Most pre-approvals come with a rate hold — the lender guarantees the offered rate for the duration of the pre-approval period, typically 90–120 days. If rates rise before you buy, your rate hold protects you. If rates fall, you can generally access the lower rate. Getting a pre-approval during a rising rate environment protects your purchasing power.</p>

<h2>Pre-Approval vs. Pre-Qualification</h2>

<p>A pre-qualification is an informal estimate based on self-reported information — no credit pull, no income verification, no formal commitment. It's useful for rough budgeting but carries no weight with sellers. A pre-approval involves a full credit pull, document submission, and a formal commitment letter from the lender. When you're ready to make offers in the GTA, you need a pre-approval — not a pre-qualification.</p>

<p>For a full picture of how pre-approval fits into the mortgage process, see <a href="/blog/does-mortgage-pre-approval-guarantee-a-mortgage">does mortgage pre-approval guarantee a mortgage</a> and <a href="/blog/how-long-is-mortgage-pre-approval-valid">how long mortgage pre-approval is valid</a>.</p>

<p>Ready to start shopping? <a href="/homes-for-sale/toronto">Browse homes for sale across the GTA on Condohill</a> and search by price range once you know your pre-approved budget.</p>

<h2>FAQ</h2>

<h3>How long does mortgage pre-approval take in Canada?</h3>
<p>With a mortgage broker and complete documentation, pre-approval typically takes 1–3 business days. Banks may take 3–7 business days. The timeline depends on how quickly you can submit your documents and how complex your income situation is. Self-employed buyers typically take longer due to additional documentation requirements.</p>

<h3>Does mortgage pre-approval hurt your credit score?</h3>
<p>A pre-approval requires a hard credit pull, which temporarily reduces your credit score by a few points. Multiple hard pulls from different lenders within a 14–45 day window are typically treated as a single inquiry by credit bureaus for mortgage-shopping purposes. One or two mortgage inquiries will not significantly affect your ability to qualify.</p>

<h3>Can I get pre-approved for a mortgage with a low credit score?</h3>
<p>Most major banks and A-lenders require a minimum credit score of 680 for their standard mortgage products. A score below 680 may still qualify through alternative (B) lenders like Home Trust or Equitable Bank, typically at slightly higher rates. A mortgage broker can advise on which lenders are most suitable for your credit profile.</p>

<h3>Do I need to be pre-approved before making an offer?</h3>
<p>Not legally, but practically yes. In the GTA, sellers and listing agents expect buyers to have financing arranged before making offers. Some sellers will not accept offers from buyers without pre-approval. Even if a seller accepts your offer with a financing condition, the conditional period (typically 5 business days) is very short — far too short to start the pre-approval process from scratch.</p>

<h3>What is the maximum mortgage I can get in Canada?</h3>
<p>Your maximum mortgage depends on your gross income, existing debts, down payment, and the stress test qualifying rate. As a rough guide, most buyers qualify for approximately 4–5 times their gross annual income, though the exact amount varies by lender, rate, and debt load. Use a mortgage broker to get an accurate pre-approval amount based on your specific situation rather than relying on online calculators.</p>`,
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
