"use client";

import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { useState } from "react";
import { Phone, Shield, TrendingUp, HeartPulse, Car, Lock, BadgeCheck, Award, Users, Bike, Plane, Home, UserCheck, RefreshCw, BarChart2, Baby, Umbrella, Building2, ChevronDown } from "lucide-react";

const insurance = [
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

const company = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socials = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

const badges = [
  { icon: Lock,       label: "256-bit SSL" },
  { icon: BadgeCheck, label: "IRDAI Registered" },
  { icon: Award,      label: "4.8★ Rated" },
  { icon: Users,      label: "1L+ Customers" },
];

const MAIN_INSURANCE = insurance.slice(0, 4);
const MORE_INSURANCE = insurance.slice(4);

function InsuranceLinks() {
  const [open, setOpen] = useState(false);
  return (
    <ul className="space-y-3">
      {MAIN_INSURANCE.map((c) => {
        const Icon = c.icon;
        return (
          <li key={c.href}>
            <Link href={c.href} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all duration-200 group">
              <Icon className="w-4 h-4" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              {c.label}
            </Link>
          </li>
        );
      })}

      {open && MORE_INSURANCE.map((c) => {
        const Icon = c.icon;
        return (
          <li key={c.href}>
            <Link href={c.href} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all duration-200 group">
              <Icon className="w-4 h-4" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              {c.label}
            </Link>
          </li>
        );
      })}

      <li>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold mt-1"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          {open ? "Show less" : `+${MORE_INSURANCE.length} more`}
        </button>
      </li>
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden">
      {/* Gradient top border */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Newsletter strip */}
      <div className="relative border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Get insurance tips in your inbox</h3>
              <p className="text-gray-500 text-sm">Weekly guides on saving money and choosing the right cover.</p>
            </div>
            <div className="w-full md:w-auto md:min-w-[380px]">
              <NewsletterForm source="footer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center mb-5 group w-fit">
              <div className="bg-white rounded-xl px-3 py-1.5 group-hover:opacity-90 transition-opacity">
                <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-10 w-auto object-contain" />
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              India&apos;s trusted insurance comparison platform. Find the right policy at the best price &mdash; 100% free, no spam.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                <div key={b.label} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold text-gray-400">{b.label}</span>
                </div>
                );
              })}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Insurance links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Insurance</h3>
            <InsuranceLinks />
          </div>

          {/* Company links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Company</h3>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + CTA */}
          <div className="md:col-span-4">
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Legal</h3>
            <ul className="space-y-3 mb-8">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/40 rounded-2xl p-5">
              <p className="text-white font-bold text-base mb-1">Need expert help?</p>
              <p className="text-gray-400 text-sm mb-4">Talk to a certified insurance advisor. Free, no obligation.</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/#lead-form"
                  className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-900/40 btn-shine"
                >
                  Get Free Quote &rarr;
                </Link>
                <a
                  href="tel:1800XXXXXXX"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-white border border-blue-800/60 py-2.5 rounded-xl hover:border-blue-500 transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Call 1800-XXX-XXXX (Free)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/50 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 order-2 md:order-1">
            &copy; 2026 InsurancePortal. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 text-center max-w-lg order-1 md:order-2 leading-relaxed">
            Insurance is the subject matter of solicitation. Please read the policy brochure carefully before concluding the sale. IRDAI Reg. No. WBA000000
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600 order-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              All systems operational
            </span>
            <span className="text-gray-800">&middot;</span>
            <span>v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


