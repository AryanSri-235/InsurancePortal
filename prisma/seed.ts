import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Admin Users ───────────────────────────────────────────────────────────
  const passwords = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("editor123", 10),
    bcrypt.hash("viewer123", 10),
    bcrypt.hash("sales123", 10),
  ]);

  await Promise.all([
    prisma.adminUser.upsert({
      where: { email: "admin@insuranceportal.com" },
      update: {},
      create: { name: "Super Admin", email: "admin@insuranceportal.com", passwordHash: passwords[0], role: "SUPER_ADMIN" },
    }),
    prisma.adminUser.upsert({
      where: { email: "editor@insuranceportal.com" },
      update: {},
      create: { name: "Rahul Mehta", email: "editor@insuranceportal.com", passwordHash: passwords[1], role: "EDITOR" },
    }),
    prisma.adminUser.upsert({
      where: { email: "viewer@insuranceportal.com" },
      update: {},
      create: { name: "Sneha Verma", email: "viewer@insuranceportal.com", passwordHash: passwords[2], role: "VIEWER" },
    }),
    prisma.adminUser.upsert({
      where: { email: "sales@insuranceportal.com" },
      update: {},
      create: { name: "Amit Sharma", email: "sales@insuranceportal.com", passwordHash: passwords[3], role: "SALES" },
    }),
  ]);
  console.log("✓ Admin users");

  // ─── Providers ─────────────────────────────────────────────────────────────
  const providerDefs = [
    {
      slug: "cholamandalam-ms", name: "Cholamandalam MS General Insurance Company Ltd",
      tagline: "Protecting What Matters Most",
      about: "Cholamandalam MS General Insurance is a joint venture between the Murugappa Group and Mitsui Sumitomo Insurance. With over two decades of experience, it offers a comprehensive range of general insurance products across motor, health, travel, and home segments.",
      irdaiRegNo: "123", claimSettlementRatio: 96.2, solvencyRatio: 1.82, networkHospitals: 6500,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/chola-ms.png",
    },
    {
      slug: "icici-lombard", name: "ICICI Lombard General Insurance Company Ltd",
      tagline: "Nibhate Hain",
      about: "ICICI Lombard is India's leading private general insurer with over 20 years of experience. Known for its digital-first approach and high claim settlement ratio, it covers motor, health, travel, home, and commercial risks across India.",
      irdaiRegNo: "115", claimSettlementRatio: 97.8, solvencyRatio: 2.1, networkHospitals: 9400,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/icici-lombard-logo.png",
    },
    {
      slug: "manipal-cigna", name: "Manipal Cigna Health Insurance Company Ltd",
      tagline: "Live Life Fully",
      about: "Manipal Cigna Health Insurance is a joint venture between the Manipal Group and Cigna Corporation. It specializes in health insurance products with a focus on preventive care, wellness, and comprehensive coverage for individuals and families.",
      irdaiRegNo: "151", claimSettlementRatio: 95.1, solvencyRatio: 1.74, networkHospitals: 8600,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/manipal-cigna.png",
    },
    {
      slug: "indusind-general", name: "IndusInd General Insurance Company Ltd",
      tagline: "Insurance Redefined",
      about: "IndusInd General Insurance offers a wide range of insurance products backed by the strong legacy of the IndusInd Group. With a customer-first approach, it provides reliable coverage across health, motor, travel, and home segments.",
      irdaiRegNo: "162", claimSettlementRatio: 93.4, solvencyRatio: 1.65, networkHospitals: 5200,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/IndusInd_General_Insurance.avif",
    },
    {
      slug: "universal-sompo", name: "Universal Sompo General Insurance Company Ltd",
      tagline: "Securing Your Tomorrow",
      about: "Universal Sompo General Insurance is a collaboration between three Indian PSU banks and Sompo Japan Insurance. It offers comprehensive general insurance solutions with the reliability of public sector banks and international expertise.",
      irdaiRegNo: "134", claimSettlementRatio: 94.7, solvencyRatio: 1.71, networkHospitals: 7000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/universal-sompo-general-insurance-co-ltd.avif",
    },
    {
      slug: "care-health", name: "Care Health Insurance Company Ltd",
      tagline: "Kal Bhi. Aaj Bhi.",
      about: "Care Health Insurance (formerly Religare Health Insurance) is one of India's fastest-growing standalone health insurers. It is known for its customer-centric approach, no room rent capping, and unlimited sum insured restoration features.",
      irdaiRegNo: "148", claimSettlementRatio: 95.2, solvencyRatio: 1.68, networkHospitals: 10400,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/Care_health_insurance_logo.png",
    },
    {
      slug: "zurich-kotak", name: "Zurich Kotak General Insurance Company (India) Ltd",
      tagline: "Insure More, Worry Less",
      about: "Zurich Kotak General Insurance is a joint venture between Kotak Mahindra Bank and Zurich Insurance Group. Backed by global expertise and local trust, it delivers comprehensive general insurance solutions across India.",
      irdaiRegNo: "152", claimSettlementRatio: 96.5, solvencyRatio: 1.93, networkHospitals: 7800,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/zurich-kotak.jpg",
    },
    {
      slug: "royal-sundaram", name: "Royal Sundaram General Insurance Co. Ltd",
      tagline: "Go Beyond",
      about: "Royal Sundaram General Insurance is a joint venture between Sundaram Finance and RSA Insurance. One of India's earliest private general insurers, it offers trusted products in health, motor, travel, and home insurance.",
      irdaiRegNo: "111", claimSettlementRatio: 94.3, solvencyRatio: 1.62, networkHospitals: 5800,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/royal-sundaram-logo.png",
    },
    {
      slug: "aditya-birla-health", name: "Aditya Birla Health Insurance Co. Ltd",
      tagline: "Activ Living",
      about: "Aditya Birla Health Insurance is part of the Aditya Birla Capital ecosystem. It's known for its innovative HealthReturns program that rewards healthy behaviour, and for offering comprehensive coverage including chronic disease management.",
      irdaiRegNo: "153", claimSettlementRatio: 96, solvencyRatio: 1.88, networkHospitals: 9200,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/aditya-birla-capital.png",
    },
    {
      slug: "niva-bupa", name: "Niva Bupa Health Insurance Company Ltd",
      tagline: "Your Health. Our Priority.",
      about: "Niva Bupa (formerly Max Bupa) is a standalone health insurer backed by Fettle Tone LLP and Bupa, a leading global healthcare company. It is recognized for direct claim settlement without third-party administrators.",
      irdaiRegNo: "145", claimSettlementRatio: 91.6, solvencyRatio: 1.56, networkHospitals: 8400,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/niva-bupa-health-insurance.png",
    },
    {
      slug: "navi-general", name: "Navi General Insurance Ltd",
      tagline: "Simple. Affordable. Reliable.",
      about: "Navi General Insurance is a tech-driven insurer founded by Sachin Bansal. It focuses on digital distribution and paperless claims, offering affordable health, motor, and home insurance products with a seamless online experience.",
      irdaiRegNo: "155", claimSettlementRatio: 90.1, solvencyRatio: 1.52, networkHospitals: 5000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/navi-insurance.jpg",
    },
    {
      slug: "liberty-general", name: "Liberty General Insurance Ltd",
      tagline: "Freedom to Protect",
      about: "Liberty General Insurance is a joint venture between Liberty Mutual (USA), DP Jindal Group, and Enam Securities. It specializes in motor, health, travel, and home insurance with a focus on quick claim turnaround.",
      irdaiRegNo: "150", claimSettlementRatio: 93.7, solvencyRatio: 1.67, networkHospitals: 5400,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/Liberty_General_Insurance.jpg",
    },
    {
      slug: "arogya-sanjeevani", name: "Arogya Sanjeevani Policy",
      tagline: "Standard Health Cover for All",
      about: "Arogya Sanjeevani is a standard health insurance policy mandated by IRDAI, available across all general and health insurers. It provides essential hospitalization coverage at affordable premiums, making quality health protection accessible to everyone.",
      irdaiRegNo: "IRDAI-STD-AS", claimSettlementRatio: 94.8, solvencyRatio: 1.7, networkHospitals: 8000,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/aarogya_sanjeevni.png",
    },
    {
      slug: "europ-assist", name: "Europ Assist Charge Travel Plan",
      tagline: "Always There When You Need Us",
      about: "Europ Assistance is a global leader in assistance services and travel insurance. Operating in over 200 countries, it provides 24/7 emergency assistance, trip cancellation cover, medical evacuation, and comprehensive travel protection plans.",
      irdaiRegNo: "IRDAI-EA-144", claimSettlementRatio: 92.5, solvencyRatio: 1.6, networkHospitals: null,
      categories: ["travel"],
      logoUrl: "/providers-logo/europe-assist-charge-travel-plan.jpg",
    },
    {
      slug: "new-india-assurance", name: "The New India Assurance Co Ltd",
      tagline: "Largest General Insurer in India",
      about: "The New India Assurance Co. Ltd is India's largest general insurance company and a Fortune 500 entity. Established in 1919, it operates in 28 countries and offers a full range of general insurance products with the backing of the Government of India.",
      irdaiRegNo: "190", claimSettlementRatio: 97.3, solvencyRatio: 2.05, networkHospitals: 11000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/new-india-assurance-co.png",
    },
    {
      slug: "national-insurance", name: "National Insurance Company Ltd",
      tagline: "Trusted Since 1906",
      about: "National Insurance Company Limited is one of India's oldest and most respected PSU general insurers, operating since 1906. Headquartered in Kolkata, it offers comprehensive coverage across health, motor, fire, marine, and engineering segments.",
      irdaiRegNo: "058", claimSettlementRatio: 96.1, solvencyRatio: 1.95, networkHospitals: 9500,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/national-insurance.jpg",
    },
    {
      slug: "united-india-insurance", name: "United India Insurance Company Ltd",
      tagline: "Your Trusted Insurance Partner",
      about: "United India Insurance Company is a government-owned general insurance company headquartered in Chennai. With over 18,300 agents and a vast distribution network, it provides reliable insurance solutions across India.",
      irdaiRegNo: "545", claimSettlementRatio: 95.4, solvencyRatio: 1.78, networkHospitals: 7200,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/United_India_Insurance.webp",
    },
    {
      slug: "oriental-insurance", name: "The Oriental Insurance Company",
      tagline: "Protection You Can Count On",
      about: "The Oriental Insurance Company Limited is a wholly-owned PSU subsidiary of Oriental Insurance that has been serving Indians since 1947. It operates a strong network across India and offers comprehensive general insurance products.",
      irdaiRegNo: "556", claimSettlementRatio: 94.9, solvencyRatio: 1.72, networkHospitals: 6800,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/oriental-insurance-co-logo.png",
    },
    {
      slug: "bajaj-allianz", name: "Bajaj Allianz General Insurance Company Ltd",
      tagline: "Jiyo Befikar",
      about: "Bajaj Allianz General Insurance is a joint venture between Bajaj Finserv and Allianz SE. It is one of India's top private general insurers, known for its 98% claim settlement ratio, 24x7 claim assistance, and wide motor and health portfolio.",
      irdaiRegNo: "113", claimSettlementRatio: 98, solvencyRatio: 2.24, networkHospitals: 10000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/Bajaj_General_.jpg",
    },
    {
      slug: "iffco-tokio", name: "IFFCO-Tokio General Insurance Company Ltd",
      tagline: "A Lot Can Happen, Be Insured",
      about: "IFFCO Tokio General Insurance is a joint venture between IFFCO cooperative and Tokio Marine & Nichido Fire Group of Japan. It offers a wide product portfolio with a strong rural reach and robust digital services.",
      irdaiRegNo: "106", claimSettlementRatio: 95.8, solvencyRatio: 1.83, networkHospitals: 6200,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/iffco-tokio-general-insurance.jpg",
    },
    {
      slug: "hdfc-ergo", name: "HDFC Ergo General Insurance Company Ltd",
      tagline: "Sar Utha Ke Jiyo",
      about: "HDFC ERGO General Insurance is a joint venture between HDFC Ltd and ERGO International AG (Munich Re Group). It's one of India's leading private insurers, known for innovation, tech-enabled services, and consistently high claim settlement.",
      irdaiRegNo: "146", claimSettlementRatio: 97.1, solvencyRatio: 2.15, networkHospitals: 13000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/HDFC-Ergo-logo.png",
    },
    {
      slug: "tata-aig", name: "Tata AIG General Insurance Company Ltd",
      tagline: "Making Insurance Simple",
      about: "Tata AIG General Insurance is a joint venture between Tata Group and American International Group (AIG). Offering products across motor, health, travel, and home insurance, it is known for transparent policies and fast claim processing.",
      irdaiRegNo: "108", claimSettlementRatio: 96.8, solvencyRatio: 2.03, networkHospitals: 8700,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/tata-aig.png",
    },
    {
      slug: "general-central", name: "General Central Insurance Company Ltd",
      tagline: "Comprehensive Coverage for All",
      about: "General Central Insurance offers a broad range of general insurance products across health, motor, and property segments. With a focus on affordability and reach, it serves individuals and businesses across India.",
      irdaiRegNo: "179", claimSettlementRatio: 92, solvencyRatio: 1.55, networkHospitals: 4500,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/generral-central-insurance.png",
    },
    {
      slug: "sbi-general", name: "SBI General Insurance Company Ltd",
      tagline: "Suraksha Aur Bharosa",
      about: "SBI General Insurance is backed by State Bank of India, India's largest bank. Leveraging SBI's vast distribution network of 22,000+ branches, it offers affordable and accessible insurance across motor, health, home, and travel.",
      irdaiRegNo: "144", claimSettlementRatio: 95.6, solvencyRatio: 1.89, networkHospitals: 6000,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/sbi-general.jpg",
    },
    {
      slug: "go-digit", name: "Go Digit General Insurance Ltd",
      tagline: "Insurance, Simplified",
      about: "Go Digit General Insurance (Digit Insurance) is a Bengaluru-based insurer backed by Fairfax Group's Prem Watsa. Known for disrupting the industry with paperless processes, app-based self-inspection, and simple policy language.",
      irdaiRegNo: "158", claimSettlementRatio: 96.4, solvencyRatio: 1.98, networkHospitals: 5600,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/digit-insurance-logo.png",
    },
    {
      slug: "magma-general", name: "Magma General Insurance",
      tagline: "Trusted Protection",
      about: "Magma General Insurance offers accessible general insurance products with a focus on motor and health segments. Backed by Magma Fincorp, it serves customers across semi-urban and rural India with tailored coverage options.",
      irdaiRegNo: "149", claimSettlementRatio: 91.3, solvencyRatio: 1.5, networkHospitals: 3800,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/magma-general-insurance.png",
    },
    {
      slug: "zuno", name: "Zuno General Insurance Company Ltd",
      tagline: "New Age Insurance",
      about: "Zuno General Insurance (formerly Edelweiss General Insurance) is a digital-first insurer offering innovative products in motor, health, and home insurance. It is known for quick claim settlements and customer-friendly policy terms.",
      irdaiRegNo: "157", claimSettlementRatio: 93.2, solvencyRatio: 1.63, networkHospitals: 4200,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/zuno.png",
    },
    {
      slug: "shriram-general", name: "Shriram General Insurance Company Ltd",
      tagline: "Coverage You Can Rely On",
      about: "Shriram General Insurance is part of the Shriram Group, known for its strong presence in the commercial vehicle segment. It offers motor, home, and allied products with a deep distribution network across Tier 2 and Tier 3 cities.",
      irdaiRegNo: "137", claimSettlementRatio: 94.5, solvencyRatio: 1.69, networkHospitals: null,
      categories: ["motor","car","two-wheeler","home"],
      logoUrl: "/providers-logo/shriramgeneralinsurance_logo.jpg",
    },
    {
      slug: "raheja-qbe", name: "Raheja QBE General Insurance",
      tagline: "Assured Protection",
      about: "Raheja QBE General Insurance is a joint venture between the Raheja Group and QBE Insurance Group (Australia). It offers competitively priced general insurance products across health, motor, and commercial lines.",
      irdaiRegNo: "141", claimSettlementRatio: 92.8, solvencyRatio: 1.58, networkHospitals: 3500,
      categories: ["term","health","motor","car","two-wheeler","family-health","group-health","travel","home","life","guaranteed-return","child-savings","retirement"],
      logoUrl: "/providers-logo/rraheja-qbe.jpg",
    },
    {
      slug: "galaxy-health", name: "Galaxy Health Insurance Company Ltd",
      tagline: "Health is Wealth",
      about: "Galaxy Health Insurance is a standalone health insurer focused on delivering affordable and accessible health coverage. With a customer-first philosophy and growing hospital network, it offers individual, family, and senior citizen plans.",
      irdaiRegNo: "165", claimSettlementRatio: 90.5, solvencyRatio: 1.48, networkHospitals: 3200,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/galaxy-health-insurnace.png",
    },
    {
      slug: "covid-standard-health", name: "Covid Standard Health Policy",
      tagline: "Standard COVID Health Protection",
      about: "The Corona Standard Health Policy is an IRDAI-mandated standard health insurance product designed to provide coverage for COVID-19 and related hospitalization expenses. Available across all authorized general and health insurers in India.",
      irdaiRegNo: "IRDAI-COVID-STD", claimSettlementRatio: 93, solvencyRatio: 1.6, networkHospitals: 6000,
      categories: ["health","family-health","group-health"],
      logoUrl: "/providers-logo/covid-standard.jpg",
    },
  ];

  for (const p of providerDefs) {
    await prisma.provider.upsert({
      where: { slug: p.slug },
      update: { claimSettlementRatio: p.claimSettlementRatio, solvencyRatio: p.solvencyRatio, networkHospitals: p.networkHospitals, logoUrl: (p as any).logoUrl ?? null },
      create: { ...p, isActive: true },
    });
  }
  console.log(`✓ Providers (${providerDefs.length})`);

  // ─── Policies skipped ──────────────────────────────────────────────────────
  // Client will create policies via the admin panel.
  // (policyData kept below as an empty array so nothing is inserted)
  const policyData: object[] = [];

    console.log("✓ Policies (0 — client will add via admin panel)");

  console.log("✓ Demo leads (0 — client will add via admin panel)");
  console.log("✓ Due dates (0 — client will add via admin panel)");

  // ─── FAQs ──────────────────────────────────────────────────────────────────
  const faqs = [
    { question: "What is term insurance?", answer: "Term insurance is a pure life insurance product that provides financial protection to your family in case of your untimely death during the policy term. If you survive the term, no benefit is payable unless you opt for return of premium.", category: "term", sortOrder: 1 },
    { question: "How much term insurance cover do I need?", answer: "A common thumb rule is 10–15× your annual income. Also consider outstanding loans, family monthly expenses, inflation, and children's education costs when deciding coverage.", category: "term", sortOrder: 2 },
    { question: "At what age should I buy term insurance?", answer: "The earlier the better. Buying at 25–30 years gives the lowest premiums. Premiums increase significantly with age. Most insurers accept entries up to age 65.", category: "term", sortOrder: 3 },
    { question: "What is return of premium in term plans?", answer: "Return of Premium (ROP) plans refund 100% of total premiums paid if you survive the policy term. Premiums are higher than pure term plans but you get your money back at maturity.", category: "term", sortOrder: 4 },
    { question: "What is cashless hospitalisation?", answer: "Cashless hospitalisation means you don't pay hospital bills upfront. The insurer settles directly with the network hospital. You only pay for non-covered or excluded items.", category: "health", sortOrder: 1 },
    { question: "What is the waiting period in health insurance?", answer: "Most health plans have a 30-day initial waiting period, 2–4 year waiting period for pre-existing diseases, and 1–2 years for specific illnesses like hernia or cataract.", category: "health", sortOrder: 2 },
    { question: "What is restoration benefit in health insurance?", answer: "Restoration benefit automatically reinstates the sum insured if it gets fully exhausted during the policy year — either for the same illness or a different one depending on the plan.", category: "health", sortOrder: 3 },
    { question: "Is family floater or individual plan better?", answer: "Family floaters are cost-effective when all members are young and healthy. Individual plans are safer if any family member has a history of illness. Senior citizens should always have individual plans.", category: "health", sortOrder: 4 },
    { question: "What is No Claim Bonus (NCB) in car insurance?", answer: "NCB is a discount on your Own Damage premium for every claim-free year. It starts at 20% after 1 year and goes up to 50% after 5 consecutive claim-free years. It is transferable between insurers.", category: "motor", sortOrder: 1 },
    { question: "Is motor insurance mandatory?", answer: "Yes. Under the Motor Vehicles Act, every vehicle on Indian roads must have at least Third-Party insurance. Driving without it can result in a ₹2,000 fine and 3 months imprisonment.", category: "motor", sortOrder: 2 },
    { question: "What is IDV in motor insurance?", answer: "Insured Declared Value (IDV) is the current market value of your vehicle, determined by depreciating the manufacturer's listed price. IDV is the maximum amount you can claim in case of theft or total loss.", category: "motor", sortOrder: 3 },
    { question: "What is zero depreciation car insurance?", answer: "Zero depreciation (bumper-to-bumper) cover means your insurer pays the full repair cost without deducting depreciation on parts. Ideal for new cars up to 3–5 years old.", category: "motor", sortOrder: 4 },
    { question: "What is the difference between term and life insurance?", answer: "Term insurance provides only a death benefit — no payout on survival. Life insurance plans (endowment, ULIP, whole life) provide both death benefit and maturity/savings benefit, but premiums are higher.", category: "life", sortOrder: 1 },
    { question: "What is a ULIP?", answer: "ULIP (Unit Linked Insurance Plan) is a life insurance policy that invests part of your premium in market-linked funds. Returns depend on fund performance. They have a mandatory 5-year lock-in period.", category: "life", sortOrder: 2 },
    { question: "What is travel insurance and is it mandatory?", answer: "Travel insurance covers medical emergencies, trip cancellation, lost baggage, and flight delays during travel. It is mandatory for Schengen visa countries and highly recommended for all international trips.", category: "travel", sortOrder: 1 },
    { question: "What does home insurance cover?", answer: "Home insurance typically covers the building structure against fire, flood, earthquake, and cyclone; household contents against theft and burglary; and personal liability. Some plans also cover jewellery and electronics.", category: "home", sortOrder: 1 },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq }).catch(() => {});
  }
  console.log("✓ FAQs");

  // ─── Testimonials ──────────────────────────────────────────────────────────
  const testimonials = [
    { name: "Rajesh Kumar",  city: "Delhi",     rating: 5, body: "Got my term insurance sorted in 10 minutes. The comparison made it so easy to pick the right plan for my family.", category: "term",   isActive: true },
    { name: "Priya Sharma",  city: "Mumbai",    rating: 5, body: "Star Health's cashless claim was processed within hours. Extremely happy with the guidance from InsurancePortal.", category: "health", isActive: true },
    { name: "Amit Singh",    city: "Bangalore", rating: 4, body: "The motor insurance comparison helped me understand exactly what I was paying for. Transparent and quick.", category: "motor",  isActive: true },
    { name: "Sunita Patel",  city: "Ahmedabad", rating: 5, body: "Best platform for comparing insurance. Saved ₹3,000 on my health premium by switching plans through this site.", category: "health", isActive: true },
    { name: "Vikram Nair",   city: "Chennai",   rating: 5, body: "Bought HDFC Click2Protect in under 15 minutes. The advisor called me within 30 minutes and helped with all documentation.", category: "term",   isActive: true },
    { name: "Meena Iyer",    city: "Hyderabad", rating: 4, body: "Very helpful comparison tool. Could compare 5 health plans side by side and pick the one with best claim ratio.", category: "health", isActive: true },
    { name: "Deepak Joshi",  city: "Pune",      rating: 5, body: "Renewed my car insurance instantly. Zero depreciation add-on explained clearly by the advisor. Highly recommended.", category: "motor",  isActive: true },
    { name: "Ananya Bose",   city: "Kolkata",   rating: 5, body: "The travel insurance comparison saved my trip. ICICI Lombard's Travel Shield was perfect for our Europe vacation.", category: "travel", isActive: true },
    { name: "Srikant Rao",   city: "Mysore",    rating: 4, body: "Got a great deal on family floater from Star Health. The portal made it super easy to add all family members.", category: "health", isActive: true },
    { name: "Neha Kapoor",   city: "Jaipur",    rating: 5, body: "Max Life's claim settlement is genuinely the best. My father's claim was settled in 7 working days. Thank you!", category: "term",   isActive: true },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log("✓ Testimonials");

  console.log("\n🎉 Seeding complete!");
  console.log(`\n   Providers : ${providerDefs.length}`);
  console.log(`   Policies  : 0 (client adds via admin panel)`);
  console.log(`   Leads     : 0 (client adds via admin panel)`);
  console.log(`   Due dates : 0 (client adds via admin panel)`);
  console.log("\nAdmin logins:");
  console.log("  Super Admin : admin@insuranceportal.com  / admin123");
  console.log("  Editor      : editor@insuranceportal.com / editor123");
  console.log("  Viewer      : viewer@insuranceportal.com / viewer123");
  console.log("  Sales       : sales@insuranceportal.com  / sales123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
