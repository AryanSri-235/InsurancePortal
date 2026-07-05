import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | InsurancePortal",
  description: "Learn about InsurancePortal — India's trusted IRDAI-registered insurance comparison platform.",
};

const stats = [
  { value: "1L+", label: "Happy Customers", icon: "😊", bg: "bg-blue-50 border-blue-100", color: "text-blue-600" },
  { value: "50+", label: "Insurance Partners", icon: "🤝", bg: "bg-indigo-50 border-indigo-100", color: "text-indigo-600" },
  { value: "200+", label: "Plans Available", icon: "📋", bg: "bg-emerald-50 border-emerald-100", color: "text-emerald-600" },
  { value: "99%", label: "Claim Support Rate", icon: "✅", bg: "bg-violet-50 border-violet-100", color: "text-violet-600" },
];

const values = [
  { icon: "🎯", title: "Truly Unbiased", desc: "We never push a plan for commission. Our only goal is your best interest.", from: "#3b82f6", to: "#6366f1", accent: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80", iconBg: "bg-blue-50" },
  { icon: "🔐", title: "Privacy First", desc: "Your data is never sold. 256-bit encryption on every interaction.", from: "#10b981", to: "#14b8a6", accent: "border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100/80", iconBg: "bg-emerald-50" },
  { icon: "📞", title: "Always There", desc: "Expert advisors available Mon–Sat 9 AM–7 PM. Claim support 24×7.", from: "#f97316", to: "#f59e0b", accent: "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/80", iconBg: "bg-orange-50" },
  { icon: "🏆", title: "IRDAI Compliant", desc: "Fully licensed IRDAI Web Aggregator. Every recommendation is regulation-compliant.", from: "#8b5cf6", to: "#a855f7", accent: "border-violet-200 hover:border-violet-300 hover:shadow-violet-100/80", iconBg: "bg-violet-50" },
];

const team = [
  { name: "Rajesh Mehta", role: "CEO & Co-Founder", avatar: "RM", color: "from-blue-500 to-indigo-600" },
  { name: "Priya Sharma", role: "Head of Advisory", avatar: "PS", color: "from-emerald-500 to-teal-600" },
  { name: "Amit Verma", role: "CTO", avatar: "AV", color: "from-violet-500 to-purple-600" },
  { name: "Sunita Patel", role: "Customer Experience", avatar: "SP", color: "from-rose-500 to-pink-600" },
];

const milestones = [
  { year: "2020", event: "Founded in Mumbai with a mission to simplify insurance" },
  { year: "2021", event: "IRDAI Web Aggregator license obtained (WBA000000)" },
  { year: "2022", event: "Crossed 10,000 happy customers and 20 insurance partners" },
  { year: "2023", event: "Launched 24×7 claim support and expanded to motor insurance" },
  { year: "2024", event: "Crossed 50,000 customers. Introduced health family floater comparison" },
  { year: "2026", event: "1 lakh+ customers. 50+ partners. India's most trusted portal" },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-5">
            India&apos;s Most Trusted{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Insurance Platform
            </span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed max-w-2xl mx-auto">
            We built InsurancePortal because buying insurance in India was broken — confusing, biased, and full of jargon. We fixed that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={s.label} style={{ animationDelay: `${i * 0.08}s` }}
                className={`animate-fade-in-up group border-2 rounded-2xl p-6 text-center card-hover ${s.bg}`}>
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-5">
                Started with a{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  simple question
                </span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                In 2020, our founders tried to buy term insurance for their families and got lost in a maze of agents, jargon, and hidden fees. They spent weeks comparing plans manually — something that should take minutes.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                So they built InsurancePortal: a platform that compares 200+ plans from 50+ IRDAI-registered insurers in real-time, with zero bias and zero spam. Today, over 1 lakh Indians trust us to protect what matters most.
              </p>
              <Link href="/#lead-form" className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                Get Free Quote →
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-10 text-center card-hover">
              <div className="text-6xl mb-5">🛡️</div>
              <p className="text-2xl font-black text-gray-900 mb-2">IRDAI Registered</p>
              <p className="text-gray-500 text-sm mb-1">Web Aggregator License No.</p>
              <p className="text-blue-600 font-bold">WBA000000</p>
              <div className="mt-5 pt-5 border-t border-blue-100 text-xs text-gray-400">
                Regulated by the Insurance Regulatory and Development Authority of India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Values</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={v.title} style={{ animationDelay: `${i * 0.08}s` }}
                className={`animate-fade-in-up group bg-white border-2 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default ${v.accent}`}>
                <div className={`w-14 h-14 rounded-2xl ${v.iconBg} flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  {v.icon}
                </div>
                <div className="h-0.5 w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                  style={{ background: `linear-gradient(to right, ${v.from}, ${v.to})` }} />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Journey</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Milestones</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-transparent" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} style={{ animationDelay: `${i * 0.1}s` }}
                  className="animate-fade-in-up flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300 z-10">
                    {m.year}
                  </div>
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex-1 group-hover:border-blue-100 group-hover:shadow-lg transition-all duration-300 mt-2">
                    <p className="text-gray-700 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">The Team</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              People Behind{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">the Portal</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={t.name} style={{ animationDelay: `${i * 0.08}s` }}
                className="animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl p-6 text-center hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/80 hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-lg mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {t.avatar}
                </div>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Start Today</p>
            <h2 className="text-4xl font-black mb-3">Ready to find the right plan?</h2>
            <p className="text-blue-100 mb-8 text-lg">Compare 200+ plans from 50+ insurers — free, in under 2 minutes.</p>
            <Link href="/#lead-form" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors duration-200 inline-block shadow-xl text-lg">
              Get Free Quote →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
