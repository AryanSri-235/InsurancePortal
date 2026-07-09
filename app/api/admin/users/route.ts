import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db as prisma } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";

const CreateSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
  role:     z.enum(["superadmin", "ram", "sales", "renewal"]),
  bankName:    z.string().optional(),
  maxPolicies: z.coerce.number().int().positive().optional(),
});

async function requireSuperadmin() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return null;
  return session;
}

export async function GET() {
  if (!await requireSuperadmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.adminUser.findMany({
    select: {
      id: true, name: true, email: true, role: true,
      bankName: true, maxPolicies: true, isActive: true,
      lastLoginAt: true, createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  if (!await requireSuperadmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, password, role, bankName, maxPolicies } = parsed.data;

  // RAM users must have a bankName that exactly matches an existing provider
  if (role === "ram") {
    if (!bankName) {
      return NextResponse.json({ error: "Bank / Provider name is required for RAM users" }, { status: 400 });
    }
    const provider = await prisma.provider.findFirst({
      where: { name: { equals: bankName, mode: "insensitive" } },
    });
    if (!provider) {
      return NextResponse.json({ error: `No provider found with the name "${bankName}". It must exactly match a provider in the system.` }, { status: 400 });
    }
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.create({
    data: { name, email, passwordHash, role, bankName, maxPolicies },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!await requireSuperadmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { id, isActive } = body;

  if (typeof id !== "number" || typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: { isActive },
    select: { id: true, isActive: true },
  });

  return NextResponse.json({ user });
}
