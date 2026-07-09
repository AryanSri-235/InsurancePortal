"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error ?? "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-100">

      {/* Insurance-themed SVG background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating insurance icons — subtle */}
      <div className=”absolute inset-0 pointer-events-none overflow-hidden”>
        <svg className=”absolute top-16 left-16 w-24 h-24 text-blue-400/20” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z” />
        </svg>
        <svg className=”absolute top-12 right-24 w-20 h-20 text-emerald-400/20” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z” />
        </svg>
        <svg className=”absolute bottom-24 left-20 w-28 h-28 text-orange-400/20” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6.99zM6.85 6h10.29l1.08 4H5.77L6.85 6zM19 17H5v-5h14v5z” />
          <circle cx=”7.5” cy=”14.5” r=”1.5” />
          <circle cx=”16.5” cy=”14.5” r=”1.5” />
        </svg>
        <svg className=”absolute bottom-20 right-16 w-24 h-24 text-violet-400/20” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M23 12c0-6.08-4.51-11.12-10.38-11.93L12 0l-.62.07C5.51.88 1 5.92 1 12h11v5c0 1.1-.9 2-2 2a2 2 0 01-2-2H6a4 4 0 004 4 4 4 0 004-4v-5h9z” />
        </svg>
        <svg className=”absolute top-1/2 -translate-y-1/2 left-8 w-16 h-16 text-blue-400/15” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 13l-3-3 1.41-1.41L10 11.17l5.59-5.59L17 7l-7 7z” />
        </svg>
        <svg className=”absolute top-1/3 right-10 w-20 h-20 text-indigo-400/15” fill=”currentColor” viewBox=”0 0 24 24”>
          <path d=”M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z” />
        </svg>
      </div>

      {/* Gradient glows */}
      <div className=”absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none” />
      <div className=”absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none” />

      <div className=”w-full max-w-sm relative”>
        {/* Logo */}
        <div className=”text-center mb-8”>
          <div className=”inline-flex mb-6”>
            <div className=”bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200”>
              <img src=”/logo-zoomed.png” alt=”NPS Insurance.Life” className=”h-11 w-auto object-contain” />
            </div>
          </div>
          <h1 className=”text-2xl font-bold text-gray-900”>Welcome back</h1>
          <p className=”text-gray-500 text-sm mt-1.5”>Sign in to the admin panel</p>
        </div>

        <div className=”bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/60 p-7”>
          <form onSubmit={handleSubmit} className=”space-y-4”>
            <div>
              <label className=”block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2”>
                Email address
              </label>
              <input
                type=”email”
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete=”email”
                placeholder=”admin@example.com”
                className=”w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors”
              />
            </div>

            <div>
              <label className=”block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2”>
                Password
              </label>
              <div className=”relative”>
                <input
                  type={showPass ? “text” : “password”}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete=”current-password”
                  placeholder=”Password”
                  className=”w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors”
                />
                <button
                  type=”button”
                  onClick={() => setShowPass(!showPass)}
                  className=”absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors”
                  tabIndex={-1}
                >
                  {showPass ? (
                    <EyeOff className=”w-4 h-4” />
                  ) : (
                    <Eye className=”w-4 h-4” />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className=”flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3”>
                <AlertCircle className=”w-4 h-4 text-red-500 mt-0.5 flex-shrink-0” />
                <p className=”text-red-600 text-sm”>{error}</p>
              </div>
            )}

            <button
              type=”submit”
              disabled={loading}
              className=”w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-blue-300 mt-1”
            >
              {loading ? (
                <span className=”flex items-center justify-center gap-2”>
                  <Loader2 className=”w-4 h-4 animate-spin” />
                  Signing in...
                </span>
              ) : “Sign In →”}
            </button>
          </form>
        </div>

        <p className=”text-center text-xs text-gray-400 mt-6”>
          InsurancePortal Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}


