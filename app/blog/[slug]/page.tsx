import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import NewsletterForm from "@/components/NewsletterForm";
import ShareButtons from "@/components/blog/ShareButtons";

// ── colour maps (mirrors blog/page.tsx) ──────────────────────────────────────

const catColors: Record<string, string> = {
  "Term Insurance": "bg-blue-100 text-blue-700",
  "Health Insurance": "bg-emerald-100 text-emerald-700",
  "Motor Insurance": "bg-orange-100 text-orange-700",
  "Life Insurance": "bg-violet-100 text-violet-700",
  "Car Insurance": "bg-sky-100 text-sky-700",
  "Two Wheeler Insurance": "bg-amber-100 text-amber-700",
  "Family Health Insurance": "bg-teal-100 text-teal-700",
  "Group Health Insurance": "bg-cyan-100 text-cyan-700",
  "Travel Insurance": "bg-yellow-100 text-yellow-700",
  "Home Insurance": "bg-rose-100 text-rose-700",
  "Term Insurance for Women": "bg-pink-100 text-pink-700",
  "Return of Premium Term Plans": "bg-indigo-100 text-indigo-700",
  "Guaranteed Return Plans": "bg-green-100 text-green-700",
  "Child Savings Plans": "bg-fuchsia-100 text-fuchsia-700",
  "Retirement Plans": "bg-purple-100 text-purple-700",
  "Guides": "bg-gray-100 text-gray-700",
};

const catBar: Record<string, string> = {
  "Term Insurance": "from-blue-500 to-indigo-500",
  "Health Insurance": "from-emerald-500 to-teal-500",
  "Motor Insurance": "from-orange-500 to-amber-500",
  "Life Insurance": "from-violet-500 to-purple-500",
  "Car Insurance": "from-sky-500 to-blue-500",
  "Two Wheeler Insurance": "from-amber-500 to-orange-500",
  "Family Health Insurance": "from-teal-500 to-emerald-500",
  "Group Health Insurance": "from-cyan-500 to-blue-500",
  "Travel Insurance": "from-yellow-500 to-amber-500",
  "Home Insurance": "from-rose-500 to-pink-500",
  "Term Insurance for Women": "from-pink-500 to-rose-500",
  "Return of Premium Term Plans": "from-indigo-500 to-violet-500",
  "Guaranteed Return Plans": "from-green-500 to-emerald-500",
  "Child Savings Plans": "from-fuchsia-500 to-purple-500",
  "Retirement Plans": "from-purple-500 to-indigo-500",
  "Guides": "from-gray-400 to-gray-500",
};

// ── fallback post data (used when DB is unreachable / returns nothing) ───────

