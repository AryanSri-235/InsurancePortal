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
      create: { name: "Amit Sharma", email: "sales@insuranceportal.com", passwordHash: passwords[3], role: "VIEWER" },
    }),
  ]);
  console.log("✓ Admin users");

  // ─── Providers ─────────────────────────────────────────────────────────────
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

  const providers: Record<string, { id: number }> = {};
  for (const p of providerDefs) {
    const result = await prisma.provider.upsert({
      where: { slug: p.slug },
      update: { claimSettlementRatio: p.claimSettlementRatio, solvencyRatio: p.solvencyRatio, networkHospitals: p.networkHospitals, logoUrl: (p as any).logoUrl ?? null },
      create: { ...p, isActive: true },
    });
    providers[p.slug] = result;
  }
  console.log(`✓ Providers (${providerDefs.length})`);

  // Helper
  const pid = (slug: string) => providers[slug].id;

  // ─── Policies ──────────────────────────────────────────────────────────────
  const policyData = [

    // ══════════════════════════════════════════════════
    //  TERM INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "lic-jeevan-amar", providerId: pid("lic"), name: "LIC Jeevan Amar", category: "term",
      description: "Pure term insurance plan providing high life cover at affordable premiums. Flexible sum assured and payout options make it ideal for all income groups.",
      premiumStartsFrom: 490, coverAmount: "25 Lakh – 5 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Death benefit payout to nominee", "Level or increasing sum assured option", "Accidental Death Benefit rider", "Tax benefit under Section 80C"],
      exclusions: ["Suicide within first year", "Fraudulent disclosure"],
      documentsRequired: ["Aadhaar card", "PAN card", "Income proof (last 3 years ITR)", "Medical examination reports"],
      isFeatured: true,
    },
    {
      slug: "hdfc-click2protect-super", providerId: pid("hdfc-life"), name: "HDFC Click 2 Protect Super", category: "term",
      description: "Comprehensive term plan with life stage protection, return of premium option, and critical illness cover. Best-selling online term plan.",
      premiumStartsFrom: 656, coverAmount: "50 Lakh – 10 Crore", policyTerm: "5 – 50 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Increasing cover at key life stages", "Return of premium on survival", "Critical illness benefit rider", "Waiver of premium on disability"],
      exclusions: ["Suicide within first year", "Self-inflicted injury"],
      documentsRequired: ["Aadhaar", "PAN", "Salary slips (3 months)", "Bank statements (6 months)"],
      isFeatured: true,
    },
    {
      slug: "max-life-smart-term", providerId: pid("max-life"), name: "Max Life Smart Secure Plus", category: "term",
      description: "Award-winning term plan with industry-leading 99.65% claim settlement ratio. Multiple benefit options and high flexibility.",
      premiumStartsFrom: 601, coverAmount: "50 Lakh – 20 Crore", policyTerm: "10 – 67 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["99.65% claim settlement — highest in industry", "Critical illness cover add-on", "Premium back option on survival", "Special rates for non-smokers and women"],
      exclusions: ["Suicide in first 12 months", "Aviation accident (unless rider purchased)"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
      isFeatured: true,
    },
    {
      slug: "bajaj-etouch-term", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz eTouch Term Plan", category: "term",
      description: "Online term plan with life cover, accidental total permanent disability benefit, and optional critical illness cover.",
      premiumStartsFrom: 528, coverAmount: "50 Lakh – 5 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["3 plan options: Life, Life + CI, Life + ADB", "Special premium rates for women and non-smokers", "Increasing sum assured option", "Tax benefits under 80C and 10(10D)"],
      exclusions: ["Suicide in first year", "Pre-existing disease within waiting period"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
      isFeatured: false,
    },
    {
      slug: "sbi-eshield-next", providerId: pid("sbi-life"), name: "SBI Life eShield Next", category: "term",
      description: "Flexible online term plan with multiple cover options and enhanced protection against critical illness.",
      premiumStartsFrom: 575, coverAmount: "30 Lakh – 5 Crore", policyTerm: "5 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["3 plan options for flexibility", "Increasing sum assured with age", "Premium waiver on critical illness", "Tax savings under Section 80C"],
      exclusions: ["Suicide in first year", "War or act of terrorism"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical tests"],
      isFeatured: false,
    },
    {
      slug: "kotak-e-term", providerId: pid("kotak-life"), name: "Kotak e-Term Plan", category: "term",
      description: "Pure online term plan with high coverage, special rates for women, and flexible lump sum or income payout options.",
      premiumStartsFrom: 509, coverAmount: "25 Lakh – 10 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Special discount for women (5%)", "Lump sum or monthly income payout", "Accidental death benefit rider", "Non-smoker discount available"],
      exclusions: ["Suicide within 12 months", "Participation in criminal activity"],
      documentsRequired: ["Aadhaar", "PAN", "Address proof", "Salary slips or ITR"],
      isFeatured: true,
    },
    {
      slug: "aditya-birla-shield-premier", providerId: pid("aditya-birla-sunlife"), name: "ABSLI Shield Premier Plan", category: "term",
      description: "Comprehensive term plan with waiver of premium on critical illness, monthly income option, and long coverage up to age 85.",
      premiumStartsFrom: 645, coverAmount: "50 Lakh – 10 Crore", policyTerm: "10 – 55 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Coverage up to age 85", "Monthly income option for family", "Critical illness and disability waiver", "Return of premium option available"],
      exclusions: ["Suicide within 12 months", "Hazardous sports"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical examination"],
      isFeatured: false,
    },
    {
      slug: "edelweiss-zindagi-plus", providerId: pid("edelweiss-tokio"), name: "Edelweiss Tokio Zindagi Plus", category: "term",
      description: "Unique term plan with Better Half Benefit — your spouse gets free cover equal to 50% of your sum assured.",
      premiumStartsFrom: 589, coverAmount: "25 Lakh – 10 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Better Half Benefit — free cover for spouse", "Terminal illness benefit", "Accidental death benefit rider", "Discount for women and non-smokers"],
      exclusions: ["Suicide in first year", "Drug abuse or intoxication"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
      isFeatured: false,
    },
    {
      slug: "pnb-metlife-mera-term", providerId: pid("pnb-metlife"), name: "PNB MetLife Mera Term Plan Plus", category: "term",
      description: "Affordable term plan from PNB MetLife with flexible payouts, critical illness cover, and accidental benefit rider.",
      premiumStartsFrom: 550, coverAmount: "10 Lakh – 10 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Critical illness cover for 50 conditions", "Monthly income option", "Accidental death benefit available", "Tax savings under 80C"],
      exclusions: ["Self-inflicted injury", "War or terrorism"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical tests"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  TERM INSURANCE — WOMEN SPECIFIC
    // ══════════════════════════════════════════════════
    {
      slug: "hdfc-women-term", providerId: pid("hdfc-life"), name: "HDFC Life Click 2 Protect (Women)", category: "term", subCategory: "women",
      description: "Specially designed term plan for women with lower premiums, breast cancer cover, and critical illness riders.",
      premiumStartsFrom: 499, coverAmount: "50 Lakh – 10 Crore", policyTerm: "5 – 50 years", eligibilityAge: "18 – 60 years",
      keyBenefits: ["Up to 25% lower premiums for women", "Breast and cervical cancer cover included", "Critical illness waiver of premium", "Maternity complication cover"],
      exclusions: ["Suicide in first year", "Cosmetic surgery complications"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
      isFeatured: true,
    },
    {
      slug: "max-life-women-term", providerId: pid("max-life"), name: "Max Life Smart Secure (Women)", category: "term", subCategory: "women",
      description: "Max Life's term plan for women with 20% premium discount and enhanced critical illness cover for female-specific conditions.",
      premiumStartsFrom: 480, coverAmount: "50 Lakh – 20 Crore", policyTerm: "10 – 67 years", eligibilityAge: "18 – 60 years",
      keyBenefits: ["20% lower premium for women", "Female-specific critical illness cover", "Waiver of premium on disability", "Lump sum or income payout option"],
      exclusions: ["Suicide in first year", "Hazardous activities"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical examination"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  RETURN OF PREMIUM PLANS
    // ══════════════════════════════════════════════════
    {
      slug: "hdfc-click2protect-rop", providerId: pid("hdfc-life"), name: "HDFC Click 2 Protect — Return of Premium", category: "term", subCategory: "return-premium",
      description: "Get 100% of total premiums back if you survive the policy term. Full life cover + full money back — best of both worlds.",
      premiumStartsFrom: 1200, coverAmount: "50 Lakh – 5 Crore", policyTerm: "15 – 40 years", eligibilityAge: "18 – 55 years",
      keyBenefits: ["100% premium refund on maturity", "Full life cover throughout the term", "Critical illness rider available", "Tax benefit on premium paid"],
      exclusions: ["Suicide in first year", "Pre-existing terminal illness"],
      documentsRequired: ["Aadhaar", "PAN", "Salary slips", "Medical reports"],
      isFeatured: true,
    },
    {
      slug: "bajaj-rop-term", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Smart Protect Goal (ROP)", category: "term", subCategory: "return-premium",
      description: "Return of premium term plan from Bajaj Allianz with guaranteed maturity benefit and flexible premium paying options.",
      premiumStartsFrom: 1050, coverAmount: "30 Lakh – 5 Crore", policyTerm: "15 – 40 years", eligibilityAge: "18 – 55 years",
      keyBenefits: ["Guaranteed 100% return of premiums", "Life cover + savings in one plan", "Short premium paying term options", "Tax benefits under 80C and 10(10D)"],
      exclusions: ["Suicide in first year", "Misrepresentation of facts"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical examination"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  HEALTH INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "star-comprehensive", providerId: pid("star-health"), name: "Star Comprehensive Insurance", category: "health",
      description: "All-in-one health insurance with no room rent sub-limit, unlimited restoration, and OPD cover included.",
      premiumStartsFrom: 8500, coverAmount: "5 Lakh – 1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "3 months – 65 years",
      keyBenefits: ["No room rent cap", "Unlimited automatic restoration", "600+ day-care procedures", "OPD cover included", "Maternity benefit after 2 years"],
      exclusions: ["Pre-existing diseases (2 yr waiting period)", "Cosmetic surgery", "Dental (unless accidental)"],
      documentsRequired: ["Aadhaar", "Age proof", "Medical history form"],
      isFeatured: true,
    },
    {
      slug: "icici-health-advantage", providerId: pid("icici-lombard"), name: "ICICI Lombard Health Advantage", category: "health",
      description: "Flexible health plan with cumulative bonus up to 100% and a digital wellness rewards program.",
      premiumStartsFrom: 7200, coverAmount: "3 Lakh – 50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "5 – 65 years",
      keyBenefits: ["10% cumulative bonus per claim-free year (max 100%)", "Wellness rewards program", "8700+ network hospitals", "No co-payment for in-patient treatment"],
      exclusions: ["Pre-existing diseases (3 yr waiting period)", "Infertility treatment"],
      documentsRequired: ["Aadhaar", "PAN", "Recent medical records"],
      isFeatured: true,
    },
    {
      slug: "niva-bupa-reassure", providerId: pid("niva-bupa"), name: "Niva Bupa ReAssure 2.0", category: "health",
      description: "Smart health plan with lock the clock, recharge benefit, and booster for claim-free years.",
      premiumStartsFrom: 9200, coverAmount: "3 Lakh – 1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Lock the Clock — premium locked at entry age", "Recharge benefit for extra coverage", "Booster benefit — 50% increase each claim-free year", "10,000+ network hospitals"],
      exclusions: ["Pre-existing diseases (waiting period applies)", "Experimental treatments"],
      documentsRequired: ["Aadhaar", "Age proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "care-health-supreme", providerId: pid("care-health"), name: "Care Health Supreme", category: "health",
      description: "Top-ranked health plan with 19,000+ network hospitals, unlimited restoration, and no sub-limits on room rent.",
      premiumStartsFrom: 7900, coverAmount: "5 Lakh – 6 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "91 days – 75 years",
      keyBenefits: ["19,000+ network hospitals — largest network", "Unlimited restoration of sum insured", "No room rent sub-limit", "Instant cashless approval", "Annual health check-up included"],
      exclusions: ["Pre-existing diseases (3 yr waiting)", "HIV/AIDS treatment"],
      documentsRequired: ["Aadhaar", "Age proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "hdfc-ergo-optima-secure", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Optima Secure", category: "health",
      description: "Feature-packed health plan with 4× coverage benefit, no claim bonus up to 50%, and unlimited restoration.",
      premiumStartsFrom: 8100, coverAmount: "5 Lakh – 2 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "91 days – 65 years",
      keyBenefits: ["4× coverage benefit — sum insured grows 4× in 4 years", "No claim bonus up to 50%", "13,000+ cashless hospitals", "No disease-wise sub-limits", "Restore benefit unlimited times"],
      exclusions: ["Pre-existing diseases (waiting period)", "Intentional self-injury"],
      documentsRequired: ["Aadhaar", "PAN", "Medical history"],
      isFeatured: true,
    },
    {
      slug: "digit-health-care", providerId: pid("digit-insurance"), name: "Digit Health Care Plus", category: "health",
      description: "Simple and transparent health plan from Digit with no medical tests required up to age 45 and unlimited sum insured restoration.",
      premiumStartsFrom: 6500, coverAmount: "3 Lakh – 25 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "91 days – 65 years",
      keyBenefits: ["No medical tests up to age 45", "Unlimited restoration of sum insured", "6400+ network hospitals", "Quick digital claim process", "Monthly premium payment option"],
      exclusions: ["Pre-existing conditions (2 yr wait)", "Non-allopathic treatments"],
      documentsRequired: ["Aadhaar", "Self-declaration form"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-medicare", providerId: pid("tata-aig"), name: "Tata AIG MediCare", category: "health",
      description: "Comprehensive health plan with no sub-limits on room rent, ICU, or treatment-wise limits.",
      premiumStartsFrom: 6800, coverAmount: "5 Lakh – 50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "90 days – 65 years",
      keyBenefits: ["No sub-limit on room rent or ICU", "Restoration of 100% sum insured once per year", "7200+ network hospitals", "No claim bonus up to 150%"],
      exclusions: ["Pre-existing diseases (3 yr waiting)", "Obesity-related treatments"],
      documentsRequired: ["Aadhaar", "PAN", "Medical records if age > 45"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  FAMILY HEALTH INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "star-family-health-optima", providerId: pid("star-health"), name: "Star Family Health Optima", category: "health", subCategory: "family floater",
      description: "Best-selling family floater plan with auto-recharge and cover for entire family under one policy at one premium.",
      premiumStartsFrom: 11500, coverAmount: "3 Lakh – 25 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years (child from 3 months)",
      keyBenefits: ["Auto-recharge of sum insured", "Air ambulance cover up to ₹2.5 lakh", "Entire family under single sum insured", "600+ day-care treatments covered"],
      exclusions: ["Pre-existing conditions (3 yr waiting)", "Maternity in first 36 months"],
      documentsRequired: ["Aadhaar for all members", "Age proof", "Medical history"],
      isFeatured: true,
    },
    {
      slug: "care-health-family", providerId: pid("care-health"), name: "Care Health Family Floater", category: "health", subCategory: "family floater",
      description: "Comprehensive family floater with the largest hospital network in India and no sub-limits.",
      premiumStartsFrom: 14000, coverAmount: "5 Lakh – 1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "91 days – 65 years",
      keyBenefits: ["19,000+ hospitals — largest in India", "Cover for 4 family members in one plan", "No room rent sub-limit", "Restore benefit for recurring illnesses", "Maternity cover after 2 years"],
      exclusions: ["Pre-existing diseases (3 yr wait)", "Adventure sports injuries"],
      documentsRequired: ["Aadhaar for all members", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "hdfc-ergo-my-health-optima", providerId: pid("hdfc-ergo"), name: "HDFC ERGO My:Health Medisure", category: "health", subCategory: "family floater",
      description: "Flexible family health plan with restore benefit, mental health cover, and no claim bonus.",
      premiumStartsFrom: 12800, coverAmount: "3 Lakh – 50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "91 days – 65 years",
      keyBenefits: ["Mental health treatment cover", "Annual health check-up for all members", "Restore benefit — full sum insured restored once", "OPD cover option available", "13,000+ cashless hospitals"],
      exclusions: ["Pre-existing conditions (waiting period)", "Dental without accident"],
      documentsRequired: ["Aadhaar for all members", "Medical history"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  GROUP HEALTH INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "icici-group-health", providerId: pid("icici-lombard"), name: "ICICI Lombard Group Mediclaim", category: "health", subCategory: "group",
      description: "Corporate group health insurance for employees with no waiting period and seamless HR integration.",
      premiumStartsFrom: 4500, coverAmount: "1 Lakh – 10 Lakh per person", policyTerm: "1 year (renewable)", eligibilityAge: "All employees and dependants",
      keyBenefits: ["No waiting period for pre-existing diseases", "Maternity cover included", "Cashless at 8700+ hospitals", "Digital HR portal for claims", "Flexible top-up options"],
      exclusions: ["Cosmetic or aesthetic procedures", "Self-inflicted injuries"],
      documentsRequired: ["Employee list", "Company registration", "KYC of members"],
      isFeatured: false,
    },
    {
      slug: "new-india-group-health", providerId: pid("new-india-assurance"), name: "New India Group Mediclaim", category: "health", subCategory: "group",
      description: "Government-backed group mediclaim for corporates, SMEs, and associations with broad coverage.",
      premiumStartsFrom: 3800, coverAmount: "1 Lakh – 15 Lakh per person", policyTerm: "1 year (renewable)", eligibilityAge: "All employees",
      keyBenefits: ["No individual underwriting for groups of 7+", "Covers pre-existing diseases from day one", "9000+ empanelled hospitals", "Floater and individual sum insured options"],
      exclusions: ["Dental (unless accidental)", "OPD by default (can be added)"],
      documentsRequired: ["List of employees", "Company PAN", "Group policy form"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  CAR INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "bajaj-car-insurance", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Comprehensive Car Insurance", category: "motor", subCategory: "car",
      description: "Comprehensive car insurance with zero depreciation, 24/7 roadside assistance, and cashless claims at 4000+ garages.",
      premiumStartsFrom: 2500, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years old",
      keyBenefits: ["Zero depreciation cover", "24×7 roadside assistance", "Cashless repairs at 4000+ garages", "NCB protection add-on", "Engine protection cover"],
      exclusions: ["Drunk driving", "Driving without valid license", "Mechanical breakdown"],
      documentsRequired: ["RC book copy", "Previous insurance policy", "Driving license"],
      isFeatured: true,
    },
    {
      slug: "icici-complete-cover", providerId: pid("icici-lombard"), name: "ICICI Lombard Complete Cover", category: "motor", subCategory: "car",
      description: "All-round car insurance with instant cashless claim settlement and 24/7 support at 8700+ garages.",
      premiumStartsFrom: 2800, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Instant claim settlement", "8700+ cashless garages", "Consumables cover add-on", "Key replacement cover", "Tyre protection add-on"],
      exclusions: ["Driving under influence", "Racing or speed testing"],
      documentsRequired: ["RC copy", "Driving license", "Previous policy"],
      isFeatured: true,
    },
    {
      slug: "tata-aig-car-insurance", providerId: pid("tata-aig"), name: "Tata AIG Comprehensive Car Insurance", category: "motor", subCategory: "car",
      description: "Feature-rich car insurance with emergency assistance, return to invoice cover, and roadside help.",
      premiumStartsFrom: 2650, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Return to invoice cover", "Emergency hotel accommodation benefit", "Personal accident cover ₹15 lakh", "Roadside assistance — towing, battery jump-start"],
      exclusions: ["Drunk driving", "Usage outside geographic area"],
      documentsRequired: ["RC", "Driving license", "Aadhaar", "Previous policy"],
      isFeatured: false,
    },
    {
      slug: "digit-car-insurance", providerId: pid("digit-insurance"), name: "Digit Comprehensive Car Insurance", category: "motor", subCategory: "car",
      description: "100% digital car insurance from Digit with self-inspection, instant policy issuance, and 6400+ garages.",
      premiumStartsFrom: 2400, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Self-inspection via app — no surveyor visit", "Instant policy within 5 minutes", "Zero depreciation cover add-on", "Motor protection plan available", "Pay-as-you-drive option"],
      exclusions: ["Drunk driving", "Non-private use of vehicle"],
      documentsRequired: ["RC", "Driving license", "Vehicle photos (app-based)"],
      isFeatured: false,
    },
    {
      slug: "hdfc-ergo-car-insurance", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Comprehensive Car Insurance", category: "motor", subCategory: "car",
      description: "Trusted comprehensive car insurance from HDFC ERGO with 99.8% claim settlement and 13,000+ cashless garages.",
      premiumStartsFrom: 2700, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["99.8% claim settlement ratio", "13,000+ cashless garages", "On-the-spot claim approval", "No-claim bonus up to 50%", "Zero depreciation rider"],
      exclusions: ["Mechanical breakdown", "Drunk driving"],
      documentsRequired: ["RC", "Driving license", "Previous policy copy"],
      isFeatured: false,
    },
    {
      slug: "royal-sundaram-car-insurance", providerId: pid("royal-sundaram"), name: "Royal Sundaram Comprehensive Car Insurance", category: "motor", subCategory: "car",
      description: "Affordable comprehensive car insurance with guaranteed windshield repair and emergency taxi benefit.",
      premiumStartsFrom: 2300, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Guaranteed windshield repair benefit", "Emergency taxi benefit if car laid up", "NCB protection available", "Zero depreciation add-on", "5200+ network garages"],
      exclusions: ["Racing", "Driving under influence"],
      documentsRequired: ["RC", "Driving license", "Previous policy"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  TWO-WHEELER INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "bajaj-bike-insurance", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Two-Wheeler Package Policy", category: "motor", subCategory: "bike",
      description: "Comprehensive two-wheeler insurance with optional zero depreciation, engine protection, and roadside assistance.",
      premiumStartsFrom: 1100, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Any two-wheeler",
      keyBenefits: ["Zero depreciation add-on available", "Roadside assistance 24×7", "Personal accident cover ₹15 lakh", "NCB up to 50% for claim-free years", "Cashless repairs at 4000+ garages"],
      exclusions: ["Riding without helmet", "Driving under influence"],
      documentsRequired: ["RC", "Driving license", "Previous policy"],
      isFeatured: true,
    },
    {
      slug: "reliance-bike-insurance", providerId: pid("reliance-general"), name: "Reliance Bike Insurance", category: "motor", subCategory: "bike",
      description: "Affordable two-wheeler insurance with long-term options up to 5 years and hassle-free online claim.",
      premiumStartsFrom: 1200, coverAmount: "As per IDV", policyTerm: "1 – 5 years", eligibilityAge: "Any two-wheeler",
      keyBenefits: ["Long-term policy option (up to 5 years)", "Personal accident cover ₹15 lakh", "Zero depreciation add-on available", "Cashless repairs at 1500+ garages"],
      exclusions: ["Riding without helmet", "Driving under influence"],
      documentsRequired: ["RC", "Driving license", "Previous policy"],
      isFeatured: false,
    },
    {
      slug: "digit-bike-insurance", providerId: pid("digit-insurance"), name: "Digit Two-Wheeler Insurance", category: "motor", subCategory: "bike",
      description: "Instant digital two-wheeler insurance from Digit with self-inspection and quick claim settlement.",
      premiumStartsFrom: 950, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Any two-wheeler",
      keyBenefits: ["Instant policy via app in 2 minutes", "Self-inspection — no agent visit", "Zero depreciation add-on", "Personal accident cover ₹15 lakh", "Roadside assistance"],
      exclusions: ["Riding without valid license", "Drunk riding"],
      documentsRequired: ["RC", "License", "Vehicle photo (self-inspection)"],
      isFeatured: false,
    },
    {
      slug: "hdfc-ergo-bike-insurance", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Two-Wheeler Insurance", category: "motor", subCategory: "bike",
      description: "Reliable two-wheeler insurance from HDFC ERGO with no inspection renewal and NCB up to 50%.",
      premiumStartsFrom: 1050, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Any two-wheeler",
      keyBenefits: ["No inspection required for online renewal", "NCB up to 50% on claim-free years", "Zero depreciation add-on", "Consumables cover", "Cashless at 13,000+ workshops"],
      exclusions: ["Riding under influence", "Commercial use of private vehicle"],
      documentsRequired: ["RC", "Driving license", "Previous policy"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  TRAVEL INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "icici-travel-shield", providerId: pid("icici-lombard"), name: "ICICI Lombard Travel Shield", category: "travel",
      description: "Comprehensive international and domestic travel insurance covering medical emergencies, trip cancellation, and loss of baggage.",
      premiumStartsFrom: 350, coverAmount: "₹1 Lakh – $5,00,000 (international)", policyTerm: "Per trip / Annual", eligibilityAge: "3 months – 70 years",
      keyBenefits: ["Emergency medical expenses covered", "Trip cancellation and interruption", "Loss of baggage and passport", "Flight delay compensation", "24×7 travel assistance helpline"],
      exclusions: ["Pre-existing terminal illness", "Adventure sports (unless rider)", "Alcohol/drug-related incidents"],
      documentsRequired: ["Passport copy", "Travel tickets", "Visa copy"],
      isFeatured: true,
    },
    {
      slug: "tata-aig-travel-guard", providerId: pid("tata-aig"), name: "Tata AIG Travel Guard", category: "travel",
      description: "Feature-rich travel plan with missed flight connection cover, medical evacuation, and hijack distress allowance.",
      premiumStartsFrom: 420, coverAmount: "Up to $2,50,000 medical", policyTerm: "Per trip", eligibilityAge: "6 months – 70 years",
      keyBenefits: ["Missed connection cover", "Medical evacuation and repatriation", "Hijack distress allowance", "Personal liability cover", "Home burglary while travelling"],
      exclusions: ["War or civil commotion", "Pregnancy-related (unless complications)"],
      documentsRequired: ["Passport", "Travel itinerary", "Travel tickets"],
      isFeatured: false,
    },
    {
      slug: "digit-travel-insurance", providerId: pid("digit-insurance"), name: "Digit Travel Insurance", category: "travel",
      description: "Simple, transparent travel insurance from Digit for international trips with instant digital policy.",
      premiumStartsFrom: 280, coverAmount: "Up to $1,50,000 medical", policyTerm: "Per trip", eligibilityAge: "3 months – 70 years",
      keyBenefits: ["Instant policy on app in 2 minutes", "Cashless hospitalisation abroad", "Trip cancellation and delay cover", "Loss of baggage and passport", "Emergency dental cover"],
      exclusions: ["Existing illnesses in the last 6 months", "Extreme sports"],
      documentsRequired: ["Passport", "Travel tickets"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  HOME INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "tata-aig-home-secure", providerId: pid("tata-aig"), name: "Tata AIG Home Secure", category: "home",
      description: "Complete home protection covering structure, contents, valuables, and liability with a single annual premium.",
      premiumStartsFrom: 1800, coverAmount: "₹5 Lakh – ₹5 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Any residential property",
      keyBenefits: ["Structure + contents covered", "Burglary and theft protection", "Fire, flood, and natural calamity cover", "Jewellery and valuables cover", "Landlord liability cover available"],
      exclusions: ["Wilful damage or neglect", "Earthquake in high-risk zones (check policy)"],
      documentsRequired: ["Property ownership proof", "House photos", "Aadhaar of owner"],
      isFeatured: true,
    },
    {
      slug: "hdfc-ergo-home-insurance", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Home Shield", category: "home",
      description: "Comprehensive home insurance covering structure, contents, and personal accident with flexible sum insured options.",
      premiumStartsFrom: 1500, coverAmount: "₹5 Lakh – ₹10 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Any owned/rented property",
      keyBenefits: ["Structure damage from fire, flood, earthquake", "All contents insured under one plan", "Personal accident cover for family", "Temporary accommodation expenses", "24×7 repair helpline"],
      exclusions: ["Gradual deterioration or wear-and-tear", "Loss of cash"],
      documentsRequired: ["Property deed or rent agreement", "Aadhaar", "Property photos"],
      isFeatured: false,
    },
    {
      slug: "new-india-home-insurance", providerId: pid("new-india-assurance"), name: "New India Householder's Insurance", category: "home",
      description: "Classic householder's insurance from the government-backed New India Assurance covering building and household items.",
      premiumStartsFrom: 1200, coverAmount: "As per declared value", policyTerm: "1 year (renewable)", eligibilityAge: "Any residential property",
      keyBenefits: ["Building + contents under one policy", "Fire, cyclone, flood, landslide cover", "Burglary and robbery protection", "Plate glass breakage included", "All-risk for electronic equipment"],
      exclusions: ["Pre-existing damage", "Electrical/mechanical breakdown"],
      documentsRequired: ["Property documents", "Inventory of contents", "Valuation report"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  LIFE INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "hdfc-sanchay-plus", providerId: pid("hdfc-life"), name: "HDFC Sanchay Plus", category: "life", subCategory: "guaranteed savings",
      description: "Non-participating savings plan offering guaranteed returns and life cover throughout the policy term.",
      premiumStartsFrom: 5000, coverAmount: "As per sum assured", policyTerm: "5 – 20 years", eligibilityAge: "0 – 60 years",
      keyBenefits: ["Guaranteed maturity benefit", "Life cover for full policy term", "Flexible premium payment terms", "Tax benefit under 80C and 10(10D)"],
      exclusions: ["Suicide within 12 months of policy start"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "lic-jeevan-umang", providerId: pid("lic"), name: "LIC Jeevan Umang", category: "life", subCategory: "whole life",
      description: "Whole life plan providing survival benefits after premium payment term and life cover up to age 100.",
      premiumStartsFrom: 7800, coverAmount: "As per sum assured", policyTerm: "Till age 100", eligibilityAge: "90 days – 55 years",
      keyBenefits: ["8% annual survival benefit after PPT", "Whole life cover till age 100", "Death benefit includes bonuses", "Loan facility available after 3 years"],
      exclusions: ["Suicide within 12 months"],
      documentsRequired: ["Aadhaar", "PAN", "Age proof", "Medical reports"],
      isFeatured: true,
    },
    {
      slug: "sbi-smart-privilege", providerId: pid("sbi-life"), name: "SBI Life Smart Privilege", category: "life", subCategory: "ULIP",
      description: "Market-linked ULIP with 10 fund options, loyalty additions, and wealth boosters for long-term wealth creation.",
      premiumStartsFrom: 10000, coverAmount: "10× annual premium", policyTerm: "10 – 30 years", eligibilityAge: "18 – 60 years",
      keyBenefits: ["10 diverse fund options", "Loyalty additions from 6th year", "Unlimited free switches between funds", "Partial withdrawal after 5-year lock-in"],
      exclusions: ["Suicide in first year (full fund value paid)", "Market risk borne by policyholder"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "KYC documents"],
      isFeatured: false,
    },
    {
      slug: "kotak-guaranteed-savings", providerId: pid("kotak-life"), name: "Kotak Guaranteed Savings Plan", category: "life", subCategory: "endowment",
      description: "Guaranteed savings plan with life cover, flexible premium paying terms, and tax-free maturity benefit.",
      premiumStartsFrom: 6000, coverAmount: "As per sum assured", policyTerm: "10 – 25 years", eligibilityAge: "0 – 60 years",
      keyBenefits: ["Guaranteed additions every year", "Maturity: sum assured + all additions", "Short premium paying term available", "Loan against policy from 3rd year"],
      exclusions: ["Suicide in first 12 months"],
      documentsRequired: ["Aadhaar", "PAN", "Address proof", "Income documents"],
      isFeatured: false,
    },
    {
      slug: "hdfc-child-ulip", providerId: pid("hdfc-life"), name: "HDFC Life YoungStar Udaan", category: "life", subCategory: "child plan",
      description: "Child savings plan that ensures education goals are met even if something happens to the parent — premium waiver on death.",
      premiumStartsFrom: 5000, coverAmount: "As per sum assured", policyTerm: "8 – 25 years", eligibilityAge: "Parent: 18–55 yrs; Child: 0–17 yrs",
      keyBenefits: ["Premium waiver on death of parent", "Fund value paid for child's education even after death", "3 fund options for investment", "Partial withdrawal from 5th year"],
      exclusions: ["Suicide in first year", "Market risk on ULIP fund"],
      documentsRequired: ["Aadhaar of parent and child", "PAN", "Birth certificate of child", "Income proof"],
      isFeatured: true,
    },
    {
      slug: "lic-jeevan-tarun", providerId: pid("lic"), name: "LIC Jeevan Tarun", category: "life", subCategory: "child plan",
      description: "LIC's popular child plan providing life cover plus survival benefits at critical education milestones.",
      premiumStartsFrom: 4500, coverAmount: "As per sum assured", policyTerm: "25 minus child age", eligibilityAge: "Child: 0–12 years",
      keyBenefits: ["Survival benefits at ages 20, 21, 22, 23, 24", "Life cover for policy term", "Bonus additions throughout", "Loan available after 3 years"],
      exclusions: ["Suicide in first year"],
      documentsRequired: ["Aadhaar of parent + child", "Birth certificate", "PAN", "Medical if required"],
      isFeatured: false,
    },
    {
      slug: "bajaj-retire-rich", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Retire Rich", category: "life", subCategory: "retirement",
      description: "ULIP-based retirement plan with flexible vesting options and a guaranteed annuity post-retirement.",
      premiumStartsFrom: 12000, coverAmount: "Depends on fund value", policyTerm: "5 – 30 years", eligibilityAge: "25 – 70 years (vesting age: max 80)",
      keyBenefits: ["Regular income post-retirement via annuity", "6 fund options for wealth creation", "Partial withdrawals allowed", "Tax-free commutation of 1/3 corpus"],
      exclusions: ["Suicide in first year", "Market risk on funds"],
      documentsRequired: ["Aadhaar", "PAN", "Age proof", "Income documents"],
      isFeatured: false,
    },
    {
      slug: "max-life-guaranteed-return", providerId: pid("max-life"), name: "Max Life Guaranteed Income Plan", category: "life", subCategory: "guaranteed return",
      description: "Non-linked, non-participating plan with guaranteed regular income payouts and a lump sum at maturity.",
      premiumStartsFrom: 8000, coverAmount: "As per sum assured", policyTerm: "10 – 20 years", eligibilityAge: "0 – 60 years",
      keyBenefits: ["Guaranteed income payouts during payout phase", "Lump sum maturity benefit", "Life cover throughout the term", "Tax benefit under 80C"],
      exclusions: ["Suicide in first year", "Misrepresentation of health"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "aditya-birla-guaranteed-return", providerId: pid("aditya-birla-sunlife"), name: "ABSLI Guaranteed Milestone Plan", category: "life", subCategory: "guaranteed return",
      description: "Guaranteed return plan with flexible premium terms and a lump sum benefit at key milestones.",
      premiumStartsFrom: 7500, coverAmount: "As per sum assured", policyTerm: "10 – 20 years", eligibilityAge: "3 months – 60 years",
      keyBenefits: ["Guaranteed additions @ 5% per year", "Lump sum payout at maturity", "Life cover for entire term", "Flexible premium payment — 5 / 8 / 10 years"],
      exclusions: ["Suicide in first year"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  PERSONAL ACCIDENT
    // ══════════════════════════════════════════════════
    {
      slug: "bajaj-personal-guard", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Personal Guard", category: "personal-accident",
      description: "Comprehensive personal accident cover providing financial protection against accidental death, permanent disability, and temporary disability — worldwide.",
      premiumStartsFrom: 1500, coverAmount: "₹5 Lakh – ₹1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "5 – 70 years",
      keyBenefits: ["Accidental death — 100% sum insured to nominee", "Permanent total disability — 100% sum insured", "Permanent partial disability — proportionate payout", "Temporary total disability — weekly cash benefit", "Medical expense reimbursement", "Children's education grant"],
      exclusions: ["Self-inflicted injury or suicide attempt", "Under influence of alcohol or drugs", "Criminal or illegal activity", "War and nuclear risks", "Pregnancy-related injuries"],
      documentsRequired: ["Age and ID proof", "Income proof", "Occupation certificate", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "new-india-personal-accident", providerId: pid("new-india-assurance"), name: "New India Personal Accident Policy", category: "personal-accident",
      description: "A classic personal accident policy from New India Assurance providing worldwide compensation for accidental death and bodily injuries.",
      premiumStartsFrom: 1200, coverAmount: "₹1 Lakh – ₹50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "5 – 70 years",
      keyBenefits: ["Accidental death and permanent disability cover", "Temporary total disablement weekly benefit", "Medical expenses reimbursement", "Education grant for dependent children", "Funeral expenses covered", "Worldwide 24×7 coverage"],
      exclusions: ["Suicide and self-harm", "Pregnancy and childbirth injuries", "Criminal acts", "Venereal diseases"],
      documentsRequired: ["Age and ID proof", "Occupation details", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-accident-guard", providerId: pid("tata-aig"), name: "Tata AIG Accident Guard", category: "personal-accident",
      description: "Accident Guard covers accidental death, disability, and hospitalisation with flexible sum insured options for individuals and families.",
      premiumStartsFrom: 1400, coverAmount: "₹5 Lakh – ₹50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Accidental death and PTD — 100% payout", "PPD — proportionate chart payout", "Hospital daily cash during disability", "Fracture care benefit", "Burns treatment cover", "Family floater option available"],
      exclusions: ["Self-inflicted injury", "Mental disorders", "Hazardous activities (unless declared)", "Pre-existing conditions"],
      documentsRequired: ["Age and ID proof", "Occupation and income details", "Medical certificate (high cover)"],
      isFeatured: false,
    },
    {
      slug: "icici-lombard-personal-protect", providerId: pid("icici-lombard"), name: "ICICI Lombard Personal Protect", category: "personal-accident",
      description: "Personal accident plan from ICICI Lombard covering death, disability and hospitalisation with add-on options for OPD and critical illness.",
      premiumStartsFrom: 1300, coverAmount: "₹5 Lakh – ₹1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Sum insured up to ₹1 Crore", "Group discount for families", "OPD cover add-on available", "Critical illness benefit add-on", "Hospital daily cash option", "Worldwide coverage"],
      exclusions: ["Suicide", "DUI accidents", "Criminal acts", "Adventure sports (without rider)"],
      documentsRequired: ["Aadhaar or PAN", "Occupation certificate", "Income proof (for high sum insured)"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  FIRE INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "new-india-fire-policy", providerId: pid("new-india-assurance"), name: "New India Standard Fire & Special Perils Policy", category: "fire",
      description: "The standard fire insurance policy for buildings and contents against fire, explosion, lightning, storm, flood, earthquake, and allied perils.",
      premiumStartsFrom: 2000, coverAmount: "₹5 Lakh – ₹500 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Any commercial or residential property",
      keyBenefits: ["Fire and explosion cover", "Storm, cyclone, flood and inundation", "Earthquake and landslide", "Riot, strike, malicious damage", "Aircraft damage", "Bursting of water pipes and tanks"],
      exclusions: ["War and nuclear risks", "Intentional burning", "Electrical short circuit (without endorsement)", "Inventory shortage or unexplained loss"],
      documentsRequired: ["Property valuation / survey report", "Ownership deed or lease", "Previous policy copy", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "bajaj-fire-loss-profit", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Fire Loss of Profit Insurance", category: "fire",
      description: "Covers loss of gross profit due to interruption of business following fire damage. Ideal for businesses that need continuity protection alongside their property cover.",
      premiumStartsFrom: 3500, coverAmount: "Based on annual gross profit", policyTerm: "1 year (renewable)", eligibilityAge: "Commercial and industrial businesses",
      keyBenefits: ["Loss of gross profit during interruption", "Increased cost of working expenses", "Auditor and forensic fees for claim preparation", "Extended indemnity period up to 36 months", "Payroll protection during shutdown", "Triggered by fire material damage policy"],
      exclusions: ["War and nuclear contamination", "Deliberate damage", "Loss of market share", "Employee fraud or theft"],
      documentsRequired: ["Audited accounts (last 3 years)", "Fire material damage policy copy", "Turnover and profit details", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-industrial-all-risk", providerId: pid("tata-aig"), name: "Tata AIG Industrial All Risk Policy", category: "fire",
      description: "All-risk cover for large industrial units combining fire, machinery breakdown, and business interruption in a single comprehensive policy.",
      premiumStartsFrom: 5000, coverAmount: "₹50 Crore+", policyTerm: "1 year (renewable)", eligibilityAge: "Industrial and manufacturing premises",
      keyBenefits: ["Fire and all allied perils", "Machinery breakdown and electronic equipment", "Deterioration of stocks in cold chain", "Business interruption extension", "Risk engineering and survey support", "Single policy replacing multiple covers"],
      exclusions: ["War and invasion", "Nuclear fission", "Consequential loss (without extension)", "Employee dishonesty"],
      documentsRequired: ["Property schedule and declared values", "Risk inspection report", "Previous claims history", "Latest audited financials"],
      isFeatured: false,
    },
    {
      slug: "hdfc-ergo-fire-insurance", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Standard Fire Policy", category: "fire",
      description: "HDFC ERGO's fire policy for commercial and residential properties with add-ons for terrorism, earthquake, and machinery breakdown.",
      premiumStartsFrom: 1800, coverAmount: "₹5 Lakh – ₹200 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Commercial, industrial and residential properties",
      keyBenefits: ["Comprehensive fire and allied perils", "Optional terrorism cover endorsement", "Earthquake add-on available", "Stocks in process and in transit covered", "Quick digital claim processing", "Dedicated risk management team"],
      exclusions: ["Willful negligence", "Normal wear and tear", "Faulty workmanship", "Pre-existing damage"],
      documentsRequired: ["Property valuation", "Survey report", "Previous policy", "KYC documents"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  MARINE INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "new-india-marine-cargo", providerId: pid("new-india-assurance"), name: "New India Marine Cargo Insurance", category: "marine",
      description: "Covers goods in transit by sea, air, rail or road against physical loss or damage. Available on an open policy or specific voyage basis.",
      premiumStartsFrom: 1800, coverAmount: "As per cargo value (CIF + 10%)", policyTerm: "Per voyage or annual open policy", eligibilityAge: "Importers, exporters and domestic traders",
      keyBenefits: ["Institute Cargo Clauses A, B, C options", "All-risk cover under ICC-A", "Multimodal transit — sea, air, road, rail", "Warehouse to warehouse coverage", "General average and salvage charges", "Open cover for frequent shippers"],
      exclusions: ["Inherent vice of the goods", "Delay in transit losses", "War and strikes (separate add-on available)", "Improper packing by shipper"],
      documentsRequired: ["Commercial invoice and packing list", "Bill of lading / airway bill / LR", "Survey report (for claims)", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "bajaj-marine-cargo", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Marine Cargo Insurance", category: "marine",
      description: "Bajaj Allianz marine cargo policy for import, export and domestic movements with competitive rates and fast claim settlement.",
      premiumStartsFrom: 2000, coverAmount: "CIF + 10% of cargo value", policyTerm: "Per voyage or annual open cover", eligibilityAge: "Exporters, importers, traders, manufacturers",
      keyBenefits: ["ICC A, B or C as per cargo need", "Customs duty included in claim payout", "Consolidated multimodal transport covered", "Express freight in emergencies covered", "Dedicated marine claims team", "Open policy for high-frequency shippers"],
      exclusions: ["War (available as add-on)", "Strikes (available as add-on)", "Nuclear contamination", "Loss of market"],
      documentsRequired: ["Commercial invoice", "Packing list", "Bill of lading / AWB / LR", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "icici-lombard-marine-cargo", providerId: pid("icici-lombard"), name: "ICICI Lombard Marine Cargo Insurance", category: "marine",
      description: "Digital marine cargo insurance for domestic and international shipments with online policy issuance and automated claims.",
      premiumStartsFrom: 1900, coverAmount: "As per declared cargo value", policyTerm: "Per voyage or annual", eligibilityAge: "Manufacturers, traders, exporters/importers",
      keyBenefits: ["Instant digital policy issuance", "All modes of transport covered", "Special cargo cover — refrigerated, breakbulk, fragile", "Online claims submission and tracking", "Dedicated 24×7 marine helpdesk", "Accumulation and voyage limit management"],
      exclusions: ["Inherent vice", "Wilful misconduct of insured", "Delay losses", "Loss of market value"],
      documentsRequired: ["Invoice and packing list", "Transport document (BL/AWB/LR)", "KYC for new customers"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-marine-hull", providerId: pid("tata-aig"), name: "Tata AIG Marine Hull Insurance", category: "marine", subCategory: "Hull",
      description: "Marine hull insurance for vessels including fishing boats, barges, and small crafts against perils of the sea, fire and machinery breakdown.",
      premiumStartsFrom: 5000, coverAmount: "As per vessel agreed value", policyTerm: "1 year (renewable)", eligibilityAge: "Vessel owners, operators",
      keyBenefits: ["Perils of the sea — collision, stranding, sinking", "Fire and explosion", "Machinery damage", "General average and salvage", "P&I cover available (third-party liability)", "Worldwide navigation coverage"],
      exclusions: ["Wear and tear", "Wilful misconduct", "War (available as add-on)", "Unseaworthy condition"],
      documentsRequired: ["Vessel survey report", "Registration certificate", "Previous policy", "Proposal form"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  PENSION INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "lic-new-jeevan-nidhi", providerId: pid("lic"), name: "LIC New Jeevan Nidhi", category: "pension", subCategory: "Traditional Pension",
      description: "A participating pension plan that builds a retirement corpus during the accumulation phase and provides regular income as annuity in retirement.",
      premiumStartsFrom: 10000, coverAmount: "Retirement corpus + lifelong annuity", policyTerm: "5 – 35 years", eligibilityAge: "20 – 60 years",
      keyBenefits: ["Guaranteed additions in first 5 years", "Loyalty additions from 6th year", "Option to commute 1/3 of corpus tax-free", "7 annuity modes — life, joint life, guaranteed periods", "Death benefit = full fund value", "Tax deduction under Section 80CCC"],
      exclusions: ["Suicide in first year (partial fund return)", "Undisclosed medical conditions"],
      documentsRequired: ["Age and ID proof", "Income proof", "Medical examination"],
      isFeatured: true,
    },
    {
      slug: "hdfc-life-pension-guaranteed", providerId: pid("hdfc-life"), name: "HDFC Life Pension Guaranteed Plan", category: "pension", subCategory: "Immediate Annuity",
      description: "A single-premium immediate annuity plan that starts paying income right away. Multiple annuity options for individual and joint life needs.",
      premiumStartsFrom: 100000, coverAmount: "Lifelong annuity based on purchase price", policyTerm: "Lifelong", eligibilityAge: "45 – 75 years",
      keyBenefits: ["Income starts from month 1", "8 annuity options including joint life", "Guaranteed income for life with no market risk", "Return of purchase price option on death", "Increasing annuity option at 3% p.a.", "ECS-based monthly payouts"],
      exclusions: ["No premature exit (annuity product)", "Annuity rate fixed at inception"],
      documentsRequired: ["Age proof (60+ preferred)", "ID proof", "Bank account details for ECS", "Medical reports"],
      isFeatured: false,
    },
    {
      slug: "icici-pru-easy-retirement", providerId: pid("icici-prudential"), name: "ICICI Pru Easy Retirement S", category: "pension", subCategory: "Unit-Linked Pension",
      description: "A ULIP-based pension plan that invests in equity and debt funds during accumulation and then converts to annuity at retirement.",
      premiumStartsFrom: 24000, coverAmount: "Fund-based corpus at maturity", policyTerm: "10 – 30 years", eligibilityAge: "25 – 70 years",
      keyBenefits: ["Market-linked returns during accumulation phase", "Guaranteed minimum death benefit", "Partial withdrawals after 5-year lock-in", "Loyalty additions from 10th year", "Systematic withdrawal plan at retirement", "Tax benefits under Section 80CCC"],
      exclusions: ["Market risk — ULIP returns not guaranteed", "Suicide in first year of policy"],
      documentsRequired: ["Age and ID proof", "Income proof", "KYC documents", "Medical examination"],
      isFeatured: false,
    },
    {
      slug: "sbi-life-annuity-plus", providerId: pid("sbi-life"), name: "SBI Life Annuity Plus", category: "pension", subCategory: "Immediate Annuity",
      description: "SBI Life's immediate annuity plan offering guaranteed income for life with multiple options — ideal for converting retirement savings to regular income.",
      premiumStartsFrom: 50000, coverAmount: "Annuity based on purchase price", policyTerm: "Lifelong", eligibilityAge: "40 – 80 years",
      keyBenefits: ["Immediate monthly income from day one", "Joint life with last survivor option", "Return of purchase price on death", "Guaranteed income — no market risk", "Loan facility available after 1 year", "Accessible via SBI's vast network"],
      exclusions: ["No surrender (single premium annuity)", "Annuity rate locked at start"],
      documentsRequired: ["Age proof", "ID proof", "Bank details for ECS", "Form 15G/H"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  COMMERCIAL INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "bajaj-commercial-package", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Commercial Package Policy", category: "commercial",
      description: "A bundled commercial insurance package for SMEs covering property, stock, money, machinery, and public liability in a single policy.",
      premiumStartsFrom: 8000, coverAmount: "₹10 Lakh – ₹100 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Commercial and industrial establishments",
      keyBenefits: ["Fire and allied perils for building and stock", "Burglary and housebreaking cover", "Money in transit and safe", "Machinery breakdown", "Public liability up to ₹50 Lakh", "Plate glass and signage cover"],
      exclusions: ["War and nuclear risks", "Employee infidelity (needs separate fidelity cover)", "Pre-existing damage", "Contractual liability"],
      documentsRequired: ["Business registration certificate", "Property valuation report", "Previous claims history", "Audited annual turnover"],
      isFeatured: false,
    },
    {
      slug: "new-india-shopkeeper-policy", providerId: pid("new-india-assurance"), name: "New India Shopkeeper Package Policy", category: "commercial", subCategory: "Shopkeeper",
      description: "A specially designed package for retail shopkeepers covering shop building, stocks, furniture, cash, and personal accident for the owner.",
      premiumStartsFrom: 3500, coverAmount: "₹2 Lakh – ₹2 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Retail shops and small establishments",
      keyBenefits: ["Building and stocks against fire and allied perils", "Burglary and housebreaking", "Cash in counter, safe and transit", "Personal accident for the owner", "Plate glass insurance", "Neon sign and board cover"],
      exclusions: ["War and nuclear risks", "Mysterious disappearance of cash", "Dishonesty of employees", "Wilful damage"],
      documentsRequired: ["Shop lease or ownership document", "Stock valuation certificate", "Turnover certificate", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "hdfc-ergo-sme-package", providerId: pid("hdfc-ergo"), name: "HDFC ERGO SME Insurance Package", category: "commercial", subCategory: "SME",
      description: "Comprehensive insurance solution for small and medium enterprises covering property, plant, machinery, goods in transit and business interruption.",
      premiumStartsFrom: 6000, coverAmount: "₹10 Lakh – ₹50 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Small and medium enterprises",
      keyBenefits: ["Fire and natural calamity for factory and office", "Machinery breakdown cover", "Electronic equipment all-risk", "Business interruption — loss of profit", "Goods in transit cover", "Employee group accident cover add-on"],
      exclusions: ["Pre-existing damage", "Normal wear and tear", "War and nuclear risks", "Consequential loss (without extension)"],
      documentsRequired: ["GSTIN and business registration", "Asset schedule", "Last 3 years turnover", "Proposal form"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-workmen-compensation", providerId: pid("tata-aig"), name: "Tata AIG Workmen's Compensation Policy", category: "commercial", subCategory: "Liability",
      description: "Provides coverage to employers for legal liability to pay compensation to employees for work-related accidents, injuries or occupational diseases.",
      premiumStartsFrom: 4000, coverAmount: "As per Workmen's Compensation Act 1923", policyTerm: "1 year (renewable)", eligibilityAge: "Any employer with permanent or contract workers",
      keyBenefits: ["Legal liability under Workmen's Compensation Act", "Medical expenses for injured workers", "Fatal accident compensation", "Occupational disease cover", "Contractor and sub-contractor employees", "Employer's liability add-on available"],
      exclusions: ["War and civil commotion", "Intentional self-injury by employee", "Influence of alcohol or drugs", "Overhead electrical line accidents"],
      documentsRequired: ["Employer registration", "Employee list with wages", "Nature of work declaration", "Previous claims history"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  CROP INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "aic-pmfby", providerId: pid("aic"), name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", category: "crop",
      description: "India's flagship government crop insurance scheme providing financial support to farmers for losses due to natural calamities, pests and diseases.",
      premiumStartsFrom: 500, coverAmount: "Based on state-notified scale of finance", policyTerm: "Per crop season (Kharif / Rabi)", eligibilityAge: "All farmers — loanee and non-loanee",
      keyBenefits: ["Low premiums: 2% Kharif, 1.5% Rabi, 5% horticulture", "Government subsidises balance of actuarial premium", "Pre-sowing and post-harvest losses covered", "Localised risk: hailstorm, landslide, inundation", "Prevented sowing compensation", "Technology-driven assessment via satellite and drones"],
      exclusions: ["War and nuclear risks", "Wilful negligence by farmer", "Losses from avoidable risks", "Non-notified crops in the district"],
      documentsRequired: ["Land records (7/12 extract or equivalent)", "Bank account and passbook (for loanee)", "Aadhaar card", "Sowing certificate"],
      isFeatured: true,
    },
    {
      slug: "aic-weather-based-crop", providerId: pid("aic"), name: "Restructured Weather Based Crop Insurance (RWBCIS)", category: "crop",
      description: "Weather-triggered crop insurance scheme compensating farmers based on deviation from normal weather parameters — faster payouts with no field survey required.",
      premiumStartsFrom: 400, coverAmount: "Based on notified scale of finance", policyTerm: "Per crop season", eligibilityAge: "All farmers growing notified crops",
      keyBenefits: ["Payout triggered automatically by weather index deviation", "Faster claim settlement — no field survey needed", "Covers deficit and excess rainfall, temperature extremes", "Horticulture crops specially covered", "Integrated with Crop Insurance Portal", "Loanee farmers enrolled compulsorily"],
      exclusions: ["Non-notified crops or areas", "Risks not covered by the weather index", "Post-harvest losses (PMFBY covers those)", "Negligence by farmer"],
      documentsRequired: ["Sowing certificate", "Land records (patwari / tehsildar)", "Aadhaar card", "Bank account details"],
      isFeatured: false,
    },
    {
      slug: "new-india-coconut-palm", providerId: pid("new-india-assurance"), name: "New India Coconut Palm Insurance Scheme", category: "crop", subCategory: "Horticulture",
      description: "Unique individual tree insurance for coconut palm growers, covering loss of trees due to natural calamities, pests, and diseases.",
      premiumStartsFrom: 600, coverAmount: "₹900 per palm tree (government scale)", policyTerm: "1 year (renewable)", eligibilityAge: "Coconut palm growers (4–60 year old palms)",
      keyBenefits: ["Individual palm tree identification and cover", "Natural calamities: cyclone, flood, fire, lightning", "Pest and disease compensation after survey", "Graded damage assessment by independent surveyor", "Payout within 30 days of survey completion", "Subsidised under National Horticulture Board scheme"],
      exclusions: ["Palms below 4 years or above 60 years of age", "Malicious damage by palm owner", "Negligence and non-maintenance", "Unidentified or unregistered palms"],
      documentsRequired: ["Land records", "Palm count certificate from horticulture department", "Aadhaar or PAN card", "Bank account details"],
      isFeatured: false,
    },

    // ══════════════════════════════════════════════════
    //  CYBER INSURANCE
    // ══════════════════════════════════════════════════
    {
      slug: "bajaj-cyber-safe", providerId: pid("bajaj-allianz"), name: "Bajaj Allianz Cyber Safe Insurance", category: "cyber",
      description: "India's most popular individual cyber insurance covering financial loss from online fraud, identity theft, cyber extortion, and data breach.",
      premiumStartsFrom: 600, coverAmount: "₹1 Lakh – ₹1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "Individuals 18+ years",
      keyBenefits: ["Online banking and UPI payment fraud", "Identity theft and impersonation", "Cyber stalking — psychological counselling expenses", "Malware attack — data restoration costs", "IT forensics and legal expenses", "Reputation damage management"],
      exclusions: ["Fraudulent or criminal acts by the insured", "Pre-existing cyber incidents before policy start", "War and state-sponsored cyber terrorism", "Business-related cyber losses (personal policy)"],
      documentsRequired: ["Aadhaar or PAN card", "Completed proposal form", "FIR copy (for claims)"],
      isFeatured: true,
    },
    {
      slug: "hdfc-ergo-cyber-sachet", providerId: pid("hdfc-ergo"), name: "HDFC ERGO Cyber Sachet", category: "cyber",
      description: "Affordable cyber policy offering protection against banking fraud, social media hacking and phishing at pocket-friendly premiums — ideal for first-time buyers.",
      premiumStartsFrom: 500, coverAmount: "₹50,000 – ₹50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "Individuals 18+ years",
      keyBenefits: ["Card and banking/UPI fraud cover", "Social media account hacking expenses", "Phishing and email spoofing losses", "Cyberbullying mental trauma support", "Legal consultation included (2 sessions)", "Data breach response assistance"],
      exclusions: ["Losses due to insured sharing OTP/PIN voluntarily", "Business cyber losses (personal policy)", "Intentional acts by insured", "Previously known incidents"],
      documentsRequired: ["Government ID", "Completed proposal form", "FIR copy and bank statement (for claims)"],
      isFeatured: false,
    },
    {
      slug: "icici-lombard-cyber-business", providerId: pid("icici-lombard"), name: "ICICI Lombard Cyber Enterprise Insurance", category: "cyber", subCategory: "Business",
      description: "Enterprise-grade cyber liability insurance covering data breaches, ransomware, network interruption, and regulatory fines for businesses of all sizes.",
      premiumStartsFrom: 15000, coverAmount: "₹50 Lakh – ₹100 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "SME to large corporates",
      keyBenefits: ["Data breach response and notification costs", "Ransomware payment and recovery expenses", "Business interruption from cyber attack", "Third-party liability for customer data breach", "Regulatory fines coverage (GDPR / DPDP Act 2023)", "Social engineering and funds transfer fraud"],
      exclusions: ["Intentional misconduct by senior management", "Prior known breaches not disclosed", "Nation-state attacks (exclusions vary by policy)", "IP ownership or trade secret disputes"],
      documentsRequired: ["Business registration certificate", "IT security questionnaire", "Previous cyber incident history", "Audited financials"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-cyber-insurance", providerId: pid("tata-aig"), name: "Tata AIG Cyber Insurance (Individual & Family)", category: "cyber",
      description: "Family cyber plan protecting every household member against online financial fraud, identity theft, and cyberbullying under one affordable policy.",
      premiumStartsFrom: 700, coverAmount: "₹1 Lakh – ₹50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "Individuals and families",
      keyBenefits: ["Covers entire family under single policy", "Online banking and credit card fraud", "Cyber extortion and ransomware", "Identity theft and impersonation", "Cyber bullying support for minors", "24×7 cyber helpline and legal assistance"],
      exclusions: ["Intentional sharing of credentials", "Pre-existing known cyber incidents", "Business-related losses", "Fraudulent claims"],
      documentsRequired: ["Aadhaar for all members", "Completed proposal form", "Bank statements (for claims)"],
      isFeatured: false,
    },
  ];

  for (const p of policyData) {
    await prisma.policy.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  console.log(`✓ Policies (${policyData.length})`);

  // ─── Demo Leads ────────────────────────────────────────────────────────────
  const leadData = [
    { name: "Rajesh Kumar",    phone: "9876543210", email: "rajesh.kumar@gmail.com",     category: "term",    city: "Delhi",     status: "new",       leadType: "quote",    utmSource: "google" },
    { name: "Priya Sharma",    phone: "9823456789", email: "priya.sharma@yahoo.com",     category: "health",  city: "Mumbai",    status: "contacted",  leadType: "quote",    utmSource: "facebook" },
    { name: "Amit Singh",      phone: "9765432198", email: "amit.singh@outlook.com",     category: "motor",   city: "Bangalore", status: "converted",  leadType: "quote",    utmSource: "organic" },
    { name: "Sunita Patel",    phone: "9845678901", email: "sunita.patel@gmail.com",     category: "health",  city: "Ahmedabad", status: "new",        leadType: "quote",    utmSource: "google" },
    { name: "Vikram Nair",     phone: "9901234567", email: "vikram.nair@gmail.com",      category: "term",    city: "Chennai",   status: "new",        leadType: "callback", utmSource: "organic" },
    { name: "Meena Iyer",      phone: "9712345678", email: "meena.iyer@hotmail.com",     category: "life",    city: "Hyderabad", status: "contacted",  leadType: "quote",    utmSource: "instagram" },
    { name: "Rahul Joshi",     phone: "9632145870", email: null,                          category: "motor",   city: "Pune",      status: "new",        leadType: "callback", utmSource: "google" },
    { name: "Kavita Reddy",    phone: "9558741236", email: "kavita.reddy@gmail.com",     category: "health",  city: "Bangalore", status: "lost",       leadType: "quote",    utmSource: "facebook" },
    { name: "Suresh Gupta",    phone: "9374651289", email: "suresh.g@gmail.com",         category: "term",    city: "Lucknow",   status: "converted",  leadType: "quote",    utmSource: "google" },
    { name: "Anita Desai",     phone: "9987654321", email: "anita.desai@gmail.com",      category: "life",    city: "Surat",     status: "new",        leadType: "quote",    utmSource: "organic" },
    { name: "Deepak Malhotra", phone: "9811223344", email: "deepak.m@gmail.com",         category: "term",    city: "Noida",     status: "contacted",  leadType: "quote",    utmSource: "youtube" },
    { name: "Pooja Mehta",     phone: "9456123780", email: "pooja.mehta@gmail.com",      category: "health",  city: "Jaipur",    status: "new",        leadType: "quote",    utmSource: "google" },
    { name: "Sanjay Tiwari",   phone: "9123456780", email: null,                          category: "motor",   city: "Bhopal",    status: "contacted",  leadType: "callback", utmSource: "direct" },
    { name: "Geeta Rao",       phone: "9345678901", email: "geeta.rao@gmail.com",        category: "health",  city: "Vizag",     status: "converted",  leadType: "quote",    utmSource: "organic" },
    { name: "Manoj Pillai",    phone: "9876012345", email: "manoj.p@rediffmail.com",     category: "life",    city: "Kochi",     status: "new",        leadType: "quote",    utmSource: "facebook" },
    { name: "Arjun Kapoor",    phone: "9512345678", email: "arjun.k@gmail.com",          category: "car",     city: "Gurgaon",   status: "new",        leadType: "quote",    utmSource: "google" },
    { name: "Nisha Singh",     phone: "9678901234", email: "nisha.singh@gmail.com",      category: "travel",  city: "Delhi",     status: "new",        leadType: "quote",    utmSource: "instagram" },
    { name: "Karan Malhotra",  phone: "9789012345", email: "karan.m@gmail.com",          category: "home",    city: "Mumbai",    status: "contacted",  leadType: "quote",    utmSource: "google" },
    { name: "Ritu Sharma",     phone: "9890123456", email: "ritu.s@yahoo.com",           category: "health",  city: "Chandigarh",status: "new",        leadType: "quote",    utmSource: "facebook" },
    { name: "Ashok Verma",     phone: "9934567890", email: "ashok.v@gmail.com",          category: "term",    city: "Agra",      status: "new",        leadType: "callback", utmSource: "organic" },
    { name: "Lakshmi Devi",    phone: "9056789012", email: "lakshmi.d@gmail.com",        category: "life",    city: "Coimbatore",status: "converted",  leadType: "quote",    utmSource: "youtube" },
    { name: "Mohan Das",       phone: "9167890123", email: null,                          category: "motor",   city: "Kolkata",   status: "new",        leadType: "callback", utmSource: "google" },
    { name: "Sapna Gupta",     phone: "9278901234", email: "sapna.gupta@gmail.com",      category: "health",  city: "Lucknow",   status: "contacted",  leadType: "quote",    utmSource: "organic" },
    { name: "Tarun Mehta",     phone: "9389012345", email: "tarun.m@gmail.com",          category: "term",    city: "Indore",    status: "new",        leadType: "quote",    utmSource: "google" },
    { name: "Usha Rani",       phone: "9490123456", email: "usha.r@gmail.com",           category: "health",  city: "Nagpur",    status: "new",        leadType: "quote",    utmSource: "facebook" },
  ];

  for (const l of leadData) {
    await prisma.lead.create({ data: l }).catch(() => {});
  }
  console.log(`✓ Demo leads (${leadData.length})`);

  // ─── Due Dates ─────────────────────────────────────────────────────────────
  const now = new Date();
  const dd = (daysOffset: number) => new Date(now.getTime() + daysOffset * 86400000);

  const dueDateData = [
    { policyHolderName: "Ramesh Agarwal",  phone: "9876543001", email: "ramesh.a@gmail.com",    policyNumber: "LIC-2023-001234",   dueDate: dd(5),  status: "pending",  notes: "High-value client. Call personally." },
    { policyHolderName: "Sunita Rao",      phone: "9765432001", email: "sunita.rao@yahoo.com",   policyNumber: "HDFC-2022-056789",  dueDate: dd(12), status: "notified", notes: "Sent WhatsApp. Awaiting confirmation." },
    { policyHolderName: "Ajay Verma",      phone: "9654321001", email: null,                      policyNumber: "BAJAJ-2023-009876", dueDate: dd(3),  status: "pending",  notes: "Motor insurance renewal. NCB applicable." },
    { policyHolderName: "Neha Kapoor",     phone: "9543210001", email: "neha.k@gmail.com",       policyNumber: "STAR-2023-112233",  dueDate: dd(28), status: "pending",  notes: "Family floater renewal. 4 members." },
    { policyHolderName: "Prakash Shetty",  phone: "9432100001", email: "prakash.s@gmail.com",    policyNumber: "ICICI-2022-445566", dueDate: dd(-3), status: "lapsed",   notes: "Did not respond to 3 calls. Mark lapsed." },
    { policyHolderName: "Ananya Mishra",   phone: "9321000001", email: "ananya.m@gmail.com",     policyNumber: "SBI-2023-778899",   dueDate: dd(20), status: "pending",  notes: "Interested in upgrading sum insured." },
    { policyHolderName: "Kiran Bhat",      phone: "9876123456", email: "kiran.b@gmail.com",      policyNumber: "NIVA-2022-334455",  dueDate: dd(7),  status: "notified", notes: "Email sent. Follow up call scheduled." },
    { policyHolderName: "Ravi Shankar",    phone: "9765234567", email: null,                      policyNumber: "TATA-2023-667788",  dueDate: dd(45), status: "pending",  notes: "Car insurance — ask about zero dep upgrade." },
    { policyHolderName: "Divya Menon",     phone: "9654345678", email: "divya.m@gmail.com",      policyNumber: "CARE-2023-223344",  dueDate: dd(15), status: "pending",  notes: "Health plan — family floater of 5 members." },
    { policyHolderName: "Pranav Joshi",    phone: "9543456789", email: "pranav.j@gmail.com",     policyNumber: "HDFC-2023-112200",  dueDate: dd(1),  status: "pending",  notes: "Urgent — term plan expires tomorrow. Call immediately." },
    { policyHolderName: "Rekha Sinha",     phone: "9432567890", email: "rekha.sinha@gmail.com",  policyNumber: "MAX-2022-990011",   dueDate: dd(-8), status: "lapsed",   notes: "Lapsed. Discuss reinstatement options." },
    { policyHolderName: "Gaurav Tiwari",   phone: "9321678901", email: null,                      policyNumber: "BAJAJ-2023-551100", dueDate: dd(35), status: "pending",  notes: "Two-wheeler insurance renewal." },
  ];

  for (const d of dueDateData) {
    await prisma.dueDate.create({ data: d }).catch(() => {});
  }
  console.log(`✓ Due dates (${dueDateData.length})`);

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
  console.log(`   Policies  : ${policyData.length}`);
  console.log(`   Leads     : ${leadData.length}`);
  console.log(`   Due dates : ${dueDateData.length}`);
  console.log("\nAdmin logins:");
  console.log("  Super Admin : admin@insuranceportal.com  / admin123");
  console.log("  Editor      : editor@insuranceportal.com / editor123");
  console.log("  Viewer      : viewer@insuranceportal.com / viewer123");
  console.log("  Sales       : sales@insuranceportal.com  / sales123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
