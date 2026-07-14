// Run: node scripts/update-provider-categories.mjs
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// All general insurance categories
const GENERAL = ["term", "health", "motor", "car", "two-wheeler", "family-health", "group-health", "travel", "home", "life", "guaranteed-return", "child-savings", "retirement"];
const HEALTH   = ["health", "family-health", "group-health"];
const MOTOR    = ["motor", "car", "two-wheeler"];
const TRAVEL   = ["travel"];
const LIFE     = ["term", "life", "guaranteed-return", "child-savings", "retirement"];

const PROVIDER_CATEGORIES = {
  "cholamandalam-ms":    GENERAL,
  "icici-lombard":       GENERAL,
  "manipal-cigna":       HEALTH,
  "indusind-general":    GENERAL,
  "universal-sompo":     GENERAL,
  "care-health":         HEALTH,
  "zurich-kotak":        GENERAL,
  "royal-sundaram":      GENERAL,
  "aditya-birla-health": HEALTH,
  "niva-bupa":           HEALTH,
  "navi-general":        GENERAL,
  "liberty-general":     GENERAL,
  "arogya-sanjeevani":   HEALTH,
  "europ-assist":        TRAVEL,
  "new-india-assurance": GENERAL,
  "national-insurance":  GENERAL,
  "united-india-insurance": GENERAL,
  "oriental-insurance":  GENERAL,
  "bajaj-allianz":       GENERAL,
  "iffco-tokio":         GENERAL,
  "hdfc-ergo":           GENERAL,
  "tata-aig":            GENERAL,
  "general-central":     GENERAL,
  "sbi-general":         GENERAL,
  "go-digit":            GENERAL,
  "magma-general":       GENERAL,
  "zuno":                GENERAL,
  "shriram-general":     [...MOTOR, "home"],
  "raheja-qbe":          GENERAL,
  "galaxy-health":       HEALTH,
  "covid-standard-health": HEALTH,
};

async function main() {
  let updated = 0;
  for (const [slug, categories] of Object.entries(PROVIDER_CATEGORIES)) {
    try {
      await db.provider.update({
        where: { slug },
        data: { categories },
      });
      console.log(`  ✓ ${slug} → [${categories.join(", ")}]`);
      updated++;
    } catch (e) {
      console.log(`  ✗ ${slug} — ${e.message}`);
    }
  }
  console.log(`\nDone! ${updated} providers updated.`);
}

main().catch(console.error).finally(() => db.$disconnect());