const FALLBACK_BODY: Record<string, string> = {
  "term-insurance-guide": `
<h2>What Is Term Insurance?</h2>
<p>Term insurance is the simplest, most affordable form of life insurance in India. It pays a fixed <strong>death benefit</strong> to your nominees if you pass away during the policy term. Unlike ULIPs or endowment plans, there is no maturity or savings component — which is exactly why premiums are so low.</p>
<h2>How Much Cover Do You Actually Need?</h2>
<p>A widely used rule of thumb is <strong>10–15× your annual income</strong>. But the right number depends on your liabilities, number of dependants, and financial goals.</p>
<ul>
  <li>Annual income of ₹8 lakh → minimum cover of ₹80 lakh (10×)</li>
  <li>Add outstanding home loan or other liabilities on top</li>
  <li>Factor in your spouse's income and existing assets</li>
</ul>
<h2>Choosing the Right Policy Term</h2>
<p>Your cover should last until your dependants are financially independent <em>and</em> your major liabilities are cleared. Most advisors recommend covering yourself until age 60–65, or until your youngest child turns 25 — whichever is later.</p>
<h2>Key Riders Worth Considering</h2>
<ul>
  <li><strong>Critical Illness Rider:</strong> Pays a lump sum on diagnosis of 34+ illnesses including cancer, heart attack, and stroke.</li>
  <li><strong>Accidental Death Benefit:</strong> Doubles the payout if death is accidental.</li>
  <li><strong>Waiver of Premium:</strong> Waives future premiums if you're diagnosed with a critical illness or become permanently disabled.</li>
</ul>
<h2>Top Term Plans in India (2026)</h2>
<table>
  <thead><tr><th>Plan</th><th>Claim Settlement Ratio</th><th>Approx. Premium (₹1 Cr, 30-yr, 30-yr term)</th></tr></thead>
  <tbody>
    <tr><td>HDFC Life Click 2 Protect Super</td><td>99.5%</td><td>~₹950/month</td></tr>
    <tr><td>Max Life Smart Secure Plus</td><td>99.3%</td><td>~₹890/month</td></tr>
    <tr><td>ICICI Pru iProtect Smart</td><td>97.9%</td><td>~₹870/month</td></tr>
    <tr><td>Tata AIA SRS Vitality Protect</td><td>98.5%</td><td>~₹980/month</td></tr>
  </tbody>
</table>
<h2>Buying Tips</h2>
<ul>
  <li>Always disclose your medical history honestly — non-disclosure is the #1 reason for claim rejection.</li>
  <li>Compare at least 3–4 plans before deciding.</li>
  <li>Buy early: a 25-year-old pays 40–50% less than a 35-year-old for the same cover.</li>
  <li>Online plans are 30–40% cheaper than equivalent offline products.</li>
  <li>Check the insurer's claim settlement ratio — prefer 97%+ for peace of mind.</li>
</ul>
<blockquote>A term plan is not an expense. It is the cheapest way to make sure your family's lifestyle survives your absence.</blockquote>
`,

  "health-insurance-cashless": `
<h2>What Is Cashless Health Insurance?</h2>
<p>A cashless health insurance claim lets you receive hospital treatment <strong>without paying upfront</strong>. The insurer settles the bill directly with the hospital — you only pay for any non-covered items or amounts above your sum insured.</p>
<h2>How It Works: Step by Step</h2>
<ol>
  <li><strong>Choose a network hospital.</strong> Your insurer maintains a list of empanelled hospitals. Only cashless claims are possible at these hospitals — check your insurer's website before admission.</li>
  <li><strong>Inform the insurer / TPA.</strong> For planned procedures, request pre-authorisation at least 48–72 hours in advance. For emergencies, notify within 24 hours of admission.</li>
  <li><strong>Fill the pre-authorisation form.</strong> The hospital's insurance desk will help. Submit it with ID proof and your health card.</li>
  <li><strong>Insurer reviews and approves.</strong> The TPA (Third Party Administrator) verifies your policy details and the proposed treatment. Approval typically takes 2–4 hours for planned cases.</li>
  <li><strong>Receive treatment.</strong> Proceed with the treatment. The hospital will keep track of covered and non-covered items.</li>
  <li><strong>Discharge and final settlement.</strong> At discharge, sign the final bill. The hospital sends it to the insurer directly. You pay only the non-covered portion (consumables, room rent upgrades, etc.).</li>
</ol>
<h2>What Is NOT Covered in Cashless Claims?</h2>
<ul>
  <li>Consumables (gloves, syringes, PPE) — unless you have a consumables add-on</li>
  <li>Room rent beyond your policy limit (e.g., single AC room vs. general ward)</li>
  <li>Non-medical expenses (attendant charges, telephone, food)</li>
  <li>Items specifically excluded in your policy</li>
</ul>
<h2>Reimbursement vs. Cashless: When to Choose Which</h2>
<table>
  <thead><tr><th>Factor</th><th>Cashless</th><th>Reimbursement</th></tr></thead>
  <tbody>
    <tr><td>Upfront payment</td><td>None</td><td>Full amount</td></tr>
    <tr><td>Hospital choice</td><td>Network only</td><td>Any hospital</td></tr>
    <tr><td>Documentation</td><td>Minimal</td><td>Original bills required</td></tr>
    <tr><td>Settlement time</td><td>At discharge</td><td>15–30 days after claim submission</td></tr>
  </tbody>
</table>
<h2>Tips for a Smooth Cashless Claim</h2>
<ul>
  <li>Always carry your health insurance card and a copy of the policy.</li>
  <li>Verify the hospital is on the network list <em>before</em> admission — lists change.</li>
  <li>Keep copies of all documents submitted at the hospital desk.</li>
  <li>For emergencies, inform the insurer as soon as possible — even if you can't do it yourself, a family member can.</li>
</ul>
`,

  "motor-ncb-guide": `
<h2>What Is No-Claim Bonus (NCB)?</h2>
<p>No-Claim Bonus is a discount on your <strong>Own Damage (OD) premium</strong> rewarded each year you do not file a claim. It starts at 20% after the first claim-free year and rises to <strong>50% after five consecutive claim-free years</strong> — effectively halving your motor insurance premium.</p>
<h2>NCB Slabs at a Glance</h2>
<table>
  <thead><tr><th>Claim-Free Years</th><th>NCB Discount</th></tr></thead>
  <tbody>
    <tr><td>1 year</td><td>20%</td></tr>
    <tr><td>2 years</td><td>25%</td></tr>
    <tr><td>3 years</td><td>35%</td></tr>
    <tr><td>4 years</td><td>45%</td></tr>
    <tr><td>5+ years</td><td>50%</td></tr>
  </tbody>
</table>
<h2>How NCB Transfers Work</h2>
<p>NCB belongs to the <strong>owner, not the vehicle</strong>. When you switch insurers or buy a new car, your NCB follows you — provided you transfer it within 90 days using an NCB Retention Letter from your previous insurer.</p>
<h2>When Does NCB Reset to Zero?</h2>
<p>Your NCB resets to 0% the moment you file <em>any</em> claim — even a minor one. This is why it often makes financial sense to pay small repairs out of pocket rather than filing a claim and losing your NCB.</p>
<h2>Should You Claim or Pay Out of Pocket?</h2>
<p>Quick rule of thumb: if the repair cost is less than <strong>your premium × 2</strong>, pay out of pocket. Example:</p>
<ul>
  <li>Current OD premium: ₹10,000/year with 35% NCB (saving ₹3,500)</li>
  <li>Repair estimate: ₹4,000</li>
  <li>If you claim: you lose ₹3,500 NCB next year, pay ₹4,000 deductible risk — total impact ~₹7,500+</li>
  <li>Decision: Pay ₹4,000 out of pocket and protect the NCB</li>
</ul>
<h2>Protect Your NCB with NCB Protect Add-On</h2>
<p>Most insurers offer an <strong>NCB Protect add-on</strong> (typically ₹500–₹800/year) that lets you make 1–2 claims in a policy year without losing your NCB. It's worth it at NCB levels of 35% and above.</p>
<h2>Key Takeaways</h2>
<ul>
  <li>NCB is yours to keep — even when you change insurer or vehicle.</li>
  <li>One claim resets it to zero (unless you have NCB Protect).</li>
  <li>At 50% NCB, you're paying half the OD premium — significant savings on expensive vehicles.</li>
  <li>Get an NCB Retention Letter when switching insurers; it's valid for 3 years.</li>
</ul>
`,

  "ulip-vs-term": `
<h2>The Core Question</h2>
<p>ULIPs — Unit Linked Insurance Plans — combine life insurance with market-linked investment. The promise sounds great: one product that protects your family <em>and</em> grows your wealth. But is the combination actually a good deal? Let's do the numbers.</p>
<h2>How ULIPs Work</h2>
<p>When you pay a ULIP premium, it is split into two parts:</p>
<ul>
  <li><strong>Mortality charge:</strong> the cost of your life cover</li>
  <li><strong>Investment:</strong> the remainder goes into equity, debt, or balanced funds of your choice</li>
</ul>
<p>The insurer also deducts charges — premium allocation charge, fund management charge (1–1.35%), policy administration charge — before investing the balance. There is a <strong>5-year lock-in period</strong>.</p>
<h2>Term + Mutual Fund: The Alternative</h2>
<p>A popular alternative is to <strong>buy a pure term plan for insurance</strong> and invest the premium difference in mutual funds (SIP). Let's compare with real numbers:</p>
<table>
  <thead><tr><th></th><th>ULIP</th><th>Term + MF</th></tr></thead>
  <tbody>
    <tr><td>Annual premium / SIP</td><td>₹1,20,000</td><td>₹1,20,000</td></tr>
    <tr><td>Life cover</td><td>₹15 lakh (10× premium)</td><td>₹1 crore</td></tr>
    <tr><td>Investment cost</td><td>~2–3% p.a.</td><td>0.5–1% (index fund)</td></tr>
    <tr><td>Charges deducted</td><td>High (years 1–3)</td><td>None on term</td></tr>
    <tr><td>Flexibility</td><td>Fund switch only</td><td>Full — redeem anytime after yr 1</td></tr>
    <tr><td>Tax on gains</td><td>10(10D) if &lt;₹2.5L/yr premium</td><td>LTCG 12.5% on MF gains</td></tr>
  </tbody>
</table>
<h2>When Does a ULIP Make Sense?</h2>
<ul>
  <li>You have exhausted your ₹1.5L 80C limit and want tax-free maturity proceeds under 10(10D)</li>
  <li>Annual premium stays below ₹2.5 lakh (above this, maturity proceeds are taxable)</li>
  <li>You want the discipline of a lock-in that prevents premature withdrawal</li>
  <li>You are comfortable with equity market risk for 10+ years</li>
</ul>
<h2>When Term + MF Is Better</h2>
<ul>
  <li>You need maximum life cover per rupee of premium — a ULIP's cover is often a tiny fraction of what a term plan offers</li>
  <li>You want transparency in charges and returns</li>
  <li>You want flexibility to change funds freely or stop SIPs in a down year</li>
  <li>You are already investing via ELSS or PPF for 80C benefits</li>
</ul>
<h2>The Verdict</h2>
<p>For most people, <strong>Term + Mutual Fund outperforms ULIP</strong> in both protection and wealth creation. ULIPs make sense in a narrow set of situations — primarily as a tax-planning instrument for high earners who have maximised other 80C avenues. If your primary goal is insurance, a term plan is unbeatable on cost. If your primary goal is investment, mutual funds offer more transparency and flexibility.</p>
`,

  "tax-benefits-80c": `
<h2>Two Sections, Two Benefits</h2>
<p>Insurance products in India offer tax benefits under two different sections of the Income Tax Act — and most people are eligible for both simultaneously.</p>
<h2>Section 80C: Premium Deduction (up to ₹1.5 Lakh)</h2>
<p>Premiums paid towards a <strong>life insurance policy</strong> (term, endowment, ULIP, money-back) qualify for deduction under Section 80C, up to a combined annual limit of <strong>₹1,50,000</strong>. This limit is shared with EPF, PPF, ELSS, home loan principal, and other 80C instruments.</p>
<ul>
  <li>Available under the <strong>Old Tax Regime only</strong></li>
  <li>Deduction reduces your taxable income (not the tax directly)</li>
  <li>Condition: annual premium must not exceed 10% of sum assured</li>
</ul>
<h2>Section 80D: Health Insurance Premium (up to ₹1 Lakh)</h2>
<p>Premiums paid for <strong>health insurance</strong> qualify separately under Section 80D — this is over and above the 80C limit.</p>
<table>
  <thead><tr><th>Policy covers</th><th>Maximum Deduction</th></tr></thead>
  <tbody>
    <tr><td>Self + spouse + children (below 60 yrs)</td><td>₹25,000</td></tr>
    <tr><td>Parents below 60 years</td><td>+₹25,000</td></tr>
    <tr><td>Parents above 60 years (senior citizens)</td><td>+₹50,000</td></tr>
    <tr><td>Self + senior citizen parents (max)</td><td>₹75,000</td></tr>
  </tbody>
</table>
<p>Preventive health check-up costs (up to ₹5,000) are included within the 80D limit.</p>
<h2>Section 10(10D): Tax-Free Maturity Proceeds</h2>
<p>The maturity amount received from a life insurance policy is <strong>completely exempt</strong> from income tax under Section 10(10D). This includes:</p>
<ul>
  <li>Death benefits received by nominees (always tax-free, no conditions)</li>
  <li>Maturity proceeds if the annual premium does not exceed 10% of sum assured (for policies issued after Apr 2012)</li>
</ul>
<p><strong>ULIP exception:</strong> If the annual ULIP premium exceeds ₹2.5 lakh, the maturity amount is taxable as capital gains at 10% (no indexation). This rule applies from Feb 2021 onwards.</p>
<h2>How to Maximise Both Benefits</h2>
<ul>
  <li>Pay life insurance premium (term plan) → claim under 80C along with EPF/PPF/ELSS</li>
  <li>Pay health insurance premium → claim separately under 80D</li>
  <li>Cover parents under a separate health policy → unlock an extra ₹25,000–₹50,000 deduction</li>
  <li>A family of 4 with senior citizen parents can claim up to ₹1.5L (80C) + ₹75,000 (80D) = ₹2.25L in total deductions just from insurance premiums</li>
</ul>
<blockquote>At a 30% tax slab, ₹2.25 lakh in deductions saves ~₹70,000 in tax per year. Your insurance is essentially subsidised by the government.</blockquote>
`,

  "claim-settlement-ratio": `
<h2>What Is Claim Settlement Ratio?</h2>
<p>Claim Settlement Ratio (CSR) is the percentage of death claims an insurer has settled against the total claims received in a financial year. It is published annually by IRDAI and is the single most important data point when comparing life insurance companies.</p>
<h2>How Is CSR Calculated?</h2>
<p><strong>CSR = (Claims Settled ÷ Total Claims Received) × 100</strong></p>
<p>Example: If an insurer received 1,000 claims and settled 980, the CSR is 98%.</p>
<h2>What CSR to Look For?</h2>
<table>
  <thead><tr><th>CSR Range</th><th>Interpretation</th></tr></thead>
  <tbody>
    <tr><td>99%+</td><td>Excellent — settles almost all claims</td></tr>
    <tr><td>97–99%</td><td>Good — industry average range</td></tr>
    <tr><td>95–97%</td><td>Acceptable — minor concern</td></tr>
    <tr><td>Below 95%</td><td>Caution — higher rejection risk</td></tr>
  </tbody>
</table>
<h2>CSR vs. Claim Amount Settlement Ratio</h2>
<p>The CSR tells you <em>how many</em> claims were settled, but not <em>how much</em> was paid. IRDAI also publishes a <strong>Claim Amount Settlement Ratio</strong> — the percentage of the total claimed amount that was paid out. Always check both figures, as an insurer might settle many small claims and reject a few large ones.</p>
<h2>Why Claims Are Rejected</h2>
<ul>
  <li><strong>Non-disclosure:</strong> Failure to declare pre-existing medical conditions, smoking, or hazardous occupation at the time of application is the #1 reason.</li>
  <li><strong>Policy lapse:</strong> Premiums unpaid, causing policy to lapse before claim.</li>
  <li><strong>Exclusion period:</strong> Death during the suicide exclusion window (first year) or a specific waiting period.</li>
  <li><strong>Fraudulent claims:</strong> Misrepresentation of cause of death or policy fraud.</li>
</ul>
<h2>How to Ensure Your Claim Gets Settled</h2>
<ul>
  <li>Disclose <em>everything</em> on the proposal form — medical history, lifestyle, occupation.</li>
  <li>Inform nominees where to find the policy documents and how to file a claim.</li>
  <li>Keep premiums paid on time; set up auto-debit if possible.</li>
  <li>Review your policy annually and update your nominee details.</li>
</ul>
<h2>Top Insurers by CSR (FY 2024–25)</h2>
<table>
  <thead><tr><th>Insurer</th><th>CSR</th></tr></thead>
  <tbody>
    <tr><td>Max Life Insurance</td><td>99.65%</td></tr>
    <tr><td>HDFC Life Insurance</td><td>99.5%</td></tr>
    <tr><td>Tata AIA Life</td><td>99.01%</td></tr>
    <tr><td>LIC of India</td><td>98.62%</td></tr>
    <tr><td>ICICI Prudential Life</td><td>97.9%</td></tr>
  </tbody>
</table>
<blockquote>A high CSR is not a guarantee your claim will be settled — but a low CSR is a red flag that should make you look elsewhere.</blockquote>
`,
};

