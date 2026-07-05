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
  const [lic, hdfc, star, icici, bajaj, sbi, niva, tata, kotak, reliance] =
    await Promise.all([
      prisma.provider.upsert({
        where: { slug: "lic" },
        update: {},
        create: {
          slug: "lic", name: "LIC of India",
          tagline: "Zindagi ke saath bhi, zindagi ke baad bhi",
          about: "Life Insurance Corporation of India is the largest state-owned insurance group and investment company in India, founded in 1956.",
          irdaiRegNo: "512", claimSettlementRatio: 98.62, solvencyRatio: 1.76, networkHospitals: 5000,
          categories: ["life", "term", "health"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "hdfc-life" },
        update: {},
        create: {
          slug: "hdfc-life", name: "HDFC Life",
          tagline: "Sar Utha Ke Jiyo",
          about: "HDFC Life Insurance Company Limited is a long-term life insurance solutions provider offering a range of individual and group insurance solutions that meet various customer needs.",
          irdaiRegNo: "101", claimSettlementRatio: 99.5, solvencyRatio: 1.93,
          categories: ["life", "term", "health"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "star-health" },
        update: {},
        create: {
          slug: "star-health", name: "Star Health Insurance",
          tagline: "Health Insurance Specialists",
          about: "Star Health and Allied Insurance Co. Ltd. is India's first standalone health insurance company, established in 2006, offering a comprehensive range of health insurance products.",
          irdaiRegNo: "129", claimSettlementRatio: 99.06, networkHospitals: 14000,
          categories: ["health"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "icici-lombard" },
        update: {},
        create: {
          slug: "icici-lombard", name: "ICICI Lombard",
          tagline: "Nibhaye Vaade",
          about: "ICICI Lombard is the largest private sector general insurance company in India, offering a wide range of products including motor, health, and travel insurance.",
          irdaiRegNo: "115", claimSettlementRatio: 97.9, networkHospitals: 8700,
          categories: ["health", "motor"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "bajaj-allianz" },
        update: {},
        create: {
          slug: "bajaj-allianz", name: "Bajaj Allianz",
          tagline: "Caringly Yours",
          about: "Bajaj Allianz Life Insurance Co. Ltd. is a joint venture between Bajaj Finserv Limited and Allianz SE. It offers a range of life insurance, motor, and health products.",
          irdaiRegNo: "116", claimSettlementRatio: 99.04, solvencyRatio: 5.18,
          categories: ["life", "term", "motor"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "sbi-life" },
        update: {},
        create: {
          slug: "sbi-life", name: "SBI Life Insurance",
          tagline: "Poorna Suraksha",
          about: "SBI Life Insurance is a joint venture between State Bank of India and BNP Paribas Cardif. It is one of the leading life insurers in India with a strong bancassurance model.",
          irdaiRegNo: "111", claimSettlementRatio: 97.05, solvencyRatio: 2.13,
          categories: ["life", "term"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "niva-bupa" },
        update: {},
        create: {
          slug: "niva-bupa", name: "Niva Bupa Health Insurance",
          tagline: "Go Fearless",
          about: "Niva Bupa (formerly Max Bupa) is a standalone health insurance company, a joint venture between True North and Bupa, UK. Known for its customer-centric health plans.",
          irdaiRegNo: "145", claimSettlementRatio: 91.6, networkHospitals: 10000,
          categories: ["health"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "tata-aig" },
        update: {},
        create: {
          slug: "tata-aig", name: "Tata AIG",
          tagline: "Insurance. Made Simple.",
          about: "Tata AIG General Insurance Company Ltd. is a joint venture between Tata Group and American International Group (AIG). It offers a wide range of general insurance products.",
          irdaiRegNo: "108", claimSettlementRatio: 97.47, networkHospitals: 7200,
          categories: ["motor", "health"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "kotak-life" },
        update: {},
        create: {
          slug: "kotak-life", name: "Kotak Life Insurance",
          tagline: "Karo Zyada Ka Iraada",
          about: "Kotak Life Insurance is a wholly owned subsidiary of Kotak Mahindra Bank Ltd. It offers a comprehensive range of life insurance, ULIP, and term plans.",
          irdaiRegNo: "107", claimSettlementRatio: 98.82, solvencyRatio: 3.06,
          categories: ["life", "term"], isActive: true,
        },
      }),
      prisma.provider.upsert({
        where: { slug: "reliance-general" },
        update: {},
        create: {
          slug: "reliance-general", name: "Reliance General Insurance",
          tagline: "Har Ek Family Ke Liye",
          about: "Reliance General Insurance is one of the leading general insurance companies in India, offering motor, health, home, and travel insurance products.",
          irdaiRegNo: "103", claimSettlementRatio: 98.0,
          categories: ["motor", "health"], isActive: true,
        },
      }),
    ]);
  console.log("✓ Providers (10)");

  // ─── Policies ──────────────────────────────────────────────────────────────
  const policyData = [
    // TERM
    {
      slug: "lic-jeevan-amar", providerId: lic.id, name: "LIC Jeevan Amar", category: "term",
      description: "Pure term insurance plan providing high life cover at affordable premiums with flexible sum assured options.",
      premiumStartsFrom: 490, coverAmount: "25 Lakh – 5 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Death benefit payout to nominee", "Level or increasing sum assured option", "Accidental Death Benefit rider", "Tax benefit under Section 80C"],
      exclusions: ["Suicide within first year", "Fraudulent disclosure"],
      documentsRequired: ["Aadhaar card", "PAN card", "Income proof (last 3 years ITR)", "Medical examination reports"],
      isFeatured: true,
    },
    {
      slug: "hdfc-click2protect-super", providerId: hdfc.id, name: "HDFC Click 2 Protect Super", category: "term",
      description: "Comprehensive term plan with life stage protection, return of premium option, and critical illness cover.",
      premiumStartsFrom: 656, coverAmount: "50 Lakh – 10 Crore", policyTerm: "5 – 50 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Increasing cover at key life stages", "Return of premium on survival", "Critical illness benefit rider", "Waiver of premium on disability"],
      exclusions: ["Suicide within first year", "Self-inflicted injury"],
      documentsRequired: ["Aadhaar", "PAN", "Salary slips (3 months)", "Bank statements (6 months)"],
      isFeatured: true,
    },
    {
      slug: "bajaj-allianz-etouch-term", providerId: bajaj.id, name: "Bajaj Allianz eTouch Term Plan", category: "term",
      description: "Online term plan with life cover, accidental total permanent disability benefit, and critical illness option.",
      premiumStartsFrom: 528, coverAmount: "50 Lakh – 5 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["3 plan options: Life, Life + CI, Life + ADB", "Special premium rates for women and non-smokers", "Increasing sum assured option", "Tax benefits under 80C and 10(10D)"],
      exclusions: ["Suicide in first year", "Pre-existing disease within waiting period"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
      isFeatured: false,
    },
    {
      slug: "sbi-eterm-plan", providerId: sbi.id, name: "SBI Life eShield Next", category: "term",
      description: "Flexible online term plan with multiple cover options and enhanced protection against critical illness.",
      premiumStartsFrom: 575, coverAmount: "30 Lakh – 5 Crore", policyTerm: "5 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["3 plan options for flexibility", "Increasing sum assured with age", "Premium waiver on critical illness", "Tax savings under Section 80C"],
      exclusions: ["Suicide in first year", "War or act of terrorism"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical tests (if required)"],
      isFeatured: false,
    },
    {
      slug: "kotak-e-term", providerId: kotak.id, name: "Kotak e-Term Plan", category: "term",
      description: "Pure online term plan with high coverage, special rates for women, and flexible payout options.",
      premiumStartsFrom: 509, coverAmount: "25 Lakh – 10 Crore", policyTerm: "10 – 40 years", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Special discount for women (5%)", "Lump sum or monthly income payout", "Accidental death benefit rider", "Non-smoker discount available"],
      exclusions: ["Suicide within 12 months", "Participation in criminal activity"],
      documentsRequired: ["Aadhaar", "PAN", "Address proof", "Salary slips or ITR"],
      isFeatured: true,
    },
    // HEALTH
    {
      slug: "star-comprehensive", providerId: star.id, name: "Star Comprehensive Insurance", category: "health",
      description: "All-in-one health insurance with no room rent sub-limit, unlimited restoration, and OPD cover.",
      premiumStartsFrom: 8500, coverAmount: "5 Lakh – 1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "3 months – 65 years",
      keyBenefits: ["No room rent cap", "Unlimited automatic restoration", "600+ day-care procedures", "OPD cover included", "Maternity benefit after 2 years"],
      exclusions: ["Pre-existing diseases (2 yr waiting period)", "Cosmetic surgery", "Dental (unless accidental)"],
      documentsRequired: ["Aadhaar", "Age proof", "Medical history form"],
      isFeatured: true,
    },
    {
      slug: "icici-health-advantage", providerId: icici.id, name: "ICICI Lombard Health Advantage", category: "health",
      description: "Flexible health plan with cumulative bonus up to 100% and a wellness rewards program.",
      premiumStartsFrom: 7200, coverAmount: "3 Lakh – 50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "5 – 65 years",
      keyBenefits: ["10% cumulative bonus per claim-free year (max 100%)", "Wellness rewards program", "8700+ network hospitals", "No co-payment for in-patient treatment"],
      exclusions: ["Pre-existing diseases (3 yr waiting period)", "Infertility treatment"],
      documentsRequired: ["Aadhaar", "PAN", "Recent medical records"],
      isFeatured: true,
    },
    {
      slug: "niva-bupa-reassure", providerId: niva.id, name: "Niva Bupa ReAssure 2.0", category: "health",
      description: "Smart health plan with lock the clock feature, recharge benefit, and booster benefit for claim-free years.",
      premiumStartsFrom: 9200, coverAmount: "3 Lakh – 1 Crore", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years",
      keyBenefits: ["Lock the Clock — premium locked at entry age", "Recharge benefit for additional coverage", "Booster benefit — 50% increase each claim-free year", "10,000+ network hospitals"],
      exclusions: ["Pre-existing diseases (waiting period applies)", "Experimental treatments"],
      documentsRequired: ["Aadhaar", "Age proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "star-family-health-optima", providerId: star.id, name: "Star Family Health Optima", category: "health",
      subCategory: "family floater",
      description: "Best-selling family floater plan with auto-recharge and cover for entire family under one policy.",
      premiumStartsFrom: 11500, coverAmount: "3 Lakh – 25 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "18 – 65 years (dependent child from 3 months)",
      keyBenefits: ["Auto-recharge of sum insured", "Air ambulance cover up to ₹2.5 lakh", "Covers entire family under single sum insured", "600+ day-care treatments covered"],
      exclusions: ["Pre-existing conditions (3 yr waiting period)", "Maternity in first 36 months"],
      documentsRequired: ["Aadhaar for all members", "Age proof", "Medical history"],
      isFeatured: false,
    },
    {
      slug: "tata-aig-medicare", providerId: tata.id, name: "Tata AIG MediCare", category: "health",
      description: "Comprehensive health plan with no sub-limits on room rent and restoration of sum insured.",
      premiumStartsFrom: 6800, coverAmount: "5 Lakh – 50 Lakh", policyTerm: "1 year (renewable)", eligibilityAge: "90 days – 65 years",
      keyBenefits: ["No sub-limit on room rent or ICU", "Restoration of 100% sum insured once per year", "7200+ network hospitals", "No claim bonus up to 150%"],
      exclusions: ["Pre-existing diseases (3 yr waiting)", "Obesity-related treatments"],
      documentsRequired: ["Aadhaar", "PAN", "Medical records if age > 45"],
      isFeatured: false,
    },
    // MOTOR
    {
      slug: "bajaj-allianz-car-insurance", providerId: bajaj.id, name: "Bajaj Allianz Car Insurance", category: "motor", subCategory: "car",
      description: "Comprehensive car insurance with zero depreciation, 24/7 roadside assistance, and cashless claims.",
      premiumStartsFrom: 2500, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years old",
      keyBenefits: ["Zero depreciation cover", "24x7 roadside assistance", "Cashless repairs at 4000+ garages", "NCB protection add-on", "Engine protection cover"],
      exclusions: ["Drunk driving", "Driving without valid license", "Mechanical breakdown"],
      documentsRequired: ["RC book copy", "Previous insurance policy", "Driving license"],
      isFeatured: true,
    },
    {
      slug: "icici-lombard-car-insurance", providerId: icici.id, name: "ICICI Lombard Complete Cover", category: "motor", subCategory: "car",
      description: "All-round car insurance with instant cashless claim settlement and 24/7 support.",
      premiumStartsFrom: 2800, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Instant claim settlement", "8700+ cashless garages", "Consumables cover add-on", "Key replacement cover", "Tyre protection add-on"],
      exclusions: ["Driving under influence", "Racing or speed testing"],
      documentsRequired: ["RC copy", "Driving license", "Previous policy"],
      isFeatured: true,
    },
    {
      slug: "tata-aig-car-insurance", providerId: tata.id, name: "Tata AIG Car Insurance", category: "motor", subCategory: "car",
      description: "Feature-rich car insurance with emergency assistance and return to invoice cover option.",
      premiumStartsFrom: 2650, coverAmount: "As per IDV", policyTerm: "1 year (renewable)", eligibilityAge: "Vehicle up to 15 years",
      keyBenefits: ["Return to invoice cover", "Emergency hotel accommodation benefit", "Personal accident cover ₹15 lakh", "Roadside assistance — towing, battery jump-start"],
      exclusions: ["Drunk driving", "Usage outside geographic area"],
      documentsRequired: ["RC", "Driving license", "Aadhar", "Previous policy"],
      isFeatured: false,
    },
    {
      slug: "reliance-bike-insurance", providerId: reliance.id, name: "Reliance Bike Insurance", category: "motor", subCategory: "bike",
      description: "Affordable two-wheeler insurance with long-term options and hassle-free claim process.",
      premiumStartsFrom: 1200, coverAmount: "As per IDV", policyTerm: "1 – 5 years", eligibilityAge: "Any two-wheeler",
      keyBenefits: ["Long-term policy option (up to 5 years)", "Personal accident cover ₹15 lakh", "Zero depreciation add-on available", "Cashless repairs at 1500+ garages"],
      exclusions: ["Riding without helmet", "Driving under influence"],
      documentsRequired: ["RC", "Driving license", "Previous policy"],
      isFeatured: false,
    },
    // LIFE
    {
      slug: "hdfc-sanchay-plus", providerId: hdfc.id, name: "HDFC Sanchay Plus", category: "life", subCategory: "guaranteed savings",
      description: "Non-participating savings plan offering guaranteed returns and life cover throughout the policy term.",
      premiumStartsFrom: 5000, coverAmount: "As per sum assured", policyTerm: "5 – 20 years", eligibilityAge: "0 – 60 years",
      keyBenefits: ["Guaranteed maturity benefit", "Life cover for full policy term", "Flexible premium payment terms", "Tax benefit under 80C and 10(10D)"],
      exclusions: ["Suicide within 12 months of policy start"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "Proposal form"],
      isFeatured: true,
    },
    {
      slug: "lic-jeevan-umang", providerId: lic.id, name: "LIC Jeevan Umang", category: "life", subCategory: "whole life",
      description: "Whole life plan providing survival benefits after premium payment term and life cover up to age 100.",
      premiumStartsFrom: 7800, coverAmount: "As per sum assured", policyTerm: "Till age 100", eligibilityAge: "90 days – 55 years",
      keyBenefits: ["8% annual survival benefit after PPT", "Whole life cover till age 100", "Death benefit includes bonuses", "Loan facility available after 3 years"],
      exclusions: ["Suicide within 12 months"],
      documentsRequired: ["Aadhaar", "PAN", "Age proof", "Medical reports"],
      isFeatured: true,
    },
    {
      slug: "sbi-smart-privilege", providerId: sbi.id, name: "SBI Life Smart Privilege", category: "life", subCategory: "ULIP",
      description: "Market-linked ULIP with 10 fund options, loyalty additions, and wealth boosters.",
      premiumStartsFrom: 10000, coverAmount: "10x annual premium", policyTerm: "10 – 30 years", eligibilityAge: "18 – 60 years",
      keyBenefits: ["10 diverse fund options", "Loyalty additions from 6th year", "Unlimited free switches between funds", "Partial withdrawal after 5-year lock-in"],
      exclusions: ["Suicide in first year (full fund value paid)", "Market risk borne by policyholder"],
      documentsRequired: ["Aadhaar", "PAN", "Income proof", "KYC documents"],
      isFeatured: false,
    },
    {
      slug: "kotak-guaranteed-savings", providerId: kotak.id, name: "Kotak Guaranteed Savings Plan", category: "life", subCategory: "endowment",
      description: "Guaranteed savings plan with life cover, flexible premium paying terms, and tax-free maturity benefit.",
      premiumStartsFrom: 6000, coverAmount: "As per sum assured", policyTerm: "10 – 25 years", eligibilityAge: "0 – 60 years",
      keyBenefits: ["Guaranteed additions every year", "Maturity benefit: sum assured + all additions", "Short premium paying term available", "Loan against policy from 3rd year"],
      exclusions: ["Suicide in first 12 months"],
      documentsRequired: ["Aadhaar", "PAN", "Address proof", "Income documents"],
      isFeatured: false,
    },
  ];

  for (const p of policyData) {
    await prisma.policy.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  console.log(`✓ Policies (${policyData.length})`);

  // ─── Demo Leads ────────────────────────────────────────────────────────────
  const leadData = [
    { name: "Rajesh Kumar", phone: "9876543210", email: "rajesh.kumar@gmail.com", category: "term", city: "Delhi", status: "new", leadType: "quote", utmSource: "google" },
    { name: "Priya Sharma", phone: "9823456789", email: "priya.sharma@yahoo.com", category: "health", city: "Mumbai", status: "contacted", leadType: "quote", utmSource: "facebook" },
    { name: "Amit Singh", phone: "9765432198", email: "amit.singh@outlook.com", category: "motor", city: "Bangalore", status: "converted", leadType: "quote", utmSource: "organic" },
    { name: "Sunita Patel", phone: "9845678901", email: "sunita.patel@gmail.com", category: "health", city: "Ahmedabad", status: "new", leadType: "quote", utmSource: "google" },
    { name: "Vikram Nair", phone: "9901234567", email: "vikram.nair@gmail.com", category: "term", city: "Chennai", status: "new", leadType: "callback", utmSource: "organic" },
    { name: "Meena Iyer", phone: "9712345678", email: "meena.iyer@hotmail.com", category: "life", city: "Hyderabad", status: "contacted", leadType: "quote", utmSource: "instagram" },
    { name: "Rahul Joshi", phone: "9632145870", email: null, category: "motor", city: "Pune", status: "new", leadType: "callback", utmSource: "google" },
    { name: "Kavita Reddy", phone: "9558741236", email: "kavita.reddy@gmail.com", category: "health", city: "Bangalore", status: "lost", leadType: "quote", utmSource: "facebook" },
    { name: "Suresh Gupta", phone: "9374651289", email: "suresh.g@gmail.com", category: "term", city: "Lucknow", status: "converted", leadType: "quote", utmSource: "google" },
    { name: "Anita Desai", phone: "9987654321", email: "anita.desai@gmail.com", category: "life", city: "Surat", status: "new", leadType: "quote", utmSource: "organic" },
    { name: "Deepak Malhotra", phone: "9811223344", email: "deepak.m@gmail.com", category: "term", city: "Noida", status: "contacted", leadType: "quote", utmSource: "youtube" },
    { name: "Pooja Mehta", phone: "9456123780", email: "pooja.mehta@gmail.com", category: "health", city: "Jaipur", status: "new", leadType: "quote", utmSource: "google" },
    { name: "Sanjay Tiwari", phone: "9123456780", email: null, category: "motor", city: "Bhopal", status: "contacted", leadType: "callback", utmSource: "direct" },
    { name: "Geeta Rao", phone: "9345678901", email: "geeta.rao@gmail.com", category: "health", city: "Vizag", status: "converted", leadType: "quote", utmSource: "organic" },
    { name: "Manoj Pillai", phone: "9876012345", email: "manoj.p@rediffmail.com", category: "life", city: "Kochi", status: "new", leadType: "quote", utmSource: "facebook" },
  ];

  for (const l of leadData) {
    await prisma.lead.create({ data: l }).catch(() => {});
  }
  console.log(`✓ Demo leads (${leadData.length})`);

  // ─── Due Dates ─────────────────────────────────────────────────────────────
  const now = new Date();
  const dd = (daysOffset: number) => new Date(now.getTime() + daysOffset * 86400000);

  const dueDateData = [
    { policyHolderName: "Ramesh Agarwal", phone: "9876543001", email: "ramesh.a@gmail.com", policyNumber: "LIC-2023-001234", dueDate: dd(5), status: "pending", notes: "High-value client. Call personally." },
    { policyHolderName: "Sunita Rao", phone: "9765432001", email: "sunita.rao@yahoo.com", policyNumber: "HDFC-2022-056789", dueDate: dd(12), status: "notified", notes: "Sent WhatsApp. Awaiting confirmation." },
    { policyHolderName: "Ajay Verma", phone: "9654321001", email: null, policyNumber: "BAJAJ-2023-009876", dueDate: dd(3), status: "pending", notes: "Motor insurance renewal. NCB applicable." },
    { policyHolderName: "Neha Kapoor", phone: "9543210001", email: "neha.k@gmail.com", policyNumber: "STAR-2023-112233", dueDate: dd(28), status: "pending", notes: "Family floater renewal. 4 members." },
    { policyHolderName: "Prakash Shetty", phone: "9432100001", email: "prakash.s@gmail.com", policyNumber: "ICICI-2022-445566", dueDate: dd(-3), status: "lapsed", notes: "Did not respond to 3 calls. Mark lapsed." },
    { policyHolderName: "Ananya Mishra", phone: "9321000001", email: "ananya.m@gmail.com", policyNumber: "SBI-2023-778899", dueDate: dd(20), status: "pending", notes: "Interested in upgrading sum insured." },
    { policyHolderName: "Kiran Bhat", phone: "9876123456", email: "kiran.b@gmail.com", policyNumber: "NIVA-2022-334455", dueDate: dd(7), status: "notified", notes: "Email sent. Follow up call scheduled." },
    { policyHolderName: "Ravi Shankar", phone: "9765234567", email: null, policyNumber: "TATA-2023-667788", dueDate: dd(45), status: "pending", notes: "Car insurance — ask about zero dep upgrade." },
  ];

  for (const d of dueDateData) {
    await prisma.dueDate.create({ data: d }).catch(() => {});
  }
  console.log(`✓ Due dates (${dueDateData.length})`);

  // ─── FAQs ──────────────────────────────────────────────────────────────────
  const faqs = [
    { question: "What is term insurance?", answer: "Term insurance is a pure life insurance product that provides financial protection to your family in case of your untimely death during the policy term. If you survive the term, no benefit is payable unless you opt for return of premium.", category: "term", sortOrder: 1 },
    { question: "How much term insurance cover do I need?", answer: "A common thumb rule is 10–15× your annual income. Consider outstanding loans, family monthly expenses, and children's education costs.", category: "term", sortOrder: 2 },
    { question: "At what age should I buy term insurance?", answer: "The earlier the better. Buying at 25–30 years gives the lowest premiums. Premiums increase significantly with age. Most insurers accept up to age 65.", category: "term", sortOrder: 3 },
    { question: "What is cashless hospitalisation?", answer: "Cashless hospitalisation means you don't pay hospital bills upfront. The insurer settles directly with the network hospital. You only pay non-covered items.", category: "health", sortOrder: 1 },
    { question: "What is the waiting period in health insurance?", answer: "Most health plans have a 30-day initial waiting period, 2–4 year waiting for pre-existing diseases, and 1–2 year for specific illnesses like hernia or cataract.", category: "health", sortOrder: 2 },
    { question: "What is No Claim Bonus (NCB) in car insurance?", answer: "NCB is a discount on your Own Damage premium for every claim-free year. It starts at 20% after 1 year and goes up to 50% after 5 consecutive claim-free years.", category: "motor", sortOrder: 1 },
    { question: "Is motor insurance mandatory?", answer: "Yes. Under the Motor Vehicles Act, every vehicle on Indian roads must have at least Third-Party insurance. Driving without it can result in a ₹2,000 fine and 3 months imprisonment.", category: "motor", sortOrder: 2 },
    { question: "What is the difference between term and life insurance?", answer: "Term insurance provides only a death benefit — no payout on survival. Life insurance plans (endowment, ULIP, whole life) provide both death benefit and maturity/savings benefit, but premiums are higher.", category: "life", sortOrder: 1 },
    { question: "What is a ULIP?", answer: "ULIP (Unit Linked Insurance Plan) is a life insurance policy that invests part of your premium in market-linked funds. Returns depend on fund performance. They have a 5-year lock-in period.", category: "life", sortOrder: 2 },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq }).catch(() => {});
  }
  console.log("✓ FAQs");

  // ─── Testimonials ──────────────────────────────────────────────────────────
  const testimonials = [
    { name: "Rajesh Kumar", city: "Delhi", rating: 5, body: "Got my term insurance sorted in 10 minutes. The comparison made it so easy to pick the right plan for my family.", category: "term", isActive: true },
    { name: "Priya Sharma", city: "Mumbai", rating: 5, body: "Star Health's cashless claim was processed within hours. Extremely happy with the service and the portal's guidance.", category: "health", isActive: true },
    { name: "Amit Singh", city: "Bangalore", rating: 4, body: "The motor insurance comparison helped me understand exactly what I was paying for. Transparent and quick.", category: "motor", isActive: true },
    { name: "Sunita Patel", city: "Ahmedabad", rating: 5, body: "Best platform for comparing insurance. Saved ₹3,000 on my health premium by switching plans through this site.", category: "health", isActive: true },
    { name: "Vikram Nair", city: "Chennai", rating: 5, body: "Bought HDFC Click2Protect in under 15 minutes. The advisor called me within 30 minutes and helped with all documentation.", category: "term", isActive: true },
    { name: "Meena Iyer", city: "Hyderabad", rating: 4, body: "Very helpful comparison tool. Could compare 5 health plans side by side and pick the one with best claim ratio.", category: "health", isActive: true },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log("✓ Testimonials");

  console.log("\n🎉 Seeding complete!");
  console.log("\nAdmin logins:");
  console.log("  Super Admin : admin@insuranceportal.com / admin123");
  console.log("  Editor      : editor@insuranceportal.com / editor123");
  console.log("  Viewer      : viewer@insuranceportal.com / viewer123");
  console.log("  Sales       : sales@insuranceportal.com / sales123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
