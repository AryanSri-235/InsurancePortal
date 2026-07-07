import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";

const requestSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
});

const resetSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

// In-memory OTP store — replace with Redis/DB in production
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/forgot-password — request OTP
export async function POST(req: NextRequest) {
  try {
    const { phone } = requestSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      // Return success anyway to avoid phone enumeration
      return NextResponse.json({ success: true, message: "If this number is registered, you will receive an OTP." });
    }

    const otp = generateOtp();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min expiry

    // In production: send OTP via SMS (Twilio / MSG91)
    // For dev: log to console
    console.log(`[OTP] ${phone} → ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent to your registered mobile number.", _devOtp: process.env.NODE_ENV === "development" ? otp : undefined });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/auth/forgot-password — verify OTP + reset password
export async function PATCH(req: NextRequest) {
  try {
    const { phone, otp, newPassword } = resetSchema.parse(await req.json());

    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { phone }, data: { passwordHash } });

    otpStore.delete(phone);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