const fallbackPosts = [
  { id: 1, slug: "term-insurance-guide",    title: "Complete Guide to Term Insurance in India 2026",       excerpt: "Everything you need to know about term plans — how to choose the right cover amount, policy term, and riders for your family.", category: "Term Insurance",   publishedAt: new Date("2026-06-01"), author: "Priya Sharma",  bodyHtml: FALLBACK_BODY["term-insurance-guide"] },
  { id: 2, slug: "health-insurance-cashless", title: "How Cashless Health Insurance Works at Hospitals",   excerpt: "Step-by-step walkthrough of the cashless claim process — from pre-authorisation to discharge. No paperwork surprises.",    category: "Health Insurance", publishedAt: new Date("2026-05-20"), author: "Rajesh Mehta", bodyHtml: FALLBACK_BODY["health-insurance-cashless"] },
  { id: 3, slug: "motor-ncb-guide",          title: "No-Claim Bonus: How to Protect and Maximise Your NCB", excerpt: "NCB can reduce your motor premium by up to 50%. Here's how to protect it and what happens if you switch insurers.",       category: "Motor Insurance",  publishedAt: new Date("2026-05-10"), author: "Amit Verma",   bodyHtml: FALLBACK_BODY["motor-ncb-guide"] },
  { id: 4, slug: "ulip-vs-term",             title: "ULIP vs Term Insurance: Which is Better for You?",    excerpt: "ULIPs combine insurance with investment. Is that actually a good deal? We do the numbers.",                              category: "Life Insurance",   publishedAt: new Date("2026-04-28"), author: "Sunita Patel",  bodyHtml: FALLBACK_BODY["ulip-vs-term"] },
  { id: 5, slug: "tax-benefits-80c",         title: "Tax Benefits Under Section 80C and 80D Explained",    excerpt: "Term premiums under 80C, health premiums under 80D — here's how to claim both and save more.",                          category: "Guides",           publishedAt: new Date("2026-04-15"), author: "Priya Sharma",  bodyHtml: FALLBACK_BODY["tax-benefits-80c"] },
  { id: 6, slug: "claim-settlement-ratio",   title: "Claim Settlement Ratio: What It Means and Why It Matters", excerpt: "The most important number when comparing insurers — yet most people ignore it. Here's what a 'good' ratio looks like.", category: "Guides",           publishedAt: new Date("2026-04-01"), author: "Rajesh Mehta", bodyHtml: FALLBACK_BODY["claim-settlement-ratio"] },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function readingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type Post = (typeof fallbackPosts)[0];

async function getPost(slug: string): Promise<Post | null> {
  try {
    const p = await db.blogPost.findUnique({ where: { slug } });
    if (p) {
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? "",
        category: p.category ?? "Guides",
        publishedAt: p.publishedAt ?? p.createdAt,
        author: p.author ?? "InsurancePortal Team",
        bodyHtml: p.bodyHtml,
      } as Post;
    }
  } catch {}
  return fallbackPosts.find((p) => p.slug === slug) ?? null;
}

