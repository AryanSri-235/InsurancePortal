import Link from "next/link";
import { Check } from "lucide-react";

interface ComparisonCTAProps {
  category: string;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    term: "Term Insurance",
    health: "Health Insurance",
    motor: "Motor Insurance",
    life: "Life Insurance",
  };
  return labels[category.toLowerCase()] ?? category.charAt(0).toUpperCase() + category.slice(1) + " Insurance";
}

export default function ComparisonCTA({ category }: ComparisonCTAProps) {
  const label = getCategoryLabel(category);

  return (
    <section className="py-16 bg-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-green-700 rounded-3xl p-10 text-white relative overflow-hidden">
          {/* Decorative rings */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[40px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-[50px] border-white/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left side */}
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full mb-4">
                Compare Plans
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
                Compare Up to 3 {label} Plans<br className="hidden sm:block" /> Side by Side
              </h2>
              <ul className="space-y-3">
                {[
                  "See exact premium difference",
                  "Compare claim ratio & benefits",
                  "Find your best match instantly",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base font-medium text-white/90">
                    <Check className="w-5 h-5 flex-shrink-0 text-white" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-center gap-4">
              <Link
                href={`/compare?type=${category}`}
                className="inline-block bg-white text-blue-700 font-black text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 whitespace-nowrap"
              >
                Compare Plans Side by Side →
              </Link>
              <span className="text-white/70 text-sm">
                or{" "}
                <Link
                  href="/contact"
                  className="text-white underline underline-offset-2 hover:text-white/90 transition-colors"
                >
                  talk to an expert
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
