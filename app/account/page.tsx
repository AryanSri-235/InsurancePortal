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

  const [leads, upcomingDueDates] = await Promise.all([
    db.lead.findMany({
      where: { phone },
      orderBy: { createdAt: "desc" },
      include: { policy: { include: { provider: true } } },
    }),
    db.dueDate.findMany({
      where: {
        phone,
        dueDate: { gte: now, lte: thirtyDaysOut },
        status: { not: "lapsed" },
      },
      orderBy: { dueDate: "asc" },
      include: { policy: { include: { provider: true } } },
    }),
  ]);

  const allDueDates = await db.dueDate.findMany({
    where: { phone },
    orderBy: { dueDate: "asc" },
    include: { policy: { include: { provider: true } } },
  });

  return { leads, upcomingDueDates, allDueDates };
}

const STATUS_BADGE: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  lost:      "bg-red-50 text-red-600 border-red-100",
};

const CAT_ICON: Record<string, string> = {
  term: "🛡️", life: "💰", health: "🏥", motor: "🚗",
  car: "🚗", "two-wheeler": "🛵", travel: "✈️", home: "🏠",
};

const DUE_STATUS: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-700 border-amber-100" },
  notified: { label: "Notified", cls: "bg-blue-50 text-blue-700 border-blue-100" },
  lapsed:   { label: "Lapsed",   cls: "bg-red-50 text-red-600 border-red-100" },
  renewed:  { label: "Renewed",  cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

function daysUntil(date: Date) {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, cls: "text-red-600 font-bold" };
  if (diff === 0) return { label: "Due today!", cls: "text-red-600 font-bold" };
  if (diff <= 7)  return { label: `${diff}d left`, cls: "text-orange-600 font-semibold" };
  if (diff <= 30) return { label: `${diff}d left`, cls: "text-amber-600 font-medium" };
  return { label: `${diff}d left`, cls: "text-gray-500" };
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
  const callbackRequests = leads.filter((l) => l.leadType === "callback");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[10px]">IP</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Insurance<span className="text-blue-600">Portal</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">← Back to site</Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Welcome header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Welcome back,</p>
              <h1 className="text-2xl font-bold mt-0.5">{user.name}</h1>
              <p className="text-blue-200 text-sm mt-1">+91 {user.phone}{user.email ? ` · ${user.email}` : ""}</p>
              {user.city && <p className="text-blue-200 text-xs mt-0.5">{user.city}</p>}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{quoteRequests.length}</p>
              <p className="text-blue-100 text-xs mt-0.5">Quote Requests</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{allDueDates.length}</p>
              <p className="text-blue-100 text-xs mt-0.5">Tracked Renewals</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{upcomingDueDates.length}</p>
              <p className="text-blue-100 text-xs mt-0.5">Due in 30 Days</p>
            </div>
          </div>
        </div>

        {/* Upcoming renewals alert */}
        {upcomingDueDates.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-lg">⚠️</div>
              <div className="flex-1">
                <p className="font-bold text-amber-900 text-sm">
                  {upcomingDueDates.length} renewal{upcomingDueDates.length > 1 ? "s" : ""} coming up in the next 30 days
                </p>
                <div className="mt-3 space-y-2">
                  {upcomingDueDates.map((d) => {
                    const timing = daysUntil(d.dueDate);
                    return (
                      <div key={d.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{d.policyNumber ?? "Policy"}</p>
                          {d.policy && <p className="text-xs text-gray-500">{d.policy.provider.name} — {d.policy.name}</p>}
                          {!d.policy && d.notes && <p className="text-xs text-gray-500">{d.notes}</p>}
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className={`text-sm ${timing.cls}`}>{timing.label}</p>
                          <p className="text-xs text-gray-400">{new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Due Dates / Renewals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <h2 className="font-bold text-gray-900 text-sm">Your Policy Renewals</h2>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{allDueDates.length} total</span>
          </div>

          {allDueDates.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-gray-400">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-sm font-medium">No renewals tracked yet</p>
              <p className="text-xs mt-1 max-w-xs text-center">Our advisors will add your policy renewal dates after you get a quote.</p>
              <Link href="/#lead-form" className="mt-4 text-xs font-semibold text-blue-600 hover:underline">Get a free quote →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {allDueDates.map((d) => {
                const timing = daysUntil(d.dueDate);
                const status = DUE_STATUS[d.status] ?? { label: d.status, cls: "bg-gray-50 text-gray-600 border-gray-100" };
                return (
                  <div key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                      {d.policy ? (CAT_ICON[d.policy.category] ?? "🛡️") : "🛡️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{d.policyNumber ?? "Policy Renewal"}</p>
                      {d.policy && (
                        <p className="text-xs text-gray-500 truncate">{d.policy.provider.name} · {d.policy.name}</p>
                      )}
                      {d.notes && !d.policy && <p className="text-xs text-gray-500 truncate">{d.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className={`text-xs ${timing.cls}`}>{timing.label}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${status.cls}`}>{status.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quote requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="text-base">📨</span>
              <h2 className="font-bold text-gray-900 text-sm">Your Quote Requests</h2>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{quoteRequests.length} requests</span>
          </div>

          {quoteRequests.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-gray-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-medium">No quote requests yet</p>
              <Link href="/#lead-form" className="mt-4 text-xs font-semibold text-blue-600 hover:underline">Get a free quote now →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {quoteRequests.map((lead) => {
                const statusBadge = STATUS_BADGE[lead.status] ?? "bg-gray-50 text-gray-600 border-gray-100";
                return (
                  <div key={lead.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                      {CAT_ICON[lead.category ?? ""] ?? "🛡️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm capitalize">
                        {lead.category ? lead.category.replace(/-/g, " ") : "Insurance"} Quote
                      </p>
                      {lead.policy && (
                        <p className="text-xs text-gray-500 truncate">{lead.policy.provider.name} · {lead.policy.name}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusBadge}`}>
                        {lead.status === "new" ? "Pending" : lead.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <span>👤</span> Account Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Full Name", value: user.name },
              { label: "Mobile", value: `+91 ${user.phone}` },
              { label: "Email", value: user.email ?? "—" },
              { label: "City", value: user.city ?? "—" },
              { label: "Gender", value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—" },
              { label: "Date of Birth", value: user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
              { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) },
              { label: "Last Login", value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{field.label}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Need a new policy?</h3>
            <p className="text-sm text-gray-500 mt-1">One tap — we already have your details. Our advisor calls you in 30 minutes.</p>
          </div>
          <QuickQuoteButton name={user.name} phone={user.phone} email={user.email} city={user.city} />
        </div>

      </div>
    </div>
  );
}
