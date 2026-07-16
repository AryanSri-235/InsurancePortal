"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, X, MessageSquare, Star, Trash2, MapPin } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  city: string | null;
  rating: number;
  body: string;
  category: string | null;
  isActive: boolean;
}

interface Meta {
  total: number;
  page: number;
  pages: number;
}

const CAT_LABEL: Record<string, string> = {
  general: "General Feedback",
  term: "Term Insurance",
  health: "Health Insurance",
  motor: "Motor Insurance",
  life: "Life Insurance",
  car: "Car Insurance",
  "two-wheeler": "Two Wheeler Insurance",
  "family-health": "Family Health Insurance",
  "group-health": "Group Health Insurance",
  travel: "Travel Insurance",
  home: "Home Insurance",
  "term-women": "Term Insurance for Women",
  "term-rop": "Return of Premium Term Plans",
  "guaranteed-return": "Guaranteed Return Plans",
  "child-savings": "Child Savings Plans",
  retirement: "Retirement Plans"
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", rating: "", page: 1 });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.rating) params.set("rating", filters.rating);
    params.set("page", String(filters.page));
    try {
      const res = await fetch(`/api/admin/testimonials?${params}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function deleteReview(id: number) {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        setMeta(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting review.");
    } finally {
      setDeletingId(null);
    }
  }

  const hasFilters = !!(filters.search || filters.category || filters.rating);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-gray-400 text-sm">{meta.total} total reviews submitted</p>
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
                placeholder="Search reviews..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className={`${inputCls} pl-9 w-52`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Insurance Type</span>
            <select
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Categories</option>
              {Object.entries(CAT_LABEL).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Rating</span>
            <select
              value={filters.rating}
              onChange={e => setFilters({ ...filters, rating: e.target.value, page: 1 })}
              className={inputCls}
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", category: "", rating: "", page: 1 })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table / Grid list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-48">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Review</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center py-14 text-gray-400">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm font-medium">No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((r, i) => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors align-top">
                    <td className="px-4 py-4 text-gray-300 text-xs font-mono">
                      {(filters.page - 1) * 30 + i + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{r.name}</div>
                      {r.city && (
                        <div className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {r.city}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {r.category ? (CAT_LABEL[r.category] ?? r.category) : "General"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-600 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed max-w-lg">{r.body}</p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => deleteReview(r.id)}
                        disabled={deletingId === r.id}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold disabled:opacity-40 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
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
