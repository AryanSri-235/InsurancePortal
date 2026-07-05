"use client";

import { useState } from "react";

const TYPES = [
  { value: "term",   label: "Term" },
  { value: "health", label: "Health" },
  { value: "motor",  label: "Motor" },
  { value: "life",   label: "Life" },
];

export default function LeadCaptureStrip() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", category: "term" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, leadType: "quote", utmSource: "lead_strip" }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const d = await res.json();
        setError(d.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
      {/* Decorative rings */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border-[32px] border-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full border-[32px] border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[1px] border-white/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">We&apos;ll call you shortly!</h3>
            <p className="text-blue-200 text-sm">Our advisor will reach out within 30 minutes with your free quote.</p>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center mb-8">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Free Quote — No Spam</p>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                Get Your Free Insurance Quote
              </h2>
              <p className="text-blue-200 text-sm mt-2">Talk to a certified advisor within 30 minutes</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Insurance type tabs */}
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: t.value })}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-150 border-2 ${
                      form.category === t.value
                        ? "bg-white text-blue-700 border-white shadow-lg"
                        : "border-white/30 text-white hover:border-white/60"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="flex-1 bg-white/15 border-2 border-white/25 text-white placeholder-blue-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/60 hover:border-white/40 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email address (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="flex-1 bg-white/15 border-2 border-white/25 text-white placeholder-blue-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/60 hover:border-white/40 transition-colors"
                />
                <div className="flex flex-1">
                  <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-white/25 bg-white/10 text-blue-100 text-sm font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    required
                    className="flex-1 bg-white/15 border-2 border-l-0 border-white/25 text-white placeholder-blue-200 rounded-r-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/60 hover:border-white/40 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shine bg-white text-blue-700 font-black px-8 py-3.5 rounded-xl hover:bg-blue-50 disabled:opacity-60 transition-all duration-200 shadow-xl whitespace-nowrap text-sm"
                >
                  {loading ? "Sending…" : "Get Free Quote →"}
                </button>
              </div>

              {error && (
                <p className="text-red-200 text-xs mt-3 text-center bg-red-500/20 border border-red-300/20 rounded-xl py-2 px-4">
                  {error}
                </p>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5 text-blue-200 text-xs">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  100% Free
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  No Spam Calls
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  IRDAI Registered
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  256-bit SSL Secure
                </span>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
