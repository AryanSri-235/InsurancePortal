import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const phone = new URL(req.url).searchParams.get("phone")?.trim();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const user = await db.user.findFirst({
    where: { phone: { contains: phone } },
    select: { id: true, name: true, phone: true, email: true, city: true },
  });

  if (!user) return NextResponse.json({ error: "No user found with this number" }, { status: 404 });
  return NextResponse.json({ user });
}
