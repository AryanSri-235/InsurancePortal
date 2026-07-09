"use client";

import Link from "next/link";
import { Provider } from "@prisma/client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface Props {
  providers: Provider[];
  category: string;
}

const CAT_ACCENT: Record<string, { border: string; avatarBg: string; avatarText: string; statBg: string; statText: string; btnFrom: string; btnTo: string; shadow: string }> = {
  term:   { border: "hover:border-blue-200 hover:shadow-blue-100/80",   avatarBg: "bg-blue-50 border-blue-100",   avatarText: "text-blue-600",  statBg: "bg-blue-50 border-blue-100",  statText: "text-blue-700",  btnFrom: "from-blue-600",  btnTo: "to-blue-700",  shadow: "shadow-blue-200"  },
  health: { border: "hover:border-green-200 hover:shadow-green-100/80", avatarBg: "bg-green-50 border-green-100", avatarText: "text-green-600", statBg: "bg-green-50 border-green-100", statText: "text-green-700", btnFrom: "from-green-600", btnTo: "to-green-700", shadow: "shadow-green-200" },
  motor:  { border: "hover:border-blue-200 hover:shadow-blue-100/80",   avatarBg: "bg-blue-50 border-blue-100",   avatarText: "text-blue-600",  statBg: "bg-blue-50 border-blue-100",  statText: "text-blue-700",  btnFrom: "from-blue-600",  btnTo: "to-blue-700",  shadow: "shadow-blue-200"  },
  life:   { border: "hover:border-green-200 hover:shadow-green-100/80", avatarBg: "bg-green-50 border-green-100", avatarText: "text-green-600", statBg: "bg-green-50 border-green-100", statText: "text-green-700", btnFrom: "from-green-600", btnTo: "to-green-700", shadow: "shadow-green-200" },
};

const BAR_GRAD: Record<string, string> = {
  term:   "from-blue-500 to-blue-600",
  health: "from-green-500 to-green-600",
  motor:  "from-blue-500 to-blue-600",
  life:   "from-green-500 to-green-600",
};

type SortOption = "popularity" | "csr-desc" | "csr-asc";
type MinCsrOption = 0 | 90 | 95 | 97;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "csr-desc",   label: "Claim Ratio (High→Low)" },
  { value: "csr-asc",    label: "Claim Ratio (Low→High)" },
];

const CSR_PILLS: { value: MinCsrOption; label: string }[] = [
  { value: 0,  label: "All" },
  { value: 90, label: "90%+" },
  { value: 95, label: "95%+" },
  { value: 97, label: "97%+" },
];

export default function ProviderGrid({ providers, category }: Props) {
  const [sort, setSort] = useState<SortOption>("popularity");
  const [minCsr, setMinCsr] = useState<MinCsrOption>(0);

  const catKey = category.replace("-insurance", "");
  const accent = CAT_ACCENT[catKey] ?? CAT_ACCENT.term;
  const bar = BAR_GRAD[catKey] ?? "from-blue-500 to-blue-600";

  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Filter by min claim settlement ratio
    if (minCsr > 0) {
      result = result.filter(
        (p) => p.claimSettlementRatio == null || Number(p.claimSettlementRatio) >= minCsr
      );
    }

    // Sort
    if (sort === "csr-desc") {
      result.sort((a, b) => {
        if (a.claimSettlementRatio == null && b.claimSettlementRatio == null) return 0;
        if (a.claimSettlementRatio == null) return 1;
        if (b.claimSettlementRatio == null) return -1;
        return Number(b.claimSettlementRatio) - Number(a.claimSettlementRatio);
      });
    } else if (sort === "csr-asc") {
      result.sort((a, b) => {
        if (a.claimSettlementRatio == null && b.claimSettlementRatio == null) return 0;
        if (a.claimSettlementRatio == null) return 1;
        if (b.claimSettlementRatio == null) return -1;
        return Number(a.claimSettlementRatio) - Number(b.claimSettlementRatio);
      });
    }
    // "popularity" keeps original order

    return result;
  }, [providers, sort, minCsr]);

  if (providers.length === 0) {
    return (
      <div className="text-center py-16 bg-white border-2 border-gray-100 rounded-3xl">
        <Search className="w-10 h-10 text-gray-300" />
        <p className="text-gray-400 font-medium">No providers found. Please check back soon.</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter / Sort Bar */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min CSR pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Min Claim Ratio
          </span>
          <div className="flex gap-1.5">
            {CSR_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setMinCsr(pill.value)}
                className={`border-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  minCsr === pill.value
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Showing {filteredProviders.length} of {providers.length} providers
        </div>
      </div>

      {/* Grid */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-gray-100 rounded-3xl">
          <Search className="w-10 h-10 text-gray-300" />
          <p className="text-gray-400 font-medium">No providers match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${i * 0.07}s` }}
              className={`animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col ${accent.border}`}
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${bar}`} />

              <div className="p-7 flex flex-col flex-1">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-6">
                  {p.logoUrl ? (
                    <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1 group-hover:scale-105 transition-transform duration-300">
                      <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 ${accent.avatarBg} ${accent.avatarText}`}>
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{p.name}</h3>
                    {p.irdaiRegNo && (
                      <p className="text-xs text-gray-400 mt-0.5">IRDAI Reg: {p.irdaiRegNo}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {p.claimSettlementRatio && (
                    <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Claim Ratio</p>
                      <p className="text-base font-black text-green-700">{p.claimSettlementRatio}%</p>
                    </div>
                  )}
                  {p.solvencyRatio && (
                    <div className={`border-2 rounded-2xl p-3 ${accent.statBg}`}>
                      <p className="text-xs text-gray-400 mb-1">Solvency Ratio</p>
                      <p className={`text-base font-black ${accent.statText}`}>{p.solvencyRatio}x</p>
                    </div>
                  )}
                  {p.networkHospitals && (
                    <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-3 col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Network Hospitals</p>
                      <p className="text-base font-black text-blue-700">{p.networkHospitals.toLocaleString("en-IN")}+</p>
                    </div>
                  )}
                </div>

                {p.tagline && (
                  <p className="text-xs text-gray-400 italic mb-5 border-l-2 border-gray-100 pl-3">&ldquo;{p.tagline}&rdquo;</p>
                )}

                {/* CTA */}
                <Link
                  href={`/${catKey}-insurance/${p.slug}`}
                  className={`btn-shine mt-auto block w-full text-center bg-gradient-to-r ${accent.btnFrom} ${accent.btnTo} text-white py-3 rounded-2xl text-sm font-bold shadow-lg ${accent.shadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
                >
                  View Plans →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
