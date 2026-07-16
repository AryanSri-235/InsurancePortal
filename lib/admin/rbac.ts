export type AdminRole = "superadmin" | "ram" | "sales" | "renewal";

// Which roles can access each panel page (by route segment)
export const PAGE_ACCESS: Record<string, AdminRole[]> = {
  dashboard:          ["superadmin"],
  leads:              ["superadmin", "sales"],
  "due-dates":        ["superadmin", "renewal"],
  "contact-messages": ["superadmin"],
  newsletter:         ["superadmin"],
  reviews:            ["superadmin"],
  policies:           ["superadmin", "ram"],
  "registered-users": ["superadmin"],
  "user-lookup":      ["superadmin"],
  "users":            ["superadmin"],
  "providers":        ["superadmin", "ram"],
  blog:               ["superadmin"],
};

export function canAccess(role: string, page: string): boolean {
  const allowed = PAGE_ACCESS[page];
  if (!allowed) return role === "superadmin";
  return allowed.includes(role as AdminRole);
}

// Where to land after login per role
export function defaultPage(role: string): string {
  if (role === "sales") return "/admin/leads";
  if (role === "renewal") return "/admin/due-dates";
  if (role === "ram") return "/admin/policies";
  return "/admin/dashboard";
}

// Human-readable role labels
export const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  ram:        "R.A.M.",
  sales:      "Sales",
  renewal:    "Renewal",
};
