import { db } from "@/lib/db";
import Link from "next/link";
import PhoneLookup from "./PhoneLookup";
import { Search, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUsers(search: string, page: number) {
  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search } },
          { email: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        city: true,
        gender: true,
        dob: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  return { users, total, pages: Math.ceil(total / PAGE_SIZE) };
}

async function getOverview() {
  const now = new Date();
  const startOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, thisMonth, active] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: startOfDay } } }),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.user.count({ where: { isActive: true } }),
  ]);

  return { total, today, thisMonth, active };
}

export default async function RegisteredUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.q?.trim() ?? "";
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10));

  const [{ users, total, pages }, overview] = await Promise.all([
    getUsers(search, page),
    getOverview(),
  ]);

  const kpis = [
    { label: "Total Users",     value: overview.total,     sub: `${overview.today} today`,         color: "border-l-blue-500",   iconBg: "bg-blue-50 text-blue-600" },
    { label: "Registered Today",value: overview.today,     sub: "new sign-ups",                    color: "border-l-indigo-500", iconBg: "bg-indigo-50 text-indigo-600" },
    { label: "This Month",      value: overview.thisMonth, sub: "new registrations",               color: "border-l-violet-500", iconBg: "bg-violet-50 text-violet-600" },
    { label: "Active Accounts", value: overview.active,    sub: "accounts not deactivated",        color: "border-l-emerald-500",iconBg: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Registered Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{overview.total} total users on the portal</p>
        </div>
        <PhoneLookup />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${k.color} p-5`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{k.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{k.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <form method="get" className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search by name, phone, email or city..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
          Search
        </button>
        {search && (
          <Link href="/admin/registered-users" className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <p className="text-sm font-semibold text-gray-700">
            {search ? `Results for "${search}" — ${total} found` : `All Users (${total})`}
          </p>
          <p className="text-xs text-gray-400">Page {page} of {pages || 1}</p>
        </div>

        {users.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-gray-400">
            <Users className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No users found{search ? ` for "${search}"` : ""}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-4 py-3">Mobile</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">City</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Gender</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">DOB</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Registered</th>
                  <th className="text-left px-4 py-3 hidden xl:table-cell">Last Login</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {(u.name ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{u.name ?? <span className="text-gray-400 italic">No name</span>}</p>
                          <p className="text-[10px] text-gray-400">ID #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-medium tabular-nums">+91 {u.phone}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden sm:table-cell truncate max-w-[160px]">{u.email ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden md:table-cell">{u.city ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden lg:table-cell capitalize">{u.gender ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden lg:table-cell">
                      {u.dob ? new Date(u.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs hidden xl:table-cell">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : <span className="text-gray-300">Never</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/registered-users/${u.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-400">{total} users · Page {page} of {pages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/registered-users?${new URLSearchParams({ ...(search ? { q: search } : {}), page: String(page - 1) })}`}
                  className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {page < pages && (
                <Link
                  href={`/admin/registered-users?${new URLSearchParams({ ...(search ? { q: search } : {}), page: String(page + 1) })}`}
                  className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
