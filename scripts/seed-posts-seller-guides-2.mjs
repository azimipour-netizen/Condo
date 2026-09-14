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
    title: 'Should I Sell My Home Privately or Use a Realtor in Ontario?',
    slug: 'should-i-sell-privately-or-use-a-realtor',
    summary: 'Selling privately saves commission but costs you MLS access, buyer reach, and negotiation expertise. For most GTA sellers, a Realtor produces a higher net price than going it alone.',
    metaDescription: 'Should you sell your home privately or use a Realtor in Ontario? The real tradeoffs of FSBO vs. agent — MLS access, commission savings, and net sale price.',
    body: `<!-- Primary keyword: sell privately or use a Realtor Ontario | Intent: informational | Word count target: 1700 -->

<p>Selling your home privately — without a real estate agent — is legal in Ontario and some homeowners do it successfully. But "saving the commission" is only part of the calculation. When you sell privately, you give up MLS access, professional negotiation, the listing agent's marketing infrastructure, and the legal and paperwork support that comes with a properly run transaction. For most GTA sellers, the question isn't whether you <em>can</em> sell privately, but whether you'll net more money doing so than you would paying a commission on a higher sale price achieved by an agent.</p>

<h2>What Does Selling Privately Actually Mean?</h2>

<p>Private sale means you list and sell without a listing agent representing you. You can still offer a commission to buyer's agents — and in the GTA, most private sellers do, because refusing to cooperate with buyer's agents significantly reduces your buyer pool. Buyers working with agents will not typically show their clients a private listing that offers no co-operating commission (the buyer's agent gets paid from the seller's proceeds, and if you offer zero, the buyer may have to pay their agent separately, which most won't do).</p>

<p>So in practice, private sale usually means: no listing agent commission (typically 2–2.5%), but you still pay the buyer's agent commission (typically 2–2.5%). Your actual saving is the listing side — roughly $20,000–$30,000 on a $1,000,000 home. Whether that saving is real depends on what your sale price would have been with a listing agent.</p>

<h2>What You Lose Without a Listing Agent</h2>

<p><strong>MLS access:</strong> Only TRREB (Toronto Regional Real Estate Board) members can list on MLS, which feeds Realtor.ca and all the major listing portals. Private sellers can pay flat-fee listing services ($300–$1,500) to get MLS access without full representation, but these services offer no pricing advice, negotiation support, or transaction management.</p>

<p><strong>Pricing expertise:</strong> Pricing a home correctly is the single most important decision in a sale. An overpriced home sits; a properly priced home attracts multiple buyers and often sells at or above asking. Listing agents run comparative market analyses using real-time sold data from MLS — data private sellers don't have access to. Mispricing by 5% on a $1,000,000 home costs $50,000.</p>

<p><strong>Marketing reach:</strong> Beyond MLS, listing agents leverage professional photography, staging consultations, social media promotion, agent networks, and open houses. A well-marketed listing generates more competing buyers. More buyers produce higher prices.</p>

<p><strong>Negotiation:</strong> Negotiating with an experienced buyer's agent while unrepresented puts you at a significant disadvantage. Buyer's agents negotiate daily. They know how to structure offers, use conditions strategically, and apply pressure at the right moments. A private seller negotiating directly against a professional negotiator is an asymmetric situation.</p>

<p><strong>Transaction management:</strong> An accepted offer creates a legally binding contract with specific obligations, timelines, and conditions. Errors — missed condition deadlines, incorrect disclosure, failure to deliver documents — have legal consequences. Listing agents manage these details; private sellers manage them alone or pay a real estate lawyer to handle the transaction side.</p>

<h2>When Selling Privately Makes More Sense</h2>

<p>Private sale works better in specific situations:</p>

<ul>
  <li><strong>Known buyer:</strong> If a neighbour, family member, or colleague wants to buy your home, selling privately is straightforward — you both know the property, you know the buyer, and a real estate lawyer can handle the paperwork for $1,500–$2,500.</li>
  <li><strong>Extremely hot seller's market:</strong> When demand dramatically outstrips supply and buyers are competing for anything available, the listing agent's incremental value narrows. Even in hot markets, though, optimal pricing still requires MLS data.</li>
  <li><strong>Investment property sold to existing tenant:</strong> Selling to the tenant already in the property eliminates the marketing problem entirely.</li>
</ul>

<h2>The Net Price Comparison</h2>

<p>The honest calculation: compare what you'd likely net after a full-commission sale versus a private sale. If an agent's pricing and marketing produce a sale price 3–5% higher than you'd achieve privately, you've more than covered the commission. On a $900,000 home:</p>

<table>
  <thead>
    <tr><th>Scenario</th><th>Sale price</th><th>Commission paid</th><th>Net proceeds</th></tr>
  </thead>
  <tbody>
    <tr><td>With listing agent</td><td>$950,000</td><td>$47,500 (5%)</td><td>$902,500</td></tr>
    <tr><td>Private sale (buyer's agent paid)</td><td>$920,000</td><td>$23,000 (2.5%)</td><td>$897,000</td></tr>
    <tr><td>True FSBO (no cooperating commission)</td><td>$880,000</td><td>$0</td><td>$880,000</td></tr>
  </tbody>
</table>

<p>This is illustrative, not guaranteed — market conditions and the specific agent matter. But it illustrates why commission savings on paper often disappear in the net proceeds calculation.</p>

<p>Before deciding, read our guides on <a href="/blog/how-much-does-it-cost-to-sell-a-house-in-ontario">what it costs to sell a home in Ontario</a> and <a href="/blog/how-does-real-estate-commission-work-when-selling">how real estate commission works</a>.</p>

<h2>FAQ</h2>

<h3>Is it legal to sell my home without a Realtor in Ontario?</h3>
<p>Yes. There is no legal requirement to use a real estate agent to sell your home in Ontario. You can sell privately, hire a lawyer to handle the transaction, and manage the process yourself. The legal constraints are on who can access MLS (only registered TRREB members) and on disclosure obligations — not on whether you need representation.</p>

<h3>Can I list on MLS without a Realtor?</h3>
<p>Not directly. Only registered real estate agents can list on MLS. However, flat-fee MLS listing services allow private sellers to pay a one-time fee ($300–$1,500) to have an agent list the property on MLS with minimal service. You retain control of the sale but get MLS exposure. These services don't provide pricing advice, negotiation support, or transaction management.</p>

<h3>Do I still have to pay a commission if I sell privately?</h3>
<p>You're not legally required to offer a buyer's agent commission. But if you don't, buyer's agents will likely steer their clients away from your listing or require the buyer to compensate them directly — which most buyers won't do. Offering the standard buyer's agent commission (2–2.5%) while saving the listing-side commission is the most common private sale approach in the GTA.</p>

<h3>What are the main risks of selling privately in the GTA?</h3>
<p>Mispricing (overpricing leads to a stale listing; underpricing leaves money on the table), reduced buyer reach, negotiating unrepresented against professional buyer's agents, and managing the legal and administrative requirements of the transaction without professional support. Errors in the Agreement of Purchase and Sale can have significant legal consequences.</p>

<h3>How much does a real estate lawyer cost if I sell privately?</h3>
<p>A real estate lawyer to handle the closing on a private sale in Ontario typically costs $1,500–$3,000 in legal fees plus disbursements. This covers title search, preparing the transfer, handling the mortgage discharge, and closing the transaction. You'll need a lawyer regardless of whether you sell privately or with an agent — a lawyer on the seller's side is always required.</p>`,
  },
  {
    title: 'How Much Does It Cost to Sell a House in Ontario?',
    slug: 'how-much-does-it-cost-to-sell-a-house-in-ontario',
    summary: 'Selling a home in Ontario typically costs 5–8% of the sale price when you include real estate commission, legal fees, mortgage penalties, and pre-sale costs like staging and repairs.',
    metaDescription: 'How much does it cost to sell a house in Ontario? Real estate commission, legal fees, mortgage penalties, staging, and other seller costs — with 2025 GTA numbers.',
    body: `<!-- Primary keyword: cost to sell a house Ontario | Intent: informational | Word count target: 1700 -->

<p>Selling a home in Ontario costs more than most sellers anticipate. The headline number — real estate commission — is the largest expense, but it's not the only one. Legal fees, mortgage prepayment penalties, pre-sale preparation costs, and moving expenses add up quickly. A GTA seller netting $900,000 from their sale might have paid $60,000–$80,000 in total selling costs to achieve that number. Understanding the full cost picture before you list lets you plan your net proceeds accurately and avoid surprises at closing.</p>

<h2>Real Estate Commission</h2>

<p>Commission is typically the largest cost of selling. In Ontario, the total commission on a sale is negotiated between the seller and listing agent, and is traditionally split between the listing brokerage and the buyer's brokerage. Standard rates in the GTA in 2025 run:</p>

<ul>
  <li><strong>Total commission:</strong> 3.5–5% of sale price</li>
  <li><strong>Listing agent side:</strong> 1.5–2.5%</li>
  <li><strong>Buyer's agent side (co-operating commission):</strong> 2–2.5%</li>
</ul>

<p>On a $900,000 sale at 5% total commission: $45,000. On a $1,200,000 sale at 4.5%: $54,000. Commission is negotiable — see our guide on <a href="/blog/can-real-estate-commission-be-negotiated">whether commission can be negotiated</a>. HST applies to the commission amount (13% in Ontario), adding $5,850 on a $45,000 commission.</p>

<h2>Legal Fees</h2>

<p>Every Ontario home sale requires a real estate lawyer on the seller's side. Legal fees for a standard residential sale run $1,500–$3,000 in legal fees plus disbursements ($200–$500 for title search, registration, and document retrieval). Total legal cost: $1,700–$3,500 typically. Complex transactions — estate sales, divorce sales, title issues — cost more.</p>

<h2>Mortgage Prepayment Penalty</h2>

<p>If you have a closed mortgage and are selling before the end of your term, your lender charges a prepayment penalty. For fixed-rate mortgages, the penalty is the greater of 3 months' interest or the Interest Rate Differential (IRD) — the IRD can be substantial on longer fixed terms with large balances. Variable rate mortgages typically charge 3 months' interest only.</p>

<p>On a $600,000 mortgage balance with 2 years remaining on a 5-year fixed at 4.5%, the IRD penalty can easily reach $15,000–$25,000. Contact your lender early in the selling process to get your exact payout statement — don't estimate this.</p>

<h2>Pre-Sale Preparation Costs</h2>

<p><strong>Home staging:</strong> Professional staging for a GTA home typically runs $2,000–$5,000 for a vacant property (furniture rental + staging) or $500–$1,500 for occupied staging consultation. Well-staged homes generally sell faster and for higher prices — most agents consider it a worthwhile investment.</p>

<p><strong>Pre-listing repairs and updates:</strong> Paint, landscaping, minor repairs, cleaning — budget $2,000–$10,000 depending on the property's condition and how much work you choose to do. A fresh coat of neutral paint throughout ($3,000–$6,000 professionally done) consistently improves buyer perception.</p>

<p><strong>Pre-listing home inspection:</strong> Optional but increasingly common. Cost: $400–$600. Lets you address issues before buyers find them and reduces risk of deals falling through on inspection conditions.</p>

<p><strong>Professional photography:</strong> Included in most full-service listings, but verify. Drone photography for properties with notable outdoor features: $200–$400 additional.</p>

<h2>Moving Costs</h2>

<p>A professional move within the GTA runs $1,500–$5,000+ depending on home size, distance, and services (packing vs. transport only). Long-distance moves are significantly more. If there's a gap between sale closing and your next home closing, add short-term storage ($200–$500/month) and possibly temporary housing costs.</p>

<h2>Capital Gains Tax</h2>

<p>For your principal residence — the home you ordinarily lived in — the principal residence exemption under the <em>Income Tax Act</em> eliminates capital gains tax on sale. This applies as long as the home was designated your principal residence for each year of ownership. Investment properties and vacation properties don't qualify for the full exemption and generate a taxable capital gain.</p>

<h2>What Sellers Often Forget</h2>

<p>Property tax adjustments at closing: if you've prepaid property taxes beyond the closing date, you get a credit from the buyer. If you're in arrears, you owe the difference. Utility adjustments (gas, hydro, water) are also prorated at closing through the Statement of Adjustments your lawyer prepares.</p>

<h2>Full Cost Summary</h2>

<table>
  <thead>
    <tr><th>Cost item</th><th>Typical range (GTA 2025)</th></tr>
  </thead>
  <tbody>
    <tr><td>Real estate commission (incl. HST)</td><td>$40,000–$70,000</td></tr>
    <tr><td>Legal fees + disbursements</td><td>$1,700–$3,500</td></tr>
    <tr><td>Mortgage prepayment penalty</td><td>$0–$25,000+</td></tr>
    <tr><td>Staging</td><td>$500–$5,000</td></tr>
    <tr><td>Pre-sale repairs and prep</td><td>$2,000–$10,000</td></tr>
    <tr><td>Moving costs</td><td>$1,500–$5,000</td></tr>
    <tr><td>Total (without mortgage penalty)</td><td>$45,700–$93,500</td></tr>
  </tbody>
</table>

<p>For a complete breakdown of the documents you'll need, see our guide on <a href="/blog/what-documents-do-i-need-to-sell-my-home">documents required to sell a home in Ontario</a>.</p>

<h2>FAQ</h2>

<h3>How much of the sale price do I actually keep as the seller?</h3>
<p>On a $900,000 sale with a $400,000 remaining mortgage, 5% commission, standard legal fees, no prepayment penalty, and $5,000 in prep costs: approximately $440,000–$445,000 after costs. Your specific net depends on your mortgage balance, commission rate, and prep investment. Run the numbers with your agent and lawyer before listing.</p>

<h3>Do sellers pay land transfer tax in Ontario?</h3>
<p>No. Ontario Land Transfer Tax and Toronto Municipal Land Transfer Tax are paid by the buyer, not the seller. Sellers pay commission, legal fees, and mortgage discharge costs — not land transfer tax.</p>

<h3>Is real estate commission tax deductible when selling?</h3>
<p>If you're selling your principal residence, the principal residence exemption eliminates capital gains tax entirely, so there's nothing to deduct commission against. If selling an investment property, the commission and legal fees are added to the adjusted cost base, reducing your capital gain. Consult an accountant for your specific situation.</p>

<h3>What is the HST on commission in Ontario?</h3>
<p>Commission is subject to 13% HST. On a $45,000 commission, HST adds $5,850 — total commission cost is $50,850. This is factored into the commission rate you negotiate; make sure you're clear whether the rate you're quoted is before or after HST.</p>

<h3>When do I pay the selling costs — at listing or at closing?</h3>
<p>Commission and legal fees are paid at closing, deducted from the sale proceeds before you receive your net amount. Pre-sale costs (staging, repairs, photography) are paid as incurred. Mortgage prepayment penalties are paid through the discharge at closing. You don't need cash upfront for the big items — they flow through closing.</p>`,
  },
  {
    title: 'How Does Real Estate Commission Work When Selling in Ontario?',
    slug: 'how-does-real-estate-commission-work-when-selling',
    summary: 'In Ontario, real estate commission is paid by the seller and split between the listing and buyer\'s brokerage. It\'s negotiable, subject to HST, and deducted from sale proceeds at closing.',
    metaDescription: 'How real estate commission works when selling in Ontario — who pays it, how it\'s split between agents, what rates are standard in the GTA, and when it\'s paid.',
    body: `<!-- Primary keyword: how does real estate commission work selling Ontario | Intent: informational | Word count target: 1600 -->

<p>When you sell a home in Ontario, real estate commission is paid by the seller and split between two brokerages: the listing brokerage (your agent's firm) and the buyer's brokerage (the buyer's agent's firm). Understanding how commission is structured, who receives what, and what you actually pay helps you negotiate intelligently and plan your net proceeds accurately.</p>

<h2>Who Pays Commission in Ontario?</h2>

<p>The seller pays all commission — both the listing side and the buyer's side. This is how it works in Ontario and across Canada. Even though the buyer's agent works for the buyer, their commission comes from the seller's proceeds at closing. The seller agrees to the total commission rate when signing the listing agreement, and that rate is split between the two brokerages as specified.</p>

<p>This model exists because sellers receive the purchase proceeds and are in a position to pay commission from them. Buyers typically don't have additional cash beyond the purchase price and closing costs. The arrangement means buyers can use professional representation without paying out of pocket — though they do bear the cost indirectly through the purchase price.</p>

<h2>How Commission Is Split</h2>

<p>The total commission is divided between the listing brokerage and the co-operating (buyer's) brokerage. The split is specified in the listing agreement and is offered publicly to buyer's brokerages as the "co-operating commission" — the amount buyer's agents can expect to receive if they bring a buyer who completes a purchase.</p>

<p>Typical GTA commission structure in 2025:</p>

<table>
  <thead>
    <tr><th>Side</th><th>Rate</th><th>On $900,000 sale</th></tr>
  </thead>
  <tbody>
    <tr><td>Listing brokerage</td><td>1.5–2.5%</td><td>$13,500–$22,500</td></tr>
    <tr><td>Buyer's brokerage</td><td>2–2.5%</td><td>$18,000–$22,500</td></tr>
    <tr><td>Total (before HST)</td><td>3.5–5%</td><td>$31,500–$45,000</td></tr>
    <tr><td>HST (13%)</td><td>—</td><td>$4,095–$5,850</td></tr>
    <tr><td>Total with HST</td><td>—</td><td>$35,595–$50,850</td></tr>
  </tbody>
</table>

<h2>When Is Commission Paid?</h2>

<p>Commission is not paid upfront or during the listing period. It's paid at closing, deducted from your sale proceeds. Your real estate lawyer receives the gross sale proceeds from the buyer's lawyer, deducts the mortgage discharge, commission, legal fees, and adjustments, and remits the net amount to you. You never write a separate cheque for commission — it flows through the closing statement.</p>

<p>If a deal falls through — the buyer walks before the deal goes firm, or a condition isn't waived — no commission is earned. Commission is only payable on a completed transaction. If the deal goes firm and then the buyer defaults, the commission situation becomes more complex and is addressed in the listing agreement's terms.</p>

<h2>What the Listing Agreement Says About Commission</h2>

<p>When you sign an OREA listing agreement (Form 200 — Authority to Offer for Sale), you specify the total commission rate and the co-operating commission offered to buyer's brokerages. The listing agreement is a binding contract between you and the listing brokerage. If your home sells during the listing period (including a holdover period after expiry), commission is owed.</p>

<p>The holdover clause means that if a buyer who was introduced to your property during the listing period buys it within a specified time after the listing expires (typically 60–90 days), commission is still owed to the listing brokerage. This prevents sellers from waiting for the listing to expire to do a private deal with a buyer the agent found.</p>

<h2>Does the Agent Keep the Full Commission?</h2>

<p>No. The commission goes to the brokerage first, and the brokerage pays the agent their share based on a split agreement between the agent and their brokerage. New agents may receive 50–60% of the commission; experienced top-producing agents may be on splits of 80–90% or more, or flat desk fee arrangements. The specific agent/brokerage split is an internal matter — you pay the brokerage and they pay the agent.</p>

<p>If the listing agent also brings the buyer (double-ending), they may receive both sides of the commission — though they must then represent both parties and navigate potential conflicts of interest. Discuss this scenario with your agent and understand the implications before proceeding.</p>

<p>Commission is negotiable — see our guide on <a href="/blog/can-real-estate-commission-be-negotiated">whether you can negotiate real estate commission</a>. Also understand <a href="/blog/how-much-does-it-cost-to-sell-a-house-in-ontario">the full cost of selling a home in Ontario</a> before calculating your net proceeds.</p>

<h2>FAQ</h2>

<h3>Can I avoid paying the buyer's agent commission if the buyer is unrepresented?</h3>
<p>If the buyer has no agent, the co-operating commission you offered isn't owed to another brokerage. What happens to that portion depends on your listing agreement — it may reduce your total commission, or the listing brokerage may retain it. Clarify this with your listing agent before signing. Some listing brokerages retain the full commission regardless; others credit you the buyer's side when no buyer's agent is involved.</p>

<h3>Is commission the same as "finder's fees" or referral fees?</h3>
<p>No. Commission under an OREA listing agreement is a contractual payment for services rendered in completing the sale. Referral fees are separate payments between agents (e.g., when one agent refers a client to another). Referral fees are regulated under REBBA (Real Estate and Business Brokers Act) and must flow through the brokerage, not directly between agents.</p>

<h3>What happens to commission if the sale price is lower than expected?</h3>
<p>Commission is calculated as a percentage of the actual sale price — whatever the home sells for. If you list at $1,000,000 and accept $920,000, commission is calculated on $920,000. There's no minimum commission floor unless one is specified in your listing agreement (uncommon in residential sales).</p>

<h3>Is commission the same across all agents and brokerages in the GTA?</h3>
<p>No. Commission is individually negotiated between each seller and their listing agent. There is no industry-set standard rate — that would be price-fixing and is illegal under Canadian competition law. Rates vary by agent, brokerage, market conditions, and property type. Higher-priced properties sometimes command lower percentage rates due to the absolute dollar amounts involved.</p>

<h3>What is a "flat fee" or "discount" brokerage?</h3>
<p>Flat-fee brokerages charge a fixed amount (e.g., $5,000–$10,000) for listing services rather than a percentage. You still typically offer the buyer's agent co-operating commission. The tradeoff: lower listing cost but often reduced service — limited marketing, no staging consultation, minimal negotiation support. Compare the service offering carefully, not just the fee.</p>`,
  },
  {
    title: 'Can Real Estate Commission Be Negotiated in Ontario?',
    slug: 'can-real-estate-commission-be-negotiated',
    summary: 'Yes, real estate commission is fully negotiable in Ontario — there is no fixed rate, and sellers should understand what they\'re trading when negotiating a lower commission.',
    metaDescription: 'Can you negotiate real estate commission in Ontario? Yes — here\'s what\'s negotiable, what you risk, and how to have that conversation with a listing agent.',
    body: `<!-- Primary keyword: negotiate real estate commission Ontario | Intent: informational | Word count target: 1600 -->

<p>Real estate commission in Ontario is fully negotiable. There is no fixed or standard rate — setting industry-wide commission rates would constitute price-fixing and is prohibited under the <em>Competition Act</em>. Every commission you pay is the result of a negotiated agreement between you and your listing agent. Knowing this, understanding what to negotiate, and recognizing what you risk when trading service for a lower rate are the keys to having a productive commission conversation.</p>

<h2>What Is Negotiable and What Isn't</h2>

<p><strong>Negotiable:</strong></p>
<ul>
  <li>The listing agent's commission (their brokerage's share)</li>
  <li>The total commission rate, including the co-operating commission offered to buyer's agents</li>
  <li>Performance-based structures (e.g., lower base rate with a bonus if sold above asking)</li>
  <li>Reduced commission in exchange for reduced services (fewer open houses, no staging consultation, etc.)</li>
</ul>

<p><strong>Less negotiable — and risky to cut:</strong></p>
<ul>
  <li>The co-operating commission (buyer's agent share): cutting this reduces your buyer pool</li>
</ul>

<p>The most common negotiating mistake sellers make is cutting the co-operating commission to save money. If you offer buyer's agents below-market co-operating commission, some agents will show your property less actively and some buyers working with agents may be discouraged. On a $900,000 listing, cutting the buyer's side from 2.5% to 1.5% saves $9,000 — but if it results in fewer offers or a lower accepted price, that saving is erased quickly.</p>

<h2>What Agents Actually Earn and Why That Matters</h2>

<p>Understanding how agents earn helps you negotiate fairly. Out of the listing agent's commission share, their brokerage takes a cut (agent/brokerage splits typically range from 50/50 for new agents to 80/20+ for top producers). The agent also pays marketing costs — professional photography, signage, staging consultation, MLS fees, advertising — from their net commission. On a 2% listing side commission on a $900,000 sale ($18,000 gross), after a 70/30 brokerage split, the agent nets $12,600 before marketing expenses and taxes.</p>

<p>An agent who spends 3–4 weeks listing, marketing, managing showings, handling multiple offers, and closing a complex transaction for $10,000–$12,000 net is not being compensated excessively. An agent willing to cut to 1% on a $900,000 listing ($9,000 gross) may cut corners elsewhere. Ask what changes in their service if you negotiate down.</p>

<h2>How to Negotiate Commission Effectively</h2>

<p><strong>1. Compare multiple agents first.</strong> Interview at least 2–3 listing agents. Some agents already offer competitive rates without being asked. Understanding the range in your market gives you a negotiating baseline. See our guide on <a href="/blog/how-many-realtors-should-i-interview-before-listing">how many Realtors to interview before listing</a>.</p>

<p><strong>2. Negotiate the listing side, protect the buyer's side.</strong> Propose reducing the listing agent's commission while maintaining the co-operating commission at market rate (2–2.5%). Agents understand this ask better than blanket reductions because it doesn't penalize them for the buyer's agent's work.</p>

<p><strong>3. Use the property and market conditions as leverage.</strong> Easier listings — high-demand neighbourhoods, well-maintained properties priced accurately — require less agent effort and are more likely to generate competition naturally. Agents are more willing to reduce commission on properties that will likely sell quickly with low effort.</p>

<p><strong>4. Consider performance structures.</strong> Offer a base rate with a bonus: "If you sell above $X, you earn an extra 0.5%." Aligns incentives and lets the agent share in the upside they generate.</p>

<p><strong>5. Ask explicitly what changes.</strong> If an agent quotes 4% instead of 5%, ask: will you still do professional photography, staging consultation, and full open-house schedule? Get the service commitment in writing through the listing agreement's terms.</p>

<h2>Flat-Fee Alternatives</h2>

<p>Flat-fee and limited-service brokerages offer lower listing costs in exchange for reduced services. For a seller confident in their pricing knowledge, willing to handle showings, and experienced enough to review offers independently, a flat-fee listing with MLS access ($5,000–$10,000) plus the standard co-operating commission may be cost-effective. For sellers who want professional pricing, negotiation, and full transaction management, a full-service agent typically produces better net results despite the higher commission. See our guide on <a href="/blog/should-i-sell-privately-or-use-a-realtor">private sale vs. using a Realtor</a>.</p>

<h2>FAQ</h2>

<h3>Is it rude to ask a Realtor to reduce their commission?</h3>
<p>No. Commission negotiation is expected and professional. Experienced listing agents receive this question regularly. Ask directly and professionally — "What flexibility do you have on your listing side commission?" Most agents will either negotiate or explain clearly why their rate reflects the service they provide. An agent who takes serious offense at a polite commission question is showing you something about how they'll handle offer negotiations on your behalf.</p>

<h3>Will a lower commission result in worse service?</h3>
<p>It depends on what's reduced. Some agents offer slightly lower rates to win listings and still provide full service. Others reduce service in proportion to the fee. Ask specifically what the service scope is at the quoted rate, and get commitments about photography, staging, open houses, and marketing in writing. Judge on service commitment, not rate alone.</p>

<h3>Can I negotiate commission after signing the listing agreement?</h3>
<p>The listing agreement is a binding contract. Commission renegotiation after signing requires the agent's agreement — they're not obligated to change terms. Negotiate before signing. If you're unhappy with commission terms after signing, you can try to reach a mutual agreement with the agent, but you have limited leverage once the contract is executed.</p>

<h3>What is a typical commission rate in the GTA in 2025?</h3>
<p>Total commission of 4–5% is most common in the GTA, split roughly 2–2.5% each to listing and buyer's brokerage. Some agents offer 3.5% total. Higher-value properties ($2M+) sometimes negotiate to 3–3.5% total. Flat-fee models outside the traditional percentage structure are growing. There is no universal rate — every commission is negotiated individually.</p>

<h3>What happens to commission if a deal falls through?</h3>
<p>If the deal doesn't go firm (buyer walks during condition period or offer expires), no commission is owed. If the deal goes firm and the buyer then defaults, the question of commission depends on your listing agreement's terms and what damages are pursued. Consult your real estate lawyer if a firm deal collapses — the commission situation is fact-specific.</p>`,
  },
  {
    title: 'What Should I Ask a Listing Agent Before Signing?',
    slug: 'what-should-i-ask-a-listing-agent',
    summary: 'Before signing a listing agreement, ask about the agent\'s recent local sales, their pricing strategy, marketing plan, commission structure, and how they handle multiple offers and difficult negotiations.',
    metaDescription: 'What to ask a listing agent before signing in Ontario. Key questions on experience, pricing strategy, marketing, commission, and how they handle offers — for GTA sellers.',
    body: `<!-- Primary keyword: what to ask a listing agent | Intent: informational | Word count target: 1700 -->

<p>Choosing a listing agent is one of the most consequential decisions in selling your home. The agent you hire shapes your listing price, marketing reach, negotiation outcome, and how smoothly the transaction closes. Most sellers spend more time choosing a kitchen appliance than they do interviewing listing agents. Before you sign a listing agreement, ask these questions — and pay close attention to how the agent answers, not just what they say.</p>

<h2>Questions About Experience and Local Knowledge</h2>

<p><strong>"How many homes have you sold in this neighbourhood in the last 12 months?"</strong><br>
An agent who has sold five homes on your street understands your market — buyer profiles, what objections come up, what features matter most to local buyers. An agent who has rarely sold in your area is learning on your listing. Local transaction volume is the most directly relevant experience metric.</p>

<p><strong>"What was the average list-to-sale ratio on your recent listings?"</strong><br>
This ratio compares what homes listed for versus what they actually sold for. An agent consistently achieving 100%+ of list price is either an exceptional negotiator or prices homes strategically to attract competition. Consistently underperforming — selling at 95% of list — may indicate overpricing habits (price high, then reduce). Request specific examples with addresses you can verify.</p>

<p><strong>"What is your average days on market?"</strong><br>
Faster sales at or above asking reflect strong pricing and marketing execution. Long market times may indicate overpricing or weak marketing. Benchmark against the current average days on market in your neighbourhood — your agent should know it.</p>

<h2>Questions About Pricing Strategy</h2>

<p><strong>"How did you arrive at this recommended listing price?"</strong><br>
A credible answer involves specific comparable sales — properties similar to yours that sold recently, with adjustments for condition, features, and location. Vague answers ("the market is strong, we'll get a great price") or suspiciously high numbers designed to win the listing are red flags. Ask to see the comparative market analysis (CMA) in writing.</p>

<p><strong>"Are you recommending we price to attract multiple offers or price at market value?"</strong><br>
These are distinct strategies with different risk profiles. A hold-back strategy (pricing below market to generate a bidding war) can produce excellent results in a seller's market but can backfire in a balanced or buyer's market. The agent should explain the current market conditions in your area and which strategy fits them. See our guide on <a href="/blog/what-is-the-best-listing-price-strategy">best listing price strategies</a>.</p>

<h2>Questions About Marketing</h2>

<p><strong>"What does your marketing plan include specifically?"</strong><br>
Get specifics: professional photography (who, what equipment, how many photos), virtual tour, staging consultation or full staging, open houses (how many, what format), social media promotion (which platforms, paid vs. organic), agent network outreach. "I'll list it on MLS and hold open houses" is minimal. A competitive marketing plan is what justifies a full-service commission.</p>

<p><strong>"Will a professional photographer shoot the property?"</strong><br>
Professional photography is not optional in competitive GTA markets. Phone photos or substandard photography cost you buyer attention. Every listing should have professional photography. If an agent hesitates on this, that's a concern.</p>

<p><strong>"Do you recommend staging, and what does that involve?"</strong><br>
Not every home needs full staging, but every home benefits from a staging consultation. Ask what the agent's process is — do they have a stager they work with? What does a consultation cost (ideally included in their service)? Do they recommend occupied staging (rearranging your furniture) or vacant staging (renting furniture)?</p>

<h2>Questions About Communication and Process</h2>

<p><strong>"Who will I be dealing with day to day — you or your team?"</strong><br>
Many top-producing agents operate with teams — showing agents, transaction coordinators, marketing assistants. This isn't inherently bad, but you should know upfront who will handle showings, communicate feedback, and present offers. If you expect the agent you interviewed to be your primary contact, confirm that expectation.</p>

<p><strong>"How will you communicate showing feedback and market updates?"</strong><br>
Weekly updates with showing counts, feedback themes, and market comparison data should be standard. Silence from an agent during an active listing period is unacceptable.</p>

<h2>Questions About Commission and the Listing Agreement</h2>

<p><strong>"What is your commission, and what does it include?"</strong><br>
Get the specific rate, how it's split with the buyer's brokerage, and what services are included. Ask what changes if you negotiate a lower rate. See our guide on <a href="/blog/can-real-estate-commission-be-negotiated">negotiating real estate commission</a>.</p>

<p><strong>"What is the listing term, and what are the holdover provisions?"</strong><br>
Standard listings run 60–90 days. The holdover clause specifies how long commission is owed after the listing expires if a buyer introduced during the listing period returns. Understand this before signing.</p>

<h2>Questions About Multiple Offers and Negotiations</h2>

<p><strong>"How do you handle a multiple-offer situation as a listing agent?"</strong><br>
A strong answer covers: setting an offer date vs. reviewing offers as received, how to communicate to buyers' agents to generate maximum competition, how to advise you on comparing price vs. terms, and how to handle situations where the highest offer isn't the cleanest. See our guide on <a href="/blog/how-do-multiple-offers-work-for-sellers">how multiple offers work for sellers</a>.</p>

<h2>FAQ</h2>

<h3>How many agents should I interview before choosing one?</h3>
<p>At minimum two; ideally three. One interview gives you no reference point. Two interviews reveal the spectrum. Three interviews let you compare meaningfully. See our guide on <a href="/blog/how-many-realtors-should-i-interview-before-listing">how many Realtors to interview</a> for a complete approach.</p>

<h3>What are red flags in a listing presentation?</h3>
<p>Unusually high suggested list price (may be buying the listing), vague marketing plan, pressure to sign the listing agreement at the first meeting, reluctance to show you comparable sales data, and inability to answer specific questions about recent local sales. An agent who can't name three comparable sales in your neighbourhood in the past 90 days hasn't prepared adequately.</p>

<h3>Should I choose the agent who suggests the highest price?</h3>
<p>No — this is one of the most common mistakes sellers make. Overpricing leads to days on market, price reductions, and ultimately lower sale prices than correct initial pricing would have achieved. An agent who tells you what you want to hear to win the listing is not serving your interests. Choose based on CMA accuracy, marketing quality, and track record — not the highest number on a piece of paper.</p>

<h3>Can I change agents if I'm unhappy during the listing?</h3>
<p>You can terminate a listing agreement, but the process and conditions depend on your agreement's terms and the brokerage's cooperation. Most listing agreements require written notice to cancel, and the holdover clause may continue to apply after cancellation. If you're seriously dissatisfied, review the agreement with a real estate lawyer before taking action.</p>

<h3>Should I tell each agent what other agents quoted?</h3>
<p>You can, but be strategic. Knowing a competing agent offered 4% commission may or may not influence another agent's rate. More useful: use the competitive environment to get written service commitments and comparable market analyses from each agent, then compare the complete picture — service, price, strategy, and commission — not just the rate.</p>`,
  },
  {
    title: 'How Do I Choose the Right Realtor to Sell My Home in Ontario?',
    slug: 'how-do-i-choose-the-right-realtor-to-sell-my-home',
    summary: 'Choose a listing agent based on local sales track record, pricing accuracy, marketing quality, and communication style — not on who suggests the highest list price or charges the lowest commission.',
    metaDescription: 'How to choose the right Realtor to sell your home in Ontario. What to look for, what to avoid, and how to evaluate agents in the GTA before signing a listing agreement.',
    body: `<!-- Primary keyword: how to choose a Realtor to sell my home | Intent: informational | Word count target: 1700 -->

<p>Choosing the right Realtor to sell your home is the most important decision in the selling process. The listing agent you hire sets the list price strategy, executes the marketing, manages showings, negotiates your offer, and guides you through closing. A strong agent can meaningfully outperform a weak one on the same property — by $20,000–$50,000 or more. A poor choice costs you not just money but time and stress. Here's how to evaluate listing agents in the GTA systematically and make a confident decision.</p>

<h2>Start with Local Sales Volume, Not General Reputation</h2>

<p>An agent who is well-known in one area of the GTA may have limited knowledge of your specific neighbourhood. The most relevant credential is recent local transactions — homes sold in your area, at your price point, in the last 12 months. Ask every agent you interview: "How many homes have you listed and sold in this neighbourhood in the past year?" and "Can you give me specific addresses I can look up?"</p>

<p>Verify through TRREB sold data or Realtor.ca — sales history is public. An agent who has completed 5–10 transactions on your street or in your community understands local buyer profiles, neighbourhood-specific objections, and what features matter most to buyers in your area. This local depth is not replaceable by general experience.</p>

<h2>Evaluate Pricing Accuracy</h2>

<p>The most important skill a listing agent has is pricing your home correctly. Ask each agent for their list-to-sale ratio on recent listings — the percentage of list price achieved at sale. An agent consistently hitting 99–103% of list price in a balanced market is pricing accurately and negotiating effectively. One consistently at 94–96% may be overpricing homes (then reducing) or accepting weak offers without pushing back.</p>

<p>Ask to see the comparative market analysis (CMA) they've prepared for your home. A strong CMA includes 3–5 specific comparable sold properties within the last 3–6 months, explains adjustments for differences (square footage, lot size, renovation level, age), and arrives at a defensible price range. A CMA without specific comps, or that ignores the market adjustment required by current conditions, is not a reliable foundation for your list price decision.</p>

<h2>Assess Marketing Quality</h2>

<p>Browse each agent's recent active and sold listings online. What do the photos look like? Are they professional and flattering, or dark phone photos taken from odd angles? Is there a virtual tour? Does the listing description read as specific and compelling, or is it generic filler?</p>

<p>Ask specifically what their marketing plan includes for your home: professional photography, staging, open house schedule, social media promotion, agent-to-agent networking. Get a written commitment. The difference between a well-marketed and a poorly marketed listing can easily represent several weeks on market and multiple offers foregone.</p>

<h2>Consider Communication Style and Responsiveness</h2>

<p>You'll be working closely with this agent during a high-stakes, emotionally charged process. Communication fit matters. Ask: how often will you update me on showings and feedback? What's your typical response time to messages? Do you prefer calls, texts, or email?</p>

<p>Test their responsiveness during the interview process — if an agent takes two days to respond to your initial inquiry, they'll take two days to respond during your listing. If they call you back within an hour, that's evidence of how they operate.</p>

<h2>Check References and Reviews</h2>

<p>Ask each agent for 2–3 references — sellers (not buyers) they've represented in the last 6–12 months at a similar price point. Call the references. Ask: Did the agent price the home accurately? How did they handle showing feedback? How did they advise you when offers came in? Were there any problems, and how were they resolved?</p>

<p>Online reviews on Google, RECO's public licence registry, and other platforms provide additional signal. Look for patterns in negative reviews — recurring themes about communication, pricing, or responsiveness are more meaningful than isolated complaints.</p>

<h2>Avoid the Common Selection Mistakes</h2>

<p><strong>Don't choose based on list price alone.</strong> An agent who quotes a dramatically higher list price than comparable agents may be "buying the listing" — inflating their recommended price to win your business, then advising price reductions after the listing stalls. The list price they recommend is a strategy, not a guarantee.</p>

<p><strong>Don't choose based solely on commission rate.</strong> A lower commission from an agent who underperforms on price costs you more than a full commission from one who achieves top dollar.</p>

<p><strong>Don't choose a friend or family member out of obligation</strong> unless they genuinely have strong local sales records. Mixing a professional transaction with a personal relationship can damage both the transaction and the relationship if things go wrong.</p>

<p>Before interviewing, know what questions to ask — our guide on <a href="/blog/what-should-i-ask-a-listing-agent">what to ask a listing agent</a> covers the full interview process. And see our guide on <a href="/blog/how-many-realtors-should-i-interview-before-listing">how many Realtors to interview</a> for the right number of comparisons.</p>

<h2>FAQ</h2>

<h3>How long does it take to choose a listing agent?</h3>
<p>Plan for 1–2 weeks from initial research to signed listing agreement. Use the first week to identify 3–4 candidates (referrals, Realtor.ca searches, neighbourhood yard sign tracking), schedule interviews in the second week, and make your decision within a few days of comparing CMAs and proposals. Rushing this decision is one of the most expensive mistakes sellers make.</p>

<h3>Should I choose the agent my buyer's agent used to buy my current home?</h3>
<p>Not necessarily — and possibly not at all. Your buyer's agent represented you in a purchase, not a sale. The skills and knowledge for listing representation are different. More importantly, if the same agent now represents you as a seller, they need to know the GTA seller's market — not just buyers. Evaluate on selling track record, not on prior purchasing relationship.</p>

<h3>Does it matter whether the agent works for a large or small brokerage?</h3>
<p>Less than most sellers assume. MLS access is equal across all registered TRREB members, regardless of brokerage size. Large brokerages have broader agent networks for internal promotion; boutique brokerages sometimes offer more individualized attention. Evaluate the agent, not the brand name on their business card.</p>

<h3>Is it worth hiring a Realtor who specializes in my property type (condo vs. detached)?</h3>
<p>Yes, particularly for condos. Condo sales involve status certificate review, building-specific buyer concerns (reserve funds, special assessments, rules), and a buyer pool that differs from freehold buyers. A condo specialist who knows specific buildings, their reputations, and what buyers ask about will serve you better than a generalist agent unfamiliar with condo-specific considerations.</p>

<h3>What is RECO and should I check if my agent is registered?</h3>
<p>RECO (Real Estate Council of Ontario) is the regulatory body that licences and oversees Ontario real estate agents and brokerages. Before signing with any agent, verify their registration at RECO's public registry at reco.on.ca. An unregistered person providing real estate services is committing an offence under REBBA, and any commission paid to them is not legally protected.</p>`,
  },
  {
    title: 'How Many Realtors Should I Interview Before Listing My Home?',
    slug: 'how-many-realtors-should-i-interview-before-listing',
    summary: 'Interview at least three listing agents before choosing one. Two interviews give you a comparison; three reveal whether the outlier is the anomaly or the norm — and protect you from making an expensive decision without a reference point.',
    metaDescription: 'How many Realtors should you interview before listing in Ontario? At least three. Why three works, what to compare, and how to run each interview effectively.',
    body: `<!-- Primary keyword: how many Realtors to interview before listing | Intent: informational | Word count target: 1500 -->

<p>Most sellers interview one or two agents before listing. Most sellers also have no meaningful basis for comparison when they make that choice. Interviewing three listing agents before signing a listing agreement is the minimum number that gives you genuine information — on pricing range, marketing approach, commission, and personality fit. One agent gives you a data point. Two agents give you a comparison. Three agents tell you whether the outlier is wrong or whether the other two are.</p>

<h2>Why One Interview Is Always Too Few</h2>

<p>If you interview one agent, you have no way to evaluate whether their recommended list price is accurate, their commission is competitive, or their marketing plan is strong. You're accepting their self-assessment with no external reference. You might get lucky and choose correctly — or you might sign with the first agent who seemed confident and articulate, regardless of their actual track record.</p>

<h2>Why Two Is Better But Still Inadequate</h2>

<p>Two interviews give you a comparison — you can see if the recommended prices are similar or divergent, compare commission rates, and assess which agent's marketing plan is more detailed. But with only two data points, you can't tell which one is right when they disagree. If one agent recommends $950,000 and the other recommends $1,050,000, you have no way to evaluate which is accurate without a third reference point.</p>

<h2>Why Three Is the Right Number</h2>

<p>Three interviews reveal the pattern. If two agents recommend $950,000–$980,000 and one recommends $1,150,000, the outlier is almost certainly inflating their number to win the listing. If two recommend similar marketing plans with professional photography, staging consultation, and active open houses, and one offers a basic MLS listing, the third is revealing their service level. Three comparisons let you make a genuinely informed decision rather than a binary guess.</p>

<h2>Who to Include in Your Three Interviews</h2>

<p>Don't interview three agents from the same office — you'll likely get similar approaches and pricing since they have access to the same MLS data and internal CMA tools. Include:</p>

<ul>
  <li>An agent recommended by someone who sold a similar home recently in your neighbourhood</li>
  <li>An agent with visible market presence in your area (yard signs, neighbourhood flyers, listed homes you've walked by)</li>
  <li>An agent you've found through research — Realtor.ca sold history, Google reviews, TRREB data if accessible</li>
</ul>

<h2>What to Compare Across Interviews</h2>

<p>Use the same questions with every agent so you're comparing apples to apples. Key comparison points:</p>

<table>
  <thead>
    <tr><th>Category</th><th>What to compare</th></tr>
  </thead>
  <tbody>
    <tr><td>Recommended list price</td><td>Range and rationale — do their comps support the number?</td></tr>
    <tr><td>Local sales track record</td><td>Number of sales in your neighbourhood in 12 months, list-to-sale ratios</td></tr>
    <tr><td>Marketing plan</td><td>Photography, staging, open houses, digital promotion specifics</td></tr>
    <tr><td>Commission</td><td>Total rate, co-operating commission offered, what's included</td></tr>
    <tr><td>Communication approach</td><td>How often, what format, who contacts you day-to-day</td></tr>
    <tr><td>Personality/trust</td><td>Do you believe what they're telling you? Are they listening or just presenting?</td></tr>
  </tbody>
</table>

<h2>The "Buying the Listing" Warning</h2>

<p>The most common manipulation in agent selection is recommending an inflated list price to win the listing. Every agent knows sellers are emotionally attached to their home and want to believe it's worth the maximum. An agent who quotes $150,000 above the other two is not necessarily more skilled — they may simply be more willing to tell you what you want to hear. After the listing stalls (few showings, no offers), they'll recommend a price reduction. You've lost weeks on market and buyer momentum. The agent still gets their commission.</p>

<p>The protection: evaluate each agent's CMA on the quality of the comparables they've chosen, not just the number they've produced. Ask for the sold addresses supporting their price. Look up those sales yourself on Realtor.ca. See our guide on <a href="/blog/what-is-the-best-listing-price-strategy">listing price strategy</a> to understand how accurate pricing works.</p>

<h2>FAQ</h2>

<h3>Can I interview more than three agents?</h3>
<p>Yes, but the return diminishes quickly after three or four. More interviews take more of your time and the incremental information decreases. If you feel strongly after three, trust your evaluation. If you remain uncertain, interview a fourth — but five or more interviews often signals indecision rather than thoroughness.</p>

<h3>How long should each interview take?</h3>
<p>Plan 45–60 minutes per agent. Less than 45 minutes doesn't allow enough time to review their CMA, marketing plan, and commission structure in detail. An agent who rushes through the meeting or is clearly using a template presentation without customization to your specific property is showing you how they'll approach your listing.</p>

<h3>Should I tell each agent that I'm interviewing others?</h3>
<p>Yes, and be straightforward about it. Telling an agent you're interviewing two or three others is professional and lets them understand they're being evaluated competitively. Most agents expect this and will put their best presentation forward. It also signals that you're a serious seller who has done their research.</p>

<h3>What if all three agents recommend very different prices?</h3>
<p>A wide spread — say, $850,000 to $1,100,000 for the same property — indicates someone is very wrong. Examine each agent's comparables. The agent with the most similar, most recent sold properties close to yours is likely closest to accurate. If you still can't determine which is right, consider paying for an independent appraisal ($500–$700 from a Certified Residential Appraiser) to get a neutral second opinion.</p>

<h3>Can I interview agents without committing to list immediately?</h3>
<p>Yes. There's no obligation to list after an agent interview. Agents present listing proposals without payment and without a commitment from you. You're evaluating them as much as they're pitching you. Do not sign a listing agreement during the first meeting unless you've already done your research and are fully ready to commit — take time to compare the proposals from all three agents before deciding.</p>`,
  },
  {
    title: 'What Should Be Included in a Listing Presentation?',
    slug: 'what-should-be-included-in-a-listing-presentation',
    summary: 'A strong listing presentation includes a data-backed CMA, a specific marketing plan, recent local sold examples, a clear commission structure, and the agent\'s track record — not just a glossy package and optimistic price.',
    metaDescription: 'What should a listing presentation include in Ontario? What to expect from agents, what makes a strong vs. weak presentation, and how to evaluate what you\'re seeing.',
    body: `<!-- Primary keyword: what should be included in a listing presentation | Intent: informational | Word count target: 1600 -->

<p>A listing presentation is the formal pitch an agent makes to earn your business as a seller. Most agents prepare a package — printed or digital — that covers their credentials, market analysis, marketing plan, and recommended list price. But not all listing presentations are equal, and knowing what to look for (and what to be skeptical of) helps you evaluate agents on substance rather than presentation quality.</p>

<h2>What a Strong Listing Presentation Includes</h2>

<h3>1. A Credible Comparative Market Analysis (CMA)</h3>

<p>The CMA is the backbone of the listing presentation. It should contain 3–5 specific comparable sold properties from the last 3–6 months — addresses, sold prices, days on market, and relevant features. Strong CMAs make explicit adjustments for differences between the comps and your property (better kitchen = +$X, smaller lot = -$X). The resulting price range should be defensible based on the data, not just asserted as a number.</p>

<p>A weak CMA includes comps from 12+ months ago, uses properties with substantially different characteristics without adjustment, or cites "market strength" without specific data. You can verify any CMA by looking up the comp addresses on Realtor.ca's sold history.</p>

<h3>2. A Specific Marketing Plan</h3>

<p>The marketing plan should name specific actions, not vague promises. What you want to see:</p>

<ul>
  <li>Professional photography — who (a specific photographer or firm), when, how many photos</li>
  <li>Staging — consultation included? Full staging for vacant properties?</li>
  <li>Open houses — how many, what schedule, will the listing agent be present or a team member?</li>
  <li>Digital promotion — which platforms, paid advertising budget, virtual tour</li>
  <li>Agent network outreach — how will cooperating agents be notified of the listing?</li>
  <li>Signage — yard sign, directional signs</li>
</ul>

<p>"I'll list it on MLS and market it aggressively" is not a marketing plan. If the agent can't describe specific actions, they don't have a plan.</p>

<h3>3. The Agent's Recent Local Track Record</h3>

<p>The presentation should include the agent's recent sales in your neighbourhood or price range — with addresses, list prices, sold prices, and days on market. This tells you: do they work in your market regularly? What are their list-to-sale ratios? How do their days on market compare to area averages?</p>

<p>An agent who brings no local sold evidence to the presentation either lacks local activity or is hoping you won't ask. Both are problems.</p>

<h3>4. Commission Structure, Clearly Stated</h3>

<p>The presentation should state the total commission, how it's split between listing and buyer's brokerages, and what's included. It should not require you to ask. Transparency about commission is a professional standard, not a negotiating weakness. See our guide on <a href="/blog/how-does-real-estate-commission-work-when-selling">how real estate commission works</a>.</p>

<h3>5. Listing Agreement Terms Explained</h3>

<p>The agent should walk through the key terms of the listing agreement: the listing period (typically 60–90 days), holdover clause length, what happens if you want to cancel, and how offers will be presented and communicated to you.</p>

<h3>6. A Pricing Strategy Discussion</h3>

<p>Beyond the CMA, the agent should explain their recommended pricing approach — whether they recommend listing at market value, slightly below to generate competition, or another strategy, and why that approach fits current market conditions. This conversation reveals whether they understand the current market or are simply presenting a generic recommendation. See our guide on <a href="/blog/what-is-the-best-listing-price-strategy">listing price strategy in the GTA</a>.</p>

<h2>Red Flags in a Listing Presentation</h2>

<ul>
  <li><strong>No CMA or a vague one:</strong> The agent hasn't prepared or doesn't know the market</li>
  <li><strong>Unusually high recommended price with thin supporting data:</strong> Classic "buying the listing"</li>
  <li><strong>Pressure to sign the listing agreement at the first meeting:</strong> A professional agent gives you time to compare</li>
  <li><strong>Generic marketing boilerplate:</strong> "Extensive social media marketing" without specifics is meaningless</li>
  <li><strong>Testimonials but no sold data:</strong> Happy clients are nice; verifiable sales track record is what matters</li>
</ul>

<h2>What to Do After the Presentation</h2>

<p>Don't sign at the meeting. Take the CMA, verify the comparable sales, compare presentations across at least three agents, and make your decision with full information. The right agent will respect your process — a high-pressure closer is showing you something about their negotiating style, and it's not flattering.</p>

<p>See our guide on <a href="/blog/what-should-i-ask-a-listing-agent">what to ask a listing agent</a> for the specific questions to bring to each presentation.</p>

<h2>FAQ</h2>

<h3>How long should a listing presentation take?</h3>
<p>A thorough listing presentation takes 45–90 minutes. Less than 45 minutes suggests the agent hasn't customized their materials to your property or isn't covering the full scope. More than 90 minutes without covering substance may indicate an agent who talks past the point. Time isn't the metric — whether the CMA, marketing plan, and track record are presented in detail is.</p>

<h3>Should agents bring printed materials or is digital sufficient?</h3>
<p>Either format is acceptable. The content matters more than the medium. Some agents present on iPad or laptop, others bring printed packages. What matters: is the CMA data clearly legible? Can you take the materials home to review? A well-designed digital presentation is as credible as a printed one.</p>

<h3>Is it a red flag if an agent doesn't bring a listing presentation at all?</h3>
<p>Yes. An agent who shows up to a listing interview without prepared materials — a CMA, a marketing plan, their sales history — has either not prepared or doesn't understand what the meeting is for. Either way, it's a signal of how they'll approach your listing.</p>

<h3>Can I ask for a listing presentation before deciding to interview an agent?</h3>
<p>Yes. You can request that any agent you're considering prepare a full listing presentation before meeting. This sets expectations for the meeting and lets you pre-filter agents who aren't prepared to do the work. Most serious listing agents expect to prepare materials for interviews — those who push back on doing so may not be worth meeting.</p>

<h3>Should the listing presentation include a net proceeds estimate?</h3>
<p>Yes — a strong presentation includes an estimated net proceeds calculation: sale price minus commission, legal fees, mortgage discharge, and adjustments. This gives you a realistic picture of what you'll walk away with. An agent who only shows you the gross price without accounting for selling costs is leaving you to calculate the key number yourself.</p>`,
  },
  {
    title: 'How Long Should I List My Home For in Ontario?',
    slug: 'how-long-should-i-list-my-home-for',
    summary: 'Most GTA homes list for 60–90 days. The right listing period depends on market conditions, your timeline, and your pricing strategy — shorter terms create urgency, longer terms reduce pressure to re-evaluate mid-listing.',
    metaDescription: 'How long should you list your home for in Ontario? Standard MLS listing periods, when to use shorter or longer terms, and how listing duration affects your negotiating position.',
    body: `<!-- Primary keyword: how long to list a home in Ontario | Intent: informational | Word count target: 1500 -->

<p>The listing period — the length of time your listing agreement authorizes your agent to market and sell your home — is a negotiable term in your listing contract. Most GTA homes list for 60–90 days. But the right term depends on your goals, market conditions, and pricing strategy. Understanding what the listing period means for your negotiating leverage, when you can extend or cancel, and how the holdover clause extends your commitment beyond the stated term helps you choose a listing period that fits your situation.</p>

<h2>Standard Listing Periods in the GTA</h2>

<p>The most common MLS listing terms in the GTA are:</p>

<ul>
  <li><strong>30 days:</strong> Aggressive, typically used for highly desirable properties in seller's markets or for sellers with urgent timelines. Creates urgency but limits the agent's ability to adapt if market response is weaker than expected.</li>
  <li><strong>60 days:</strong> The most common term for active GTA residential listings. Provides enough runway to generate buyer interest without over-committing to an unproductive listing.</li>
  <li><strong>90 days:</strong> Appropriate for higher-price properties, unique homes with a narrower buyer pool, or sellers who want time to complete pre-sale work. Also common for listings entering a slower seasonal period.</li>
  <li><strong>120–180 days:</strong> Less common; used for estate sales, commercial properties, or unusual properties that need extended market exposure to find the right buyer.</li>
</ul>

<h2>Shorter Listing Terms: Benefits and Risks</h2>

<p>A shorter listing period (30 days) creates a sense of urgency for buyers — fewer days on market in a compressed window can generate competition. If your agent is recommending a hold-back strategy (below-market pricing to attract multiple offers on offer night), a 30–45 day listing may be appropriate.</p>

<p>The risk: if market response is weaker than expected, a 30-day listing expires before you've had time to evaluate and adjust. You then must re-list (resetting the "new listing" clock but also potentially flagging to buyers that the first listing didn't produce a sale).</p>

<h2>Longer Listing Terms: Benefits and Risks</h2>

<p>A longer term gives you and your agent time to respond to market feedback — showing counts, buyer comments, competing listings — and adjust strategy without the pressure of an expiring listing. For unique properties, longer terms are often necessary to find the right buyer. For properties with complex disclosure situations (outstanding permits, estate sales), extra time for buyers to conduct due diligence is an advantage.</p>

<p>The risk: a listing that sits for 60+ days without sale accumulates "days on market" (DOM) that buyer's agents and active buyers track. High DOM signals to buyers that something may be wrong — incorrect pricing, undisclosed issues, or a difficult seller. DOM visibility can reduce the effectiveness of a listing if it runs long without adaptation.</p>

<h2>The Holdover Clause</h2>

<p>Every listing agreement in Ontario includes a holdover clause — typically 60–90 days beyond the listing expiry date. If a buyer who was introduced to your property during the listing period (showed it, received information about it through the listing) purchases it within the holdover period after the listing expires, commission is still owed to your listing brokerage.</p>

<p>This means your effective commitment is the listing period plus the holdover period. A 60-day listing with a 90-day holdover clause ties up your ability to sell privately (without owing commission) for 150 days from listing. Understand this before signing — and confirm the holdover duration in your listing agreement.</p>

<h2>When to Re-List vs. Extend</h2>

<p>If your listing expires without a sale, you have two options: extend with the same agent or re-list (same agent or new agent). Extension is simpler administratively but often involves revisiting the listing price. Re-listing with a new agent starts a fresh listing with a new MLS number and resets DOM — which can make the property appear newly listed to buyers who track market activity. This requires cancelling the existing agreement (with the listing agent's cooperation) and addressing any holdover implications.</p>

<p>See our guide on <a href="/blog/what-happens-if-my-house-does-not-sell">what to do if your house doesn't sell</a> for a complete approach to the expired listing situation.</p>

<h2>FAQ</h2>

<h3>Can I cancel my listing agreement before it expires?</h3>
<p>With your listing agent's cooperation, yes. Most listing agreements include a mutual release clause that allows cancellation if both parties agree. Unilateral cancellation — walking away without the agent's agreement — is more complex and may not eliminate commission liability if a sale occurs during the holdover period. Review your specific agreement with a real estate lawyer before cancelling.</p>

<h3>What happens to days on market if I re-list?</h3>
<p>Re-listing with a new MLS number resets the DOM counter visible to buyers searching portals like Realtor.ca. However, buyer's agents using full MLS access can often see property history including previous listings — so "resetting" is only a partial benefit. The original listing's history doesn't disappear from sophisticated buyers' view.</p>

<h3>Is there a minimum listing period in Ontario?</h3>
<p>No minimum is set by law. However, TRREB MLS rules require a minimum listing term to be eligible for MLS submission. Most boards require at least 30 days. Some brokerages set their own minimums. Your agent will advise on the minimum available through their brokerage and board.</p>

<h3>Should I list for a longer period in a buyer's market?</h3>
<p>Generally yes. In a buyer's market, properties take longer to sell — average days on market increase when inventory is high relative to buyer demand. A 90-day listing avoids the pressure of a stale-looking listing that has to re-list, and gives you time to respond to feedback and adjust price or presentation without losing the listing's momentum entirely.</p>

<h3>What if I find a buyer myself during the listing period?</h3>
<p>If the buyer you find was introduced to your property through your listing (saw it on MLS, attended an open house, received information through your agent), commission is still owed under the holdover clause. If you find a genuinely independent buyer — someone with no connection to the listing — the situation depends on your specific listing agreement's terms. Review the agreement with your lawyer before proceeding with any privately sourced buyer during the listing period.</p>`,
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
