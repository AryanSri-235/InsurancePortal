"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, X, Search, Calendar, AlertTriangle, Bell, Download, RefreshCw, History } from "lucide-react";
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

const CATEGORY_OPTIONS = ["term", "life", "health", "motor", "car", "two-wheeler", "family-health", "group-health", "travel", "home", "term-women", "term-rop", "guaranteed-return", "child-savings", "retirement"];

const STATUS_BADGE: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-100",
  notified: "bg-blue-50 text-blue-700 border-blue-100",
  renewed:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  lapsed:   "bg-red-50 text-red-600 border-red-100",
};

const FREQ_BADGE: Record<string, string> = {
  monthly:   "bg-purple-50 text-purple-700",
  quarterly: "bg-teal-50 text-teal-700",
  annually:  "bg-gray-100 text-gray-600",
};

const STATUS_OPTIONS = ["pending", "notified", "renewed", "lapsed"];

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function parseFrequency(notes: string | null): "monthly" | "quarterly" | "annually" {
  const match = notes?.match(/Frequency:\s*(monthly|quarterly|annually)/i);
  return (match?.[1]?.toLowerCase() as "monthly" | "quarterly" | "annually") ?? "annually";
}

function calculateNextDueDate(currentDueDate: string, frequency: "monthly" | "quarterly" | "annually"): Date {
  const d = new Date(currentDueDate);
  if (frequency === "monthly")        d.setMonth(d.getMonth() + 1);
  else if (frequency === "quarterly") d.setMonth(d.getMonth() + 3);
  else                                d.setFullYear(d.getFullYear() + 1);
  return d;
}

