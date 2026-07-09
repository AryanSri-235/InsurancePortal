import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/admin/auth";
import { canAccess, defaultPage } from "@/lib/admin/rbac";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Verify session
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const payload = await verifyToken(token);
  if (!payload) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete("admin_token");
    return res;
  }

  // Root /admin redirect → role default page
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL(defaultPage(payload.role), req.url));
  }

  // Extract panel page segment (e.g. /admin/leads → "leads")
  const segment = pathname.replace("/admin/", "").split("/")[0];

  if (segment && !canAccess(payload.role, segment)) {
    const target = defaultPage(payload.role);
    if (target === pathname) {
      // Would create a redirect loop — clear the cookie and send to login
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("admin_token");
      return res;
    }
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
