"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
}

interface Meta { total: number; page: number; pages: number; }

const SUBJECTS = [
  "Term Insurance Query",
  "Health Insurance Query",
  "Motor Insurance Query",
  "Life Insurance Query",
  "Claim Assistance",
  "Policy Renewal",
  "Other",
];

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", subject: "", page: 1 });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.subject) params.set("subject", filters.subject);
    params.set("page", String(filters.page));
    try {
      const res = await fetch(`/api/admin/contact-messages?${params}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  async function deleteMessage(id: number) {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/contact-messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessages(prev => prev.filter(m => m.id !== id));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } finally {
      setDeletingId(null);
    }
  }

  const hasFilters = !!(filters.search || filters.subject);

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-400 text-sm">{meta.total} messages received</p>
        </div>
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
                placeholder="Name, email, phone..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className={`${inputCls} pl-9 w-52`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Subject</span>
            <select
              value={filters.subject}
              onChange={e => setFilters({ ...filters, subject: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", subject: "", page: 1 })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-64" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                </div>
              </div>
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center text-gray-400">
            <svg className="w-10 h-10 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-sm">No messages yet</p>
            {hasFilters && <p className="text-xs mt-1">Try adjusting your filters</p>}
          </div>
        ) : (
          messages.map(msg => {
            const isOpen = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${isOpen ? "border-blue-200 shadow-md shadow-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : msg.id)}
                >
                  <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{msg.name}</span>
                      {msg.subject && (
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                          {msg.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                      {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                        <p className="text-gray-900 font-medium">{msg.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-gray-900">{msg.phone ? <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">{msg.phone}</a> : "—"}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Message</p>
                      <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        Received on {new Date(msg.createdAt).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your enquiry")}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Reply
                        </a>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          disabled={deletingId === msg.id}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-3">
          <p className="text-xs text-gray-400">
            Page <span className="font-semibold text-gray-600">{meta.page}</span> of {meta.pages} · {meta.total} total
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              disabled={meta.page >= meta.pages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
