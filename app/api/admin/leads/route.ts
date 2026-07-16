import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !["superadmin", "sales"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;

  try {
    let dateFromParsed: Date | undefined = undefined;
    let dateToParsed: Date | undefined = undefined;
    if (dateFrom && !isNaN(Date.parse(dateFrom))) {
      dateFromParsed = new Date(dateFrom);
    }
    if (dateTo && !isNaN(Date.parse(dateTo))) {
      dateToParsed = new Date(dateTo);
      dateToParsed.setHours(23, 59, 59, 999);
    }

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
      ...((dateFromParsed || dateToParsed)
        ? {
            createdAt: {
              ...(dateFromParsed ? { gte: dateFromParsed } : {}),
              ...(dateToParsed ? { lte: dateToParsed } : {}),
            },
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
  if (!session || !["superadmin", "sales"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, status, renewalDate, policyNumber, providerName, category } = await req.json();
    const validStatuses = ["new", "contacted", "converted", "lost"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    }
    if (status === "converted") {
      if (!renewalDate || isNaN(Date.parse(renewalDate))) return NextResponse.json({ error: "Renewal date is required" }, { status: 422 });
      if (!policyNumber?.trim()) return NextResponse.json({ error: "Policy number is required" }, { status: 422 });
      if (!providerName?.trim()) return NextResponse.json({ error: "Provider is required" }, { status: 422 });
      if (!category?.trim()) return NextResponse.json({ error: "Category is required" }, { status: 422 });
    }

    const lead = await db.lead.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, phone: true, email: true, category: true, policyId: true, status: true },
    });

    if (status === "converted") {
      const due = await db.dueDate.create({
        data: {
          policyHolderName: lead.name,
          phone: lead.phone,
          email: lead.email ?? null,
          ...(lead.policyId ? { policy: { connect: { id: lead.policyId } } } : {}),
          policyNumber: policyNumber.trim(),
          bankName: providerName.trim(),
          dueDate: new Date(renewalDate),
          status: "pending",
          notes: `Auto-created from lead #${lead.id}`,
        },
      });
      // Set category via raw SQL — Prisma client needs a restart to recognise the new column
      await db.$executeRaw`UPDATE due_dates SET category = ${category.trim()} WHERE id = ${due.id}`;
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (e) {
    console.error("[leads PATCH]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 });
  }
}
