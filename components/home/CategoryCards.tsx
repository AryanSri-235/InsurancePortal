"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield, HeartPulse, Car, Bike, TrendingUp, Users,
  Plane, UserCheck, RefreshCw, BarChart2, Baby,
  Umbrella, Building2, Home, type LucideIcon,
} from "lucide-react";
import BgDecorations from "./BgDecorations";

interface Category {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  stat: string;
  accent: "blue" | "green";
}

const categories: Category[] = [
  { href: "/term-insurance",          icon: Shield,      title: "Term Insurance",          subtitle: "Pure protection",           description: "Maximum cover at minimum cost. Secure your family's future with up to ₹5 Crore cover starting ₹490/mo.",            badge: "Most Popular",       stat: "98%+ claim ratio",     accent: "blue"  },
  { href: "/health-insurance",        icon: HeartPulse,  title: "Health Insurance",        subtitle: "Medical coverage",          description: "Cashless treatment at 14,000+ hospitals. Covers OPD, maternity, and critical illness.",                            badge: "Best Value",         stat: "14,000+ hospitals",   accent: "green" },
  { href: "/car-insurance",           icon: Car,         title: "Car Insurance",           subtitle: "Car & vehicle cover",       description: "Zero depreciation, cashless repairs at 4,000+ garages, 24×7 roadside assistance. Renew instantly.",                 badge: "Mandatory",          stat: "4,000+ garages",      accent: "blue"  },
  { href: "/two-wheeler-insurance",   icon: Bike,        title: "2 Wheeler Insurance",     subtitle: "Bike & scooter cover",      description: "Mandatory TP cover + comprehensive protection for your bike or scooter. Instant policy in 2 minutes.",              badge: "Upto 85% Discount",  stat: "Instant policy",      accent: "green" },
  { href: "/life-insurance",          icon: TrendingUp,  title: "Life Insurance",          subtitle: "Savings + cover",           description: "Build wealth while protecting your family. Guaranteed returns with tax benefits under 80C.",                        badge: "Tax Saving",         stat: "Upto 80C benefit",    accent: "blue"  },
  { href: "/family-health-insurance", icon: Users,       title: "Family Health Insurance", subtitle: "Whole family covered",      description: "One floater policy covers your entire family. Cover from ₹5 Lakh to ₹1 Crore at the best rates.",                  badge: "Lowest Price",       stat: "Cover up to ₹1 Crore", accent: "green" },
  { href: "/travel-insurance",        icon: Plane,       title: "Travel Insurance",        subtitle: "Domestic & international",  description: "Medical emergencies abroad, trip cancellation, lost baggage. Global coverage from ₹500/trip.",                    badge: "From ₹500",          stat: "24x7 global assist",  accent: "blue"  },
  { href: "/term-insurance-women",    icon: UserCheck,   title: "Term Insurance (Women)",  subtitle: "Exclusive women plans",     description: "Up to 20% cheaper premiums for women. Get ₹1 Crore cover from ₹390/month with critical illness rider.",             badge: "Upto 20% Cheaper",   stat: "From ₹390/mo",        accent: "green" },
  { href: "/return-of-premium-plans", icon: RefreshCw,   title: "Term Plans with ROP",     subtitle: "Premium refund at maturity",description: "Get all premiums back if you survive the policy term. Life cover + guaranteed 100% refund.",                  badge: "100% Refund",        stat: "Premium refund",      accent: "blue"  },
  { href: "/guaranteed-return-plans", icon: BarChart2,   title: "Guaranteed Return Plans", subtitle: "Fixed, risk-free returns",  description: "IRDAI-regulated plans with guaranteed 5–7% p.a. returns. No market risk. Build corpus + life cover.",           badge: "Upto 7.4% Returns",  stat: "Capital guaranteed",  accent: "green" },
  { href: "/child-savings-plans",     icon: Baby,        title: "Child Savings Plans",     subtitle: "Secure your child's future",description: "Build a corpus for education & marriage goals. Premium waiver if parent passes away.",                        badge: "Premium Waiver",     stat: "Guaranteed corpus",   accent: "green" },
  { href: "/retirement-plans",        icon: Umbrella,    title: "Retirement Plans",        subtitle: "Lifelong pension income",   description: "Guaranteed pension for life. Annuity, NPS-linked and ULIP retirement plans — all compared.",                     badge: "Lifelong Pension",   stat: "Tax-free corpus",     accent: "blue"  },
  { href: "/group-health-insurance",  icon: Building2,   title: "Group Health Insurance",  subtitle: "Employee benefits",         description: "Cover your entire workforce. No waiting period, pre-existing diseases covered from day 1.",                       badge: "Upto 65% Discount",  stat: "PED covered Day 1",   accent: "green" },
  { href: "/home-insurance",          icon: Home,        title: "Home Insurance",          subtitle: "Property protection",       description: "Protect your home from fire, flood, theft & natural disasters. Structure + contents from ₹2,500/year.",           badge: "Upto 25% Discount",  stat: "From ₹2,500/year",   accent: "blue"  },
];

const A = {
  blue: {
    bar:     "from-blue-600 to-blue-500",
    badge:   "bg-blue-600",
    stat:    "text-blue-600",
    border:  "hover:border-blue-200",
    glow:    "hover:shadow-blue-100/60",
    iconBg:  "bg-white border border-gray-200",
    iconFg:  "text-gray-900",
  },
  green: {
    bar:     "from-green-600 to-green-500",
    badge:   "bg-green-600",
    stat:    "text-green-600",
    border:  "hover:border-green-200",
    glow:    "hover:shadow-green-100/60",
    iconBg:  "bg-white border border-gray-200",
    iconFg:  "text-gray-900",
  },
};

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
            <span className="text-blue-600">Every Need</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Compare plans from 50+ top insurers and find the perfect fit in under 2 minutes
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {visible.map((cat, i) => {
            const s = A[i % 2 === 0 ? "blue" : "green"];
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                style={{ animationDelay: `${i * 0.06}s` }}
                className={`animate-fade-in-up group relative flex flex-col bg-white border-2 border-gray-100 rounded-3xl overflow-hidden card-hover ${s.border} hover:shadow-2xl ${s.glow}`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${s.bar}`} />
                <div className="p-5 flex flex-col flex-1">
                  <span className={`self-start ${s.badge} text-white text-[11px] font-bold px-2 py-0.5 rounded-full mb-4`}>
                    {cat.badge}
                  </span>
                  <div className={`w-11 h-11 rounded-2xl ${s.iconBg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 origin-left`}>
                    <Icon className={`w-5 h-5 ${s.iconFg}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-black text-gray-900 text-base leading-tight tracking-tight">{cat.title}</h3>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 mb-2">{cat.subtitle}</p>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 hidden sm:block">{cat.description}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${s.stat}`}>{cat.stat}</span>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-all duration-200">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(v => !v)}
            className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-7 py-3 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all duration-200 bg-white hover:shadow-md"
          >
            {showAll ? "Show less ↑" : "View all products ↓"}
          </button>
        </div>
      </div>
    </section>
  );
}
