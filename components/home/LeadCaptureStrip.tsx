"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle } from "lucide-react";

const TYPES = [
  { value: "term",   label: "Term" },
  { value: "health", label: "Health" },
  { value: "motor",  label: "Motor" },
  { value: "life",   label: "Life" },
];

export default function LeadCaptureStrip() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", category: "term" });
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
        body: JSON.stringify({ ...form, leadType: "quote", utmSource: "lead_strip" }),
      });
      if (res.ok) {
        setForm({ name: "", phone: "", email: "", category: "term" });
        Swal.fire({
          icon: "success",
          title: "We'll call you shortly!",
          text: "Our advisor will reach out within 30 minutes with your free quote.",
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Got it!",
        });
      } else {
        const d = await res.json();
        Swal.fire({ icon: "error", title: "Oops!", text: d.error ?? "Something went wrong. Please try again.", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Network Error", text: "Please check your connection and try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full border-[32px] border-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full border-[32px] border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[1px] border-white/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Free Quote — No Spam</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            Get Your Free Insurance Quote
          </h2>
          <p className="text-blue-200 text-sm mt-2">Talk to a certified advisor within 30 minutes</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5 text-blue-200 text-xs">
            {["100% Free", "No Spam Calls", "IRDAI Registered", "256-bit SSL Secure"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
