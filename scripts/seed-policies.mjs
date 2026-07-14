// Run: node scripts/seed-policies.mjs
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const POLICIES = [
  // ── TERM ──────────────────────────────────────────────────────────────────
  {
    slug: "icici-lombard-term-protect",
    providerId: 32, // ICICI Lombard
    name: "iProtect Smart Term Plan",
    category: "term",
    description: "Comprehensive term plan with life stage protection and return of premium option.",
    premiumStartsFrom: 656,
    coverAmount: "50 Lakh – 10 Crore",
    policyTerm: "5 – 50 years",
    eligibilityAge: "18 – 65 years",
    keyBenefits: ["Life cover up to age 99", "Return of premium option", "Critical illness add-on", "Waiver of premium on disability"],
    exclusions: ["Suicide within first year", "Self-inflicted injury"],
    documentsRequired: ["Aadhaar", "PAN", "Salary slips", "Bank statements"],
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "hdfc-ergo-click2protect",
    providerId: 51, // HDFC Ergo
    name: "Click 2 Protect Super",
    category: "term",
    description: "Flexible term plan with income benefit and increasing cover options.",
    premiumStartsFrom: 720,
    coverAmount: "25 Lakh – 5 Crore",
    policyTerm: "10 – 40 years",
    eligibilityAge: "18 – 65 years",
    keyBenefits: ["Increasing cover at key life stages", "Monthly income benefit", "Terminal illness cover", "Disability waiver"],
    exclusions: ["Suicide within first year", "War or civil unrest"],
    documentsRequired: ["Aadhaar", "PAN", "Income proof"],
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "tata-aig-maha-raksha-supreme",
    providerId: 52, // Tata AIG
    name: "Maha Raksha Supreme",
    category: "term",
    description: "High-cover term plan with joint life option and critical illness benefit.",
    premiumStartsFrom: 590,
    coverAmount: "50 Lakh – 20 Crore",
    policyTerm: "10 – 40 years",
    eligibilityAge: "18 – 60 years",
    keyBenefits: ["Joint life cover for spouse", "Critical illness lump sum", "Accidental death benefit", "Premium waiver on CI"],
    exclusions: ["Pre-existing conditions within 2 years", "Aviation accidents (non-commercial)"],
    documentsRequired: ["Aadhaar", "PAN", "Medical reports"],
    isFeatured: false,
    isActive: true,
  },

  // ── HEALTH ────────────────────────────────────────────────────────────────
  {
    slug: "care-health-supreme",
    providerId: 36, // Care Health
    name: "Care Supreme Health Plan",
    category: "health",
    description: "Comprehensive health plan with no room rent capping and unlimited restoration.",
    premiumStartsFrom: 4200,
    coverAmount: "5 Lakh – 1 Crore",
    policyTerm: "1 year (renewable)",
    eligibilityAge: "18 – 99 years (adult), 91 days (child)",
    keyBenefits: ["No room rent capping", "Unlimited restoration", "OPD cover", "Worldwide emergency cover"],
    exclusions: ["Cosmetic surgery", "Dental treatment (non-accidental)", "Pre-existing diseases (2-year waiting)"],
    documentsRequired: ["Aadhaar", "PAN", "Medical history"],
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "niva-bupa-health-companion",
    providerId: 40, // Niva Bupa
    name: "Health Companion Individual",
    category: "health",
    description: "Individual health plan with direct claim settlement and no third-party involvement.",
    premiumStartsFrom: 5100,
    coverAmount: "3 Lakh – 1 Crore",
    policyTerm: "1 year (renewable)",
    eligibilityAge: "18 – 65 years",
    keyBenefits: ["Direct claim settlement", "Cashless at 8400+ hospitals", "Mental health cover", "Cumulative bonus up to 150%"],
    exclusions: ["Self-inflicted injuries", "Obesity treatment", "Infertility treatment"],
    documentsRequired: ["Aadhaar", "Age proof", "Medical reports (if age > 45)"],
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "aditya-birla-activ-health-platinum",
    providerId: 39, // Aditya Birla
    name: "Activ Health Platinum Enhanced",
    category: "health",
    description: "Premium health plan with chronic disease management and wellness rewards.",
    premiumStartsFrom: 6800,
    coverAmount: "10 Lakh – 2 Crore",
    policyTerm: "1 year (renewable)",
    eligibilityAge: "18 – 65 years",
    keyBenefits: ["Chronic disease management", "HealthReturns up to 30%", "Global cover", "OPD, dental & vision cover"],
    exclusions: ["Cosmetic procedures", "Experimental treatments"],
    documentsRequired: ["Aadhaar", "PAN", "Medical history"],
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "manipal-cigna-prime-active",
    providerId: 33, // Manipal Cigna
    name: "Prime Active Health Plan",
    category: "health",
    description: "Active health coverage with fitness benefits and preventive care.",
    premiumStartsFrom: 3900,
    coverAmount: "2.5 Lakh – 50 Lakh",
    policyTerm: "1 year (renewable)",
    eligibilityAge: "18 – 65 years",
    keyBenefits: ["Fitness benefit rewards", "Annual health check-up", "Domiciliary hospitalization", "Day care procedures covered"],
    exclusions: ["Adventure sports injuries", "Non-allopathic treatment"],
    documentsRequired: ["Aadhaar", "Age proof"],
    isFeatured: false,
    isActive: true,
  },

  // ── MOTOR / CAR ───────────────────────────────────────────────────────────
  {
    slug: "bajaj-allianz-car-own-damage",
    providerId: 49, // Bajaj Allianz
    name: "Car Own Damage Cover",
    category: "car",
    description: "Comprehensive own damage car insurance with zero depreciation add-on.",
    premiumStartsFrom: 2400,
    coverAmount: "IDV-based",
    policyTerm: "1 year",
    eligibilityAge: "Vehicles up to 15 years old",
    keyBenefits: ["Zero depreciation add-on", "Engine protection", "Roadside assistance 24x7", "Consumables cover"],
    exclusions: ["Drunk driving", "Driving without valid license", "Mechanical/electrical breakdown"],
    documentsRequired: ["RC copy", "Previous policy", "Aadhaar"],
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "hdfc-ergo-comprehensive-motor",
    providerId: 51, // HDFC Ergo
    name: "Comprehensive Motor Insurance",
    category: "car",
    description: "All-in-one car insurance with instant claim settlement and garage network.",
    premiumStartsFrom: 2100,
    coverAmount: "IDV-based",
    policyTerm: "1 year",
    eligibilityAge: "Vehicles up to 15 years old",
    keyBenefits: ["5000+ cashless garages", "Instant claim settlement", "NCB protection", "Return to invoice cover"],
    exclusions: ["Wear and tear", "Tyres/tubes (standalone)", "War damage"],
    documentsRequired: ["RC copy", "Driving license", "Previous policy"],
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "go-digit-car-insurance",
    providerId: 55, // Go Digit
    name: "Digit Car Insurance",
    category: "car",
    description: "Simple, transparent car insurance with paperless claims and self-inspection.",
    premiumStartsFrom: 1980,
    coverAmount: "IDV-based",
    policyTerm: "1 year",
    eligibilityAge: "Vehicles up to 15 years old",
    keyBenefits: ["Self-inspection via app", "Paperless claims", "Flexible IDV", "Overnight car repair"],
    exclusions: ["Commercial use", "Racing or speed tests"],
    documentsRequired: ["RC copy", "Driving license"],
    isFeatured: false,
    isActive: true,
  },

  // ── TWO-WHEELER ───────────────────────────────────────────────────────────
  {
    slug: "bajaj-allianz-two-wheeler",
    providerId: 49, // Bajaj Allianz
    name: "Two Wheeler Package Policy",
    category: "two-wheeler",
    description: "Comprehensive bike insurance with own damage and third-party cover.",
    premiumStartsFrom: 620,
    coverAmount: "IDV-based",
    policyTerm: "1 year",
    eligibilityAge: "Bikes up to 15 years old",
    keyBenefits: ["Zero depreciation add-on", "24x7 roadside assistance", "Cashless repairs at 4000+ garages", "Personal accident cover"],
    exclusions: ["Drunk driving", "No helmet", "Mechanical breakdown"],
    documentsRequired: ["RC copy", "Driving license"],
    isFeatured: false,
    isActive: true,
  },

  // ── TRAVEL ────────────────────────────────────────────────────────────────
  {
    slug: "tata-aig-travel-guard",
    providerId: 52, // Tata AIG
    name: "Travel Guard International",
    category: "travel",
    description: "Comprehensive international travel insurance with medical emergency coverage.",
    premiumStartsFrom: 350,
    coverAmount: "$50,000 – $500,000",
    policyTerm: "Per trip",
    eligibilityAge: "1 – 70 years",
    keyBenefits: ["Emergency medical cover", "Trip cancellation", "Lost baggage", "Passport loss cover"],
    exclusions: ["Pre-existing conditions", "Adventure sports (without add-on)", "Self-harm"],
    documentsRequired: ["Passport copy", "Ticket copy", "Aadhaar"],
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "europ-assist-travel-plan",
    providerId: 44, // Europ Assist
    name: "Travel Secure Plan",
    category: "travel",
    description: "Global travel protection with 24x7 assistance and evacuation cover.",
    premiumStartsFrom: 420,
    coverAmount: "$100,000",
    policyTerm: "Per trip / multi-trip annual",
    eligibilityAge: "6 months – 75 years",
    keyBenefits: ["24x7 global assistance", "Emergency evacuation", "Flight delay compensation", "Home burglary cover"],
    exclusions: ["War zones", "Undeclared pre-existing conditions"],
    documentsRequired: ["Passport", "Travel itinerary"],
    isFeatured: false,
    isActive: true,
  },

  // ── HOME ──────────────────────────────────────────────────────────────────
  {
    slug: "sbi-general-home-shield",
    providerId: 54, // SBI General
    name: "SBI Home Shield Insurance",
    category: "home",
    description: "Comprehensive home insurance covering structure and contents against all risks.",
    premiumStartsFrom: 1200,
    coverAmount: "5 Lakh – 5 Crore",
    policyTerm: "1 – 30 years",
    eligibilityAge: "N/A",
    keyBenefits: ["Structure cover", "Contents cover", "Jewellery & valuables", "Public liability cover"],
    exclusions: ["Wear and tear", "Willful damage", "War damage"],
    documentsRequired: ["Property documents", "Aadhaar", "Valuation report"],
    isFeatured: false,
    isActive: true,
  },

  // ── LIFE ──────────────────────────────────────────────────────────────────
  {
    slug: "icici-lombard-life-guaranteed-return",
    providerId: 32, // ICICI Lombard
    name: "Guaranteed Income Pro",
    category: "guaranteed-return",
    description: "Life plan offering guaranteed returns with flexible payout options.",
    premiumStartsFrom: 10000,
    coverAmount: "10 Lakh – 5 Crore",
    policyTerm: "10 – 30 years",
    eligibilityAge: "0 – 60 years",
    keyBenefits: ["Guaranteed maturity benefit", "Flexible payout (lump sum or monthly)", "Tax benefit under 80C & 10(10D)", "Life cover throughout term"],
    exclusions: ["Suicide within first year"],
    documentsRequired: ["Aadhaar", "PAN", "Income proof", "Medical reports"],
    isFeatured: true,
    isActive: true,
  },
];

async function main() {
  console.log(`Seeding ${POLICIES.length} demo policies...\n`);

  let created = 0;
  let skipped = 0;

  for (const policy of POLICIES) {
    try {
      await db.policy.upsert({
        where: { slug: policy.slug },
        update: {},
        create: policy,
      });
      console.log(`  ✓ ${policy.name} (${policy.category})`);
      created++;
    } catch (e) {
      console.log(`  ✗ ${policy.slug} — ${e.message}`);
      skipped++;
    }
  }

  console.log(`\nDone! ${created} created, ${skipped} skipped.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
