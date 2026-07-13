import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import { z } from "zod";

export async function GET() {
  const session = await getSession();
  if (!session || !["superadmin", "renewal"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const where = {};

    const items = await db.dueDate.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: { policy: { include: { provider: true } } },
    });
    return NextResponse.json({ success: true, data: items });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const schema = z.object({
  policyHolderName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  policyNumber: z.string().optional(),
  policyId: z.number().optional().nullable(),
  bankName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  dueDate: z.string(),
  notes: z.string().optional(),
  status: z.enum(["pending", "completed", "overdue", "lapsed", "renewed"]).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["superadmin", "renewal"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const bankName = data.bankName ?? null;

    const item = await db.dueDate.create({
      data: {
        policyHolderName: data.policyHolderName,
        phone: data.phone,
        email: data.email || null,
        policyNumber: data.policyNumber || null,
        ...(data.policyId ? { policy: { connect: { id: data.policyId } } } : {}),
        bankName,
        dueDate: new Date(data.dueDate),
        notes: data.notes || null,
        status: data.status ?? "pending",
      },
    });
    // Set category via raw SQL until Prisma client is regenerated after server restart
    if (data.category) {
      await db.$executeRaw`UPDATE due_dates SET category = ${data.category} WHERE id = ${item.id}`;
    }
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.number(),
  policyHolderName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional().or(z.literal("")),
  policyNumber: z.string().optional(),
  policyId: z.number().optional().nullable(),
  bankName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "completed", "overdue", "lapsed", "renewed"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !["superadmin", "renewal"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });
    const { id, policyHolderName, phone, email, policyNumber, dueDate, notes, policyId, status, bankName, category } = parsed.data;

    const item = await db.dueDate.update({
      where: { id },
      data: {
        ...(status            && { status }),
        ...(dueDate           && { dueDate: new Date(dueDate) }),
        ...(policyHolderName  && { policyHolderName }),
        ...(phone             && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(policyNumber !== undefined && { policyNumber: policyNumber || null }),
        ...(notes !== undefined  && { notes: notes || null }),
        ...(policyId !== undefined && (policyId ? { policy: { connect: { id: policyId } } } : {})),
        ...(bankName !== undefined && { bankName: bankName || null }),
      },
    });
    // Set category via raw SQL until Prisma client is regenerated after server restart
    if (category !== undefined) {
      await db.$executeRaw`UPDATE due_dates SET category = ${category || null} WHERE id = ${id}`;
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
