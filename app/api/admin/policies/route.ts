import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const policies = await db.policy.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
        // RAM users only see policies from their own provider (matched by bankName)
        ...(session.role === "ram" && session.bankName
          ? { provider: { name: { contains: session.bankName, mode: "insensitive" as const } } }
          : {}),
      },
      include: { provider: { select: { name: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ success: true, data: policies });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const policySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  providerId: z.number(),
  category: z.enum(["term", "life", "health", "motor", "travel", "home", "personal-accident", "fire", "marine", "pension", "commercial", "crop", "cyber"]),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  premiumStartsFrom: z.number().optional(),
  coverAmount: z.string().optional(),
  policyTerm: z.string().optional(),
  eligibilityAge: z.string().optional(),
  keyBenefits: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  documentsRequired: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || ["sales", "renewal"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = policySchema.parse(body);
    const policy = await db.policy.create({ data });
    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const patchSchema = policySchema.partial();

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || ["sales", "renewal"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 422 });

    const data = patchSchema.parse(body);

    // RAM users can only modify policies belonging to their provider
    if (session.role === "ram" && session.bankName) {
      const existing = await db.policy.findUnique({
        where: { id },
        include: { provider: { select: { name: true } } },
      });
      if (!existing || !existing.provider.name.toLowerCase().includes(session.bankName.toLowerCase())) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // RAM cannot reassign a policy to a different provider
    if (session.role === "ram") delete (data as Record<string, unknown>).providerId;
    const policy = await db.policy.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: policy });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    await db.policy.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
