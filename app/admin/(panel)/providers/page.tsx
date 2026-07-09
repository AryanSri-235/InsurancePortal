"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, ChevronDown, Building2, Shield,
  Star, ExternalLink, BadgeCheck, X,
} from "lucide-react";

const CATEGORY_BADGE: Record<string, string> = {
  term:   "bg-blue-50 text-blue-700 border-blue-200",
  health: "bg-emerald-50 text-emerald-700 border-emerald-200",
  motor:  "bg-orange-50 text-orange-700 border-orange-200",
  life:   "bg-purple-50 text-purple-700 border-purple-200",
  travel: "bg-sky-50 text-sky-700 border-sky-200",
  home:   "bg-amber-50 text-amber-700 border-amber-200",
};

function catBadge(cat: string) {
  return CATEGORY_BADGE[cat.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

interface Policy {
  id: number;
  name: string;
  slug: string;
  category: string;
  subCategory: string | null;
  premiumStartsFrom: number | null;
  isFeatured: boolean;
  isActive: boolean;
}

interface Provider {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  categories: string[];
  isActive: boolean;
  claimSettlementRatio: number | null;
  irdaiRegNo: string | null;
  policies: Policy[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState<Set<number>>(new Set());
  const [catFilter, setCatFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/providers");
    const data = await res.json();
    setProviders(data.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggle(id: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allCategories = Array.from(
    new Set(providers.flatMap(p => p.categories.map(c => c.toLowerCase())))
  ).sort();

  const filtered = providers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      catFilter === "all" ||
      p.categories.map(c => c.toLowerCase()).includes(catFilter);
    return matchesSearch && matchesCat;
  });

  const totalPolicies = providers.reduce((sum, p) => sum + p.policies.length, 0);
  const activePolicies = providers.reduce(
    (sum, p) => sum + p.policies.filter(pol => pol.isActive).length, 0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Providers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {providers.length} providers · {totalPolicies} policies ({activePolicies} active)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search providers…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
        >
          <option value="all">All categories</option>
          {allCategories.map(c => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
        {(search || catFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setCatFilter("all"); }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">No providers found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(provider => {
            const open = expanded.has(provider.id);
            const activePols = provider.policies.filter(p => p.isActive);
            return (
              <div
                key={provider.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* Provider row */}
                <button
                  onClick={() => toggle(provider.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors text-left"
                >
                  {/* Logo / fallback */}
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {provider.logoUrl ? (
                      <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{provider.name}</span>
                      {!provider.isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
                          Inactive
                        </span>
                      )}
                      {provider.claimSettlementRatio && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                          {provider.claimSettlementRatio}% CSR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {provider.categories.map(cat => (
                        <span
                          key={cat}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border capitalize ${catBadge(cat)}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Policy count */}
                  <div className="text-right flex-shrink-0 mr-2">
                    <p className="text-sm font-black text-gray-900">{activePols.length}</p>
                    <p className="text-[10px] text-gray-400">
                      {activePols.length === 1 ? "policy" : "policies"}
                      {provider.policies.length !== activePols.length &&
                        ` (${provider.policies.length - activePols.length} inactive)`}
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Expanded policies */}
                {open && (
                  <div className="border-t border-gray-100">
                    {provider.policies.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-gray-400">No policies for this provider.</p>
                    ) : (
                      <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {["Policy Name", "Category", "Premium from", "Status", ""].map(h => (
                              <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {provider.policies.map(pol => (
                            <tr key={pol.id} className="hover:bg-gray-50/60">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                  <span className="font-medium text-gray-800">{pol.name}</span>
                                  {pol.isFeatured && (
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                                  )}
                                </div>
                                {pol.subCategory && (
                                  <p className="text-[11px] text-gray-400 mt-0.5 ml-5">{pol.subCategory}</p>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${catBadge(pol.category)}`}>
                                  {pol.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">
                                {pol.premiumStartsFrom
                                  ? `₹${pol.premiumStartsFrom.toLocaleString("en-IN")}/mo`
                                  : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-4 py-3">
                                {pol.isActive ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <BadgeCheck className="w-3 h-3" /> Active
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Link
                                  href={`/admin/policies/${pol.id}/edit`}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                                >
                                  Edit <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
