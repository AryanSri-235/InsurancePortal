"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Mail, MessageSquare, Plus, Calendar, FileText, X, ArrowLeft } from "lucide-react";

interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  pincode: string | null;
  gender: string | null;
  dob: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface DueDate {
  id: number;
  policyHolderName: string;
  phone: string;
  policyNumber: string | null;
  dueDate: string;
  status: string;
  notes: string | null;
  policy: { name: string; category: string; provider: { name: string } } | null;
}

interface Lead {
  id: number;
  name: string;
  phone: string;
  category: string | null;
  leadType: string;
  status: string;
  createdAt: string;
  policy: { name: string; provider: { name: string } } | null;
}

const STATUS_BADGE_DD: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-100",
  notified: "bg-blue-50 text-blue-700 border-blue-100",
  renewed:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  lapsed:   "bg-red-50 text-red-600 border-red-100",
};
const STATUS_BADGE_LEAD: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  lost:      "bg-red-50 text-red-600 border-red-100",
};
const DD_STATUS_OPTIONS = ["pending", "notified", "renewed", "lapsed"];

function getDaysUntil(dateStr: string) {
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (d < 0)  return { label: `${Math.abs(d)}d overdue`, cls: "text-red-600 font-bold" };
  if (d === 0) return { label: "Today!",            cls: "text-red-600 font-bold" };
  if (d <= 7)  return { label: `${d}d`,              cls: "text-red-500 font-semibold" };
  if (d <= 30) return { label: `${d}d`,              cls: "text-amber-600 font-semibold" };
  return              { label: `${d}d`,              cls: "text-gray-400" };
}

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400 w-full";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dueDates, setDueDates] = useState<DueDate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"renewals" | "leads">("renewals");

  // Add renewal form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ policyNumber: "", dueDate: "", notes: "" });
  const [addSaving, setAddSaving] = useState(false);

  // Edit renewal modal
  const [editItem, setEditItem] = useState<DueDate | null>(null);
  const [editForm, setEditForm] = useState({ policyNumber: "", dueDate: "", notes: "", status: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Contact / query
  const [showQuery, setShowQuery] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [querySaving, setQuerySaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) { router.push("/admin/registered-users"); return; }
      const data = await res.json();
      setUser(data.user);
      setDueDates(data.dueDates);
      setLeads(data.leads);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateDDStatus(ddId: number, status: string, current: string) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const result = await Swal.fire({
      icon: status === "lapsed" ? "warning" : "question",
      title: `Mark as ${label}?`,
      text: `Change status from "${current}" to "${label}".`,
      showCancelButton: true,
      confirmButtonText: `Yes, mark ${label}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "lapsed" ? "#DC2626" : status === "renewed" ? "#059669" : "#2563EB",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    await fetch("/api/admin/due-dates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ddId, status }),
    });
    setDueDates((prev) => prev.map((d) => d.id === ddId ? { ...d, status } : d));
  }

  async function handleAddRenewal(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setAddSaving(true);
    try {
      const res = await fetch("/api/admin/due-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyHolderName: user.name,
          phone: user.phone,
          email: user.email ?? "",
          policyNumber: addForm.policyNumber,
          dueDate: addForm.dueDate,
          notes: addForm.notes,
        }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setAddForm({ policyNumber: "", dueDate: "", notes: "" });
        fetchData();
      }
    } finally {
      setAddSaving(false);
    }
  }

  function openEdit(item: DueDate) {
    setEditItem(item);
    setEditForm({
      policyNumber: item.policyNumber ?? "",
      dueDate: item.dueDate.slice(0, 10),
      notes: item.notes ?? "",
      status: item.status,
    });
  }

  async function logQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !queryText.trim()) return;
    setQuerySaving(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email ?? undefined,
          leadType: "callback",
          utmSource: `note: ${queryText.trim().slice(0, 200)}`,
        }),
      });
      setQueryText("");
      setShowQuery(false);
      Swal.fire({ icon: "success", title: "Query logged!", text: "Saved to Leads as a note.", confirmButtonColor: "#2563EB", timer: 2000, showConfirmButton: false });
      fetchData();
    } finally {
      setQuerySaving(false);
    }
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    setEditSaving(true);
    try {
      await fetch("/api/admin/due-dates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editItem.id,
          policyNumber: editForm.policyNumber || null,
          dueDate: editForm.dueDate,
          notes: editForm.notes || null,
          status: editForm.status,
        }),
      });
      setDueDates((prev) =>
        prev.map((d) =>
          d.id === editItem.id
            ? { ...d, policyNumber: editForm.policyNumber || null, dueDate: new Date(editForm.dueDate).toISOString(), notes: editForm.notes || null, status: editForm.status }
            : d
        )
      );
      setEditItem(null);
    } finally {
      setEditSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 max-w-4xl animate-pulse">
        <div className="h-6 w-48 bg-gray-100 rounded" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/registered-users"
          className="group flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/admin/registered-users" className="hover:text-gray-600 transition-colors">Registered Users</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-bold text-lg">{user.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${user.isActive ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-0.5">+91 {user.phone}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-slate-400 text-xs">Member since</p>
            <p className="text-white text-sm font-semibold">{new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
          {[
            { label: "Email",       value: user.email ?? "—" },
            { label: "City",        value: user.city ?? "—" },
            { label: "Pincode",     value: user.pincode ?? "—" },
            { label: "Gender",      value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—" },
            { label: "Date of Birth", value: user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
            { label: "Last Login",  value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never" },
            { label: "User ID",     value: `#${user.id}` },
            { label: "Registered",  value: new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold text-gray-700 mr-auto">Contact {user.name.split(" ")[0]}</p>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/91${user.phone}?text=Hi%20${encodeURIComponent(user.name)}%2C%20this%20is%20from%20Insurance%20Portal.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>

        {/* Email */}
        {user.email && (
          <a
            href={`mailto:${user.email}?subject=Regarding your insurance policy&body=Hi ${user.name},%0A%0A`}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        )}

        {/* Log Query */}
        <button
          onClick={() => setShowQuery((v) => !v)}
          className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Log Query
        </button>
      </div>

      {/* Log Query form */}
      {showQuery && (
        <form onSubmit={logQuery} className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-violet-800">Log a Query / Note for {user.name}</p>
          </div>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="E.g. Customer asked about term plan upgrade, wants to change nominee, called for renewal reminder…"
            rows={3}
            required
            className="w-full border border-violet-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 bg-white text-gray-700 placeholder-gray-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={querySaving || !queryText.trim()}
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {querySaving ? "Saving…" : "Save Note"}
            </button>
            <button
              type="button"
              onClick={() => { setShowQuery(false); setQueryText(""); }}
              className="border border-violet-200 text-violet-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-violet-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["renewals", "leads"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "renewals" ? `Renewals (${dueDates.length})` : `Leads (${leads.length})`}
          </button>
        ))}
      </div>

      {/* ── Renewals tab ── */}
      {tab === "renewals" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <p className="text-sm font-semibold text-gray-700">Policy Renewals</p>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Renewal
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <form onSubmit={handleAddRenewal} className="border-b border-gray-100 p-5 bg-blue-50/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Policy Number</label>
                <input type="text" placeholder="POL-XXXXXXXX" value={addForm.policyNumber} onChange={(e) => setAddForm({ ...addForm, policyNumber: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Renewal Date <span className="text-red-500">*</span></label>
                <input type="date" required value={addForm.dueDate} onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
                <input type="text" placeholder="Optional notes…" value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} className={inputCls} />
              </div>
              <div className="sm:col-span-3 flex gap-2">
                <button type="submit" disabled={addSaving} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  {addSaving ? "Saving…" : "Save Renewal"}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          )}

          {dueDates.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-gray-400">
              <Calendar className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm font-medium">No renewals yet</p>
              <button onClick={() => setShowAddForm(true)} className="mt-2 text-blue-600 text-sm font-semibold hover:underline">+ Add first renewal</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Policy</th>
                  <th className="text-left px-4 py-3">Policy #</th>
                  <th className="text-left px-4 py-3">Due Date</th>
                  <th className="text-left px-4 py-3">Days Left</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dueDates.map((d) => {
                  const t = getDaysUntil(d.dueDate);
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        {d.policy ? (
                          <>
                            <p className="font-semibold text-gray-800 text-sm">{d.policy.name}</p>
                            <p className="text-xs text-gray-400">{d.policy.provider.name}</p>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">{d.policyNumber ?? "—"}</td>
                      <td className="px-4 py-3.5 text-gray-700 text-sm whitespace-nowrap">
                        {new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className={`px-4 py-3.5 text-xs ${t.cls}`}>{t.label}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE_DD[d.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={d.status}
                            onChange={(e) => updateDDStatus(d.id, e.target.value, d.status)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                          >
                            {DD_STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => openEdit(d)}
                            className="text-xs text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg font-semibold transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {/* ── Leads tab ── */}
      {tab === "leads" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <p className="text-sm font-semibold text-gray-700">Quote & Lead History</p>
          </div>
          {leads.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-gray-400">
              <FileText className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm font-medium">No leads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Policy</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{l.leadType}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs capitalize">{l.category ?? "—"}</td>
                    <td className="px-4 py-3.5">
                      {l.policy ? (
                        <>
                          <p className="text-sm font-semibold text-gray-800">{l.policy.name}</p>
                          <p className="text-xs text-gray-400">{l.policy.provider.name}</p>
                        </>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE_LEAD[l.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">
                      {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {/* Edit renewal modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
              <p className="font-bold text-gray-900 text-sm">Edit Renewal</p>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Policy Number</label>
                <input type="text" placeholder="POL-XXXXXXXX" value={editForm.policyNumber} onChange={(e) => setEditForm({ ...editForm, policyNumber: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Renewal Date <span className="text-red-500">*</span></label>
                <input type="date" required value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className={inputCls}>
                  {DD_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
                <input type="text" placeholder="Optional notes…" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className={inputCls} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={editSaving} className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditItem(null)} className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
