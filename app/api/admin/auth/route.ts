import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, cookieOptions } from "@/lib/admin/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 422 });
  }

  const { email, password } = parsed.data;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`admin-login:${ip}:${email}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many login attempts. Please try again in 15 minutes." }, { status: 429 });
  }

  try {
    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await db.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const ROLE_MAP: Record<string, string> = {
      SUPER_ADMIN: "superadmin", ADMIN: "superadmin",
      EDITOR: "superadmin", VIEWER: "superadmin",
      RAM: "ram", SALES: "sales", RENEWAL: "renewal",
    };
    const normalizedRole = ROLE_MAP[user.role] ?? user.role.toLowerCase().replace(/_/g, "");

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: normalizedRole,
      bankName: user.bankName,
      maxPolicies: user.maxPolicies,
    });

    const res = NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role, bankName: user.bankName } });
    const opts = cookieOptions();
    res.cookies.set(opts.name, token, opts);
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
