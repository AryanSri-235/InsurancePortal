"use client";

import { useState } from "react";
import { Receipt, CircleDollarSign, Check } from "lucide-react";

type LifeTab = "whole" | "endowment" | "ulip" | "moneyback" | "child";

const lifeTabs: { id: LifeTab; label: string }[] = [
  { id: "whole", label: "Whole Life" },
  { id: "endowment", label: "Endowment" },
  { id: "ulip", label: "ULIP" },
  { id: "moneyback", label: "Money-Back" },
  { id: "child", label: "Child Plan" },
];

type PlanContent = {
  description: string;
  features: string[];
  bestFor: string;
  examplePlan: string;
};

const lifeTabContent: Record<LifeTab, PlanContent> = {
  whole: {
    description:
      "Whole life insurance provides coverage for your entire lifetime (usually up to age 99 or 100). Premiums are paid for a limited period but the cover continues for life. It combines insurance protection with a savings component that builds cash value over time.",
    features: [
      "Coverage for entire lifetime",
      "Premium payment for limited term (e.g., 20–30 years)",
      "Accumulates cash value over time",
      "Loan facility against policy",
      "Participating plans earn bonuses",
    ],
    bestFor: "Those wanting lifelong cover and a legacy to leave behind",
    examplePlan: "LIC Jeevan Umang, Max Life Whole Life Super",
  },
  endowment: {
    description:
      "An endowment plan is a life insurance policy that doubles as a savings instrument. It pays the sum assured on death during the term, or a maturity benefit if the insured survives the full policy term. A traditional, low-risk way to build a guaranteed corpus.",
    features: [
      "Death + maturity benefit both payable",
      "Guaranteed corpus at maturity",
      "Bonuses declared annually (participating plans)",
      "Eligible for 80C and 10(10D) tax benefits",
      "Lower returns vs market-linked products",
    ],
    bestFor: "Conservative investors who want guaranteed returns along with insurance",
    examplePlan: "LIC New Endowment Plan, HDFC Life Sanchay Plus",
  },
  ulip: {
    description:
      "Unit Linked Insurance Plans (ULIPs) combine life insurance with market-linked investments. Part of your premium goes towards life cover, and the rest is invested in equity, debt, or balanced funds of your choice. Returns are market-linked and not guaranteed.",
    features: [
      "Dual benefit: insurance + investment",
      "Choice of fund allocation (equity/debt/balanced)",
      "Fund switching flexibility",
      "Lock-in period: 5 years",
      "10(10D) exemption on maturity proceeds",
    ],
    bestFor:
      "Investors comfortable with market risk seeking long-term wealth creation alongside cover",
    examplePlan: "HDFC Life Click 2 Wealth, ICICI Pru Signature",
  },
  moneyback: {
    description:
      "Money-back plans provide periodic survival benefits (a percentage of the sum assured) at regular intervals during the policy term, in addition to life cover. You receive liquidity during the term rather than waiting until maturity.",
    features: [
      "Periodic payouts every 3–5 years",
      "Full sum assured paid on death (no deduction for survival benefits paid)",
      "Maturity benefit for remaining amount",
      "Participating plan bonuses",
      "Suitable for irregular income needs",
    ],
    bestFor: "Those who need regular liquidity from their policy — e.g., funding education or milestones",
    examplePlan: "LIC New Money Back Plan, SBI Life Smart Money Back Gold",
  },
  child: {
    description:
      "Child plans are designed to secure a child's future financial goals — education, marriage, career. They include a waiver of premium benefit: if the parent (proposer) passes away, future premiums are waived but the policy continues, and the child receives the benefit at maturity.",
    features: [
      "Waiver of premium on parent's death",
      "Corpus available at child's milestone age",
      "Policy continues even after proposer's death",
      "Can be unit-linked or traditional",
      "Partial withdrawals for education expenses",
    ],
    bestFor: "Parents who want to guarantee a financial corpus for their child regardless of their own survival",
    examplePlan: "HDFC Life YoungStar Udaan, Max Life Shiksha Plus Super",
  },
};

