"use client";

import Link from "next/link";
import { useState } from "react";
import BgDecorations from "./BgDecorations";

const categories = [
  {
    href: "/term-insurance",
    icon: "🛡️",
    title: "Term Insurance",
    subtitle: "Pure protection",
    description: "Maximum cover at minimum cost. Secure your family's future with up to ₹5 Crore cover starting ₹490/mo.",
    from: "#3b82f6", to: "#6366f1",
    badge: "Most Popular", badgeBg: "bg-blue-600",
    stat: "98%+ claim ratio", statColor: "text-blue-600",
    border: "hover:border-blue-200", glow: "hover:shadow-blue-100/80",
  },
  {
    href: "/health-insurance",
    icon: "🏥",
    title: "Health Insurance",
    subtitle: "Medical coverage",
    description: "Cashless treatment at 14,000+ hospitals. Covers OPD, maternity, and critical illness.",
    from: "#10b981", to: "#14b8a6",
    badge: "Best Value", badgeBg: "bg-emerald-600",
    stat: "14,000+ hospitals", statColor: "text-emerald-600",
    border: "hover:border-emerald-200", glow: "hover:shadow-emerald-100/80",
  },
  {
    href: "/car-insurance",
    icon: "🚗",
    title: "Car Insurance",
    subtitle: "Car & vehicle cover",
    description: "Zero depreciation, cashless repairs at 4,000+ garages, 24×7 roadside assistance. Renew instantly.",
    from: "#f97316", to: "#ef4444",
    badge: "Mandatory", badgeBg: "bg-orange-500",
    stat: "4,000+ garages", statColor: "text-orange-600",
    border: "hover:border-orange-200", glow: "hover:shadow-orange-100/80",
  },
  {
    href: "/two-wheeler-insurance",
    icon: "🛵",
    title: "2 Wheeler Insurance",
    subtitle: "Bike & scooter cover",
    description: "Mandatory TP cover + comprehensive protection for your bike or scooter. Instant policy in 2 minutes.",
    from: "#f59e0b", to: "#f97316",
    badge: "Upto 85% Discount", badgeBg: "bg-amber-500",
    stat: "Instant policy", statColor: "text-amber-600",
    border: "hover:border-amber-200", glow: "hover:shadow-amber-100/80",
  },
  {
    href: "/life-insurance",
    icon: "💰",
    title: "Life Insurance",
    subtitle: "Savings + cover",
    description: "Build wealth while protecting your family. Guaranteed returns with tax benefits under 80C.",
    from: "#8b5cf6", to: "#a855f7",
    badge: "Tax Saving", badgeBg: "bg-violet-600",
    stat: "Upto 80C benefit", statColor: "text-violet-600",
    border: "hover:border-violet-200", glow: "hover:shadow-violet-100/80",
  },
  {
    href: "/family-health-insurance",
    icon: "👨‍👩‍👧",
    title: "Family Health Insurance",
    subtitle: "Whole family covered",
    description: "One floater policy covers your entire family. Cover from ₹5 Lakh to ₹1 Crore at the best rates.",
    from: "#10b981", to: "#06b6d4",
    badge: "Lowest Price", badgeBg: "bg-emerald-600",
    stat: "Cover up to ₹1 Crore", statColor: "text-emerald-600",
    border: "hover:border-emerald-200", glow: "hover:shadow-emerald-100/80",
  },
  {
    href: "/travel-insurance",
    icon: "✈️",
    title: "Travel Insurance",
    subtitle: "Domestic & international",
    description: "Medical emergencies abroad, trip cancellation, lost baggage. Global coverage from ₹500/trip.",
    from: "#0ea5e9", to: "#06b6d4",
    badge: "From ₹500", badgeBg: "bg-sky-500",
    stat: "24x7 global assist", statColor: "text-sky-600",
    border: "hover:border-sky-200", glow: "hover:shadow-sky-100/80",
  },
  {
    href: "/term-insurance-women",
    icon: "👩",
    title: "Term Insurance (Women)",
    subtitle: "Exclusive women plans",
    description: "Up to 20% cheaper premiums for women. Get ₹1 Crore cover from ₹390/month with critical illness rider.",
    from: "#ec4899", to: "#f43f5e",
    badge: "Upto 20% Cheaper", badgeBg: "bg-pink-500",
    stat: "From ₹390/mo", statColor: "text-pink-600",
    border: "hover:border-pink-200", glow: "hover:shadow-pink-100/80",
  },
  {
    href: "/return-of-premium-plans",
    icon: "🔄",
    title: "Term Plans with ROP",
    subtitle: "Premium refund at maturity",
    description: "Get all premiums back if you survive the policy term. Life cover + guaranteed 100% refund.",
    from: "#3b82f6", to: "#6366f1",
    badge: "100% Refund", badgeBg: "bg-blue-600",
    stat: "Premium refund", statColor: "text-blue-600",
    border: "hover:border-blue-200", glow: "hover:shadow-blue-100/80",
  },
  {
    href: "/guaranteed-return-plans",
    icon: "📈",
    title: "Guaranteed Return Plans",
    subtitle: "Fixed, risk-free returns",
    description: "IRDAI-regulated plans with guaranteed 5–7% p.a. returns. No market risk. Build corpus + life cover.",
    from: "#8b5cf6", to: "#6366f1",
    badge: "Upto 7.4% Returns", badgeBg: "bg-violet-600",
    stat: "Capital guaranteed", statColor: "text-violet-600",
    border: "hover:border-violet-200", glow: "hover:shadow-violet-100/80",
  },
  {
    href: "/child-savings-plans",
    icon: "👶",
    title: "Child Savings Plans",
    subtitle: "Secure your child's future",
    description: "Build a corpus for education & marriage goals. Premium waiver if parent passes away.",
    from: "#a855f7", to: "#ec4899",
    badge: "Premium Waiver", badgeBg: "bg-purple-600",
    stat: "Guaranteed corpus", statColor: "text-purple-600",
    border: "hover:border-purple-200", glow: "hover:shadow-purple-100/80",
  },
  {
    href: "/retirement-plans",
    icon: "🏖️",
    title: "Retirement Plans",
    subtitle: "Lifelong pension income",
    description: "Guaranteed pension for life. Annuity, NPS-linked and ULIP retirement plans — all compared.",
    from: "#6366f1", to: "#8b5cf6",
    badge: "Lifelong Pension", badgeBg: "bg-indigo-600",
    stat: "Tax-free corpus", statColor: "text-indigo-600",
    border: "hover:border-indigo-200", glow: "hover:shadow-indigo-100/80",
  },
  {
    href: "/group-health-insurance",
    icon: "🏢",
    title: "Group Health Insurance",
    subtitle: "Employee benefits",
    description: "Cover your entire workforce. No waiting period, pre-existing diseases covered from day 1.",
    from: "#10b981", to: "#14b8a6",
    badge: "Upto 65% Discount", badgeBg: "bg-emerald-600",
    stat: "PED covered Day 1", statColor: "text-emerald-600",
    border: "hover:border-emerald-200", glow: "hover:shadow-emerald-100/80",
  },
  {
    href: "/home-insurance",
    icon: "🏠",
    title: "Home Insurance",
    subtitle: "Property protection",
    description: "Protect your home from fire, flood, theft & natural disasters. Structure + contents from ₹2,500/year.",
    from: "#f43f5e", to: "#ec4899",
    badge: "Upto 25% Discount", badgeBg: "bg-rose-600",
    stat: "From ₹2,500/year", statColor: "text-rose-600",
    border: "hover:border-rose-200", glow: "hover:shadow-rose-100/80",
  },
];

