import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { verifyFirebaseToken } from "@/lib/user/firebase-verify";
import { signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  idToken: z.string().min(1, "ID Token is required"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  }
  const { idToken } = parsed.data;

  // Verify Firebase Token
  let phone = "";
  try {
    const payload = await verifyFirebaseToken(idToken);
    const fullPhone = payload.phone_number as string;
    
    if (!fullPhone) {
      return NextResponse.json({ error: "Phone number not verified or missing in credentials." }, { status: 400 });
    }

    // Clean phone number: remove +91 or any country code prefix and keep last 10 digits
    phone = fullPhone.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }
  } catch (err: any) {
    console.error("[verify-otp] Firebase token verification failed:", err);
    return NextResponse.json({ error: "Authentication failed. Invalid token." }, { status: 401 });
  }

  if (isRateLimited(`verify-otp:${ip}:${phone}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
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
