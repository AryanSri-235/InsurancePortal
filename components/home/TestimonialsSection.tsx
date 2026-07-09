import { Testimonial } from "@prisma/client";
import BgDecorations from "./BgDecorations";
import { Star, Quote } from "lucide-react";

const fallback: Testimonial[] = [
  { id: 1, name: "Rajesh Kumar",  city: "Delhi",     rating: 5, body: "Got my term insurance sorted in 10 minutes. The comparison made it so easy to pick the right plan for my family.", category: "term",   isActive: true },
  { id: 2, name: "Priya Sharma",  city: "Mumbai",    rating: 5, body: "Star Health's cashless claim was processed within hours. Extremely happy with the service and the portal's guidance.", category: "health", isActive: true },
  { id: 3, name: "Amit Singh",    city: "Bangalore", rating: 4, body: "The motor insurance calculator helped me understand exactly what I was paying for. Transparent and quick.", category: "motor",  isActive: true },
  { id: 4, name: "Sunita Patel",  city: "Ahmedabad", rating: 5, body: "Best platform for comparing insurance. Saved ₹3,000 on my health premium by switching plans through this site.", category: "health", isActive: true },
  { id: 5, name: "Vikram Nair",   city: "Chennai",   rating: 5, body: "Bought HDFC Click2Protect in under 15 minutes. The advisor called me within 30 minutes and helped with all documentation.", category: "term", isActive: true },
  { id: 6, name: "Meena Iyer",    city: "Hyderabad", rating: 5, body: "Very helpful comparison tool. Could compare 5 health plans side by side and pick the one with best claim ratio.", category: "health", isActive: true },
];

const AVATARS = [
  "from-blue-500 to-blue-700",
  "from-blue-600 to-blue-700",
  "from-blue-600 to-blue-800",
  "from-indigo-600 to-indigo-700",
  "from-blue-400 to-blue-600",
  "from-blue-500 to-indigo-600",
];

const CAT_PILL: Record<string, string> = {
  term:   "bg-blue-100 text-blue-700",
  health: "bg-indigo-100 text-indigo-700",
  motor:  "bg-blue-100 text-blue-700",
  life:   "bg-indigo-100 text-indigo-700",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.length > 0 ? testimonials : fallback;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <BgDecorations variant="testimonials" />
      {/* Soft background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Real Stories</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">Trusted by over 1 lakh Indians across the country</p>

          {/* Overall rating pill */}
          <div className="inline-flex items-center gap-3 mt-6 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-2.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">4.8 out of 5</span>
            <span className="text-sm text-gray-400">· 12,000+ reviews</span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div
              key={t.id}
              style={{ animationDelay: `${i * 0.07}s` }}
              className="animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl p-7 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <Stars rating={t.rating} />
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${(t.category && CAT_PILL[t.category]) ?? "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>
              </div>

              {/* Quote mark */}
              <Quote className="w-8 h-8 text-blue-100 mb-3" fill="currentColor" />

              {/* Body */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{t.body}</p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATARS[i % AVATARS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  {t.city && <p className="text-xs text-gray-400">{t.city}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
