import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { msg91SendOtp } from "@/lib/msg91";

const schema = z.object({ phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number") });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  const { phone } = parsed.data;

  if (isRateLimited(`send-otp:${ip}:${phone}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many OTP requests. Please wait 10 minutes." }, { status: 429 });
  }

  // Production: use MSG91
  if (process.env.MSG91_AUTH_KEY) {
    const result = await msg91SendOtp(phone);
    if (!result.success) return NextResponse.json({ error: "Failed to send OTP. Try again." }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Development fallback: always store OTP in DB so verify-otp (separate module) can read it
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const existing = await db.user.findUnique({ where: { phone }, select: { id: true } });
    if (existing) {
      await db.user.update({ where: { id: existing.id }, data: { otpCode: otp, otpExpiresAt: expiresAt } });
    } else {
      await db.user.create({ data: { phone, isActive: true, isProfileComplete: false, otpCode: otp, otpExpiresAt: expiresAt } });
    }
  } catch (err) {
    console.error("[send-otp] DB error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "OTP service not configured. Contact support." }, { status: 503 });
  }
  console.log(`[DEV OTP] Phone: +91${phone} → OTP: ${otp}`);
  return NextResponse.json({ success: true, _devOtp: otp });
}
