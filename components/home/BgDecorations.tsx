// Purely visual — aria-hidden, pointer-events-none, z-0
// Each section passes a `variant` to get a different arrangement of icons.

type Variant =
  | "hero"
  | "categories"
  | "providers"
  | "howItWorks"
  | "calculator"
  | "policies"
  | "whyUs"
  | "testimonials"
  | "faq";

interface Props {
  variant?: Variant;
  className?: string;
}

// ── SVG icon helpers ─────────────────────────────────────────────────────────

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M32 4L8 14v18c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V14L32 4z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M22 32l7 7 13-13" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M32 54S8 40 8 22a12 12 0 0124-2.4A12 12 0 0156 22c0 18-24 32-24 32z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function Car({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="4" y="20" width="72" height="20" rx="4" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2"/>
      <path d="M12 20l8-14h40l8 14" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="20" cy="42" r="7" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2"/>
      <circle cx="60" cy="42" r="7" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2"/>
    </svg>
  );
}

function Umbrella({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 32C8 18.7 18.7 8 32 8s24 10.7 24 24H8z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2"/>
      <path d="M32 32v20a4 4 0 004 4" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5"/>
    </svg>
  );
}

function Document({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="4" y="4" width="48" height="64" rx="5" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.13" strokeWidth="2"/>
      <line x1="14" y1="22" x2="42" y2="22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="32" x2="42" y2="32" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="42" x2="30" y2="42" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function Stethoscope({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M16 8v18a16 16 0 0032 0V8" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="48" cy="44" r="10" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2"/>
      <path d="M48 40v8M44 44h8" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="8" r="3" fill="currentColor" fillOpacity="0.15"/>
      <circle cx="32" cy="8" r="3" fill="currentColor" fillOpacity="0.15"/>
    </svg>
  );
}

function Coin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="32" cy="32" r="26" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.13" strokeWidth="2"/>
      <path d="M32 18v4m0 20v4M24 28c0-4.4 3.6-8 8-8s8 3.6 8 8c0 4-3 6-8 7s-8 3-8 7c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function CheckBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M32 4l5.2 7.2 8.8-1.6 1.6 8.8L55 22.8 50 32l5 9.2-7.4 4.4-1.6 8.8-8.8-1.6L32 60l-5.2-7.2-8.8 1.6-1.6-8.8L9 41.2 14 32l-5-9.2 7.4-4.4 1.6-8.8 8.8 1.6L32 4z" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.13" strokeWidth="2"/>
      <path d="M22 32l7 7 13-13" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RingDecor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeOpacity="0.06" strokeWidth="12"/>
      <circle cx="60" cy="60" r="36" stroke="currentColor" strokeOpacity="0.04" strokeWidth="8"/>
    </svg>
  );
}

// ── Icon config per variant ───────────────────────────────────────────────────

interface IconPlacement {
  Icon: React.FC<{ className?: string }>;
  color: string;
  size: string;
  pos: string;
  anim: string;
  delay: string;
}

