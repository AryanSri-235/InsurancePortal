export type CategorySlug = "term" | "health" | "motor" | "life" | "car" | "two-wheeler" | "family-health" | "group-health" | "travel" | "home" | "term-women" | "term-rop" | "guaranteed-return" | "child-savings" | "retirement";

export interface CategoryConfig {
  slug: CategorySlug;
  parentCategory?: CategorySlug;
  label: string;
  route: string;
  emoji: string;
  headline: string;
  subheadline: string;
  color: {
    bg?: string;
    accent?: string;
    badge?: string;
    badgeText?: string;
    gradient?: string;
    primary?: string;
    secondary?: string;
    light?: string;
    from?: string;
    to?: string;
  };
  trustBadges: string[] | { label?: string; icon?: string; text?: string }[];
  highlights: { icon?: string; label?: string; value?: string; description?: string; title?: string }[] | string[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  explainerTitle?: string;
  whoShouldBuy: { icon?: string; label?: string; title?: string; description?: string; persona?: string; reason?: string }[] | string[];
  keyFeatures: string[] | { title: string; description: string }[];
  badgeText?: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  term: {
    slug: "term",
    label: "Term Insurance",
    route: "/term-insurance",
    emoji: "🛡️",
    headline: "Best Term Insurance Plans in India 2024",
    subheadline: "Get life cover up to ₹5 Crore at just ₹490/month. Compare 20+ term plans from top insurers.",
    color: {
      bg: "from-blue-700 to-blue-900",
      accent: "blue",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Term Insurance",
    },
    trustBadges: ["Claim Settlement up to 99.5%", "Cover up to ₹5 Crore", "Tax benefit under 80C"],
    highlights: [
      { icon: "💰", label: "Lowest Premium", value: "From ₹490/mo" },
      { icon: "🛡️", label: "Max Cover", value: "Up to ₹5 Crore" },
      { icon: "📅", label: "Policy Term", value: "Up to 40 years" },
      { icon: "🏆", label: "Claim Ratio", value: "Up to 99.5%" },
    ],
    faqs: [
      {
        question: "What is term insurance and how does it work?",
        answer: "Term insurance is a pure life cover plan that pays a death benefit to your nominees if you pass away during the policy term. Unlike endowment or ULIP plans, it has no maturity benefit — which is why premiums are very low.",
      },
      {
        question: "How much term insurance cover do I need?",
        answer: "The standard rule is 10–15× your annual income. If you earn ₹10 lakh/year, aim for ₹1–1.5 Crore cover. Also factor in outstanding loans, your family's monthly expenses, and children's education goals.",
      },
      {
        question: "At what age should I buy term insurance?",
        answer: "The earlier the better. Buying at 25–30 gives you the lowest premiums for the same cover amount. Premiums increase significantly with age. Most insurers accept applications up to age 65.",
      },
      {
        question: "Is term insurance premium tax deductible?",
        answer: "Yes. Premiums paid for term insurance are deductible under Section 80C of the Income Tax Act (up to ₹1.5 lakh/year). The death benefit received by nominees is fully tax-free under Section 10(10D).",
      },
      {
        question: "What happens if I stop paying premiums?",
        answer: "If you miss a premium, most insurers offer a 30-day grace period. After that, the policy lapses. You can revive it within 2–5 years (varies by insurer) by paying outstanding premiums + interest.",
      },
    ],
    metaTitle: "Best Term Insurance Plans 2024 — Compare & Buy Online",
    metaDescription: "Compare 20+ term insurance plans from LIC, HDFC Life, ICICI Prudential, and more. Get ₹1 Crore cover from ₹490/month. 100% free comparison.",
    explainerTitle: "What Is Term Insurance?",
    whoShouldBuy: [
      { icon: "👨‍👩‍👧", label: "Breadwinners with dependants" },
      { icon: "🏠", label: "Home loan borrowers" },
      { icon: "🌱", label: "First-time insurance buyers" },
    ],
    keyFeatures: [
      "Pure death benefit — maximum cover at lowest cost",
      "Tax deduction on premium under Section 80C",
      "Optional riders: Critical Illness, Accidental Death",
      "Whole life option available (cover up to age 99)",
      "Return of Premium variant refunds all premiums at maturity",
      "Online purchase saves 10–15% vs offline",
      "Nominee receives sum assured fully tax-free (Sec 10(10D))",
      "Grace period of 30 days for missed premiums",
    ],
  },

  health: {
    slug: "health",
    label: "Health Insurance",
    route: "/health-insurance",
    emoji: "🏥",
    headline: "Best Health Insurance Plans in India 2024",
    subheadline: "Cashless treatment at 14,000+ hospitals. Compare family floater and individual health plans.",
    color: {
      bg: "from-green-700 to-green-900",
      accent: "green",
      badge: "bg-green-100 text-green-700",
      badgeText: "Health Insurance",
    },
    trustBadges: ["14,000+ Network Hospitals", "Cashless Claims", "No Room Rent Cap"],
    highlights: [
      { icon: "🏥", label: "Network Hospitals", value: "14,000+" },
      { icon: "💊", label: "Cover Starts", value: "From ₹3 Lakh" },
      { icon: "⚡", label: "Claim Settlement", value: "Within 4 hrs" },
      { icon: "🔄", label: "Renewability", value: "Lifelong" },
    ],
    faqs: [
      {
        question: "What is cashless hospitalisation?",
        answer: "Cashless hospitalisation means you don't pay the hospital bill at the time of treatment. Your insurer settles the bill directly with the network hospital. You only pay non-covered items (if any).",
      },
      {
        question: "What is the waiting period in health insurance?",
        answer: "Most health plans have a 30-day initial waiting period (no claims except accidents), 2–4 year waiting period for pre-existing diseases, and 1–2 year waiting period for specific illnesses like hernia or cataract.",
      },
      {
        question: "Should I buy individual or family floater plan?",
        answer: "A family floater plan covers the entire family under one sum insured and is cheaper. However, if any member is older (60+) or has pre-existing conditions, individual plans may be better to avoid premium increase for all.",
      },
      {
        question: "Does health insurance cover maternity?",
        answer: "Some plans cover maternity after a waiting period of 2–4 years. Plans like Star Comprehensive offer maternity cover after 2 years of continuous coverage. Check sub-limits (usually ₹50,000–₹1 lakh).",
      },
      {
        question: "What is a no-claim bonus in health insurance?",
        answer: "If you don't make any claims in a policy year, your insurer increases your sum insured by 5–50% as a no-claim bonus at renewal — at no extra cost. Some plans offer up to 100% cumulative bonus.",
      },
    ],
    metaTitle: "Best Health Insurance Plans 2024 — Compare & Buy Online",
    metaDescription: "Compare health insurance plans from Star Health, ICICI Lombard, Niva Bupa, and more. Cashless at 14,000+ hospitals. Family floater from ₹7,500/year.",
    explainerTitle: "What Is Health Insurance?",
    whoShouldBuy: [
      { icon: "👨‍👩‍👧", label: "Families with young children" },
      { icon: "👴", label: "Senior citizens & parents" },
      { icon: "💼", label: "Salaried professionals" },
    ],
    keyFeatures: [
      "Cashless hospitalisation at 14,000+ network hospitals",
      "Pre and post hospitalisation (30 and 60 days)",
      "No-claim bonus increases sum insured up to 100%",
      "Lifelong renewability guaranteed",
      "Day care procedures (500+) fully covered",
      "AYUSH treatments included in many plans",
      "Annual preventive health check-up",
      "Domiciliary / home treatment covered",
    ],
  },

  motor: {
    slug: "motor",
    label: "Motor Insurance",
    route: "/motor-insurance",
    emoji: "🚗",
    headline: "Best Car & Bike Insurance in India 2024",
    subheadline: "Mandatory by law. Zero depreciation + 24x7 roadside assistance. Renew in 2 minutes.",
    color: {
      bg: "from-blue-600 to-blue-800",
      accent: "blue",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Motor Insurance",
    },
    trustBadges: ["Legally Mandatory", "4,000+ Cashless Garages", "Zero Depreciation Cover"],
    highlights: [
      { icon: "🔧", label: "Cashless Garages", value: "4,000+" },
      { icon: "📱", label: "Instant Policy", value: "In 2 minutes" },
      { icon: "🛣️", label: "Roadside Assist", value: "24x7" },
      { icon: "💸", label: "NCB Discount", value: "Up to 50%" },
    ],
    faqs: [
      {
        question: "Is motor insurance mandatory in India?",
        answer: "Yes. Under the Motor Vehicles Act, every vehicle plying on Indian roads must have at least a Third-Party (TP) insurance policy. Driving without valid insurance can result in a fine of ₹2,000 and/or 3 months imprisonment.",
      },
      {
        question: "What is the difference between third-party and comprehensive motor insurance?",
        answer: "Third-party (TP) insurance covers damage you cause to others (property, injury, death). Comprehensive insurance covers TP liability PLUS damage to your own vehicle from accidents, theft, natural disasters, etc.",
      },
      {
        question: "What is IDV in car insurance?",
        answer: "IDV (Insured Declared Value) is the current market value of your car, determined by the insurer. It's the maximum amount you get if your car is stolen or a total loss. A higher IDV means higher premium but better compensation.",
      },
      {
        question: "What is No Claim Bonus (NCB) and how does it work?",
        answer: "NCB is a discount on your Own Damage (OD) premium for every claim-free year. It starts at 20% after 1 year and increases to 25%, 35%, 45%, 50% after 2, 3, 4, 5 years respectively.",
      },
      {
        question: "What does zero depreciation cover mean?",
        answer: "In a standard claim, depreciation is deducted from parts (e.g., 50% for rubber parts). With zero depreciation (also called bumper-to-bumper) cover, your insurer pays the full cost of parts without any depreciation deduction.",
      },
    ],
    metaTitle: "Best Car & Bike Insurance 2024 — Compare & Renew Online",
    metaDescription: "Compare comprehensive and third-party motor insurance from Bajaj Allianz, ICICI Lombard, HDFC ERGO. Zero depreciation, cashless garages, instant policy.",
    explainerTitle: "What Is Motor Insurance?",
    whoShouldBuy: [
      { icon: "🚗", label: "New car and bike owners" },
      { icon: "🏦", label: "Vehicle loan holders" },
      { icon: "🏢", label: "Commercial vehicle operators" },
    ],
    keyFeatures: [
      "Third-party liability cover mandatory by law",
      "Own damage cover for theft, fire, flood, accident",
      "Zero depreciation add-on — full part replacement cost",
      "NCB discount up to 50% for claim-free years",
      "24x7 roadside assistance and towing service",
      "Cashless repairs at 4,000+ network garages",
      "Personal accident cover for owner-driver",
      "Engine protection and key replacement add-ons",
    ],
  },

  life: {
    slug: "life",
    label: "Life Insurance",
    route: "/life-insurance",
    emoji: "💰",
    headline: "Best Life Insurance Plans in India 2024",
    subheadline: "Build wealth while protecting your family. ULIP, endowment, whole life — compare all.",
    color: {
      bg: "from-green-700 to-green-900",
      accent: "green",
      badge: "bg-green-100 text-green-700",
      badgeText: "Life Insurance",
    },
    trustBadges: ["Guaranteed Returns", "Tax Saving under 80C", "Maturity Benefit"],
    highlights: [
      { icon: "📈", label: "Returns", value: "5–12% p.a." },
      { icon: "🛡️", label: "Life Cover", value: "Included" },
      { icon: "💸", label: "Tax Saved", value: "Up to ₹46,800" },
      { icon: "⏰", label: "Premium Paying", value: "5–20 years" },
    ],
    faqs: [
      {
        question: "What is the difference between term and life insurance?",
        answer: "Term insurance provides only a death benefit — if you survive the term, nothing is paid back. Life insurance plans (endowment, ULIP, whole life) provide both a death benefit and a maturity/savings benefit, but premiums are higher.",
      },
      {
        question: "What is a ULIP?",
        answer: "ULIP (Unit Linked Insurance Plan) is a life insurance policy that also invests part of your premium in market-linked funds (equity, debt, or balanced). Returns depend on fund performance. They have a 5-year lock-in period.",
      },
      {
        question: "What is an endowment plan?",
        answer: "An endowment plan is a traditional life insurance policy that guarantees a lump sum (sum assured + bonuses) at maturity, or pays the sum assured to nominees in case of death. Returns are typically 4–6% p.a. — conservative but predictable.",
      },
      {
        question: "How much life cover do I get with a savings plan?",
        answer: "Traditional plans offer 10–25× the annual premium as sum assured. ULIPs offer a minimum 10× the annual premium. This is lower than a pure term plan — if high life cover is the priority, combine a term plan with a savings plan.",
      },
      {
        question: "Are life insurance returns tax-free?",
        answer: "The maturity proceeds from life insurance are tax-free under Section 10(10D) if the premium paid is less than 10% of the sum assured (for plans issued after April 2012). Premiums up to ₹1.5 lakh are deductible under Section 80C.",
      },
    ],
    metaTitle: "Best Life Insurance Plans 2024 — ULIP, Endowment, Whole Life",
    metaDescription: "Compare life insurance plans from LIC, HDFC Life, SBI Life. Guaranteed returns, tax saving under 80C, maturity benefits. Get free advice from experts.",
    explainerTitle: "What Is Life Insurance?",
    whoShouldBuy: [
      { icon: "📈", label: "Long-term wealth builders" },
      { icon: "💸", label: "Tax-saving individuals" },
      { icon: "👶", label: "Parents planning child's future" },
    ],
    keyFeatures: [
      "Life cover + savings/investment in one plan",
      "Maturity benefit paid on policy completion",
      "Tax-free maturity proceeds under Section 10(10D)",
      "Multiple fund options in ULIPs (equity/debt/balanced)",
      "Partial withdrawal allowed after 5-year lock-in",
      "Loan against policy available for liquidity",
      "Guaranteed additions in traditional participating plans",
      "Premium payment flexibility: single, limited, or regular",
    ],
  },

  car: {
    slug: "car",
    parentCategory: "motor",
    label: "Car Insurance",
    route: "/car-insurance",
    emoji: "🚗",
    headline: "Best Car Insurance Plans in India 2024",
    subheadline: "Compare comprehensive, third-party & own damage car insurance. Zero depreciation, cashless garages, instant policy.",
    color: {
      gradient: "from-blue-600 to-blue-800",
      accent: "blue",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Car Insurance",
    },
    trustBadges: [
      "Cashless at 4,000+ Garages",
      "Zero Depreciation Cover",
      "24x7 Roadside Assist",
    ],
    highlights: [
      {
        label: "Cashless Garages",
        value: "4,000+",
        description: "Network garages across India for hassle-free repairs",
      },
      {
        label: "Claim Settlement Ratio",
        value: "98%",
        description: "Top insurers settle claims within 7 days",
      },
      {
        label: "Premium Savings",
        value: "Up to 70%",
        description: "Save on premium by comparing plans online",
      },
      {
        label: "No Claim Bonus",
        value: "Up to 50%",
        description: "Discount on renewal for every claim-free year",
      },
    ],
    faqs: [
      {
        question: "What is IDV in car insurance?",
        answer:
          "IDV (Insured Declared Value) is the current market value of your car and represents the maximum claim amount you can receive in case of total loss or theft. IDV is calculated based on the manufacturer's listed selling price minus depreciation. A higher IDV means better coverage but a slightly higher premium.",
      },
      {
        question: "What is No Claim Bonus (NCB) and how does it work?",
        answer:
          "NCB is a discount offered by insurers for every claim-free policy year. It starts at 20% after the first claim-free year and can go up to 50% after five consecutive claim-free years. NCB belongs to the policyholder, not the vehicle, so you can transfer it when you buy a new car or switch insurers.",
      },
      {
        question: "What is zero depreciation cover and do I need it?",
        answer:
          "Zero depreciation (also called bumper-to-bumper) cover ensures that you receive the full cost of replaced parts without any deduction for depreciation during a claim. Standard policies apply depreciation rates (up to 50% for older parts), so zero dep is highly recommended for new cars or cars up to 5 years old to avoid out-of-pocket expenses during repairs.",
      },
      {
        question: "What is the difference between third-party and comprehensive car insurance?",
        answer:
          "Third-party insurance is mandatory by law and covers damages or injuries caused to a third party (another person, vehicle, or property) by your car. It does not cover your own vehicle's damage. Comprehensive insurance includes third-party cover plus own damage cover — protecting your car against accidents, theft, fire, natural calamities, and vandalism. Comprehensive plans can also be enhanced with add-ons like zero dep, engine protection, and roadside assistance.",
      },
      {
        question: "What should I do immediately after a car accident to file a claim?",
        answer:
          "After an accident: (1) Ensure safety — move to a safe location and check for injuries. (2) Inform your insurer or call their 24x7 helpline immediately. (3) File an FIR at the nearest police station if there is injury or major damage. (4) Document the scene with photographs of the damage, vehicle number plates, and surroundings. (5) Do not move the vehicle until surveyed if possible. (6) Take the car to a network (cashless) garage for repairs. (7) Submit required documents — claim form, RC, driving licence, FIR copy, and repair estimate — to the insurer.",
      },
    ],
    metaTitle: "Best Car Insurance Plans 2024 — Compare & Buy Online",
    metaDescription:
      "Compare best car insurance plans in India 2024. Get comprehensive, third-party & own damage cover with zero depreciation, cashless repairs at 4,000+ garages, and instant policy issuance. Save up to 70% on premium.",
    explainerTitle: "What Is Car Insurance?",
    whoShouldBuy: [
      {
        title: "New Car Owners",
        description:
          "A brand-new car is a major investment. Comprehensive insurance with zero depreciation ensures you get full repair costs covered without depreciation deductions, protecting your investment from day one.",
      },
      {
        title: "Daily Commuters",
        description:
          "If you drive regularly in city traffic, the risk of minor accidents and dents is higher. A comprehensive policy with cashless garage access and roadside assistance keeps you covered every day.",
      },
      {
        title: "Anyone Renewing an Expiring Policy",
        description:
          "Driving without valid insurance is illegal and risky. Renewing on time preserves your accumulated No Claim Bonus (up to 50% discount) and ensures continuous coverage without a break.",
      },
    ],
    keyFeatures: [
      {
        title: "Cashless Repairs",
        description:
          "Get your car repaired at 4,000+ network garages without paying out of pocket — the insurer settles bills directly.",
      },
      {
        title: "Zero Depreciation Cover",
        description:
          "Claim the full cost of replaced parts without any depreciation deduction, ideal for cars up to 5 years old.",
      },
      {
        title: "Own Damage Cover",
        description:
          "Covers repair costs for damage to your own vehicle due to accidents, fire, natural disasters, or vandalism.",
      },
      {
        title: "Third-Party Liability",
        description:
          "Mandatory cover that protects you against legal liability for injury, death, or property damage caused to third parties.",
      },
      {
        title: "No Claim Bonus (NCB)",
        description:
          "Earn up to 50% discount on renewal premium for every claim-free year — a reward for safe driving.",
      },
      {
        title: "24x7 Roadside Assistance",
        description:
          "Emergency services including towing, flat tyre change, fuel delivery, and on-spot repairs anywhere in India.",
      },
      {
        title: "Engine & Gearbox Protection",
        description:
          "Add-on cover for damage to the engine and gearbox due to water ingression or oil leakage — not covered in standard plans.",
      },
      {
        title: "Personal Accident Cover",
        description:
          "Mandatory Rs. 15 lakh personal accident cover for the owner-driver, with optional cover available for passengers.",
      },
    ],
  },

  "two-wheeler": {
    slug: "two-wheeler",
    parentCategory: "motor",
    label: "Two Wheeler Insurance",
    route: "/two-wheeler-insurance",
    emoji: "🛵",
    headline: "Best Bike & Scooter Insurance in India 2024",
    subheadline: "Mandatory third-party cover + comprehensive protection for your bike. Renew in 2 minutes.",
    color: {
      gradient: "from-blue-600 to-blue-800",
      accent: "blue",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Bike Insurance",
    },
    trustBadges: [
      { label: "30+ Insurers", icon: "shield" },
      { label: "2-Min Renewal", icon: "clock" },
      { label: "Instant Policy", icon: "zap" },
      { label: "Cashless Garages", icon: "wrench" },
    ],
    highlights: [
      {
        title: "Third-Party Liability",
        description: "Legally mandatory cover protecting you against claims from third parties for injury, death, or property damage.",
      },
      {
        title: "Own Damage Cover",
        description: "Covers repair or replacement costs for your bike due to accidents, theft, fire, or natural disasters.",
      },
      {
        title: "Zero Depreciation Add-on",
        description: "Get full claim amount without depreciation deduction on plastic, rubber, and metal parts.",
      },
      {
        title: "Personal Accident Cover",
        description: "Mandatory Rs. 15 lakh personal accident cover for the owner-driver in case of accidental death or disability.",
      },
    ],
    faqs: [
      {
        question: "Is two wheeler insurance mandatory in India?",
        answer: "Yes, third-party two wheeler insurance is mandatory under the Motor Vehicles Act, 1988. Riding without valid insurance can result in a fine of Rs. 2,000 for the first offence and Rs. 4,000 for subsequent offences, along with possible imprisonment.",
      },
      {
        question: "What is the difference between third-party and comprehensive bike insurance?",
        answer: "Third-party insurance only covers damages or injuries caused to a third party. Comprehensive insurance additionally covers your own bike against accidents, theft, fire, floods, and other natural or man-made calamities, giving you complete protection.",
      },
      {
        question: "How is the premium for two wheeler insurance calculated?",
        answer: "Premium depends on factors like your bike's engine cubic capacity (cc), age of the vehicle, Insured Declared Value (IDV), city of registration, No Claim Bonus (NCB), and any add-ons you choose. Third-party premiums are fixed by IRDAI annually.",
      },
      {
        question: "What is No Claim Bonus (NCB) and how does it benefit me?",
        answer: "NCB is a discount offered on your own damage premium for every claim-free year. It starts at 20% after the first claim-free year and can go up to 50% after five consecutive claim-free years, significantly reducing your renewal premium.",
      },
      {
        question: "Can I transfer my two wheeler insurance when I sell my bike?",
        answer: "Yes, two wheeler insurance can be transferred to the new owner within 14 days of the sale. The seller's NCB can be retained by obtaining an NCB retention letter from the insurer. The new owner must inform the insurer and complete the transfer formalities.",
      },
    ],
    metaTitle: "Best Two Wheeler Insurance in India 2024 | Bike & Scooter Plans",
    metaDescription: "Compare and buy the best two wheeler insurance plans in India. Get instant quotes for bike and scooter insurance from 30+ insurers. Third-party & comprehensive plans. Renew online in 2 minutes.",
    explainerTitle: "Why Two Wheeler Insurance Matters",
    whoShouldBuy: [
      {
        title: "Daily Commuters",
        description: "If you ride your bike or scooter to work daily, comprehensive cover protects you from accident costs and third-party liabilities on busy city roads.",
      },
      {
        title: "New Bike Owners",
        description: "Owners of new or expensive motorcycles benefit greatly from comprehensive cover with zero depreciation add-on to protect their investment.",
      },
      {
        title: "Long-Distance Riders",
        description: "Bikers who frequently travel long distances or tour different states need robust coverage including roadside assistance and engine protection add-ons.",
      },
    ],
    keyFeatures: [
      {
        title: "Third-Party Liability Cover",
        description: "Covers legal liability arising from accidental injury, death, or property damage to a third party.",
      },
      {
        title: "Own Damage Protection",
        description: "Covers your bike against accidental damage, theft, fire, explosion, and natural calamities like floods and earthquakes.",
      },
      {
        title: "Zero Depreciation Cover",
        description: "Add-on that ensures you receive the full repair cost without any depreciation deduction on parts.",
      },
      {
        title: "Roadside Assistance",
        description: "24/7 emergency assistance including towing, minor repairs, fuel delivery, and flat tyre help anywhere in India.",
      },
      {
        title: "Engine & Gearbox Protection",
        description: "Covers repair costs for engine and gearbox damage due to water ingression or consequential damage not covered under standard policy.",
      },
      {
        title: "Consumables Cover",
        description: "Covers the cost of consumables like engine oil, coolant, nuts, bolts, and washers used during repairs after an accident.",
      },
      {
        title: "Personal Accident Cover",
        description: "Mandatory Rs. 15 lakh cover for owner-driver providing compensation for accidental death or permanent disability.",
      },
      {
        title: "No Claim Bonus (NCB)",
        description: "Earn up to 50% discount on own damage premium for every claim-free policy year, rewarding safe riding behaviour.",
      },
    ],
  },

  "family-health": {
    slug: "family-health",
    parentCategory: "health",
    label: "Family Health Insurance",
    route: "/family-health-insurance",
    emoji: "👨‍👩‍👧",
    headline: "Best Family Health Insurance Plans in India 2024",
    subheadline: "One policy covers entire family. Cashless treatment at 14,000+ hospitals. Cover from ₹5 Lakh to ₹1 Crore.",
    color: {
      gradient: "from-green-700 to-green-900",
      accent: "green",
    },
    trustBadges: [
      { label: "14,000+ Cashless Hospitals", icon: "hospital" },
      { label: "Cover up to ₹1 Crore", icon: "shield" },
      { label: "No Sub-limits on Room Rent", icon: "checkmark" },
      { label: "Instant Policy Issuance", icon: "bolt" },
    ],
    highlights: [
      {
        title: "Family Floater Coverage",
        description: "One sum insured shared across all family members — spouse, children, and parents — under a single affordable premium.",
      },
      {
        title: "Restore Benefit",
        description: "Sum insured is automatically restored 100% if exhausted during the policy year, ensuring continuous protection for your family.",
      },
      {
        title: "Maternity & Newborn Cover",
        description: "Plans with maternity benefits cover delivery expenses and include newborn baby cover from day one after the waiting period.",
      },
      {
        title: "Pre-Existing Disease Cover",
        description: "Most plans cover pre-existing diseases after a waiting period of 2–4 years, with some insurers offering PED cover from day one.",
      },
    ],
    faqs: [
      {
        question: "What is a family floater health insurance plan?",
        answer: "A family floater plan is a single health insurance policy that covers the entire family — typically you, your spouse, and dependent children — under one shared sum insured. The premium is lower than buying individual plans for each member, and any member can use the full sum insured in a given policy year.",
      },
      {
        question: "How does sum insured restoration work in family health plans?",
        answer: "Restoration (or recharge) benefit automatically reinstates your sum insured if it is partially or fully exhausted during the policy year due to claims. This is especially useful in family floater plans where multiple members may need hospitalisation in the same year. Most plans restore the sum insured once per year; some offer unlimited restorations.",
      },
      {
        question: "Do family health plans cover maternity expenses?",
        answer: "Yes, many family floater plans offer maternity cover as an in-built or add-on benefit. It typically covers normal and caesarean delivery expenses up to a specified sub-limit. There is usually a waiting period of 9 months to 2 years before the maternity benefit becomes active. Newborn cover from day one is commonly included.",
      },
      {
        question: "Are pre-existing diseases (PED) covered under family health plans?",
        answer: "Pre-existing diseases are covered after a waiting period, which is typically 2 to 4 years depending on the insurer and plan. Some premium plans offer PED coverage from day one or with a shorter waiting period of 12 months. It is important to disclose all PEDs accurately at the time of buying the policy to avoid claim rejections.",
      },
      {
        question: "Can I add a new family member to my existing health insurance policy?",
        answer: "Yes, most family floater plans allow you to add new members — such as a newborn, newly married spouse, or dependent parent — at the time of policy renewal. Some insurers allow mid-term addition of a newborn baby within 90 days of birth. Adding a new member may result in a revised premium based on the new member's age and health status.",
      },
    ],
    metaTitle: "Best Family Health Insurance Plans in India 2024 | Compare & Buy Online",
    metaDescription: "Compare the best family health insurance plans in India 2024. One policy for your entire family with cashless treatment at 14,000+ hospitals. Cover from ₹5 Lakh to ₹1 Crore. Get instant quotes and buy online.",
    explainerTitle: "Why Family Health Insurance is the Smartest Choice for Your Family",
    whoShouldBuy: [
      {
        title: "Young Married Couples",
        description: "Couples planning a family benefit from a floater plan with maternity cover, newborn protection, and affordable premiums while both partners are young and healthy.",
      },
      {
        title: "Families with Dependent Children",
        description: "Parents with young or teenage children need comprehensive coverage for hospitalisation, accidents, and illnesses under one simple policy with a shared high sum insured.",
      },
      {
        title: "Multi-Generational Households",
        description: "Families living with parents or in-laws can include senior members in select family floater plans, consolidating coverage and simplifying claim management for the whole household.",
      },
    ],
    keyFeatures: [
      {
        title: "Shared Sum Insured",
        description: "A single sum insured pool — ranging from ₹5 Lakh to ₹1 Crore — is available to all covered family members, maximising value per rupee of premium paid.",
      },
      {
        title: "Cashless Hospitalisation",
        description: "Access cashless treatment at 14,000+ network hospitals across India. No upfront payment required — the insurer settles the bill directly with the hospital.",
      },
      {
        title: "No Claim Bonus (NCB)",
        description: "Earn a bonus increase in sum insured — typically 10–50% per claim-free year — rewarding healthy families with enhanced coverage at no extra cost.",
      },
      {
        title: "Day Care Procedures",
        description: "Coverage for 500+ day care procedures that require less than 24 hours of hospitalisation, including cataract surgery, chemotherapy, and dialysis.",
      },
      {
        title: "Annual Health Check-ups",
        description: "Complimentary preventive health check-ups for all insured family members every policy year, helping detect health issues early.",
      },
      {
        title: "AYUSH Treatment Cover",
        description: "Coverage for treatments under Ayurveda, Yoga, Unani, Siddha, and Homeopathy (AYUSH) systems, giving your family holistic healthcare options.",
      },
      {
        title: "Domiciliary Hospitalisation",
        description: "Medical expenses incurred at home for conditions requiring hospitalisation but treated at home are covered, ensuring care even when hospital admission is not possible.",
      },
      {
        title: "Critical Illness Add-on",
        description: "Optional critical illness rider provides a lump sum payout on diagnosis of serious conditions such as cancer, heart attack, or stroke, supplementing hospitalisation cover.",
      },
    ],
  },

  "group-health": {
    slug: "group-health",
    parentCategory: "health",
    label: "Employee Group Health Insurance",
    route: "/group-health-insurance",
    emoji: "🏢",
    headline: "Best Group Health Insurance for Employees in India 2024",
    subheadline: "Cover your entire workforce. No waiting period, pre-existing diseases covered from day 1.",
    color: {
      gradient: "from-green-700 to-green-900",
      accent: "green",
    },
    trustBadges: [
      { label: "No Waiting Period", icon: "shield-check" },
      { label: "Pre-existing Diseases Covered", icon: "heart" },
      { label: "Cashless at 10,000+ Hospitals", icon: "building" },
      { label: "Tax Benefit Under 80D", icon: "receipt-tax" },
      { label: "Add Family Members", icon: "users" },
    ],
    highlights: [
      "Covers all employees regardless of age or medical history",
      "Pre-existing diseases covered from day 1 — no exclusions",
      "Zero waiting period for maternity, accidents, and illnesses",
      "Cashless hospitalisation at 10,000+ network hospitals across India",
      "Flexible top-up and super top-up options for employees",
      "Employer premium qualifies as business expense deduction",
    ],
    faqs: [
      {
        question: "What is group health insurance and how is it different from individual health insurance?",
        answer:
          "Group health insurance is a single policy that covers all employees of an organisation under one plan. Unlike individual policies, group health plans typically have no waiting periods, cover pre-existing diseases from day 1, and are negotiated at lower premiums due to the pooled risk of a large group. The employer usually pays the premium, which is also tax-deductible as a business expense.",
      },
      {
        question: "Is there a minimum number of employees required to buy group health insurance?",
        answer:
          "Most insurers in India require a minimum of 7 employees to issue a group health policy. Some insurers and aggregators offer plans starting from as few as 2–5 employees, especially for startups. There is generally no upper limit on group size.",
      },
      {
        question: "Are pre-existing diseases covered under group health insurance?",
        answer:
          "Yes. One of the biggest advantages of group health insurance is that pre-existing diseases (PEDs) are covered from the very first day of the policy. There are no waiting periods for PEDs, maternity, or most other conditions that would otherwise have a 2–4 year waiting period under individual plans.",
      },
      {
        question: "Can employees add their family members to the group health policy?",
        answer:
          "Yes. Most group health policies allow employees to extend coverage to their spouse, dependent children, and sometimes dependent parents at an additional premium. The employer may choose to subsidise the family floater cost partially or fully as part of the employee benefits package.",
      },
      {
        question: "What happens to an employee's coverage when they leave the company?",
        answer:
          "Coverage under the group policy ends when an employee exits the organisation. However, IRDAI regulations allow employees to port their group health coverage to an individual policy within 30 days of leaving without losing their PED waiting period credits. Employees should initiate porting within this window to maintain continuity of coverage.",
      },
    ],
    metaTitle: "Best Group Health Insurance for Employees in India 2024 | Compare Plans",
    metaDescription:
      "Compare top group health insurance plans for employees in India. Pre-existing diseases covered from day 1, zero waiting period, cashless at 10,000+ hospitals. Get quotes for your team today.",
    explainerTitle: "Why Every Business Needs Group Health Insurance",
    whoShouldBuy: [
      {
        persona: "HR Managers",
        reason:
          "Offer a competitive benefits package that attracts and retains top talent. Group health insurance is one of the most valued employee perks and can be set up and managed entirely at the company level.",
      },
      {
        persona: "Startups",
        reason:
          "Even with a small team of 7–20 people, startups can access affordable group health plans with no waiting periods and PED coverage — giving employees enterprise-grade benefits from day one.",
      },
      {
        persona: "SMEs & Growing Businesses",
        reason:
          "Small and medium enterprises can scale their group policy as headcount grows. Premiums are tax-deductible, the admin burden is low, and employees get comprehensive cover without individual underwriting.",
      },
    ],
    keyFeatures: [
      {
        title: "No Waiting Period",
        description:
          "Employees are covered from the first day of the policy. No 30-day initial waiting period, no 2–4 year PED waiting period.",
      },
      {
        title: "Pre-existing Diseases Covered from Day 1",
        description:
          "All pre-existing conditions including diabetes, hypertension, and heart disease are covered immediately — a benefit not available in most individual plans.",
      },
      {
        title: "Cashless Hospitalisation",
        description:
          "Access a network of 10,000+ empanelled hospitals across India for cashless treatment. No upfront payment required at network hospitals.",
      },
      {
        title: "Maternity and Newborn Coverage",
        description:
          "Maternity expenses including delivery, pre- and post-natal care, and newborn baby cover can be included with zero waiting period under group plans.",
      },
      {
        title: "Floater or Individual Sum Insured",
        description:
          "Choose between individual sum insured per employee or a family floater structure that covers the employee's spouse and dependent children under the same policy.",
      },
      {
        title: "Top-up and Super Top-up Options",
        description:
          "Employees can voluntarily enhance their coverage with top-up plans at group-negotiated rates, providing higher sum insured at minimal extra cost.",
      },
      {
        title: "Tax Benefits for Employer",
        description:
          "Premiums paid by the employer are deductible as a business expense under the Income Tax Act. Employees may also claim deductions under Section 80D for their contribution.",
      },
      {
        title: "Wellness and OPD Add-ons",
        description:
          "Many group plans offer optional OPD cover, annual health check-ups, mental wellness support, teleconsultation, and dental and vision benefits as add-ons.",
      },
    ],
  },

  travel: {
    slug: "travel",
    label: "Travel Insurance",
    route: "/travel-insurance",
    emoji: "✈️",
    headline: "Best Travel Insurance Plans in India 2024",
    subheadline: "Trip cancellation, medical emergencies abroad, lost baggage. Domestic & international coverage from ₹500.",
    color: {
      bg: "from-blue-600 to-blue-800",
      accent: "blue",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Travel Insurance",
    },
    trustBadges: ["Medical Cover Abroad", "Trip Cancellation", "24x7 Global Assistance"],
    highlights: [
      {
        icon: "🏥",
        title: "Emergency Medical Cover",
        description: "Cashless hospitalisation and medical evacuation coverage up to ₹1 crore when you fall ill or get injured abroad.",
      },
      {
        icon: "🧳",
        title: "Lost Baggage & Delay",
        description: "Compensation for lost, stolen, or delayed baggage so you're never stranded without essentials.",
      },
      {
        icon: "🚫",
        title: "Trip Cancellation Protection",
        description: "Recover non-refundable travel costs if your trip is cancelled due to illness, natural disaster, or other covered reasons.",
      },
      {
        icon: "🌍",
        title: "Annual Multi-Trip Plans",
        description: "One policy covers unlimited trips in a year — ideal for frequent flyers and business travellers.",
      },
    ],
    faqs: [
      {
        question: "Does travel insurance cover medical emergencies abroad?",
        answer: "Yes. Most travel insurance plans provide emergency medical cover ranging from ₹25 lakh to ₹1 crore for hospitalisation, surgery, and emergency evacuation when you are travelling internationally. Some plans also offer cashless treatment at a network of overseas hospitals.",
      },
      {
        question: "What is trip cancellation cover and when does it apply?",
        answer: "Trip cancellation cover reimburses your non-refundable flight tickets, hotel bookings, and tour packages if you have to cancel your trip due to a covered reason such as sudden illness, death of a close family member, natural calamity at the destination, or civil unrest. You must cancel before departure and submit relevant documentation to claim.",
      },
      {
        question: "Will my travel insurance cover lost or delayed baggage?",
        answer: "Yes. If your checked baggage is lost, stolen, or delayed by the airline beyond a specified number of hours (usually 12 hours), your policy will pay a lump-sum benefit to purchase essential items or compensate for the loss. The payout limit varies by plan, typically between ₹10,000 and ₹1,00,000.",
      },
      {
        question: "Can I claim travel insurance if my visa is rejected?",
        answer: "Visa rejection cover is available as a specific add-on or as part of select comprehensive plans. If your visa application is rejected after you have paid for non-refundable bookings, the insurer will reimburse those costs up to the policy limit. Standard plans do not include this cover by default, so check the policy wording carefully.",
      },
      {
        question: "What is an annual multi-trip travel insurance plan and is it better than a single-trip plan?",
        answer: "An annual multi-trip plan covers all trips you take within a 12-month period, each trip typically capped at 30, 45, or 60 days. It is more cost-effective than buying individual policies for each journey if you travel more than twice a year. Business travellers and frequent holidaymakers generally save 40–60% by opting for an annual plan over multiple single-trip purchases.",
      },
    ],
    metaTitle: "Best Travel Insurance Plans in India 2024 | Compare & Buy Online",
    metaDescription: "Compare travel insurance plans in India starting at ₹500. Get coverage for medical emergencies abroad, trip cancellation, lost baggage, and visa rejection. Buy online instantly.",
    explainerTitle: "What Does Travel Insurance Cover?",
    whoShouldBuy: [
      {
        icon: "✈️",
        title: "International Travellers",
        description: "Anyone travelling outside India needs medical cover — a single hospitalisation abroad can cost lakhs of rupees without insurance.",
      },
      {
        icon: "💼",
        title: "Frequent Business Flyers",
        description: "Professionals who travel multiple times a year benefit most from annual multi-trip plans that provide seamless cover at a lower cost.",
      },
      {
        icon: "🏖️",
        title: "Leisure & Family Holidaymakers",
        description: "Families booking expensive international holidays should protect their non-refundable investments with trip cancellation and medical cover.",
      },
    ],
    keyFeatures: [
      {
        title: "Emergency Medical & Hospitalisation",
        description: "Covers in-patient treatment, surgery, ICU charges, and doctor fees at overseas hospitals up to the sum insured.",
      },
      {
        title: "Medical Evacuation & Repatriation",
        description: "Pays for emergency air evacuation to the nearest adequate hospital or repatriation of mortal remains back to India.",
      },
      {
        title: "Trip Cancellation & Interruption",
        description: "Reimburses non-refundable costs if your trip is cancelled before departure or cut short due to a covered emergency.",
      },
      {
        title: "Baggage Loss, Delay & Damage",
        description: "Compensation for checked baggage that is lost by the carrier, damaged in transit, or delayed beyond 12 hours.",
      },
      {
        title: "Flight Delay & Missed Connection",
        description: "Daily allowance or lump-sum benefit if your flight is delayed by more than 6–8 hours due to airline operational reasons.",
      },
      {
        title: "Personal Accident Cover",
        description: "Lump-sum payout to your nominee in the event of accidental death or permanent disability during the trip.",
      },
      {
        title: "Adventure Sports Cover (Add-on)",
        description: "Optional cover for injuries sustained during adventure activities like skiing, scuba diving, bungee jumping, and trekking.",
      },
      {
        title: "24x7 Global Assistance Helpline",
        description: "Round-the-clock emergency helpline for medical referrals, cashless hospitalisation coordination, and travel assistance anywhere in the world.",
      },
    ],
  },

  home: {
    slug: "home",
    label: "Home Insurance",
    route: "/home-insurance",
    emoji: "🏠",
    headline: "Best Home Insurance Plans in India 2024",
    subheadline: "Protect your home from fire, flood, theft & natural disasters. Structure + contents coverage from ₹2,500/year.",
    color: {
      bg: "from-green-700 to-green-900",
      accent: "green",
      badge: "bg-green-100 text-green-700",
      badgeText: "Home Insurance",
    },
    metaTitle: "Best Home Insurance Plans in India 2024 | Compare & Buy Online",
    metaDescription: "Compare home insurance plans in India. Get coverage for fire, flood, theft, earthquakes & natural disasters. Structure + contents coverage starting from ₹2,500/year. Buy online instantly.",
    trustBadges: [
      { icon: "shield-check", text: "IRDAI Approved Insurers" },
      { icon: "clock", text: "Quick Claim Settlement" },
      { icon: "lock", text: "Secure & Encrypted" },
      { icon: "star", text: "4.8★ Rated Service" },
    ],
    highlights: [
      {
        icon: "home",
        title: "Structure Coverage",
        description: "Covers physical damage to your home's walls, roof, floors, and fixed fittings from fire, floods, and natural disasters.",
      },
      {
        icon: "package",
        title: "Contents Coverage",
        description: "Protects furniture, electronics, appliances, and personal belongings inside your home against theft and damage.",
      },
      {
        icon: "zap",
        title: "Natural Disaster Protection",
        description: "Comprehensive coverage against earthquakes, floods, cyclones, lightning, and other Acts of God.",
      },
      {
        icon: "shield",
        title: "Liability Coverage",
        description: "Third-party liability protection if someone is injured on your property or your home causes damage to neighbours.",
      },
    ],
    explainerTitle: "Why Home Insurance is Essential in India",
    whoShouldBuy: [
      {
        title: "Homeowners",
        description: "Anyone who owns a house, apartment, or villa should insure their property against structural damage, natural disasters, and unforeseen events.",
      },
      {
        title: "Tenants & Renters",
        description: "Renters can protect their personal belongings, furniture, and electronics with contents-only home insurance — even without owning the property.",
      },
      {
        title: "Landlords & Property Investors",
        description: "Protect your rental property investment against structural damage, loss of rent due to damage, and third-party liability claims from tenants.",
      },
    ],
    keyFeatures: [
      {
        title: "Fire & Allied Perils",
        description: "Coverage for damage caused by fire, explosion, lightning, aircraft damage, riots, and strikes.",
      },
      {
        title: "Flood & Water Damage",
        description: "Protection against damage from floods, inundation, storms, cyclones, and water overflow.",
      },
      {
        title: "Theft & Burglary",
        description: "Covers loss of contents and valuables due to housebreaking, theft, and attempted burglary.",
      },
      {
        title: "Earthquake Coverage",
        description: "Structural and contents protection against earthquakes, tremors, and landslides across all seismic zones in India.",
      },
      {
        title: "Electrical & Mechanical Breakdown",
        description: "Optional coverage for damage to home appliances and equipment due to electrical short circuits or mechanical failure.",
      },
      {
        title: "Rent Allowance",
        description: "Covers temporary accommodation costs if your home becomes uninhabitable due to an insured event during repairs.",
      },
      {
        title: "Public Liability",
        description: "Financial protection against legal liability for accidental injury or property damage caused to third parties.",
      },
      {
        title: "Jewellery & Valuables",
        description: "Add-on coverage for gold, jewellery, art, and other high-value items stored at your home up to specified limits.",
      },
    ],
    faqs: [
      {
        question: "What does home insurance cover in India?",
        answer: "Home insurance in India typically covers two components: structure (building) and contents. Structure coverage protects the physical building from fire, floods, earthquakes, cyclones, and other natural disasters. Contents coverage protects furniture, electronics, appliances, and personal belongings from theft, fire, and damage. Many policies also offer liability coverage and add-ons for jewellery or valuables.",
      },
      {
        question: "How much does home insurance cost in India?",
        answer: "Home insurance premiums in India start from as low as ₹2,500 per year depending on the property value, location, coverage type, and chosen add-ons. A standard plan for a mid-range home typically costs between ₹3,000–₹10,000 annually. The premium is calculated based on the sum insured (reinstatement value of the property), not the market value or land price.",
      },
      {
        question: "Is home insurance mandatory in India?",
        answer: "Home insurance is not legally mandatory in India. However, it is highly recommended given India's vulnerability to natural disasters like floods, cyclones, and earthquakes. Some banks and housing finance companies may require you to have home insurance as a condition for a home loan. Even without a loan, the financial protection it provides far outweighs the modest annual premium.",
      },
      {
        question: "What is not covered under home insurance in India?",
        answer: "Home insurance in India typically does not cover: normal wear and tear of the property, pre-existing damage, intentional damage or negligence, war and nuclear risks, damage due to faulty construction, loss of cash or documents, and damage to motor vehicles parked at the property. It is important to read your policy document carefully to understand all exclusions before purchasing.",
      },
      {
        question: "How do I file a home insurance claim in India?",
        answer: "To file a home insurance claim: (1) Notify your insurer immediately after the incident via their helpline or app. (2) Document the damage with photographs and videos. (3) File an FIR with police for theft or burglary cases. (4) Submit the claim form along with supporting documents including photos, purchase bills, and repair estimates. (5) A surveyor appointed by the insurer will assess the damage. (6) Once approved, the claim amount is settled via bank transfer. Most insurers aim to settle claims within 7–30 days.",
      },
    ],
  },

  "term-women": {
    slug: "term-women",
    parentCategory: "term",
    label: "Term Insurance for Women",
    route: "/term-insurance-women",
    emoji: "👩",
    headline: "Best Term Insurance Plans for Women in India 2024",
    subheadline: "Exclusive discounts for non-smoker women. Get ₹1 Crore cover from ₹390/month.",
    color: {
      primary: "#186874",
      secondary: "#d0ecef",
      accent: "#004aad",
      badgeText: "Women's Term Plan",
    },
    trustBadges: ["Upto 20% Cheaper", "Special Women Plans", "Critical Illness Rider"],
    highlights: [
      {
        title: "Lower Premiums for Women",
        description: "Women statistically live longer, so insurers offer up to 20% lower premiums compared to men of the same age and health profile.",
      },
      {
        title: "High Life Cover",
        description: "Secure life cover of ₹50 Lakh to ₹5 Crore to protect your family's financial future against any eventuality.",
      },
      {
        title: "Maternity & Female-Specific Riders",
        description: "Add-on riders covering complications during pregnancy and post-maternity hospitalisation to safeguard mothers.",
      },
      {
        title: "Critical Illness Cover",
        description: "Get lump-sum payouts on diagnosis of female-specific critical illnesses like breast cancer, cervical cancer, and ovarian cancer.",
      },
    ],
    faqs: [
      {
        question: "Why are term insurance premiums lower for women?",
        answer: "Actuarial data shows that women in India have a longer average life expectancy than men. Because the probability of a claim is statistically lower during the policy term, insurers price premiums lower — typically 15–20% cheaper than equivalent plans for men.",
      },
      {
        question: "Can women get term insurance with a maternity rider?",
        answer: "Yes. Several insurers offer optional maternity or female wellness riders that cover pregnancy complications, post-maternity hospitalisation, and related critical conditions. These riders are available as add-ons at an additional premium.",
      },
      {
        question: "What female-specific critical illnesses are covered?",
        answer: "Most women-specific term plans cover critical illnesses such as breast cancer, cervical cancer, ovarian cancer, fallopian tube cancer, uterine/endometrial cancer, and complications related to pregnancy. Always check the exact list in the policy wordings before buying.",
      },
      {
        question: "Is term insurance useful for homemakers or non-working women?",
        answer: "Yes. A homemaker's contribution — childcare, household management, elder care — has significant economic value. Term insurance ensures the family can hire help or manage financially if the homemaker passes away. Many insurers now offer special plans for homemakers based on the spouse's income.",
      },
      {
        question: "At what age should a woman buy term insurance?",
        answer: "The earlier, the better. Buying in your 20s or early 30s locks in the lowest possible premium for the entire policy term. Women who buy before 30 can secure ₹1 Crore cover for as low as ₹390/month. Premiums rise significantly with age, so there is no benefit in delaying.",
      },
    ],
    metaTitle: "Best Term Insurance for Women in India 2024 | Compare & Buy Online",
    metaDescription: "Compare the best term insurance plans for women in India. Enjoy up to 20% lower premiums, maternity riders, and critical illness cover. Get ₹1 Crore cover from ₹390/month. Apply online in minutes.",
    explainerTitle: "Why Women Need Term Insurance",
    whoShouldBuy: [
      {
        title: "Working Women & Breadwinners",
        description: "If your income supports your family, a term plan ensures they maintain their lifestyle and meet financial goals — EMIs, education, retirement — even in your absence.",
      },
      {
        title: "Homemakers",
        description: "The economic value of a homemaker is often underestimated. A term plan helps the family cover the cost of domestic help, childcare, and other services you currently provide.",
      },
      {
        title: "New & Expectant Mothers",
        description: "Motherhood increases financial responsibility. A term plan with a maternity or female wellness rider offers comprehensive protection during and after pregnancy.",
      },
    ],
    keyFeatures: [
      {
        title: "Up to 20% Lower Premiums",
        description: "Women pay significantly less than men for the same sum assured and tenure, making term insurance one of the most affordable financial protection tools available.",
      },
      {
        title: "Sum Assured up to ₹5 Crore",
        description: "Choose a life cover that aligns with your income, liabilities, and future financial goals — from ₹25 Lakh to ₹5 Crore or more.",
      },
      {
        title: "Policy Terms up to 40 Years",
        description: "Lock in low premiums early and stay covered for the long haul — most plans allow coverage up to age 75 or 85.",
      },
      {
        title: "Female-Specific Critical Illness Rider",
        description: "Receive a lump-sum payout on diagnosis of cancers or conditions that disproportionately affect women, without waiting for a death claim.",
      },
      {
        title: "Maternity & Pregnancy Complication Cover",
        description: "Optional riders protect mothers from financial strain caused by pregnancy-related complications, hospitalisation, and post-natal health issues.",
      },
      {
        title: "Waiver of Premium on Disability",
        description: "If you are diagnosed with a critical illness or suffer a permanent disability, future premiums are waived while the policy remains active.",
      },
      {
        title: "Flexible Payout Options",
        description: "Choose between lump-sum death benefit, monthly income payout, or a combination — ensuring your family receives funds in the most useful format.",
      },
      {
        title: "Tax Benefits under Section 80C & 10(10D)",
        description: "Premiums paid qualify for deductions up to ₹1.5 Lakh under Section 80C, and the death benefit received by nominees is fully tax-exempt under Section 10(10D).",
      },
    ],
  },

  "term-rop": {
    slug: "term-rop",
    parentCategory: "term",
    label: "Return of Premium Term Plans",
    route: "/return-of-premium-plans",
    emoji: "💰",
    headline: "Best Return of Premium Term Plans in India 2024",
    subheadline: "Get all your premiums back at maturity if you survive the policy term. Life cover + guaranteed return.",
    color: {
      primary: "#186874",
      secondary: "#d0ecef",
      light: "#eef8f9",
      badge: "#003c8f",
    },
    badgeText: "ROP Term Plan",
    trustBadges: [
      "100% Premium Refund",
      "Life Cover Included",
      "Tax Benefits Under 80C",
    ],
    highlights: [
      "Get 100% of all premiums paid returned if you outlive the policy term",
      "Full life cover throughout the policy tenure for your family's financial security",
      "Premiums qualify for tax deduction under Section 80C up to ₹1.5 lakh per year",
      "Death benefit paid to nominee if insured passes away during the term",
      "Available for policy terms ranging from 10 to 40 years",
      "Option to enhance coverage with critical illness and accidental death riders",
      "Guaranteed maturity benefit — no market risk, no investment risk",
      "Ideal for disciplined savers who want insurance with a built-in savings component",
    ],
    faqs: [
      {
        question: "How does a Return of Premium (ROP) term plan work?",
        answer:
          "A Return of Premium term plan works like a standard term insurance plan during the policy tenure — your family receives the full sum assured as a death benefit if you pass away. The key difference is the maturity benefit: if you survive the entire policy term, the insurer refunds 100% of all the premiums you paid over the years. You essentially get life cover at zero net cost if you outlive the term, though the premiums are higher than a pure term plan.",
      },
      {
        question: "How much more expensive is an ROP plan compared to a pure term plan?",
        answer:
          "ROP term plans typically cost 2x to 3x more than a comparable pure term plan for the same sum assured and tenure. For example, a pure term plan covering ₹1 crore for 30 years might cost around ₹10,000–₹12,000 per year, while the equivalent ROP plan could cost ₹25,000–₹35,000 per year. The higher premium accounts for the insurer's commitment to refund all premiums at maturity. Whether the extra cost is worthwhile depends on your financial goals and alternative investment opportunities.",
      },
      {
        question: "What is the maturity benefit in an ROP term plan?",
        answer:
          "The maturity benefit in an ROP term plan is the total amount of premiums you have paid over the entire policy duration, returned as a lump sum when the policy matures and you are alive. For example, if you paid ₹30,000 per year for 30 years, you receive ₹9,00,000 at the end of the term. This refund is tax-free under Section 10(10D) of the Income Tax Act, provided the premium does not exceed 10% of the sum assured. No bonus or interest is added — it is purely a return of the base premiums paid.",
      },
      {
        question: "What are the tax benefits available on ROP term plans?",
        answer:
          "ROP term plans offer tax benefits at both the investment and maturity stages. The premiums paid are eligible for deduction under Section 80C of the Income Tax Act, up to a maximum of ₹1.5 lakh per financial year, reducing your taxable income. At maturity, the premium refund received is exempt from tax under Section 10(10D), provided the annual premium does not exceed 10% of the sum assured. In the event of a claim, the death benefit received by the nominee is also fully tax-free under Section 10(10D).",
      },
      {
        question: "Should I choose an ROP plan or a pure term plan and invest the difference?",
        answer:
          "This depends on your financial discipline and investment risk appetite. A pure term plan with a 'buy term and invest the difference' strategy often yields better returns if the savings are invested consistently in instruments like mutual funds or PPF. However, ROP plans suit individuals who prefer guaranteed, risk-free return of capital, lack the discipline to invest separately, or want a forced savings mechanism built into their insurance. For most financially disciplined investors with a moderate risk appetite, pure term plus separate investments typically outperforms ROP plans in net wealth creation.",
      },
    ],
    metaTitle: "Best Return of Premium Term Plans in India 2024 | Compare ROP Plans",
    metaDescription:
      "Compare the best Return of Premium (ROP) term insurance plans in India. Get 100% premiums back at maturity, life cover for your family, and tax benefits under 80C. Find the right ROP term plan today.",
    explainerTitle: "What is a Return of Premium Term Plan?",
    whoShouldBuy: [
      {
        title: "Risk-Averse Individuals Seeking Guaranteed Returns",
        description:
          "If you are uncomfortable with market-linked investments and want the certainty of getting your money back, an ROP plan offers a guaranteed, risk-free return of every rupee you paid as premium at the end of the term.",
      },
      {
        title: "Disciplined Savers Who Want Insurance with Built-In Savings",
        description:
          "ROP plans are ideal for those who find it hard to maintain a separate savings or investment habit alongside their insurance. The higher premium acts as a forced savings mechanism that pays off a lump sum at maturity.",
      },
      {
        title: "Individuals in Higher Tax Brackets Maximising 80C Deductions",
        description:
          "Since ROP premiums are higher than pure term premiums, they help you utilise more of your Section 80C deduction limit, while the tax-free maturity benefit under Section 10(10D) makes the effective cost of cover even lower for those in the 30% tax slab.",
      },
    ],
    keyFeatures: [
      {
        title: "100% Premium Refund at Maturity",
        description:
          "Every rupee of premium you pay is returned to you as a lump sum if you survive the policy term, making your life cover effectively free over the long run.",
      },
      {
        title: "Comprehensive Life Cover",
        description:
          "Your family receives the full sum assured — up to ₹10 crore or more — as a tax-free death benefit if you pass away during the policy term.",
      },
      {
        title: "Tax Deduction Under Section 80C",
        description:
          "Annual premiums paid towards an ROP term plan are deductible up to ₹1.5 lakh per year under Section 80C, reducing your overall tax liability.",
      },
      {
        title: "Tax-Free Maturity Benefit Under 10(10D)",
        description:
          "The premium refund received at maturity is completely exempt from income tax under Section 10(10D), subject to the premium-to-sum-assured ratio condition.",
      },
      {
        title: "Flexible Policy Terms",
        description:
          "Choose a policy duration ranging from 10 to 40 years to match your financial planning horizon, retirement goals, or the end of your loan/liability period.",
      },
      {
        title: "Optional Rider Add-Ons",
        description:
          "Enhance your coverage with add-on riders such as critical illness cover, accidental death benefit, waiver of premium on disability, and terminal illness benefit.",
      },
      {
        title: "Guaranteed Benefit — No Market Risk",
        description:
          "Unlike ULIPs or endowment plans, the maturity benefit in an ROP plan is fixed and guaranteed from day one, with no exposure to equity or debt market fluctuations.",
      },
      {
        title: "Joint Life Cover Option",
        description:
          "Select insurers offer a joint life ROP term plan covering both spouses under a single policy, with the benefit payable on the first death and premiums refunded at maturity if both survive.",
      },
    ],
  },

  "guaranteed-return": {
    slug: "guaranteed-return",
    parentCategory: "life",
    label: "Guaranteed Return Plans",
    route: "/guaranteed-return-plans",
    emoji: "📈",
    headline: "Best Guaranteed Return Plans in India 2024",
    subheadline: "Fixed returns of 5–7% p.a. guaranteed by insurer. No market risk. Build corpus with life cover.",
    color: {
      from: "from-green-700",
      to: "to-green-900",
      badgeText: "Guaranteed Return",
    },
    trustBadges: ["Upto 7.4% Returns", "IRDAI Regulated", "Capital Guarantee"],
    highlights: [
      "Returns fixed at policy inception — unaffected by market movements",
      "Life cover included throughout the policy term",
      "Guaranteed maturity benefit payable as lump sum or income",
      "Tax-free maturity proceeds under Section 10(10D)",
      "Premium waiver benefit available on critical illness or disability",
      "Loan facility against policy surrender value",
      "Flexible premium payment terms — single, limited, or regular pay",
      "Suitable for long-term goals: retirement, child education, home purchase",
    ],
    faqs: [
      {
        question: "What is a Guaranteed Return Plan?",
        answer:
          "A Guaranteed Return Plan is a non-linked, non-participating life insurance policy that promises a fixed, pre-determined return on your premiums. The insurer guarantees the maturity benefit at policy inception, so your corpus is completely unaffected by stock market performance. These plans combine a life cover with assured savings.",
      },
      {
        question: "How much return can I expect from a Guaranteed Return Plan?",
        answer:
          "Most guaranteed return plans in India currently offer effective returns in the range of 5% to 7.4% per annum (IRR), depending on the insurer, premium amount, policy term, and premium payment term. The exact guaranteed benefit is specified in your policy document before you sign, so there are no surprises at maturity.",
      },
      {
        question: "Are the maturity proceeds from these plans tax-free?",
        answer:
          "Yes, subject to conditions. If the annual premium does not exceed 10% of the sum assured (or 15% for policies issued before April 2013), the maturity amount is completely exempt from income tax under Section 10(10D) of the Income Tax Act. Premiums paid are also eligible for deduction under Section 80C up to ₹1.5 lakh per year.",
      },
      {
        question: "What happens if I surrender the policy early?",
        answer:
          "Surrendering before the completion of the full policy term results in a Special Surrender Value (SSV) or Guaranteed Surrender Value (GSV), whichever is higher. The payout will be less than the total premiums paid if surrendered in early years. It is advisable to stay invested for the full term to receive the guaranteed maturity benefit.",
      },
      {
        question: "How is a Guaranteed Return Plan different from an FD or PPF?",
        answer:
          "Unlike a bank Fixed Deposit (FD), a Guaranteed Return Plan includes a life cover, so your family receives a death benefit if something happens to you during the policy term. Unlike PPF, the returns and maturity amount are contractually guaranteed from day one and not subject to government revision. However, FDs and PPF offer higher liquidity; Guaranteed Return Plans are best suited for long-horizon, goal-based savings where you do not need frequent access to funds.",
      },
    ],
    metaTitle: "Best Guaranteed Return Plans in India 2024 | Fixed Returns + Life Cover",
    metaDescription:
      "Compare the best Guaranteed Return Plans in India. Get fixed returns of 5–7.4% p.a. with full capital protection and life cover. IRDAI regulated. Tax-free maturity under 10(10D).",
    explainerTitle: "What Are Guaranteed Return Plans?",
    whoShouldBuy: [
      "Risk-averse savers who want predictable, fixed returns without any exposure to equity or debt market volatility",
      "Individuals with long-term financial goals — such as building a retirement corpus, funding a child's higher education, or saving for a home — who need both life protection and assured growth",
      "Taxpayers looking to maximise Section 80C deductions while also securing tax-free maturity income under Section 10(10D)",
    ],
    keyFeatures: [
      {
        title: "100% Capital Guarantee",
        description:
          "Your principal is fully protected. The insurer contractually guarantees the maturity corpus irrespective of market conditions.",
      },
      {
        title: "Fixed IRR up to 7.4% p.a.",
        description:
          "Returns are locked in at policy issuance. You know exactly how much you will receive at maturity before paying the first premium.",
      },
      {
        title: "Built-in Life Cover",
        description:
          "A death benefit is payable to your nominee if you pass away during the policy term, ensuring your family's financial goals are protected.",
      },
      {
        title: "Tax Benefits on Premium & Maturity",
        description:
          "Premiums qualify for Section 80C deduction (up to ₹1.5 lakh p.a.) and maturity proceeds are tax-free under Section 10(10D).",
      },
      {
        title: "Flexible Payout Options",
        description:
          "Choose to receive your maturity benefit as a lump sum, a regular income stream, or a combination of both, based on your financial needs.",
      },
      {
        title: "Multiple Premium Payment Terms",
        description:
          "Pay premiums for the full policy term, a limited period (e.g., 5 or 10 years), or as a single lump-sum premium — offering flexibility to match your cash flow.",
      },
      {
        title: "Loan Against Policy",
        description:
          "After the policy acquires a surrender value (typically after 2–3 years), you can avail a loan of up to 80–90% of the surrender value for liquidity needs without breaking the policy.",
      },
      {
        title: "IRDAI Regulated & Insurer-Backed",
        description:
          "All guaranteed return plans are regulated by the Insurance Regulatory and Development Authority of India (IRDAI), and the guarantee is backed by the insurer's balance sheet — providing a high degree of safety.",
      },
    ],
  },

  "child-savings": {
    slug: "child-savings",
    parentCategory: "life",
    label: "Child Savings Plans",
    route: "/child-savings-plans",
    emoji: "👶",
    headline: "Best Child Insurance & Savings Plans in India 2024",
    subheadline: "Secure your child's future — education, marriage, career goals. Waiver of premium if parent passes away.",
    color: {
      primary: "#15803D",
      secondary: "#DCFCE7",
      accent: "#16A34A",
      badge: "#BBF7D0",
      badgeText: "Child Plan",
    },
    trustBadges: ["Premium Waiver", "Guaranteed Corpus", "Partial Withdrawals"],
    highlights: [
      "Premium waiver benefit if parent/proposer passes away",
      "Guaranteed lump sum at policy maturity for child's goals",
      "Partial withdrawals allowed for education milestones",
      "Life cover for parent throughout the policy term",
      "Tax benefits under Section 80C and Section 10(10D)",
      "Flexible payout options — lump sum or staggered",
    ],
    faqs: [
      {
        question: "What is a child savings plan and how does it work?",
        answer:
          "A child savings plan is a life insurance-cum-investment policy designed to build a corpus for your child's future needs like higher education or marriage. You pay regular premiums over a defined term, and the policy pays out a guaranteed sum at maturity. Crucially, if the parent (proposer) passes away during the policy term, future premiums are waived and the policy continues, ensuring the child still receives the full maturity benefit.",
      },
      {
        question: "What is the premium waiver benefit in child plans?",
        answer:
          "The premium waiver benefit is the most important feature of a child plan. If the parent or proposer dies during the policy term, the insurance company waives all future premiums on behalf of the family. The policy does not lapse — it continues as if premiums were being paid — and the child receives the full maturity corpus as planned. This ensures that the child's financial goals are protected even in the worst-case scenario.",
      },
      {
        question: "At what age should I buy a child savings plan?",
        answer:
          "The earlier you start, the better. Most insurers allow you to buy a child plan when your child is between 0 and 17 years old. Starting early gives you a longer investment horizon, which means lower annual premiums, greater compounding benefit, and a larger corpus at maturity. Ideally, buy when your child is below 5 years old to maximise the accumulation phase before the funds are needed for education.",
      },
      {
        question: "Can I make partial withdrawals from a child savings plan?",
        answer:
          "Many child savings plans, especially ULIPs structured as child plans, allow partial withdrawals after a lock-in period (typically 5 years). These withdrawals can be used to fund intermediate education expenses such as school fees, coaching classes, or overseas admission costs. Traditional endowment-style child plans may not allow partial withdrawals but often provide policy loans against the surrender value instead.",
      },
      {
        question: "Are child savings plans better than mutual funds for saving for a child's education?",
        answer:
          "Child savings plans and mutual funds serve different purposes. Child plans offer built-in life insurance cover for the parent and a guaranteed premium waiver benefit, making them ideal for goal-based protection. Mutual funds offer potentially higher returns and more flexibility but no insurance protection. Many financial planners recommend a combination: a child plan for the protection layer and mutual funds (SIPs) for wealth creation. If the parent has no other term cover, a child plan's waiver benefit is invaluable.",
      },
    ],
    metaTitle: "Best Child Insurance & Savings Plans in India 2024 | Compare & Buy Online",
    metaDescription:
      "Compare the best child savings and insurance plans in India for 2024. Get guaranteed corpus for education and marriage goals, premium waiver on parent's death, partial withdrawal benefits, and tax savings under 80C. Buy online in minutes.",
    explainerTitle: "Why Every Parent Needs a Child Savings Plan",
    whoShouldBuy: [
      {
        title: "Parents of young children (0–10 years)",
        description:
          "Families who want to systematically build a dedicated corpus for their child's higher education or marriage expenses over the next 10–20 years, with the security that the goal won't be derailed if the breadwinner passes away.",
      },
      {
        title: "Single-income households",
        description:
          "Families where only one parent earns income face the highest risk if that earning member passes away. A child plan's premium waiver ensures the child's financial future is fully protected regardless of what happens to the proposer.",
      },
      {
        title: "Parents planning for milestone goals",
        description:
          "Parents who have identified specific financial goals — undergraduate degree, MBA, MBBS, or wedding — and want a structured, disciplined savings vehicle that matures at the right time with a guaranteed payout amount.",
      },
    ],
    keyFeatures: [
      {
        title: "Premium Waiver on Proposer's Death",
        description:
          "If the parent or proposer dies during the policy term, all future premiums are waived by the insurer. The policy continues in force and the child receives the full maturity benefit as originally planned.",
      },
      {
        title: "Guaranteed Maturity Corpus",
        description:
          "Traditional child plans offer a guaranteed sum assured plus accrued bonuses at maturity, giving parents certainty about the exact amount available when the child reaches a key milestone age.",
      },
      {
        title: "Flexible Policy Term",
        description:
          "Policy terms can typically be aligned to specific goals — a 15-year term to fund graduation, or a 20-year term for postgraduate studies. The maturity date is chosen to coincide with when the funds will be needed.",
      },
      {
        title: "Partial Withdrawals for Education Milestones",
        description:
          "ULIP-based child plans allow partial withdrawals after the 5-year lock-in period, enabling parents to access funds for school admission fees, board exam coaching, or other interim educational expenses.",
      },
      {
        title: "Life Cover for the Parent",
        description:
          "The parent (proposer) is insured for the sum assured throughout the policy term. In the event of death, the nominee (child or guardian) receives the death benefit in addition to the premium waiver protection.",
      },
      {
        title: "Tax Benefits Under Section 80C and 10(10D)",
        description:
          "Premiums paid towards a child plan qualify for deduction under Section 80C (up to ₹1.5 lakh per year). The maturity proceeds and death benefits are tax-exempt under Section 10(10D), subject to applicable conditions.",
      },
      {
        title: "Bonus Additions (Traditional Plans)",
        description:
          "Participating traditional child endowment plans accumulate reversionary bonuses declared annually by the insurer. These bonuses compound over the policy term and significantly enhance the final maturity payout.",
      },
      {
        title: "Systematic Savings Discipline",
        description:
          "Regular premium commitments create a forced savings habit, ensuring parents consistently set aside money for their child's future rather than dipping into those funds for other expenses — unlike a regular savings account.",
      },
    ],
  },

  retirement: {
    slug: "retirement",
    parentCategory: "life",
    label: "Retirement Plans",
    route: "/retirement-plans",
    emoji: "🏖️",
    headline: "Best Retirement Plans & Pension Plans in India 2024",
    subheadline: "Guaranteed pension income for life. Annuity plans, NPS-linked, ULIP retirement — all compared.",
    color: {
      primary: "#186874",
      secondary: "#d0ecef",
      accent: "#004aad",
      badge: "#BFDBFE",
    },
    badgeText: "Retirement Plan",
    trustBadges: ["Lifelong Pension", "Tax-Free Corpus", "Flexible Annuity Options"],
    metaTitle: "Best Retirement Plans & Pension Plans in India 2024 | Compare Online",
    metaDescription: "Compare the best retirement and pension plans in India 2024. Find annuity plans, NPS-linked policies, and ULIP retirement plans with guaranteed income for life. Get tax benefits under 80C & 80CCC.",
    explainerTitle: "What Are Retirement Plans?",
    highlights: [
      "Guaranteed lifelong pension income after retirement",
      "Tax deduction up to ₹1.5 lakh under Section 80C",
      "Additional deduction under Section 80CCC for pension plans",
      "Flexible annuity options — immediate or deferred",
      "Corpus remains tax-free upon maturity in many plans",
      "NPS-linked options with market-linked growth potential",
      "Joint life annuity to secure spouse's income",
      "Vesting age flexibility between 45 and 70 years",
    ],
    whoShouldBuy: [
      {
        title: "Salaried Professionals",
        description: "Employees without a defined benefit pension who want guaranteed post-retirement income to replace their monthly salary.",
      },
      {
        title: "Self-Employed & Business Owners",
        description: "Entrepreneurs and freelancers who lack employer-sponsored retirement benefits and need to build their own pension corpus.",
      },
      {
        title: "Early Planners (25–40 Age Group)",
        description: "Young earners who want to leverage compounding over a long horizon to build a substantial retirement fund with minimal monthly contribution.",
      },
    ],
    keyFeatures: [
      {
        title: "Guaranteed Annuity Income",
        description: "Receive a fixed, predictable pension every month, quarter, or year for life, regardless of market conditions.",
      },
      {
        title: "Multiple Annuity Options",
        description: "Choose from life annuity, annuity with return of purchase price, joint life annuity, and increasing annuity options.",
      },
      {
        title: "Tax Benefits Under 80C & 80CCC",
        description: "Premiums paid towards pension plans are eligible for deductions up to ₹1.5 lakh under 80C and an additional ₹50,000 under 80CCD(1B) for NPS.",
      },
      {
        title: "Deferred & Immediate Plans",
        description: "Opt for immediate annuity plans for instant pension payout or deferred annuity plans to accumulate corpus over time.",
      },
      {
        title: "NPS-Linked Growth",
        description: "Market-linked NPS plans offer higher growth potential through equity and debt mix, managed by PFRDA-regulated fund managers.",
      },
      {
        title: "ULIP Retirement Plans",
        description: "Unit-linked retirement plans combine investment growth with insurance cover, allowing fund switches between equity and debt.",
      },
      {
        title: "Flexible Vesting Age",
        description: "Choose your retirement age between 45 and 70 years, giving you full control over when you start receiving your pension.",
      },
      {
        title: "Partial Withdrawal & Commutation",
        description: "Many plans allow up to one-third of the corpus to be withdrawn as a lump sum tax-free at vesting, with the rest converted to annuity.",
      },
    ],
    faqs: [
      {
        question: "What is a retirement plan and how does it work in India?",
        answer: "A retirement plan is a financial product that helps you accumulate a corpus during your working years and converts it into a regular pension (annuity) after you retire. You pay premiums over the policy term, the insurer invests the funds, and at vesting age you receive a guaranteed monthly or annual pension for life. In India, these are offered by life insurance companies and are regulated by IRDAI.",
      },
      {
        question: "What is the difference between a pension plan and NPS?",
        answer: "Pension plans from life insurers are IRDAI-regulated products that offer guaranteed annuity with life insurance cover. NPS (National Pension System) is a PFRDA-regulated, market-linked scheme with lower costs but no guaranteed returns. NPS mandates 40% corpus in annuity at retirement, while insurance pension plans often allow one-third lump-sum withdrawal. Both offer tax benefits but under different sections of the Income Tax Act.",
      },
      {
        question: "How much pension will I receive from a retirement plan?",
        answer: "The pension amount depends on the corpus accumulated, the annuity rate at vesting, and the annuity option chosen. As an example, a corpus of ₹1 crore with an annuity rate of 6% per annum would provide approximately ₹6 lakh per year or ₹50,000 per month. Annuity rates vary by insurer, age at vesting, and type of annuity selected.",
      },
      {
        question: "Are retirement plan payouts tax-free?",
        answer: "The pension (annuity) income received from a retirement plan is taxable as income in the year of receipt. However, up to one-third of the vesting corpus can be commuted (withdrawn as lump sum) tax-free. Premiums paid are eligible for deduction under Section 80C (up to ₹1.5 lakh) and Section 80CCC. For NPS, maturity corpus up to 60% is tax-free if used for annuity purchase.",
      },
      {
        question: "Can I surrender or exit a retirement plan before maturity?",
        answer: "Yes, most retirement plans allow surrender after the lock-in period (typically 3–5 years). However, surrendering early results in a lower surrender value and potential loss of bonuses. The surrender proceeds may be taxable. It is strongly advisable to hold the plan until the vesting date to maximise the retirement corpus and pension benefit. Some plans allow partial withdrawals under specific conditions.",
      },
    ],
  },
};

