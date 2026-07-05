"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const PLAN_SECTIONS = [
  {
    heading: "Life & Term",
    color: "text-blue-600",
    links: [
      { label: "Term Insurance",            href: "/term-insurance",           icon: "🛡️", desc: "Max cover at lowest cost" },
      { label: "Term Insurance (Women)",    href: "/term-insurance-women",     icon: "👩", desc: "Upto 20% cheaper for women" },
      { label: "Return of Premium Plans",   href: "/return-of-premium-plans",  icon: "🔄", desc: "100% premium refund" },
      { label: "Life Insurance",            href: "/life-insurance",           icon: "💰", desc: "Savings + life cover" },
      { label: "Guaranteed Return Plans",   href: "/guaranteed-return-plans",  icon: "📈", desc: "Fixed 5–7% returns" },
      { label: "Child Savings Plans",       href: "/child-savings-plans",      icon: "👶", desc: "Secure your child's future" },
      { label: "Retirement Plans",          href: "/retirement-plans",         icon: "🏖️", desc: "Lifelong pension income" },
    ],
  },
  {
    heading: "Health",
    color: "text-emerald-600",
    links: [
      { label: "Health Insurance",          href: "/health-insurance",         icon: "🏥", desc: "Cashless at 14,000+ hospitals" },
      { label: "Family Health Insurance",   href: "/family-health-insurance",  icon: "👨‍👩‍👧", desc: "One policy, whole family" },
      { label: "Group Health Insurance",    href: "/group-health-insurance",   icon: "🏢", desc: "For employees, no waiting" },
    ],
  },
  {
    heading: "Motor",
    color: "text-orange-600",
    links: [
      { label: "Car Insurance",             href: "/car-insurance",            icon: "🚗", desc: "Zero dep, cashless garages" },
      { label: "Two Wheeler Insurance",     href: "/two-wheeler-insurance",    icon: "🛵", desc: "Bike & scooter cover" },
    ],
  },
  {
    heading: "Other",
    color: "text-sky-600",
    links: [
      { label: "Travel Insurance",          href: "/travel-insurance",         icon: "✈️", desc: "Medical + trip cancellation" },
      { label: "Home Insurance",            href: "/home-insurance",           icon: "🏠", desc: "Property + contents cover" },
    ],
  },
];

// Flat list for mobile
const ALL_LINKS = PLAN_SECTIONS.flatMap((s) => s.links);

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile plans accordion
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openMega  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-2 text-center font-medium hidden md:block">
        <span className="opacity-90">🎉 Compare 200+ plans from 50+ top insurers — 100% Free, No Spam</span>
        <span className="mx-4 opacity-40">|</span>
        <span className="opacity-90">📞 Expert helpline: <span className="font-bold">1800-XXX-XXXX</span> · Mon–Sat 9 AM–7 PM</span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-gray-100/80 border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-black text-sm tracking-tight">IP</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-black text-gray-900 tracking-tight">
                  Insurance<span className="text-blue-600">Portal</span>
                </span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">IRDAI Registered</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center h-full">

              {/* Insurance Plans mega menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200">
                  Insurance Plans
                  <svg className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? "rotate-180 text-blue-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Wide mega dropdown */}
                <div
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[780px] bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-5 transition-all duration-200 ${
                    megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="grid grid-cols-4 gap-6">
                    {PLAN_SECTIONS.map((section) => (
                      <div key={section.heading}>
                        <p className={`text-[11px] font-black uppercase tracking-widest mb-3 ${section.color}`}>
                          {section.heading}
                        </p>
                        <div className="space-y-0.5">
                          {section.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMegaOpen(false)}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-150 group"
                            >
                              <span className="text-lg mt-0.5 group-hover:scale-110 transition-transform duration-200 inline-block leading-none">{link.icon}</span>
                              <div>
                                <p className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{link.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer strip */}
                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Not sure which plan suits you? Talk to a free expert.</span>
                    <a href="tel:1800XXXXXXX" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      📞 Call Free — 1800-XXX-XXXX
                    </a>
                  </div>
                </div>
              </div>

              <Link href="/calculator" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200">Calculator</Link>
              <Link href="/blog"       className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200">Blog</Link>
              <Link href="/about"      className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200">About</Link>
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:1800XXXXXXX" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-200 rounded-xl px-3 py-2 hover:border-blue-200 hover:bg-blue-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1800-XXX-XXXX
              </a>
              <Link href="/#lead-form" className="btn-shine relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5">
                Get Free Quote
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[80vh] pb-4" : "max-h-0"}`}>
            <div className="border-t border-gray-100 pt-3 overflow-y-auto max-h-[70vh]">

              {/* Insurance Plans accordion */}
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-blue-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span>Insurance Plans</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileOpen && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {PLAN_SECTIONS.map((section) => (
                    <div key={section.heading} className="mb-3">
                      <p className={`text-[10px] font-black uppercase tracking-widest px-3 mb-1 ${section.color}`}>{section.heading}</p>
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => { setMenuOpen(false); setMobileOpen(false); }}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                          <span>{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                {[{ label: "Calculator", href: "/calculator" }, { label: "Blog", href: "/blog" }, { label: "About", href: "/about" }].map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/#lead-form"
                onClick={() => setMenuOpen(false)}
                className="mt-3 block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold text-center shadow-md shadow-blue-200"
              >
                Get Free Quote →
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