const configs: Record<Variant, IconPlacement[]> = {
  hero: [
    { Icon: Shield,      color: "text-blue-500",   size: "w-24 h-24", pos: "top-12 right-[6%]",      anim: "animate-float-slow",    delay: "delay-0" },
    { Icon: Heart,       color: "text-rose-400",   size: "w-16 h-16", pos: "top-[30%] left-[3%]",    anim: "animate-float-reverse", delay: "delay-300" },
    { Icon: Umbrella,    color: "text-blue-400", size: "w-20 h-20", pos: "bottom-16 right-[12%]",  anim: "animate-float-drift",   delay: "delay-600" },
    { Icon: Car,         color: "text-blue-300", size: "w-28 h-16", pos: "bottom-8 left-[8%]",     anim: "animate-float",         delay: "delay-200" },
    { Icon: RingDecor,   color: "text-blue-400",   size: "w-48 h-48", pos: "-top-10 -left-10",       anim: "animate-spin-slow",     delay: "delay-0" },
    { Icon: RingDecor,   color: "text-green-400", size: "w-64 h-64", pos: "-bottom-16 -right-16",   anim: "animate-spin-slow",     delay: "delay-500" },
  ],
  categories: [
    { Icon: Shield,      color: "text-blue-400",   size: "w-20 h-20", pos: "top-6 left-[2%]",       anim: "animate-float",         delay: "delay-100" },
    { Icon: Coin,        color: "text-green-400",  size: "w-16 h-16", pos: "top-10 right-[4%]",     anim: "animate-float-reverse", delay: "delay-400" },
    { Icon: RingDecor,   color: "text-blue-300", size: "w-40 h-40", pos: "bottom-0 left-[40%]",   anim: "animate-spin-slow",     delay: "delay-200" },
  ],
  providers: [
    { Icon: CheckBadge,  color: "text-emerald-400", size: "w-20 h-20", pos: "top-8 right-[5%]",     anim: "animate-float-slow",    delay: "delay-200" },
    { Icon: Shield,      color: "text-blue-300",    size: "w-14 h-14", pos: "bottom-12 left-[3%]",  anim: "animate-float-reverse", delay: "delay-0" },
    { Icon: RingDecor,   color: "text-blue-200",    size: "w-56 h-56", pos: "-top-8 -right-8",      anim: "animate-spin-slow",     delay: "delay-300" },
  ],
  howItWorks: [
    { Icon: Document,    color: "text-green-400", size: "w-18 h-20", pos: "top-10 left-[4%]",      anim: "animate-float-drift",   delay: "delay-100" },
    { Icon: Stethoscope, color: "text-emerald-400",size: "w-20 h-20", pos: "top-14 right-[6%]",     anim: "animate-float-slow",    delay: "delay-400" },
    { Icon: RingDecor,   color: "text-green-200", size: "w-44 h-44", pos: "bottom-4 left-[30%]",   anim: "animate-spin-slow",     delay: "delay-0" },
  ],
  calculator: [
    { Icon: Coin,        color: "text-green-400",  size: "w-20 h-20", pos: "top-8 left-[5%]",       anim: "animate-float-slow",    delay: "delay-200" },
    { Icon: Document,    color: "text-blue-400",   size: "w-16 h-20", pos: "top-12 right-[3%]",     anim: "animate-float",         delay: "delay-500" },
    { Icon: Car,         color: "text-blue-300", size: "w-32 h-20", pos: "bottom-16 left-[2%]",   anim: "animate-float-reverse", delay: "delay-100" },
    { Icon: RingDecor,   color: "text-blue-200", size: "w-48 h-48", pos: "-bottom-12 -right-12",  anim: "animate-spin-slow",     delay: "delay-0" },
  ],
  policies: [
    { Icon: Shield,      color: "text-blue-400",   size: "w-18 h-18", pos: "top-16 right-[4%]",     anim: "animate-float",         delay: "delay-300" },
    { Icon: CheckBadge,  color: "text-emerald-400", size: "w-16 h-16", pos: "top-8 left-[3%]",      anim: "animate-float-drift",   delay: "delay-0" },
    { Icon: RingDecor,   color: "text-blue-200",    size: "w-52 h-52", pos: "bottom-0 left-[45%]",  anim: "animate-spin-slow",     delay: "delay-400" },
  ],
  whyUs: [
    { Icon: Umbrella,    color: "text-blue-400", size: "w-20 h-20", pos: "top-10 left-[5%]",      anim: "animate-float-slow",    delay: "delay-200" },
    { Icon: Heart,       color: "text-rose-400",   size: "w-16 h-16", pos: "top-14 right-[5%]",     anim: "animate-float-reverse", delay: "delay-500" },
    { Icon: RingDecor,   color: "text-rose-200",   size: "w-44 h-44", pos: "-top-8 -left-8",        anim: "animate-spin-slow",     delay: "delay-0" },
  ],
  testimonials: [
    { Icon: Heart,       color: "text-pink-400",   size: "w-18 h-18", pos: "top-8 left-[4%]",       anim: "animate-float",         delay: "delay-100" },
    { Icon: CheckBadge,  color: "text-blue-400",   size: "w-20 h-20", pos: "bottom-10 right-[4%]",  anim: "animate-float-slow",    delay: "delay-400" },
    { Icon: RingDecor,   color: "text-pink-200",   size: "w-56 h-56", pos: "-bottom-10 -left-10",   anim: "animate-spin-slow",     delay: "delay-0" },
  ],
  faq: [
    { Icon: Shield,      color: "text-blue-300",   size: "w-16 h-16", pos: "top-10 right-[5%]",     anim: "animate-float-drift",   delay: "delay-200" },
    { Icon: Document,    color: "text-green-300", size: "w-14 h-18", pos: "bottom-12 left-[4%]",   anim: "animate-float-reverse", delay: "delay-0" },
    { Icon: RingDecor,   color: "text-blue-200", size: "w-40 h-40", pos: "top-0 left-[35%]",      anim: "animate-spin-slow",     delay: "delay-300" },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BgDecorations({ variant = "hero", className = "" }: Props) {
  const items = configs[variant];
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {items.map((item, i) => {
        const { Icon, color, size, pos, anim, delay } = item;
        return (
          <div key={i} className={`absolute ${pos} ${anim} ${delay} opacity-100`}>
            <Icon className={`${size} ${color}`} />
          </div>
        );
      })}
    </div>
  );
}
