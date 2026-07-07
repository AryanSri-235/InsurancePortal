import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "No account found with this mobile number." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = await signUserToken({ id: user.id, phone: user.phone, name: user.name, email: user.email });
    const opts = userCookieOptions();

    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone } });
    res.cookies.set(opts.name, token, opts);
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("user_token", "", { maxAge: 0, path: "/" });
  return res;
}
