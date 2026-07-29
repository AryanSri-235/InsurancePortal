import { NextResponse } from "next/server";

// User sign-in is OTP-only (see /api/auth/send-otp and /api/auth/verify-otp).
// This route exists solely to clear the session cookie on logout.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("user_token", "", { maxAge: 0, path: "/" });
  return res;
}
