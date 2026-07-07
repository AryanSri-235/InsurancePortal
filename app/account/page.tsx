import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/user/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/user/LogoutButton";
import QuickQuoteButton from "@/components/user/QuickQuoteButton";

export const dynamic = "force-dynamic";

async function getUserLeads(phone: string) {
  const now = new Date();
  const thirtyDaysOut = new Date(Date.now() + 30 * 86400000);

  const [leads, upcomingDueDates, allDueDates] = await Promise.all([
    db.lead.findMany({
      where: { phone },
      orderBy: { createdAt: "desc" },
      include: { policy: { include: { provider: true } } },
    }),
    db.dueDate.findMany({
      where: { phone, dueDate: { gte: now, lte: thirtyDaysOut }, status: { not: "lapsed" } },
      orderBy: { dueDate: "asc" },
      include: { policy: { include: { provider: true } } },
    }),
    db.dueDate.findMany({
      where: { phone },
      orderBy: { dueDate: "asc" },
      include: { policy: { include: { provider: true } } },
    }),
  ]);

  return { leads, upcomingDueDates, allDueDates };
}

const CAT_LABEL: Record<string, string> = {
  term: "Term", life: "Life", health: "Health", motor: "Motor",
  car: "Car", "two-wheeler": "Two-Wheeler", travel: "Travel", home: "Home",
};

const CAT_COLOR: Record<string, string> = {
  term: "#1E54D0", life: "#7C3AED", health: "#059669", motor: "#EA580C",
  car: "#EA580C", "two-wheeler": "#D97706", travel: "#0891B2", home: "#16A34A",
};

