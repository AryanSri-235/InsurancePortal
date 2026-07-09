"use client";

import { useEffect, useState, useRef } from "react";
import QuoteForm from "@/components/QuoteForm";
import { X, ShieldCheck } from "lucide-react";

const FIRST_DELAY = 15_000;
const REPEAT_DELAY = 60_000;

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleNext(delay: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  }

  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    if (path.startsWith("/admin") || path === "/login" || path === "/register" || path.startsWith("/account") || path === "/forgot-password") return;

    const submitted = localStorage.getItem("lp_submitted");
    if (submitted) return;

    const lastSeen = localStorage.getItem("lp_last_seen");
    const now = Date.now();

    if (!lastSeen) {
      scheduleNext(FIRST_DELAY);
    } else {
      const elapsed = now - Number(lastSeen);
      const remaining = REPEAT_DELAY - elapsed;
      scheduleNext(remaining > 0 ? remaining : 0);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleDismiss() {
    setOpen(false);
    localStorage.setItem("lp_last_seen", String(Date.now()));
    scheduleNext(REPEAT_DELAY);
  }

  function handleSuccess() {
    localStorage.setItem("lp_submitted", "1");
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in" onClick={handleDismiss} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-green-500" />

          <div className="p-7">
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 pr-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Free Expert Advice</p>
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                Get the Best Insurance{" "}
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Quote Today
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Talk to a certified advisor in 30 min · 100% free · No spam
              </p>
            </div>

            <QuoteForm compact utmSource="popup" onSuccess={handleSuccess} />

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              256-bit SSL · IRDAI Registered · No spam
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
