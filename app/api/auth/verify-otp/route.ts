import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number format"),
  otp: z.string().min(4, "OTP must be at least 4 digits"),
  verificationId: z.string().min(1, "Verification ID is required"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  }
  const { phone, otp, verificationId } = parsed.data;

  if (isRateLimited(`verify-otp:${ip}:${phone}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  // Validate OTP
  try {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;

    if (verificationId === "msg91" || msg91AuthKey) {
      if (!msg91AuthKey) {
        console.error("Missing MSG91_AUTH_KEY in environment");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
      }

      // Verify OTP via MSG91 (GET request)
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${phone}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "authkey": msg91AuthKey
        }
      });

      if (!response.ok) {
        console.error("MSG91 Validation failed with status:", response.status);
        return NextResponse.json({ error: "OTP verification failed. Please try again." }, { status: 400 });
      }

      const resData = await response.json();
      if (resData.type !== "success") {
        console.error("MSG91 Validation error response:", resData);
        const errMsg = resData.message || "Invalid OTP.";
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }
    } else {
      // Validate OTP via Message Central API
      const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN;
      const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${otp}`;

      if (!authToken) {
        console.error("Missing Message Central configuration in environment");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "authToken": authToken
        }
      });

      if (!response.ok) {
        console.error("Message Central Validation failed with status:", response.status);
        return NextResponse.json({ error: "OTP verification failed. Please try again." }, { status: 400 });
      }

      const resData = await response.json();
      if (resData.responseCode !== 200) {
        console.error("Message Central Validation error response:", resData);
        const errMsg = resData.message === "WRONG_OTP_PROVIDED" ? "Wrong OTP entered. Please try again." : (resData.message || "Invalid OTP.");
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }
    }
  } catch (err: any) {
    console.error("[verify-otp] OTP verification exception:", err);
    return NextResponse.json({ error: "Authentication failed. Error verifying OTP." }, { status: 401 });
  }

  // Find or create user (upsert in case record wasn't created yet)
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

