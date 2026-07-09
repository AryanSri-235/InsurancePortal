import Link from "next/link";
import BgDecorations from "./BgDecorations";
import { ShieldCheck, Heart, Car, CircleDollarSign, ChevronRight } from "lucide-react";

const calculators = [
  {
    type: "term",
    label: "Term Insurance",
    desc: "How much life cover do you need?",
    icon: <ShieldCheck className="w-7 h-7" strokeWidth={1.8} />,
    from: "from-blue-500",
    to: "to-blue-700",
    shadow: "shadow-blue-200",
    bg: "bg-blue-50",
    border: "hover:border-blue-200",
    text: "text-blue-600",
    example: "₹499/mo for ₹1 Cr cover",
  },
  {
    type: "health",
    label: "Health Insurance",
    desc: "Find the right health cover for your family",
    icon: <Heart className="w-7 h-7" strokeWidth={1.8} />,
    from: "from-blue-600",
    to: "to-indigo-700",
    shadow: "shadow-indigo-200",
    bg: "bg-blue-50",
    border: "hover:border-indigo-200",
    text: "text-blue-600",
    example: "Family floater from ₹12,000/yr",
  },
  {
    type: "motor",
    label: "Motor Insurance",
    desc: "Instant car & bike insurance quotes",
    icon: <Car className="w-7 h-7" strokeWidth={1.8} />,
    from: "from-blue-500",
    to: "to-blue-700",
    shadow: "shadow-blue-200",
    bg: "bg-blue-50",
    border: "hover:border-blue-200",
    text: "text-blue-600",
    example: "Third party from ₹2,094/yr",
  },
  {
    type: "life",
    label: "Life Insurance",
    desc: "Calculate returns on ULIP & endowment plans",
    icon: <CircleDollarSign className="w-7 h-7" strokeWidth={1.8} />,
    from: "from-blue-600",
    to: "to-indigo-700",
    shadow: "shadow-indigo-200",
    bg: "bg-blue-50",
    border: "hover:border-indigo-200",
    text: "text-blue-600",
    example: "ULIP returns up to 12% p.a.",
  },
];

export default function CalculatorCTA() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <BgDecorations variant="calculator" />
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Free Premium Calculator
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Calculate Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Premium Instantly
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get accurate premium estimates in seconds — no sign-up required.
          </p>
        </div>

        {/* Calculator cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {calculators.map((calc, i) => (
            <Link
              key={calc.type}
              href={`/calculator?type=${calc.type}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              className={`animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl p-6 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${calc.border}`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${calc.from} ${calc.to} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg ${calc.shadow} group-hover:scale-110 transition-transform duration-300`}>
                {calc.icon}
              </div>

              {/* Gradient accent line */}
              <div className={`h-0.5 w-8 bg-gradient-to-r ${calc.from} ${calc.to} rounded-full mb-4 group-hover:w-16 transition-all duration-300`} />

              <h3 className="font-black text-gray-900 text-lg mb-1">{calc.label}</h3>
              <p className="text-gray-500 text-sm flex-1 mb-4">{calc.desc}</p>

              <div className={`text-xs font-bold ${calc.text} ${calc.bg} px-3 py-2 rounded-xl mb-4`}>
                {calc.example}
              </div>

              <span className={`inline-flex items-center gap-1 text-sm font-bold ${calc.text} group-hover:gap-2 transition-all duration-200`}>
                Calculate now
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom strip — renewal reminder for existing policyholders */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-white relative">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Existing Policyholder?</p>
            <h3 className="text-2xl font-black mb-1">Track Your Policy Renewals</h3>
            <p className="text-blue-100 text-sm">Get notified before your policy expires — never miss a renewal again.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative">
            <Link
              href="/contact"
              className="bg-white text-blue-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-xl whitespace-nowrap"
            >
              Set Renewal Reminder →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
