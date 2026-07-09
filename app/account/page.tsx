import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/user/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/user/LogoutButton";
import QuickQuoteButton from "@/components/user/QuickQuoteButton";
import RenewalRequestButton from "@/components/user/RenewalRequestButton";
import ContactSupportForm from "@/components/user/ContactSupportForm";
import { Home, Calendar, FileText, User, MessageSquare, ExternalLink, AlertTriangle, Clipboard, Copy, type LucideIcon } from "lucide-react";

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
  term: "#004aad", life: "#7C3AED", health: "#059669", motor: "#EA580C",
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
  new:       { label: "Pending",   bg: "#eef8f9", text: "#186874", border: "#a2dae0" },
  contacted: { label: "Contacted", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  converted: { label: "Converted", bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  lost:      { label: "Closed",    bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

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
    <div className="acct-wrapper">
      <style>{`
        /* ── Base ── */
        .acct-wrapper {
          display: flex; min-height: 100vh;
          background: #EDF0F4;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Sidebar (desktop) ── */
        .acct-sidebar {
          width: 220px; flex-shrink: 0; background: #0B1120;
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }

        /* ── Mobile header (hidden on desktop) ── */
        .acct-mobile-header {
          display: none;
          position: sticky; top: 0; z-index: 50;
          background: #0B1120;
          align-items: center; justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Mobile bottom nav ── */
        .acct-bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          background: #0B1120;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 8px 0 env(safe-area-inset-bottom, 8px);
        }
        .acct-bottom-nav-inner {
          display: flex; justify-content: space-around; align-items: center;
        }
        .acct-bnav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          color: #5C6B84; text-decoration: none; font-size: 10px; font-weight: 600;
          padding: 4px 8px;
        }
        .acct-bnav-item:hover { color: #93C5FD; }

        /* ── Main ── */
        .acct-main {
          flex: 1; overflow-y: auto; padding: 32px 36px; max-height: 100vh;
        }
        .acct-content { max-width: 740px; margin: 0 auto; }

        /* ── Stats grid ── */
        .acct-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px; margin-bottom: 28px;
        }

        /* ── Profile grid ── */
        .acct-profile-grid {
          padding: 20px;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 18px 24px;
        }

        /* ── Renewal row ── */
        .acct-renewal-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px;
        }
        .acct-renewal-left  { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
        .acct-renewal-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .acct-renewal-date  { text-align: right; flex-shrink: 0; }

        /* ── Quote row ── */
        .acct-quote-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 20px;
        }
        .acct-quote-left  { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
        .acct-quote-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* ── Sidebar nav links ── */
        .acct-nav-link {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; border-radius: 8px;
          color: #8899B4; font-size: 13px; font-weight: 500;
          text-decoration: none; margin-bottom: 1px; transition: all 0.15s;
        }
        .acct-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .acct-logout:hover   { color: #F87171 !important; }

        /* ── Mobile breakpoint ── */
        @media (max-width: 767px) {
          .acct-wrapper       { flex-direction: column; }
          .acct-sidebar       { display: none; }
          .acct-mobile-header { display: flex; }
          .acct-bottom-nav    { display: block; }
          .acct-main {
            padding: 16px 14px;
            max-height: none;
            overflow-y: visible;
            /* leave room for bottom nav */
            padding-bottom: calc(72px + env(safe-area-inset-bottom, 8px));
          }
          .acct-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px; margin-bottom: 18px;
          }
          .acct-profile-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px 18px; padding: 16px;
          }
          .acct-renewal-row {
            flex-wrap: wrap; gap: 8px; padding: 12px 14px;
          }
          .acct-renewal-right {
            width: 100%; justify-content: flex-end; padding-left: 0;
          }
          .acct-renewal-left  { flex-wrap: wrap; }
          .acct-renewal-left p { white-space: normal !important; }
          .acct-quote-row     { flex-wrap: wrap; gap: 8px; padding: 12px 14px; }
          .acct-quote-right   { width: 100%; justify-content: flex-end; }
          .acct-quote-left p  { white-space: normal !important; }
        }

        @media (max-width: 400px) {
          .acct-stats         { grid-template-columns: 1fr; }
          .acct-profile-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Mobile header ── */}
      <div className="acct-mobile-header">
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: "3px 7px" }}>
            <img src="/logo-zoomed.png" alt="NPS Insurance.Life" style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }} />
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #186874 0%, #004aad 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>{initials}</span>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* ── Sidebar (desktop only) ── */}
      <aside className="acct-sidebar">
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: "4px 8px" }}>
              <img src="/logo-zoomed.png" alt="NPS Insurance.Life" style={{ height: 36, width: "auto", objectFit: "contain", display: "block" }} />
            </div>
          </Link>
        </div>

        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #186874 0%, #004aad 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px" }}>{initials}</span>
          </div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.3, marginBottom: 3 }}>{user.name}</p>
          <p style={{ color: "#5C6B84", fontSize: 11, fontWeight: 500 }}>+91 {user.phone}</p>
          {user.city && <p style={{ color: "#5C6B84", fontSize: 11, marginTop: 1 }}>{user.city}</p>}
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(24,104,116,0.15)", border: "1px solid rgba(24,104,116,0.3)", borderRadius: 20, padding: "3px 8px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }} />
            <span style={{ color: "#93C5FD", fontSize: 10, fontWeight: 600 }}>Member since {memberSince}</span>
          </div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <p style={{ color: "#3A4A60", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>Menu</p>
          {(
            [
              { label: "Overview",  href: "#overview",  Icon: Home },
              { label: "Renewals",  href: "#renewals",  Icon: Calendar },
              { label: "Quotes",    href: "#quotes",    Icon: FileText },
              { label: "Profile",   href: "#profile",   Icon: User },
              { label: "Contact",   href: "#contact",   Icon: MessageSquare },
            ] as { label: string; href: string; Icon: LucideIcon }[]
          ).map((item) => (
            <a key={item.label} href={item.href} className="acct-nav-link">
              <item.Icon width={15} height={15} strokeWidth={1.8} />
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ background: "rgba(24,104,116,0.12)", border: "1px solid rgba(24,104,116,0.25)", borderRadius: 10, padding: "12px" }}>
            <p style={{ color: "#93C5FD", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Need coverage?</p>
            <p style={{ color: "#5C6B84", fontSize: 10, lineHeight: 1.4, marginBottom: 10 }}>Advisor calls you in 30 min.</p>
            <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} sidebar />
          </div>
        </div>

        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/" style={{ color: "#5C6B84", fontSize: 11, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "5px 0" }}>
            <ExternalLink width={12} height={12} strokeWidth={2} />
            Back to site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="acct-main">
        <div className="acct-content">

          {/* Page header */}
          <div id="overview" style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#8899B4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>My Account</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              Hello, {user.name.split(" ")[0]}
            </h1>
            <p style={{ color: "#5C6B84", fontSize: 13, marginTop: 4 }}>Here&apos;s a summary of your insurance activity.</p>
          </div>

          {/* ── Stats row ── */}
          <div className="acct-stats">
            {[
              { label: "Quote Requests",   value: quoteRequests.length,      accent: "#186874",  note: "submitted by you" },
              { label: "Tracked Renewals", value: allDueDates.length,         accent: "#7C3AED",  note: "policies on record" },
              { label: "Due This Month",   value: upcomingDueDates.length,    accent: upcomingDueDates.length > 0 ? "#EA580C" : "#059669", note: upcomingDueDates.length > 0 ? "need attention" : "you're all clear" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", borderLeft: `3px solid ${s.accent}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#8899B4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: 30, fontWeight: 800, color: "#0B1120", letterSpacing: "-1px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#8899B4", marginTop: 5 }}>{s.note}</p>
              </div>
            ))}
          </div>

          {/* ── Urgent alert ── */}
          {upcomingDueDates.length > 0 && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertTriangle width={16} height={16} stroke="#D97706" strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: "#92400E", fontSize: 13, marginBottom: 10 }}>
                    {upcomingDueDates.length} renewal{upcomingDueDates.length > 1 ? "s" : ""} due in the next 30 days
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {upcomingDueDates.map((d) => {
                      const t = daysUntil(d.dueDate);
                      return (
                        <div key={d.id} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #FDE68A", flexWrap: "wrap" }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>{d.policyNumber ?? "Policy"}</p>
                            {d.policy && <p style={{ fontSize: 11, color: "#8899B4", marginTop: 1 }}>{d.policy.provider.name} · {d.policy.name}</p>}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar width={15} height={15} stroke="#186874" strokeWidth={1.8} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Policy Renewals</span>
              </div>
              <span style={{ fontSize: 11, color: "#8899B4", background: "#F1F5F9", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{allDueDates.length} total</span>
            </div>

            {allDueDates.length === 0 ? (
              <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clipboard width={20} height={20} stroke="#94A3B8" strokeWidth={1.5} />
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
                  const catColor = d.policy ? (CAT_COLOR[d.policy.category] ?? "#186874") : "#186874";
                  const catLabel = d.policy ? (CAT_LABEL[d.policy.category] ?? d.policy.category) : "Policy";
                  return (
                    <div key={d.id} className="acct-renewal-row" style={{ borderBottom: i < allDueDates.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      {/* Left: dot + category + details */}
                      <div className="acct-renewal-left">
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, borderRadius: 6, padding: "2px 7px", flexShrink: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          {catLabel}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {d.policyNumber ?? "Policy Renewal"}
                          </p>
                          {d.policy && (
                            <p style={{ fontSize: 11, color: "#8899B4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.policy.provider.name} · {d.policy.name}</p>
                          )}
                        </div>
                      </div>
                      {/* Right: date + status + button */}
                      <div className="acct-renewal-right">
                        <div className="acct-renewal-date">
                          <p style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{t.label}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8" }}>{new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 20, background: d.status === "renewed" ? "#ECFDF5" : d.status === "lapsed" ? "#FFF1F2" : "#FFFBEB", color: d.status === "renewed" ? "#065F46" : d.status === "lapsed" ? "#9F1239" : "#92400E", border: `1px solid ${d.status === "renewed" ? "#A7F3D0" : d.status === "lapsed" ? "#FECDD3" : "#FDE68A"}`, flexShrink: 0 }}>
                          {d.status}
                        </span>
                        {d.status !== "renewed" && d.status !== "lapsed" && (
                          <RenewalRequestButton
                            name={user.name}
                            phone={user.phone}
                            email={user.email}
                            category={d.policy?.category}
                            policyNumber={d.policyNumber}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Quotes ── */}
          <div id="quotes" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText width={15} height={15} stroke="#186874" strokeWidth={1.8} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Quote Requests</span>
              </div>
              <span style={{ fontSize: 11, color: "#8899B4", background: "#F1F5F9", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{quoteRequests.length}</span>
            </div>

            {quoteRequests.length === 0 ? (
              <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Copy width={20} height={20} stroke="#94A3B8" strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>No quote requests yet</p>
                <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", maxWidth: 240 }}>Request a quote and an expert will call you within 30 minutes.</p>
                <div style={{ marginTop: 4 }}>
                  <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} small />
                </div>
              </div>
            ) : (
              <div>
                {quoteRequests.map((lead, i) => {
                  const s = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
                  const catColor = CAT_COLOR[lead.category ?? ""] ?? "#186874";
                  const catLabel = CAT_LABEL[lead.category ?? ""] ?? (lead.category ?? "Insurance");
                  return (
                    <div key={lead.id} className="acct-quote-row" style={{ borderBottom: i < quoteRequests.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      <div className="acct-quote-left">
                        <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, borderRadius: 6, padding: "2px 7px", flexShrink: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          {catLabel}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>{catLabel} Quote</p>
                          {lead.policy && (
                            <p style={{ fontSize: 11, color: "#8899B4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.policy.provider.name} · {lead.policy.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="acct-quote-right">
                        <p style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0 }}>
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", padding: "3px 9px", borderRadius: 20, background: s.bg, color: s.text, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Profile ── */}
          <div id="profile" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 8 }}>
              <User width={15} height={15} stroke="#186874" strokeWidth={1.8} />
              <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Profile</span>
            </div>
            <div className="acct-profile-grid">
              {[
                { label: "Full Name",     value: user.name },
                { label: "Mobile",        value: `+91 ${user.phone}` },
                { label: "Email",         value: user.email ?? "—" },
                { label: "City",          value: user.city ?? "—" },
                { label: "Gender",        value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—" },
                { label: "Date of Birth", value: user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                { label: "Member Since",  value: new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) },
                { label: "Last Login",    value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
              ].map((f) => (
                <div key={f.label}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0B1120" }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact / Support ── */}
          <div id="contact" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginTop: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare width={15} height={15} stroke="#186874" strokeWidth={1.8} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1120" }}>Contact & Support</span>
              </div>
              <span style={{ fontSize: 11, color: "#8899B4" }}>We&apos;ll call you back</span>
            </div>
            <ContactSupportForm name={user.name} phone={user.phone} email={user.email} />
          </div>

          <div style={{ height: 32 }} />
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="acct-bottom-nav">
        <div className="acct-bottom-nav-inner">
          {(
            [
              { label: "Overview", href: "#overview", Icon: Home },
              { label: "Renewals", href: "#renewals", Icon: Calendar },
              { label: "Quotes",   href: "#quotes",   Icon: FileText },
              { label: "Profile",  href: "#profile",  Icon: User },
              { label: "Support",  href: "#contact",  Icon: MessageSquare },
            ] as { label: string; href: string; Icon: LucideIcon }[]
          ).map((item) => (
            <a key={item.label} href={item.href} className="acct-bnav-item">
              <item.Icon width={18} height={18} strokeWidth={1.8} />
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
