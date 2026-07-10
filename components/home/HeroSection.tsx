"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import BgDecorations from "./BgDecorations";
import QuoteForm from "@/components/QuoteForm";
import { Shield, HeartPulse, Car, TrendingUp, Building2, BadgeCheck, Users, ShieldCheck, Bike, Plane, Home, UserCheck, RefreshCw, BarChart2, Baby, Umbrella, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { label: "Term Insurance",          href: "/term-insurance",          icon: Shield },
  { label: "Health Insurance",        href: "/health-insurance",        icon: HeartPulse },
  { label: "Car Insurance",           href: "/car-insurance",           icon: Car },
  { label: "Two Wheeler Insurance",   href: "/two-wheeler-insurance",   icon: Bike },
  { label: "Life Insurance",          href: "/life-insurance",          icon: TrendingUp },
  { label: "Family Health Insurance", href: "/family-health-insurance", icon: Users },
  { label: "Travel Insurance",        href: "/travel-insurance",        icon: Plane },
  { label: "Home Insurance",          href: "/home-insurance",          icon: Home },
  { label: "Term for Women",          href: "/term-insurance-women",    icon: UserCheck },
  { label: "Group Health Insurance",  href: "/group-health-insurance",  icon: Building2 },
  { label: "Return of Premium",       href: "/return-of-premium-plans", icon: RefreshCw },
  { label: "Child Savings Plans",     href: "/child-savings-plans",     icon: Baby },
  { label: "Retirement Plans",        href: "/retirement-plans",        icon: Umbrella },
  { label: "Guaranteed Returns",      href: "/guaranteed-return-plans", icon: BarChart2 },
];

const TRUST = [
  { num: 50,  suffix: "+",    prefix: "",  label: "Insurers",       icon: Building2,   color: "from-blue-600 to-blue-700",   shadow: "shadow-blue-100"   },
  { num: 500, suffix: "Cr+",  prefix: "₹", label: "Claims Settled", icon: BadgeCheck,  color: "from-indigo-600 to-indigo-700", shadow: "shadow-indigo-100" },
  { num: 1,   suffix: "L+",   prefix: "",  label: "Customers",      icon: Users,       color: "from-blue-600 to-blue-700",   shadow: "shadow-blue-100"   },
  { num: 99,  suffix: "%",    prefix: "",  label: "Claim Support",  icon: ShieldCheck, color: "from-indigo-600 to-indigo-700", shadow: "shadow-indigo-100" },
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
  const Icon = stat.icon;
  return (
    <div className={`group w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 text-center hover:shadow-xl ${stat.shadow} hover:-translate-y-1.5 hover:border-transparent transition-all duration-300 cursor-default relative overflow-hidden`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />
      <div className="flex justify-center mb-2"><Icon className="w-6 h-6" /></div>
      <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-none`}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div className="text-sm text-gray-400 font-medium mt-1">{stat.label}</div>
    </div>
  );
}

const MAIN = CATEGORIES.slice(0, 4);
const MORE = CATEGORIES.slice(4);

function CategoryPills() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  return (
    <div className="flex flex-wrap gap-2.5 mb-12">
      {MAIN.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-sm font-semibold text-gray-700 hover:text-blue-700 transition-all duration-200 shadow-sm"
        >
          <c.icon className="w-4 h-4" />
          <span>{c.label}</span>
        </Link>
      ))}

      {/* More dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-sm font-semibold text-gray-700 hover:text-blue-700 transition-all duration-200 shadow-sm"
        >
          More Plans
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-blue-100/40 p-2 min-w-[220px]">
            {MORE.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={close}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
              >
                <c.icon className="w-4 h-4 flex-shrink-0" />
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
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

  return (
    <section id="lead-form" className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-[88vh] flex items-center">
      {/* Decorative blobs — overflow clipped separately so dropdown isn't cut off */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BgDecorations variant="hero" />
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, #bfdbfe, transparent)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #c7d2fe, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #93c5fd, transparent)" }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #186874 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left copy ── */}
          <div className="animate-fade-in-up relative z-10">
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              India's #1 Insurance Comparison Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.07] tracking-tight mb-6">
              Protect What{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-blue-600 bg-clip-text text-transparent">Matters</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="8" viewBox="0 0 220 8" fill="none">
                  <path d="M2 6 Q55 1 110 5 Q165 9 218 4" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round"/>
                  <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#186874"/><stop offset="100%" stopColor="#004aad"/></linearGradient></defs>
                </svg>
              </span>
              {" "}Most.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
              Compare 200+ plans from India's top insurers in seconds. Unbiased advice, guaranteed best price, and hassle-free claim support.
            </p>

            <CategoryPills />
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

                <QuoteForm utmSource="hero" />

                <div className="mt-5 flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {[["bg-blue-500","A"],["bg-indigo-600","R"],["bg-blue-600","S"]].map(([c,l], i) => (
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
