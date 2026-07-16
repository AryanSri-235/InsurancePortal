"use client";

import Image from "next/image";
import Link from "next/link";
import QuoteForm from "@/components/QuoteForm";
import { CATEGORY_CONFIG } from "@/lib/category-config";

type Partner = { id: number; name: string; slug: string; logoUrl: string | null; categories: string[] };

function providerHref(p: Partner): string {
  const cat = p.categories?.[0];
  const route = cat ? CATEGORY_CONFIG[cat]?.route : null;
  return route ? `${route}/${p.slug}` : "#";
}



const GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-cyan-700",
  "from-sky-500 to-sky-700",
  "from-blue-600 to-indigo-700",
  "from-teal-600 to-cyan-700",
  "from-indigo-600 to-blue-700",
];

function getInitials(name: string) {
  const words = name.replace(/[^a-zA-Z ]/g, " ").trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const TIGHT_PADDING = new Set([
  "sbi-general", "royal-sundaram", "niva-bupa", "magma-general",
  "galaxy-health", "manipal-cigna", "universal-sompo", "shriram-general", "liberty-general",
]);

function PartnerStrip({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;

  const track = [...partners, ...partners];

  return (
    <div className="mt-10 pt-8 border-t border-blue-100/60">
      <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
        Trusted Partners
      </p>

      <style>{`
        @keyframes partner-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-track {
          animation: partner-scroll 80s linear infinite;
          will-change: transform;
        }
        .partner-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-indigo-50/60 to-transparent z-10 pointer-events-none" />

        <div className="partner-track flex items-center gap-3 w-max">
          {track.map((p, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const initials = getInitials(p.name);
            return (
              <Link
                key={`${p.id}-${i}`}
                href={providerHref(p)}
                title={p.name}
                className="flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all"
                style={{ width: 180, height: 88 }}
              >
                {p.logoUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      fill
                      className={`object-contain ${TIGHT_PADDING.has(p.slug) ? "scale-[1.5]" : "p-3"}`}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap max-w-[90px] truncate">{p.name}</span>
                  </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* ── Left copy ── */}
          <div className="animate-fade-in-up relative z-10">
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              India’s Leading Insurance Service Provider            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.07] tracking-tight mb-6">
              Protect What{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-blue-600 bg-clip-text text-transparent">Matters</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="8" viewBox="0 0 220 8" fill="none">
                  <path d="M2 6 Q55 1 110 5 Q165 9 218 4" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round" />
                  <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#186874" /><stop offset="100%" stopColor="#004aad" /></linearGradient></defs>
                </svg>
              </span>
              {" "}Most.
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-0 max-w-md">
              India's Most Trusted Insurance Partner for <strong className="text-blue-600 font-bold">35 Years </strong>of Honest Advice, Guaranteed Best Price, Real Claim Support.            </p>

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
                    {[["bg-blue-500", "A"], ["bg-indigo-600", "R"], ["bg-blue-600", "S"]].map(([c, l], i) => (
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
