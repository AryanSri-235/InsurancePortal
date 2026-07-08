import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, phone: true, email: true,
        city: true, pincode: true, gender: true, dob: true,
        isActive: true, createdAt: true, lastLoginAt: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [dueDates, leads] = await Promise.all([
      db.dueDate.findMany({
        where: { phone: user.phone },
        orderBy: { dueDate: "asc" },
        include: { policy: { include: { provider: true } } },
      }),
      db.lead.findMany({
        where: { phone: user.phone },
        orderBy: { createdAt: "desc" },
        include: { policy: { include: { provider: true } } },
      }),
    ]);

    return NextResponse.json({ user, dueDates, leads });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
