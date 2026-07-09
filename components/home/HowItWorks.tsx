import { HeartHandshake, GitCompare, BadgeCheck, ArrowRight } from "lucide-react";
import BgDecorations from "./BgDecorations";

const steps = [
  {
    num: "01",
    title: "Tell us your needs",
    description: "Share basic details — age, coverage amount, budget. Takes under 2 minutes.",
    Icon: HeartHandshake,
    from: "#2563eb", to: "#1d4ed8",
    bg: "bg-blue-50 border-blue-100",
  },
  {
    num: "02",
    title: "Compare instantly",
    description: "We surface the best plans from 50+ insurers ranked by price, claim ratio & features.",
    Icon: GitCompare,
    from: "#186874", to: "#004aad",
    bg: "bg-blue-50 border-blue-100",
  },
  {
    num: "03",
    title: "Buy & relax",
    description: "Buy in minutes online. Your dedicated advisor handles everything — docs, claims, renewals.",
    Icon: BadgeCheck,
    from: "#2563eb", to: "#1d4ed8",
    bg: "bg-blue-50 border-blue-100",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <BgDecorations variant="howItWorks" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Insured in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">3 Steps</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">From browsing to coverage in under 15 minutes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 z-0" />

          {steps.map((s, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.15}s` }}
              className="animate-fade-in-up relative z-10 group"
            >
              <div className={`border-2 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-100/80 transition-all duration-300 bg-white ${s.bg}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <s.Icon className="w-7 h-7 text-gray-900" strokeWidth={1.75} />
                  </div>
                  <span className="text-5xl font-black text-gray-100 select-none">{s.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="#lead-form"
            className="btn-shine inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl shadow-blue-200 hover:-translate-y-0.5"
          >
            Start Comparing Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
