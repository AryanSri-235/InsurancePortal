import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    const providers = await db.provider.findMany({
      where: {
        isActive: true,
        ...(category ? { categories: { has: category } } : {}),
      },
      orderBy: { claimSettlementRatio: "desc" },
    });

    return NextResponse.json({ success: true, data: providers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
