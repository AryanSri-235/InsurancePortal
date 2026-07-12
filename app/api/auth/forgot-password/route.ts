import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";

const requestSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
});

const resetSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/forgot-password — request OTP
export async function POST(req: NextRequest) {
  try {
    const { phone } = requestSchema.parse(await req.json());

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(`forgot-password:${ip}:${phone}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please wait 10 minutes." }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      // Return success anyway to avoid phone enumeration
      return NextResponse.json({ success: true, message: "If this number is registered, you will receive an OTP." });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.user.update({
      where: { phone },
      data: { otpCode: otp, otpExpiresAt: expiresAt },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[OTP] ${phone} → ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your registered mobile number.",
      _devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// PATCH /api/auth/forgot-password — verify OTP + reset password
export async function PATCH(req: NextRequest) {
  try {
    const { phone, otp, newPassword } = resetSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { phone } });
    if (
      !user ||
      !user.otpCode ||
      !user.otpExpiresAt ||
      user.otpCode !== otp ||
      new Date() > user.otpExpiresAt
    ) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { phone },
      data: { passwordHash, otpCode: null, otpExpiresAt: null },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
