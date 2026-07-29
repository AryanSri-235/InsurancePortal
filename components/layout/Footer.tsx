"use client";

import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { useState } from "react";
import { Phone, Shield, TrendingUp, HeartPulse, Car, Lock, BadgeCheck, Award, Users, Bike, Plane, Home, UserCheck, RefreshCw, BarChart2, Baby, Umbrella, Building2, ChevronDown } from "lucide-react";

const insurance = [
  { label: "Term Insurance",          href: "/term-insurance",          icon: Shield },
  { label: "Health Insurance",        href: "/health-insurance",        icon: HeartPulse },
  { label: "Motor Insurance",         href: "/motor-insurance",         icon: Car },
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


const badges = [
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

      {open ? MORE_INSURANCE.map((c) => {
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
      }) : null}

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
              <img src="/logo-dark-zoomed.png" alt="NPS Insurance.Life" className="h-20 w-auto object-contain group-hover:opacity-90 transition-opacity" />
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
                  href="tel:+918076175709"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-white border border-blue-800/60 py-2.5 rounded-xl hover:border-blue-500 transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Call +91 80761 75709
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
            Insurance is the subject matter of solicitation. Please read the policy brochure carefully before concluding the sale. IRDAI Reg. No. 0006012K
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


