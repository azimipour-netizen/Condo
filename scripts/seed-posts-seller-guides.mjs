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
    title: 'What Happens After You Accept an Offer on Your Home?',
    slug: 'what-happens-after-accepting-an-offer',
    summary: 'After accepting an offer in Ontario, the Agreement of Purchase and Sale becomes legally binding and a sequence of defined steps begins — from condition periods to closing day.',
    metaDescription: 'What happens after you accept an offer to sell your home in Ontario? A step-by-step guide from APS signing through closing day, for GTA sellers.',
    body: `<!-- Primary keyword: what happens after accepting an offer | Intent: informational | Word count target: 1900 -->

<p>Accepting an offer on your home is a significant moment — but it's also the beginning of a process, not the end of one. Once you sign the Agreement of Purchase and Sale (APS), a legally binding contract exists between you and the buyer. Understanding what comes next, and what your obligations are as a seller during this period, helps you avoid costly mistakes before the deal closes. Here's a step-by-step breakdown of what happens after you accept an offer in Ontario.</p>

<h2>The Agreement of Purchase and Sale Is Now a Legal Contract</h2>

<p>When you accept an offer — meaning you sign the APS without counter-offering — you've entered into a binding legal agreement under Ontario contract law. The APS specifies the purchase price, deposit amount and deadline, closing date, included chattels and excluded fixtures, and any conditions the buyer has included. Both parties are now bound by its terms. Your listing agent keeps a copy; your real estate lawyer should receive one immediately.</p>

<p>Contact your lawyer as soon as an offer is accepted. Your lawyer begins reviewing title, preparing the transfer documents, and arranging mortgage discharge if you carry one. In Ontario, every real estate transaction requires independent legal representation — do not wait until a week before closing to engage your lawyer.</p>

<h2>Conditional vs. Firm Offers: What Changes</h2>

<p>If the buyer submitted a conditional offer — the most common scenario in the GTA — the APS contains conditions that must be satisfied or waived within specified timeframes before the deal becomes firm:</p>

<ul>
  <li><strong>Financing condition:</strong> The buyer typically has 5 business days to confirm mortgage approval. You must allow the lender's appraiser access to your home during this period.</li>
  <li><strong>Home inspection condition:</strong> Usually 3–5 business days. You must provide reasonable access to the inspector. You cannot interfere with or obstruct the inspection.</li>
  <li><strong>Status certificate condition (condos only):</strong> The buyer's lawyer reviews the condo corporation's financials, reserve fund, and rules. Typically 10 business days after receipt of the status certificate.</li>
</ul>

<p>During the condition period, you cannot accept another offer unless the buyer waives their conditions or the APS terminates. A conditional deal is not firm — either party may have an exit if conditions aren't satisfied. Once the buyer fulfills or waives all conditions and delivers a Notice of Fulfillment of Conditions, the deal becomes firm and binding.</p>

<p>If the buyer submitted a <a href="/blog/what-is-a-firm-offer">firm offer</a> (no conditions), the deal is already binding from the moment of acceptance. The buyer typically has 24 hours to deliver the deposit.</p>

<h2>The Deposit</h2>

<p>The APS specifies when the buyer's deposit is due — typically within 24 hours of offer acceptance for firm deals, or within 24 hours of the deal going firm for conditional offers. The deposit (commonly 5% of the purchase price in the GTA) is held in the listing brokerage's trust account until closing. It's not yours until closing — but if the buyer defaults after the deal goes firm, you may be entitled to keep it as compensation for damages.</p>

<h2>Your Obligations as a Seller Until Closing</h2>

<p>Once the APS is signed, you have specific obligations that run until closing day:</p>

<ul>
  <li><strong>Maintain the property:</strong> You must deliver the property in substantially the same condition as when the buyer viewed it. Damage that occurs between acceptance and closing — a roof leak, a flooded basement — must be disclosed and may need to be repaired before closing.</li>
  <li><strong>Keep utilities active:</strong> Don't cancel utilities or change services before closing. The buyer is entitled to verify the property functions as represented.</li>
  <li><strong>Provide access for inspections and appraisals:</strong> Lenders typically send an appraiser. You must provide reasonable access.</li>
  <li><strong>Not re-list or market the property:</strong> Once under firm contract, the property is off-market. Any sale to a third party during this period would constitute breach of contract.</li>
  <li><strong>Complete agreed-upon work:</strong> If the APS required you to complete specific repairs or remove specific items before closing, do it.</li>
</ul>

<h2>What Your Lawyer Does After Acceptance</h2>

<p>Your real estate lawyer begins a defined set of tasks once the APS is in hand. They conduct a title search to identify any encumbrances, liens, or defects on title that need to be resolved before closing. They calculate the mortgage discharge amount from your lender (the exact amount you owe to fully pay out your mortgage) and arrange for the discharge to register on closing day. They prepare the Transfer/Deed of Land (the document that conveys ownership to the buyer), Statement of Adjustments (which allocates property taxes, utilities, and other costs prorated to the closing date), and Direction re Funds (which specifies where the sale proceeds go — first to pay out your mortgage, then to you).</p>

<h2>Pre-Closing Buyer Walkthrough</h2>

<p>The APS typically gives the buyer the right to conduct a pre-closing walkthrough — usually 24–48 hours before closing — to verify the property is in the agreed condition, included chattels are present, and no new damage has occurred. If the buyer finds issues at this stage, they may raise them with their lawyer before the closing proceeds. Common problems: a seller has taken fixtures that were supposed to stay (light fixtures, built-in appliances), or damage has occurred since the offer was accepted.</p>

<h2>Closing Day</h2>

<p>On the closing date, your lawyer and the buyer's lawyer exchange documents and funds electronically. Your lawyer receives the purchase price funds, pays out your mortgage balance to discharge it, deducts their fees and any outstanding property tax or adjustments, and remits the net proceeds to you. The Transfer/Deed registers in the buyer's name in the Ontario land registry system. Once registration is complete, the deal is closed. You hand over the keys — typically through the real estate agents or directly — and the buyer takes possession at the time specified in the APS.</p>

<p>The entire process from accepted offer to closing typically runs 30–90 days, though APS terms vary. Understanding the <a href="/blog/what-documents-do-i-need-to-sell-my-home">documents required to sell your home</a> and <a href="/blog/what-should-i-disclose-when-selling-a-house">what you must disclose as a seller</a> helps you avoid problems before they reach this stage.</p>

<p>Ready to list? <a href="/homes-for-sale/toronto">Browse what's active in your area on Condohill</a> and understand your market before you list.</p>

<h2>FAQ</h2>

<h3>Can I back out after accepting an offer in Ontario?</h3>
<p>Not without consequences. Once an APS is signed by both parties, it's a binding legal contract. Backing out without legal justification exposes you to the buyer's claim for damages, which can include the cost of alternative housing, carrying costs, and legal fees. If the deal hasn't gone firm yet (buyer still in condition period), the buyer can exit — but the seller generally cannot. Consult your lawyer immediately if you're considering this path.</p>

<h3>What if the buyer's financing falls through?</h3>
<p>If the deal is still conditional on financing and the buyer cannot secure a mortgage, they notify you before the condition deadline, the deal terminates, and the deposit is returned. Once the deal has gone firm — the buyer has waived the financing condition — a financing failure does not give the buyer an automatic right to exit. The deal is binding. If they walk, you may retain the deposit and pursue additional damages.</p>

<h3>Can I accept another offer while under a conditional agreement?</h3>
<p>You can use an Offer Schedule B (commonly called a "bump clause" or escape clause) to continue marketing during a condition period. If a better offer comes in, you notify the first buyer and give them 24–48 hours to firm up their deal. Without this clause in the original APS, you generally cannot accept another offer during the condition period.</p>

<h3>How long is the typical closing period in Ontario?</h3>
<p>Most residential closings in the GTA run 30–90 days from accepted offer to closing. First-time buyers sometimes need longer to arrange financing. If you need a specific closing timeline — for coordinating a purchase of your next home, for example — negotiate this in the APS before signing. Closing date changes after signing require mutual written agreement.</p>

<h3>What happens to my mortgage when I sell?</h3>
<p>Your existing mortgage is discharged on closing day. Your lawyer requests a mortgage payout statement from your lender showing the exact amount required to close the mortgage, including any prepayment penalties. This amount is deducted from the sale proceeds at closing before you receive your net funds. Prepayment penalties vary significantly by lender and mortgage type — contact your lender early in the selling process to understand what you'll owe.</p>`,
  },
  {
    title: 'What Documents Do I Need to Sell My Home in Ontario?',
    slug: 'what-documents-do-i-need-to-sell-my-home',
    summary: 'Selling a home in Ontario requires government ID, title documents, permits, disclosure forms, and your lawyer\'s assistance to prepare the Transfer/Deed — here\'s the complete list.',
    metaDescription: 'What documents do you need to sell a home in Ontario? The complete seller document checklist — from ID and permits to condo status certificates and discharge paperwork.',
    body: `<!-- Primary keyword: documents needed to sell my home | Intent: informational | Word count target: 1800 -->

<p>Selling a home in Ontario requires gathering a specific set of documents before listing, during the offer process, and at closing. Missing documents can delay a sale, create disclosure problems, or derail a deal at the worst possible time. Knowing what documents you need to sell your home — and when each is required — lets you prepare properly and avoid last-minute scrambles. Here's the complete seller document checklist for Ontario.</p>

<h2>Documents Needed Before You List</h2>

<p><strong>Government-issued photo ID:</strong> Your real estate agent and lawyer both require valid government-issued photo identification — a passport or driver's licence — as part of FINTRAC (anti-money laundering) compliance requirements. Both spouses or co-owners must provide ID.</p>

<p><strong>Property survey:</strong> An existing survey showing the lot boundaries, structures, and easements is valuable but not mandatory. If you have one from when you purchased, provide it to your agent and lawyer. Buyers and their lenders often prefer a current survey. If you don't have one, buyers typically purchase title insurance instead. Surveys are expensive ($1,500–$3,000+) to obtain new — don't commission one unless your lawyer advises it.</p>

<p><strong>Previous home inspection reports:</strong> If you had an inspection done before listing (a pre-listing inspection), provide it to potential buyers. Ontario disclosure rules require that you not selectively withhold material information. Hiding an inspection report that reveals defects while marketing the home can create legal liability.</p>

<p><strong>Permits and completion certificates:</strong> Gather all building permits for work done on the property — basement renovations, additions, deck construction, HVAC replacements, electrical panel upgrades. You need both the original permit and the final inspection certificate (sometimes called a "close permit" or "completion certificate"). Permits without final inspections are <strong>open permits</strong> — a serious issue that must be disclosed and typically resolved before closing. See our guide on <a href="/blog/can-i-sell-a-home-with-an-outstanding-permit">selling with an outstanding permit</a>.</p>

<p><strong>WETT certificate:</strong> If your home has a wood-burning fireplace, wood stove, or pellet stove, most buyers request a Wood Energy Technology Transfer (WETT) inspection and certificate. This isn't legally required for listing, but buyers frequently make it a condition. Having one ready speeds up the conditional period.</p>

<p><strong>Utility bills:</strong> Recent hydro, gas, and water bills help buyers understand operating costs. Your agent may request 12 months of utility history for marketing purposes.</p>

<h2>Disclosure Documents</h2>

<p><strong>Seller Property Information Statement (SPIS):</strong> The SPIS is an OREA standard form where you disclose known conditions, defects, and facts about the property. It's technically voluntary — you're not legally required to complete one. However, if you do complete a SPIS, every answer must be truthful and complete. A false statement on a SPIS creates serious legal exposure. Many sellers choose not to complete a SPIS on the advice of their lawyer. Regardless of whether you complete a SPIS, you remain legally obligated to disclose <a href="/blog/what-is-a-material-latent-defect">material latent defects</a>.</p>

<p><strong>Environmental disclosures:</strong> If you're aware of any environmental issues — underground oil tank, soil contamination, asbestos — these must be disclosed. Prior insurance claims may also be relevant to disclose.</p>

<h2>Condo-Specific Documents</h2>

<p>If you're selling a condo, the condo corporation's status certificate package is essential. Your real estate lawyer or the listing brokerage typically orders it from the condo corporation. The status certificate costs up to $100 (the corporation has 10 days to provide it) and includes the corporation's financial statements, reserve fund study, meeting minutes, current budget, rules and bylaws, any outstanding special assessments, and the declaration. Buyers have a standard condition period (usually 10 business days after receipt) to review it. You cannot avoid providing this — buyers are entitled to it under the <em>Condominium Act, 1998</em>.</p>

<p>Also collect: the parking and locker ownership documents (if your parking and locker are owned vs. exclusive use), the original condo declaration and rules you received when you purchased, and any special assessment notices you've received.</p>

<h2>Documents Your Lawyer Prepares for Closing</h2>

<p>Your real estate lawyer handles most closing documents, but needs input from you to do so:</p>

<ul>
  <li><strong>Mortgage information:</strong> Provide your lender name, mortgage account number, and contact details so your lawyer can obtain the discharge statement and payout amount.</li>
  <li><strong>Existing liens or judgments:</strong> If any judgments, liens, or encumbrances exist against you personally or the property, disclose them to your lawyer immediately. These affect title and must be resolved at closing.</li>
  <li><strong>Marriage certificate / divorce order:</strong> If the property is a matrimonial home and you're divorced or separated, your lawyer needs the divorce order or separation agreement to confirm disposition rights. In Ontario, both spouses must consent to sell a matrimonial home regardless of whose name is on title.</li>
</ul>

<h2>Real Estate Transaction Documents</h2>

<p>During the transaction itself, your agent and lawyer handle preparation of:</p>

<table>
  <thead>
    <tr>
      <th>Document</th>
      <th>Who prepares it</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Listing Agreement (OREA Form 200)</td>
      <td>Your real estate agent</td>
      <td>Authorizes agent to list and market property</td>
    </tr>
    <tr>
      <td>Agreement of Purchase and Sale</td>
      <td>Buyer's agent (seller reviews and signs)</td>
      <td>The binding purchase contract</td>
    </tr>
    <tr>
      <td>Transfer/Deed of Land</td>
      <td>Your lawyer</td>
      <td>Transfers ownership to buyer on closing</td>
    </tr>
    <tr>
      <td>Statement of Adjustments</td>
      <td>Your lawyer</td>
      <td>Prorates property tax, utilities to closing date</td>
    </tr>
    <tr>
      <td>Direction re Funds</td>
      <td>Your lawyer</td>
      <td>Instructs how sale proceeds are disbursed</td>
    </tr>
    <tr>
      <td>Mortgage Discharge</td>
      <td>Your lender (via your lawyer)</td>
      <td>Removes mortgage from title on closing</td>
    </tr>
  </tbody>
</table>

<h2>What Sellers Often Forget</h2>

<p>A common problem we see: sellers can't locate the original survey, permit records, or WETT certificate. These are usually in the package of documents you received when you purchased the home. If you've lost them, some municipalities provide permit history online (Toronto's building permit records are searchable at <a href="https://www.toronto.ca/city-government/accountability-operations-customer-service/access-city-information-or-records/access-request-for-city-information/building-inspection-records/" target="_blank" rel="noopener noreferrer">toronto.ca</a>). Your title insurer may also have survey information. Consult your real estate lawyer early — they'll tell you which documents matter most for your specific property.</p>

<p>Understanding <a href="/blog/what-should-i-disclose-when-selling-a-house">what you must disclose when selling</a> is equally important. Documents establish facts; disclosure obligations determine what you're legally required to tell buyers about those facts.</p>

<h2>FAQ</h2>

<h3>Do I have to fill out the Seller Property Information Statement?</h3>
<p>No. The SPIS is voluntary in Ontario. Many sellers, on their lawyer's advice, choose not to complete it. However, not completing a SPIS does not eliminate your disclosure obligations — you are always legally required to disclose material latent defects. The risk with completing a SPIS is that errors or omissions on it can create additional legal liability beyond what exists at common law.</p>

<h3>What happens if I can't find the permits for my basement renovation?</h3>
<p>Most municipalities, including Toronto, maintain digital or microfiche permit records going back decades. Your lawyer or agent can help you search. If no permit was pulled and work was done, this is a disclosure issue — buyers must know the basement work was done without permits. An open or missing permit affects title insurance and can complicate a buyer's financing. See our guide on <a href="/blog/can-i-sell-a-home-with-an-outstanding-permit">selling with outstanding permits</a>.</p>

<h3>Do I need a survey to sell my home in Ontario?</h3>
<p>No. Most Ontario home sales proceed without a current survey — buyers obtain title insurance instead (which lenders require anyway). If you have an existing survey, provide it. If you don't, don't commission a new one unless your lawyer advises otherwise. Title insurance is standard practice and generally adequate for both buyers and lenders.</p>

<h3>Do both spouses have to sign the listing agreement?</h3>
<p>Yes, if the property is a matrimonial home under the Family Law Act (the home you ordinarily occupy as your family residence). Both spouses must consent to sell a matrimonial home even if only one spouse's name is on title. This applies regardless of marital status — separated spouses retain matrimonial home rights until divorce is finalized or a court order or agreement removes them.</p>

<h3>How far in advance should I engage my lawyer before listing?</h3>
<p>Ideally 2–4 weeks before listing. This gives your lawyer time to review title, identify any issues (outstanding liens, encroachments, open permits) that need resolution before buyers see the property, and advise you on disclosure. Many sellers only call their lawyer after an offer is accepted — this is too late to catch title problems that should have been addressed before marketing.</p>`,
  },
  {
    title: 'What Should I Disclose When Selling a House in Ontario?',
    slug: 'what-should-i-disclose-when-selling-a-house',
    summary: 'Ontario sellers are legally required to disclose material latent defects — hidden problems that make a home unsafe, unfit, or illegal — regardless of any "as is" clause.',
    metaDescription: 'What must you disclose when selling a house in Ontario? Material latent defects, flooding, pests, illegal units — what the law requires and what it doesn\'t.',
    body: `<!-- Primary keyword: what to disclose when selling a house Ontario | Intent: informational | Word count target: 1900 -->

<p>When selling a house in Ontario, you have legal obligations about what you must tell buyers — and those obligations are more specific than most sellers realize. The general principle of <em>caveat emptor</em> (buyer beware) still applies to obvious, visible conditions that a buyer could discover through reasonable inspection. But sellers are legally required to disclose <strong>material latent defects</strong> — hidden problems that make the home unsafe, unfit for habitation, or illegal. Failing to disclose when you're legally required to can result in the buyer rescinding the purchase, damages claims, and litigation. Here's what Ontario sellers must disclose, what they don't have to disclose, and how to navigate the grey areas.</p>

<h2>What You Are Legally Required to Disclose</h2>

<p>Ontario courts and RECO (Real Estate Council of Ontario) regulations distinguish between two types of defects:</p>

<p><strong>Patent defects</strong> are visible, discoverable conditions a buyer can observe or that a competent home inspector would find. A cracked driveway, dated kitchen finishes, worn carpets — these are patent. The buyer sees them; <em>caveat emptor</em> applies. You don't have a legal duty to point them out.</p>

<p><strong>Latent defects</strong> are hidden conditions not discoverable through a reasonable inspection. When a latent defect is <em>material</em> — meaning it makes the property dangerous to health or safety, structurally unsound, or illegal to use for residential purposes — Ontario law requires you to disclose it proactively, even if the buyer doesn't ask.</p>

<p>The test for whether a defect is material and must be disclosed is practical: would a reasonable buyer want to know this before purchasing? If yes, disclose it.</p>

<h2>Common Conditions That Must Be Disclosed</h2>

<p><strong>Foundation or structural problems:</strong> A crack in the foundation that allows water infiltration, a compromised load-bearing wall, or settlement that affects structural integrity — if you know about it, disclose it. Hiding it behind new drywall or paint does not eliminate your liability. In fact, concealing a known defect compounds the legal exposure.</p>

<p><strong>Water damage or flooding history:</strong> If the basement has flooded, the roof has leaked into the interior, or there's been water damage from any source — disclose when it occurred, the cause, and what remediation was done. "It was fixed" is not sufficient on its own — buyers and insurers want the history.</p>

<p><strong>Mould:</strong> Known mould, especially if resulting from a structural moisture problem, must be disclosed. This is a health and safety issue. If the mould is visible, it's arguably patent — but if you've covered it or it's in a hidden cavity, it's latent and requires disclosure.</p>

<p><strong>Pest infestations:</strong> A known active or past termite infestation, carpenter ant damage, or rodent infestation falls under the disclosure obligation if material. Disclosure includes what treatment was done and when.</p>

<p><strong>Illegal units:</strong> If your property contains an illegal basement apartment or secondary suite that doesn't comply with municipal zoning, Ontario Building Code, or fire codes, this must be disclosed. An illegal unit that makes the property non-compliant with occupancy requirements is a material latent defect. See our guide on <a href="/blog/can-i-sell-a-home-with-an-illegal-basement-apartment">selling with an illegal basement apartment</a>.</p>

<p><strong>Environmental hazards:</strong> If you know of asbestos-containing materials in the home, an underground oil tank, soil contamination, or other environmental hazards, disclose them. These are health and safety issues that clearly meet the material latent defect threshold.</p>

<p><strong>Open or failed permits:</strong> If work was done without a required permit, or a permit was pulled but never finalled (open permit), this is a disclosure issue. It affects the legality of the work and can impact the buyer's title insurance and financing. See our guide on <a href="/blog/can-i-sell-a-home-with-an-outstanding-permit">outstanding permits</a>.</p>

<h2>The "As Is" Clause Does Not Eliminate Disclosure</h2>

<p>A common misconception is that selling a property "as is" eliminates disclosure obligations. It does not — not in Ontario. An "as is" clause shifts responsibility for patent defects to the buyer (they accept the property in its current visible condition). It does not waive the seller's obligation to disclose <strong>known</strong> material latent defects. Selling "as is" while concealing a known material latent defect remains actionable misrepresentation. The clause protects against complaints about visible conditions, not against fraud or concealment.</p>

<h2>The Seller Property Information Statement (SPIS)</h2>

<p>The OREA Seller Property Information Statement is a voluntary disclosure form asking specific questions about the property — roof, basement, HVAC, pool, environmental issues, and more. Completing it is not mandatory, but if you complete it, every answer must be truthful and complete to the best of your knowledge. Leaving a question blank when you know the answer, or answering falsely, creates additional legal liability beyond the common law disclosure obligation.</p>

<p>Many Ontario sellers, advised by their lawyers, choose not to complete a SPIS — particularly for older homes with complex histories. Not completing a SPIS does not eliminate your disclosure obligation for material latent defects. The SPIS simply provides a structured format for disclosure; the underlying obligation exists regardless of the form.</p>

<h2>What You Don't Have to Disclose</h2>

<p>Ontario law does not require you to disclose:</p>

<ul>
  <li>Patent defects (visible conditions the buyer can observe or a reasonable inspector would find)</li>
  <li>The existence of a death on the property (unless it resulted in a physical condition affecting the property — e.g., mould from an undiscovered body that caused structural damage)</li>
  <li>That the property is stigmatized (prior criminal activity, suicide, or a notorious history not resulting in physical defect)</li>
  <li>The sale price you paid, or your motivation for selling</li>
  <li>Competing offers (in a multiple-offer situation, the existence of competing offers must be disclosed by the agent but the specifics — price, terms — are not)</li>
</ul>

<h2>The Practical Approach</h2>

<p>When in doubt, disclose. The cost of disclosure is low — at worst, a negotiated price reduction. The cost of non-disclosure, if it results in rescission or a damages claim, is far higher. Ontario courts have awarded significant damages to buyers who proved sellers concealed known defects.</p>

<p>Your real estate lawyer should review your disclosure position before you list. Bring any known issues to their attention — they can help you frame disclosure appropriately, including when professional remediation before listing is a better strategy than disclosing and pricing accordingly.</p>

<p>For a complete understanding of <a href="/blog/what-is-a-material-latent-defect">what constitutes a material latent defect</a> in Ontario, read our detailed guide.</p>

<h2>FAQ</h2>

<h3>If I disclose a defect, will it kill my sale?</h3>
<p>Not necessarily. Buyers expect older homes to have histories. A disclosed, remediated issue — with documentation of the repair — is far more manageable than a defect discovered during inspection or after closing. Many GTA sales proceed on properties with disclosed histories, with price adjustments that reflect the known condition. The alternative — a buyer discovering undisclosed defects after closing — creates far more damaging legal and financial exposure for you.</p>

<h3>What if I genuinely didn't know about a defect?</h3>
<p>The disclosure obligation is tied to knowledge — you must disclose what you <em>know</em>. If you were genuinely unaware of a defect (a hidden foundation crack you never saw), you cannot be held liable for non-disclosure of something you didn't know about. However, courts look at what a reasonable owner in your position would have known. If the defect was something an attentive owner would have noticed, the "I didn't know" defence weakens considerably.</p>

<h3>Can a buyer sue me after closing for something I didn't disclose?</h3>
<p>Yes. In Ontario, buyers can pursue claims for misrepresentation, fraudulent concealment, or breach of contract after closing if they discover a known material latent defect that wasn't disclosed. The limitation period under Ontario's Limitations Act is generally two years from when the buyer discovered (or ought to have discovered) the defect. Consult a real estate litigation lawyer if you receive a post-closing claim.</p>

<h3>Does my agent have disclosure obligations too?</h3>
<p>Yes. RECO's Code of Ethics requires real estate representatives to disclose material facts they know or ought to know about a property. An agent who knows of a defect and stays silent may face regulatory complaints to RECO or civil liability. You and your agent share disclosure obligations — they are not interchangeable or transferable.</p>

<h3>Does the number of years I've owned the home affect disclosure obligations?</h3>
<p>No. Disclosure obligations relate to what you currently know, not how long you've owned the property. A seller who purchased a week ago has the same disclosure obligations as one who owned for 30 years. If you inherited or recently purchased and have limited knowledge of the property's history, disclose that limited knowledge honestly — but still disclose anything you do know.</p>`,
  },
  {
    title: 'What Is a Material Latent Defect in Ontario Real Estate?',
    slug: 'what-is-a-material-latent-defect',
    summary: 'A material latent defect is a hidden problem with a property that makes it unsafe, unfit for habitation, or illegal — and Ontario sellers are legally required to disclose it regardless of an "as is" clause.',
    metaDescription: 'What is a material latent defect in Ontario? Definition, examples, legal obligations to disclose, and what happens if a seller fails to disclose — explained for GTA sellers.',
    body: `<!-- Primary keyword: material latent defect Ontario | Intent: informational | Word count target: 1800 -->

<p>A material latent defect is a hidden problem with a property that a buyer could not discover through a reasonable inspection and that meets a legal threshold for significance — making the property unsafe, unfit for habitation, or illegal to use as intended. In Ontario, sellers are legally required to proactively disclose material latent defects to buyers. This is not optional, and it is not waived by an "as is" clause. Understanding what qualifies as a material latent defect, and your legal obligations around it, is essential before you list any Ontario property for sale.</p>

<h2>The Two-Part Test: Latent and Material</h2>

<p>Not every hidden issue is a material latent defect. The legal concept requires both elements:</p>

<p><strong>Latent:</strong> The defect must be hidden — not discoverable by a buyer conducting a reasonable inspection, including a professional home inspection. A crack in the foundation that's visible in the basement is arguably patent (visible). A crack concealed behind finished drywall or a wall covering is latent.</p>

<p><strong>Material:</strong> The defect must be significant enough that a reasonable buyer would consider it relevant to their decision to purchase, or to the price they'd pay. Ontario courts and RECO use three specific categories to define materiality:</p>

<ol>
  <li>The defect makes the property <strong>dangerous or unsafe</strong> to occupy (e.g., compromised structural integrity, asbestos that poses a health risk)</li>
  <li>The defect makes the property <strong>unfit for habitation</strong> (e.g., active flooding that makes the space unlivable)</li>
  <li>The defect makes the property <strong>illegal to use</strong> as a residence (e.g., an illegal basement apartment, an addition without permits that violates zoning bylaws)</li>
</ol>

<h2>Examples of Material Latent Defects</h2>

<p>The following conditions have been treated as material latent defects in Ontario real estate transactions and litigation:</p>

<ul>
  <li><strong>Foundation cracks allowing water infiltration:</strong> A crack behind drywall or under flooring that allows basement flooding is both latent and material — it makes the property unfit for habitation and may be structurally significant.</li>
  <li><strong>Hidden mould:</strong> Mould concealed in wall cavities, behind panelling, or under flooring — especially black mould (Stachybotrys) — is a health hazard. If you know it's there, you must disclose it.</li>
  <li><strong>Flooding history:</strong> A documented pattern of basement flooding, even if remediated, is material. Buyers and their insurers make decisions based on this history. Concealing it creates significant legal exposure.</li>
  <li><strong>Asbestos-containing materials:</strong> Known asbestos in floor tiles, insulation, popcorn ceilings, or pipe wrapping — particularly if friable (easily crumbled and releasing fibres) — must be disclosed.</li>
  <li><strong>Underground oil tank:</strong> A decommissioned or active underground storage tank creates environmental liability. It's latent (underground) and material (significant environmental risk and legal obligation).</li>
  <li><strong>Structural defects concealed by renovation:</strong> A load-bearing wall removed without a permit, or a roof structure weakened by past damage and covered with new sheathing — these are the textbook material latent defect scenario.</li>
  <li><strong>Pest damage:</strong> Active or past termite infestation that has caused structural damage, if hidden by finishes, meets the threshold.</li>
  <li><strong>Illegal units:</strong> A basement apartment that doesn't comply with the Ontario Building Code or municipal zoning makes the property illegal to use in the way it's being represented. This is a material latent defect.</li>
</ul>

<h2>What Is Not a Material Latent Defect</h2>

<p>Not every problem rises to the material latent defect threshold:</p>

<ul>
  <li><strong>Patent defects:</strong> Conditions visible on inspection — peeling paint, aging fixtures, a dated furnace — are not latent. They're observable, and <em>caveat emptor</em> applies.</li>
  <li><strong>Minor cosmetic issues:</strong> Surface damage, worn finishes, and cosmetic conditions don't meet the materiality threshold.</li>
  <li><strong>Stigmatized property conditions:</strong> In Ontario, prior deaths, suicides, or criminal activity on a property are generally not treated as material latent defects unless they resulted in a physical condition (like mould or structural damage). You are not required by law to disclose that someone died on the property.</li>
  <li><strong>Conditions you genuinely didn't know about:</strong> The disclosure obligation is tied to your knowledge. If you genuinely didn't know about a defect, you can't be held liable for failing to disclose it — though courts look critically at claims of ignorance for conditions that attentive owners would have noticed.</li>
</ul>

<h2>Legal Consequences of Non-Disclosure</h2>

<p>If a buyer discovers after closing that you knew about a material latent defect and failed to disclose it, they have several legal remedies available in Ontario:</p>

<ul>
  <li><strong>Rescission:</strong> The buyer may seek to rescind (undo) the transaction, returning the property to you and receiving their purchase price back. This is the most serious remedy.</li>
  <li><strong>Damages:</strong> The buyer may sue for the cost of remediation, diminished value, and consequential losses (alternative housing costs, carrying costs during remediation).</li>
  <li><strong>Misrepresentation:</strong> If the non-disclosure was fraudulent — you actively concealed a known defect — damages can be substantial and include legal costs.</li>
  <li><strong>RECO complaint:</strong> If your real estate agent knew of the defect and failed to disclose, they face regulatory action from RECO.</li>
</ul>

<p>Ontario courts have awarded six-figure damages in cases where sellers concealed known material latent defects. The limitation period under Ontario's <em>Limitations Act</em> is generally two years from when the buyer discovered (or reasonably should have discovered) the defect — which may be years after closing, if the defect was truly hidden.</p>

<h2>The "As Is" Clause and Material Latent Defects</h2>

<p>Selling a property "as is" does not eliminate your obligation to disclose known material latent defects. The "as is" clause shifts responsibility for patent (visible) defects to the buyer. It does not permit concealment of known hidden defects that meet the material latent defect threshold. Ontario courts have consistently held that "as is" clauses cannot be used to excuse non-disclosure of defects the seller knew about and actively concealed.</p>

<p>If you're considering listing "as is" — perhaps for an estate sale or a property with known issues — consult your lawyer about what must still be disclosed and how to frame it in the listing and offer documents. See our guide on <a href="/blog/what-should-i-disclose-when-selling-a-house">what you must disclose when selling in Ontario</a>.</p>

<h2>FAQ</h2>

<h3>Who determines if a defect is "material" enough to require disclosure?</h3>
<p>Ultimately, courts make this determination if there's a dispute. The practical standard is: would a reasonable buyer, if they knew about this condition, consider it relevant to their decision to purchase or the price they'd pay? When in doubt, disclose. The cost of disclosure is a negotiated price reduction; the cost of non-disclosure litigation is far higher.</p>

<h3>If a defect was professionally remediated, do I still have to disclose it?</h3>
<p>Generally yes, if it was a material latent defect. You disclose the history and the remediation — the scope of work, who did it, when, and with what documentation. A disclosed-and-fixed issue is far less damaging to a deal than a disclosed-after-the-fact undisclosed issue. Document remediation thoroughly: keep contractor invoices, warranty documentation, and before/after photos.</p>

<h3>Does a home inspection protect me from post-closing claims?</h3>
<p>Partially. If an inspector reasonably could have found a defect and noted it in their report, and the buyer received that report, it becomes harder for the buyer to claim the defect was "latent" — it was discoverable. However, a defect hidden in a wall cavity or under concrete is not something a home inspector finds in a standard inspection. The inspector's report does not transfer your disclosure obligation to the buyer's inspector.</p>

<h3>What if the defect existed before I bought the property and I inherited it without knowing?</h3>
<p>The disclosure obligation applies to what you know. If the defect was present when you purchased and was itself a material latent defect that your seller failed to disclose, you may have a claim against <em>your</em> seller — while still being obligated to disclose what you now know to your buyer. The chain of disclosure obligations runs with knowledge, not with the property's history.</p>

<h3>Is a neighbour dispute a material latent defect?</h3>
<p>Not a defect in the property itself, but neighbour disputes — particularly those affecting use of the property or involving noise, encroachment, or harassment — are the kind of material facts that RECO requires agents to disclose. Whether it rises to the material latent defect threshold legally is fact-specific. If the dispute affects your use and enjoyment of the property materially, disclosure is the safer path.</p>`,
  },
  {
    title: 'Can I Sell a Home with an Unfinished Basement in Ontario?',
    slug: 'can-i-sell-a-home-with-an-unfinished-basement',
    summary: 'Yes, you can sell a home with an unfinished basement in Ontario — buyers purchase unfinished basements regularly, and it can be marketed as a feature if priced correctly.',
    metaDescription: 'Can you sell a home with an unfinished basement in Ontario? What to disclose, how it affects pricing, and whether finishing it before listing makes sense.',
    body: `<!-- Primary keyword: sell a home with unfinished basement | Intent: informational | Word count target: 1600 -->

<p>Selling a home with an unfinished basement in Ontario is completely legal and happens regularly across the GTA. An unfinished basement is not a defect — it's an observable condition that buyers see, price in, and sometimes specifically seek out (more control over their own renovation). The questions worth asking are not whether you can sell, but whether to finish the basement before listing, what to disclose about any past or in-progress work, and how to price a home with an unfinished lower level in your specific market.</p>

<h2>An Unfinished Basement Is a Patent Condition</h2>

<p>Under Ontario real estate law, an unfinished basement is a patent condition — it's visible to any buyer who walks through the property. <em>Caveat emptor</em> (buyer beware) applies to patent conditions. You are not required to explain or justify why the basement is unfinished, provide plans for finishing it, or reduce your price to offset the cost of finishing. Buyers see it; their offer price reflects it.</p>

<p>What changes this picture: if work was started and abandoned, or if any work was done — framing, rough-in plumbing, electrical rough-in — you need to know whether permits were pulled for that work. Partially completed work without permits creates a disclosure obligation and can complicate the deal. See our guide on <a href="/blog/can-i-sell-a-home-with-an-outstanding-permit">selling with outstanding permits</a>.</p>

<h2>When to Disclose Something About an Unfinished Basement</h2>

<p>The basement being unfinished doesn't require disclosure. Conditions in the unfinished basement that meet the material latent defect threshold do:</p>

<ul>
  <li><strong>Active water infiltration or flooding history:</strong> If the basement has flooded — through window wells, foundation cracks, or the floor drain backing up — this must be disclosed. It's not hidden by finishes (the basement is open), but the history of an event that the buyer can't observe from a single visit is material information.</li>
  <li><strong>Known foundation cracks:</strong> Visible cracks in a poured concrete or block foundation should be pointed out. In an unfinished basement, cracks are often patent (visible), but if you've painted over or patched a crack that allows water infiltration, that's moving toward latent defect territory.</li>
  <li><strong>Abandoned rough-in or unpermitted work:</strong> If someone started a basement renovation — framing, electrical rough-in, drain rough-in — without pulling permits, disclose it. An open permit for rough-in work that was never inspected is a problem that affects title insurance.</li>
  <li><strong>Knob and tube or outdated electrical:</strong> If the electrical panel serving the basement is outdated and you know it, this may be a disclosure issue depending on whether it creates a safety concern.</li>
</ul>

<h2>Should You Finish the Basement Before Selling?</h2>

<p>This is a common question and the answer is almost always: no, unless you can do it for substantially less than the value it adds. Here's the math buyers and agents run:</p>

<p>A finished basement in the GTA typically adds $50,000–$100,000 in value depending on quality and size. But a proper finishing job — with permits, insulation, drywall, flooring, bathroom, egress window — costs $40,000–$80,000 in labour and materials in 2025. The value-add barely covers the cost, and you carry the project risk (delays, overruns, quality disputes with tradespeople).</p>

<p>More practically: finishing a basement for a sale means you're choosing the layout, finishes, and features — but it's the buyer who will live with those choices. Buyers often discount a finished basement they don't like and would redo anyway. An unfinished basement with good bones (adequate ceiling height, waterproofed, proper drainage) can actually be marketed positively — the buyer gets to design their own space.</p>

<p>Exceptions where finishing may make sense: very competitive markets where buyers are comparing finished homes; situations where the unfinished basement creates a significant value gap versus comparables; or if you can finish it quickly, cheaply, and with permits because you have trades connections.</p>

<h2>How an Unfinished Basement Affects Pricing</h2>

<p>Real estate agents use finished square footage as a pricing metric. An unfinished basement typically counts as below-grade space, not finished living area. Your home will price lower per square foot than comparable homes with finished basements — reflecting the cost the buyer will incur to finish it themselves. This is not a disadvantage; it's an honest market reflection.</p>

<p>In your listing, be accurate about total vs. finished square footage. TREB/TRREB and Ontario real estate standards require square footage to be reported as finished above-grade or clearly distinguished if including below-grade space. An inaccurate square footage representation creates disclosure liability.</p>

<p>Looking to understand pricing in your area? <a href="/homes-for-sale/toronto">Browse comparable active listings on Condohill</a> to see how similar properties are priced in your neighbourhood.</p>

<h2>FAQ</h2>

<h3>Will buyers be put off by an unfinished basement?</h3>
<p>Some buyers prefer unfinished — they want to design their own space and don't want to pay for finishes they'll redo. Others see it as a burden. In the GTA market, unfinished basements sell regularly at all price points. The right buyer for your property exists; pricing correctly ensures you find them.</p>

<h3>Does an unfinished basement affect my home's appraisal?</h3>
<p>Yes. Lenders use appraised value for mortgage approval, and appraisals typically assign lower value to unfinished below-grade space than finished living area. This is market-reflective, not punitive. Buyers financing a home with an unfinished basement will have their purchase supported by the appraisal as long as the offer price reflects the market value of the property as-is.</p>

<h3>Do I need a permit to finish my basement if I decide to before selling?</h3>
<p>Yes. Finishing a basement in Ontario requires building permits for framing, electrical, plumbing (if adding a bathroom), and HVAC. Working without permits creates an open permit issue that must be disclosed and can complicate a future sale. If you finish before selling, get the permits, complete the inspections, and obtain the final certificate. This protects both you and the buyer.</p>

<h3>Can I market an unfinished basement as "income potential"?</h3>
<p>Only if it's zoned and structurally suitable for a legal accessory dwelling unit. Marketing a basement as "income potential" implicitly represents that an apartment or rental unit is achievable. If the ceiling height, egress, or zoning don't support it, this representation may be misleading. Be accurate: if you can say "8-foot ceilings, separate entrance, plumbing rough-in" — those are honest features. "Income suite ready" implies compliance that must be verified.</p>

<h3>What is the typical cost to finish a basement in Toronto in 2025?</h3>
<p>A basic basement finishing in the GTA — framing, insulation, drywall, flooring, lighting, one bathroom — runs $40,000–$70,000 with permits and licensed contractors. Adding a kitchen for an accessory dwelling unit pushes the total to $70,000–$120,000. Premium finishes, larger spaces, and complex layouts add cost. Costs have increased significantly with material and labour inflation since 2020 — get multiple quotes before committing to a pre-sale finish.</p>`,
  },
  {
    title: 'Can I Sell a Home with an Illegal Basement Apartment in Ontario?',
    slug: 'can-i-sell-a-home-with-an-illegal-basement-apartment',
    summary: 'Yes, you can sell a home with an illegal basement apartment in Ontario — but you must disclose it, and buyers and their lenders face restrictions on how they can use and finance the property.',
    metaDescription: 'Can you sell a home with an illegal basement apartment in Ontario? Disclosure rules, buyer financing issues, and your options as a GTA seller — explained.',
    body: `<!-- Primary keyword: sell a home with illegal basement apartment Ontario | Intent: informational | Word count target: 1700 -->

<p>Selling a home with an illegal basement apartment in Ontario is permitted — it is not illegal to sell the property. What is required is that you disclose the illegal status of the unit to buyers. An illegal basement apartment is one that doesn't meet the requirements under the Ontario Building Code, the Ontario Fire Code, or local municipal zoning bylaws to legally function as a separate dwelling unit. The failure to disclose constitutes concealment of a material condition that affects how the property can legally be used — and that creates real legal exposure for you as a seller.</p>

<h2>What Makes a Basement Apartment "Illegal"</h2>

<p>In Ontario, a legal secondary suite or basement apartment must meet several overlapping requirements:</p>

<ul>
  <li><strong>Zoning compliance:</strong> The municipality must permit a second unit in that property type and zone. Ontario's <em>More Homes Built Faster Act</em> has expanded as-of-right permissions for second units in many zones — check your municipality's current zoning bylaw.</li>
  <li><strong>Building permit:</strong> A permit must have been pulled for the apartment construction, including inspection of framing, fire separation, electrical, and egress.</li>
  <li><strong>Ontario Fire Code compliance:</strong> Requires smoke alarms, carbon monoxide detectors, proper fire separation (typically 30 or 60 minutes between units), and means of egress.</li>
  <li><strong>Ontario Building Code minimum standards:</strong> Minimum ceiling height (typically 6'5" or 1.95 metres in habitable rooms), adequate natural light, proper ventilation, egress windows in sleeping areas.</li>
</ul>

<p>An apartment that was created without a permit, doesn't meet fire separation requirements, or is in a zone where second units aren't permitted is illegal. A very large number of GTA homes have basement apartments that were built without proper permits or approvals — this is not unusual.</p>

<h2>Your Disclosure Obligation</h2>

<p>An illegal basement apartment is a material latent defect — it makes the property illegal to use in the manner it's being represented. If you're marketing a property as having a "basement suite" or "in-law suite" or "income-generating unit" without disclosing the illegal status, you are misrepresenting the property. This applies whether or not you complete a Seller Property Information Statement.</p>

<p>Disclosure means telling buyers, in writing before or at offer, that the unit has not been approved under the applicable building permits, fire code, and/or zoning bylaws. Your listing agent and lawyer can help you frame this appropriately. See our complete guide on <a href="/blog/what-should-i-disclose-when-selling-a-house">seller disclosure obligations in Ontario</a>.</p>

<h2>How an Illegal Unit Affects Buyers and Their Financing</h2>

<p>Buyers who purchase a home with an illegal basement apartment face specific constraints that you should understand before listing:</p>

<p><strong>Rental income:</strong> Mortgage lenders typically cannot count rental income from an illegal unit in the buyer's gross debt service calculation. A buyer hoping to offset carrying costs with basement rent cannot use that income to qualify — reducing their effective purchasing power. This matters for your buyer pool.</p>

<p><strong>Insurance:</strong> Home insurers may not cover an illegal rental unit, or may charge significantly higher premiums. A fire originating in or spreading from an uninsured illegal unit creates severe liability for the new owner.</p>

<p><strong>Municipal enforcement:</strong> Municipalities can issue orders to vacate illegal units and require compliance before they can be legally reoccupied. Toronto, for example, has an active secondary suite inspection program triggered by tenant complaints or neighbour calls. A new owner could face an order to remove or remediate the unit.</p>

<p><strong>Legalization cost:</strong> Depending on what needs to change to legalize the unit, costs can range from $5,000 (minor fire separation additions, alarm upgrades) to $40,000+ (complete structural changes, new egress window, full permit process). Buyers factor this into their offer price.</p>

<h2>Your Options as a Seller</h2>

<p><strong>Option 1: Legalize before selling.</strong> If the unit is close to compliance, legalizing it before listing can meaningfully increase the sale price and buyer pool. A legal secondary suite is typically valued at $50,000–$100,000 higher than an identical property without a legal suite, and buyers can use the rental income to qualify for a larger mortgage. You'll need to navigate building permits, fire code inspections, and zoning confirmation — allow 3–6 months minimum.</p>

<p><strong>Option 2: Disclose as-is and price accordingly.</strong> Disclose the illegal status, remove any tenants if the tenancy creates additional complications, and price to reflect the buyer's legalization cost. The unit can still be marketed for its potential — describe the square footage, features, and what compliance would require, not the rental income it generates illegally.</p>

<p><strong>Option 3: Convert back to storage/utility space.</strong> If legalization is too costly and you want to avoid complications, decommissioning the kitchen (removing the stove) effectively removes the "dwelling unit" designation in most Ontario jurisdictions. This limits the property's marketability but removes the disclosure complication.</p>

<h2>The Tenant Question</h2>

<p>If someone is renting the illegal basement apartment, the sale does not automatically end their tenancy. Ontario's <em>Residential Tenancies Act</em> protects tenants in most rental situations regardless of whether the unit is legally permitted. You cannot evict a tenant simply because you're selling. The buyer purchases the property subject to the existing tenancy. This significantly complicates the sale — buyers who need vacant possession will pay less, and most buyers don't want to inherit an illegal unit with an entrenched tenant.</p>

<p>If ending the tenancy is required, the legal process under the <em>Residential Tenancies Act</em> must be followed, which takes months and may require Landlord and Tenant Board proceedings. Start this process early if needed, and get legal advice on the correct notice and grounds.</p>

<h2>FAQ</h2>

<h3>Do I have to disclose an illegal basement apartment if I don't mention it in the listing?</h3>
<p>Yes. Even if your listing says nothing about the basement, if a buyer discovers during inspection (or later) that you knew the basement contained an illegal dwelling unit and you concealed it, you face misrepresentation liability. The obligation to disclose a material condition like an illegal unit runs independently of what you market or don't market. Silence is not protection.</p>

<h3>What happens if the buyer discovers the unit is illegal after closing?</h3>
<p>If they can prove you knew and didn't disclose, they have grounds for a damages claim — the cost of legalization or the diminished value of the property. If the unit is ordered vacated and they lose rental income they counted on, that's recoverable too. Post-closing claims for illegal unit non-disclosure are a recurring category of Ontario real estate litigation.</p>

<h3>Can I just tell the buyer verbally that the unit is illegal?</h3>
<p>Verbal disclosure in real estate transactions is worth very little. Put it in writing — in the listing, in a schedule to the APS, or in a disclosure letter that forms part of the offer documentation. Your lawyer can help structure the disclosure correctly.</p>

<h3>How does an illegal unit affect my asking price?</h3>
<p>It depends on the market and what legalization would cost. A buyer willing to legalize a unit that's close to compliance will discount by the legalization cost plus a margin for project risk — typically $20,000–$50,000 off what they'd pay for a legal suite. A buyer who just wants the extra space and doesn't care about renting it legally may discount less. Price based on realistic comparable sales of properties without legal suites.</p>

<h3>Is there a municipal amnesty or legalization program in Toronto?</h3>
<p>Yes. The City of Toronto has a second suite registration program that allows existing suites to achieve "deemed lawful" status if they meet current fire and building code requirements and were created prior to a specific date. Not all units qualify, but it's worth investigating with the City's Building Division before committing to a full legalization or a disclosure-only strategy. Other York Region municipalities have similar programs with different criteria.</p>`,
  },
  {
    title: 'Can I Sell a Home with an Outstanding Permit in Ontario?',
    slug: 'can-i-sell-a-home-with-an-outstanding-permit',
    summary: 'Yes, but an outstanding permit must be disclosed to buyers, can cause title insurance and financing complications, and should ideally be closed before listing.',
    metaDescription: 'Can you sell a home with an open or outstanding building permit in Ontario? What it means for buyers, lenders, and title — and how to resolve it before closing.',
    body: `<!-- Primary keyword: sell home with outstanding permit Ontario | Intent: informational | Word count target: 1600 -->

<p>You can sell a home with an outstanding building permit in Ontario, but doing so without disclosing it is a serious mistake that can derail your deal at closing. An outstanding permit — sometimes called an open permit — is a building permit that was issued and work was performed, but the final inspection was never completed and no final certificate of occupancy or completion was issued. From a legal and practical standpoint, outstanding permits create problems for buyers, lenders, and title insurers that must be addressed before or at closing.</p>

<h2>What Is an Outstanding (Open) Permit?</h2>

<p>A building permit has two stages: issuance (authorizing the work to begin) and final inspection (confirming the work was completed to the Building Code standard). Many homeowners pull permits, do the work, and then never call for the final inspection — perhaps because the work didn't fully comply, because they lost track, or because they assumed it would sort itself out. It doesn't. The permit stays open indefinitely in the municipality's system.</p>

<p>Common sources of open permits in GTA homes: basement finishing, additions, deck construction, HVAC replacement, electrical panel upgrades, pool installation, and detached garage construction. Toronto maintains an online building permit search — buyers, lenders, and title insurers routinely check it. Open permits will be found.</p>

<h2>Why Outstanding Permits Are a Problem for Buyers</h2>

<p>An outstanding permit signals to buyers and their professionals that:</p>

<ul>
  <li>Work was done but never confirmed to meet the Building Code</li>
  <li>The work may have deficiencies that were never identified by an inspector</li>
  <li>The title to the property carries an encumbrance that may need to be resolved</li>
</ul>

<p><strong>Title insurance:</strong> Title insurers typically cover known title risks for a premium. Some title insurers will insure over an open permit (providing coverage for losses arising from it), but at additional cost and subject to their underwriting criteria. Others won't insure over permits involving structural, electrical, or fire safety issues. If the buyer's lender requires title insurance that covers the open permit, and the insurer won't provide it, the deal can fail.</p>

<p><strong>Mortgage financing:</strong> Most major lenders require title insurance as a condition of advancing the mortgage. If title insurance isn't available for the property due to the open permit, the lender won't fund. The buyer needs the lender to fund to close the deal.</p>

<p><strong>Buyer's due diligence:</strong> Any buyer with a competent agent will find the open permit and will expect it resolved — either by you before closing, by a price reduction to account for the resolution cost, or by a holdback of funds at closing until the permit is closed.</p>

<h2>Your Options as a Seller</h2>

<p><strong>Close the permit before listing:</strong> This is the cleanest approach. Contact the municipality's building department, request an inspection for the outstanding permit, and get the work inspected. If the work complies with the applicable Building Code (the code in effect at the time the permit was issued), the inspector finalizes the permit and issues a certificate. You then have no open permit issue to disclose.</p>

<p>If the work doesn't comply — the inspector finds deficiencies — you'll need to bring the work into compliance before the permit can be closed. This may involve reopening walls, upgrading electrical, or adding fire separation. Get a building inspector or contractor to assess the deficiencies first, then decide whether to remediate or price the property to reflect the outstanding issue.</p>

<p><strong>Disclose and price accordingly:</strong> If closing the permit is impractical before listing (the work involved in compliance is substantial), disclose the outstanding permit in writing and price to reflect the cost the buyer will incur to resolve it. Buyers purchasing at a disclosed discount are taking on a known risk, which reduces your liability compared to selling without disclosure.</p>

<p><strong>Work out an arrangement at closing:</strong> In some transactions, the parties agree to a holdback — a portion of the purchase price held in trust at closing until the permit is closed post-closing. This requires legal documentation through both lawyers. Some buyers are willing to deal with closing the permit themselves in exchange for a sufficient price adjustment; others want it resolved before they complete the purchase.</p>

<h2>How to Find and Close an Outstanding Permit</h2>

<p>Most Ontario municipalities have permit search tools online. In Toronto: search the City of Toronto's Active Building Permits database at toronto.ca/building. For other GTA municipalities, check the municipal website's building department section. Your real estate lawyer can also conduct a permit search as part of their title review.</p>

<p>To close a permit: call the municipality's building department, provide the permit number (or they can search by address), request a final inspection, and arrange access for the inspector. The inspection is typically free or low-cost. If work is required to meet code before finalling, the cost depends on the scope — minor electrical or smoke alarm upgrades might cost $500–$2,000; structural remediation can cost far more.</p>

<h2>Disclosure Is Mandatory</h2>

<p>An outstanding permit is a condition that affects the property's title and the legality of the work performed. Under Ontario real estate disclosure standards, you are required to disclose known outstanding permits to buyers. Failing to disclose a permit that the buyer's title search will find anyway — and that becomes a closing issue — damages your credibility and can expose you to claims that you attempted to conceal a material condition.</p>

<p>See our complete guide on <a href="/blog/what-documents-do-i-need-to-sell-my-home">documents required to sell a home</a> for a complete checklist of what to gather before listing, including permit records.</p>

<h2>FAQ</h2>

<h3>How do I find out if my home has open permits?</h3>
<p>Search your municipality's building permit database using your address. In Toronto: toronto.ca/building has a public permit search. Most other GTA municipalities (Mississauga, Brampton, Markham, Vaughan, etc.) have similar online tools. If you can't find it online, call the municipal building department directly with your address. Your real estate lawyer will also conduct this search as part of the title review.</p>

<h3>Who is responsible for closing the permit — me or the buyer?</h3>
<p>The seller is typically expected to close outstanding permits before closing, or the issue is priced into the sale. Buyers can agree to take on the permit closure themselves, but this requires a clear written agreement in the APS and usually a purchase price adjustment. Most buyers don't want to inherit permit problems — they want a clean title.</p>

<h3>Can an open permit from 20 years ago really affect my sale today?</h3>
<p>Yes. Municipalities have no statute of limitations on building permits. A permit opened in 2003 for a basement renovation that was never finalled is still open today, will appear in a permit search, and will be raised by the buyer's agent, lawyer, or title insurer. The age of the permit doesn't reduce its relevance to the current transaction.</p>

<h3>What if the work done under the old permit no longer exists — can I just close it that way?</h3>
<p>If the physical work covered by the permit has been demolished or substantially changed, explain this to the building department. They may be able to close the permit administratively or require a site visit to confirm. Every municipality handles this slightly differently — call the building department and explain the situation before assuming the permit can't be closed.</p>

<h3>Is an open permit the same as unpermitted work?</h3>
<p>No. An open permit means work was started with a permit but never inspected and finalled. Unpermitted work means no permit was pulled at all. Both create disclosure obligations and title issues, but they're resolved differently. An open permit has a paper trail through the municipality and can usually be finalled through the inspection process. Unpermitted work may need to be retroactively permitted — or disclosed and sold as-is with appropriate price adjustment.</p>`,
  },
  {
    title: 'How to Sell a House After a Divorce in Ontario',
    slug: 'how-to-sell-a-house-after-a-divorce',
    summary: 'Selling a matrimonial home after divorce in Ontario requires both spouses to consent, even if only one name is on title — and the process involves equalization, tax planning, and often independent legal advice for each party.',
    metaDescription: 'How to sell a house after a divorce in Ontario. Matrimonial home rights, both spouses\' consent requirements, capital gains, and what happens when spouses disagree.',
    body: `<!-- Primary keyword: how to sell a house after a divorce Ontario | Intent: informational | Word count target: 2000 -->

<p>Selling a matrimonial home after a divorce or separation in Ontario is governed by rules that are distinct from any other residential sale. The most important rule: both spouses must consent to the sale of a matrimonial home, regardless of whose name appears on the title. Ontario's <em>Family Law Act</em> gives each spouse equal possession rights to the matrimonial home during marriage, and this protection doesn't disappear at separation — it remains until divorce is finalized, a court order addresses the home, or a separation agreement deals with it. If you're navigating a home sale after divorce in Ontario, here is what you need to know.</p>

<p>This guide provides general information about the legal process. Every divorce involves unique facts, and the financial and legal implications of selling a matrimonial home are significant. Each spouse should have independent legal counsel — not the same lawyer — throughout this process.</p>

<h2>The Matrimonial Home Under Ontario's Family Law Act</h2>

<p>Under the <em>Family Law Act, R.S.O. 1990</em>, a matrimonial home is the property that the married spouses ordinarily occupied as their family residence at the time of separation. Both spouses have an equal right to possession of the matrimonial home during the marriage, regardless of who paid for it or whose name is on the deed.</p>

<p>The critical implication for sellers: a spouse cannot sell the matrimonial home without the other spouse's consent — even if only one spouse is on title as the registered owner. The non-titled spouse's consent must be obtained in writing. Attempting to sell without consent exposes the selling spouse to a court injunction stopping the sale, and the transaction itself can be set aside. Buyers who purchase a matrimonial home without confirming both spouses' consent take on real legal risk.</p>

<p>This rule applies to married spouses, not common-law partners. Common-law partners do not have the same automatic matrimonial home rights under the <em>Family Law Act</em>, though they may have other claims through constructive trust or unjust enrichment law.</p>

<h2>Options for the Matrimonial Home After Separation</h2>

<p><strong>Both spouses agree to sell:</strong> The most straightforward path. Both spouses sign the listing agreement, both sign the APS, and the net proceeds (after mortgage discharge and costs) are divided according to the separation agreement or court order. The division is not necessarily 50/50 — it depends on the equalization of net family property under the <em>Family Law Act</em> or whatever the parties negotiate.</p>

<p><strong>One spouse buys out the other:</strong> One spouse refinances the mortgage in their name alone (subject to qualifying), pays the other spouse their equalization share, and retains the home. This requires a lender willing to approve the refinance, an appraisal to establish current value, and a lawyer to handle the title transfer. The departing spouse must be removed from the mortgage — simply being removed from title is not sufficient if your name is still on the mortgage obligation.</p>

<p><strong>Deferred sale:</strong> Spouses agree to delay the sale — typically until minor children finish a school year or reach a specific age. The home is occupied by one spouse in the interim. This arrangement must be clearly documented in the separation agreement, including who pays the mortgage and expenses, how equity is preserved, and when the sale will occur.</p>

<p><strong>Court-ordered sale:</strong> When spouses cannot agree on the home's disposition, either party can apply to the Superior Court of Justice for an order directing the sale of the matrimonial home and specifying how the proceeds are distributed. Courts generally order sales when the spouses cannot agree and there's no compelling reason to maintain the status quo. Court orders take time and legal fees — a negotiated resolution is almost always preferable.</p>

<h2>Equalization of Net Family Property</h2>

<p>In Ontario, when a marriage ends, each spouse is entitled to an equalization of their net family property — the accumulation of assets and debts during the marriage. The matrimonial home is included in the calculation. The spouse with the higher net family property pays the other spouse an equalization payment to bring both to the same level.</p>

<p>This calculation is more complex than simply splitting the equity in half. Pre-marital equity (if one spouse owned the home before the marriage), gifts or inheritances received during the marriage (which may be excluded), and the value of all other assets and debts all factor into the net family property calculation. Your family law lawyer runs these numbers — don't attempt this calculation without legal and accounting assistance.</p>

<h2>Tax Implications of Selling a Matrimonial Home</h2>

<p>If the home was the principal residence of both spouses throughout the period of ownership, the <strong>principal residence exemption</strong> under the <em>Income Tax Act</em> eliminates the capital gains tax on the sale. This exemption can be claimed for each year the home was your or your spouse's principal residence. In most divorce situations where the family home was the only principal residence, the exemption eliminates the capital gain entirely.</p>

<p>However, complications arise if:</p>
<ul>
  <li>One spouse moved out and the property was subsequently rented — partial exemption may apply</li>
  <li>The property is not the departing spouse's principal residence at the time of sale</li>
  <li>One spouse owns other real estate where a principal residence exemption could be claimed instead</li>
</ul>

<p>Both spouses must designate the property as their principal residence on their respective tax returns for the exemption years they're claiming. Get tax advice from an accountant or tax lawyer before closing — the tax consequences of a divorce sale can be significant if the principal residence exemption doesn't fully apply.</p>

<h2>The Practical Process for Selling</h2>

<p>Once the decision to sell is made and both spouses have independent legal representation:</p>

<ol>
  <li>Agree on a listing agent (the same agent for both, or each spouse choosing their own in exceptional circumstances)</li>
  <li>Agree on the listing price and listing terms</li>
  <li>Both spouses sign the listing agreement</li>
  <li>Offers are reviewed by both spouses (through their respective lawyers if communications between spouses are difficult)</li>
  <li>Both spouses sign the accepted APS</li>
  <li>Both lawyers coordinate closing — the mortgage is discharged, proceeds are distributed according to the separation agreement or court order</li>
</ol>

<p>If communication between separating spouses is difficult, the lawyers can manage the process with minimal direct contact required. A collaborative divorce process, mediation, or a negotiated separation agreement before listing avoids court and is faster and cheaper.</p>

<h2>FAQ</h2>

<h3>Can I list the house if my spouse won't cooperate?</h3>
<p>Not without their consent if it's a matrimonial home. If your spouse refuses to agree to the listing, you can apply to the Ontario Superior Court of Justice for an order directing the sale. This takes months and costs legal fees, but courts do grant such orders when the circumstances warrant — particularly when there are no minor children in the home requiring stability, or when the spouse withholding consent has no legitimate reason. Get your family lawyer's advice on this path.</p>

<h3>Does it matter that only one name is on the title?</h3>
<p>Not for the consent requirement. One-name title on a matrimonial home doesn't give that spouse the right to sell unilaterally. The non-titled spouse's consent is required under the Family Law Act. Buyers rely on a statutory declaration by both spouses confirming the disposition is authorized — any reputable real estate lawyer will require this before closing.</p>

<h3>What if we're separated but not yet divorced — does this still apply?</h3>
<p>Yes. The matrimonial home rights under the Family Law Act apply during marriage — and marriage doesn't end until the divorce order is granted. Separation alone doesn't terminate matrimonial home rights. Both spouses' consent is required until a divorce order is issued and the home's disposition has been settled by court order or separation agreement.</p>

<h3>How are proceeds from the sale split if we don't have a separation agreement?</h3>
<p>If there's no separation agreement or court order addressing the home, lawyers typically hold the net proceeds in trust (often split equally or according to an agreed interim arrangement) while the equalization calculation is completed. Distributing proceeds before equalization is settled creates accounting complexity. Your family law lawyer advises on how to structure the proceeds pending final settlement.</p>

<h3>Can we use the same real estate lawyer for both sides?</h3>
<p>On the real estate transaction itself (the actual sale), one lawyer can sometimes handle the conveyancing for both spouses if there's no conflict — though this is increasingly unusual and many lawyers won't do it in divorce situations. For the family law matters (separation agreement, equalization), each spouse must have separate, independent legal counsel. You cannot share a family lawyer for a contested or potentially contested divorce.</p>`,
  },
  {
    title: 'How to Sell an Inherited House in Ontario',
    slug: 'how-do-i-sell-an-inherited-house',
    summary: 'Selling an inherited house in Ontario requires confirming who has legal authority to sell through the estate (usually the estate trustee with probate), calculating capital gains from the date-of-death value, and navigating the sale with the estate\'s lawyer.',
    metaDescription: 'How to sell an inherited house in Ontario. Who has authority to sell, probate requirements, capital gains tax from date-of-death value, and what to expect from the process.',
    body: `<!-- Primary keyword: how to sell an inherited house Ontario | Intent: informational | Word count target: 1900 -->

<p>Selling an inherited house in Ontario involves legal steps that don't apply to an ordinary residential sale. Before you can list a property that was inherited, you need to confirm who has the legal authority to sell it, whether probate (now called a Certificate of Appointment of Estate Trustee) is required, and what the capital gains tax implications are. Getting these foundational questions right before listing prevents serious problems during the transaction — including deals that fall apart at closing because title can't be transferred.</p>

<p>This guide covers the general process for selling inherited property in Ontario. Estate law and tax implications are complex and fact-specific. The estate should be administered by a qualified estate lawyer, and both the estate and any beneficiaries should get independent legal and tax advice before selling.</p>

<h2>Who Has the Authority to Sell an Inherited House?</h2>

<p>The answer depends on how the deceased held title and whether a will exists.</p>

<p><strong>If there is a will:</strong> The person named as estate trustee (also called executor) has authority to administer the estate, including selling real property, subject to the terms of the will and applicable law. However, even with a will, a buyer's title insurer and lender will typically require a <strong>Certificate of Appointment of Estate Trustee with a Will</strong> (commonly called probate) before they'll accept the transfer of title. This is because probate confirms the court's recognition of the will's validity and the estate trustee's authority.</p>

<p><strong>If there is no will (intestate):</strong> No one has automatic authority to administer the estate. Someone must apply to the court to be appointed as estate trustee (without a will). The court grants a Certificate of Appointment of Estate Trustee Without a Will. The resulting administrator then has authority to sell. This takes longer and involves additional steps compared to a situation with a valid will.</p>

<p><strong>Joint tenancy exception:</strong> If the deceased held the property as a joint tenant (not tenants in common) with a surviving co-owner, the deceased's interest passes automatically to the surviving joint tenant by right of survivorship. Probate is typically not required for this transfer — the survivor files a survivorship application with the land registry using a death certificate. This is a different scenario than inheritance under a will.</p>

<h2>Does Probate Take a Long Time?</h2>

<p>Yes. Probate in Ontario typically takes 3–12 months from application, depending on the complexity of the estate, the court's workload, and whether the application is straightforward. The Ontario Superior Court of Justice processes estate applications, and timelines vary by court location. Toronto estates often take 6–9 months or more. If the estate has contested claims — beneficiaries who dispute the will — it can take years.</p>

<p>You generally cannot list or accept an offer on the inherited property until probate is complete or until a lawyer can confirm title can transfer without it (rare in most residential sales). Planning the timeline around the probate process is essential — don't commit to a closing date before probate is in hand.</p>

<h2>Estate Administration Tax (Probate Fees)</h2>

<p>Ontario's Estate Administration Tax applies to the value of the estate that goes through probate. The current rate is approximately $15 per $1,000 of estate value over $50,000. On an estate with a $1,000,000 home (and no other significant assets), the tax is approximately $14,250. This is paid when the probate application is filed, from estate funds. The estate administration tax is not the same as income tax — capital gains on the property are a separate calculation.</p>

<h2>Capital Gains Tax on an Inherited Property</h2>

<p>When a person dies in Canada, the <em>Income Tax Act</em> treats their assets as if they were disposed of at their fair market value at the moment of death. For inherited real property, this is called the "deemed disposition." The estate (or the deceased's final tax return) recognizes a capital gain (or loss) equal to the difference between the property's fair market value at the date of death and the adjusted cost base (usually the original purchase price plus improvement costs).</p>

<p>The person who inherits the property receives it at a cost base equal to that date-of-death fair market value. When they subsequently sell it, capital gains are calculated from that new cost base — not from what the original owner paid decades ago. This is important: if the property has appreciated significantly since the date of death, there will be additional capital gains when you sell.</p>

<p><strong>Example:</strong> A parent purchased a home for $300,000 and it was worth $1,200,000 when they died. The estate recognizes a $900,000 capital gain on the deemed disposition (partially or fully offset by the principal residence exemption if it applied). You inherit the property at a cost base of $1,200,000. If you sell immediately, there are no additional capital gains. If you hold it for 2 years and sell for $1,350,000, there's a $150,000 capital gain taxed in your hands.</p>

<p><strong>Principal residence exemption:</strong> If the deceased used the property as their principal residence throughout their ownership, the exemption eliminates the capital gain on the deemed disposition. If they rented out part or all of the property, or if they owned other properties, the exemption may only partially apply. This determination requires a tax professional.</p>

<h2>The Practical Selling Process</h2>

<p>Once probate is obtained and the estate lawyer confirms the estate trustee has authority to sell:</p>

<ol>
  <li>The estate trustee engages a real estate agent (the estate pays the commission from proceeds)</li>
  <li>The property is appraised for listing and for confirming the date-of-death value (if not already done)</li>
  <li>The estate lawyer reviews and signs the listing agreement on behalf of the estate</li>
  <li>Offers are reviewed by the estate trustee with the estate lawyer's guidance</li>
  <li>The estate trustee signs the APS on behalf of the estate</li>
  <li>Closing proceeds with the estate lawyer handling title transfer from the estate to the buyer</li>
  <li>Proceeds flow to the estate and are distributed to beneficiaries after debts, taxes, and administration costs are paid</li>
</ol>

<h2>Maintaining the Property During the Estate Process</h2>

<p>One practical issue that catches estate trustees off guard: inherited property must be insured during the estate administration. Standard homeowner's insurance typically lapses or changes coverage when the named insured dies. Contact the insurer immediately after death and notify them — many insurers offer estate coverage for vacant or temporarily unoccupied properties, though at higher premiums. A fire or flood during an uninsured estate period can result in catastrophic loss to beneficiaries with no insurance recovery.</p>

<h2>FAQ</h2>

<h3>Can beneficiaries sell the inherited house if they all agree?</h3>
<p>Beneficiaries cannot sell real property directly — the estate trustee holds title authority during administration. Even if all beneficiaries agree, the estate trustee is the party who can legally execute the sale on behalf of the estate. If beneficiaries want to sell before the full estate administration is complete, the estate trustee must manage the transaction with the estate lawyer's guidance.</p>

<h3>What if there are multiple beneficiaries and one doesn't want to sell?</h3>
<p>If the will directs the estate trustee to sell the property and distribute proceeds, the beneficiary's preference to keep it is generally not determinative — the estate trustee follows the will's directions (subject to court supervision). If the will gives the beneficiaries discretion over whether to sell, disagreement between beneficiaries can require court application for direction. Estate disputes are expensive and slow — a negotiated resolution through mediation is almost always preferable.</p>

<h3>Do I owe capital gains tax if I sell an inherited house immediately?</h3>
<p>If you sell immediately at the date-of-death fair market value (the cost base you received), there's no capital gain in your hands — the gain was recognized on the deceased's final return (and may have been sheltered by the principal residence exemption). If you hold the property and it appreciates before you sell, you'll have a capital gain on the appreciation above the date-of-death value. A tax accountant can calculate both scenarios.</p>

<h3>How long does the entire process take from death to sale closing?</h3>
<p>In a straightforward Ontario estate — clear will, uncontested, prompt probate application — from date of death to sale closing realistically takes 9–18 months. Probate takes 3–12 months alone. Add 2–4 months to list, accept an offer, and close. Complex estates with contested wills, multiple properties, or tax disputes take longer.</p>

<h3>Can the estate accept conditions in the offer to purchase?</h3>
<p>Yes. Estate sales can include the full range of buyer conditions (financing, home inspection, status certificate). The estate trustee evaluates and accepts offers the same way any seller would. Some estate sales are listed "as is" because the estate trustee may not have detailed knowledge of the property's condition — but "as is" does not eliminate disclosure of known material latent defects, even in an estate context.</p>`,
  },
  {
    title: 'How to Sell a Home After a Family Member Dies in Ontario',
    slug: 'how-do-i-sell-a-home-after-a-family-member-dies',
    summary: 'Selling a home after a family member dies in Ontario requires confirming legal authority to sell (estate trustee), obtaining probate, maintaining insurance on the property, and understanding the capital gains implications.',
    metaDescription: 'How to sell a home after a family member dies in Ontario. Step-by-step guide on estate authority, probate, capital gains tax, and the practical selling process.',
    body: `<!-- Primary keyword: sell a home after a family member dies Ontario | Intent: informational | Word count target: 1800 -->

<p>When a family member dies owning a home in Ontario, selling that property is one of the most significant practical tasks the estate faces. Before the property can be listed or sold, several legal and administrative steps must be completed — including confirming who has authority to sell, whether probate is required, and how the sale proceeds are distributed to beneficiaries. This guide walks through the process step by step, with the goal of helping family members understand what to expect and what decisions they'll face.</p>

<p>This is general information about a complex legal and tax process. The estate should be administered by a qualified estate lawyer. Both the estate and individual beneficiaries should obtain independent legal and tax advice.</p>

<h2>Step 1: Confirm Legal Authority to Sell</h2>

<p>The first question is who has the legal right to sell the property. This depends on how title was held:</p>

<p><strong>If the deceased was the sole owner:</strong> Only the estate trustee (executor named in the will, or administrator appointed by the court if there's no will) can sell the property. Family members cannot sell the home simply because they're the children or next of kin — legal authority comes from the will or a court appointment, not family relationship.</p>

<p><strong>If the deceased held title in joint tenancy</strong> with a surviving co-owner (typically a spouse): the surviving joint tenant inherits the deceased's interest automatically by right of survivorship. A death certificate and survivorship application through the land registry office confirms the title transfer. The surviving owner then has full authority to sell without probate (for the property transfer portion).</p>

<p><strong>If the deceased held as tenant in common:</strong> Their share of the property passes through the estate (not by survivorship) and requires estate administration to deal with. The co-owners cannot sell the whole property without the estate's cooperation.</p>

<h2>Step 2: Obtain Probate (Certificate of Appointment of Estate Trustee)</h2>

<p>In the vast majority of Ontario residential real estate sales from an estate, the buyer's lender and title insurer will require the estate trustee to produce a Certificate of Appointment of Estate Trustee — commonly called probate — before accepting the transfer. This certificate is issued by the Ontario Superior Court of Justice and confirms the court's recognition of the estate trustee's authority to act.</p>

<p>Probate in Ontario takes 3–12 months depending on the complexity of the application and the court's workload. Straightforward estates (clear will, no contested claims, all assets disclosed) move faster. Contested estates — where the will is challenged, or there's a dispute about who should be estate trustee — can take much longer.</p>

<p>The Estate Administration Tax paid at filing is approximately $15 per $1,000 of estate value above $50,000. On a $900,000 home, this is approximately $12,750, paid from estate funds at the time of filing the probate application.</p>

<h2>Step 3: Secure the Property and Maintain Insurance</h2>

<p>Between death and sale closing, the property must be:</p>

<ul>
  <li><strong>Secured:</strong> Change the locks. Collect all keys from anyone who has them. Notify neighbours or building management (for condos) of the death and who to contact.</li>
  <li><strong>Insured:</strong> Contact the existing insurer immediately after death. Standard homeowner's policies typically exclude coverage for vacant or estate properties after a defined period (often 30 days). Request a vacancy permit or estate coverage rider. If the insurer won't extend coverage, get a separate vacant property insurance policy. An uninsured vacant property that burns or floods during the estate process is a loss the beneficiaries bear entirely.</li>
  <li><strong>Maintained:</strong> Continue paying property taxes, utilities, and mortgage (if any). Property tax arrears create a lien on title that must be paid at closing.</li>
</ul>

<h2>Step 4: Obtain a Valuation</h2>

<p>A professional appraisal of the property's fair market value at the date of death is important for two reasons. First, it establishes the cost base for capital gains purposes — the estate's deemed disposition occurs at date-of-death fair market value, and the beneficiaries inherit at that value. Second, it gives the estate trustee a documented basis for the listing price and protects against claims from beneficiaries that the property was sold for less than its market value.</p>

<p>A Certified Residential Appraiser (AACI or CRA designation) produces the most legally defensible appraisal for estate purposes. A real estate agent's CMA (comparative market analysis) is not the same as an appraisal and may not be sufficient for tax or legal purposes.</p>

<h2>Step 5: List and Sell the Property</h2>

<p>Once probate is obtained, the estate trustee engages a real estate agent, signs the listing agreement on behalf of the estate, and manages the sale process. The sale proceeds on the same terms as any residential transaction — listing, showings, offers, conditional period, closing.</p>

<p>Some practical considerations specific to estate sales:</p>

<ul>
  <li><strong>Personal property:</strong> The house must be cleared of the deceased's personal belongings before or as a condition of sale (or the APS can include a provision that the buyer takes possession with contents). Estate sale companies and auction houses manage large-scale estate clearouts.</li>
  <li><strong>Disclosure:</strong> The estate trustee is obligated to disclose known material latent defects — the same disclosure rules that apply to any Ontario seller. "We don't know the history" is sometimes true for estate trustees, but any known conditions (past flooding, open permits, illegal units) must still be disclosed. Selling "as is" shifts patent defect risk to the buyer but doesn't eliminate disclosure of known latent defects.</li>
  <li><strong>Multiple beneficiaries:</strong> If multiple beneficiaries have interests in the estate and opinions differ on price or timing, the estate trustee has authority to make the decision — but keeping beneficiaries informed and getting their input reduces the risk of a post-sale dispute.</li>
</ul>

<h2>Step 6: Closing and Distributing Proceeds</h2>

<p>The estate lawyer handles closing, receiving funds from the buyer, discharging any existing mortgage on the property, paying outstanding property taxes and adjustments, deducting estate administration costs (legal fees, agent commission, appraisal fees), and distributing the net proceeds to beneficiaries as specified in the will or under intestacy law.</p>

<p>Capital gains from the deemed disposition at death are reported on the deceased's final tax return (the terminal return). If the property has appreciated beyond the date-of-death value between death and the eventual sale, the additional gain is reported in the estate's tax return for that year. Work with an accountant throughout — the timing and structure of the sale can have meaningful tax consequences.</p>

<p>Understanding <a href="/blog/how-do-i-sell-an-inherited-house">how to sell an inherited house</a> covers the broader estate sale process. For the tax-specific aspects, consult an accountant who handles estate matters regularly.</p>

<h2>FAQ</h2>

<h3>Can we sell the house before probate is complete?</h3>
<p>In some limited circumstances — particularly where title insurance can be arranged to bridge the gap — a sale can be agreed upon and accepted, with closing conditional on probate being obtained. However, most buyers and their lenders will not accept this risk without robust title insurance coverage. As a practical matter, obtaining probate before listing is advisable. If the estate needs to sell quickly, discuss the timing with your estate lawyer — some estates move faster through probate if the application is well-prepared.</p>

<h3>Who pays the mortgage on the deceased's home during the estate process?</h3>
<p>The estate is responsible for mortgage payments during administration. If the estate has insufficient liquid assets to cover mortgage payments while the house is being sold, the estate trustee may need to use proceeds from other estate assets, or negotiate with the lender. An unpaid mortgage results in the lender demanding payout and potentially power of sale proceedings — inform the lender of the death and the estate timeline promptly.</p>

<h3>What if a sibling is living in the deceased parent's home and won't leave?</h3>
<p>This is one of the most difficult estate situations. The sibling's right to remain depends on whether they had a tenancy agreement, a legal life interest, or informal arrangements. The estate trustee may need to apply to the court for an order directing vacant possession before the property can be sold. Get legal advice immediately — a sibling occupying an estate property without a recognized legal basis is a trespasser, but eviction still requires proper legal process in Ontario.</p>

<h3>Does the estate pay capital gains tax before distributing to beneficiaries?</h3>
<p>The capital gains on the deemed disposition are reported on the deceased's terminal return (for the gain up to date of death). Any additional gain between date of death and the eventual sale date is reported on the estate's own tax return for the year of sale. The Canada Revenue Agency requires that the estate obtain a clearance certificate (confirming all taxes are paid) before distributing assets — distributing without a clearance certificate can make the estate trustee personally liable for unpaid tax.</p>

<h3>How do we handle a home that has a reverse mortgage?</h3>
<p>A reverse mortgage becomes due on the death of the borrower. The lender (typically HomeEquity Bank in Canada) must be notified and will issue a payout statement. The loan must be repaid from the estate — typically from the sale proceeds. The lender usually allows a reasonable period (often 6–12 months) for the estate to sell the property and repay the loan before exercising their security. Notify the reverse mortgage lender immediately after death and communicate the estate's timeline for selling.</p>`,
  },
  {
    title: 'Should I Buy First or Sell First in the GTA?',
    slug: 'should-i-buy-first-or-sell-first',
    summary: 'In the GTA, selling first is the lower-risk choice for most homeowners — you know your budget, avoid double mortgage risk, and negotiate from a stronger position. Buying first makes sense in specific market conditions with the right financial cushion.',
    metaDescription: 'Should you buy first or sell first in the GTA? The pros and cons of each strategy, bridge financing, market timing, and what most Toronto homeowners actually do.',
    body: `<!-- Primary keyword: should I buy first or sell first | Intent: informational | Word count target: 2000 -->

<p>The decision to buy first or sell first is one of the most practically consequential choices in moving to your next home. Both strategies involve real tradeoffs, and the right answer depends on your financial position, the current GTA market conditions, how confident you are in your timeline, and your tolerance for risk. This guide lays out the honest tradeoffs for GTA homeowners facing this decision in 2025.</p>

<h2>The Core Risk of Each Strategy</h2>

<p><strong>Sell first, then buy:</strong> You know exactly what you'll net from the sale before committing to a purchase. The risk is that you may not find your next home quickly enough — potentially needing short-term rental accommodation between selling and buying.</p>

<p><strong>Buy first, then sell:</strong> You secure your next home before losing your current one. The risk is carrying two mortgages if your sale takes longer than expected — and not knowing your exact sale proceeds until it's sold, which can leave your finances overextended.</p>

<p>In the GTA, the consequences of each risk are asymmetric. The cost of temporary rental accommodation (2–4 months between sale and purchase) is predictable and bounded. The cost of carrying two mortgages in a market where your sale stalls — while managing two sets of carrying costs, property taxes, and maintenance — can be severe.</p>

<h2>The Case for Selling First</h2>

<p><strong>You know your budget:</strong> Once your home sells and closes, you know exactly how much equity you're working with. You can make offers on your next property from a position of certainty — your offer isn't contingent on selling, and sellers take it more seriously.</p>

<p><strong>No bridge financing risk:</strong> Bridge financing is available in Ontario (lenders will advance funds to cover the gap when your purchase closes before your sale), but it's expensive (prime plus 2–3%) and requires that both a firm sale and firm purchase are in place. If your purchase closes before your sale and the sale then falls through, you're carrying a bridge loan on a failed deal — a very stressful financial position.</p>

<p><strong>No double mortgage risk:</strong> The worst-case scenario in buying first is being stuck with two mortgages for months. In a slow market where your home takes 60–90 days to sell, you're paying two mortgage payments, two sets of property taxes, two insurance bills. For most GTA households, this is a serious cash flow problem.</p>

<p><strong>Stronger negotiating position:</strong> When your current home is sold — or even better, when it's sold and closed — you make offers on your next home without a sale condition. Home sale conditions are rare in the GTA and make offers significantly less competitive. A seller who has three offers will almost always choose a firm offer over one conditioned on the buyer selling their current home.</p>

<h2>The Case for Buying First</h2>

<p><strong>You've found the right property:</strong> In competitive GTA markets, the right property for your needs may not come up again soon. If a specific home in a specific school catchment or neighbourhood is what you need, and it's available now, buying first allows you to secure it rather than waiting for your sale to close and hoping something comparable appears.</p>

<p><strong>Market conditions favour buyers:</strong> In a buyer's market — where inventory is high, days on market are long, and sellers are motivated — you have time. A buyer's market also means your home may be slower to sell, but you have more negotiating room on your purchase and more time to sell. The two sides of a buyer's market balance out more than they do in a seller's market.</p>

<p><strong>You have the financial capacity:</strong> If you have significant liquid assets, a large existing equity position, or income that comfortably supports two sets of carrying costs for several months, buying first is more viable. The strategy's risk is directly proportional to your financial buffer. A household that can carry two properties for six months without financial strain faces a very different risk profile than one living paycheck to paycheck.</p>

<p><strong>Short closing on the purchase:</strong> If your purchase closes in 60 days and you list your current home immediately, you may have both transactions complete within weeks of each other. Short overlaps, with a bridge loan arranged, are manageable. The problem arises with longer overlaps and longer-than-expected sale timelines.</p>

<h2>Bridge Financing — What It Is and What It Costs</h2>

<p>Bridge financing is a short-term loan that covers the gap between closing on your purchase and receiving the proceeds from your sale. In Ontario, bridge financing is available through most major lenders, but only when both a firm sale (on your current home) and firm purchase (on your next home) are in place. You cannot get bridge financing on an unsold home — you need a signed, firm APS with a closing date to qualify.</p>

<p>Bridge loan rates in Canada typically run prime plus 2–3%, with additional lender fees of $200–$500. On a $500,000 bridge loan for 60 days at 9% (approximate prime + 2% in 2025), the interest cost is approximately $7,500. Add lender fees and legal costs, and a bridge loan for two months might cost $8,000–$10,000 total. That's a predictable, bounded cost — worth it to secure the right home if both deals are firm.</p>

<h2>Home Sale Conditions in GTA Offers</h2>

<p>A home sale condition (condition that the offer is conditional on the buyer selling their existing home) is rarely accepted in competitive GTA markets. Sellers with multiple offers will not accept a sale condition when firm offers exist. Even in slower markets, home sale conditions make your offer substantially weaker — the seller can't move forward confidently with their own plans while your sale remains uncertain.</p>

<p>For most GTA buyers, submitting an offer conditional on selling is only viable in very slow markets or when buying a property with little competing interest. In Toronto, Markham, Richmond Hill, Aurora, and Newmarket, expect home sale conditions to be rejected in most multiple-offer situations and treated skeptically in single-offer situations.</p>

<h2>The GTA Strategy Most Homeowners Use</h2>

<p>The most common approach for GTA move-up buyers is: list and sell first, negotiate a long closing (60–90 days) on the sale, and actively search for their next property during the conditional period and after the sale goes firm. If they find their next home before the sale closes, they coordinate the closing dates (purchase closing after the sale proceeds are received) or arrange bridge financing for a short overlap.</p>

<p>This approach balances certainty (you know your sale price and equity) with flexibility (the 60–90 day closing gives you time to find the right next home). Many GTA sellers also rent temporarily for 1–3 months between sale closing and purchase closing — a deliberate choice to remove the pressure of a simultaneous transaction and buy from a position of strength.</p>

<p>For the other side of this decision, see our guide on <a href="/blog/should-i-buy-before-selling-my-home">whether to buy before selling</a>.</p>

<table>
  <thead>
    <tr>
      <th>Factor</th>
      <th>Sell first</th>
      <th>Buy first</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Budget certainty</td>
      <td>High — you know your equity</td>
      <td>Low — sale price unknown</td>
    </tr>
    <tr>
      <td>Offer competitiveness</td>
      <td>High — no sale condition needed</td>
      <td>Varies — may need sale condition</td>
    </tr>
    <tr>
      <td>Double mortgage risk</td>
      <td>None</td>
      <td>High if sale delayed</td>
    </tr>
    <tr>
      <td>Temporary housing needed</td>
      <td>Possibly (2–4 months)</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Bridge financing needed</td>
      <td>Rarely</td>
      <td>Often</td>
    </tr>
    <tr>
      <td>Best market conditions</td>
      <td>Any market</td>
      <td>Buyer's market with financial buffer</td>
    </tr>
  </tbody>
</table>

<p>Ready to explore what's on the market? <a href="/homes-for-sale/toronto">Browse GTA listings on Condohill</a> to understand your options before committing to either strategy.</p>

<h2>FAQ</h2>

<h3>Can I make an offer on a new home before my current home is sold?</h3>
<p>Yes. You can make an offer on a new home at any time. The issue is whether that offer includes a home sale condition — and whether the seller will accept it. In most competitive GTA situations, your offer will be significantly stronger without a sale condition. Many buyers list their current home, accept an offer (possibly with a longer closing), and then pursue their purchase in parallel — bridging the gap if needed.</p>

<h3>What happens if I buy first and can't sell my home?</h3>
<p>You carry two mortgages and two sets of costs until you sell — or until you can no longer sustain the carrying costs and must sell under pressure, potentially below market value. In extreme cases, mortgage default is the risk. This scenario is rare for homeowners with substantial equity in established GTA neighbourhoods, but it has occurred for buyers who overextended. The financial buffer available matters enormously.</p>

<h3>How do I handle the timeline if my purchase closes before my sale?</h3>
<p>Arrange bridge financing — you need both a firm sale and a firm purchase in hand to qualify. Your real estate lawyer coordinates the bridge loan with your lender. The loan covers the gap between your purchase closing and sale closing. Bridge financing costs are predictable — get a quote from your lender when both deals are firm to understand the total cost.</p>

<h3>Is it ever smart to use a home sale condition in the GTA?</h3>
<p>In slow markets with significant days on market, motivated sellers, and low competition — yes, a home sale condition can be accepted. In a seller's market or any situation with multiple interested buyers, a home sale condition is effectively a disqualifier. Assess the specific property and market before deciding whether to include it. Your agent will have current insight on how sellers and their agents are responding to conditions in the specific neighbourhood.</p>

<h3>What is a reasonable overlap period between selling and buying in the GTA?</h3>
<p>One to four weeks is a manageable overlap for bridge financing. Two to three months in rental between sale and purchase is a viable strategy that eliminates bridge financing entirely. More than four to six months of double carrying costs starts to be financially painful for most households. Plan the closing dates on both transactions with your specific financial position in mind — there's no universal "right" overlap, only one that fits your cash flow and tolerance.</p>`,
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
