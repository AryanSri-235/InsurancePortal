"use client";

import Link from "next/link";
import { useRef } from "react";
import BgDecorations from "./BgDecorations";

interface Provider {
  id: number;
  name: string;
  slug: string;
  claimSettlementRatio: number | null;
  categories: string[];
  logoUrl: string | null;
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-green-500 to-emerald-600",
  "from-indigo-500 to-violet-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
];

const CAT_HREF: Record<string, string> = {
  term: "/term-insurance", health: "/health-insurance",
  motor: "/motor-insurance", life: "/life-insurance",
};

export default function ProvidersSection({ providers }: { providers: Provider[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!providers.length) return null;

  // Duplicate 3× so there's always content visible during the loop
  const items = [...providers, ...providers, ...providers];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <BgDecorations variant="providers" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-10 px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Insurer Network
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            India&apos;s Top{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Insurance Brands
            </span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            {providers.length}+ IRDAI-registered companies compared in one place.
          </p>
        </div>

        {/* Scroll track */}
        <div className="relative overflow-hidden">
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex gap-4 py-4 px-2"
            style={{
              width: "max-content",
              animation: "marquee 35s linear infinite",
            }}
            onMouseEnter={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
            }}
            onMouseLeave={() => {
              if (trackRef.current) trackRef.current.style.animationPlayState = "running";
            }}
          >
            {items.map((provider, i) => {
              const initials = provider.name
                .split(" ").slice(0, 2)
                .map((w) => w[0]).join("").toUpperCase();
              const gradient = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const primaryCategory = provider.categories[0] ?? "term";
              const href = `${CAT_HREF[primaryCategory] ?? "/term-insurance"}/${provider.slug}`;

              return (
                <Link
                  key={`${provider.id}-${i}`}
                  href={href}
                  className="flex-shrink-0 flex flex-col items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 w-36 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
                >
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="w-12 h-12 object-contain rounded-xl"
                    />
                  ) : (
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white font-black text-base">{initials}</span>
                    </div>
                  )}
                  <p className="text-xs font-bold text-gray-800 text-center leading-tight line-clamp-2">
                    {provider.name}
                  </p>
                  {provider.claimSettlementRatio && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      {provider.claimSettlementRatio}% CSR
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 px-4">
          <Link
            href="/term-insurance"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 px-6 py-3 rounded-xl transition-all duration-200"
          >
            View All Providers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
