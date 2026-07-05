import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalLeads,
    leadsToday,
    leadsThisMonth,
    newLeads,
    convertedLeads,
    totalPolicies,
    totalProviders,
    leadsByCategory,
    recentLeads,
    dueDatesUpcoming,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: startOfDay } } }),
    db.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.lead.count({ where: { status: "new" } }),
    db.lead.count({ where: { status: "converted" } }),
    db.policy.count({ where: { isActive: true } }),
    db.provider.count({ where: { isActive: true } }),
    db.lead.groupBy({ by: ["category"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, phone: true, category: true, status: true, createdAt: true, leadType: true },
    }),
    db.dueDate.count({
      where: { dueDate: { lte: new Date(Date.now() + 30 * 86400000) }, status: "pending" },
    }),
  ]);

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
  return { totalLeads, leadsToday, leadsThisMonth, newLeads, convertedLeads, conversionRate, totalPolicies, totalProviders, leadsByCategory, recentLeads, dueDatesUpcoming };
}

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  lost: "bg-red-50 text-red-600 border-red-100",
};

const CAT_COLORS: Record<string, string> = {
  term: "text-blue-600 bg-blue-50",
  health: "text-emerald-600 bg-emerald-50",
  motor: "text-orange-600 bg-orange-50",
  life: "text-violet-600 bg-violet-50",
};

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getStats();

  const kpiCards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.leadsToday} today`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      iconBg: "bg-blue-50 text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      label: "This Month",
      value: stats.leadsThisMonth,
      sub: "leads received",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconBg: "bg-indigo-50 text-indigo-600",
      accent: "border-l-indigo-500",
    },
    {
      label: "New / Pending",
      value: stats.newLeads,
      sub: "need follow-up",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      iconBg: "bg-amber-50 text-amber-600",
      accent: "border-l-amber-500",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      sub: `${stats.convertedLeads} converted`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Active Policies",
      value: stats.totalPolicies,
      sub: "across all categories",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconBg: "bg-violet-50 text-violet-600",
      accent: "border-l-violet-500",
    },
    {
      label: "Partners",
      value: stats.totalProviders,
      sub: "active providers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      iconBg: "bg-slate-100 text-slate-600",
      accent: "border-l-slate-400",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back, {session?.name}</p>
        </div>
        <Link
          href="/admin/leads"
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          View Leads
        </Link>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${card.accent} p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{card.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-semibold text-gray-900 text-sm">Recent Leads</h2>
            </div>
            <Link href="/admin/leads" className="text-blue-600 text-xs font-semibold hover:text-blue-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No leads yet</p>
              </div>
            ) : (
              stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${CAT_COLORS[lead.category ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-gray-400 truncate">{lead.phone}{lead.category ? ` · ${lead.category}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_BADGE[lead.status] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-300">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Leads by category */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <h2 className="font-semibold text-gray-900 text-sm">Leads by Category</h2>
            </div>
            {stats.leadsByCategory.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">No data yet.</p>
            ) : (
              <div className="space-y-3.5">
                {stats.leadsByCategory.map((item) => {
                  const pct = stats.totalLeads > 0
                    ? Math.round((item._count.id / stats.totalLeads) * 100)
                    : 0;
                  const barColor: Record<string, string> = {
                    term: "bg-blue-500",
                    health: "bg-emerald-500",
                    motor: "bg-orange-500",
                    life: "bg-violet-500",
                  };
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-700 capitalize">{item.category ?? "Unknown"}</span>
                        <span className="text-xs font-bold text-gray-900">{item._count.id} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor[item.category ?? ""] ?? "bg-blue-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { href: "/admin/leads", label: "Manage Leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                { href: "/admin/contact-messages", label: "Contact Messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { href: "/admin/newsletter", label: "Newsletter Subscribers", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
                { href: "/admin/due-dates", label: "Due Dates", badge: stats.dueDatesUpcoming, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { href: "/", label: "View Live Site", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14", target: "_blank" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  target={"target" in action ? action.target : undefined}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={action.icon} />
                  </svg>
                  <span className="flex-1">{action.label}</span>
                  {"badge" in action && action.badge && action.badge > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {action.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
