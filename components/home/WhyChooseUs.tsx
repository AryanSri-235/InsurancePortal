import BgDecorations from "./BgDecorations";
import { Award, Lock, Zap, Target, Phone, PiggyBank } from "lucide-react";

const reasons = [
  { icon: Award,    title: "IRDAI Registered",    description: "Licensed web aggregator fully regulated by IRDAI. Your data is protected and compliant with all regulations.", accent: "blue"  },
  { icon: Lock,     title: "256-bit Encryption",  description: "Bank-grade security on every interaction. Your personal data is never sold or shared without consent.",         accent: "green" },
  { icon: Zap,      title: "Instant Comparison",  description: "Compare 200+ plans from 50+ insurers in real-time. Sort by price, claim ratio, features — instantly.",         accent: "blue"  },
  { icon: Target,   title: "Truly Unbiased",       description: "We don't sell — we compare. Our advisors recommend the best plan for your needs, not the highest commission.", accent: "green" },
  { icon: Phone,    title: "24×7 Claim Support",   description: "Dedicated claim support from first notice to final settlement. We're with you every step of the way.",        accent: "blue"  },
  { icon: PiggyBank, title: "Save Up to 40%",      description: "Customers who compare online save an average of 40% on premiums vs. buying directly from the insurer.",       accent: "green" },
];

const A = {
  blue:  { border: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80",  iconBg: "bg-blue-50",  bar: "#2563eb" },
  green: { border: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80", iconBg: "bg-blue-50", bar: "#186874" },
};

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <BgDecorations variant="whyUs" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Promise</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Why <span className="text-blue-600">NPS Insurance.Life?</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-lg mx-auto">Built around your interests — not ours</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => {
            const s = A[r.accent as "blue" | "green"];
            const Icon = r.icon;
            return (
              <div
                key={i}
                style={{ animationDelay: `${i * 0.08}s` }}
                className={`animate-fade-in-up group bg-white border-2 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default ${s.border}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="h-0.5 w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16" style={{ background: s.bar }} />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
