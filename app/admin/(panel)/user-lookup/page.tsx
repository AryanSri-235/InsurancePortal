"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertTriangle } from "lucide-react";

export default function UserLookupPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) { setError("Enter a valid 10-digit number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/by-phone?phone=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "No user found with this number"); return; }
      router.push(`/admin/registered-users/${data.user.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-bold text-lg">User Lookup</h1>
          <p className="text-slate-400 text-sm mt-1">Find any registered user by their mobile number</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLookup} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 text-sm font-semibold">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                autoFocus
                className="flex-1 border border-gray-200 rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || phone.replace(/\D/g, "").length < 10}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find User
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Or browse all users in{" "}
            <a href="/admin/registered-users" className="text-blue-600 hover:underline font-medium">Registered Users</a>
          </p>
        </form>
      </div>
    </div>
  );
}