const paymentModes = [
  {
    id: "single",
    label: "Single Pay",
    description:
      "Pay the entire premium as a one-time lump sum at policy inception. The policy remains in force for the full term without any further payments.",
    pros: ["No renewal hassle", "Immediate full coverage", "Good for one-time surplus investment"],
    cons: ["Large upfront outflow", "Less flexible if finances change", "Partial liquidity loss"],
    bestFor: "Those with a surplus lump sum (maturity proceeds, bonus, inheritance)",
  },
  {
    id: "limited",
    label: "Limited Pay (5/7/10 yrs)",
    description:
      "Pay premiums for a limited period (5, 7, or 10 years) while enjoying coverage for the full policy term — which may be 20–40 years. Higher annual premium but shorter commitment.",
    pros: ["Coverage long after premiums stop", "Flexibility after payment period ends", "Reduces long-term obligation"],
    cons: ["Higher annual outflow during payment period", "Not suitable for tight monthly budgets"],
    bestFor: "Working professionals who expect income to peak in a defined window",
  },
  {
    id: "regular",
    label: "Regular Pay",
    description:
      "Pay premiums throughout the full policy term. The lowest annual premium among the three modes, making it easiest on cash flow year by year.",
    pros: ["Lowest annual premium", "Easier on monthly budget", "Most widely available option"],
    cons: ["Ongoing commitment for the full policy term", "Risk of lapsation if income disrupts"],
    bestFor: "Salaried individuals with steady, predictable income looking for the lowest outflow",
  },
];

export default function LifeSpecific() {
  const [activeTab, setActiveTab] = useState<LifeTab>("whole");

  const content = lifeTabContent[activeTab];

  return (
    <>
      {/* SECTION A — Life Plan Sub-type Tabs */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Explore Life Insurance Plan Types
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Life insurance is not one-size-fits-all. Find the structure that matches your goal.
          </p>

          {/* Tab bar */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {lifeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <p className="text-gray-600 mb-5 leading-relaxed">{content.description}</p>
                <div className="bg-white rounded-xl px-5 py-4 border border-green-100 mb-4">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                    Best For
                  </p>
                  <p className="text-sm text-gray-700">{content.bestFor}</p>
                </div>
                <div className="bg-white rounded-xl px-5 py-4 border border-green-100">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                    Example Plan
                  </p>
                  <p className="text-sm text-gray-700">{content.examplePlan}</p>
                </div>
              </div>
              <div className="md:w-64">
                <p className="text-sm font-semibold text-gray-700 mb-3">Key Features</p>
                <ul className="space-y-2">
                  {content.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-3 h-3" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — Premium Payment Modes */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Choose Your Premium Payment Mode
          </h2>
          <p className="text-gray-500 text-center mb-8">
            How you pay premiums can be just as important as what you pay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentModes.map((mode) => (
              <div
                key={mode.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-green-300 transition-colors"
              >
                <h3 className="text-base font-bold text-gray-900 mb-3">{mode.label}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{mode.description}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Pros</p>
                    <ul className="space-y-1">
                      {mode.pros.map((p, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-green-500 flex-shrink-0">+</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Cons</p>
                    <ul className="space-y-1">
                      {mode.cons.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-red-400 flex-shrink-0">−</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Best for: </span>
                      {mode.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C — Tax Benefits Callout */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-12 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Tax Benefits Under Two Sections
          </h2>
          <p className="text-green-200 text-center mb-10">
            Life insurance remains one of the most tax-efficient financial instruments in India.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* 80C Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black">Section 80C</span>
              </div>
              <p className="text-white font-semibold text-lg mb-2">
                Premium Deduction up to ₹1.5 Lakh/year
              </p>
              <p className="text-green-200 text-sm leading-relaxed">
                Premiums paid towards life insurance policies are eligible for deduction under Section 80C of the Income Tax Act, up to a combined limit of ₹1,50,000 per financial year. This reduces your taxable income directly.
              </p>
              <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-xs text-green-200">
                Applicable under Old Tax Regime only. Not available if you opt for the New Tax Regime.
              </div>
            </div>

            {/* 10(10D) Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CircleDollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black">Section 10(10D)</span>
              </div>
              <p className="text-white font-semibold text-lg mb-2">
                Maturity Proceeds Fully Tax-Free
              </p>
              <p className="text-green-200 text-sm leading-relaxed">
                The maturity amount received from a life insurance policy is completely exempt from income tax under Section 10(10D). This includes death benefits received by the nominee, which are always tax-free.
              </p>
              <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-xs text-green-200">
                Conditions apply: annual premium must not exceed 10% of sum assured (policies issued after Apr 2012). ULIPs with premium above ₹2.5L/yr are now taxable.
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/calculator?type=life"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors text-sm"
            >
              Calculate Your Tax Savings
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
