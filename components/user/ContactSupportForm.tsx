"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface Props {
  name: string;
  phone: string;
  email?: string | null;
}

export default function ContactSupportForm({ name, phone, email }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email ?? undefined,
          leadType: "callback",
          utmSource: `user_query: ${message.trim()}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check width="22" height="22" stroke="#059669" strokeWidth={2} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#065F46" }}>Message sent!</p>
        <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", maxWidth: 280 }}>
          Our team will reach out to you on <strong>+91 {phone}</strong> within 30 minutes.
        </p>
        <button
          onClick={() => { setSent(false); setMessage(""); }}
          style={{ marginTop: 4, fontSize: 11, color: "#1E54D0", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 16 }}>
        {[
          { label: "Your Name", value: name },
          { label: "Mobile", value: `+91 ${phone}` },
        ].map((f) => (
          <div key={f.label}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{f.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          How can we help?
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your query — e.g. help with a claim, changing nominee, policy document, etc."
          rows={4}
          required
          style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#1E293B", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }}
          onFocus={(e) => (e.target.style.borderColor = "#1E54D0")}
          onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
        />
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#DC2626", marginBottom: 10 }}>{error}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="submit"
          disabled={loading || !message.trim()}
          style={{ background: "#1E54D0", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", opacity: loading || !message.trim() ? 0.55 : 1, transition: "opacity 0.15s" }}
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
        <p style={{ fontSize: 11, color: "#94A3B8" }}>We reply via call within 30 min.</p>
      </div>
    </form>
  );
}
