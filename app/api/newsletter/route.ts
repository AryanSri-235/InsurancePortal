import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" },
      { status: 422 }
    );
  }

  try {
    await db.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: {
        email: parsed.data.email,
        source: parsed.data.source ?? "other",
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
