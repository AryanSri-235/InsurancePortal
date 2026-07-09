import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import { z } from "zod";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // RAM sees only their bank's due dates
    const where = session.role === "ram" && session.bankName
      ? { bankName: session.bankName }
      : {};

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
  dueDate: z.string(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // RAM always tags with their bankName
    const bankName = session.role === "ram"
      ? (session.bankName ?? null)
      : (data.bankName ?? null);

    const item = await db.dueDate.create({
      data: {
        policyHolderName: data.policyHolderName,
        phone: data.phone,
        email: data.email || null,
        policyNumber: data.policyNumber || null,
        policyId: data.policyId ?? null,
        bankName,
        dueDate: new Date(data.dueDate),
        notes: data.notes || null,
        status: data.status ?? "pending",
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, policyHolderName, phone, email, policyNumber, dueDate, notes, policyId, status, bankName } = await req.json();

    // RAM can only edit their own bank's records
    if (session.role === "ram" && session.bankName) {
      const existing = await db.dueDate.findUnique({ where: { id }, select: { bankName: true } });
      if (existing?.bankName && existing.bankName !== session.bankName) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

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
        ...(policyId !== undefined && { policyId: policyId ?? null }),
        ...(bankName !== undefined && session.role !== "ram" && { bankName: bankName || null }),
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
