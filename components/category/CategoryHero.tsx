"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { CategoryConfig } from "@/lib/category-config";

interface FormState {
  name: string;
  phone: string;
  age: string;
  gender: "Male" | "Female" | "";
  income: string;
  smoke: "Yes" | "No" | "";
}

export default function CategoryHero({ config }: { config: CategoryConfig }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    age: "",
    gender: "",
    income: "",
    smoke: "",
  });
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          category: config.slug,
          leadType: "quote",
        }),
      });
      if (res.ok) {
        setForm({ name: "", phone: "", age: "", gender: "", income: "", smoke: "" });
        Swal.fire({
          icon: "success",
          title: "You're all set! 🎉",
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

  const heroBg = config.color.bg ?? config.color.gradient ?? "from-blue-700 to-indigo-700";
  const heroBadgeBg = config.color.badge ?? "bg-white/20 text-white";
  const heroBadgeText = config.color.badgeText ?? config.label;

  return (
    <section className={`relative bg-gradient-to-br ${heroBg} text-white overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div>
            <div className={`inline-block ${heroBadgeBg} rounded-full px-4 py-1.5 text-xs font-semibold mb-5`}>
              {config.emoji} {heroBadgeText}
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-5">
              {config.headline}
            </h1>

            <p className="text-white/80 text-base lg:text-lg mb-7 leading-relaxed">
              {config.subheadline}
            </p>

            <div className="flex flex-wrap gap-3 mb-9">
              {config.trustBadges.map((badge, i) => {
                const text = typeof badge === "string" ? badge : ((badge as Record<string, string>).label ?? (badge as Record<string, string>).text ?? "");
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5 text-green-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {text}
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {config.highlights.slice(0, 4).map((h, i) => {
                const icon  = typeof h === "string" ? "" : ((h as Record<string, string>).icon ?? "");
                const value = typeof h === "string" ? h  : ((h as Record<string, string>).value ?? (h as Record<string, string>).title ?? "");
                const label = typeof h === "string" ? "" : ((h as Record<string, string>).label ?? (h as Record<string, string>).description ?? "");
                return (
                  <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
                    {icon && <div className="text-2xl mb-1.5">{icon}</div>}
                    <div className="font-bold text-sm leading-tight">{value}</div>
                    <div className="text-white/70 text-xs mt-0.5">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Mini lead form card */}
          <div className="bg-white rounded-3xl shadow-2xl p-7 text-gray-900">
            <h2 className="text-xl font-bold mb-0.5 text-gray-900">
              Get Best {config.label} Quotes
            </h2>
            <p className="text-gray-400 text-xs mb-5">Free expert advice · Takes 30 seconds</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">

                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Your age"
                    min={18}
                    max={75}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                  />
                </div>

                <div>
                  <select
                    value={form.income}
                    onChange={(e) => setForm({ ...form, income: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-700"
                  >
                    <option value="">Annual Income</option>
                    <option value="lt3">{"< ₹3 LPA"}</option>
                    <option value="3-5">₹3–5 LPA</option>
                    <option value="5-10">₹5–10 LPA</option>
                    <option value="10-25">₹10–25 LPA</option>
                    <option value="25+">₹25 LPA+</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1.5">Gender</p>
                  <div className="flex gap-2">
                    {(["Male", "Female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                          form.gender === g
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1.5">Tobacco / Smoke?</p>
                  <div className="flex gap-2">
                    {(["No", "Yes"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, smoke: s })}
                        className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                          form.smoke === s
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                      }
                      required
                      className="flex-1 border-2 border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${config.color.bg} text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-md`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Submitting...
                  </span>
                ) : `Get Free ${config.label} Quotes →`}
              </button>

              <p className="text-xs text-gray-400 text-center font-medium">
                100% Free · No Spam · IRDAI Registered
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
