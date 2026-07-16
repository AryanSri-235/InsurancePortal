"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown, Phone, User, Shield, LogOut,
  HeartPulse, Car, Bike, TrendingUp, Users,
  Plane, UserCheck, RefreshCw, BarChart2, Baby,
  Umbrella, Building2, Home, Lock, FileText,
  AlertTriangle, Landmark, HelpCircle, PenLine,
  type LucideIcon,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  desc: string;
}

interface PlanSection {
  heading: string;
  color: string;
  links: NavLink[];
}

const PLAN_SECTIONS: PlanSection[] = [
  {
    heading: "Life & Term",
    color: "text-blue-600",
    links: [
      { label: "Term Insurance",           href: "/term-insurance",           icon: Shield,     desc: "Max cover at lowest cost" },
      { label: "Term Insurance (Women)",   href: "/term-insurance-women",     icon: UserCheck,  desc: "Upto 20% cheaper for women" },
      { label: "Return of Premium Plans",  href: "/return-of-premium-plans",  icon: RefreshCw,  desc: "100% premium refund" },
      { label: "Life Insurance",           href: "/life-insurance",           icon: TrendingUp, desc: "Savings + life cover" },
      { label: "Guaranteed Return Plans",  href: "/guaranteed-return-plans",  icon: BarChart2,  desc: "Fixed 5–7% returns" },
      { label: "Child Savings Plans",      href: "/child-savings-plans",      icon: Baby,       desc: "Secure your child's future" },
      { label: "Retirement Plans",         href: "/retirement-plans",         icon: Umbrella,   desc: "Lifelong pension income" },
    ],
  },
  {
    heading: "Health",
    color: "text-emerald-600",
    links: [
      { label: "Health Insurance",         href: "/health-insurance",         icon: HeartPulse, desc: "Cashless at 14,000+ hospitals" },
      { label: "Family Health Insurance",  href: "/family-health-insurance",  icon: Users,      desc: "One policy, whole family" },
      { label: "Group Health Insurance",   href: "/group-health-insurance",   icon: Building2,  desc: "For employees, no waiting" },
    ],
  },
  {
    heading: "Motor",
    color: "text-orange-600",
    links: [
      { label: "Car Insurance",            href: "/car-insurance",            icon: Car,        desc: "Zero dep, cashless garages" },
      { label: "Two Wheeler Insurance",    href: "/two-wheeler-insurance",    icon: Bike,       desc: "Bike & scooter cover" },
    ],
  },
  {
    heading: "Other",
    color: "text-sky-600",
    links: [
      { label: "Travel Insurance",         href: "/travel-insurance",         icon: Plane,      desc: "Medical + trip cancellation" },
      { label: "Home Insurance",           href: "/home-insurance",           icon: Home,       desc: "Property + contents cover" },
    ],
  },
];

const COMPANY_LINKS: NavLink[] = [
  { label: "About Us",   href: "/about",      icon: Building2,  desc: "Our story & mission" },
  { label: "Contact",    href: "/contact",    icon: Phone,      desc: "Talk to our team" },
  { label: "Blog",       href: "/blog",       icon: PenLine,    desc: "Insurance guides & tips" },
  { label: "FAQ",        href: "/faq",        icon: HelpCircle, desc: "Common questions answered" },
];

