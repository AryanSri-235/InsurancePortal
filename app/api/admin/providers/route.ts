import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const providers = await db.provider.findMany({
    where: session.role === "ram" && session.bankName
      ? { name: { contains: session.bankName, mode: "insensitive" } }
      : {},
    select: {
      id: true, name: true, slug: true, logoUrl: true,
      categories: true, isActive: true, claimSettlementRatio: true,
      irdaiRegNo: true,
      policies: {
        select: {
          id: true, name: true, slug: true, category: true,
          subCategory: true, premiumStartsFrom: true, isFeatured: true, isActive: true,
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, data: providers });
}
