"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, X, Search, Calendar, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

interface DueDate {
  id: number;
  policyHolderName: string;
  phone: string;
  email: string | null;
  policyNumber: string | null;
  dueDate: string;
  status: string;
  notes: string | null;
  bankName: string | null;
  category: string | null;
}

interface Provider { id: number; name: string; }

const CATEGORY_OPTIONS = ["term", "life", "health", "motor", "car", "two-wheeler", "family-health", "group-health", "travel", "home", "term-women", "return-premium", "guaranteed-return", "child-savings", "retirement"];

const STATUS_BADGE: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-100",
  notified: "bg-blue-50 text-blue-700 border-blue-100",
  renewed:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  lapsed:   "bg-red-50 text-red-600 border-red-100",
};

const STATUS_OPTIONS = ["pending", "notified", "renewed", "lapsed"];

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function DaysCell({ days }: { days: number }) {
  if (days < 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      {Math.abs(days)}d overdue
    </span>
  );
  if (days === 0) return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Today!</span>;
  if (days <= 7)  return <span className="text-xs font-semibold text-red-500">{days}d</span>;
  if (days <= 15) return <span className="text-xs font-semibold text-orange-500">{days}d</span>;
  if (days <= 30) return <span className="text-xs font-semibold text-amber-600">{days}d</span>;
  return <span className="text-xs text-gray-400">{days}d</span>;
}

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function DueDatesPage() {
  const [items, setItems] = useState<DueDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ policyHolderName: "", phone: "", email: "", policyNumber: "", dueDate: "", notes: "", bankName: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "", urgency: "", provider: "", category: "" });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [renewedModal, setRenewedModal] = useState<DueDate | null>(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [renewedSaving, setRenewedSaving] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/due-dates");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  function openForm() {
    setShowForm(true);
    if (providers.length === 0) {
      fetch("/api/admin/providers")
        .then(r => r.json())
        .then(d => d.success && setProviders(d.data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))));
    }
  }

  async function updateStatus(id: number, status: string, currentStatus: string) {
    if (status === "renewed") {
      const item = items.find(i => i.id === id);
      if (item) { setRenewedModal(item); setNewDueDate(""); }
      return;
    }

    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const icons: Record<string, "question" | "warning"> = {
      lapsed: "warning", notified: "question", pending: "question",
    };
    const result = await Swal.fire({
      icon: icons[status] ?? "question",
      title: `Mark as ${label}?`,
      text: `Change status from "${currentStatus}" to "${label}".`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${label}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "lapsed" ? "#DC2626" : "#2563EB",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    await fetch("/api/admin/due-dates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setItems((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
  }

  async function confirmRenewed() {
    if (!renewedModal || !newDueDate) return;
    setRenewedSaving(true);
    try {
      // Mark current entry as renewed
      await fetch("/api/admin/due-dates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: renewedModal.id, status: "renewed" }),
      });
      // Create new pending entry for next cycle with same details
      await fetch("/api/admin/due-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyHolderName: renewedModal.policyHolderName,
          phone: renewedModal.phone,
          email: renewedModal.email ?? "",
          policyNumber: renewedModal.policyNumber ?? "",
          bankName: renewedModal.bankName ?? "",
          category: renewedModal.category ?? "",
          dueDate: newDueDate,
          notes: renewedModal.notes ?? "",
          status: "pending",
        }),
      });
      setRenewedModal(null);
      fetchItems();
    } finally {
      setRenewedSaving(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/due-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ policyHolderName: "", phone: "", email: "", policyNumber: "", dueDate: "", notes: "", bankName: "", category: "" });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const days = getDaysUntil(item.dueDate);
      const matchSearch   = !filters.search   || [item.policyHolderName, item.phone, item.policyNumber ?? ""].some(v => v.toLowerCase().includes(filters.search.toLowerCase()));
      const matchStatus   = !filters.status   || item.status === filters.status;
      const matchProvider = !filters.provider || (item.bankName ?? "").toLowerCase().includes(filters.provider.toLowerCase());
      const matchCategory = !filters.category || item.category === filters.category;
      const matchUrgency  = !filters.urgency  || (
        filters.urgency === "overdue"   ? days < 0 :
        filters.urgency === "critical"  ? days >= 0 && days <= 7 :
        filters.urgency === "soon"      ? days > 7 && days <= 30 :
        filters.urgency === "upcoming"  ? days > 30 : true
      );
      return matchSearch && matchStatus && matchProvider && matchCategory && matchUrgency;
    });
  }, [items, filters]);

  // Derive unique provider names from loaded items for the filter dropdown
  const providerOptions = useMemo(() =>
    [...new Set(items.map(i => i.bankName).filter(Boolean))].sort() as string[],
  [items]);

  const overdueCount = items.filter(i => getDaysUntil(i.dueDate) < 0 && i.status === "pending").length;
  const criticalCount = items.filter(i => { const d = getDaysUntil(i.dueDate); return d >= 0 && d <= 7 && i.status === "pending"; }).length;
  const hasFilters = !!(filters.search || filters.status || filters.urgency || filters.provider || filters.category);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Due Date Tracker</h1>
          <p className="text-gray-400 text-sm">Track policy renewal dates and notify customers</p>
        </div>
        <button
          onClick={openForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* Alert pills */}
      {(overdueCount > 0 || criticalCount > 0) && (
        <div className="flex gap-3 flex-wrap">
          {overdueCount > 0 && (
            <button
              onClick={() => setFilters(f => ({ ...f, urgency: f.urgency === "overdue" ? "" : "overdue", status: "" }))}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${filters.urgency === "overdue" ? "bg-red-600 text-white border-red-600" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {overdueCount} Overdue
            </button>
          )}
          {criticalCount > 0 && (
            <button
              onClick={() => setFilters(f => ({ ...f, urgency: f.urgency === "critical" ? "" : "critical", status: "" }))}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${filters.urgency === "critical" ? "bg-orange-600 text-white border-orange-600" : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> {criticalCount} Due within 7 days
            </button>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-gray-400" />
              New Renewal Entry
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { field: "policyHolderName", label: "Policy Holder Name", req: true, type: "text", placeholder: "Rajesh Kumar" },
              { field: "phone", label: "Phone Number", req: true, type: "tel", placeholder: "98XXXXXXXX" },
              { field: "email", label: "Email Address", req: false, type: "email", placeholder: "optional" },
              { field: "policyNumber", label: "Policy Number", req: true, type: "text", placeholder: "POL-XXXXXXXX" },
              { field: "dueDate", label: "Renewal Date", req: true, type: "date", placeholder: "" },
              { field: "notes", label: "Notes", req: false, type: "text", placeholder: "Any special instructions..." },
            ].map(({ field, label, req, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  {label} {req && <span className="text-red-500">*</span>}
                </label>
                <input
                  required={req}
                  type={type}
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className={inputCls + " w-full"}
                />
              </div>
            ))}

            {/* Provider */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Provider <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className={inputCls + " w-full"}
              >
                <option value="">Select provider...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Insurance Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Insurance Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls + " w-full"}
              >
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Entry"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Search</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Name, phone, or policy #..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`${inputCls} pl-9 w-52`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={inputCls}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Urgency</span>
            <select
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
              className={inputCls}
            >
              <option value="">All</option>
              <option value="overdue">Overdue</option>
              <option value="critical">Due in 7 days</option>
              <option value="soon">Due in 30 days</option>
              <option value="upcoming">Upcoming (30d+)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Provider</span>
            <select
              value={filters.provider}
              onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
              className={inputCls}
            >
              <option value="">All Providers</option>
              {providerOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
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
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", status: "", urgency: "", provider: "", category: "" })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400 self-end pb-2">
            {filtered.length} of {items.length} entries
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider / Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Policy #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Days Left</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <Calendar className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-sm font-medium">
                        {items.length === 0 ? "No entries yet" : "No entries match filters"}
                      </p>
                      {items.length === 0 && (
                        <button
                          onClick={openForm}
                          className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                        >
                          + Add first entry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const days = getDaysUntil(item.dueDate);
                  const isOverdue = days < 0 && item.status === "pending";
                  return (
                    <tr key={item.id} className={`hover:bg-gray-50/80 transition-colors ${isOverdue ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-gray-900">{item.policyHolderName}</div>
                        {item.email && <div className="text-xs text-gray-400 mt-0.5">{item.email}</div>}
                        {item.notes && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]" title={item.notes}>{item.notes}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-gray-700 text-sm">{item.phone}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.bankName && <div className="text-sm text-gray-700 font-medium">{item.bankName}</div>}
                        {item.category && <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded capitalize">{item.category.replace(/-/g, " ")}</span>}
                        {!item.bankName && !item.category && <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">{item.policyNumber ?? "—"}</td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm">
                        {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <DaysCell days={days} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE[item.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value, item.status)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white text-gray-700 transition-colors"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewed modal — capture next due date */}
      {renewedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Mark as Renewed</p>
                <p className="text-xs text-gray-500">{renewedModal.policyHolderName} · {renewedModal.phone}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Enter the next renewal due date. A new pending entry will be created automatically.
              </p>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Next Renewal Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={confirmRenewed}
                  disabled={renewedSaving || !newDueDate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {renewedSaving ? "Saving..." : "Confirm Renewal"}
                </button>
                <button
                  onClick={() => setRenewedModal(null)}
                  disabled={renewedSaving}
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
