"use client";

import { Policy, Provider } from "@prisma/client";
import Link from "next/link";
import { useState, useMemo } from "react";

type PolicyWithProvider = Policy & {
  provider: Pick<Provider, "name" | "slug" | "claimSettlementRatio" | "logoUrl">;
};

interface Props {
  policies: PolicyWithProvider[];
  category: string;
  providerName: string;
}

type SortOption = "default" | "premium-asc" | "premium-desc" | "claim-ratio";
type CoverageFilter = "all" | "upto-50l" | "50l-1cr" | "1cr-plus";

function getCoverageTier(coverAmount: string): "upto-50l" | "50l-1cr" | "1cr-plus" {
  const lower = coverAmount.toLowerCase();
  if (lower.includes("crore")) {
    return "1cr-plus";
  }
  if (lower.includes("lakh")) {
    const match = lower.match(/(\d+(?:\.\d+)?)\s*lakh/);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 50) return "50l-1cr";
    }
    return "upto-50l";
  }
  return "upto-50l";
}

function getCategoryGradient(category: string): string {
  switch (category.toLowerCase()) {
    case "term":
      return "from-blue-500 to-indigo-600";
    case "health":
      return "from-emerald-500 to-teal-600";
    case "motor":
      return "from-orange-500 to-amber-600";
    case "life":
      return "from-violet-500 to-purple-600";
    default:
      return "from-blue-500 to-indigo-600";
  }
}

export default function ProviderPlans({ policies, category, providerName }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>("all");

  const filteredAndSorted = useMemo(() => {
    let result = [...policies];

    if (coverageFilter !== "all") {
      result = result.filter((policy) => {
        const tier = getCoverageTier(policy.coverAmount as string);
        return tier === coverageFilter;
      });
    }

    switch (sortBy) {
      case "premium-asc":
        result.sort((a, b) => {
          const aVal = Number(a.premiumStartsFrom) || 0;
          const bVal = Number(b.premiumStartsFrom) || 0;
          return aVal - bVal;
        });
        break;
      case "premium-desc":
        result.sort((a, b) => {
          const aVal = Number(a.premiumStartsFrom) || 0;
          const bVal = Number(b.premiumStartsFrom) || 0;
          return bVal - aVal;
        });
        break;
      case "claim-ratio":
        result.sort((a, b) => {
          const aVal = Number(a.provider.claimSettlementRatio) || 0;
          const bVal = Number(b.provider.claimSettlementRatio) || 0;
          return bVal - aVal;
        });
        break;
      default:
        break;
    }

    return result;
  }, [policies, sortBy, coverageFilter]);

  const gradient = getCategoryGradient(category);

  const coveragePills: { label: string; value: CoverageFilter }[] = [
    { label: "All", value: "all" },
    { label: "Upto ₹50L", value: "upto-50l" },
    { label: "₹50L–₹1Cr", value: "50l-1cr" },
    { label: "₹1Cr+", value: "1cr-plus" },
  ];

  return (
    <section id="plans" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-center">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="premium-asc">Premium Low→High</option>
              <option value="premium-desc">Premium High→Low</option>
              <option value="claim-ratio">Claim Ratio</option>
            </select>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* Coverage Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Coverage:</span>
            <div className="flex gap-1.5 flex-wrap">
              {coveragePills.map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setCoverageFilter(pill.value)}
                  className={`text-sm px-3 py-1 rounded-full border transition-all ${
                    coverageFilter === pill.value
                      ? "bg-blue-600 text-white border-blue-600 font-medium"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Count */}
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-gray-700">{filteredAndSorted.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{policies.length}</span> plans
          </span>
        </div>

        {/* Plans Grid */}
        {filteredAndSorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSorted.map((policy) => (
              <div
                key={policy.id}
                className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all relative flex flex-col"
              >
                {/* Top Gradient Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

                {/* Featured Badge */}
                {(policy as any).isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                      ⭐ Top Pick
                    </span>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Policy Name & Provider Pill */}
                  <div className="mb-4 pr-16">
                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">
                      {policy.name as string}
                    </h3>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {policy.provider.name}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Premium from</p>
                      <p className="text-sm font-bold text-gray-800">
                        {policy.premiumStartsFrom
                          ? `₹${Number(policy.premiumStartsFrom).toLocaleString("en-IN")}/yr`
                          : "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Cover</p>
                      <p className="text-sm font-bold text-gray-800">
                        {(policy.coverAmount as string) || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Claim Ratio</p>
                      <p className="text-sm font-bold text-gray-800">
                        {policy.provider.claimSettlementRatio
                          ? `${policy.provider.claimSettlementRatio}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Policy Term</p>
                      <p className="text-sm font-bold text-gray-800">
                        {(policy as any).policyTerm || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  {Array.isArray((policy as any).keyBenefits) && (policy as any).keyBenefits.length > 0 && (
                    <ul className="mb-4 space-y-1.5">
                      {((policy as any).keyBenefits as string[]).slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 text-emerald-500 flex-shrink-0">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/${category}-insurance/${policy.provider.slug}/${(policy as any).slug}`}
                      className={`flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-xl text-white bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}
                    >
                      Know More →
                    </Link>
                    <button
                      onClick={() => {}}
                      className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No plans match your filters</h3>
            <p className="text-gray-500 mb-6">Try adjusting your coverage filter or sort option.</p>
            <button
              onClick={() => {
                setSortBy("default");
                setCoverageFilter("all");
              }}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
