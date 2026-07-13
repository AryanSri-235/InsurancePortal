import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserSession, signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  name:   z.string().min(2, "Name must be at least 2 characters"),
  email:  z.string().email().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"], { error: "Please select a valid gender" }),
  dob:    z.string().min(1, "Date of birth is required"),
});

export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
  const { name, email, gender, dob } = parsed.data;

  // Validate DOB is a real date and user is at least 18
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) return NextResponse.json({ error: "Invalid date of birth." }, { status: 422 });
  const minAge = new Date();
  minAge.setFullYear(minAge.getFullYear() - 18);
  if (dobDate > minAge) return NextResponse.json({ error: "You must be at least 18 years old." }, { status: 422 });

  // Check email uniqueness if provided
  if (email) {
    const existing = await db.user.findFirst({ where: { email, NOT: { id: session.id } } });
    if (existing) return NextResponse.json({ error: "This email is already linked to another account." }, { status: 409 });
  }

  const user = await db.user.update({
    where: { id: session.id },
    data: {
      name,
      email:  email || null,
      gender,
      dob:    dobDate,
      isProfileComplete: true,
    },
  });

  // Re-sign token with updated name
  const token = await signUserToken({ id: user.id, phone: user.phone, name: user.name ?? "" });
  const res   = NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone } });
  res.cookies.set("user_token", token, userCookieOptions());
  return res;
}
