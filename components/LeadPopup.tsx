"use client";

import { useEffect, useState, useRef } from "react";

const FIRST_DELAY = 15_000;  // 15 seconds on first visit
const REPEAT_DELAY = 60_000; // every 1 minute after dismissal

const CATEGORIES = ["term", "health", "motor", "life"];
const CAT_LABELS: Record<string, string> = {
  term: "Term Insurance",
  health: "Health Insurance",
  motor: "Motor Insurance",
  life: "Life Insurance",
};

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleNext(delay: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  }

  useEffect(() => {
    // Don't show on admin pages
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return;

    // Check if user submitted — never show again
    const submitted = localStorage.getItem("lp_submitted");
    if (submitted) return;

    // First visit or returning — pick delay
    const lastSeen = localStorage.getItem("lp_last_seen");
    const now = Date.now();

    if (!lastSeen) {
      // True first visit — wait 45s
      scheduleNext(FIRST_DELAY);
    } else {
      const elapsed = now - Number(lastSeen);
      const remaining = REPEAT_DELAY - elapsed;
      scheduleNext(remaining > 0 ? remaining : 0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleDismiss() {
    setOpen(false);
    localStorage.setItem("lp_last_seen", String(Date.now()));
    scheduleNext(REPEAT_DELAY);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, leadType: "quote", utmSource: "popup" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        localStorage.setItem("lp_submitted", "1");
        if (timerRef.current) clearTimeout(timerRef.current);
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {done ? (
            /* Success state */
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">You&apos;re all set!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Our advisor will call you within 30 minutes with the best options for you.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Got it →
              </button>
            </div>
          ) : (
            /* Form state */
            <div className="p-7">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-5 right-5 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-6 pr-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Free Expert Advice</p>
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  Get the Best Insurance{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Quote Today
                  </span>
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Talk to a certified advisor in 30 min · 100% free · No spam
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 hover:border-gray-300 transition-colors bg-gray-50"
                  />
                </div>

                {/* Category selector */}
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-150 ${
                        form.category === cat
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {CAT_LABELS[cat]}
                    </button>
                  ))}
                </div>

                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    required
                    className="flex-1 border-2 border-gray-200 rounded-r-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 hover:border-gray-300 transition-colors bg-gray-50"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shine w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : "Get Free Quote →"}
                </button>
              </form>

              {/* Trust */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                256-bit SSL · IRDAI Registered · No spam
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
