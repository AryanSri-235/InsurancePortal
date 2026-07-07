import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user/auth";

export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: { id: session.id, name: session.name, phone: session.phone, email: session.email } });
}
