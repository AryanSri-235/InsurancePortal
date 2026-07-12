"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserCircle2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) { setError("Please enter your full name (at least 2 characters)."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/complete-profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() || undefined }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/account");
      router.refresh();
    } catch { setError("Network error. Please try again."); }
    finally  { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-200/60 border border-blue-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600" />

          {/* Header */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 px-8 pt-7 pb-6 border-b border-blue-200/50 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-200/50 pointer-events-none" />
            <div className="absolute bottom-0 right-20 w-16 h-16 rounded-full bg-blue-300/30 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-teal-100/60 pointer-events-none" />

            <div className="relative z-10">
              <Link href="/" className="inline-flex mb-5">
                <img src="/logo-chatgpt.png" alt="NPS Insurance" className="h-11 w-auto object-contain" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200/70 flex items-center justify-center">
                  <UserCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">One last step</h1>
                  <p className="text-gray-500 text-sm mt-0.5">Tell us a little about yourself</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Rajesh Kumar"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                autoFocus
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="rajesh@example.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">For policy documents and renewal reminders</p>
            </div>

            <button type="submit" disabled={loading || form.name.trim().length < 2} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Complete Setup →"}
            </button>

            <p className="text-center text-xs text-gray-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> &amp; <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
