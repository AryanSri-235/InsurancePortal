"use client";

import { useState } from "react";

type PlanTab = "individual" | "family" | "senior";

const planTabContent: Record<
  PlanTab,
  { title: string; description: string; premium: string; caveat?: string; highlights: string[] }
> = {
  individual: {
    title: "Individual Health Plan",
    description:
      "Best suited for a single person. Covers hospitalisation expenses, day-care procedures, ambulance charges, and optional OPD or critical illness riders. A straightforward plan with a dedicated sum insured solely for you.",
    premium: "₹5,000–₹15,000/yr",
    highlights: [
      "Dedicated sum insured — not shared",
      "Covers hospitalisation & day-care",
      "OPD add-on available",
      "Critical illness rider optional",
      "No family member claim affecting your cover",
    ],
  },
  family: {
    title: "Family Floater Plan",
    description:
      "One sum insured shared across the entire family — typically 2 adults + 2 children. Cost-effective as you pay a single premium for the whole family, but the pool is shared.",
    premium: "₹12,000–₹30,000/yr",
    caveat:
      "Caveat: If one member exhausts the cover during the year, remaining members have less (or no) cover until renewal.",
    highlights: [
      "Single premium for whole family",
      "Cost-effective vs individual plans",
      "All family members covered under one policy",
      "Maternity add-on available in some plans",
      "Top-up cover recommended as a buffer",
    ],
  },
  senior: {
    title: "Senior Citizen Plan",
    description:
      "Designed for individuals aged 60–80. Higher premiums reflect increased health risks. Dedicated plans like Niva Bupa Senior First and Star Senior Red Carpet offer tailored benefits with specific waiting periods.",
    premium: "₹25,000–₹80,000/yr",
    highlights: [
      "Entry age up to 80 years",
      "Pre-existing disease coverage after waiting period",
      "Co-payment clause common (10–20%)",
      "Annual health check-ups included",
      "Dedicated senior-focused network hospitals",
    ],
  },
};

const waitingPeriodData = [
  {
    insurer: "Star Health",
    ped: "2 years",
    initial: "30 days",
    specific: "1 year",
  },
  {
    insurer: "Niva Bupa",
    ped: "3 years",
    initial: "30 days",
    specific: "2 years",
  },
  {
    insurer: "Care Health",
    ped: "3 years",
    initial: "30 days",
    specific: "2 years",
  },
  {
    insurer: "ICICI Lombard",
    ped: "3 years",
    initial: "30 days",
    specific: "2 years",
  },
];

export default function HealthSpecific() {
  const [activeTab, setActiveTab] = useState<PlanTab>("individual");

  const tabs: { id: PlanTab; label: string }[] = [
    { id: "individual", label: "Individual" },
    { id: "family", label: "Family Floater" },
    { id: "senior", label: "Senior Citizen" },
  ];

  const content = planTabContent[activeTab];

  return (
    <>
      {/* SECTION A — Plan Type Tabs */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Find the Right Health Plan Type
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Different needs call for different structures.
          </p>

          {/* Tab bar */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {content.title}
                </h3>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {content.description}
                </p>
                {content.caveat && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 mb-3">
                    {content.caveat}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-gray-500">Typical premium:</span>
                  <span className="font-semibold text-emerald-700 text-sm bg-emerald-100 px-3 py-1 rounded-full">
                    {content.premium}
                  </span>
                </div>
              </div>
              <div className="md:w-64">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Key Highlights
                </p>
                <ul className="space-y-2">
                  {content.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — Cashless vs Reimbursement */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Cashless vs Reimbursement Claims
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Know how you will receive your claim payout.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cashless */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Cashless Claims</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Get treated at a network hospital and the insurer settles the bill directly with the hospital. You pay only non-covered or co-payment amounts at discharge.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Pros</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex gap-2"><span className="text-emerald-500">+</span>No upfront payment required</li>
                    <li className="flex gap-2"><span className="text-emerald-500">+</span>Fast and hassle-free process</li>
                    <li className="flex gap-2"><span className="text-emerald-500">+</span>Ideal for planned surgeries</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Cons</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex gap-2"><span className="text-red-400">−</span>Limited to network hospitals</li>
                    <li className="flex gap-2"><span className="text-red-400">−</span>Pre-authorisation needed (especially for planned)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reimbursement */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 2 2-2 2 2 2-2 4 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Reimbursement Claims</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Pay all hospital bills yourself first, then submit original documents to your insurer for reimbursement. Available at any hospital — network or non-network.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Pros</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex gap-2"><span className="text-emerald-500">+</span>Freedom to choose any hospital</li>
                    <li className="flex gap-2"><span className="text-emerald-500">+</span>Useful in emergencies at non-network facilities</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Cons</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex gap-2"><span className="text-red-400">−</span>You must arrange funds upfront</li>
                    <li className="flex gap-2"><span className="text-red-400">−</span>Documentation-heavy process</li>
                    <li className="flex gap-2"><span className="text-red-400">−</span>Settlement can take days to weeks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — Pre-existing Disease Waiting Periods */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Pre-Existing Disease Waiting Periods by Top Insurer
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Conditions you had before buying the policy are covered only after these waiting periods.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Insurer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">PED Waiting Period</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Initial Waiting</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Specific Disease Waiting</th>
                </tr>
              </thead>
              <tbody>
                {waitingPeriodData.map((row, i) => (
                  <tr key={row.insurer} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 font-medium text-gray-900">{row.insurer}</td>
                    <td className="py-4 px-6 text-gray-600">{row.ped}</td>
                    <td className="py-4 px-6 text-gray-600">{row.initial}</td>
                    <td className="py-4 px-6 text-gray-600">{row.specific}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Data indicative. Always verify with the insurer at time of purchase.
          </p>
        </div>
      </section>
    </>
  );
}