async function getRelated(category: string, currentSlug: string): Promise<Post[]> {
  try {
    const rows = await db.blogPost.findMany({
      where: { publishedAt: { not: null }, category, slug: { not: currentSlug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt ?? "",
        category: r.category ?? "Guides", publishedAt: r.publishedAt!,
        author: r.author ?? "InsurancePortal Team", bodyHtml: r.bodyHtml,
      })) as Post[];
    }
  } catch {}
  return fallbackPosts
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3);
}

interface Props {
  params: Promise<{ slug: string }>;
}

// ── metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | InsurancePortal" };
  return {
    title: `${post.title} | InsurancePortal Blog`,
    description: post.excerpt,
  };
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post.category, post.slug);
  const minutes = readingTime(post.bodyHtml ?? post.excerpt ?? "");
  const bar = catBar[post.category] ?? "from-blue-500 to-indigo-500";
  const badge = catColors[post.category] ?? "bg-gray-100 text-gray-700";
  const initial = (post.author ?? "I").charAt(0).toUpperCase();

  return (
    <div className="bg-white min-h-screen">
      {/* Category colour bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${bar}`} />

      {/* Article header */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-14 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[240px]">{post.title}</span>
          </nav>

          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-5 ${badge}`}>
            {post.category}
          </span>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-6 max-w-3xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl">{post.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initial}
              </div>
              <span className="font-semibold text-gray-800">{post.author}</span>
            </div>
            <span className="text-gray-300">·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <span className="text-gray-300">·</span>
            <span>{minutes} min read</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="lg:flex lg:gap-14 items-start">

          {/* ── Main article ── */}
          <article className="flex-1 min-w-0">
            <div
              className="
                text-gray-700 text-base leading-relaxed
                [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:leading-tight
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:mb-5 [&_p]:leading-[1.8]
                [&_ul]:mb-6 [&_ul]:pl-5 [&_ul]:space-y-2
                [&_ol]:mb-6 [&_ol]:pl-5 [&_ol]:space-y-2
                [&_li]:leading-relaxed
                [&_li::marker]:text-blue-400
                [&_strong]:font-bold [&_strong]:text-gray-900
                [&_em]:italic [&_em]:text-gray-600
                [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-blue-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:pl-5 [&_blockquote]:my-8 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:text-lg
                [&_table]:w-full [&_table]:text-sm [&_table]:mb-8 [&_table]:border-collapse
                [&_thead]:bg-gray-50
                [&_th]:font-bold [&_th]:text-gray-700 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:border-b-2 [&_th]:border-gray-200
                [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-gray-600
                [&_tr:last-child_td]:border-b-0
                [&_tr:hover_td]:bg-gray-50
                [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_hr]:my-10 [&_hr]:border-gray-200
              "
              dangerouslySetInnerHTML={{ __html: post.bodyHtml ?? `<p>${post.excerpt}</p>` }}
            />

            <ShareButtons title={post.title} />
          </article>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-72 flex-shrink-0 mt-2">
            <div className="sticky top-24 space-y-5">

              {/* CTA card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Get Covered Today</p>
                <h3 className="font-black text-xl mb-2 leading-tight">Compare 200+ Plans Free</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  Unbiased advice from 50+ top insurers. No spam, no hidden charges.
                </p>
                <Link
                  href="/#lead-form"
                  className="block bg-white text-blue-600 font-bold text-sm text-center px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Get Free Quote &rarr;
                </Link>
                <a
                  href="tel:1800XXXXXXX"
                  className="block mt-2 text-center text-blue-200 text-xs font-semibold hover:text-white transition-colors py-1"
                >
                  Or call 1800-XXX-XXXX (Free)
                </a>
              </div>

              {/* Related in sidebar */}
              {related.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Related Articles</p>
                  <ul className="space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/blog/${r.slug}`} className="group">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 leading-snug transition-colors">
                            {r.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.publishedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Related posts (full-width, mobile-first) */}
      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-2">Keep Reading</p>
            <h2 className="text-2xl font-black text-gray-900 mb-8">More {post.category} Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/80 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className={`h-1 bg-gradient-to-r ${catBar[r.category] ?? bar}`} />
                  <div className="p-5 flex flex-col flex-1">
                    <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${catColors[r.category] ?? badge}`}>
                      {r.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors flex-1">
                      {r.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {new Date(r.publishedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </p>
                      <span className="text-xs font-bold text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all inline-block">
                        &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Stay Informed</p>
            <h2 className="text-3xl font-black mb-2">Get Insurance Tips in Your Inbox</h2>
            <p className="text-blue-200 mb-8 text-sm">Weekly plain-English guides. No jargon, no spam.</p>
            <div className="max-w-md mx-auto">
              <NewsletterForm
                source="blog-post"
                inputClass="flex-1 bg-white/10 border-2 border-white/20 text-white text-sm px-4 py-3 rounded-xl placeholder-blue-200 focus:outline-none focus:border-white/50 transition-colors"
                buttonClass="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
