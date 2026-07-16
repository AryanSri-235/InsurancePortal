"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Phone } from "lucide-react";

const faqs = [
  { q: "What is term insurance and why do I need it?", a: "Term insurance is a pure life cover that pays a lump sum to your family if you pass away during the policy term. It's the most affordable way to ensure your family's financial security. A ₹1 Crore cover can cost as low as ₹490/month for a 30-year-old.", category: "Term Insurance" },
  { q: "How much term insurance cover do I need?", a: "A common rule of thumb is 10–15× your annual income. So if you earn ₹8 lakh/year, aim for at least ₹80 lakh cover. Also account for outstanding loans and future expenses like children's education.", category: "Term Insurance" },
  { q: "What is a cashless claim in health insurance?", a: "In a cashless claim, the insurer directly settles the hospital bill — you pay nothing (or only non-covered items) at discharge. You must use a network hospital. Always carry your health card and policy number.", category: "Health Insurance" },
  { q: "Is there a waiting period in health insurance?", a: "Yes. Most health plans have a 30-day initial waiting period (for all illnesses) and a 2–4 year waiting period for pre-existing conditions like diabetes or hypertension. Accidents are usually covered from day one.", category: "Health Insurance" },
  { q: "What is No-Claim Bonus (NCB) in motor insurance?", a: "NCB is a discount on your OD (Own Damage) premium for every claim-free year. It starts at 20% after year 1 and can go up to 50% after 5 consecutive claim-free years — saving you significant money over time.", category: "Motor Insurance" },
  { q: "Is third-party motor insurance mandatory in India?", a: "Yes. Under the Motor Vehicles Act, third-party (TP) liability insurance is mandatory for all vehicles in India. Driving without it can result in a fine of ₹2,000 and/or 3 months imprisonment.", category: "Motor Insurance" },
  { q: "What is the difference between ULIP and term insurance?", a: "Term insurance is pure protection — you pay a low premium for a high life cover. ULIPs combine insurance with investment (market-linked). For pure protection, term is almost always better value. For long-term wealth building, consult an advisor.", category: "Life Insurance" },
  { q: "Can I get tax benefits on insurance premiums?", a: "Yes. Term and life insurance premiums up to ₹1.5 lakh qualify for deduction under Section 80C. Health insurance premiums up to ₹25,000 (₹50,000 for senior citizens) qualify under Section 80D.", category: "General" },
  { q: "How do I file a claim?", a: "For policies bought through us, call our helpline at +91 80761 75709 or email inquery@npsinsurance.in. For policies bought directly from an insurer, contact them. We'll guide you through the process either way.", category: "General" },
  { q: "Is InsurancePortal free to use?", a: "Yes, completely free. We are an IRDAI-registered web aggregator. We earn a referral commission from insurers when you buy a policy, which means you pay the same premium — or less — as buying directly.", category: "General" },
];

const categories = ["All", "Term Insurance", "Health Insurance", "Motor Insurance", "Life Insurance", "General"];

const catColors: Record<string, string> = {
  "Term Insurance": "bg-blue-100 text-blue-700",
  "Health Insurance": "bg-emerald-100 text-emerald-700",
  "Motor Insurance": "bg-orange-100 text-orange-700",
  "Life Insurance": "bg-violet-100 text-violet-700",
  "General": "bg-gray-100 text-gray-700",
};

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [cat, setCat] = useState("All");

  const filtered = faqs.filter(f => cat === "All" || f.category === cat);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-gray-500 text-lg">Everything you need to know about insurance in India — plain English.</p>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((c) => (
              <button key={c} onClick={() => { setCat(c); setOpen(null); }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  cat === c
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white border-2 border-gray-100 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.04}s` }}
                className={`animate-fade-in-up border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  open === i
                    ? "border-blue-200 shadow-xl shadow-blue-50/80 bg-white"
                    : "border-gray-100 bg-white hover:border-blue-100 hover:shadow-md"
                }`}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full mt-0.5 ${catColors[faq.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {faq.category.split(" ")[0]}
                    </span>
                    <span className="font-bold text-gray-900 text-sm md:text-base">{faq.q}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open === i ? "bg-blue-600 text-white rotate-45" : "bg-gray-100 text-gray-500"}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96" : "max-h-0"}`}>
                  <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Still Unsure?</p>
            <h3 className="text-3xl font-black mb-3">Talk to an Expert</h3>
            <p className="text-blue-100 mb-7">Our advisors are available Mon–Sat, 9 AM – 7 PM — free of charge.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+918076175709" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
                <Phone className="w-4 h-4 inline" /> Call: +91 80761 75709
              </a>
              <Link href="/contact" className="border-2 border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
