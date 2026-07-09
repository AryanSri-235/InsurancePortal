"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

const INSURANCE_TYPES = [
  { value: "term",                   label: "Term Insurance" },
  { value: "health",                 label: "Health Insurance" },
  { value: "life",                   label: "Life Insurance" },
  { value: "motor",                  label: "Motor Insurance" },
  { value: "car",                    label: "Car Insurance" },
  { value: "two-wheeler",            label: "Two Wheeler Insurance" },
  { value: "family-health",          label: "Family Health Insurance" },
  { value: "group-health",           label: "Group Health Insurance" },
  { value: "travel",                 label: "Travel Insurance" },
  { value: "home",                   label: "Home Insurance" },
  { value: "term-women",             label: "Term Insurance for Women" },
  { value: "return-premium",         label: "Term Plans with Return of Premium" },
  { value: "guaranteed-return",      label: "Guaranteed Return Plans" },
  { value: "child-savings",          label: "Child Savings Plans" },
  { value: "retirement",             label: "Retirement Plans" },
];

interface Policy {
  id: number;
  name: string;
  category: string;
  premiumStartsFrom: number | null;
  provider: { name: string };
}

interface Props {
  compact?: boolean;
  onSuccess?: () => void;
  utmSource?: string;
}

export default function QuoteForm({ compact, onSuccess, utmSource = "hero" }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", category: "", policyId: "" });
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!form.category) { setPolicies([]); return; }
    setLoadingPolicies(true);
    setForm(f => ({ ...f, policyId: "" }));
    fetch(`/api/policies?category=${form.category}&limit=50`)
      .then(r => r.json())
      .then(d => setPolicies(d.data ?? []))
      .catch(() => setPolicies([]))
      .finally(() => setLoadingPolicies(false));
  }, [form.category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        category: form.category || undefined,
        leadType: "quote",
        utmSource,
      };
      if (form.policyId) body.policyId = parseInt(form.policyId);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", phone: "", category: "", policyId: "" });
        onSuccess?.();
        Swal.fire({
          icon: "success",
          title: "You're all set!",
          text: "Our advisor will call you within 30 minutes with the best options for you.",
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Great, thanks!",
        });
      } else {
        Swal.fire({ icon: "error", title: "Oops!", text: data.error ?? "Something went wrong.", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Network Error", text: "Please check your connection and try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  const py = compact ? "py-2.5" : "py-3.5";
  const inputCls = `w-full border-2 border-gray-200 rounded-xl px-4 ${py} text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors`;

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>

      {/* Name */}
      <input
        type="text"
        placeholder="Your full name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
        className={inputCls}
      />

      {/* Phone */}
      <div className="flex">
        <span className={`inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-bold ${py}`}>
          +91
        </span>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
          required
          className={`flex-1 border-2 border-gray-200 rounded-r-xl px-4 ${py} text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors`}
        />
      </div>

      {/* Insurance type dropdown */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
          Insurance type
        </label>
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 ${py} text-sm text-gray-800 focus:outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors appearance-none`}
        >
          <option value="">Select insurance type</option>
          {INSURANCE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Specific policy dropdown */}
      {form.category && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
            Specific plan <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          {loadingPolicies ? (
            <div className={`w-full border-2 border-gray-200 rounded-xl px-4 ${py} text-sm text-gray-400 bg-gray-50 flex items-center gap-2`}>
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Loading plans…
            </div>
          ) : (
            <select
              value={form.policyId}
              onChange={e => setForm({ ...form, policyId: e.target.value })}
              className={`w-full border-2 border-gray-200 rounded-xl px-4 ${py} text-sm text-gray-800 focus:outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors appearance-none`}
            >
              <option value="">Any plan — let advisor suggest</option>
              {policies.map(p => (
                <option key={p.id} value={p.id}>
                  {p.provider.name} — {p.name}
                  {p.premiumStartsFrom ? ` (from ₹${p.premiumStartsFrom.toLocaleString("en-IN")}/yr)` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 ${compact ? "py-3" : "py-4"}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : "Get My Free Quote →"}
      </button>

    </form>
  );
}
