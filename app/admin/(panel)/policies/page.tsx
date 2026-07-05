"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Policy {
  id: number;
  name: string;
  slug: string;
  category: string;
  premiumStartsFrom: number | null;
  coverAmount: string | null;
  isFeatured: boolean;
  isActive: boolean;
  provider: { name: string };
}

const CATEGORY_OPTIONS = ["term", "health", "motor", "life"];

const CAT_BADGE: Record<string, string> = {
  term:   "bg-blue-50 text-blue-700 border-blue-100",
  health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  motor:  "bg-orange-50 text-orange-700 border-orange-100",
  life:   "bg-violet-50 text-violet-700 border-violet-100",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", search: "", featured: "" });
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    try {
      const res = await fetch(`/api/admin/policies?${params}`);
      const data = await res.json();
      if (data.success) setPolicies(data.data);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search]);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  async function toggleFeatured(id: number, current: boolean) {
    setTogglingId(id);
    try {
      await fetch("/api/admin/policies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, isFeatured: !current } : p));
    } finally {
      setTogglingId(null);
    }
  }

  async function toggleActive(id: number, current: boolean) {
    setTogglingId(id);
    try {
      await fetch("/api/admin/policies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current }),
      });
      setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p));
    } finally {
      setTogglingId(null);
    }
  }

  const displayed = policies.filter(p =>
    filters.featured === "featured"    ? p.isFeatured :
    filters.featured === "not-featured"? !p.isFeatured :
    filters.featured === "inactive"    ? !p.isActive :
    true
  );

  const hasFilters = !!(filters.category || filters.search || filters.featured);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Policies</h1>
          <p className="text-gray-400 text-sm">{displayed.length} of {policies.length} plans</p>
        </div>
        <Link
          href="/admin/policies/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Policy
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Search</span>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or slug..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`${inputCls} pl-9 w-52`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className={inputCls}
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Visibility</span>
            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className={inputCls}
            >
              <option value="">All Policies</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ category: "", search: "", featured: "" })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Policy</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Premium</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cover</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-sm font-medium">No policies found</p>
                      {hasFilters && <p className="text-xs mt-1">Try adjusting your filters</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                displayed.map((policy) => (
                  <tr key={policy.id} className={`hover:bg-gray-50/80 transition-colors ${!policy.isActive ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{policy.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{policy.slug}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 text-sm">{policy.provider.name}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${CAT_BADGE[policy.category] ?? "bg-gray-100 text-gray-600 border-gray-100"}`}>
                        {policy.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 text-sm font-medium">
                      {policy.premiumStartsFrom ? `₹${policy.premiumStartsFrom.toLocaleString("en-IN")}/mo` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-sm">
                      {policy.coverAmount ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleFeatured(policy.id, policy.isFeatured)}
                        disabled={togglingId === policy.id}
                        title={policy.isFeatured ? "Remove from featured" : "Mark as featured"}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all hover:scale-110 disabled:opacity-40 ${policy.isFeatured ? "bg-amber-50 border border-amber-200" : "bg-gray-50 border border-gray-200"}`}
                      >
                        <svg className={`w-3.5 h-3.5 ${policy.isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleActive(policy.id, policy.isActive)}
                        disabled={togglingId === policy.id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${policy.isActive ? "bg-emerald-500" : "bg-gray-200"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${policy.isActive ? "translate-x-4" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/policies/${policy.id}/edit`}
                          className="text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <Link
                          href={`/${policy.category}-insurance/${policy.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