const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy",     href: "/privacy-policy", icon: Lock,          desc: "How we handle your data" },
  { label: "Terms of Service",   href: "/terms",          icon: FileText,      desc: "Rules for using our platform" },
  { label: "Disclaimer",         href: "/disclaimer",     icon: AlertTriangle, desc: "Important disclosures" },
  { label: "IRDAI Registration", href: "/irdai",          icon: Landmark,      desc: "Reg. No. WBA000000" },
];

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
    <ChevronDown
      className={`w-4 h-4 transition-transform duration-200 ${active ? "rotate-180 text-blue-600" : "text-gray-400"}`}
    />
  );

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-2 text-center font-medium hidden md:block">
        <span className="opacity-90">✦ Compare 200+ plans from 50+ top insurers &mdash; 100% Free, No Spam</span>
        <span className="mx-4 opacity-40">|</span>
        <span className="opacity-90">☎ Expert helpline: <span className="font-bold">+91 80761 75709</span> &middot; Mon&ndash;Sat 9 AM&ndash;7 PM</span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-gray-100/80 border-b-2 border-blue-600"
            : "bg-white border-b-2 border-blue-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-14 w-auto object-contain group-hover:opacity-90 transition-opacity" style={{ mixBlendMode: "multiply" }} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center h-full gap-1">

              {/* Insurance Plans mega menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("plans")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-200 ${activeDropdown === "plans" ? "text-blue-600 after:bg-blue-600" : "text-gray-700 hover:text-blue-600 after:bg-transparent"}`}>
                  Insurance Plans
                  {chevron(activeDropdown === "plans")}
                </button>

                <div
                  onMouseEnter={() => openDropdown("plans")}
                  onMouseLeave={closeDropdown}
                  className={`absolute top-full left-0 translate-x-0 xl:left-1/2 xl:-translate-x-1/2 mt-0 w-[780px] bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-5 transition-all duration-200 ${
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
                          {section.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-150 group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150">
                                  <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900" strokeWidth={2} />
                                </div>
                                <div>
                                  <p className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{link.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Not sure which plan suits you? Talk to a free expert.</span>
                    <a href="tel:+918076175709" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Call &ndash; +91 80761 75709
                    </a>
                  </div>
                </div>
              </div>

              {/* Company dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("company")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-200 ${activeDropdown === "company" ? "text-blue-600 after:bg-blue-600" : "text-gray-700 hover:text-blue-600 after:bg-transparent"}`}>
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
                  {COMPANY_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-gray-200 flex items-center justify-center flex-shrink-0 transition-all duration-150">
                          <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</p>
                          <p className="text-[11px] text-gray-400 leading-tight">{link.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Legal dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => openDropdown("legal")}
                onMouseLeave={closeDropdown}
              >
                <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-200 ${activeDropdown === "legal" ? "text-blue-600 after:bg-blue-600" : "text-gray-700 hover:text-blue-600 after:bg-transparent"}`}>
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
                  {LEGAL_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-gray-200 flex items-center justify-center flex-shrink-0 transition-all duration-150">
                          <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">{link.label}</p>
                          <p className="text-[11px] text-gray-400 leading-tight">{link.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-100 mt-1 pt-2 px-3 pb-1">
                    <p className="text-[10px] text-gray-400">IRDAI Reg. No. WBA000000 &middot; &copy; 2026 InsurancePortal</p>
                  </div>
                </div>
              </div>

            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:+918076175709" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-200 rounded-xl px-3 py-2 hover:border-blue-200 hover:bg-blue-50">
                <Phone className="w-4 h-4" />
                +91 80761 75709
              </a>

              {!userSession && (
                <>
                  <Link href="/login" className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-all duration-200">
                    Login / Sign Up
                  </Link>
                </>
              )}

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
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`absolute top-full right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 p-2 transition-all duration-200 ${userMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{userSession.name}</p>
                      <p className="text-xs text-gray-400">+91 {userSession.phone}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link href="/account/policies" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Shield className="w-4 h-4" />
                      My Policies
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100 pt-2">
                      <LogOut className="w-4 h-4" />
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

              <MobileAccordion
                label="Insurance Plans"
                isOpen={mobileOpen === "plans"}
                onToggle={() => setMobileOpen(mobileOpen === "plans" ? null : "plans")}
              >
                {PLAN_SECTIONS.map((section) => (
                  <div key={section.heading} className="mb-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest px-3 mb-1 ${section.color}`}>{section.heading}</p>
                    {section.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                          <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </MobileAccordion>

              <MobileAccordion
                label="Company"
                isOpen={mobileOpen === "company"}
                onToggle={() => setMobileOpen(mobileOpen === "company" ? null : "company")}
              >
                {COMPANY_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                      {link.label}
                    </Link>
                  );
                })}
              </MobileAccordion>

              <MobileAccordion
                label="Legal"
                isOpen={mobileOpen === "legal"}
                onToggle={() => setMobileOpen(mobileOpen === "legal" ? null : "legal")}
              >
                {LEGAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                      {link.label}
                    </Link>
                  );
                })}
              </MobileAccordion>

              {!userSession ? (
                <div className="flex gap-2 mt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 bg-gray-900 text-white font-semibold text-sm text-center py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                    Login / Sign Up
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
                Get Free Quote &rarr;
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
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pl-3 mt-1">{children}</div>}
    </div>
  );
}


