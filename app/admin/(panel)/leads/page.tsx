"use client";

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Search, X, Frown, CheckCircle } from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "converted", "lost"];

interface RenewalModal { leadId: number; name: string; phone: string; }
interface Provider { id: number; name: string; }

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
  const [renewalModal, setRenewalModal] = useState<RenewalModal | null>(null);
  const [renewalDate, setRenewalDate] = useState("");
  const [renewalPolicyNum, setRenewalPolicyNum] = useState("");
  const [renewalProvider, setRenewalProvider] = useState("");
  const [renewalCategory, setRenewalCategory] = useState("");
  const [renewalSaving, setRenewalSaving] = useState(false);
  const [renewalError, setRenewalError] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);

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

  async function updateStatus(id: number, status: string, lead?: Lead) {
    if (status === "converted" && lead) {
      setRenewalModal({ leadId: id, name: lead.name, phone: lead.phone });
      setRenewalDate("");
      setRenewalPolicyNum("");
      setRenewalProvider("");
      setRenewalCategory(lead.category ?? "");
      setRenewalError("");
      if (providers.length === 0) {
        fetch("/api/admin/providers")
          .then((r) => r.json())
          .then((d) => d.success && setProviders(d.data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))));
      }
      return;
    }

    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const result = await Swal.fire({
      icon: status === "lost" ? "warning" : "question",
      title: `Mark as ${label}?`,
      text: lead ? `Update "${lead.name}" status to ${label}.` : `Change lead status to ${label}.`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${label}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "lost" ? "#DC2626" : "#2563EB",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

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

  async function confirmConvert() {
    if (!renewalModal) return;
    setRenewalError("");
    if (!renewalDate)            { setRenewalError("Please select a renewal date."); return; }
    if (!renewalPolicyNum.trim()) { setRenewalError("Please enter the policy number."); return; }
    if (!renewalProvider)         { setRenewalError("Please select a provider."); return; }
    if (!renewalCategory)         { setRenewalError("Please select an insurance category."); return; }

    setRenewalSaving(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: renewalModal.leadId,
          status: "converted",
          renewalDate,
          policyNumber: renewalPolicyNum.trim(),
          providerName: renewalProvider,
          category: renewalCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setRenewalError(data.error ?? "Something went wrong."); return; }
      setLeads((prev) => prev.map((l) => l.id === renewalModal.leadId ? { ...l, status: "converted" } : l));
      setRenewalModal(null);
    } finally {
      setRenewalSaving(false);
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              <X className="w-3.5 h-3.5" />
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
                      <Frown className="w-8 h-8 mb-2 opacity-40" />
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
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                      <div className="text-gray-700">{new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</div>
                      <div className="text-gray-400 mt-0.5">{new Date(lead.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStatus(lead.id, e.target.value, lead)}
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

      {/* Renewal Modal */}
      {renewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Mark as Converted</p>
                <p className="text-xs text-gray-500">{renewalModal.name} · {renewalModal.phone}</p>
              </div>
            </div>
            <div className="p-5 space-y-3.5">
              {renewalError && (
                <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium">
                  {renewalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Renewal Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Policy Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="POL-XXXXXXXX"
                  value={renewalPolicyNum}
                  onChange={(e) => setRenewalPolicyNum(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Provider <span className="text-red-500">*</span>
                </label>
                <select
                  value={renewalProvider}
                  onChange={(e) => setRenewalProvider(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-gray-700"
                >
                  <option value="">Select provider...</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Insurance Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={renewalCategory}
                  onChange={(e) => setRenewalCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-gray-700"
                >
                  <option value="">Select category...</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={confirmConvert}
                  disabled={renewalSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {renewalSaving ? "Saving..." : "Convert"}
                </button>
                <button
                  onClick={() => setRenewalModal(null)}
                  disabled={renewalSaving}
                  className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
