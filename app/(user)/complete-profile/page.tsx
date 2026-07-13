"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserCircle2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", gender: "", dob: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) { setError("Please enter your full name (at least 2 characters)."); return; }
    if (!form.gender) { setError("Please select your gender."); return; }
    if (!form.dob) { setError("Please enter your date of birth."); return; }

    // Basic DOB age check — must be at least 18
    const dobDate = new Date(form.dob);
    const minAge = new Date();
    minAge.setFullYear(minAge.getFullYear() - 18);
    if (dobDate > minAge) { setError("You must be at least 18 years old."); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:   form.name.trim(),
          email:  form.email.trim() || undefined,
          gender: form.gender,
          dob:    form.dob,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/account");
      router.refresh();
    } catch { setError("Network error. Please try again."); }
    finally  { setLoading(false); }
  }

  const isValid = form.name.trim().length >= 2 && form.gender && form.dob;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-200/60 border border-blue-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600" />

          {/* Header */}
          <div className="px-8 pt-7 pb-6 relative overflow-hidden">
            <div className="relative z-10">
              <Link href="/" className="inline-flex mb-5">
                <img src="/logo-chatgpt.png" alt="NPS Insurance" className="h-11 w-auto object-contain" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">One last step</h1>
                  <p className="text-gray-500 text-sm mt-0.5">Tell us a little about yourself</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600" />

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
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

            {/* Gender + DOB side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.gender}
                  onChange={e => set("gender", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => set("dob", e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                />
              </div>
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

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
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
