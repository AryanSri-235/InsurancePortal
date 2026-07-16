import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database (Providers, FAQs, and Testimonials)...");

  // 1. Providers
  const providerDefs = [
    {
      slug: "lic", name: "LIC of India",
      tagline: "Zindagi ke saath bhi, zindagi ke baad bhi",
      about: "Life Insurance Corporation of India is the largest state-owned insurance group and investment company in India, founded in 1956. With over 290 million policies and a pan-India network, LIC remains the most trusted insurer in India.",
      irdaiRegNo: "512", claimSettlementRatio: 98.62, solvencyRatio: 1.76, networkHospitals: 5000,
      categories: ["life", "term", "health"],
      logoUrl: "/providers-logo/lic-logo.png",
    },
    {
      slug: "hdfc-life", name: "HDFC Life",
      tagline: "Sar Utha Ke Jiyo",
      about: "HDFC Life Insurance Company Limited is a leading long-term life insurance solutions provider offering a range of individual and group insurance solutions. It is a joint venture between HDFC Ltd. and abrdn plc.",
      irdaiRegNo: "101", claimSettlementRatio: 99.5, solvencyRatio: 1.93, networkHospitals: null,
      categories: ["life", "term", "health"],
      logoUrl: "/providers-logo/hdfc-life.png",
    },
    {
      slug: "star-health", name: "Star Health Insurance",
      tagline: "Health Insurance Specialists",
      about: "Star Health and Allied Insurance Co. Ltd. is India's first standalone health insurance company, established in 2006. It offers comprehensive retail and corporate health insurance products with a massive hospital network.",
      irdaiRegNo: "129", claimSettlementRatio: 99.06, solvencyRatio: 1.64, networkHospitals: 14000,
      categories: ["health"],
      logoUrl: "/providers-logo/star-health-insurance.png",
    },
    {
      slug: "icici-lombard", name: "ICICI Lombard",
      tagline: "Nibhaye Vaade",
      about: "ICICI Lombard is the largest private sector general insurance company in India. It offers a wide array of products including motor, health, travel, home, and commercial insurance backed by technology-driven claim settlement.",
      irdaiRegNo: "115", claimSettlementRatio: 97.9, solvencyRatio: 2.17, networkHospitals: 8700,
      categories: ["health", "motor", "travel"],
      logoUrl: "/providers-logo/icici-lombard-logo.png",
    },
    {
      slug: "bajaj-allianz", name: "Bajaj Allianz",
      tagline: "Caringly Yours",
      about: "Bajaj Allianz is a joint venture between Bajaj Finserv Limited and Allianz SE. It offers a range of life insurance, general insurance, motor, and health products with one of the largest distribution networks in India.",
      irdaiRegNo: "116", claimSettlementRatio: 99.04, solvencyRatio: 5.18, networkHospitals: 6500,
      categories: ["life", "term", "motor", "health"],
    },
    {
      slug: "sbi-life", name: "SBI Life Insurance",
      tagline: "Poorna Suraksha",
      about: "SBI Life Insurance is a joint venture between State Bank of India and BNP Paribas Cardif. Leveraging SBI's massive branch network, it reaches customers across every corner of India with affordable life and term plans.",
      irdaiRegNo: "111", claimSettlementRatio: 97.05, solvencyRatio: 2.13, networkHospitals: null,
      categories: ["life", "term"],
      logoUrl: "/providers-logo/sbi-life-insurance-logo.png",
    },
    {
      slug: "niva-bupa", name: "Niva Bupa Health Insurance",
      tagline: "Go Fearless",
      about: "Niva Bupa (formerly Max Bupa) is a standalone health insurance company, a joint venture between True North and Bupa, UK. Known for its innovative lock-the-clock feature and customer-centric health plans.",
      irdaiRegNo: "145", claimSettlementRatio: 91.6, solvencyRatio: 1.73, networkHospitals: 10000,
      categories: ["health"],
      logoUrl: "/providers-logo/niva-bupa-health-insurance.png",
    },
    {
      slug: "tata-aig", name: "Tata AIG",
      tagline: "Insurance. Made Simple.",
      about: "Tata AIG General Insurance Company Ltd. is a joint venture between Tata Group and American International Group (AIG). It offers a wide range of general insurance products with strong claim settlement and a focus on digital ease.",
      irdaiRegNo: "108", claimSettlementRatio: 97.47, solvencyRatio: 1.83, networkHospitals: 7200,
      categories: ["motor", "health", "travel", "home"],
      logoUrl: "/providers-logo/tata-aig.png",
    },
    {
      slug: "kotak-life", name: "Kotak Life Insurance",
      tagline: "Karo Zyada Ka Iraada",
      about: "Kotak Life Insurance is a wholly owned subsidiary of Kotak Mahindra Bank Ltd. It offers a comprehensive range of life insurance, ULIP, and term plans backed by one of India's most trusted banking brands.",
      irdaiRegNo: "107", claimSettlementRatio: 98.82, solvencyRatio: 3.06, networkHospitals: null,
      categories: ["life", "term"],
      logoUrl: "/providers-logo/kotak-life-insurance.png",
    },
    {
      slug: "reliance-general", name: "Reliance General Insurance",
      tagline: "Har Ek Family Ke Liye",
      about: "Reliance General Insurance is one of the leading general insurance companies in India, offering motor, health, home, and travel insurance products with a strong digital claims process.",
      irdaiRegNo: "103", claimSettlementRatio: 98.0, solvencyRatio: 1.57, networkHospitals: 5800,
      categories: ["motor", "health", "travel", "home"],
      logoUrl: "/providers-logo/reliance-general.png",
    },
    {
      slug: "max-life", name: "Max Life Insurance",
      tagline: "A Lot to Live For",
      about: "Max Life Insurance Co. Ltd. is a joint venture between Max Financial Services and Axis Bank. Known for its industry-leading claim settlement ratio and a customer-first approach to life and term insurance.",
      irdaiRegNo: "104", claimSettlementRatio: 99.65, solvencyRatio: 2.05, networkHospitals: null,
      categories: ["term", "life"],
      logoUrl: "/providers-logo/max-life-insurance.png",
    },
    {
      slug: "aditya-birla-sunlife", name: "Aditya Birla Sun Life Insurance",
      tagline: "Jiyo Sar Utha Ke",
      about: "Aditya Birla Sun Life Insurance Company Limited (ABSLI) is a joint venture between the Aditya Birla Group and Sun Life Financial Inc. of Canada. It offers a comprehensive range of term, life, and ULIP products.",
      irdaiRegNo: "109", claimSettlementRatio: 98.07, solvencyRatio: 1.77, networkHospitals: null,
      categories: ["term", "life"],
    },
    {
      slug: "care-health", name: "Care Health Insurance",
      tagline: "Together We Care",
      about: "Care Health Insurance (formerly Religare Health Insurance) is one of India's leading standalone health insurance companies offering comprehensive health products including individual, family, and senior citizen plans.",
      irdaiRegNo: "148", claimSettlementRatio: 95.2, solvencyRatio: 1.62, networkHospitals: 19000,
      categories: ["health"],
    },
    {
      slug: "digit-insurance", name: "Digit Insurance",
      tagline: "Making Insurance Simple",
      about: "Go Digit General Insurance is a tech-forward insurance company founded in 2016. Known for its paperless processes, self-inspection feature, and transparent policies — a favourite among young customers.",
      irdaiRegNo: "158", claimSettlementRatio: 96.0, solvencyRatio: 1.76, networkHospitals: 6400,
      categories: ["motor", "health", "travel"],
    },
    {
      slug: "hdfc-ergo", name: "HDFC ERGO",
      tagline: "Everything Covered",
      about: "HDFC ERGO General Insurance is a joint venture between HDFC Ltd. and ERGO International. It is India's third-largest non-life insurer offering motor, health, travel, home, and commercial insurance.",
      irdaiRegNo: "146", claimSettlementRatio: 99.8, solvencyRatio: 1.67, networkHospitals: 13000,
      categories: ["motor", "health", "travel", "home"],
      logoUrl: "/providers-logo/hdfc-ergo.png",
    },
    {
      slug: "new-india-assurance", name: "New India Assurance",
      tagline: "The World's Trusted Insurer",
      about: "New India Assurance Company Limited is the largest public-sector non-life insurer in India, established in 1919 and now present in 28 countries. Trusted by millions for motor, health, marine, and property insurance.",
      irdaiRegNo: "190", claimSettlementRatio: 96.5, solvencyRatio: 2.05, networkHospitals: 9000,
      categories: ["motor", "health", "home", "travel"],
      logoUrl: "/providers-logo/the-new-india-assurance.png",
    },
    {
      slug: "edelweiss-tokio", name: "Edelweiss Tokio Life",
      tagline: "Be Assured",
      about: "Edelweiss Tokio Life Insurance is a joint venture between Edelweiss Financial Services and Tokio Marine Holdings Inc. of Japan. It is known for its innovative term plans and unique features like Better Half Benefit.",
      irdaiRegNo: "147", claimSettlementRatio: 98.09, solvencyRatio: 2.13, networkHospitals: null,
      categories: ["term", "life"],
    },
    {
      slug: "pnb-metlife", name: "PNB MetLife",
      tagline: "Milkar Chalein",
      about: "PNB MetLife India Insurance Co. Ltd. is a joint venture between Punjab National Bank and MetLife International Holdings LLC. It leverages PNB's vast rural reach to offer affordable term and life insurance.",
      irdaiRegNo: "117", claimSettlementRatio: 97.18, solvencyRatio: 1.97, networkHospitals: null,
      categories: ["term", "life"],
      logoUrl: "/providers-logo/pnb-metlife.avif",
    },
    {
      slug: "royal-sundaram", name: "Royal Sundaram General Insurance",
      tagline: "Sab Par Dhyan",
      about: "Royal Sundaram General Insurance is a joint venture between Sundaram Finance and Ageas Insurance. One of the first private-sector general insurers in India, it specialises in motor, health, and home insurance.",
      irdaiRegNo: "102", claimSettlementRatio: 98.5, solvencyRatio: 1.72, networkHospitals: 5200,
      categories: ["motor", "health", "home"],
      logoUrl: "/providers-logo/royal-sundaram-logo.png",
    },
    {
      slug: "future-generali", name: "Future Generali India Insurance",
      tagline: "Jiyo Befikar",
      about: "Future Generali India Insurance Company Ltd. is a joint venture between Future Group and Generali Group of Italy. It offers a complete range of non-life insurance products including motor, health, travel, and property insurance.",
      irdaiRegNo: "132", claimSettlementRatio: 97.3, solvencyRatio: 1.65, networkHospitals: 6100,
      categories: ["motor", "health", "travel", "home"],
    },
    {
      slug: "aic",
      name: "Agriculture Insurance Company of India (AIC)",
      tagline: "Insuring Agriculture, Securing Farmers",
      about: "AIC is India's premier agriculture insurance company, implementing PMFBY and other government crop insurance schemes for millions of farmers across India.",
      irdaiRegNo: "129", claimSettlementRatio: 85.0, solvencyRatio: 1.50,
      categories: ["crop"],
    },
    {
      slug: "icici-prudential",
      name: "ICICI Prudential Life Insurance",
      tagline: "Zimmedaar Kadam",
      about: "ICICI Prudential Life Insurance is one of India's leading private life insurers offering comprehensive protection and savings solutions including term, ULIP and pension plans.",
      irdaiRegNo: "105", claimSettlementRatio: 98.56, solvencyRatio: 2.01,
      categories: ["term", "life", "pension"],
    },
  ];

  for (const p of providerDefs) {
    await prisma.provider.upsert({
      where: { slug: p.slug },
      update: {
        claimSettlementRatio: p.claimSettlementRatio,
        solvencyRatio: p.solvencyRatio,
        networkHospitals: p.networkHospitals,
        logoUrl: p.logoUrl ?? null,
      },
      create: { ...p, isActive: true },
    });
  }
  console.log(`✓ Seeded ${providerDefs.length} providers.`);

  // 2. FAQs
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
    { question: "What is the difference between term and life insurance?", answer: "Term insurance provides only a death benefit — no payout on survival. Life insurance plans (endowment, ULIP, whole life) provide both death benefit and savings/maturity benefit, but premiums are higher.", category: "life", sortOrder: 1 },
    { question: "What is a ULIP?", answer: "ULIP (Unit Linked Insurance Plan) is a life insurance policy that invests part of your premium in market-linked funds. Returns depend on fund performance. They have a mandatory 5-year lock-in period.", category: "life", sortOrder: 2 },
    { question: "What is travel insurance and is it mandatory?", answer: "Travel insurance covers medical emergencies, trip cancellation, lost baggage, and flight delays during travel. It is mandatory for Schengen visa countries and highly recommended for all international trips.", category: "travel", sortOrder: 1 },
    { question: "What does home insurance cover?", answer: "Home insurance typically covers the building structure against fire, flood, earthquake, and cyclone; household contents against theft and burglary; and personal liability. Some plans also cover jewellery and electronics.", category: "home", sortOrder: 1 },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq }).catch(() => {});
  }
  console.log("✓ Seeded FAQs.");

  // 3. Testimonials
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
  console.log("✓ Seeded Testimonials.");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
