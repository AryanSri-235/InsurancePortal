"use client";

import { useState } from "react";
import { Faq } from "@prisma/client";
import BgDecorations from "./BgDecorations";

const fallbackFaqs: Faq[] = [
  { id: 1, question: "What is term insurance and how does it work?", answer: "Term insurance is a pure life insurance product that provides financial protection to your family if you pass away during the policy term. If you survive the term, no benefit is paid (unless you opted for return of premium). It's the most affordable way to get maximum life cover — a ₹1 Crore cover can cost as little as ₹490/month.", category: "term", providerId: null, sortOrder: 1 },
  { id: 2, question: "How much life cover do I actually need?", answer: "The standard thumb rule is 10–15× your annual income. Factor in outstanding loans (home, car, personal), your family's monthly expenses × remaining dependency years, children's education costs, and any future goals. Our free calculator can give you a personalized estimate in 60 seconds.", category: "term", providerId: null, sortOrder: 2 },
  { id: 3, question: "What is cashless hospitalisation in health insurance?", answer: "Cashless means you walk into a network hospital, show your insurance card, and leave without paying (except non-covered items). The insurer settles directly with the hospital. Available at 8,000–14,000+ hospitals depending on your insurer. Always check if your preferred hospital is in-network before buying.", category: "health", providerId: null, sortOrder: 1 },
  { id: 4, question: "What is No Claim Bonus (NCB) in car insurance?", answer: "NCB is a discount on your Own Damage (OD) premium for every consecutive claim-free year. It starts at 20% after year 1, goes to 25%, 35%, 45%, and maxes at 50% after 5 claim-free years. An NCB Protection add-on lets you make one claim without losing your NCB — highly recommended.", category: "motor", providerId: null, sortOrder: 1 },
];

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <BgDecorations variant="faq" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Got Questions?</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            FAQ
          </h2>
          <p className="text-gray-500 mt-4 text-lg">Everything about insurance, answered simply</p>
        </div>

        <div className="space-y-3">
          {items.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{ animationDelay: `${i * 0.06}s` }}
                className={`animate-fade-in-up rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? "border-blue-200 bg-white shadow-xl shadow-blue-50" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg"}`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                >
                  <span className={`font-semibold text-sm leading-snug transition-colors ${isOpen ? "text-blue-700" : "text-gray-900"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-blue-600 text-white rotate-45" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
                <div className={`transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                  <div className="px-6 pb-6">
                    <div className="h-px bg-blue-100 mb-4" />
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA card */}
        <div className="mt-12 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative p-8 text-center text-white">
            <p className="text-xl font-bold mb-1">Still have questions?</p>
            <p className="text-blue-100 text-sm mb-6">Our experts are available Mon–Sat, 9 AM – 7 PM</p>
            <a
              href="tel:+918000000000"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-blue-50 transition-colors shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Free: 1800-XXX-XXXX
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