function exportToCSV(data: DueDate[]) {
  const headers = ["Name", "Phone", "Email", "Provider", "Category", "Policy #", "Due Date", "Status", "Frequency", "Notes"];
  const rows = data.map(d => [
    d.policyHolderName, d.phone, d.email ?? "", d.bankName ?? "", d.category ?? "",
    d.policyNumber ?? "",
    new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    d.status,
    parseFrequency(d.notes),
    (d.notes ?? "").replace(/\s*Frequency:\s*(monthly|quarterly|annually)/i, "").trim(),
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `due-dates-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function DaysCell({ days, status }: { days: number; status?: string }) {
  // Closed cycles have no countdown — the live one moved to the next due date.
  if (status === "renewed" || status === "lapsed") {
    return <span className="text-xs text-gray-300">—</span>;
  }
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
  const [form, setForm] = useState({
    policyHolderName: "", phone: "", email: "", policyNumber: "",
    dueDate: "", notes: "", bankName: "", category: "", frequency: "annually",
  });
  const [saving, setSaving]         = useState(false);
  const [renewingId, setRenewingId] = useState<number | null>(null);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);
  const [providers, setProviders]   = useState<Provider[]>([]);
  const [filters, setFilters] = useState({
    search: "", status: "", urgency: "", provider: "",
    category: "", frequency: "", dateFrom: "", dateTo: "",
  });

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

  function showHistory(item: DueDate) {
    const history = items
      .filter(d => d.phone === item.phone && d.policyNumber && d.policyNumber === item.policyNumber)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    if (history.length === 0) {
      Swal.fire({ icon: "info", title: "No History", text: "No related renewal records found for this policy." });
      return;
    }

    const rows = history.map((d, i) => {
      const freq = parseFrequency(d.notes);
      const freqChip = freq ? `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;background:${freq === "monthly" ? "#F5F3FF" : freq === "quarterly" ? "#F0FDFA" : "#F9FAFB"};color:${freq === "monthly" ? "#6D28D9" : freq === "quarterly" ? "#0F766E" : "#374151"};border:1px solid ${freq === "monthly" ? "#DDD6FE" : freq === "quarterly" ? "#99F6E4" : "#E5E7EB"}">↻ ${freq}</span>` : "";
      const statusColor = d.status === "renewed" ? "#059669" : d.status === "lapsed" ? "#DC2626" : d.status === "notified" ? "#2563EB" : "#D97706";
      const statusBg = d.status === "renewed" ? "#ECFDF5" : d.status === "lapsed" ? "#FEF2F2" : d.status === "notified" ? "#EFF6FF" : "#FFFBEB";
      const dot = i === history.length - 1 ? "●" : "○";
      return `
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:${i < history.length - 1 ? "1px solid #F1F5F9" : "none"}">
          <div style="width:22px;text-align:center;color:${d.status === "renewed" ? "#059669" : "#CBD5E1"};font-size:14px;padding-top:1px;flex-shrink:0">${dot}</div>
          <div style="flex:1;text-align:left">
            <div style="font-size:13px;font-weight:600;color:#0B1120">${new Date(d.dueDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</div>
            <div style="font-size:11px;color:#8899B4;margin-top:2px">${d.policyHolderName}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
            ${freqChip}
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:${statusBg};color:${statusColor};border:1px solid ${statusBg === "#ECFDF5" ? "#A7F3D0" : statusBg === "#FEF2F2" ? "#FECDD3" : statusBg === "#EFF6FF" ? "#BFDBFE" : "#FDE68A"};text-transform:capitalize">${d.status}</span>
          </div>
        </div>`;
    }).join("");

    Swal.fire({
      title: `<span style="font-size:15px;font-weight:700">Renewal History</span>`,
      html: `<div style="font-size:12px;color:#8899B4;margin-bottom:12px;text-align:left">Policy: <b style="color:#0B1120">${item.policyNumber}</b> &nbsp;·&nbsp; ${item.policyHolderName} &nbsp;·&nbsp; ${item.phone}</div><div>${rows}</div>`,
      width: 460,
      showConfirmButton: false,
      showCloseButton: true,
      padding: "20px 24px",
    });
  }

  async function quickNotify(id: number) {
    setNotifyingId(id);
    try {
      await fetch("/api/admin/due-dates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "notified" }),
      });
      setItems(prev => prev.map(d => d.id === id ? { ...d, status: "notified" } : d));
    } finally {
      setNotifyingId(null);
    }
  }

  async function updateStatus(id: number, status: string, currentStatus: string) {
    if (status === "renewed") {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const frequency = parseFrequency(item.notes);
      const nextDate = calculateNextDueDate(item.dueDate, frequency);
      const nextDateFormatted = nextDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      const freqLabel = frequency.charAt(0).toUpperCase() + frequency.slice(1);

      const result = await Swal.fire({
        icon: "question",
        title: "Confirm Renewal",
        html: `Mark <b>${item.policyHolderName}</b>'s policy as renewed?<br/>
               <span style="color:#6b7280;font-size:13px;margin-top:6px;display:block">
                 Next renewal: <b>${nextDateFormatted}</b> &nbsp;·&nbsp; Frequency: <b>${freqLabel}</b>
               </span>`,
        showCancelButton: true,
        confirmButtonText: "Yes, Renew",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#059669",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;

      setRenewingId(id);
      try {
        await fetch("/api/admin/due-dates", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "renewed" }),
        });
        await fetch("/api/admin/due-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyHolderName: item.policyHolderName,
            phone: item.phone,
            email: item.email ?? "",
            policyNumber: item.policyNumber ?? "",
            bankName: item.bankName ?? "",
            category: item.category ?? "",
            dueDate: nextDate.toISOString().split("T")[0],
            notes: item.notes ?? "",
            status: "pending",
          }),
        });
        fetchItems();
      } finally {
        setRenewingId(null);
      }
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
    setItems(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const baseNotes = form.notes.trim();
      const notesWithFreq = baseNotes
        ? `${baseNotes} Frequency: ${form.frequency}`
        : `Frequency: ${form.frequency}`;
      const res = await fetch("/api/admin/due-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, notes: notesWithFreq }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ policyHolderName: "", phone: "", email: "", policyNumber: "", dueDate: "", notes: "", bankName: "", category: "", frequency: "annually" });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const days   = getDaysUntil(item.dueDate);
      const freq   = parseFrequency(item.notes);
      const due    = new Date(item.dueDate);
      const matchSearch    = !filters.search    || [item.policyHolderName, item.phone, item.policyNumber ?? ""].some(v => v.toLowerCase().includes(filters.search.toLowerCase()));
      const matchStatus    = !filters.status    || item.status === filters.status;
      const matchProvider  = !filters.provider  || (item.bankName ?? "").toLowerCase().includes(filters.provider.toLowerCase());
      const matchCategory  = !filters.category  || item.category === filters.category;
      const matchFrequency = !filters.frequency || freq === filters.frequency;
      const matchDateFrom  = !filters.dateFrom  || due >= new Date(filters.dateFrom);
      const matchDateTo    = !filters.dateTo    || due <= new Date(filters.dateTo + "T23:59:59");
      // Urgency describes work still to be done, so it only applies to open
      // cycles — a renewed or lapsed row is never "overdue" or "due in 7 days".
      const isActionable   = item.status === "pending" || item.status === "notified";
      const matchUrgency   = !filters.urgency   || (isActionable && (
        filters.urgency === "overdue"  ? days < 0 :
        filters.urgency === "critical" ? days >= 0 && days <= 7 :
        filters.urgency === "soon"     ? days > 7 && days <= 30 :
        filters.urgency === "upcoming" ? days > 30 : true
      ));
      return matchSearch && matchStatus && matchProvider && matchCategory && matchFrequency && matchDateFrom && matchDateTo && matchUrgency;
    });
  }, [items, filters]);

  const providerOptions = useMemo(() =>
    [...new Set(items.map(i => i.bankName).filter(Boolean))].sort() as string[],
  [items]);

  const stats = useMemo(() => {
    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const pending    = items.filter(i => i.status === "pending");
    return {
      pending:          pending.length,
      overdue:          pending.filter(i => getDaysUntil(i.dueDate) < 0).length,
      dueThisMonth:     pending.filter(i => { const d = new Date(i.dueDate); return d >= monthStart && d <= monthEnd; }).length,
      renewed:          items.filter(i => i.status === "renewed").length,
      monthly:          pending.filter(i => parseFrequency(i.notes) === "monthly").length,
      quarterly:        pending.filter(i => parseFrequency(i.notes) === "quarterly").length,
      annually:         pending.filter(i => parseFrequency(i.notes) === "annually").length,
    };
  }, [items]);

  const overdueCount   = stats.overdue;
  const criticalCount  = items.filter(i => { const d = getDaysUntil(i.dueDate); return d >= 0 && d <= 7 && i.status === "pending"; }).length;
  const hasFilters     = !!(filters.search || filters.status || filters.urgency || filters.provider || filters.category || filters.frequency || filters.dateFrom || filters.dateTo);
  const clearFilters   = () => setFilters({ search: "", status: "", urgency: "", provider: "", category: "", frequency: "", dateFrom: "", dateTo: "" });

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Due Date Tracker</h1>
          <p className="text-gray-400 text-sm">Track policy renewal dates and notify customers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filtered)}
            className="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchItems}
            className="border border-gray-200 text-gray-500 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { label: "Pending",        value: stats.pending,       color: "text-amber-700   bg-amber-50   border-amber-100",   click: () => setFilters(f => ({ ...f, status: "pending",  frequency: "" })) },
          { label: "Overdue",        value: stats.overdue,       color: "text-red-700     bg-red-50     border-red-100",     click: () => setFilters(f => ({ ...f, urgency: "overdue", status: "pending" })) },
          { label: "This Month",     value: stats.dueThisMonth,  color: "text-orange-700  bg-orange-50  border-orange-100",  click: null },
          { label: "Renewed Total",  value: stats.renewed,       color: "text-emerald-700 bg-emerald-50 border-emerald-100", click: () => setFilters(f => ({ ...f, status: "renewed",  frequency: "" })) },
          { label: "Monthly",        value: stats.monthly,       color: "text-purple-700  bg-purple-50  border-purple-100",  click: () => setFilters(f => ({ ...f, frequency: "monthly",   status: "pending" })) },
          { label: "Quarterly",      value: stats.quarterly,     color: "text-teal-700    bg-teal-50    border-teal-100",    click: () => setFilters(f => ({ ...f, frequency: "quarterly", status: "pending" })) },
          { label: "Annually",       value: stats.annually,      color: "text-gray-700    bg-gray-50    border-gray-200",    click: () => setFilters(f => ({ ...f, frequency: "annually",  status: "pending" })) },
        ].map(({ label, value, color, click }) => (
          <button
            key={label}
            onClick={click ?? undefined}
            disabled={!click}
            className={`border rounded-xl px-3 py-2.5 text-center transition-all ${color} ${click ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}
          >
            <div className="text-xl font-bold">{value}</div>
            <div className="text-[9px] font-semibold uppercase tracking-widest mt-0.5 opacity-70 leading-tight">{label}</div>
          </button>
        ))}
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
      {showForm ? <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
              { field: "policyHolderName", label: "Policy Holder Name", req: true,  type: "text",  placeholder: "Rajesh Kumar" },
              { field: "phone",            label: "Phone Number",        req: true,  type: "tel",   placeholder: "98XXXXXXXX" },
              { field: "email",            label: "Email Address",       req: false, type: "email", placeholder: "optional" },
              { field: "policyNumber",     label: "Policy Number",       req: true,  type: "text",  placeholder: "POL-XXXXXXXX" },
              { field: "dueDate",          label: "Renewal Date",        req: true,  type: "date",  placeholder: "" },
              { field: "notes",            label: "Notes",               req: false, type: "text",  placeholder: "Any special instructions..." },
            ].map(({ field, label, req, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  {label} {req ? <span className="text-red-500">*</span> : null}
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
              <select required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className={inputCls + " w-full"}>
                <option value="">Select provider...</option>
                {providers.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Insurance Category <span className="text-red-500">*</span>
              </label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls + " w-full"}>
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</option>)}
              </select>
            </div>

            {/* Renewal Frequency */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Renewal Frequency <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {(["monthly", "quarterly", "annually"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, frequency: f }))}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all capitalize ${form.frequency === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
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
        </div> : null}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
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
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={inputCls}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Frequency</span>
            <select value={filters.frequency} onChange={(e) => setFilters({ ...filters, frequency: e.target.value })} className={inputCls}>
              <option value="">All Frequencies</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Urgency</span>
            <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })} className={inputCls}>
              <option value="">All</option>
              <option value="overdue">Overdue</option>
              <option value="critical">Due in 7 days</option>
              <option value="soon">Due in 30 days</option>
              <option value="upcoming">Upcoming (30d+)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Provider</span>
            <select value={filters.provider} onChange={(e) => setFilters({ ...filters, provider: e.target.value })} className={inputCls}>
              <option value="">All Providers</option>
              {providerOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Category</span>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className={inputCls}>
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</option>)}
            </select>
          </div>

          {hasFilters ? <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear all
            </button> : null}

          <span className="ml-auto text-xs text-gray-400 self-end pb-2">
            {filtered.length} of {items.length} entries
          </span>
        </div>

        {/* Date range row */}
        <div className="flex flex-wrap items-end gap-3 border-t border-gray-100 pt-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Due Date From</span>
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Due Date To</span>
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className={inputCls} />
          </div>
          {(filters.dateFrom || filters.dateTo) ? <button
              onClick={() => setFilters(f => ({ ...f, dateFrom: "", dateTo: "" }))}
              className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg transition-colors self-end"
            >
              Clear dates
            </button> : null}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                      {hasFilters ? <button onClick={clearFilters} className="mt-2 text-blue-600 text-sm font-semibold hover:underline">
                          Clear filters
                        </button> : null}
                      {items.length === 0 && (
                        <button onClick={openForm} className="mt-3 text-blue-600 text-sm font-semibold hover:underline">
                          + Add first entry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const days      = getDaysUntil(item.dueDate);
                  const isOverdue = days < 0 && item.status === "pending";
                  const freq      = parseFrequency(item.notes);
                  const cleanNotes = (item.notes ?? "").replace(/\s*Frequency:\s*(monthly|quarterly|annually)/i, "").trim();
                  return (
                    <tr key={item.id} className={`hover:bg-gray-50/80 transition-colors ${isOverdue ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-gray-900">{item.policyHolderName}</div>
                        {item.email ? <div className="text-xs text-gray-400 mt-0.5">{item.email}</div> : null}
                        {cleanNotes ? <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]" title={cleanNotes}>{cleanNotes}</div> : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-gray-700 text-sm">{item.phone}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.bankName ? <div className="text-sm text-gray-700 font-medium">{item.bankName}</div> : null}
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          {item.category ? <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded capitalize">
                              {item.category.replace(/-/g, " ")}
                            </span> : null}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${FREQ_BADGE[freq]}`}>
                            {freq.slice(0, 3)}
                          </span>
                        </div>
                        {!item.bankName && !item.category && <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">{item.policyNumber ?? "—"}</td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm whitespace-nowrap">
                        {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <DaysCell days={days} status={item.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE[item.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={item.status}
                            disabled={renewingId === item.id || notifyingId === item.id}
                            onChange={(e) => updateStatus(item.id, e.target.value, item.status)}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white text-gray-700 transition-colors disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          {item.status === "pending" && (
                            <button
                              onClick={() => quickNotify(item.id)}
                              disabled={notifyingId === item.id || renewingId === item.id}
                              title="Mark as Notified"
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all disabled:opacity-40"
                            >
                              {notifyingId === item.id
                                ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                : <Bell className="w-3.5 h-3.5" />
                              }
                            </button>
                          )}
                          {item.policyNumber ? <button
                              onClick={() => showHistory(item)}
                              title="View Renewal History"
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button> : null}
                        </div>
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
