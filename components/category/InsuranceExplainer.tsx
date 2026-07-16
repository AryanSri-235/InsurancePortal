import React from "react";
import { Check, User } from "lucide-react";

interface Props {
  slug: string; // e.g., "term", "car", "travel", etc.
}

const CheckIcon = () => <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />;
const PersonIcon = () => <User className="w-4 h-4" />;

type SlugKey = "term" | "health" | "motor" | "life" | "travel" | "home";

const categoryData: Record<
  SlugKey,
  {
    label: string;
    paragraphs: [string, string, string];
    personas: [string, string, string];
    features: string[];
  }
> = {
  term: {
    label: "Term",
    paragraphs: [
      "Term insurance is the purest and most straightforward form of life insurance available in India. You pay a fixed premium for a defined policy period — say 30 or 40 years — and in the unfortunate event of your death during that period, your nominee receives the entire sum assured as a tax-free lump sum. Because the product has no savings or investment component, the insurer takes on only mortality risk, which is why term plans offer the highest cover at the lowest premiums. A healthy 30-year-old non-smoker can secure a Rs. 1 crore cover for as little as Rs. 700–900 per month.",
      "At maturity, a standard term plan pays nothing — the premium you paid was purely for protection. This is why premiums are dramatically lower than endowment or money-back plans. However, insurers also offer a Return of Premium (ROP) variant where all paid premiums are refunded at policy end if you survive the term, though the premium for ROP is significantly higher than a plain term plan. Most leading insurers also offer optional riders that can be attached to your base policy: Critical Illness (CI) rider pays a lump sum on diagnosis of listed illnesses, Accidental Death Benefit (ADB) rider doubles the payout on accidental death, and Waiver of Premium rider ensures the policy stays active even if you become disabled.",
      "The claim process for term insurance in India has become increasingly streamlined. Upon the policyholder's death, the nominee must submit the death certificate, original policy bond, claim form, and identity proof to the insurer. Most large insurers settle claims within 7–15 working days for non-early claims. The Insurance Regulatory and Development Authority of India (IRDAI) mandates that insurers settle all death claims within 30 days of receiving complete documents. It is advisable to inform your nominee about the policy, keep documents accessible, and ensure the sum assured is adequate — ideally 10–15 times your annual income — to replace your earning capacity for your family.",
    ],
    personas: [
      "Breadwinners with dependants",
      "Home loan borrowers",
      "First-time insurance buyers",
    ],
    features: [
      "Pure death benefit cover — no savings component",
      "Tax deduction on premiums under Section 80C",
      "Riders available: Critical Illness, Accidental Death Benefit",
      "Whole life option available up to age 99",
      "Return of Premium variant for survival benefit",
      "Death by suicide covered after 1 year from policy inception",
      "Nominee receives sum assured completely tax-free",
      "Online purchase discount vs offline buying",
    ],
  },
  health: {
    label: "Health",
    paragraphs: [
      "Health insurance, also called medical insurance, is a contract where the insurer agrees to pay for your hospitalisation and medical expenses in exchange for an annual premium. In India, policies work in two primary modes: cashless and reimbursement. Under cashless hospitalisation, you are admitted to a network hospital empanelled with your insurer, and the hospital directly settles the approved bill with the insurance company — you pay only the non-covered items or any deductible. Under the reimbursement method, you pay the hospital bills out of pocket and then submit the original bills and discharge summary to the insurer for repayment. Cashless is far more convenient and is the preferred mode for planned procedures.",
      "A standard individual health plan covers in-patient hospitalisation (requiring a minimum 24-hour admission), pre-hospitalisation expenses typically for 30 days before admission, and post-hospitalisation expenses for 60 days after discharge. Modern policies also cover day care procedures — over 500 procedures like cataract surgery or chemotherapy that no longer require overnight stays due to medical advances. A family floater plan is a cost-effective option where a single sum insured is shared among all family members. For example, a Rs. 10 lakh floater for a family of four means any one member or a combination of members can claim up to Rs. 10 lakh in a policy year. Floaters are economical when family members are young and healthy.",
      "One of the most valuable features of health insurance is the No-Claim Bonus (NCB), also called Cumulative Bonus. For every claim-free year, the insurer increases your sum insured by 5%–50% depending on the policy, without any additional premium. This means a Rs. 5 lakh policy can grow to Rs. 10 lakh over consecutive claim-free years. IRDAI also mandates that all health policies offer lifelong renewability, which means the insurer cannot refuse to renew your policy simply because you have filed claims or grown older. It is critical to buy health insurance early, before developing pre-existing conditions like diabetes or hypertension, as pre-existing diseases typically attract a 2–4 year waiting period before they are covered.",
    ],
    personas: [
      "Families with young children",
      "Senior citizens",
      "Salaried professionals",
    ],
    features: [
      "Cashless hospitalisation at 5,000+ network hospitals",
      "Pre-hospitalisation cover (30 days) and post-hospitalisation cover (60 days)",
      "No-Claim Bonus increases sum insured each claim-free year",
      "Lifelong renewability guaranteed by IRDAI mandate",
      "Day care procedures (500+) covered without overnight admission",
      "AYUSH treatments (Ayurveda, Yoga, Unani, Siddha, Homeopathy) covered",
      "Annual preventive health check-up included",
      "Domiciliary treatment covered when hospitalisation is not feasible",
    ],
  },
  motor: {
    label: "Motor",
    paragraphs: [
      "Motor insurance in India is governed by the Motor Vehicles Act, 1988, which makes Third-Party (TP) liability insurance mandatory for all vehicles on public roads. A TP policy covers legal liability arising from injury, death, or property damage caused to a third party due to your vehicle. The TP premium is fixed by IRDAI and is non-negotiable across insurers. A Comprehensive policy goes beyond TP cover to also include Own Damage (OD) — compensating you for loss or damage to your own vehicle due to accidents, theft, fire, floods, earthquakes, vandalism, or other perils listed in the policy. Comprehensive plans are strongly recommended for newer or financed vehicles.",
      "A critical concept in motor insurance is Insured Declared Value (IDV), which represents the current market value of your vehicle and acts as the maximum claim amount. IDV depreciates each year as your vehicle ages — a two-year-old car may have an IDV of 80% of the showroom price, dropping further with each renewal. At claim time, standard policies deduct depreciation on replaced parts based on their age. This is where the Zero Depreciation add-on (also called Nil Dep or Bumper-to-Bumper cover) is highly valuable — it ensures you receive the full cost of replaced parts without any depreciation deduction, making it especially worthwhile for new vehicles in the first three to five years.",
      "Motor insurance must be renewed every year without a break to retain your No-Claim Bonus (NCB). NCB is a discount on the OD premium component, starting at 20% after one claim-free year and growing up to 50% after five consecutive claim-free years. A lapse of even a few days forfeits your NCB, so set renewal reminders well in advance. For claims, you can drive or tow your vehicle to a network garage for cashless repairs, where the insurer directly settles the approved repair cost with the garage. Alternatively, you can use a non-network garage and claim reimbursement later. Always file an FIR for theft cases and inform your insurer within the stipulated time — usually 24–48 hours for accidents and immediately for theft.",
    ],
    personas: [
      "New car/bike owners",
      "Vehicle loan holders",
      "Commercial vehicle operators",
    ],
    features: [
      "Third-party liability cover mandatory by law under Motor Vehicles Act",
      "Own damage cover for accidents, theft, fire, and natural calamities",
      "Zero Depreciation add-on for full part replacement value",
      "No-Claim Bonus (NCB) up to 50% discount for claim-free years",
      "24x7 roadside assistance for breakdowns and emergencies",
      "Cashless repairs at 4,000+ network garages nationwide",
      "Personal accident cover for owner-driver (Rs. 15 lakh mandatory)",
      "Engine protection add-on covers hydrostatic lock and consequential damage",
    ],
  },
  life: {
    label: "Life",
    paragraphs: [
      "Life insurance in India broadly covers two categories: traditional plans (endowment, money-back, whole life) and Unit-Linked Insurance Plans (ULIPs). Traditional plans offer a guaranteed or bonus-linked maturity benefit along with life cover, making them a combination of insurance and long-term savings. The premium you pay is partly allocated to life cover and partly invested by the insurer in relatively safe instruments like government bonds. At maturity, you receive the sum assured plus accumulated bonuses — simple reversionary bonus, terminal bonus, or guaranteed additions depending on the policy structure. These plans are particularly suited for conservative investors who want predictability over market-linked returns.",
      "ULIPs, introduced in India in the early 2000s, work differently — after deducting mortality and administration charges, the remaining premium is invested in funds of your choice (equity, debt, or balanced), similar to mutual funds. The fund value fluctuates with market performance, and the maturity benefit is the fund value at the end of the policy term, not a guaranteed amount. ULIPs have a mandatory 5-year lock-in period, after which partial withdrawals are permitted. They also offer flexibility to switch between fund options — say from equity to debt — based on your risk appetite or market conditions, typically four to eight free switches per year. This makes ULIPs attractive for long-term wealth creation with an insurance cushion.",
      "A key distinction between life insurance and term insurance is the maturity benefit. Term plans pay nothing on survival; life insurance plans pay the sum assured plus bonuses or fund value on policy maturity if you outlive the term. Under Section 10(10D) of the Income Tax Act, the maturity proceeds from a life insurance policy are completely tax-free in the hands of the policyholder, subject to the premium not exceeding 10% of the sum assured for policies issued after April 2012. Additionally, policyholders can avail a loan against a traditional life insurance policy — typically up to 80–90% of the surrender value — providing liquidity without terminating the policy. This dual benefit of long-term savings and life protection makes life insurance an integral part of comprehensive financial planning.",
    ],
    personas: [
      "Long-term wealth builders",
      "Tax planning individuals",
      "Parents planning child's future",
    ],
    features: [
      "Life cover plus savings component in a single integrated plan",
      "Maturity benefit paid on policy completion if policyholder survives",
      "Tax-free maturity proceeds under Section 10(10D) of Income Tax Act",
      "Multiple fund options in ULIPs: equity, debt, and balanced",
      "Partial withdrawal allowed after 5-year lock-in period (ULIPs)",
      "Loan against policy available up to 90% of surrender value",
      "Guaranteed additions in traditional endowment plans",
      "Reversionary and terminal bonus in participating (with-profits) plans",
    ],
  },
  travel: {
    label: "Travel",
    paragraphs: [
      "Travel insurance is a vital protection plan designed to cover financial losses and medical emergencies while traveling domestically or internationally. Whether you are taking a short holiday or a long business trip, travel insurance provides coverage for emergency medical treatment, hospitalisation, and medical evacuation abroad, where healthcare costs can be extremely high. It ensures you have 24/7 global assistance for peace of mind.",
      "Beyond medical emergencies, travel insurance protects against travel inconveniences such as trip cancellation, trip interruption, flight delays, and missed connections. If your checked baggage is lost, stolen, or delayed by the airline, the policy offers compensation to buy essentials. Some plans also offer visa rejection cover, reimbursing non-refundable ticket and hotel bookings if your visa is not approved.",
      "Choosing the right travel insurance plan depends on your destination, travel frequency, and age. For frequent flyers, an annual multi-trip plan is highly cost-effective as it covers unlimited trips in a 12-month period. For single trips, individual or family travel policies are available. Make sure to check the coverage limits, network hospitals, and exclusions like adventure sports or pre-existing diseases before purchasing."
    ],
    personas: [
      "International travellers",
      "Frequent business flyers",
      "Leisure & family holidaymakers"
    ],
    features: [
      "Emergency medical & hospitalisation cover abroad",
      "Medical evacuation and repatriation back to India",
      "Trip cancellation and interruption cover",
      "Baggage loss, delay, and damage coverage",
      "Flight delay & missed connection allowance",
      "Personal accident cover during the trip",
      "24x7 global assistance helpline"
    ]
  },
  home: {
    label: "Home",
    paragraphs: [
      "Home insurance is a protective policy that safeguards your physical home structure and its contents from damages caused by natural disasters, fire, theft, and other unforeseen events. In India, home insurance is crucial due to the vulnerability to earthquakes, floods, and cyclones. Structure insurance covers the cost of repairing or rebuilding your home's walls, roof, and fixed fittings, while contents insurance protects furniture, electronics, and personal belongings.",
      "For homeowners, a comprehensive structure and contents policy provides complete peace of mind. Tenants can opt for contents-only coverage to protect their personal belongings without paying for the structural insurance. The premium is calculated based on the reinstatement cost of the building (the cost to rebuild) rather than the market value or land price, making home insurance surprisingly affordable in India.",
      "Filing a home insurance claim requires documenting the damage with photos or videos, filing an FIR for theft or burglary, and notifying your insurer immediately. A surveyor will assess the damage to process the claim. Exclusions typically include normal wear and tear, pre-existing damage, and war risks. Adding optional covers like electrical breakdown or loss of rent ensures comprehensive security."
    ],
    personas: [
      "Homeowners & property owners",
      "Tenants & renters",
      "Landlords & real estate investors"
    ],
    features: [
      "Structure coverage for fire & allied perils",
      "Contents coverage for furniture & electronics",
      "Natural disaster protection (floods, earthquakes)",
      "Theft, burglary, and housebreaking cover",
      "Public liability cover for third-party injury",
      "Rent allowance during home repair period",
      "Electrical & mechanical breakdown add-on"
    ]
  }
};

