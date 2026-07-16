"use client";

import { useRef, useState } from "react";
import { Testimonial } from "@prisma/client";
import BgDecorations from "./BgDecorations";
import { Star, Quote, Check, Loader2 } from "lucide-react";

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
  car:    "bg-blue-100 text-blue-700",
  "two-wheeler": "bg-indigo-100 text-indigo-700",
  "family-health": "bg-blue-100 text-blue-700",
  "group-health": "bg-indigo-100 text-indigo-700",
  travel: "bg-blue-100 text-blue-700",
  home:   "bg-indigo-100 text-indigo-700",
  "term-women": "bg-blue-100 text-blue-700",
  "term-rop": "bg-indigo-100 text-indigo-700",
  "guaranteed-return": "bg-blue-100 text-blue-700",
  "child-savings": "bg-indigo-100 text-indigo-700",
  retirement: "bg-blue-100 text-blue-700",
};

const CAT_LABEL: Record<string, string> = {
  general: "General Feedback",
  term: "Term Insurance",
  health: "Health Insurance",
  motor: "Motor Insurance",
  life: "Life Insurance",
  car: "Car Insurance",
  "two-wheeler": "Two Wheeler Insurance",
  "family-health": "Family Health Insurance",
  "group-health": "Group Health Insurance",
  travel: "Travel Insurance",
  home: "Home Insurance",
  "term-women": "Term Insurance for Women",
  "term-rop": "Return of Premium Term Plans",
  "guaranteed-return": "Guaranteed Return Plans",
  "child-savings": "Child Savings Plans",
  retirement: "Retirement Plans"
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Testimonial[]>(testimonials.length > 0 ? testimonials : fallback);
  const [form, setForm] = useState({ name: "", city: "", rating: 5, body: "", category: "general" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const scrollItems = [...items, ...items, ...items];
  const duration = Math.max(items.length * 6, 20); // guard against division by zero

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit feedback.");
        return;
      }

      setSuccess(true);
      if (data.data) {
        setItems([data.data, ...items]);
      }
    } catch (err: any) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            {scrollItems.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="group flex-shrink-0 flex flex-col bg-white border-2 border-gray-100 rounded-3xl p-7 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/80 hover:-translate-y-1.5 transition-all duration-300"
                style={{ width: "320px" }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <Stars rating={t.rating} />
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${(t.category && CAT_PILL[t.category]) ?? "bg-gray-100 text-gray-600"}`}>
                    {t.category ? (CAT_LABEL[t.category] ?? t.category) : ""}
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

        {/* Feedback Form Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-blue-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">
                Share Your Experience
              </h3>
              <p className="text-gray-500 text-sm mb-8 text-center sm:text-left">
                Your feedback helps us improve and guides other customers in selecting the best coverage.
              </p>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">Thank you for your feedback!</h4>
                  <p className="text-sm text-emerald-600">Your review has been successfully submitted and listed.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setForm({ name: "", city: "", rating: 5, body: "", category: "general" });
                    }}
                    className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition"
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Delhi"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Insurance Type
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      >
                        <option value="general">General Feedback</option>
                        <option value="term">Term Insurance</option>
                        <option value="health">Health Insurance</option>
                        <option value="motor">Motor Insurance</option>
                        <option value="life">Life Insurance</option>
                        <option value="car">Car Insurance</option>
                        <option value="two-wheeler">Two Wheeler Insurance</option>
                        <option value="family-health">Family Health Insurance</option>
                        <option value="group-health">Group Health Insurance</option>
                        <option value="travel">Travel Insurance</option>
                        <option value="home">Home Insurance</option>
                        <option value="term-women">Term Insurance for Women</option>
                        <option value="term-rop">Return of Premium Term Plans</option>
                        <option value="guaranteed-return">Guaranteed Return Plans</option>
                        <option value="child-savings">Child Savings Plans</option>
                        <option value="retirement">Retirement Plans</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Your Rating *
                      </label>
                      <div className="flex gap-1.5 h-[46px] items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm({ ...form, rating: star })}
                            className="p-1 hover:scale-110 transition"
                            title={`${star} Star${star > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      placeholder="Tell us about your experience..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
