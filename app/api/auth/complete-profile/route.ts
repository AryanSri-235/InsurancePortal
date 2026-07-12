import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserSession, signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  const { name, email } = parsed.data;

  // Check email uniqueness if provided
  if (email) {
    const existing = await db.user.findFirst({ where: { email, NOT: { id: session.id } } });
    if (existing) return NextResponse.json({ error: "This email is already linked to another account." }, { status: 409 });
  }

  const user = await db.user.update({
    where: { id: session.id },
    data: { name, email: email || null, isProfileComplete: true },
  });

  // Re-sign token with updated name
  const token = await signUserToken({ id: user.id, phone: user.phone, name: user.name ?? "" });
  const res   = NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone } });
  res.cookies.set("user_token", token, userCookieOptions());
  return res;
}
