import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      leadsToday,
      leadsThisMonth,
      newLeads,
      convertedLeads,
      totalPolicies,
      totalProviders,
      leadsByCategory,
      recentLeads,
      dueDatesUpcoming,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { createdAt: { gte: startOfDay } } }),
      db.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.lead.count({ where: { status: "new" } }),
      db.lead.count({ where: { status: "converted" } }),
      db.policy.count({ where: { isActive: true } }),
      db.provider.count({ where: { isActive: true } }),
      db.lead.groupBy({
        by: ["category"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, phone: true, category: true, status: true, createdAt: true },
      }),
      db.dueDate.count({
        where: { dueDate: { lte: new Date(Date.now() + 30 * 86400000) }, status: "pending" },
      }),
    ]);

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        leadsToday,
        leadsThisMonth,
        newLeads,
        convertedLeads,
        conversionRate,
        totalPolicies,
        totalProviders,
        dueDatesUpcoming,
        leadsByCategory,
        recentLeads,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
