import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const providers = await db.provider.findMany({
    where: { isActive: true },
    select: { id: true, name: true, categories: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, data: providers });
}
