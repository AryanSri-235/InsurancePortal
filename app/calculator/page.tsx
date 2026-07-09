"use client";

import { useState } from "react";
import Link from "next/link";
import { type LucideIcon, Shield, HeartPulse, Car, TrendingUp, AlertTriangle } from "lucide-react";

const types: { key: string; label: string; icon: LucideIcon; from: string; to: string; activeBg: string }[] = [
  { key: "term", label: "Term Insurance", icon: Shield, from: "#3b82f6", to: "#6366f1", activeBg: "bg-blue-50 border-blue-300 text-blue-700" },
  { key: "health", label: "Health Insurance", icon: HeartPulse, from: "#10b981", to: "#14b8a6", activeBg: "bg-emerald-50 border-emerald-300 text-emerald-700" },
  { key: "motor", label: "Motor Insurance", icon: Car, from: "#f97316", to: "#f59e0b", activeBg: "bg-orange-50 border-orange-300 text-orange-700" },
  { key: "life", label: "Life Insurance", icon: TrendingUp, from: "#8b5cf6", to: "#a855f7", activeBg: "bg-violet-50 border-violet-300 text-violet-700" },
];

function TermCalc() {
  const [age, setAge] = useState(30);
  const [cover, setCover] = useState(1);
  const [term, setTerm] = useState(30);
  const [smoker, setSmoker] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");

  const ageFactor = age < 35 ? 1 : age < 45 ? 1.4 : 1.9;
  const smokerFactor = smoker ? 1.5 : 1;
  const genderFactor = gender === "female" ? 0.9 : 1;
  const estimated = Math.round((cover * 100000 * 0.0005 * ageFactor * smokerFactor * genderFactor) / 12);
  const yearly = estimated * 12;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-7">
        <div className="grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map(g => (
            <button key={g} onClick={() => setGender(g)}
              className={`py-2.5 rounded-xl font-bold text-sm border-2 capitalize transition-all duration-200 ${gender === g ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-200"}`}>
              {g === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Your Age: <span className="text-blue-600">{age} years</span></label>
          <input type="range" min={18} max={65} value={age} onChange={e => setAge(+e.target.value)} className="w-full accent-blue-600 h-2" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>18 yrs</span><span>65 yrs</span></div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Cover Amount: <span className="text-blue-600">₹{cover >= 1 ? `${cover} Crore` : `${cover * 100} Lakh`}</span></label>
          <input type="range" min={0.5} max={5} step={0.5} value={cover} onChange={e => setCover(+e.target.value)} className="w-full accent-blue-600 h-2" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹50 Lakh</span><span>₹5 Crore</span></div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Policy Term: <span className="text-blue-600">{term} years</span></label>
          <input type="range" min={10} max={40} step={5} value={term} onChange={e => setTerm(+e.target.value)} className="w-full accent-blue-600 h-2" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10 yrs</span><span>40 yrs</span></div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${smoker ? "bg-blue-600" : "bg-gray-200"}`}
            onClick={() => setSmoker(!smoker)}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${smoker ? "translate-x-4" : ""}`} />
          </div>
          <span className="text-sm font-bold text-gray-700">I smoke / use tobacco</span>
          {smoker && <span className="text-xs text-orange-500 font-semibold">+50% premium</span>}
        </label>
      </div>

      {/* Result panel */}
      <div className="flex flex-col gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-7 text-center flex-1">
          <p className="text-sm text-gray-500 mb-1 font-medium">Estimated monthly premium</p>
          <p className="text-6xl font-black text-blue-600 my-3">₹{estimated.toLocaleString("en-IN")}</p>
          <p className="text-gray-400 text-xs mb-5">≈ ₹{yearly.toLocaleString("en-IN")} / year · *indicative</p>
          <div className="space-y-2 text-left border-t border-blue-100 pt-4 mb-5">
            {[
              ["Cover", `₹${cover} Crore`],
              ["Term", `${term} years`],
              ["Age", `${age} years`],
              ["Gender", gender.charAt(0).toUpperCase() + gender.slice(1)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="font-bold text-gray-900">{v}</span>
              </div>
            ))}
          </div>
          <Link href="/#lead-form" className="btn-shine block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 text-sm">
            See Matching Plans →
          </Link>
        </div>
        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
          <p className="text-xs text-amber-700 font-medium"><AlertTriangle className="w-4 h-4 inline mr-1" /> Estimates are indicative. Actual premiums depend on medical underwriting, smoker status, and insurer pricing.</p>
        </div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [active, setActive] = useState("term");
  const activeType = types.find(t => t.key === active)!;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Premium Calculator</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Calculate Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="text-gray-500 text-lg">Get an instant estimate in seconds — no personal details required.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Type selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {types.map((t) => (
              <button key={t.key} onClick={() => setActive(t.key)}
                className={`group flex flex-col items-center gap-2 border-2 rounded-2xl p-5 transition-all duration-200 font-bold text-sm card-hover ${
                  active === t.key ? t.activeBg : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:shadow-lg"
                }`}>
                <t.icon className={`w-8 h-8 transition-transform duration-300 ${active === t.key ? "scale-110" : "group-hover:scale-105"}`} />
                <span>{t.label}</span>
                {active === t.key && (
                  <div className="w-6 h-1 rounded-full" style={{ background: `linear-gradient(to right, ${t.from}, ${t.to})` }} />
                )}
              </button>
            ))}
          </div>

          {/* Calculator panel */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/60">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${activeType.from}, ${activeType.to})` }}>
                <activeType.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{activeType.label} Calculator</h2>
                <p className="text-sm text-gray-400">Adjust the sliders to estimate your premium</p>
              </div>
            </div>

            {active === "term" ? (
              <TermCalc />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${activeType.from}, ${activeType.to})` }}>
                  <activeType.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">{activeType.label} Calculator</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">This calculator is coming soon. Our advisors can give you an instant quote right now.</p>
                <Link href="/#lead-form" className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-7 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200">
                  Get Free Quote →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Ready?</p>
            <h2 className="text-4xl font-black mb-3">See Real Plans Matching Your Budget</h2>
            <p className="text-blue-100 mb-8">Compare actual policies from 50+ insurers — takes under 2 minutes.</p>
            <Link href="/#lead-form" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-xl inline-block text-lg">
              Compare Plans Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
