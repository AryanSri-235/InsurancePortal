"use client";

import { useEffect, useState, useCallback } from "react";

interface Subscriber {
  id: number;
  email: string;
  source: string | null;
  createdAt: string;
}

interface Meta { total: number; page: number; pages: number; }

const SOURCE_OPTIONS = ["footer", "blog", "other"];

const SOURCE_BADGE: Record<string, string> = {
  footer: "bg-slate-50 text-slate-600 border-slate-200",
  blog:   "bg-violet-50 text-violet-700 border-violet-100",
  other:  "bg-gray-50 text-gray-500 border-gray-200",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function NewsletterPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", source: "", page: 1 });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.source) params.set("source", filters.source);
    params.set("page", String(filters.page));
    try {
      const res = await fetch(`/api/admin/newsletter?${params}`);
      const data = await res.json();
      if (data.success) {
        setSubs(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  async function deleteSub(id: number) {
    if (!confirm("Unsubscribe this email?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSubs(prev => prev.filter(s => s.id !== id));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } finally {
      setDeletingId(null);
    }
  }

  const hasFilters = !!(filters.search || filters.source);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-400 text-sm">{meta.total} subscribers</p>
        </div>
        <button
          onClick={() => {
            const csv = ["Email,Source,Subscribed On",
              ...subs.map(s => `${s.email},${s.source ?? ""},${new Date(s.createdAt).toLocaleDateString("en-IN")}`)
            ].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "subscribers.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Source breakdown pills */}
      <div className="grid grid-cols-3 gap-3">
        {SOURCE_OPTIONS.map(src => {
          const count = subs.filter(s => s.source === src).length;
          return (
            <button
              key={src}
              onClick={() => setFilters(f => ({ ...f, source: f.source === src ? "" : src, page: 1 }))}
              className={`bg-white border rounded-xl px-4 py-3 text-left transition-all hover:shadow-sm ${filters.source === src ? "border-blue-300 shadow-sm ring-1 ring-blue-200" : "border-gray-200"}`}
            >
              <p className="text-lg font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">from {src}</p>
            </button>
          );
        })}
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
                placeholder="Search email..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className={`${inputCls} pl-9 w-52`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Source</span>
            <select
              value={filters.source}
              onChange={e => setFilters({ ...filters, source: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", source: "", page: 1 })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subscribed On</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center py-14 text-gray-400">
                      <svg className="w-8 h-8 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">No subscribers yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subs.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 text-gray-300 text-xs font-mono">
                      {(filters.page - 1) * 30 + i + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-900 font-medium">{sub.email}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${SOURCE_BADGE[sub.source ?? "other"] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}>
                        {sub.source ?? "other"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => deleteSub(sub.id)}
                        disabled={deletingId === sub.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              Page <span className="font-semibold text-gray-600">{meta.page}</span> of {meta.pages} · {meta.total} total
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-white transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                disabled={meta.page >= meta.pages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-white transition-colors"
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
