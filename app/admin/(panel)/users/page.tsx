"use client";

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Plus, Search, X, Check, Minus } from "lucide-react";

interface Provider {
  id: number;
  name: string;
}

type Role = "superadmin" | "ram" | "sales" | "renewal";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  bankName: string | null;
  maxPolicies: number | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Super Admin",
  ram:        "R.A.M.",
  sales:      "Sales",
  renewal:    "Renewal",
};

const ROLE_BADGE: Record<Role, string> = {
  superadmin: "bg-purple-50 text-purple-700 border-purple-200",
  ram:        "bg-blue-50 text-blue-700 border-blue-200",
  sales:      "bg-green-50 text-green-700 border-green-200",
  renewal:    "bg-amber-50 text-amber-700 border-amber-200",
};

const ROLE_HEADER: Record<Role, string> = {
  superadmin: "bg-purple-600",
  ram:        "bg-blue-600",
  sales:      "bg-green-600",
  renewal:    "bg-amber-500",
};

const ALL_PAGES = [
  { key: "dashboard",          label: "Dashboard" },
  { key: "leads",              label: "Leads" },
  { key: "due-dates",          label: "Due Dates" },
  { key: "contact-messages",   label: "Contact Messages" },
  { key: "newsletter",         label: "Newsletter" },
  { key: "registered-users",   label: "Registered Users" },
  { key: "user-lookup",        label: "User Lookup" },
  { key: "providers",          label: "Providers" },
  { key: "policies",           label: "Policies" },
  { key: "users",              label: "Panel Users" },
];

const PAGE_ACCESS: Record<string, Role[]> = {
  dashboard:          ["superadmin"],
  leads:              ["superadmin", "sales"],
  "due-dates":        ["superadmin", "renewal"],
  "contact-messages": ["superadmin"],
  newsletter:         ["superadmin"],
  "registered-users": ["superadmin"],
  "user-lookup":      ["superadmin"],
  providers:          ["superadmin", "ram"],
  policies:           ["superadmin", "ram"],
  users:              ["superadmin"],
};

const ROLES: Role[] = ["superadmin", "ram", "sales", "renewal"];

const EMPTY_FORM = { name: "", email: "", password: "", role: "sales" as Role, bankName: "", maxPolicies: "" };

export default function UsersPage() {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [usersRes, providersRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/providers"),
    ]);
    const usersData     = await usersRes.json();
    const providersData = await providersRes.json();
    setUsers(usersData.users ?? []);
    setProviders((providersData.data ?? []).map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = {
      name: form.name.trim(), email: form.email.trim(),
      password: form.password, role: form.role,
    };
    if (form.bankName.trim())  payload.bankName    = form.bankName.trim();
    if (form.maxPolicies)      payload.maxPolicies = Number(form.maxPolicies);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setShowModal(false); setForm(EMPTY_FORM); await load();
      Swal.fire({ icon: "success", title: "User created", timer: 1500, showConfirmButton: false });
    } else {
      const data = await res.json();
      Swal.fire({ icon: "error", title: "Error", text: typeof data.error === "string" ? data.error : "Failed to create user" });
    }
  }

  async function toggleActive(user: AdminUser) {
    const action = user.isActive ? "Deactivate" : "Activate";
    const confirmed = await Swal.fire({ title: `${action} ${user.name}?`, icon: "question", showCancelButton: true, confirmButtonText: "Yes" });
    if (!confirmed.isConfirmed) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] items-start">

        {/* ── Left: user list ── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Panel Users</h1>
              <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>
            </div>
            <button
              onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or role…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-gray-400 text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-sm">No users found</div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Name", "Email", "Role", "Status", "Last Login", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            {user.bankName && <p className="text-[11px] text-gray-400">{user.bankName}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ROLE_BADGE[user.role] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                          {ROLE_LABELS[user.role] ?? user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-400"}`} />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(user)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${user.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: role access panel ── */}
        <div className="w-72 flex-shrink-0 sticky top-6 space-y-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Role Access</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pages each role can access</p>
          </div>

          {ROLES.map(role => {
            const accessible = ALL_PAGES.filter(p => (PAGE_ACCESS[p.key] ?? []).includes(role));
            const blocked    = ALL_PAGES.filter(p => !(PAGE_ACCESS[p.key] ?? []).includes(role));
            return (
              <div key={role} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* Role header */}
                <div className={`${ROLE_HEADER[role]} px-4 py-3 flex items-center justify-between`}>
                  <span className="text-white font-bold text-sm">{ROLE_LABELS[role]}</span>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {accessible.length}/{ALL_PAGES.length} pages
                  </span>
                </div>

                {/* Page list */}
                <div className="divide-y divide-gray-50">
                  {ALL_PAGES.map(page => {
                    const has = (PAGE_ACCESS[page.key] ?? []).includes(role);
                    return (
                      <div key={page.key} className={`flex items-center justify-between px-4 py-2 ${has ? "" : "opacity-40"}`}>
                        <span className="text-xs text-gray-700">{page.label}</span>
                        {has ? (
                          <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Minus className="w-3 h-3 text-gray-400" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900">Add Panel User</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="rahul@example.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role *</label>
                <select required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role, bankName: "" }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="superadmin">Super Admin — full access</option>
                  <option value="ram">R.A.M. — policies, providers</option>
                  <option value="sales">Sales — leads only</option>
                  <option value="renewal">Renewal — due-dates only</option>
                </select>
              </div>
              {form.role === "ram" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Provider / Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.bankName}
                      onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select provider…</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Max Policies <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="number" min={1} value={form.maxPolicies} onChange={e => setForm(f => ({ ...f, maxPolicies: e.target.value }))}
                      placeholder="e.g. 100"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {/* Access preview for selected role */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Access preview</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_PAGES.map(page => {
                    const has = (PAGE_ACCESS[page.key] ?? []).includes(form.role);
                    return (
                      <span key={page.key} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${has ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200 line-through"}`}>
                        {page.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  {saving ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
