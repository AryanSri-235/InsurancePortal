"use client";

import { useState } from "react";
import { Heart, ShieldCheck, CircleDollarSign, Check, BadgeCheck } from "lucide-react";

const coverageOptions = [
  {
    id: "25L",
    label: "25 Lakh",
    premium: "₹300/mo",
    useCase: "Suitable for income ₹3–5 LPA",
  },
  {
    id: "50L",
    label: "50 Lakh",
    premium: "₹450/mo",
    useCase: "Suitable for income ₹5–8 LPA",
  },
  {
    id: "1Cr",
    label: "1 Crore",
    premium: "₹600/mo",
    useCase: "Suitable for income ₹8–15 LPA",
  },
  {
    id: "2Cr",
    label: "2 Crore",
    premium: "₹1,050/mo",
    useCase: "Suitable for income ₹15–25 LPA",
  },
  {
    id: "5Cr",
    label: "5 Crore",
    premium: "₹2,400/mo",
    useCase: "Suitable for income ₹25 LPA+",
  },
];

const riders = [
  {
    id: "ci",
    title: "Critical Illness Rider",
    description:
      "Get lump sum payout on 34 critical illnesses. Extra: ~₹150/mo",
    icon: <Heart className="w-6 h-6 text-blue-500" />,
    extra: "~₹150/mo",
  },
  {
    id: "adb",
    title: "Accidental Death Benefit",
    description:
      "2× sum assured on accidental death. Extra: ~₹80/mo",
    icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
    extra: "~₹80/mo",
  },
  {
    id: "wop",
    title: "Waiver of Premium",
    description:
      "Future premiums waived on disability. Extra: ~₹60/mo",
    icon: <CircleDollarSign className="w-6 h-6 text-blue-500" />,
    extra: "~₹60/mo",
  },
];

const comparisonRows = [
  {
    feature: "Premium Cost",
    pureTerm: "Low (₹600/mo for 1Cr)",
    rop: "Higher (₹1,800/mo for 1Cr)",
  },
  {
    feature: "Maturity Benefit",
    pureTerm: "None",
    rop: "Full premium returned",
  },
  {
    feature: "Tax Benefit",
    pureTerm: "80C on premium",
    rop: "80C on premium",
  },
  {
    feature: "Best For",
    pureTerm: "Pure protection seekers",
    rop: "Those wanting money back",
  },
  {
    feature: "Our Recommendation",
    pureTerm: <><BadgeCheck className="w-4 h-4 inline" /> Recommended for most</>,
    rop: "Only if budget allows",
  },
];

export default function TermSpecific() {
  const [selectedCover, setSelectedCover] = useState("1Cr");
  const [selectedRiders, setSelectedRiders] = useState<Set<string>>(new Set());

  const toggleRider = (id: string) => {
    setSelectedRiders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {/* SECTION A — Coverage Amount Options */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Choose Your Coverage Amount
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Select a cover amount that suits your income and lifestyle.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {coverageOptions.map((opt) => {
              const isSelected = selectedCover === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedCover(opt.id)}
                  className={`flex-shrink-0 border-2 rounded-2xl p-5 cursor-pointer text-left transition-all min-w-[160px] ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <p
                    className={`text-xl font-black mb-1 ${
                      isSelected ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Est. premium from
                  </p>
                  <p
                    className={`text-base font-bold mb-3 ${
                      isSelected ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {opt.premium}
                  </p>
                  <p className="text-xs text-gray-400">{opt.useCase}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION B — Rider Options */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Enhance Your Cover with Riders
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Optional add-ons to strengthen your term policy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {riders.map((rider) => {
              const isChecked = selectedRiders.has(rider.id);
              return (
                <div
                  key={rider.id}
                  onClick={() => toggleRider(rider.id)}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    isChecked
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{rider.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {rider.title}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {rider.description}
                        </p>
                        <span className="inline-block text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          Extra: {rider.extra}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex-shrink-0 w-5 h-5 mt-1 rounded border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C — Pure Term vs Return of Premium */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Pure Term vs Return of Premium: Which is Right for You?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Understand the key differences before you decide.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 w-1/3">
                    Feature
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Pure Term
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Return of Premium (ROP)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-4 px-6 font-medium text-gray-700">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{row.pureTerm}</td>
                    <td className="py-4 px-6 text-gray-600">{row.rop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
