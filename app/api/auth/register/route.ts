import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { signUserToken, userCookieOptions } from "@/lib/user/auth";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode").optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone: data.phone }, ...(data.email ? [{ email: data.email }] : [])] },
    });
    if (existing) {
      const field = existing.phone === data.phone ? "phone number" : "email";
      return NextResponse.json({ error: `This ${field} is already registered.` }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        passwordHash,
        dob: data.dob ? new Date(data.dob) : null,
        gender: data.gender ?? null,
        city: data.city ?? null,
        pincode: data.pincode || null,
        lastLoginAt: new Date(),
      },
    });

    const token = await signUserToken({ id: user.id, phone: user.phone, name: user.name ?? "", email: user.email });
    const opts = userCookieOptions();

    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone } });
    res.cookies.set(opts.name, token, opts);
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
