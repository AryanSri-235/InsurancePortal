import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const providerId = searchParams.get("providerId");
  const featured = searchParams.get("featured");
  const limitParam = searchParams.get("limit");
  const take = limitParam ? parseInt(limitParam) : undefined;

  try {
    const policies = await db.policy.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(providerId ? { providerId: parseInt(providerId) } : {}),
        ...(featured === "true" ? { isFeatured: true } : {}),
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            claimSettlementRatio: true,
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take,
    });

    return NextResponse.json({ success: true, data: policies, meta: { count: policies.length } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
