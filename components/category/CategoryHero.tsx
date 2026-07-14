"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { CategoryConfig } from "@/lib/category-config";
import { Loader2 } from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  age: string;
  gender: "Male" | "Female" | "";
  income: string;
  smoke: "Yes" | "No" | "";
}

// Map config accent to Tailwind badge classes (light bg, colored text/border)
const ACCENT_CLASSES: Record<string, { badge: string; dot: string; btn: string; underline: string }> = {
  blue:   { badge: "bg-blue-50 border-blue-200 text-blue-700",   dot: "bg-blue-600",   btn: "from-blue-600 to-blue-700",   underline: "#2563EB" },
  green:  { badge: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-600",  btn: "from-green-600 to-green-700",  underline: "#16A34A" },
  teal:   { badge: "bg-teal-50 border-teal-200 text-teal-700",   dot: "bg-teal-600",   btn: "from-teal-600 to-teal-700",   underline: "#0D9488" },
  orange: { badge: "bg-orange-50 border-orange-200 text-orange-700", dot: "bg-orange-600", btn: "from-orange-500 to-orange-600", underline: "#EA580C" },
  violet: { badge: "bg-violet-50 border-violet-200 text-violet-700", dot: "bg-violet-600", btn: "from-violet-600 to-violet-700", underline: "#7C3AED" },
  red:    { badge: "bg-red-50 border-red-200 text-red-700",       dot: "bg-red-600",    btn: "from-red-600 to-red-700",     underline: "#DC2626" },
  indigo: { badge: "bg-indigo-50 border-indigo-200 text-indigo-700", dot: "bg-indigo-600", btn: "from-indigo-600 to-indigo-700", underline: "#4F46E5" },
  sky:    { badge: "bg-sky-50 border-sky-200 text-sky-700",       dot: "bg-sky-600",    btn: "from-sky-500 to-sky-600",     underline: "#0284C7" },
};

const FALLBACK = ACCENT_CLASSES.blue;

export default function CategoryHero({ config }: { config: CategoryConfig }) {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", age: "", gender: "", income: "", smoke: "" });
  const [loading, setLoading] = useState(false);

  const accent = ACCENT_CLASSES[config.color.accent ?? "blue"] ?? FALLBACK;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Please enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, category: config.slug, leadType: "quote" }),
      });
      if (res.ok) {
        setForm({ name: "", phone: "", age: "", gender: "", income: "", smoke: "" });
        Swal.fire({
          icon: "success",
          title: "You're all set!",
          html: `Our advisor will call you within <b>30 minutes</b> with the best ${config.label} quotes.<br/><br/><small style="color:#9ca3af">No spam · No pressure</small>`,
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Great!",
        });
      } else {
        Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please try again.", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Network Error", text: "Please check your connection and try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* ── Left copy ── */}
          <div>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border ${accent.badge} text-sm font-semibold shadow-sm`}>
              <span className={`w-2 h-2 ${accent.dot} rounded-full animate-pulse`} />
              {config.emoji} {config.label}
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.07] tracking-tight mb-5">
              {(() => {
                const words = config.headline.split(" ");
                if (words.length <= 1) return config.headline;
                const first = words.slice(0, -1).join(" ");
                const rest  = words[words.length - 1];
                return (
                  <>
                    {first}{" "}
                    <span className="relative whitespace-nowrap">
                      <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {rest}
                      </span>
                      <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="8" viewBox="0 0 220 8" fill="none">
                        <path d="M2 6 Q55 1 110 5 Q165 9 218 4" stroke={`url(#hg-${config.slug})`} strokeWidth="3" strokeLinecap="round"/>
                        <defs>
                          <linearGradient id={`hg-${config.slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#186874"/>
                            <stop offset="100%" stopColor="#004aad"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </>
                );
              })()}
            </h1>

            {/* Subheadline */}
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              {config.subheadline}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {config.trustBadges.map((badge, i) => {
                const text = typeof badge === "string" ? badge : ((badge as Record<string, string>).label ?? (badge as Record<string, string>).text ?? "");
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700">
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {text}
                  </span>
                );
              })}
            </div>

            {/* Highlight stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {config.highlights.slice(0, 4).map((h, i) => {
                const icon  = typeof h === "string" ? "" : ((h as Record<string, string>).icon ?? "");
                const value = typeof h === "string" ? h  : ((h as Record<string, string>).value ?? (h as Record<string, string>).title ?? "");
                const label = typeof h === "string" ? "" : ((h as Record<string, string>).label ?? (h as Record<string, string>).description ?? "");
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                    {icon && <div className="text-2xl mb-1.5">{icon}</div>}
                    <div className="font-bold text-sm text-gray-900 leading-tight">{value}</div>
                    {label && <div className="text-gray-400 text-xs mt-0.5">{label}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Form card ── */}
          <div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl blur-xl opacity-60" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Get Best {config.label} Quotes</h2>
                  <p className="text-gray-400 text-sm mt-1">Free expert advice · Takes 30 seconds</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 transition-colors"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Your age"
                      min={18} max={75}
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 transition-colors"
                    />
                    <select
                      value={form.income}
                      onChange={(e) => setForm({ ...form, income: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-gray-700 transition-colors"
                    >
                      <option value="">Annual Income</option>
                      <option value="lt3">{"< ₹3 LPA"}</option>
                      <option value="3-5">₹3–5 LPA</option>
                      <option value="5-10">₹5–10 LPA</option>
                      <option value="10-25">₹10–25 LPA</option>
                      <option value="25+">₹25 LPA+</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-2">Gender</p>
                      <div className="flex gap-2">
                        {(["Male", "Female"] as const).map((g) => (
                          <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                            className={`flex-1 border rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${form.gender === g ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50"}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-2">Tobacco / Smoke?</p>
                      <div className="flex gap-2">
                        {(["No", "Yes"] as const).map((s) => (
                          <button key={s} type="button" onClick={() => setForm({ ...form, smoke: s })}
                            className={`flex-1 border rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${form.smoke === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                      required
                      className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : `Get Free ${config.label} Quotes →`}
                  </button>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      {[["bg-blue-500","A"],["bg-indigo-600","R"],["bg-blue-600","S"]].map(([c,l], i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{l}</div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Advisors reply in <span className="text-gray-700 font-semibold">under 30 min</span></p>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
