import BgDecorations from "./BgDecorations";

const reasons = [
  {
    icon: "🏆",
    title: "IRDAI Registered",
    description: "Licensed web aggregator fully regulated by IRDAI. Your data is protected and compliant with all regulations.",
    from: "#3b82f6", to: "#6366f1",
    accent: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80",
    iconBg: "bg-blue-50",
  },
  {
    icon: "🔐",
    title: "256-bit Encryption",
    description: "Bank-grade security on every interaction. Your personal data is never sold or shared without consent.",
    from: "#10b981", to: "#14b8a6",
    accent: "border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100/80",
    iconBg: "bg-emerald-50",
  },
  {
    icon: "⚡",
    title: "Instant Comparison",
    description: "Compare 200+ plans from 50+ insurers in real-time. Sort by price, claim ratio, features — instantly.",
    from: "#f97316", to: "#f59e0b",
    accent: "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/80",
    iconBg: "bg-orange-50",
  },
  {
    icon: "🎯",
    title: "Truly Unbiased",
    description: "We don't sell — we compare. Our advisors recommend the best plan for your needs, not the highest commission.",
    from: "#8b5cf6", to: "#a855f7",
    accent: "border-violet-200 hover:border-violet-300 hover:shadow-violet-100/80",
    iconBg: "bg-violet-50",
  },
  {
    icon: "📞",
    title: "24×7 Claim Support",
    description: "Dedicated claim support from first notice to final settlement. We're with you every step of the way.",
    from: "#ec4899", to: "#f43f5e",
    accent: "border-pink-200 hover:border-pink-300 hover:shadow-pink-100/80",
    iconBg: "bg-pink-50",
  },
  {
    icon: "💸",
    title: "Save Up to 40%",
    description: "Customers who compare online save an average of 40% on premiums vs. buying directly from the insurer.",
    from: "#14b8a6", to: "#22d3ee",
    accent: "border-teal-200 hover:border-teal-300 hover:shadow-teal-100/80",
    iconBg: "bg-teal-50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <BgDecorations variant="whyUs" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Promise</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Why{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InsurancePortal?
            </span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-lg mx-auto">
            Built around your interests — not ours
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.08}s` }}
              className={`animate-fade-in-up group bg-white border-2 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default ${r.accent}`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${r.iconBg} flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
              >
                {r.icon}
              </div>

              {/* Gradient accent line */}
              <div
                className="h-0.5 w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                style={{ background: `linear-gradient(to right, ${r.from}, ${r.to})` }}
              />

              <h3 className="font-bold text-gray-900 text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
