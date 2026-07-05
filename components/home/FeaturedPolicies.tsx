"use client";

import Link from "next/link";
import { useRef } from "react";
import { Policy, Provider } from "@prisma/client";
import BgDecorations from "./BgDecorations";

type PolicyWithProvider = Policy & {
  provider: Pick<Provider, "name" | "slug" | "logoUrl" | "claimSettlementRatio">;
};

const CAT: Record<string, { label: string; pill: string; grad: string; border: string; shadow: string }> = {
  term:   { label: "Term",   pill: "bg-blue-100 text-blue-700",       grad: "from-blue-600 to-indigo-600",    border: "group-hover:border-blue-200",    shadow: "group-hover:shadow-blue-100/60" },
  health: { label: "Health", pill: "bg-emerald-100 text-emerald-700", grad: "from-emerald-600 to-teal-600",   border: "group-hover:border-emerald-200", shadow: "group-hover:shadow-emerald-100/60" },
  motor:  { label: "Motor",  pill: "bg-orange-100 text-orange-700",   grad: "from-orange-500 to-amber-500",   border: "group-hover:border-orange-200",  shadow: "group-hover:shadow-orange-100/60" },
  life:   { label: "Life",   pill: "bg-violet-100 text-violet-700",   grad: "from-violet-600 to-purple-600",  border: "group-hover:border-violet-200",  shadow: "group-hover:shadow-violet-100/60" },
};

const CARD_W = 300; // px — keeps cards consistent

export default function FeaturedPolicies({ policies }: { policies: PolicyWithProvider[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!policies.length) return null;

  // Triple the list for a seamless loop
  const items = [...policies, ...policies, ...policies];
  // Animation duration: ~4s per card
  const duration = policies.length * 4;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <BgDecorations variant="policies" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Hand-picked for you</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Featured Plans</h2>
            <p className="text-gray-500 mt-1.5 text-sm">Top-rated policies chosen by our insurance experts</p>
          </div>
          <Link
            href="/term-insurance"
            className="hidden md:inline-flex items-center gap-2 text-blue-600 text-sm font-semibold border-2 border-blue-100 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 hover:border-blue-200 transition-colors"
          >
            View All Plans →
          </Link>
        </div>

        {/* Scroll track */}
        <div className="relative overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex gap-5 py-4 px-4"
            style={{
              width: "max-content",
              animation: `marquee ${duration}s linear infinite`,
            }}
            onMouseEnter={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
            }}
            onMouseLeave={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "running";
            }}
          >
            {items.map((policy, i) => {
              const cat = CAT[policy.category] ?? CAT.term;
              return (
                <div
                  key={`${policy.id}-${i}`}
                  className={`group flex-shrink-0 flex flex-col bg-white rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden ${cat.border} ${cat.shadow}`}
                  style={{ width: `${CARD_W}px` }}
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${cat.grad} flex-shrink-0`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cat.pill} mb-2`}>
                          {cat.label}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{policy.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">by {policy.provider.name}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-sm font-black text-gray-400 flex-shrink-0 ml-3">
                        {policy.provider.name.charAt(0)}
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {policy.premiumStartsFrom && (
                        <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                          <p className="text-[10px] text-gray-400 mb-0.5">Premium from</p>
                          <p className="text-sm font-bold text-gray-900">
                            ₹{policy.premiumStartsFrom.toLocaleString("en-IN")}
                            <span className="text-[10px] font-medium text-gray-500">/mo</span>
                          </p>
                        </div>
                      )}
                      {policy.coverAmount && (
                        <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                          <p className="text-[10px] text-gray-400 mb-0.5">Cover</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{policy.coverAmount}</p>
                        </div>
                      )}
                      {policy.provider.claimSettlementRatio && (
                        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                          <p className="text-[10px] text-gray-400 mb-0.5">Claim Ratio</p>
                          <p className="text-sm font-bold text-emerald-700">{policy.provider.claimSettlementRatio}%</p>
                        </div>
                      )}
                      {policy.policyTerm && (
                        <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                          <p className="text-[10px] text-gray-400 mb-0.5">Policy Term</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{policy.policyTerm}</p>
                        </div>
                      )}
                    </div>

                    {/* Key benefits */}
                    {policy.keyBenefits.length > 0 && (
                      <ul className="space-y-1 mb-4 flex-1">
                        {policy.keyBenefits.slice(0, 3).map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-600">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[8px] font-black">✓</span>
                            <span className="line-clamp-1">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href={`/${policy.category}-insurance/${policy.provider.slug}/${policy.slug}`}
                      className={`btn-shine mt-auto block w-full text-center bg-gradient-to-r ${cat.grad} text-white py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
                    >
                      View Plan Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-6 md:hidden px-4">
          <Link
            href="/term-insurance"
            className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold border-2 border-blue-100 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            View All Plans →
          </Link>
        </div>
      </div>
    </section>
  );
}
