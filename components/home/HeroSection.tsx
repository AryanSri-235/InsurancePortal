"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import BgDecorations from "./BgDecorations";

const CATEGORIES = [
  { value: "term",   label: "Term Insurance",   icon: "🛡️" },
  { value: "health", label: "Health Insurance",  icon: "🏥" },
  { value: "motor",  label: "Motor Insurance",   icon: "🚗" },
  { value: "life",   label: "Life Insurance",    icon: "💰" },
];

const TRUST = [
  { num: 50,   suffix: "+",     prefix: "",  label: "Insurers",       icon: "🏢", color: "from-blue-500 to-indigo-500",    shadow: "shadow-blue-100"   },
  { num: 500,  suffix: "Cr+",   prefix: "₹", label: "Claims Settled", icon: "✅", color: "from-emerald-500 to-teal-500",  shadow: "shadow-emerald-100" },
  { num: 1,    suffix: "L+",    prefix: "",  label: "Customers",      icon: "👥", color: "from-orange-500 to-amber-500",  shadow: "shadow-orange-100"  },
  { num: 99,   suffix: "%",     prefix: "",  label: "Claim Support",  icon: "🛡️", color: "from-violet-500 to-purple-500", shadow: "shadow-violet-100"  },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatBox({ stat, started }: { stat: typeof TRUST[0]; started: boolean }) {
  const count = useCountUp(stat.num, 1400, started);
  return (
    <div className={`group w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 text-center hover:shadow-xl ${stat.shadow} hover:-translate-y-1.5 hover:border-transparent transition-all duration-300 cursor-default relative overflow-hidden`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />
      <div className="text-2xl mb-2">{stat.icon}</div>
      <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-none`}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div className="text-sm text-gray-400 font-medium mt-1">{stat.label}</div>
    </div>
  );
}

export default function HeroSection() {
  const [form, setForm]       = useState({ name: "", phone: "", category: "term" });
  const [loading, setLoading] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Please enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, leadType: "quote" }) });
      if (res.ok) {
        setForm({ name: "", phone: "", category: "term" });
        Swal.fire({
          icon: "success",
          title: "You're all set! 🎉",
          text: "Our advisor will call you within 30 minutes.",
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
    <section id="lead-form" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-[88vh] flex items-center">
      <BgDecorations variant="hero" />
      <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #bfdbfe, transparent)" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #c7d2fe, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #93c5fd, transparent)" }} />
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left copy ── */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              India's #1 Insurance Comparison Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.07] tracking-tight mb-6">
              Protect What{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Matters</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="8" viewBox="0 0 220 8" fill="none">
                  <path d="M2 6 Q55 1 110 5 Q165 9 218 4" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round"/>
                  <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs>
                </svg>
              </span>
              {" "}Most.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
              Compare 200+ plans from India's top insurers in seconds. Unbiased advice, guaranteed best price, and hassle-free claim support.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-12">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.value}
                  href={`/${c.value}-insurance`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-sm font-semibold text-gray-700 hover:text-blue-700 transition-all duration-200 shadow-sm"
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right — Form card ── */}
          <div className="animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl blur-xl opacity-60" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 p-8">
                <div className="mb-7">
                  <h2 className="text-2xl font-bold text-gray-900">Get Free Quote</h2>
                  <p className="text-gray-400 text-sm mt-1">No spam · No hidden charges · 100% free</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: c.value })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                          form.category === c.value
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <span>{c.icon}</span>
                        <span className="text-xs">{c.label}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-gray-50 hover:border-gray-300 transition-colors"
                  />

                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                      required
                      className="flex-1 border-2 border-gray-200 rounded-r-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-gray-50 hover:border-gray-300 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shine w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Submitting...
                      </span>
                    ) : "Get My Free Quote →"}
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {[["bg-blue-500","A"],["bg-emerald-500","R"],["bg-violet-500","S"]].map(([c,l], i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{l}</div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Advisors reply in <span className="text-gray-700 font-semibold">under 30 min</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Full-width stats strip below the grid ── */}
        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-10 border-t border-blue-100/60">
          {TRUST.map((t) => (
            <StatBox key={t.label} stat={t} started={statsStarted} />
          ))}
        </div>

      </div>
    </section>
  );
}
