"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneLookup() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/by-phone?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Not found"); return; }
      router.push(`/admin/registered-users/${data.user.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLookup} className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-xs text-gray-400 font-semibold select-none">+91</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="Lookup by mobile…"
            maxLength={10}
            className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-44 transition-colors"
          />
        </div>
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading || phone.length < 10}
        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
      >
        {loading ? "…" : "Find User"}
      </button>
    </form>
  );
}
