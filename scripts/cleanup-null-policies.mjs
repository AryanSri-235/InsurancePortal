// Run: node scripts/cleanup-null-policies.mjs
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // Remove FK references first (due_dates and leads may reference old policy IDs)
  await db.$executeRaw`UPDATE due_dates SET "policyId" = NULL WHERE "policyId" IN (SELECT id FROM policies WHERE "providerId" IS NULL)`;
  await db.$executeRaw`UPDATE leads SET "policyId" = NULL WHERE "policyId" IN (SELECT id FROM policies WHERE "providerId" IS NULL)`;
  await db.$executeRaw`DELETE FROM policy_riders WHERE "policyId" IN (SELECT id FROM policies WHERE "providerId" IS NULL)`;

  const deleted = await db.$executeRaw`DELETE FROM policies WHERE "providerId" IS NULL`;
  console.log(`Deleted ${deleted} stale policies (null providerId).`);

  const remaining = await db.$queryRaw`SELECT COUNT(*)::int as c FROM policies`;
  console.log(`Remaining: ${remaining[0].c} policies.`);
}

main().catch(console.error).finally(() => db.$disconnect());
