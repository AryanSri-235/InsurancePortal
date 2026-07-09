"use client";

import { useEffect, useRef, useState } from "react";
import { Handshake, ClipboardList, SmilePlus, BadgeCheck } from "lucide-react";

const stats = [
  { value: 50,  suffix: "+",  label: "Insurance Partners", icon: Handshake,     color: "text-blue-600",  bg: "bg-blue-50  border-blue-100"  },
  { value: 200, suffix: "+",  label: "Plans Available",    icon: ClipboardList, color: "text-blue-600",  bg: "bg-indigo-50 border-indigo-100" },
  { value: 1,   suffix: "L+", label: "Happy Customers",   icon: SmilePlus,     color: "text-blue-600",  bg: "bg-blue-50  border-blue-100"  },
  { value: 99,  suffix: "%",  label: "Claim Support Rate", icon: BadgeCheck,    color: "text-blue-600",  bg: "bg-indigo-50 border-indigo-100" },
];

function Counter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let n = 0; const step = target / 40;
        const t = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(n)); }, 30);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className={color}>{count}{suffix}</span>;
}

export default function StatsBar() {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
            <div key={s.label} style={{ animationDelay: `${i * 0.08}s` }} className={`animate-fade-in-up group border-2 rounded-2xl p-6 text-center card-hover ${s.bg}`}>
              <div className="flex justify-center mb-2 transition-transform duration-300 group-hover:scale-110"><Icon className="w-6 h-6" /></div>
              <div className="text-3xl font-black mb-1">
                <Counter target={s.value} suffix={s.suffix} color={s.color} />
              </div>
              <div className="text-gray-500 text-xs font-medium">{s.label}</div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
