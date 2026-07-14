// Run: node scripts/reseed-providers.mjs
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const PROVIDERS = [
  { name: "Cholamandalam MS General Insurance Company Ltd",   slug: "cholamandalam-ms" },
  { name: "ICICI Lombard General Insurance Company Ltd",      slug: "icici-lombard" },
  { name: "Manipal Cigna Health Insurance Company Ltd",       slug: "manipal-cigna" },
  { name: "IndusInd General Insurance Company Ltd",           slug: "indusind-general" },
  { name: "Universal Sompo General Insurance Company Ltd",    slug: "universal-sompo" },
  { name: "Care Health Insurance Company Ltd",                slug: "care-health" },
  { name: "Zurich Kotak General Insurance Company (India) Ltd", slug: "zurich-kotak" },
  { name: "Royal Sundaram General Insurance Co. Ltd",         slug: "royal-sundaram" },
  { name: "Aditya Birla Health Insurance Co. Ltd",            slug: "aditya-birla-health" },
  { name: "Niva Bupa Health Insurance Company Ltd",           slug: "niva-bupa" },
  { name: "Navi General Insurance Ltd",                       slug: "navi-general" },
  { name: "Liberty General Insurance Ltd",                    slug: "liberty-general" },
  { name: "Arogya Sanjeevani Policy",                         slug: "arogya-sanjeevani" },
  { name: "Europ Assist Charge Travel Plan",                  slug: "europ-assist" },
  { name: "The New India Assurance Co Ltd",                   slug: "new-india-assurance" },
  { name: "National Insurance Company Ltd",                   slug: "national-insurance" },
  { name: "United India Insurance Company Ltd",               slug: "united-india-insurance" },
  { name: "The Oriental Insurance Company",                   slug: "oriental-insurance" },
  { name: "Bajaj Allianz General Insurance Company Ltd",      slug: "bajaj-allianz" },
  { name: "IFFCO-Tokio General Insurance Company Ltd",        slug: "iffco-tokio" },
  { name: "HDFC Ergo General Insurance Company Ltd",          slug: "hdfc-ergo" },
  { name: "Tata AIG General Insurance Company Ltd",           slug: "tata-aig" },
  { name: "General Central Insurance Company Ltd",            slug: "general-central" },
  { name: "SBI General Insurance Company Ltd",                slug: "sbi-general" },
  { name: "Go Digit General Insurance Ltd",                   slug: "go-digit" },
  { name: "Magma General Insurance",                          slug: "magma-general" },
  { name: "Zuno General Insurance Company Ltd",               slug: "zuno" },
  { name: "Shriram General Insurance Company Ltd",            slug: "shriram-general" },
  { name: "Raheja QBE General Insurance",                     slug: "raheja-qbe" },
  { name: "Galaxy Health Insurance Company Ltd",              slug: "galaxy-health" },
  { name: "Covid Standard Health Policy",                     slug: "covid-standard-health" },
];

async function main() {
  console.log("Step 0/3 — Making providerId nullable so we can detach policies...");
  await db.$executeRaw`ALTER TABLE policies ALTER COLUMN "providerId" DROP NOT NULL`;
  console.log("  → done");

  console.log("Step 1/3 — Nullifying provider_id on all policies (raw SQL)...");
  const updated = await db.$executeRaw`UPDATE policies SET "providerId" = NULL WHERE "providerId" IS NOT NULL`;
  console.log(`  → ${updated} rows updated`);

  console.log("Step 2/3 — Deleting all existing providers...");
  const deleted = await db.provider.deleteMany();
  console.log(`  → ${deleted.count} providers deleted`);

  console.log("Step 3/3 — Inserting new providers...");
  const created = await db.provider.createMany({ data: PROVIDERS });
  console.log(`  → ${created.count} providers created`);

  console.log("\nDone! Provider list:");
  const all = await db.provider.findMany({ select: { id: true, name: true, slug: true }, orderBy: { id: "asc" } });
  all.forEach(p => console.log(`  [${p.id}] ${p.name}  (${p.slug})`));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