const INITIAL_COUNT = 8;

export default function CategoryCards() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? categories : categories.slice(0, INITIAL_COUNT);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <BgDecorations variant="categories" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">What We Cover</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Insurance for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Every Need</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Compare plans from 50+ top insurers and find the perfect fit in under 2 minutes
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {visible.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              style={{ animationDelay: `${i * 0.06}s` }}
              className={`animate-fade-in-up group relative flex flex-col bg-white border-2 border-gray-100 rounded-3xl overflow-hidden card-hover ${cat.border} hover:shadow-2xl ${cat.glow}`}
            >
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${cat.from}, ${cat.to})` }} />
              <div className="p-5 flex flex-col flex-1">
                <span className={`self-start ${cat.badgeBg} text-white text-[11px] font-bold px-2 py-0.5 rounded-full mb-4`}>
                  {cat.badge}
                </span>
                <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 origin-left">
                  {cat.icon}
                </div>
                <h3 className="font-black text-gray-900 text-base leading-tight tracking-tight">{cat.title}</h3>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 mb-2">{cat.subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed flex-1 hidden sm:block">{cat.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${cat.statColor}`}>{cat.stat}</span>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 flex items-center gap-1 transition-all duration-200">
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5 inline-block">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all / collapse toggle */}
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-7 py-3 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all duration-200 bg-white hover:shadow-md"
          >
            {showAll ? (
              <>Show less <span className="transition-transform duration-200 rotate-180 inline-block">↓</span></>
            ) : (
              <>View all products <span className="inline-block">↓</span></>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
