"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Phone } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function CategoryFaq({ faqs, title }: { faqs: FaqItem[]; title: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Common Questions</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 0.04}s` }}
              className={`animate-fade-in-up border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIdx === idx
                  ? "border-blue-200 shadow-xl shadow-blue-50/80 bg-white"
                  : "border-gray-100 bg-white hover:border-blue-100 hover:shadow-md"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-bold text-gray-900 text-sm md:text-base pr-2">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIdx === idx ? "bg-blue-600 text-white rotate-45" : "bg-gray-100 text-gray-500"
                }`}>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIdx === idx ? "max-h-96" : "max-h-0"}`}>
                <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Still Unsure?</p>
          <h3 className="text-3xl font-black mb-3">Talk to an Expert — Free</h3>
          <p className="text-blue-100 mb-7">Our certified advisors are available Mon–Sat, 9 AM – 7 PM.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:1800XXXXXXX" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
              <Phone className="w-4 h-4 inline-block align-text-bottom mr-1" />Call Free: 1800-XXX-XXXX
            </a>
            <Link href="/#lead-form" className="border-2 border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Get Free Quote →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
