"use client";

import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
  policyName: string;
  category: string;
  policyId: number;
  brochureUrl?: string | null;
}

export default function PolicySidebar({ policyName, category, policyId, brochureUrl }: Props) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Please enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category, policyId, leadType: "quote" }),
      });
      if (res.ok) {
        setForm({ name: "", phone: "" });
        Swal.fire({
          icon: "success",
          title: "We'll call you shortly! 📞",
          text: `Our advisor will explain ${policyName} to you in detail.`,
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Got it!",
        });
      } else {
        Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please try again.", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Network Error", text: "Please check your connection and try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-600 text-white rounded-2xl p-5 sticky top-20">
        <h3 className="font-bold text-base mb-1">Get a Free Quote</h3>
        <p className="text-blue-100 text-xs mb-4">for {policyName}</p>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <div className="flex">
            <span className="inline-flex items-center px-2 rounded-l-lg bg-white/10 border border-r-0 border-white/20 text-blue-200 text-xs">
              +91
            </span>
            <input
              type="tel"
              placeholder="Mobile number"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              required
              className="flex-1 bg-white/15 border border-white/20 rounded-r-lg px-3 py-2 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-600 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 disabled:opacity-60 transition-colors"
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
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Brochure
          </a>
        )}
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1 w-full text-left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Add to Compare
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1 w-full text-left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Plan
        </button>
      </div>
    </div>
  );
}
