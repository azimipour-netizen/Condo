/**
 * Run on VPS: node scripts/seed-posts-buyer-guide-2.mjs
 */
import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const envPath = join(__dirname, '..', '.env')
  const envContent = readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
} catch {}

import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const posts = [
  {
    title: 'What Should I Look for When Viewing a House?',
    slug: 'what-to-look-for-when-viewing-a-house',
    summary: 'A room-by-room checklist for evaluating a property during a showing — what to look at, what to listen for, and what questions to ask yourself.',
    metaDescription: 'GTA buyer guide: what to look for when viewing a house. Room-by-room checklist covering structure, systems, lot, and red flags to catch before making an offer.',
    body: `<p>Most buyers spend 20–30 minutes at a showing and leave with a feeling — "I love it" or "not quite" — without a systematic record of what they actually saw. A structured viewing approach helps you compare properties objectively and catch problems that emotion tends to skip over.</p>

<h2>Start outside before you go in</h2>
<p>Walk the perimeter of the lot before entering. Check the grading: the ground should slope away from the foundation on all sides. Flat or inward-sloping ground channels water toward the basement — one of the most common and costly problems in older Toronto homes. Look at the roof from the street: missing shingles, sagging ridgelines, and heavy moss growth are visible from the curb. Note the age of the roof if the listing doesn't disclose it — a standard asphalt shingle roof lasts 20–25 years, and replacement runs $10,000–$20,000 depending on the home.</p>
<p>Check the driveway and any shared fencing. Look at neighbours' properties — deferred maintenance on either side can indicate a street with lower owner occupancy or a neighbourhood in transition, depending on what you're looking for.</p>

<h2>Foundation and basement</h2>
<p>Go to the basement first, before you fall in love with the kitchen. Look at the foundation walls for horizontal cracks (a structural concern — soil pressure pushing inward), vertical cracks (usually settling, less serious), and white mineral deposits called efflorescence (evidence of past water infiltration). Smell matters: musty or damp air suggests chronic moisture. Check for water stains along the base of walls and around the floor drain. Ask when the waterproofing was last done.</p>

<h2>Mechanicals: furnace, water heater, electrical panel</h2>
<p>Find the utility room. Note the age of the furnace — printed on the data plate — and whether it's forced air gas (standard) or something else. Older furnaces (15+ years) are approaching end of life. A mid-efficiency furnace replacement costs $4,000–$7,000; high-efficiency runs $6,000–$10,000 installed. Check the water heater age (also on the data plate) — owned tanks last 10–15 years, rental tanks are cheaper upfront but carry a monthly cost.</p>
<p>Look at the electrical panel. Federal Pacific and Zinsco panels — common in homes built before 1990 — have documented safety concerns and may be flagged by insurers. Knob-and-tube wiring (pre-1950 homes) is another insurer concern. If you see these, factor replacement into your budget estimate.</p>

<h2>Kitchen and bathrooms</h2>
<p>Turn on faucets and check water pressure. Look under the kitchen sink for water stains or soft cabinet material around the pipes — signs of a slow leak. In bathrooms, press gently on the wall tiles around the tub and shower: soft or hollow-sounding tiles indicate moisture behind the wall, which can mean mould and substrate damage. Check the caulk condition — re-caulking is cheap, but deteriorated caulk that's been ignored often means more expensive repairs beneath.</p>

<h2>Windows, doors, and insulation</h2>
<p>Fog or moisture inside double-pane windows means the seal has failed — the window still functions but loses its insulating value. Failed seals on all windows in a house is a $10,000–$20,000 replacement project depending on window count. Check that doors open and close squarely — racking can indicate settling or structural movement. Feel window frames and exterior wall corners in winter for cold drafts, which signal insulation gaps.</p>

<h2>Attic</h2>
<p>If possible, get a look in the attic. You're checking for adequate insulation (R-50 is current Ontario code; older homes often have much less), proper ventilation (soffit-to-ridge airflow prevents ice dams and moisture buildup), and signs of past or current roof leaks (staining on the sheathing). Vermiculite insulation, common in homes built before 1990, may contain asbestos — don't disturb it and flag it for the home inspector.</p>

<h2>What to record at every showing</h2>
<p>Take photos of every room, the mechanical room, the basement walls, and anything unusual. Note your gut sense of room proportions, natural light, and traffic noise — things photos don't capture. Record the address, asking price, list date, and your initial price estimate. After six showings, memory collapses; notes don't.</p>
<p>A viewing is not an inspection. You're making a go/no-go decision about submitting an offer, not assessing the full condition of the property. If you proceed, a home inspection by a qualified OAHI or PHIA member is the right tool for the detailed assessment.</p>`,
  },
  {
    title: 'What Should I Ask at a Home Showing?',
    slug: 'what-to-ask-at-a-home-showing',
    summary: 'The most important questions to ask the listing agent at a showing — about the property, the sellers, and what the listing doesn\'t disclose.',
    metaDescription: 'What to ask at a home showing in Toronto. Key questions for the listing agent about price history, sellers\' situation, known defects, and what\'s included.',
    body: `<p>Everything the listing agent tells you at a showing is information you can use when structuring your offer. Most buyers treat showings as tours; experienced buyers treat them as intelligence-gathering sessions.</p>

<h2>About the sellers' situation</h2>
<p><strong>Why are the sellers moving?</strong> The answer isn't always forthcoming, but it's worth asking. A job relocation or an estate sale signals a motivated seller. A vague answer ("they found their next home") often just confirms they're move-up buyers, which is neutral.</p>
<p><strong>Where are the sellers going?</strong> If they've already bought and closed on their next home, they're carrying two mortgages and are more motivated to close quickly and at price. If they haven't found anything yet, they may want a longer closing or a leaseback arrangement.</p>
<p><strong>Has the listing been reduced?</strong> This is visible on the listing history in TRREB data your agent can pull. Reductions signal that the original price was too aggressive or the property has been sitting. Either way, it gives you negotiating context.</p>

<h2>About the property</h2>
<p><strong>How long has it been listed?</strong> Days on market (DOM) is publicly visible, but ask the agent for the full history including any re-listings. A property that was listed six months ago, withdrawn, and relisted as "new" has more market time than the current DOM shows.</p>
<p><strong>Are there any known defects or material latent defects?</strong> In Ontario, sellers are required to disclose known material latent defects — problems not visible on a normal inspection that make the property unfit for habitation or unsafe. The listing agent should have a seller property information statement (SPIS) if one was prepared, though completion of a SPIS is voluntary. Ask directly. If the agent deflects, note that.</p>
<p><strong>Has there ever been water in the basement?</strong> This is a specific follow-up worth asking separately from the general defects question. Water damage is one of the most common undisclosed issues in Toronto's older housing stock.</p>
<p><strong>When were the major systems last updated?</strong> Furnace, roof, windows, electrical. If the agent doesn't know, that's an answer too — sellers who have recently invested in upgrades usually want buyers to know.</p>
<p><strong>What's included in the sale?</strong> Appliances, light fixtures, window coverings, hot water tank (owned vs. rented), and any rental equipment (furnace, air conditioner, alarm system) should be confirmed. Rental equipment transfers with the property but carries its monthly obligation.</p>

<h2>About the market context</h2>
<p><strong>Have there been any offers?</strong> If offers have been presented and rejected, ask what the disconnect was — price, conditions, closing date. This helps you calibrate whether the gap between expectations and market reality has already been established.</p>
<p><strong>Is there an offer date?</strong> Many Toronto listings set a specific offer date to accumulate competing bids. If there is one, you need to be ready to submit by that deadline. If there isn't one, the seller is accepting offers as they come, which changes the dynamic entirely.</p>
<p><strong>What closing date works for the sellers?</strong> Aligning with the sellers' preferred closing date can make an otherwise equal offer more attractive at no additional cost to you.</p>

<h2>What you won't get answered — and why that's fine</h2>
<p>The listing agent represents the sellers. They are not obligated to share negotiating strategy, the sellers' bottom-line price, or anything that would disadvantage their client. A good listing agent will answer factual questions about the property and be transparent about the process; they won't give you inside information. Treat what they tell you as useful input, not the full picture, and work with your own agent to fill the gaps.</p>`,
  },
  {
    title: 'What Should I Inspect Before Buying a Home?',
    slug: 'what-to-inspect-before-buying-a-home',
    summary: 'Everything that should be assessed before you firm up on a purchase — from standard home inspections to specialized tests for older GTA properties.',
    metaDescription: 'What to inspect before buying a home in Toronto. Covers home inspection, WETT, ESA, sewer scope, asbestos, lead paint, and what each test reveals.',
    body: `<p>A standard home inspection is essential, but it's not always sufficient. Depending on the property's age, type, and history, additional specialized inspections may be warranted. Here's what to consider before you waive conditions or firm up a deal.</p>

<h2>The standard home inspection</h2>
<p>A qualified home inspector — look for OAHI (Ontario Association of Home Inspectors) or PHIA (Professional Home Inspectors of Canada) membership — evaluates the visible, accessible components of the property: roof, foundation, structure, exterior, attic, insulation, windows, doors, plumbing, electrical, HVAC, and interior. The inspection takes 2–4 hours depending on property size and produces a written report with findings categorized by severity.</p>
<p>Cost: $400–$600 for a standard single-family home in the GTA. Worth it on every purchase, without exception.</p>
<p>What it doesn't cover: anything behind walls, under concrete, or otherwise inaccessible. The inspector can note suspicion of hidden problems but cannot open walls to verify them.</p>

<h2>WETT inspection (wood-burning fireplaces and wood stoves)</h2>
<p>If the property has a wood-burning fireplace, insert, or wood stove, a WETT (Wood Energy Technology Transfer) inspection by a certified WETT inspector confirms the installation meets safety standards and the chimney is in serviceable condition. Most home insurers require a WETT certificate for wood-burning appliances. Cost: $200–$400.</p>

<h2>ESA inspection (older electrical systems)</h2>
<p>Homes with knob-and-tube wiring, aluminum branch circuit wiring (common in homes built 1965–1975), or Federal Pacific/Zinsco panels may have difficulty getting or renewing home insurance. An Electrical Safety Authority (ESA) inspection establishes the current condition of the electrical system and what would need to be brought up to code. Cost varies; call the ESA directly for current rates.</p>

<h2>Sewer scope (homes built before 1975)</h2>
<p>A camera inspection of the sewer lateral — the pipe running from the house to the city main — is particularly valuable for older GTA homes. Clay or concrete pipes from the mid-20th century may be cracked, root-invaded, or partially collapsed. A sewer scope costs $200–$400 and can reveal a $5,000–$20,000 problem before you own it. Highly recommended for any detached or semi-detached home built before 1975.</p>

<h2>Asbestos testing</h2>
<p>Homes built before 1990 may contain asbestos-containing materials: ceiling tiles, floor tiles, pipe insulation, attic vermiculite, drywall compound, and textured ceiling finishes were all common applications. Asbestos is not hazardous if undisturbed and in good condition, but it becomes a concern during renovations. If you're buying an older home with plans to renovate, an asbestos assessment by an accredited environmental consultant tells you what you're working with. A visual assessment costs $300–$600; bulk sampling and lab analysis adds to that.</p>

<h2>Lead paint testing</h2>
<p>Lead-based paint was used in Canadian homes until the late 1970s. Like asbestos, it's generally not a concern unless disturbed. If you have young children, or plan to renovate and sand painted surfaces, an XRF (X-ray fluorescence) lead paint test is a non-destructive way to identify lead-containing coatings before work begins. Cost: $300–$500.</p>

<h2>Radon testing</h2>
<p>Radon is a naturally occurring radioactive gas that enters homes through the foundation. Health Canada considers 200 Bq/m³ the action level — above which mitigation is recommended. Radon levels vary significantly even between adjacent properties. A long-term radon test (90-day minimum for reliable results) costs $30–$60 for a DIY kit from Health Canada's list of approved devices. Mitigation systems for elevated radon cost $1,500–$3,500 installed.</p>

<h2>What to prioritize</h2>
<p>Every purchase should have a standard home inspection. Add WETT if there's a wood-burning appliance; add a sewer scope for any pre-1975 detached or semi; add asbestos assessment if renovation is planned. The cost of these additional tests is trivial relative to what they can reveal.</p>
<p>In a competitive market where conditions are sometimes waived, some buyers arrange pre-offer inspections — visiting the property with an inspector before submitting an offer. This allows you to make a firm offer while still understanding the property's condition. Not all sellers permit pre-offer inspections; ask before booking.</p>`,
  },
  {
    title: 'How Do I Make an Offer on a House?',
    slug: 'how-to-make-an-offer-on-a-house',
    summary: 'How the offer process works in Ontario — what goes into an Agreement of Purchase and Sale, how to submit, and what happens next.',
    metaDescription: 'How to make an offer on a house in Ontario. Covers the Agreement of Purchase and Sale, purchase price, deposit, conditions, closing date, and what to expect.',
    body: `<p>Making an offer on a house in Ontario is a formal legal process. The document you sign is the Agreement of Purchase and Sale (APS) — a binding contract that, once signed by both parties, commits you to the transaction. Here's how it works.</p>

<h2>The Agreement of Purchase and Sale</h2>
<p>The APS is OREA's standard form, used province-wide. Your buyer's agent drafts it, and it includes:</p>
<p><strong>Purchase price:</strong> The amount you're offering to pay. Your agent will advise based on recent comparable sales (comps) in the area — properties that are similar in size, type, condition, and location that have sold in the past 60–90 days.</p>
<p><strong>Deposit:</strong> The amount you'll deliver within 24 hours of the offer being accepted. Standard deposit in the GTA is 5% of the purchase price. The deposit is held in trust by the listing brokerage and applied to your down payment on closing. It's not the same as the down payment — it's a component of it.</p>
<p><strong>Closing date:</strong> The date you take legal ownership. In the GTA, typical closing periods are 30–90 days from the acceptance date, though this is negotiable. Aligning with what the seller wants in terms of timing can make your offer more competitive.</p>
<p><strong>Conditions:</strong> Clauses that give you the right to exit the deal under specified circumstances within a set timeframe. Common conditions include financing (you have X business days to confirm your mortgage) and home inspection (you have X business days to conduct an inspection and either proceed or walk away).</p>
<p><strong>Included items (chattels and fixtures):</strong> What stays with the property. Appliances, light fixtures, window coverings, garage door openers, and any rental equipment should be explicitly listed. If it's not in the agreement, it doesn't legally come with the house.</p>
<p><strong>Excluded items:</strong> Anything the seller is taking that you might expect to stay. A dining room chandelier the sellers want to keep, for example, should be listed as excluded.</p>

<h2>Submitting the offer</h2>
<p>Your agent presents the offer to the listing agent, either electronically (standard now) or in person. If there's a scheduled offer date — a common strategy in Toronto where the seller sets a specific time to review all offers — your offer must be submitted by that deadline. If the property is accepting offers as they come, your agent submits as soon as you're ready.</p>
<p>Once submitted, the seller has until your irrevocable date and time to accept, reject, or counter. The irrevocable clause is typically 24–48 hours but can be set to whatever both parties agree.</p>

<h2>What happens next</h2>
<p>The seller has three options: accept your offer as written, reject it outright, or sign it back with changes (a counter-offer). A sign-back is itself an offer — it has its own irrevocable deadline, and you can accept, reject, or counter again. This back-and-forth continues until either both parties reach agreement or one party walks away.</p>
<p>Once both parties have signed the agreement, it's "accepted." If your offer includes conditions, the conditional period begins immediately. You have until the expiry of each condition to either fulfill and waive it, or exercise the condition and walk away with your deposit returned.</p>
<p>When all conditions are waived, the deal is "firm" — both parties are legally committed to close on the agreed date.</p>

<h2>The deposit</h2>
<p>The deposit is typically due within 24 hours of the seller signing back or accepting your offer, delivered by bank draft, certified cheque, or wire transfer to the listing brokerage's trust account. Missing the deposit deadline can put you in breach of the agreement. Ensure you have the funds accessible before submitting — not in a GIC or investment account with a withdrawal timeline.</p>

<h2>Do you need a buyer's agent?</h2>
<p>In Ontario, buyer representation is effectively free to you — the seller pays total commission, which is split between the listing agent and your buyer's agent. An experienced buyer's agent advises on pricing, negotiation strategy, conditions and terms, and coordinates all parties through to closing. There is no meaningful financial reason to navigate the process unrepresented.</p>`,
  },
  {
    title: 'What Makes a Strong Offer in a Competitive Market?',
    slug: 'what-makes-a-strong-offer-in-a-competitive-market',
    summary: 'How to structure an offer that stands out in a multiple-offer situation — price, deposit, conditions, closing date, and what actually moves sellers.',
    metaDescription: 'What makes a strong offer in a competitive Toronto market. Learn how price, deposit size, conditions, closing date, and offer structure affect your chances.',
    body: `<p>In a competitive GTA market, the difference between winning and losing a multiple-offer situation often comes down to factors beyond just price. Here's what actually moves sellers when more than one offer is on the table.</p>

<h2>Price: the obvious factor</h2>
<p>Offering above asking price in a competitive situation is common in Toronto, but "how much over" depends entirely on the property and the market at that moment. Your agent should prepare a comparative market analysis (CMA) showing recent sales of similar properties. If two comparable homes sold at $50,000 over list last week, that's your benchmark — asking price is often deliberately set below market value to generate competing interest.</p>
<p>Avoid round-number escalations. Offering $805,000 instead of $800,000 can be the difference in a tie, and there's no additional cost if you were prepared to go to $810,000 anyway.</p>

<h2>Deposit: demonstrates credibility</h2>
<p>A larger deposit signals financial strength and seriousness. While 5% is standard, offering 10% on a competitive property sends a message. The deposit comes out of your down payment — it's money you were spending anyway, just delivered earlier. Sellers (and their agents) notice.</p>

<h2>Conditions: the biggest variable</h2>
<p>Conditions reduce certainty for the seller. A firm offer (no conditions) is, all else being equal, stronger than a conditional one. In competitive situations, some buyers waive the home inspection condition and/or the financing condition to make their offer more competitive.</p>
<p>This carries real risk. Waiving financing means you're committed even if your lender doesn't approve this specific property. Waiving inspection means you accept the property's condition as-is. Before doing either, have your pre-approval in solid shape and consider a pre-offer inspection — visiting the property with an inspector before submitting, if the seller permits it.</p>
<p>If you're not prepared to waive conditions entirely, tightening the condition windows helps: 3 business days for home inspection instead of 5, and 5 business days for financing instead of 10, signals confidence without eliminating your protection.</p>

<h2>Closing date: alignment beats speed</h2>
<p>A closing date that works for the seller's timeline is often worth more than an extra few thousand dollars. Ask your agent to find out the seller's preferred timing before submitting. If they need 90 days to close on their next purchase, offering 30 days creates a logistical problem — even if your price is higher. Matching their date costs you nothing.</p>

<h2>Clean terms</h2>
<p>Avoid unusual requests in the chattels list — asking the seller to leave specific furniture, requesting early access, or adding complex clauses can put sellers off. A clean agreement — standard chattels, no extras — reads as easier to deal with.</p>

<h2>Escalation clauses</h2>
<p>An escalation clause says: "I offer $X, and I will beat any other bona fide offer by $Y, up to a maximum of $Z." It allows you to submit a competitive offer without having to guess the exact clearing price. In Ontario, the use and enforceability of escalation clauses is established, but some listing agents refuse to accept them — confirm acceptability with your agent before including one.</p>

<h2>The cover letter</h2>
<p>Some buyers include a personal letter to the sellers. In theory, sellers should evaluate offers on their merits; in practice, a genuine, specific letter — connecting you to the home rather than applying generic sentiments — sometimes influences a decision when two offers are close. Don't fabricate a connection. If you mean it, write it. If you don't, skip it.</p>

<h2>What doesn't help</h2>
<p>Submitting multiple lowball offers hoping one sticks, including trivial exclusion requests, asking for unusual possession arrangements without knowing the seller's situation, and including excessive conditions with short timelines that suggest you plan to use them as escape hatches rather than real safeguards — experienced listing agents read these signals and advise sellers accordingly.</p>`,
  },
  {
    title: 'How Much Should I Offer on a House?',
    slug: 'how-much-should-i-offer-on-a-house',
    summary: 'How to determine the right offer price for a property — reading comparable sales, understanding list price strategy, and when to go over vs. under asking.',
    metaDescription: 'How much to offer on a house in Toronto. How to read comparable sales, understand list price strategy, and decide whether to go over or under asking price.',
    body: `<p>List price in the GTA is a marketing decision, not a valuation. Understanding the difference between what a property is listed for and what it's worth — and why those numbers are often deliberately different — is the foundation of pricing an offer correctly.</p>

<h2>How to find what a property is actually worth</h2>
<p>Market value is established by recent comparable sales — properties similar to the subject home in size, age, condition, location, and property type that have sold in the past 60–90 days. Your buyer's agent pulls this data from TRREB's MLS database, which contains actual sale prices (not list prices). This is the CMA (Comparative Market Analysis) or "comps."</p>
<p>Good comps adjust for differences between properties: a finished basement adds value; a busy road location typically detracts; an updated kitchen relative to dated comparables warrants a premium. A well-prepared CMA gives you a price range — not a single number — within which the property should reasonably trade.</p>

<h2>Why list price doesn't equal market value</h2>
<p>In Toronto's market, two pricing strategies are common:</p>
<p><strong>Underpricing to generate multiple offers:</strong> A property is listed below its estimated market value to attract a broad pool of buyers, create perceived competition, and drive offers above asking through a competing-bid situation. A detached in a high-demand neighbourhood listed at $999,000 when comparables suggest $1.2M is designed to sell for $1.2M–$1.3M, not $999,000. Offering asking price on this listing is significantly below market.</p>
<p><strong>Overpricing in hope:</strong> The opposite — listing above what the market will bear, expecting to negotiate down. These listings sit. Days on market accumulates, price reductions follow, and the eventual sale price often comes in below what a properly priced listing would have achieved. Offering below asking on these properties is appropriate.</p>
<p>Your agent's CMA tells you which situation you're in. If the list price looks low relative to comparable sales, expect competition and price accordingly. If it looks high, there's room to negotiate.</p>

<h2>In a competitive market</h2>
<p>When you expect multiple offers, the comps establish your starting point, but you also need to think about what you're willing to pay to win. The question isn't "what is it worth?" in isolation — it's "what is the clearing price likely to be, and is that price acceptable to me?"</p>
<p>Have a hard ceiling before you walk into a competing-bid situation. Write it down. The emotional intensity of a multiple-offer scenario creates pressure to exceed your own limits. Know your number in advance and don't exceed it — the next comparable property will come along.</p>

<h2>In a soft market</h2>
<p>When properties are sitting and list prices are already being reduced, the seller's original pricing expectations are often misaligned with the market. Coming in at 95% of asking — or lower for a property with significant deferred maintenance — is reasonable and commonly accepted. Research the price history: was the property listed higher and reduced? How many times? How long has it been on market?</p>

<h2>The deposit as a signal</h2>
<p>Your offer price and deposit work together. A strong price paired with a small deposit sends mixed signals. Pair a competitive price with a meaningful deposit (5–10%) to present a coherent offer.</p>

<h2>Appraisal risk in a competitive purchase</h2>
<p>If you're financing and you bid significantly over asking, there's a risk that your lender's appraisal comes in below your offer price. If the appraisal is $50,000 below what you offered, the lender's mortgage is calculated on the appraised value — you have to make up the difference in cash. Know your lender's appraisal policy and have a plan for this scenario before you submit a high offer.</p>`,
  },
  {
    title: 'Can I Negotiate the Price of a Home?',
    slug: 'can-i-negotiate-the-price-of-a-home',
    summary: 'When and how to negotiate on a home purchase in the GTA — what levers you have, when sellers accept less, and how to negotiate without losing the deal.',
    metaDescription: 'Can you negotiate the price of a home in Toronto? When sellers accept less, what gives you leverage, and how to negotiate without losing the deal.',
    body: `<p>Yes — in most situations. But negotiating effectively requires understanding when you have leverage and what form that leverage takes. The approach that works on a property sitting after 60 days on market is very different from the approach on a hot property with an offer date.</p>

<h2>When you have the most leverage</h2>
<p><strong>Long market time:</strong> Properties that have been listed for 30+ days without selling are priced above what buyers are willing to pay at current conditions. The longer a listing sits, the more motivated the seller typically becomes. Days on market is publicly visible; your agent can also pull the full listing history, including previous attempts to sell.</p>
<p><strong>Multiple price reductions:</strong> A property that's been reduced one or more times signals that the original price was wrong. Each reduction is evidence that the seller's expectations have adjusted — and that there's been no competing interest at higher prices.</p>
<p><strong>Known seller motivation:</strong> A relocation, an estate sale, a separation, or two mortgages creates urgency. When sellers need to close, they become more flexible on price to get certainty.</p>
<p><strong>Property condition issues:</strong> If your home inspection identifies significant deferred maintenance — a roof at end of life, an old furnace, water infiltration — you have grounds to renegotiate price or request a price adjustment to account for the remediation cost. This is common and accepted practice in Ontario.</p>

<h2>What you can negotiate beyond price</h2>
<p>Price is the most obvious lever, but not the only one. Closing date, included items, rental equipment buyouts, and repair credits are all negotiable. Sometimes a seller who won't move on price will agree to a closing date that costs them carrying costs — effectively the same thing economically. Know what matters to you and negotiate the whole package, not just the number.</p>

<h2>How to negotiate without killing the deal</h2>
<p>The goal is to reach agreement, not to win. Coming in significantly below asking without a credible rationale damages the negotiation and can cause the seller to disengage. A low offer that comes with comparable sales data supporting your price — attached to the offer, or explained in a cover communication from your agent — is more likely to be taken seriously than a bare number.</p>
<p>Counter-offers should move incrementally, not in large jumps that signal you have a lot more room. If you start at $950,000 and immediately jump to $1,050,000 when countered, you've shown the seller your hand. Strategic counter-offers close the gap slowly, testing the seller's floor rather than revealing your ceiling.</p>

<h2>When negotiation doesn't work</h2>
<p>In a competitive market with multiple offers, negotiation on price typically doesn't happen — you're competing against other buyers, and the seller selects the best overall offer. Asking for a price reduction in this context signals that you're not a serious buyer. Read the market conditions correctly before attempting to negotiate down.</p>
<p>Similarly, trying to renegotiate price after a firm offer — after conditions are waived — is not standard practice in Ontario and can put you in a difficult legal and relational position with the seller. If you discover a major issue during your conditional period, exercise the condition (walk away) or negotiate before you waive. Don't firm up and then re-open.</p>

<h2>Post-inspection negotiation</h2>
<p>One of the most common and legitimate points of negotiation in Ontario is the post-inspection discussion. Your inspector identifies $15,000 in deferred maintenance. You ask for a price reduction or a repair credit. This is standard and accepted — it's not starting over, it's a condition of proceeding. The seller can agree, counter, or hold firm. If they hold firm and the condition hasn't expired, you can walk away with your deposit returned.</p>`,
  },
  {
    title: 'What Conditions Should Be Included in an Offer?',
    slug: 'what-conditions-should-be-in-an-offer',
    summary: 'The standard conditions in a GTA real estate offer — what each one protects you from, how long they should run, and when it\'s reasonable to waive them.',
    metaDescription: 'What conditions to include in a real estate offer in Ontario. Covers financing, home inspection, status certificate, and when waiving conditions makes sense.',
    body: `<p>Conditions in an Agreement of Purchase and Sale are clauses that give you the right to exit the deal under specific circumstances within a set timeframe. Each condition you include reduces your offer's attractiveness to the seller; each one you waive reduces your protection as a buyer. Understanding what each condition does helps you make an informed decision about which to include.</p>

<h2>Financing condition</h2>
<p>The most important condition for most buyers. It gives you a set number of business days — typically 5–10 — to confirm that a lender will advance the mortgage on this specific property at the terms you need. Even with a pre-approval, the lender still has to approve the specific property: they'll order an appraisal, review the building's status (for condos), and confirm the property meets their lending criteria.</p>
<p>What it protects: if your lender declines the mortgage on this property — because the appraisal comes in low, because the building has lender issues, or because your financial situation changed — you can walk away with your deposit returned.</p>
<p>When buyers waive it: when their pre-approval is strong and solid, the property is a standard type, and market conditions require a firm offer to compete. High risk — if you firm up and financing falls through, you could forfeit your deposit and face legal exposure.</p>

<h2>Home inspection condition</h2>
<p>Gives you a set number of business days (typically 3–5) to conduct a home inspection by a qualified inspector and review the report. If the inspection reveals issues you're unwilling to accept, you can walk away.</p>
<p>What it protects: unknown defects that aren't visible during a showing — aging mechanicals, water intrusion evidence, structural concerns, hazardous materials. Without this condition, you accept the property in its current state.</p>
<p>When buyers waive it: in competitive situations. To maintain some protection, arrange a pre-offer inspection — walk through the property with your inspector before submitting. Some sellers permit this; some don't. It gives you information without requiring a formal condition, allowing you to make a firm offer with at least partial knowledge of the property's state.</p>

<h2>Status certificate review (condos only)</h2>
<p>Required for any condominium purchase. The status certificate is a package of documents disclosing the condo corporation's financial health: reserve fund balance, operating budget, any pending special assessments, management agreements, insurance, and the rules and bylaws of the corporation. Your lawyer reviews it — not you — within the condition period (typically 3 business days after receipt).</p>
<p>What it protects: hidden financial problems at the condo corporation level — a reserve fund in deficit, a pending $25,000 special assessment per unit, litigation against the board. These are problems you'd inherit as the new owner.</p>
<p>This condition should never be waived. The status certificate review is cheap (included in your legal fees) and the downside of skipping it can be severe.</p>

<h2>Sale of existing property condition</h2>
<p>Allows you to back out if you can't sell your current home within a specified period. This protects you from owning two properties simultaneously. Sellers in competitive markets typically don't accept this condition, or accept it only with a 24–48 hour clause (if the seller receives another offer, you have 24–48 hours to either firm up or release the seller).</p>

<h2>Insurance condition</h2>
<p>Confirms you can obtain home insurance at a reasonable cost. Worth including for properties with older electrical systems (knob-and-tube, Federal Pacific panels), oil tanks (active or decommissioned), or a history of claims. Insurers may refuse to cover or charge significantly more for properties with these characteristics.</p>

<h2>How long should conditions run?</h2>
<p>Financing: 5 business days is standard; 10 is more comfortable. Home inspection: 3–5 business days. Status certificate: 3 business days after receipt (the seller has up to 10 days to provide it, so factor that in). Shorter condition windows signal confidence; longer ones give you more time but make your offer less attractive.</p>`,
  },
  {
    title: 'What Is a Conditional Offer?',
    slug: 'what-is-a-conditional-offer',
    summary: 'What a conditional offer means in Ontario real estate — how conditions work, what happens during the conditional period, and when a conditional deal becomes firm.',
    metaDescription: 'What is a conditional offer in Ontario real estate? How conditions work, what the conditional period means, and when a conditional deal becomes binding.',
    body: `<p>A conditional offer is an Agreement of Purchase and Sale that contains one or more conditions — clauses that give the buyer (or in some cases the seller) the right to exit the deal if certain circumstances arise before a specified deadline.</p>

<h2>How conditions work</h2>
<p>When a conditional offer is accepted by both parties, the deal is "accepted" but not yet "firm." The buyer has the right — and the obligation — to fulfill or waive each condition by its expiry date and time.</p>
<p>During the conditional period, the buyer investigates whatever the condition covers: arranging financing, conducting a home inspection, having a lawyer review a status certificate. At the end of that period, the buyer makes one of two choices:</p>
<p><strong>Waive the condition:</strong> Sign a document removing the condition from the agreement. This can happen before the deadline — you don't have to wait. Once waived, that condition no longer provides an exit.</p>
<p><strong>Exercise the condition:</strong> Notify the seller that you're unable or unwilling to fulfill the condition and are walking away. The deposit is returned to the buyer in full.</p>
<p>The key word is "or" — once a condition expires without being waived, the agreement is typically void. Deadlines must be respected.</p>

<h2>What a conditional period looks like in practice</h2>
<p>You submit an offer with a 5-business-day financing condition and a 3-business-day home inspection condition. The seller accepts on a Monday. You immediately:</p>
<ul>
<li>Book the home inspector for Tuesday or Wednesday</li>
<li>Send the accepted offer to your mortgage broker or lender</li>
</ul>
<p>By Wednesday, your inspector provides the report. You review it, discuss findings with your agent, and decide to proceed. You sign a waiver removing the home inspection condition. By the following Monday, your lender confirms the mortgage commitment. You sign a second waiver removing the financing condition. The deal is now firm.</p>
<p>Alternatively: the home inspector finds significant structural issues. You exercise the home inspection condition, notify the seller's agent, and your deposit is returned.</p>

<h2>The 24/48-hour clause (Escape Clause)</h2>
<p>If you have a condition for sale of your existing property, sellers often insert a 24 or 48-hour notice clause. This means: if the seller receives another offer while you're in your conditional period, they can notify you and give you 24–48 hours to waive your sale-of-property condition and firm up — or release them to take the new offer.</p>
<p>This clause allows sellers to continue marketing the property while giving you a conditional offer some priority. It's a compromise between seller protection and buyer flexibility.</p>

<h2>Can a seller accept another offer during your conditional period?</h2>
<p>Not unless your agreement includes the 24/48-hour clause. A standard conditional offer, once accepted, legally binds both parties for the duration of the condition period. The seller cannot accept another offer during that period without your agreement to void the existing one — absent an escape clause.</p>

<h2>Conditional vs. firm: the practical difference</h2>
<p>A conditional offer gives both parties some uncertainty. The seller can't commit to their next purchase until the conditions are waived; the buyer hasn't fully committed yet either. A firm offer — conditions waived, both parties committed — is cleaner and often preferred by sellers, which is why reducing or eliminating conditions improves offer competitiveness.</p>`,
  },
  {
    title: 'What Is a Firm Offer?',
    slug: 'what-is-a-firm-offer',
    summary: 'What a firm offer means in Ontario real estate — when a deal becomes firm, what obligations it creates, and the risks of waiving conditions to submit a firm offer.',
    metaDescription: 'What is a firm offer in Ontario real estate? When a deal becomes firm, what obligations it creates for buyer and seller, and the risks of waiving conditions.',
    body: `<p>A firm offer — sometimes called an unconditional offer — is an Agreement of Purchase and Sale with no conditions, or one where all conditions have been waived. Once an offer is firm, both buyer and seller are legally committed to complete the transaction on the agreed terms.</p>

<h2>Two paths to a firm deal</h2>
<p><strong>Submitting without conditions:</strong> Some buyers choose to waive conditions at the outset — submitting a firm offer from the start. This is common in competitive situations where the seller is choosing between multiple offers and a conditional offer is less attractive. The deal is firm the moment both parties sign.</p>
<p><strong>Waiving conditions during the conditional period:</strong> More common in less competitive situations. The offer is accepted with conditions, the buyer completes their due diligence (arranges financing, conducts an inspection), and then signs waivers removing each condition. When all conditions are waived, the deal becomes firm.</p>

<h2>What "firm" means legally</h2>
<p>Once a deal is firm, both parties are bound to close on the agreed date at the agreed price under the agreed terms. Walking away at this point — unless the other party defaults — puts you in breach of contract. The consequences:</p>
<p><strong>For the buyer:</strong> Forfeiture of the deposit is the typical first consequence. Beyond that, the seller may sue for additional damages — the difference between your agreed price and whatever the property eventually sells for, plus carrying costs. In practice, most sellers settle for the deposit rather than pursue litigation, but the legal exposure is real.</p>
<p><strong>For the seller:</strong> If the seller defaults — refuses to close, fails to deliver clear title, doesn't vacate — the buyer can sue for specific performance (forcing the sale) or damages.</p>

<h2>The deposit after firming up</h2>
<p>The deposit was paid when the offer was accepted. If the deal was conditional and you waive all conditions, the deposit is already held in trust. It applies toward your down payment on closing. If you then walk away without legal justification after firming up, the deposit is forfeited to the seller.</p>

<h2>When it makes sense to submit a firm offer</h2>
<p>Waiving conditions isn't reckless if done with preparation:</p>
<p><strong>Financing:</strong> If your pre-approval is strong, the property is standard, and you have the down payment and closing costs in liquid accounts, the financing risk is low. Speak with your mortgage broker before submitting — they'll tell you honestly whether this specific property is a candidate for a firm offer.</p>
<p><strong>Home inspection:</strong> If the seller permits a pre-offer inspection — a walk-through with your inspector before submitting — you can gather enough information to make a firm offer with meaningful (though not complete) knowledge of the property's condition. If no pre-offer inspection is available, waiving the inspection condition means accepting the property as-is.</p>
<p><strong>Status certificate (condos):</strong> For condos, the status certificate review should not be waived. If the seller has a recent status certificate (within 30 days) available before the offer date, have your lawyer review it before submitting. This allows a firm offer while still protecting yourself from condo corporation issues.</p>

<h2>Firm does not mean irrevocable</h2>
<p>A firm deal can still be terminated by mutual agreement — if both parties agree in writing to cancel the agreement, the deal is off and the deposit is returned as agreed. What firm means is that neither party can unilaterally exit without legal consequence. Mutual terminations do happen when circumstances change and both sides prefer a clean exit over a disputed close.</p>`,
  },
  {
    title: 'What Is the Difference Between a Firm and Conditional Offer?',
    slug: 'difference-between-firm-and-conditional-offer',
    summary: 'A direct comparison of firm vs. conditional offers in Ontario — what each means for buyer protection, seller preference, and how they perform in different market conditions.',
    metaDescription: 'Firm vs. conditional offer in Ontario real estate. How they differ in buyer protection, seller preference, and which to use in different market conditions.',
    body: `<p>The distinction between a firm and conditional offer is one of the most consequential decisions a buyer makes in the offer process. Here's a direct comparison.</p>

<h2>Definitions</h2>
<p><strong>Conditional offer:</strong> An Agreement of Purchase and Sale that contains one or more conditions giving the buyer the right to exit the deal if certain circumstances arise by a specified deadline. The deal is "accepted" but not yet "firm" — either party knows the transaction may not complete.</p>
<p><strong>Firm offer:</strong> An Agreement of Purchase and Sale with no conditions — either submitted without conditions from the start, or with conditions that have all been waived. Once a deal is firm, both parties are legally committed to close. Walking away without legal justification results in deposit forfeiture and potential damages exposure.</p>

<h2>Buyer protection</h2>
<p><strong>Conditional:</strong> Protected by the condition — can walk away if financing is denied, inspection reveals problems, or status certificate is unsatisfactory. Deposit returned if condition is exercised.</p>
<p><strong>Firm:</strong> No exit without legal consequence. If something unexpected surfaces post-acceptance — the lender declines the specific property, the inspection would have revealed problems — you're still committed. Deposit is at risk if you walk.</p>

<h2>Seller preference</h2>
<p>Sellers nearly always prefer firm offers. Certainty is valuable: they can commit to their next purchase, their movers, their timeline. A conditional offer means 5–10 days of limbo where the deal might collapse. In a multiple-offer situation, sellers often choose a firm offer at a slightly lower price over a higher conditional offer — the certainty premium is real.</p>

<h2>When to submit conditional vs. firm</h2>
<p><strong>Submit conditional when:</strong></p>
<ul>
<li>The market is balanced or buyer-favoured — the seller has limited competing interest and time pressure</li>
<li>The property has characteristics that make financing less predictable (unusual type, rural, significant condition issues)</li>
<li>You haven't had a chance to walk through with an inspector and the property's condition is unknown</li>
<li>For condos, when you haven't had the status certificate reviewed</li>
<li>Your pre-approval has caveats or your financial situation is more complex</li>
</ul>
<p><strong>Submit firm when:</strong></p>
<ul>
<li>The market is competitive — multiple offers are likely or confirmed</li>
<li>Your pre-approval is solid and the property is standard</li>
<li>You've done a pre-offer inspection and the property's condition is acceptable</li>
<li>For condos, when the status certificate has been reviewed by your lawyer before the offer date</li>
<li>The property is priced to generate a competing-bid situation and your conditional offer would likely lose</li>
</ul>

<h2>The hybrid approach</h2>
<p>In some situations, buyers include conditions but make them short and tight: 3 business days for inspection, 5 for financing. This isn't as strong as a firm offer, but it's meaningfully stronger than standard conditional windows and demonstrates confidence. If the seller is choosing between a firm offer and your tight conditional, it's still a disadvantage — but a reduced one.</p>

<h2>The critical question</h2>
<p>Before deciding whether to go firm or conditional, ask yourself: "If I waive conditions and something goes wrong — financing denied, major problem discovered — am I prepared to lose my deposit and potentially face a lawsuit?" If the answer is no, include the relevant conditions. The competitive pressure of a hot market is real, but so is the financial exposure of going firm on a property with hidden problems or financing risk you didn't assess.</p>`,
  },
  {
    title: 'How Long Should a Financing Condition Be?',
    slug: 'how-long-should-financing-condition-be',
    summary: 'How to determine the right length for your financing condition — what happens during the condition period, and the tradeoff between protection and offer competitiveness.',
    metaDescription: 'How long should a financing condition be in Ontario? What 5 vs 10 business days means, what the lender does during that time, and how it affects offer strength.',
    body: `<p>The financing condition gives you a set number of business days after offer acceptance to confirm that your lender will advance the mortgage on this specific property. How long that window should be depends on your lender, property type, and market conditions.</p>

<h2>What needs to happen during the financing condition period</h2>
<p>Getting a mortgage confirmed on a specific property involves more than having a pre-approval. During the condition period, your lender or broker typically:</p>
<ol>
<li>Receives your accepted offer and begins processing the mortgage application for this specific address</li>
<li>Orders a property appraisal — the lender needs to confirm the property is worth at least what you're paying for it</li>
<li>Reviews the property for any issues that affect their willingness to lend: title concerns, property condition, or for condos, the building's financial health</li>
<li>Issues a formal mortgage commitment, confirming the rate, term, and amount</li>
<li>You sign and return the commitment</li>
</ol>
<p>The bottleneck is almost always the appraisal. In a busy market, appraisers are in high demand and a rush appraisal may be needed. Standard appraisals typically take 2–5 business days; rush orders can be completed in 24–48 hours at a premium ($100–$200 extra).</p>

<h2>Standard timelines</h2>
<p><strong>5 business days:</strong> The current standard in many GTA transactions. Works when your pre-approval is solid, the property is a standard type (detached, semi, standard condo), and you're working with a lender who can move quickly. A rush appraisal may be needed to fit this window.</p>
<p><strong>7–10 business days:</strong> More comfortable, especially for first-time buyers, more complex financial situations (self-employed, contract income), or less straightforward properties. Also advisable when working with a major bank's branch rather than a mortgage broker, as branch timelines can be slower.</p>
<p><strong>Under 5 business days:</strong> Possible if your financing is essentially pre-arranged — for example, a portable mortgage from a previous property or a lender who has conditionally approved this specific property type already. Uncommon but possible in the right circumstances.</p>

<h2>The tradeoff with offer competitiveness</h2>
<p>Sellers prefer shorter financing conditions. A 5-business-day window signals more confidence than a 10-day window. In a competitive situation, a shorter condition can make your offer marginally more attractive — all else being equal. However, a financing condition that's too short creates a real risk: if the appraisal is delayed or the lender needs more time, you either have to exercise the condition (walk away) or request an extension from the seller.</p>
<p>Extensions are usually granted if requested promptly and in good faith — sellers would rather give you an extra 2 days than have the deal fall through. But relying on an extension as your plan is riskier than getting the timeline right from the start.</p>

<h2>When financing conditions fail</h2>
<p>Financing conditions are exercised — the buyer walks away — more often than people expect, for several reasons:</p>
<p><strong>Appraisal comes in low:</strong> If you bid significantly over asking and the appraiser values the property lower, the lender calculates your mortgage on the appraised value. You'd have to cover the gap in cash. If you can't, the financing doesn't work at the agreed price.</p>
<p><strong>Property type issues:</strong> Condos in buildings with structural issues, insufficient reserve funds, or non-standard construction may be on a lender's "avoid" list. Unusual or rural properties may not qualify for standard insured mortgages.</p>
<p><strong>Change in borrower circumstances:</strong> Job loss, significant new debt, or a drop in credit score between pre-approval and the offer can change the picture.</p>

<h2>Talk to your broker before setting the timeline</h2>
<p>The right financing condition length is specific to your situation. Ask your mortgage broker directly: "If I accept an offer today, how quickly can you have a commitment in hand?" Their answer — honest answer — should drive your condition length. Five business days is fine when it's truly achievable; a false 5 days that needs an extension is worse than an honest 10.</p>`,
  },
  {
    title: 'Do I Need a Home Inspection?',
    slug: 'do-i-need-a-home-inspection',
    summary: 'Why a home inspection matters, what it does and doesn\'t cover, when buyers skip it — and whether that\'s a good idea in the current GTA market.',
    metaDescription: 'Do you need a home inspection in Toronto? What a home inspection covers, what it costs, when buyers waive it, and whether that\'s a risk worth taking.',
    body: `<p>Legally, no — a home inspection is not required to purchase a property in Ontario. Practically, skipping one on most properties is a decision that can cost tens of thousands of dollars. Here's what the inspection actually does and doesn't do, so you can make an informed call.</p>

<h2>What a home inspection covers</h2>
<p>A qualified home inspector evaluates the visible, accessible components of the property and reports on their current condition. This includes:</p>
<ul>
<li><strong>Roof:</strong> Shingle condition, flashing, gutters, visible structure from the attic</li>
<li><strong>Foundation and structure:</strong> Visible cracks, water infiltration evidence, structural movement indicators</li>
<li><strong>Basement:</strong> Moisture, water staining, grading issues visible from inside</li>
<li><strong>Mechanical systems:</strong> Furnace age and condition, central air, water heater</li>
<li><strong>Electrical:</strong> Panel type and condition, visible wiring, outlets and switches</li>
<li><strong>Plumbing:</strong> Pipe material and condition, water pressure, drainage</li>
<li><strong>Attic:</strong> Insulation type and depth, ventilation, evidence of roof leaks</li>
<li><strong>Interior:</strong> Windows, doors, floors, ceilings, walls — visible condition</li>
<li><strong>Exterior:</strong> Siding, grading, walkways, deck or porch condition</li>
</ul>

<h2>What a home inspection doesn't cover</h2>
<p>An inspection is visual and non-invasive. The inspector cannot open walls, lift concrete, or access inaccessible areas. It does not include:</p>
<ul>
<li>Behind-wall plumbing or electrical</li>
<li>Sewer lateral condition (requires a separate camera scope)</li>
<li>Asbestos, lead paint, or mould testing (requires specialized testing)</li>
<li>Underground oil tanks</li>
<li>Structural engineering analysis</li>
</ul>
<p>The inspector can flag suspicion of these issues and recommend specialist follow-up, but cannot confirm or deny what's hidden.</p>

<h2>What a home inspection costs</h2>
<p>$400–$600 for a standard single-family home in the GTA. Larger homes, homes with crawl spaces, or properties requiring extra time may run higher. The fee is paid to the inspector directly and is not refundable if the deal falls through — but it's among the best $500 you'll spend in a real estate transaction.</p>

<h2>When buyers waive the inspection</h2>
<p>In competitive GTA markets, buyers sometimes waive the home inspection condition to make their offer more attractive to sellers. A firm offer beats a conditional one, all else being equal, and removing the inspection condition is one way to firm up.</p>
<p>The middle path is a <strong>pre-offer inspection</strong>: arranging a walk-through with a qualified inspector before submitting your offer. Not all sellers permit this, and it typically has to be arranged quickly (sometimes within 24 hours of the listing going live). If permitted, it gives you most of the value of a full inspection while allowing a firm offer. The inspector can't produce a full written report in this timeframe, but they can give you a verbal assessment of major concerns.</p>

<h2>When not to skip it</h2>
<p>For older homes (pre-1980), properties that have been tenanted and may have deferred maintenance, estate sales where the sellers don't have full knowledge of the property's history, and any home where the visible condition raises questions — inspect before you firm up. The expected cost of major unknown issues in an un-inspected older property exceeds the inspection fee by a significant margin.</p>
<p>For newer construction (2000s and later) with standard construction and no visible concerns, waiving the inspection carries less risk. The systems are newer, the construction standards are better documented, and the likelihood of major hidden problems is lower. Still not zero — but the risk profile is different.</p>

<h2>The bottom line</h2>
<p>If you can include a home inspection condition, include it. If the market requires going firm, exhaust the pre-offer inspection option first. Going firm without any inspection is a calculated risk — appropriate in some situations, worth thinking through carefully in others. A $500 inspection has prevented far more than $500 in unexpected costs for most buyers who've done them.</p>`,
  },
  {
    title: 'What Happens After an Offer Is Accepted?',
    slug: 'what-happens-after-offer-is-accepted',
    summary: 'A step-by-step walkthrough of everything that happens between an accepted offer and closing day — conditional period, deposit, lawyers, and the closing process.',
    metaDescription: 'What happens after an offer is accepted in Ontario? Step-by-step guide from conditional period through deposit, inspections, mortgage commitment, and closing day.',
    body: `<p>Once both parties have signed the Agreement of Purchase and Sale, the transaction enters a defined sequence of steps. Here's what to expect at each stage.</p>

<h2>Immediately after acceptance: deliver the deposit</h2>
<p>The deposit — typically 5% of the purchase price — is due within 24 hours of the offer being accepted by the seller. It must be a bank draft, certified cheque, or wire transfer payable to the listing brokerage's trust account. Arrange this before submitting your offer: ensure the funds are accessible in your bank account, not locked in a GIC or investment account with a withdrawal timeline.</p>

<h2>The conditional period (if applicable)</h2>
<p>If your offer includes conditions, the conditional period begins immediately after acceptance. You have until each condition's deadline to either waive it (sign a document removing it) or exercise it (notify the seller you're walking away, triggering a return of your deposit).</p>
<p>During this period, in parallel:</p>
<ul>
<li>Book your home inspector immediately — qualified inspectors in the GTA book up fast</li>
<li>Send your accepted offer to your mortgage broker or lender to begin the financing confirmation process</li>
<li>For condos, request the status certificate from the seller's agent and forward it to your lawyer</li>
</ul>
<p>Once all conditions are waived, the deal is "firm" — both parties are committed to close.</p>

<h2>Hire your real estate lawyer</h2>
<p>If you haven't already, hire a real estate lawyer as soon as the offer is accepted. Your lawyer will conduct a title search, arrange title insurance, prepare closing documents, and handle the transfer of funds on closing day. Title searches and document preparation take time — don't leave this until the week before closing.</p>
<p>Your lawyer's closing fee is typically $1,500–$2,500 plus disbursements (search fees, title insurance, registration fees). Ask for a quote upfront so there are no surprises.</p>

<h2>The weeks before closing</h2>
<p><strong>Mortgage commitment:</strong> Your lender provides a formal mortgage commitment letter. Review the terms carefully — rate, term, amortization, prepayment privileges — and sign and return it within the deadline specified.</p>
<p><strong>Title search:</strong> Your lawyer confirms the seller has clear, marketable title — that there are no undisclosed liens, encumbrances, or ownership disputes. Title insurance provides protection if anything surfaces post-close that the search didn't catch.</p>
<p><strong>Statement of adjustments:</strong> Your lawyer prepares this in the final week before closing. It itemizes exactly what you owe on closing day: the purchase price less your deposit, plus land transfer tax, property tax adjustments, legal fees, and title insurance. This is when the final number becomes concrete.</p>
<p><strong>Arrange closing funds:</strong> Based on the statement of adjustments, you'll need a certified cheque or wire transfer for the balance owing. Your mortgage lender advances their funds directly to your lawyer; you provide the gap between the mortgage and the purchase price (down payment less deposit) plus closing costs.</p>

<h2>Pre-closing walkthrough</h2>
<p>You're entitled to a final walkthrough — typically within 24 hours of closing — to confirm the property is in the condition specified in your agreement. Check that all included chattels (appliances, light fixtures, window coverings) are present and undamaged, and that the sellers have vacated and removed their belongings. Any issues discovered here should be communicated to your lawyer immediately.</p>

<h2>Closing day</h2>
<p>On the closing date, your lawyer registers the transfer of title with the land registry office and arranges key handoff through the agents. Closing typically happens in the afternoon — the keys are rarely available at 8 a.m. Even if the closing date is the same day as your move-in, plan for afternoon possession. The property is legally yours once your lawyer confirms the transfer is registered.</p>`,
  },
  {
    title: 'When Do I Get the Keys After Buying a Home?',
    slug: 'when-do-i-get-the-keys-after-buying',
    summary: 'When keys are handed over after a home purchase in Ontario — what happens on closing day, why it\'s usually afternoon, and what to do if something delays closing.',
    metaDescription: 'When do you get the keys after buying a home in Ontario? What happens on closing day, why keys are handed over in the afternoon, and what delays closing.',
    body: `<p>In Ontario, you receive the keys to your new home on the closing date specified in your Agreement of Purchase and Sale. However, "closing date" doesn't mean "9 a.m." — the actual transfer typically happens in the afternoon, sometimes as late as 5 or 6 p.m. Here's what drives the timing and what to do when things are delayed.</p>

<h2>What has to happen before keys change hands</h2>
<p>Closing is a chain of events, each dependent on the one before it:</p>
<ol>
<li>Your lender advances the mortgage funds to your lawyer's trust account</li>
<li>Your lawyer assembles the total purchase funds (mortgage advance + your down payment and closing costs) and sends them to the seller's lawyer</li>
<li>The seller's lawyer confirms receipt of funds and authorizes the land registry office to register the transfer</li>
<li>The transfer is registered — this is the moment you legally own the property</li>
<li>The seller's lawyer releases the keys to the listing agent, who releases them to your buyer's agent or directly to you</li>
</ol>
<p>Each step takes time. Mortgage advances, wire transfers, and land registry processing all move during business hours and don't happen instantly. The chain typically completes by early to mid-afternoon — but it can run later if anything in the chain is delayed.</p>

<h2>Why you often get keys in the afternoon</h2>
<p>Lawyers are managing multiple closings on any given day. Your file may not be the first processed. Wire transfers take 1–3 hours to clear. Land registry offices can be backlogged. Even in a perfectly smooth transaction, 2–4 p.m. for key receipt is typical. Plan your move-in accordingly — scheduling movers for 9 a.m. on closing day, expecting immediate possession, often leads to a frustrating morning of waiting.</p>

<h2>If the sellers haven't vacated</h2>
<p>This is one of the most common closing-day complications. Your agreement specifies that the property is delivered "vacant" on the closing date. If you arrive and the sellers are still present, or their belongings haven't been removed, notify your agent and lawyer immediately. Your lawyer can hold closing funds or apply legal pressure. In practice, most "still there" situations resolve within hours — but document everything and don't accept the keys until the property is actually in the condition the agreement requires.</p>

<h2>When closing is delayed</h2>
<p>Delays on closing day happen. Common causes include wire transfer delays, a title issue that surfaces at the last minute, or a problem in a chain of transactions (if the sellers are closing on their next home the same day and that deal is delayed, it creates a cascade). If your closing is materially delayed beyond the closing date — meaning it won't happen that day at all — both lawyers communicate to arrange an extension. Brief extensions of one to three days are typically handled without formal amendments to the agreement.</p>
<p>If the delay is the seller's fault (they failed to deliver vacant possession, there's a title problem they need to resolve), they may owe you compensation for carrying costs — discuss this with your lawyer.</p>

<h2>What to do on closing day</h2>
<ul>
<li>Don't book movers for first thing in the morning — mid-morning at earliest, with the understanding that you may not have access until early afternoon</li>
<li>Have your phone charged and available so your agent or lawyer can reach you when keys are ready</li>
<li>Have your ID available — some handoff arrangements require verification</li>
<li>Do your final walkthrough the evening before if possible, so you're not discovering problems at the same moment you're trying to coordinate movers</li>
</ul>

<h2>After you have the keys</h2>
<p>First priority: change the locks. The seller surrendered all known copies, but there may be other keys in circulation — contractors, cleaners, previous occupants. A lock rekey costs $100–$200 per door. Do it immediately. Then: confirm utilities are in your name, update your address with Canada Post, CRA, your bank, and your employer, and register with the condo management if applicable.</p>`,
  },
]

async function main() {
  // Find admin user
  const admin = await db.user.findFirst({ where: { role: 'admin' } })
  if (!admin) {
    console.error('No admin user found. Ensure an admin user exists in the DB.')
    process.exit(1)
  }
  console.log(`Using author: ${admin.email} (${admin.id})`)
  console.log(`Publishing ${posts.length} posts...`)

  for (const post of posts) {
    const existing = await db.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) {
      console.log(`  skip (exists): ${post.slug}`)
      continue
    }
    await db.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        body: post.body,
        metaDescription: post.metaDescription,
        published: true,
        publishedAt: new Date(),
        coverImageUrl: null,
        authorId: admin.id,
      },
    })
    console.log(`  published: ${post.slug}`)
  }
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect().then(() => pool.end()))
