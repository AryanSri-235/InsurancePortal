import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  category: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  leadType: z.enum(["quote", "callback", "contact_form", "renewal"]).default("quote"),
  policyId: z.number().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  referrerUrl: z.string().optional(),
});

// Simple in-memory rate limit (per IP, max 5 requests per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const deviceType = userAgent?.toLowerCase().includes("mobile") ? "mobile" : "desktop";

  try {
    // De-dup: same phone in last 24 hrs
    const cutoff = new Date(Date.now() - 86_400_000);
    const existing = await db.lead.findFirst({
      where: { phone: data.phone, createdAt: { gte: cutoff } },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      const updated = await db.lead.update({
        where: { id: existing.id },
        data: {
          isReturning: true,
          category: data.category ?? existing.category,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, data: { id: updated.id, returning: true } });
    }

    const lead = await db.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        category: data.category ?? null,
        city: data.city ?? null,
        leadType: data.leadType,
        policyId: data.policyId ?? null,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
        utmContent: data.utmContent ?? null,
        utmTerm: data.utmTerm ?? null,
        referrerUrl: data.referrerUrl ?? null,
        userAgent,
        deviceType,
      },
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (err) {
    console.error("Lead creation error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
