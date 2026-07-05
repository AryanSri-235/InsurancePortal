"use client";

import { useState } from "react";

type MotorTab = "car" | "bike";

const motorTabContent: Record<
  MotorTab,
  { title: string; idv: string; premiumRate: string; mandatoryCovers: string[]; notes: string }
> = {
  car: {
    title: "Car Insurance",
    idv: "IDV is calculated as Manufacturer's Listed Price minus depreciation based on vehicle age (5–50%). Accessories are added separately.",
    premiumRate:
      "Third-party premium is IRDAI-mandated based on engine CC. Own damage premium varies by IDV, make/model, and add-ons chosen.",
    mandatoryCovers: [
      "Third-party liability (mandatory by Motor Vehicles Act)",
      "Personal accident cover for owner-driver (₹15 lakh — mandatory)",
      "Own damage if the vehicle has a loan",
    ],
    notes:
      "Cars depreciate faster in the first 3 years. Zero dep add-on is highly recommended for new cars to avoid depreciation deductions at claims.",
  },
  bike: {
    title: "Bike / Two-Wheeler Insurance",
    idv: "IDV calculated similarly — Manufacturer's Listed Price minus depreciation. Two-wheelers depreciate at a higher rate than cars after year 5.",
    premiumRate:
      "Third-party premium is fixed by IRDAI based on engine CC (up to 75cc, 75–150cc, 150–350cc, 350cc+). Own damage premium is lower than cars.",
    mandatoryCovers: [
      "Third-party liability (mandatory by Motor Vehicles Act)",
      "Personal accident cover for owner-rider (₹15 lakh — mandatory)",
      "Long-term TP cover (5 years) for new bikes",
    ],
    notes:
      "Two-wheeler theft is more common. Comprehensive + zero dep is cost-effective for new bikes given the relatively low premium.",
  },
};

const planTypes = [
  {
    id: "tp",
    label: "Third-Party Only",
    tag: null,
    covers: [
      "Damage to third-party vehicle",
      "Third-party property damage",
      "Third-party bodily injury or death",
    ],
    doesNotCover: [
      "Damage to your own vehicle",
      "Theft of your vehicle",
      "Natural calamities",
    ],
    bestFor: "Older vehicles where own damage premium isn't cost-effective",
    price: "₹2,000–₹5,000/yr (IRDAI regulated)",
  },
  {
    id: "od",
    label: "Own Damage Only",
    tag: null,
    covers: [
      "Damage to your own vehicle (accident, fire, flood)",
      "Theft of your vehicle",
      "Natural calamities (flood, earthquake)",
    ],
    doesNotCover: [
      "Third-party damage or injury",
      "Cannot be purchased standalone without TP",
    ],
    bestFor: "Supplementing an existing standalone TP policy",
    price: "Varies by IDV & vehicle age",
  },
  {
    id: "comp",
    label: "Comprehensive",
    tag: "Most Popular",
    covers: [
      "Third-party liability (TP cover included)",
      "Own damage (accident, fire, flood, theft)",
      "Natural calamities",
      "Personal accident for owner-driver",
    ],
    doesNotCover: [
      "Mechanical breakdown (unless add-on)",
      "Drunk driving accidents",
      "Depreciation on parts (unless zero dep add-on)",
    ],
    bestFor: "New and mid-age vehicles — maximum protection",
    price: "₹5,000–₹25,000/yr depending on IDV",
  },
];

const addOns = [
  {
    id: "zerodep",
    name: "Zero Depreciation",
    description: "Full claim without depreciation deduction on parts",
    cost: "+₹1,500–₹3,000/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    id: "engine",
    name: "Engine Protect",
    description: "Covers engine damage due to water ingression or oil leakage",
    cost: "+₹700–₹1,500/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "rsa",
    name: "Roadside Assistance",
    description: "24/7 help for breakdown, towing, flat tyre, fuel delivery",
    cost: "+₹300–₹600/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: "rti",
    name: "Return to Invoice",
    description: "Get original invoice value if vehicle is stolen or total loss",
    cost: "+₹1,000–₹2,500/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "key",
    name: "Key Replacement",
    description: "Covers cost of lost or stolen car keys and locksmith charges",
    cost: "+₹200–₹500/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    id: "cons",
    name: "Consumables Cover",
    description: "Covers nuts, bolts, lubricants, AC gas, screws during repairs",
    cost: "+₹500–₹1,000/yr",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

export default function MotorSpecific() {
  const [activeTab, setActiveTab] = useState<MotorTab>("car");

  const content = motorTabContent[activeTab];

  return (
    <>
      {/* SECTION A — Car vs Bike Tabs */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Car or Bike? Here's What Changes
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Motor insurance has distinct rules depending on your vehicle type.
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {(["car", "bike"] as MotorTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {tab === "car" ? "Car Insurance" : "Bike Insurance"}
              </button>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8 space-y-5">
            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                IDV Calculation
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{content.idv}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                Premium Rates
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{content.premiumRate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                Mandatory Covers
              </p>
              <ul className="space-y-1">
                {content.mandatoryCovers.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-orange-500 flex-shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border border-orange-100 text-sm text-gray-600 italic">
              {content.notes}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — Plan Types Explainer */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Which Plan Type Suits You?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Motor insurance comes in three main structures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planTypes.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border-2 p-6 relative ${
                  plan.tag ? "border-orange-400" : "border-gray-200"
                }`}
              >
                {plan.tag && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.tag}
                  </span>
                )}
                <h3 className="text-base font-bold text-gray-900 mb-4">{plan.label}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Covers</p>
                    <ul className="space-y-1">
                      {plan.covers.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-emerald-500 flex-shrink-0">✓</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Does Not Cover</p>
                    <ul className="space-y-1">
                      {plan.doesNotCover.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span className="text-red-400 flex-shrink-0">✗</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-gray-700">Best for: </span>
                      {plan.bestFor}
                    </p>
                    <p className="text-xs font-semibold text-orange-600">{plan.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C — Add-on Covers Grid */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Popular Add-on Covers
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Small additions that can make a big difference at claim time.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-orange-300 transition-colors"
              >
                <div className="mb-3">{addon.icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{addon.name}</p>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{addon.description}</p>
                <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  {addon.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
