"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterForm({
  source = "other",
  inputClass = "",
  buttonClass = "",
}: {
  source?: string;
  inputClass?: string;
  buttonClass?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check className="w-5 h-5" /></span>
        You&apos;re subscribed!
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2 w-full">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={inputClass || "flex-1 bg-gray-900 border border-gray-700 text-white text-sm px-4 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={buttonClass || "bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 whitespace-nowrap disabled:opacity-60"}
      >
        {state === "loading" ? "..." : "Subscribe →"}
      </button>
      {state === "error" && <span className="text-red-400 text-xs self-center">Try again</span>}
    </form>
  );
}
