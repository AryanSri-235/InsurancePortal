"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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

const COMPANY_LINKS = [
  { label: "About Us",    href: "/about",      icon: "🏢", desc: "Our story & mission" },
  { label: "Contact",     href: "/contact",    icon: "📞", desc: "Talk to our team" },
  { label: "Blog",        href: "/blog",       icon: "✍️", desc: "Insurance guides & tips" },
  { label: "Calculator",  href: "/calculator", icon: "🧮", desc: "Estimate your premium" },
  { label: "FAQ",         href: "/faq",        icon: "❓", desc: "Common questions answered" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",    href: "/privacy-policy",    icon: "🔒", desc: "How we handle your data" },
  { label: "Terms of Service",  href: "/terms",             icon: "📋", desc: "Rules for using our platform" },
  { label: "Disclaimer",        href: "/disclaimer",        icon: "⚠️", desc: "Important disclosures" },
  { label: "IRDAI Registration",href: "/irdai",             icon: "🏛️", desc: "Reg. No. WBA000000" },
];

// Flat list for mobile accordion
const ALL_LINKS = PLAN_SECTIONS.flatMap((s) => s.links);

type DropdownKey = "plans" | "company" | "legal" | null;

interface UserSession {
  name: string;
  phone: string;
}

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const [mobileOpen, setMobileOpen] = useState<DropdownKey>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Check user session on mount via a lightweight cookie-read endpoint
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.user) setUserSession(d.user); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    setUserSession(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function openDropdown(key: DropdownKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(key);
  }
  function closeDropdown() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }

  const chevron = (active: boolean) => (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${active ? "rotate-180 text-blue-600" : "text-gray-400"}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

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
            <nav className="hidden md:flex items-center h-full gap-1">

              {/* ── Insurance Plans mega menu ── */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("plans")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 ${activeDropdown === "plans" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
                  Insurance Plans
                  {chevron(activeDropdown === "plans")}
                </button>

                <div
                  onMouseEnter={() => openDropdown("plans")}
                  onMouseLeave={closeDropdown}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[780px] bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-5 transition-all duration-200 ${
                    activeDropdown === "plans" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
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
                              onClick={() => setActiveDropdown(null)}
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
                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Not sure which plan suits you? Talk to a free expert.</span>
                    <a href="tel:1800XXXXXXX" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      📞 Call Free — 1800-XXX-XXXX
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Company dropdown ── */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("company")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 ${activeDropdown === "company" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
                  Company
                  {chevron(activeDropdown === "company")}
                </button>

                <div
                  onMouseEnter={() => openDropdown("company")}
                  onMouseLeave={closeDropdown}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-2 transition-all duration-200 ${
                    activeDropdown === "company" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {COMPANY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-base group-hover:scale-110 transition-transform duration-150 inline-block">{link.icon}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Legal dropdown ── */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("legal")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 ${activeDropdown === "legal" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}>
                  Legal
                  {chevron(activeDropdown === "legal")}
                </button>

                <div
                  onMouseEnter={() => openDropdown("legal")}
                  onMouseLeave={closeDropdown}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-60 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-2 transition-all duration-200 ${
                    activeDropdown === "legal" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {LEGAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-base group-hover:scale-110 transition-transform duration-150 inline-block">{link.icon}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">{link.label}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-2 px-3 pb-1">
                    <p className="text-[10px] text-gray-400">IRDAI Reg. No. WBA000000 · © 2026 InsurancePortal</p>
                  </div>
                </div>
              </div>

            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:1800XXXXXXX" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-200 rounded-xl px-3 py-2 hover:border-blue-200 hover:bg-blue-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1800-XXX-XXXX
              </a>

              {/* Auth buttons — logged out */}
              {!userSession && (
                <>
                  <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-200">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-all duration-200">
                    Register
                  </Link>
                </>
              )}

              {/* User avatar + dropdown — logged in */}
              {userSession && (
                <div
                  className="relative"
                  onMouseEnter={() => { if (userMenuTimer.current) clearTimeout(userMenuTimer.current); setUserMenuOpen(true); }}
                  onMouseLeave={() => { userMenuTimer.current = setTimeout(() => setUserMenuOpen(false), 150); }}
                >
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {userSession.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[80px] truncate">{userSession.name.split(" ")[0]}</span>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`absolute top-full right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 p-2 transition-all duration-200 ${userMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{userSession.name}</p>
                      <p className="text-xs text-gray-400">+91 {userSession.phone}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Account
                    </Link>
                    <Link href="/account/policies" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      My Policies
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100 pt-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}

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
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[85vh] pb-4" : "max-h-0"}`}>
            <div className="border-t border-gray-100 pt-3 overflow-y-auto max-h-[75vh] space-y-1">

              {/* Insurance Plans accordion */}
              <MobileAccordion
                label="Insurance Plans"
                isOpen={mobileOpen === "plans"}
                onToggle={() => setMobileOpen(mobileOpen === "plans" ? null : "plans")}
              >
                {PLAN_SECTIONS.map((section) => (
                  <div key={section.heading} className="mb-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest px-3 mb-1 ${section.color}`}>{section.heading}</p>
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <span>{link.icon}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </MobileAccordion>

              {/* Company accordion */}
              <MobileAccordion
                label="Company"
                isOpen={mobileOpen === "company"}
                onToggle={() => setMobileOpen(mobileOpen === "company" ? null : "company")}
              >
                {COMPANY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </MobileAccordion>

              {/* Legal accordion */}
              <MobileAccordion
                label="Legal"
                isOpen={mobileOpen === "legal"}
                onToggle={() => setMobileOpen(mobileOpen === "legal" ? null : "legal")}
              >
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </MobileAccordion>

              {/* Mobile auth */}
              {!userSession ? (
                <div className="flex gap-2 mt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 border border-gray-200 text-gray-700 font-semibold text-sm text-center py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 bg-gray-900 text-white font-semibold text-sm text-center py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="mt-2 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {userSession.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{userSession.name}</p>
                      <p className="text-xs text-gray-400">+91 {userSession.phone}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full text-sm text-red-500 font-semibold text-left px-2 py-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              )}

              <Link
                href="/#lead-form"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold text-center shadow-md shadow-blue-200"
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

function MobileAccordion({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
        onClick={onToggle}
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="pl-3 mt-1">{children}</div>}
    </div>
  );
}
