"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, X, Search, FileText, Star, Pencil, ExternalLink, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  author: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORY_OPTIONS = [
  "Term Insurance",
  "Health Insurance",
  "Motor Insurance",
  "Life Insurance",
  "Car Insurance",
  "Two Wheeler Insurance",
  "Family Health Insurance",
  "Group Health Insurance",
  "Travel Insurance",
  "Home Insurance",
  "Term Insurance for Women",
  "Return of Premium Term Plans",
  "Guaranteed Return Plans",
  "Child Savings Plans",
  "Retirement Plans",
  "Guides",
];

const CAT_BADGE: Record<string, string> = {
  "Term Insurance": "bg-blue-50 text-blue-700 border-blue-100",
  "Health Insurance": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Motor Insurance": "bg-orange-50 text-orange-700 border-orange-100",
  "Life Insurance": "bg-violet-50 text-violet-700 border-violet-100",
  "Car Insurance": "bg-sky-50 text-sky-700 border-sky-100",
  "Two Wheeler Insurance": "bg-amber-50 text-amber-700 border-amber-100",
  "Family Health Insurance": "bg-teal-50 text-teal-700 border-teal-100",
  "Group Health Insurance": "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Travel Insurance": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Home Insurance": "bg-rose-50 text-rose-700 border-rose-100",
  "Term Insurance for Women": "bg-pink-50 text-pink-700 border-pink-100",
  "Return of Premium Term Plans": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Guaranteed Return Plans": "bg-green-50 text-green-700 border-green-100",
  "Child Savings Plans": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  "Retirement Plans": "bg-purple-50 text-purple-700 border-purple-100",
  "Guides": "bg-gray-50 text-gray-700 border-gray-200",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";

export default function BlogClient({ role }: { role: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    try {
      const res = await fetch(`/api/admin/blog?${params}`);
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function togglePublished(id: number, current: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, isPublished: !current, publishedAt: !current ? new Date().toISOString() : null }
              : p
          )
        );
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error || "Failed to update status" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong" });
    } finally {
      setTogglingId(null);
    }
  }

  async function deletePost(id: number, title: string) {
    const confirmed = await Swal.fire({
      title: `Delete post "${title}"?`,
      text: "This action cannot be undone and the blog post will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
      reverseButtons: true,
    });
    if (!confirmed.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({ icon: "success", title: "Post deleted", timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete post" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong" });
    }
  }

  const displayed = posts.filter((p) => {
    if (filters.status === "published" && !p.isPublished) {
      return false;
    }
    if (filters.status === "draft" && p.isPublished) {
      return false;
    }
    return true;
  });

  const hasFilters = !!(filters.search || filters.category || filters.status);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-400 text-sm">{displayed.length} of {posts.length} articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Write New Post
        </Link>
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
                placeholder="Search by title, body..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`${inputCls} pl-9 w-64`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className={inputCls}
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={inputCls}
            >
              <option value="">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFilters({ search: "", category: "", status: "" })}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Author</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published At</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                      <FileText className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-sm font-medium">No blog posts found</p>
                      {hasFilters && <p className="text-xs mt-1">Try adjusting your filters</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                displayed.map((post) => (
                  <tr key={post.id} className={`hover:bg-gray-50/80 transition-colors ${!post.isPublished ? "opacity-75" : ""}`}>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{post.title}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {post.category ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${CAT_BADGE[post.category] ?? "bg-gray-100 text-gray-600 border-gray-100"}`}>
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 text-sm">{post.author ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-700 text-sm">
                      {post.publishedAt ? (
                        new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      ) : (
                        <span className="text-gray-400 italic">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => togglePublished(post.id, post.isPublished)}
                        disabled={togglingId === post.id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${post.isPublished ? "bg-emerald-500" : "bg-gray-200"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${post.isPublished ? "translate-x-4" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Link>
                        {role === "superadmin" && (
                          <button
                            onClick={() => deletePost(post.id, post.title)}
                            className="text-xs font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-white hover:border-red-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
