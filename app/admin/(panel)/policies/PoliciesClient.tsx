"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, X, Search, ShieldCheck, Star, Pencil, ExternalLink, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface Policy {
  id: number;
  name: string;
  slug: string;
  category: string;
  providerId: number;
  premiumStartsFrom: number | null;
  coverAmount: string | null;
  isFeatured: boolean;
  isActive: boolean;
  provider: { name: string };
}

const CATEGORY_OPTIONS: Record<string, string> = {
  term:              "Term Insurance",
  life:              "Life Insurance",
  health:            "Health Insurance",
  motor:             "Motor Insurance",
  travel:            "Travel Insurance",
  home:              "Home Insurance",
  "personal-accident": "Personal Accident",
  fire:              "Fire Insurance",
  marine:            "Marine Insurance",
  pension:           "Pension / Retirement",
  commercial:        "Commercial / Business",
  crop:              "Crop Insurance",
  cyber:             "Cyber Insurance",
};

const CAT_BADGE: Record<string, string> = {
  term:              "bg-blue-50 text-blue-700 border-blue-100",
  life:              "bg-violet-50 text-violet-700 border-violet-100",
  health:            "bg-emerald-50 text-emerald-700 border-emerald-100",
  motor:             "bg-orange-50 text-orange-700 border-orange-100",
  travel:            "bg-sky-50 text-sky-700 border-sky-100",
  home:              "bg-amber-50 text-amber-700 border-amber-100",
  "personal-accident": "bg-red-50 text-red-700 border-red-100",
  fire:              "bg-rose-50 text-rose-700 border-rose-100",
  marine:            "bg-cyan-50 text-cyan-700 border-cyan-100",
  pension:           "bg-teal-50 text-teal-700 border-teal-100",
  commercial:        "bg-indigo-50 text-indigo-700 border-indigo-100",
  crop:              "bg-lime-50 text-lime-700 border-lime-100",
  cyber:             "bg-purple-50 text-purple-700 border-purple-100",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function PoliciesClient({ role }: { role: string }) {
  const isRam = role === "ram";

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    providerId: "",
    isActive: "",
    isFeatured: "",
    minPremium: "",
    maxPremium: "",
  });
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/providers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProviders(data.data.map((p: any) => ({ id: p.id, name: p.name })));
        }
      })
      .catch((err) => console.error("Failed to fetch providers:", err));
  }, []);

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

  async function deletePolicy(id: number, name: string) {
    const confirmed = await Swal.fire({
      title: `Delete policy "${name}"?`,
      text: "This action cannot be undone and will dissociate this policy from existing leads and due dates.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
      reverseButtons: true,
    });
    if (!confirmed.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/policies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPolicies((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({ icon: "success", title: "Policy deleted", timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete policy" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong" });
    }
  }

  const displayed = policies.filter((p) => {
    if (filters.providerId && p.providerId !== parseInt(filters.providerId)) {
      return false;
    }
    if (filters.isActive === "active" && !p.isActive) {
      return false;
    }
    if (filters.isActive === "inactive" && p.isActive) {
      return false;
    }
    if (filters.isFeatured === "featured" && !p.isFeatured) {
      return false;
    }
    if (filters.isFeatured === "not-featured" && p.isFeatured) {
      return false;
    }
    if (filters.minPremium && (p.premiumStartsFrom === null || p.premiumStartsFrom < parseFloat(filters.minPremium))) {
      return false;
    }
    if (filters.maxPremium && (p.premiumStartsFrom === null || p.premiumStartsFrom > parseFloat(filters.maxPremium))) {
      return false;
    }
    return true;
  });

  const hasFilters = !!(
    filters.category ||
    filters.search ||
    filters.providerId ||
    filters.isActive ||
    filters.isFeatured ||
    filters.minPremium ||
    filters.maxPremium
  );
  const colSpan = isRam ? 7 : 8;

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
          <Plus className="w-4 h-4" />
          Add Policy
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Search</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              {Object.entries(CATEGORY_OPTIONS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Provider</span>
            <select
              value={filters.providerId}
              onChange={(e) => setFilters({ ...filters, providerId: e.target.value })}
              className={inputCls}
            >
              <option value="">All Providers</option>
              {providers.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</span>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className={inputCls}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {!isRam && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Featured</span>
              <select
                value={filters.isFeatured}
                onChange={(e) => setFilters({ ...filters, isFeatured: e.target.value })}
                className={inputCls}
              >
                <option value="">All</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured Only</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Min Premium</span>
            <input
              type="number"
              placeholder="Min..."
              value={filters.minPremium}
              onChange={(e) => setFilters({ ...filters, minPremium: e.target.value })}
              className={`${inputCls} w-24`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Max Premium</span>
            <input
              type="number"
              placeholder="Max..."
              value={filters.maxPremium}
              onChange={(e) => setFilters({ ...filters, maxPremium: e.target.value })}
              className={`${inputCls} w-24`}
            />
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ category: "", search: "", providerId: "", isActive: "", isFeatured: "", minPremium: "", maxPremium: "" })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
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
                {!isRam && (
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                )}
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: colSpan }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={colSpan}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <ShieldCheck className="w-8 h-8 mb-2 opacity-40" />
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
                    {!isRam && (
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => toggleFeatured(policy.id, policy.isFeatured)}
                          disabled={togglingId === policy.id}
                          title={policy.isFeatured ? "Remove from featured" : "Mark as featured"}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all hover:scale-110 disabled:opacity-40 ${policy.isFeatured ? "bg-amber-50 border border-amber-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <Star className={`w-3.5 h-3.5 ${policy.isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                        </button>
                      </td>
                    )}
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
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Link>
                        {role === "superadmin" && (
                          <button
                            onClick={() => deletePolicy(policy.id, policy.name)}
                            className="text-xs font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-white hover:border-red-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            title="Delete Policy"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                        <Link
                          href={`/${policy.category}-insurance/${policy.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
