"use client";

import Image from "next/image";
import Link from "next/link";
import QuoteForm from "@/components/QuoteForm";

type Partner = { id: number; name: string; slug: string; logoUrl: string | null };



// ── Pinned partners with brand identity ──────────────────────────────────────
const PINNED_SLUGS = ["hdfc-ergo", "lic", "tata-aig", "icici-lombard", "digit-insurance"];

const BRAND: Record<string, { gradient: string; initials: string }> = {
  "hdfc-ergo":       { gradient: "from-red-500 to-red-700",         initials: "HE"  },
  "lic":             { gradient: "from-amber-400 to-orange-500",     initials: "LIC" },
  "tata-aig":        { gradient: "from-blue-700 to-blue-900",        initials: "TA"  },
  "icici-lombard":   { gradient: "from-orange-500 to-red-500",       initials: "IL"  },
  "digit-insurance": { gradient: "from-violet-500 to-purple-700",    initials: "GD"  },
};

// Per-logo dimensions — tuned so each fills the card nicely
const LOGO_SIZE: Record<string, { w: number; h: number; cls: string }> = {
  "lic":             { w: 130, h: 52, cls: "max-h-[52px] w-auto scale-125" },
  "tata-aig":        { w: 120, h: 52, cls: "max-h-[52px] w-auto scale-125" },
  "icici-lombard":   { w: 140, h: 52, cls: "max-h-[52px] w-auto scale-125" },
  "digit-insurance": { w: 120, h: 44, cls: "max-h-11 w-auto scale-125" },
  "hdfc-ergo":       { w: 130, h: 52, cls: "max-h-[52px] w-auto scale-125" },
};

function PartnerStrip({ partners }: { partners: Partner[] }) {
  const pinned = PINNED_SLUGS
    .map(slug => partners.find(p => p.slug === slug))
    .filter(Boolean) as Partner[];

  if (!pinned.length) return null;

  const track = [...pinned, ...pinned, ...pinned];

  return (
    <div className="mt-10 pt-8 border-t border-blue-100/60">
      <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
        Trusted Partners
      </p>

      <style>{`
        @keyframes partner-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .partner-track {
          animation: partner-scroll 14s linear infinite;
          will-change: transform;
        }
        .partner-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-indigo-50/60 to-transparent z-10 pointer-events-none" />

        <div className="partner-track flex items-center gap-3 w-max">
          {track.map((p, i) => {
            const brand = BRAND[p.slug] ?? { gradient: "from-blue-500 to-blue-700", initials: p.name.slice(0, 2).toUpperCase() };
            return (
              <Link
                key={`${p.id}-${i}`}
                href={`/${p.slug}`}
                title={p.name}
                className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {p.logoUrl ? (
                  <Image
                    src={p.logoUrl}
                    alt={p.name}
                    width={LOGO_SIZE[p.slug]?.w  ?? 100}
                    height={LOGO_SIZE[p.slug]?.h ?? 40}
                    className={`object-contain ${LOGO_SIZE[p.slug]?.cls ?? "max-h-10 w-auto"}`}
                  />
                ) : (
                  <>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {brand.initials}
                    </div>
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{p.name}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ partners = [] }: { partners?: Partner[] }) {

  return (
    <section id="lead-form" className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* ── Left copy ── */}
          <div className="animate-fade-in-up relative z-10">
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    India’s Leading Insurance Service Provider            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.07] tracking-tight mb-6">
              Protect What{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-blue-600 bg-clip-text text-transparent">Matters</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="8" viewBox="0 0 220 8" fill="none">
                  <path d="M2 6 Q55 1 110 5 Q165 9 218 4" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round"/>
                  <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#186874"/><stop offset="100%" stopColor="#004aad"/></linearGradient></defs>
                </svg>
              </span>
              {" "}Most.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-0 max-w-md">
                India's Most Trusted Insurance Partner for 35 Years — Honest Advice, Guaranteed Best Price, Real Claim Support.             </p>

            <PartnerStrip partners={partners} />
          </div>

          {/* ── Right — Form card ── */}
          <div className="animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl blur-xl opacity-60" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 p-8">
                <div className="mb-7">
                  <h2 className="text-2xl font-bold text-gray-900">Get Free Quote</h2>
                  <p className="text-gray-400 text-sm mt-1">No spam · No hidden charges · 100% free</p>
                </div>

                <QuoteForm utmSource="hero" />

                <div className="mt-5 flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {[["bg-blue-500","A"],["bg-indigo-600","R"],["bg-blue-600","S"]].map(([c,l], i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>{l}</div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Advisors reply in <span className="text-gray-700 font-semibold">under 30 min</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
