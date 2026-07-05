"use client";

import { useEffect, useState, useMemo } from "react";

interface DueDate {
  id: number;
  policyHolderName: string;
  phone: string;
  email: string | null;
  policyNumber: string | null;
  dueDate: string;
  status: string;
  notes: string | null;
}

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
  const [form, setForm] = useState({ policyHolderName: "", phone: "", email: "", policyNumber: "", dueDate: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "", urgency: "" });

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

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/due-dates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setItems((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
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
        setForm({ policyHolderName: "", phone: "", email: "", policyNumber: "", dueDate: "", notes: "" });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const days = getDaysUntil(item.dueDate);
      const matchSearch = !filters.search || [item.policyHolderName, item.phone, item.policyNumber ?? ""].some(v => v.toLowerCase().includes(filters.search.toLowerCase()));
      const matchStatus = !filters.status || item.status === filters.status;
      const matchUrgency = !filters.urgency || (
        filters.urgency === "overdue"   ? days < 0 :
        filters.urgency === "critical"  ? days >= 0 && days <= 7 :
        filters.urgency === "soon"      ? days > 7 && days <= 30 :
        filters.urgency === "upcoming"  ? days > 30 : true
      );
      return matchSearch && matchStatus && matchUrgency;
    });
  }, [items, filters]);

  const overdueCount = items.filter(i => getDaysUntil(i.dueDate) < 0 && i.status === "pending").length;
  const criticalCount = items.filter(i => { const d = getDaysUntil(i.dueDate); return d >= 0 && d <= 7 && i.status === "pending"; }).length;
  const hasFilters = !!(filters.search || filters.status || filters.urgency);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Due Date Tracker</h1>
          <p className="text-gray-400 text-sm">Track policy renewal dates and notify customers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
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
              ⚠️ {criticalCount} Due within 7 days
            </button>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Renewal Entry
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAdd} className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { field: "policyHolderName", label: "Policy Holder Name", req: true, type: "text", placeholder: "Rajesh Kumar" },
              { field: "phone", label: "Phone Number", req: true, type: "tel", placeholder: "98XXXXXXXX" },
              { field: "email", label: "Email Address", req: false, type: "email", placeholder: "optional" },
              { field: "policyNumber", label: "Policy Number", req: false, type: "text", placeholder: "POL-XXXXXXXX" },
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
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", status: "", urgency: "" })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">
                        {items.length === 0 ? "No entries yet" : "No entries match filters"}
                      </p>
                      {items.length === 0 && (
                        <button
                          onClick={() => setShowForm(true)}
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
                          onChange={(e) => updateStatus(item.id, e.target.value)}
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
    </div>
  );
}
