"use client";

import { useState } from "react";
import { Policy, PolicyRider } from "@prisma/client";

type PolicyWithRiders = Policy & { riders: PolicyRider[] };

const TABS = ["Highlights", "Benefits & Exclusions", "Documents", "Claim Process"] as const;
type Tab = (typeof TABS)[number];

export default function PolicyTabs({ policy }: { policy: PolicyWithRiders }) {
  const [activeTab, setActiveTab] = useState<Tab>("Highlights");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Highlights" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Premium from", value: policy.premiumStartsFrom ? `₹${policy.premiumStartsFrom.toLocaleString("en-IN")}/mo` : null },
              { label: "Cover amount", value: policy.coverAmount },
              { label: "Policy term", value: policy.policyTerm },
              { label: "Eligibility age", value: policy.eligibilityAge },
            ]
              .filter((s) => s.value)
              .map((stat) => (
                <div key={stat.label} className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className="font-bold text-gray-900 text-sm">{stat.value}</p>
                </div>
              ))}
          </div>

          {policy.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About this Plan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{policy.description}</p>
            </div>
          )}

          {policy.riders.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Available Riders</h3>
              <div className="space-y-3">
                {policy.riders.map((rider) => (
                  <div key={rider.id} className="flex items-start justify-between border border-gray-100 rounded-xl p-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{rider.name}</p>
                      {rider.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{rider.description}</p>
                      )}
                    </div>
                    {rider.extraPremium && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex-shrink-0 ml-3">
                        +₹{rider.extraPremium}/mo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Benefits & Exclusions" && (
        <div className="space-y-6">
          {policy.keyBenefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {policy.keyBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policy.exclusions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                Exclusions
              </h3>
              <ul className="space-y-2">
                {policy.exclusions.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === "Documents" && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Documents Required</h3>
          {policy.documentsRequired.length > 0 ? (
            <ol className="space-y-3">
              {policy.documentsRequired.map((doc, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 mt-0.5">{doc}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">Please contact our advisor for document requirements.</p>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Document requirements may vary based on your age, health condition, and sum assured. Our advisor will guide you through the process.
            </p>
          </div>
        </div>
      )}

      {activeTab === "Claim Process" && (
        <div className="space-y-4">
          {[
            { step: "01", title: "Notify the Insurer", desc: "Call the insurer's toll-free number or use their app/website to register the claim as soon as possible after the event." },
            { step: "02", title: "Fill Claim Form", desc: "Complete the claim form accurately. Any incorrect or missing information can delay the settlement." },
            { step: "03", title: "Submit Documents", desc: "Submit all required documents — original bills, discharge summary, police FIR (for accidents), or death certificate as applicable." },
            { step: "04", title: "Claim Assessment", desc: "The insurer assigns an assessor who verifies documents and may conduct a field inspection or medical examination." },
            { step: "05", title: "Claim Settlement", desc: "Once approved, the claim amount is transferred to your bank account within 7–30 days, or settled directly with the hospital/garage." },
          ].map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {s.step}
              </div>
              <div className="pb-4 border-b border-gray-100 flex-1 last:border-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
