"use client";

import { useState } from "react";

interface Props {
  providerName: string;
  category: string;
}

export default function ProviderLeadForm({ providerName, category }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ ...form, category, leadType: "quote" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", email: "" });
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="quote" className="bg-white border-2 border-gray-100 rounded-3xl shadow-xl shadow-gray-100/60 p-7 sticky top-24">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-black text-xl text-gray-900 mb-2">Request Submitted!</h3>
          <p className="text-gray-500 text-sm">Our {providerName} advisor will call you within 30 minutes.</p>
          <button onClick={() => setSuccess(false)} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
            Submit another →
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1">Free Expert Advice</p>
            <h3 className="font-black text-xl text-gray-900">Get Quote from {providerName}</h3>
            <p className="text-gray-400 text-xs mt-1">No spam · No hidden charges · Reply in 30 min</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 hover:border-gray-300 transition-colors bg-gray-50"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 hover:border-gray-300 transition-colors bg-gray-50"
            />
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold">
                +91
              </span>
              <input
                type="tel"
                placeholder="10-digit mobile"
                maxLength={10}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting...
                </span>
              ) : "Get Free Quote →"}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your data is protected by 256-bit SSL encryption
          </div>
        </>
      )}
    </div>
  );
}
