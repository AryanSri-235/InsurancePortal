import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import Link from "next/link";
import {
  Users,
  BarChart2,
  Bell,
  TrendingUp,
  Shield,
  Building2,
  User,
  Plus,
  Clock,
  Inbox,
  PieChart,
  Mail,
  Calendar,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>): Promise<number> {
  try { return await fn(); } catch { return 0; }
}

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
    totalUsers,
    usersToday,
  ] = await Promise.all([
    safeCount(() => db.lead.count()),
    safeCount(() => db.lead.count({ where: { createdAt: { gte: startOfDay } } })),
    safeCount(() => db.lead.count({ where: { createdAt: { gte: startOfMonth } } })),
    safeCount(() => db.lead.count({ where: { status: "new" } })),
    safeCount(() => db.lead.count({ where: { status: "converted" } })),
    safeCount(() => db.policy.count({ where: { isActive: true } })),
    safeCount(() => db.provider.count({ where: { isActive: true } })),
    db.lead.groupBy({ by: ["category"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }).catch(() => [] as { category: string | null; _count: { id: number } }[]),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, phone: true, category: true, status: true, createdAt: true, leadType: true },
    }).catch(() => []),
    safeCount(() => db.dueDate.count({
      where: { dueDate: { lte: new Date(Date.now() + 30 * 86400000) }, status: "pending" },
    })),
    safeCount(() => db.user.count()),
    safeCount(() => db.user.count({ where: { createdAt: { gte: startOfDay } } })),
  ]);

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
  return { totalLeads, leadsToday, leadsThisMonth, newLeads, convertedLeads, conversionRate, totalPolicies, totalProviders, leadsByCategory, recentLeads, dueDatesUpcoming, totalUsers, usersToday };
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
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-blue-50 text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      label: "This Month",
      value: stats.leadsThisMonth,
      sub: "leads received",
      icon: <BarChart2 className="w-5 h-5" />,
      iconBg: "bg-indigo-50 text-indigo-600",
      accent: "border-l-indigo-500",
    },
    {
      label: "New / Pending",
      value: stats.newLeads,
      sub: "need follow-up",
      icon: <Bell className="w-5 h-5" />,
      iconBg: "bg-amber-50 text-amber-600",
      accent: "border-l-amber-500",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      sub: `${stats.convertedLeads} converted`,
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Active Policies",
      value: stats.totalPolicies,
      sub: "across all categories",
      icon: <Shield className="w-5 h-5" />,
      iconBg: "bg-violet-50 text-violet-600",
      accent: "border-l-violet-500",
    },
    {
      label: "Partners",
      value: stats.totalProviders,
      sub: "active providers",
      icon: <Building2 className="w-5 h-5" />,
      iconBg: "bg-slate-100 text-slate-600",
      accent: "border-l-slate-400",
      href: undefined,
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      sub: `${stats.usersToday} joined today`,
      icon: <User className="w-5 h-5" />,
      iconBg: "bg-pink-50 text-pink-600",
      accent: "border-l-pink-500",
      href: "/admin/registered-users",
    },
  ];

  const quickActions = [
    { href: "/admin/leads", label: "Manage Leads", icon: <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" /> },
    { href: "/admin/contact-messages", label: "Contact Messages", icon: <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" /> },
    { href: "/admin/newsletter", label: "Newsletter Subscribers", icon: <Bell className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" /> },
    { href: "/admin/due-dates", label: "Due Dates", badge: stats.dueDatesUpcoming, icon: <Calendar className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" /> },
    { href: "/admin/registered-users", label: "Registered Users", badge: stats.usersToday, icon: <User className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" /> },
    { href: "/", label: "View Live Site", icon: <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />, target: "_blank" },
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
          <Plus className="w-4 h-4" />
          View Leads
        </Link>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const inner = (
            <>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{card.label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1.5">{card.sub}</p>
              {card.href && <p className="text-xs text-blue-500 mt-2 font-medium">View all →</p>}
            </>
          );
          return card.href ? (
            <Link key={card.label} href={card.href} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${card.accent} p-5 hover:shadow-md hover:border-blue-100 transition-all block`}>
              {inner}
            </Link>
          ) : (
            <div key={card.label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${card.accent} p-5 hover:shadow-md transition-shadow`}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900 text-sm">Recent Leads</h2>
            </div>
            <Link href="/admin/leads" className="text-blue-600 text-xs font-semibold hover:text-blue-700 flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Inbox className="w-8 h-8 mb-2 opacity-40" />
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
              <PieChart className="w-4 h-4 text-gray-400" />
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
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  target={"target" in action ? action.target : undefined}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
                >
                  {action.icon}
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
