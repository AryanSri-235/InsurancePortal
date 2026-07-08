import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  try {
    const where = {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          category: true,
          city: true,
          leadType: true,
          status: true,
          isReturning: true,
          utmSource: true,
          createdAt: true,
        },
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      meta: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, renewalDate, policyNumber } = await req.json();
    const validStatuses = ["new", "contacted", "converted", "lost"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    }
    const lead = await db.lead.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, phone: true, email: true, category: true, policyId: true, status: true },
    });

    // When converting, optionally create a DueDate
    if (status === "converted" && renewalDate) {
      await db.dueDate.create({
        data: {
          policyHolderName: lead.name,
          phone: lead.phone,
          email: lead.email ?? null,
          policyId: lead.policyId ?? null,
          policyNumber: policyNumber || null,
          dueDate: new Date(renewalDate),
          status: "pending",
          notes: `Auto-created from lead #${lead.id}`,
        },
      });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
