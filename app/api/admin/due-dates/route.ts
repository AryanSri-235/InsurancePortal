import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import { z } from "zod";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await db.dueDate.findMany({
      orderBy: { dueDate: "asc" },
      take: 100,
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
  dueDate: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const item = await db.dueDate.create({
      data: {
        policyHolderName: data.policyHolderName,
        phone: data.phone,
        email: data.email || null,
        policyNumber: data.policyNumber || null,
        dueDate: new Date(data.dueDate),
        notes: data.notes || null,
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
    const { id, status } = await req.json();
    const item = await db.dueDate.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
