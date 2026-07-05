import { Testimonial } from "@prisma/client";
import BgDecorations from "./BgDecorations";

const fallback: Testimonial[] = [
  { id: 1, name: "Rajesh Kumar",  city: "Delhi",     rating: 5, body: "Got my term insurance sorted in 10 minutes. The comparison made it so easy to pick the right plan for my family.", category: "term",   isActive: true },
  { id: 2, name: "Priya Sharma",  city: "Mumbai",    rating: 5, body: "Star Health's cashless claim was processed within hours. Extremely happy with the service and the portal's guidance.", category: "health", isActive: true },
  { id: 3, name: "Amit Singh",    city: "Bangalore", rating: 4, body: "The motor insurance calculator helped me understand exactly what I was paying for. Transparent and quick.", category: "motor",  isActive: true },
  { id: 4, name: "Sunita Patel",  city: "Ahmedabad", rating: 5, body: "Best platform for comparing insurance. Saved ₹3,000 on my health premium by switching plans through this site.", category: "health", isActive: true },
  { id: 5, name: "Vikram Nair",   city: "Chennai",   rating: 5, body: "Bought HDFC Click2Protect in under 15 minutes. The advisor called me within 30 minutes and helped with all documentation.", category: "term", isActive: true },
  { id: 6, name: "Meena Iyer",    city: "Hyderabad", rating: 5, body: "Very helpful comparison tool. Could compare 5 health plans side by side and pick the one with best claim ratio.", category: "health", isActive: true },
];

const AVATARS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-500",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-cyan-500",
];

const CAT_PILL: Record<string, string> = {
  term:   "bg-blue-100 text-blue-700",
  health: "bg-emerald-100 text-emerald-700",
  motor:  "bg-orange-100 text-orange-700",
  life:   "bg-violet-100 text-violet-700",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
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
          <div className="inline-flex items-center gap-3 mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-2.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
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
              <svg className="w-8 h-8 text-blue-100 mb-3" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

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
