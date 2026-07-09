"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_ACCESS, ROLE_LABELS, type AdminRole } from "@/lib/admin/rbac";
import {
  Home,
  Users,
  Calendar,
  Mail,
  Bell,
  User,
  Search,
  Shield,
  Building2,
  X,
  ExternalLink,
  LogOut,
  Menu,
} from "lucide-react";

const allNavGroups = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: <Home className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Sales & Leads",
    items: [
      {
        href: "/admin/leads",
        label: "Leads",
        badge: "new",
        icon: <Users className="w-4 h-4" />,
      },
      {
        href: "/admin/due-dates",
        label: "Due Dates",
        icon: <Calendar className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Inbox",
    items: [
      {
        href: "/admin/contact-messages",
        label: "Contact Messages",
        icon: <Mail className="w-4 h-4" />,
      },
      {
        href: "/admin/newsletter",
        label: "Newsletter",
        icon: <Bell className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        href: "/admin/registered-users",
        label: "Registered Users",
        icon: <User className="w-4 h-4" />,
      },
      {
        href: "/admin/user-lookup",
        label: "User Lookup",
        icon: <Search className="w-4 h-4" />,
      },
      {
        href: "/admin/users",
        label: "Panel Users",
        icon: <Shield className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        href: "/admin/providers",
        label: "Providers",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        href: "/admin/policies",
        label: "Policies",
        icon: <Shield className="w-4 h-4" />,
      },
    ],
  },
];

function getNavGroups(role: string) {
  return allNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const segment = item.href.replace("/admin/", "").split("/")[0];
        const allowed = PAGE_ACCESS[segment];
        if (!allowed) return role === "superadmin";
        return allowed.includes(role as AdminRole);
      }),
    }))
    .filter((g) => g.items.length > 0);
}

interface Props {
  children: React.ReactNode;
  session: { name: string; role: string; bankName?: string };
}

export default function AdminShell({ children, session }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = getNavGroups(session.role);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800/60 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={closeSidebar} className="flex items-center gap-2 group">
          <div className="bg-white rounded-lg px-2 py-1 group-hover:opacity-90 transition-opacity">
            <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-slate-500 text-[10px] font-medium">Admin Panel</p>
        </Link>
        {/* Close button â€” mobile only */}
        <button
          onClick={closeSidebar}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span className={`transition-colors flex-shrink-0 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-800/60 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          onClick={closeSidebar}
          className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* â”€â”€ Desktop sidebar (always visible) â”€â”€ */}
      <aside className="hidden md:flex w-56 h-screen sticky top-0 bg-slate-900 flex-col flex-shrink-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* â”€â”€ Mobile drawer overlay â”€â”€ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* â”€â”€ Mobile drawer â”€â”€ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 flex flex-col flex-shrink-0 overflow-hidden transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* â”€â”€ Main content area â”€â”€ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger â€” mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Home className="w-3.5 h-3.5 hidden sm:block" />
              <span className="text-gray-300 hidden sm:inline">/</span>
              <span className="font-medium text-gray-600">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{session.name}</p>
              <p className="text-xs text-gray-400">
                {ROLE_LABELS[session.role] ?? session.role}
                {session.bankName && <span className="ml-1 text-blue-500">Â· {session.bankName}</span>}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200 flex-shrink-0">
              {session.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


