"use client";

import Link from "next/link";
import { useRef } from "react";
import BgDecorations from "./BgDecorations";
import { ChevronRight } from "lucide-react";

interface Provider {
  id: number;
  name: string;
  slug: string;
  claimSettlementRatio: number | null;
  categories: string[];
  logoUrl: string | null;
}

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-blue-600 to-blue-700",
  "from-blue-600 to-blue-800",
  "from-indigo-600 to-indigo-700",
  "from-blue-400 to-blue-600",
  "from-blue-500 to-blue-600",
  "from-blue-500 to-blue-700",
  "from-blue-700 to-indigo-600",
  "from-blue-600 to-blue-800",
  "from-indigo-500 to-indigo-700",
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
                  className="flex-shrink-0 flex flex-col items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-5 w-40 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
                >
                  {provider.logoUrl ? (
                    <div className="w-full h-14 flex items-center justify-center">
                      <img
                        src={provider.logoUrl}
                        alt={provider.name}
                        className="max-h-14 max-w-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white font-black text-base">{initials}</span>
                    </div>
                  )}
                  <p className="text-xs font-bold text-gray-800 text-center leading-tight line-clamp-2">
                    {provider.name}
                  </p>
                  {provider.claimSettlementRatio && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
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
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
