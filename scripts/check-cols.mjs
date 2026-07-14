import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const rows = await db.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'policies' ORDER BY ordinal_position`;
console.log(rows.map(r => r.column_name).join("\n"));
await db.$disconnect();