function daysUntil(date: Date) {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, dot: "#DC2626", text: "#DC2626", urgent: true };
  if (diff === 0) return { label: "Due today",    dot: "#DC2626", text: "#DC2626", urgent: true };
  if (diff <= 7)  return { label: `${diff} days`,  dot: "#EA580C", text: "#EA580C", urgent: true };
  if (diff <= 30) return { label: `${diff} days`,  dot: "#D97706", text: "#92400E", urgent: false };
  return                { label: `${diff} days`,  dot: "#CBD5E1", text: "#64748B", urgent: false };
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  new:       { label: "Pending",   bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  contacted: { label: "Contacted", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  converted: { label: "Converted", bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  lost:      { label: "Closed",    bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

function NavIcon({ path }: { path: string }) {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default async function AccountPage() {
  const session = await getUserSession();
  if (!session) redirect("/login");

  const { leads, upcomingDueDates, allDueDates } = await getUserLeads(session.phone);

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, phone: true, email: true, city: true, gender: true, dob: true, createdAt: true, lastLoginAt: true },
  });

  if (!user) redirect("/login");

  const quoteRequests = leads.filter((l) => l.leadType === "quote");
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EDF0F4", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0, background: "#0B1120",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: "#1E54D0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 10, letterSpacing: "-0.5px" }}>IP</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px" }}>
              Insurance<span style={{ color: "#4D80F0" }}>Portal</span>
            </span>
          </Link>
        </div>

        {/* Profile block */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1E54D0 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px" }}>{initials}</span>
          </div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.3, marginBottom: 3 }}>{user.name}</p>
          <p style={{ color: "#5C6B84", fontSize: 11, fontWeight: 500 }}>+91 {user.phone}</p>
          {user.city && <p style={{ color: "#5C6B84", fontSize: 11, marginTop: 1 }}>{user.city}</p>}
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(30,84,208,0.15)", border: "1px solid rgba(30,84,208,0.3)", borderRadius: 20, padding: "3px 8px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }} />
            <span style={{ color: "#93C5FD", fontSize: 10, fontWeight: 600 }}>Member since {memberSince}</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <p style={{ color: "#3A4A60", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>Menu</p>
          {[
            { label: "Overview",  href: "#overview",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Renewals",  href: "#renewals",  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Quotes",    href: "#quotes",    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { label: "Profile",   href: "#profile",   icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, color: "#8899B4", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all 0.15s", marginBottom: 1 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8899B4"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
              <NavIcon path={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Sidebar CTA */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ background: "rgba(30,84,208,0.12)", border: "1px solid rgba(30,84,208,0.25)", borderRadius: 10, padding: "12px" }}>
            <p style={{ color: "#93C5FD", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Need coverage?</p>
            <p style={{ color: "#5C6B84", fontSize: 10, lineHeight: 1.4, marginBottom: 10 }}>Advisor calls you in 30 min.</p>
            <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} sidebar />
          </div>
        </div>

        {/* Bottom links */}
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/" style={{ color: "#5C6B84", fontSize: 11, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "5px 0" }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Back to site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px", maxHeight: "100vh" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>

          {/* Page header */}
          <div id="overview" style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#8899B4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              My Account
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              Hello, {user.name.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "#5C6B84", fontSize: 13, marginTop: 4 }}>
              Here's a summary of your insurance activity.
            </p>
          </div>

          {/* ── Stats row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Quote Requests", value: quoteRequests.length, accent: "#1E54D0", note: "submitted by you" },
              { label: "Tracked Renewals", value: allDueDates.length, accent: "#7C3AED", note: "policies on record" },
              { label: "Due This Month", value: upcomingDueDates.length, accent: upcomingDueDates.length > 0 ? "#EA580C" : "#059669", note: upcomingDueDates.length > 0 ? "need attention" : "you're all clear" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", borderLeft: `3px solid ${s.accent}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#8899B4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: "#0B1120", letterSpacing: "-1px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#8899B4", marginTop: 5 }}>{s.note}</p>
              </div>
            ))}
          </div>

          {/* ── Urgent alert ── */}
          {upcomingDueDates.length > 0 && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="#D97706" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "#92400E", fontSize: 13, marginBottom: 10 }}>
                    {upcomingDueDates.length} renewal{upcomingDueDates.length > 1 ? "s" : ""} due in the next 30 days
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {upcomingDueDates.map((d) => {
                      const t = daysUntil(d.dueDate);
                      return (
                        <div key={d.id} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #FDE68A" }}>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>{d.policyNumber ?? "Policy"}</p>
                            {d.policy && <p style={{ fontSize: 11, color: "#8899B4", marginTop: 1 }}>{d.policy.provider.name} · {d.policy.name}</p>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{t.label}</p>
                            <p style={{ fontSize: 11, color: "#8899B4" }}>{new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Renewals ── */}
          <div id="renewals" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="15" height="15" fill="none" stroke="#1E54D0" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Policy Renewals</span>
              </div>
              <span style={{ fontSize: 11, color: "#8899B4", background: "#F1F5F9", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{allDueDates.length} total</span>
            </div>

            {allDueDates.length === 0 ? (
              <div style={{ padding: "52px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>No renewals tracked yet</p>
                <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", maxWidth: 260 }}>Our advisors will add your policy renewal dates after you request a quote.</p>
                <div style={{ marginTop: 4 }}>
                  <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} small />
                </div>
              </div>
            ) : (
              <div>
                {allDueDates.map((d, i) => {
                  const t = daysUntil(d.dueDate);
                  const catColor = d.policy ? (CAT_COLOR[d.policy.category] ?? "#1E54D0") : "#1E54D0";
                  const catLabel = d.policy ? (CAT_LABEL[d.policy.category] ?? d.policy.category) : "Policy";
                  return (
                    <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < allDueDates.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      {/* Urgency dot */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
                      </div>
                      {/* Category tag */}
                      <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, borderRadius: 6, padding: "2px 7px", flexShrink: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {catLabel}
                      </span>
                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {d.policyNumber ?? "Policy Renewal"}
                        </p>
                        {d.policy && (
                          <p style={{ fontSize: 11, color: "#8899B4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.policy.provider.name} · {d.policy.name}</p>
                        )}
                      </div>
                      {/* Date + countdown */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{t.label}</p>
                        <p style={{ fontSize: 11, color: "#94A3B8" }}>{new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      {/* Status pill */}
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 20, background: d.status === "renewed" ? "#ECFDF5" : d.status === "lapsed" ? "#FFF1F2" : "#FFFBEB", color: d.status === "renewed" ? "#065F46" : d.status === "lapsed" ? "#9F1239" : "#92400E", border: `1px solid ${d.status === "renewed" ? "#A7F3D0" : d.status === "lapsed" ? "#FECDD3" : "#FDE68A"}`, flexShrink: 0 }}>
                        {d.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Quotes ── */}
          <div id="quotes" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="15" height="15" fill="none" stroke="#1E54D0" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Quote Requests</span>
              </div>
              <span style={{ fontSize: 11, color: "#8899B4", background: "#F1F5F9", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{quoteRequests.length}</span>
            </div>

            {quoteRequests.length === 0 ? (
              <div style={{ padding: "52px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>No quote requests yet</p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>Request a quote and an expert will call you within 30 minutes.</p>
                <div style={{ marginTop: 4 }}>
                  <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} small />
                </div>
              </div>
            ) : (
              <div>
                {quoteRequests.map((lead, i) => {
                  const s = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
                  const catColor = CAT_COLOR[lead.category ?? ""] ?? "#1E54D0";
                  const catLabel = CAT_LABEL[lead.category ?? ""] ?? (lead.category ?? "Insurance");
                  return (
                    <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < quoteRequests.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, borderRadius: 6, padding: "2px 7px", flexShrink: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {catLabel}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>
                          {catLabel} Quote
                        </p>
                        {lead.policy && (
                          <p style={{ fontSize: 11, color: "#8899B4" }}>{lead.policy.provider.name} · {lead.policy.name}</p>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0 }}>
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", padding: "3px 9px", borderRadius: 20, background: s.bg, color: s.text, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Profile ── */}
          <div id="profile" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" fill="none" stroke="#1E54D0" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Profile</span>
            </div>
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px 24px" }}>
              {[
                { label: "Full Name",    value: user.name },
                { label: "Mobile",       value: `+91 ${user.phone}` },
                { label: "Email",        value: user.email ?? "—" },
                { label: "City",         value: user.city ?? "—" },
                { label: "Gender",       value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—" },
                { label: "Date of Birth",value: user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) },
                { label: "Last Login",   value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
              ].map((f) => (
                <div key={f.label}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer spacer */}
          <div style={{ height: 40 }} />
        </div>
      </main>
    </div>
  );
}
