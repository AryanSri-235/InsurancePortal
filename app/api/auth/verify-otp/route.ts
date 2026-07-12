import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { msg91VerifyOtp } from "@/lib/msg91";
import { signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp:   z.string().length(6),
});

async function verifyDevOtp(phone: string, otp: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { phone }, select: { otpCode: true, otpExpiresAt: true } });
  if (user?.otpCode === otp && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
    await db.user.update({ where: { phone }, data: { otpCode: null, otpExpiresAt: null } });
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  const { phone, otp } = parsed.data;

  if (isRateLimited(`verify-otp:${ip}:${phone}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  // Verify OTP
  let verified = false;
  if (process.env.MSG91_AUTH_KEY) {
    const result = await msg91VerifyOtp(phone, otp);
    verified = result.success;
  } else {
    verified = await verifyDevOtp(phone, otp);
  }

  if (!verified) return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 401 });

  // Find or create user (upsert in case record was pre-created by send-otp)
  let user = await db.user.findUnique({ where: { phone } });
  const isNewUser = !user?.isProfileComplete;

  if (!user) {
    user = await db.user.create({
      data: { phone, isActive: true, isProfileComplete: false },
    });
  } else {
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  }

  // Issue JWT
  const token = await signUserToken({ id: user.id, phone: user.phone, name: user.name ?? "" });
  const res   = NextResponse.json({ success: true, isNewUser, user: { id: user.id, name: user.name, phone: user.phone } });
  res.cookies.set("user_token", token, userCookieOptions());
  return res;
}
