"use client";

import { useEffect, useState, useCallback } from "react";

const STATUS_OPTIONS = ["new", "contacted", "converted", "lost"];
const CATEGORY_OPTIONS = ["term", "life", "health", "motor", "car", "two-wheeler", "family-health", "group-health", "travel", "home", "term-women", "return-premium", "guaranteed-return", "child-savings", "retirement"];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  lost: "bg-red-50 text-red-600 border-red-100",
};

const CAT_BADGE: Record<string, string> = {
  term: "bg-blue-50 text-blue-700",
  health: "bg-emerald-50 text-emerald-700",
  motor: "bg-orange-50 text-orange-700",
  life: "bg-violet-50 text-violet-700",
};

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  category: string | null;
  city: string | null;
  leadType: string;
  status: string;
  isReturning: boolean;
  utmSource: string | null;
  createdAt: string;
}

interface Meta { total: number; page: number; pages: number; }

function FilterInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      {children}
    </div>
  );
}

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "", search: "", page: 1 });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    params.set("page", String(filters.page));
    try {
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    } finally {
      setUpdatingId(null);
    }
  }

  const hasFilters = !!(filters.status || filters.category || filters.search);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-400 text-sm">{meta.total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
              Filtered
            </span>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <FilterInput label="Search">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Name, phone, or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className={`${inputCls} pl-9 w-56`}
              />
            </div>
          </FilterInput>

          <FilterInput label="Status">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </FilterInput>

          <FilterInput label="Category">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </FilterInput>

          {hasFilters && (
            <button
              onClick={() => setFilters({ status: "", category: "", search: "", page: 1 })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className={`h-4 bg-gray-100 rounded animate-pulse ${j === 0 ? "w-32" : j === 1 ? "w-28" : "w-20"}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">No leads found</p>
                      {hasFilters && <p className="text-xs mt-1">Try adjusting your filters</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 text-sm">{lead.name}</div>
                      {lead.email && <div className="text-xs text-gray-400 mt-0.5">{lead.email}</div>}
                      {lead.isReturning && (
                        <span className="text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          Returning
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-gray-700 text-sm">{lead.phone}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.category ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CAT_BADGE[lead.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {lead.category}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{lead.utmSource ?? lead.leadType}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE[lead.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white disabled:opacity-50 text-gray-700 transition-colors"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              Page <span className="font-semibold text-gray-600">{meta.page}</span> of {meta.pages} &nbsp;·&nbsp; {meta.total} total
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-white hover:border-gray-300 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={meta.page >= meta.pages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-white hover:border-gray-300 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