// Maps subcategories and long names to one of our core explainer categories
function resolveExplainerSlug(slug: string): SlugKey {
  const map: Record<string, SlugKey> = {
    // Term
    "term": "term",
    "term-women": "term",
    "term-rop": "term",
    
    // Health
    "health": "health",
    "family-health": "health",
    "group-health": "health",
    
    // Motor
    "motor": "motor",
    "car": "motor",
    "two-wheeler": "motor",
    
    // Life
    "life": "life",
    "guaranteed-return": "life",
    "child-savings": "life",
    "retirement": "life",
    
    // Travel
    "travel": "travel",
    
    // Home
    "home": "home"
  };
  return map[slug] ?? "term";
}

export default function InsuranceExplainer({ slug }: Props) {
  const resolvedSlug = resolveExplainerSlug(slug);
  const data = categoryData[resolvedSlug];

  const { label, paragraphs, personas, features } = data;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">
            {label} Insurance
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Is{" "}
            <span className="text-blue-600">{label}</span> Insurance?
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT column */}
          <div className="flex flex-col gap-6">
            {/* Explainer paragraphs */}
            <div className="flex flex-col gap-5">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            {/* Who should buy? */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Who Should Buy?
              </h3>
              <div className="flex flex-wrap gap-3">
                {personas.map((persona, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium"
                  >
                    <PersonIcon />
                    <span>{persona}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div>
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Key Features
              </h3>
              <ul className="flex flex-col gap-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
