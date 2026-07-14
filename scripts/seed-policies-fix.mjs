// Run: node scripts/seed-policies-fix.mjs
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  await db.$executeRaw`
    INSERT INTO policies (slug, "providerId", name, category, description, "premiumStartsFrom", "coverAmount", "policyTerm", "eligibilityAge", "keyBenefits", exclusions, "documentsRequired", "isFeatured", "isActive", "createdAt", "updatedAt")
    VALUES (
      'care-health-supreme', 36, 'Care Supreme Health Plan', 'health',
      'Comprehensive health plan with no room rent capping and unlimited restoration.',
      4200, '5 Lakh – 1 Crore', '1 year (renewable)', '18 – 99 years (adult), 91 days (child)',
      ARRAY['No room rent capping','Unlimited restoration','OPD cover','Worldwide emergency cover'],
      ARRAY['Cosmetic surgery','Dental treatment (non-accidental)','Pre-existing diseases (2-year waiting)'],
      ARRAY['Aadhaar','PAN','Medical history'],
      true, true, now(), now()
    )
    ON CONFLICT (slug) DO UPDATE SET "providerId" = EXCLUDED."providerId", name = EXCLUDED.name
  `;
  console.log("✓ Care Supreme Health Plan");

  await db.$executeRaw`
    INSERT INTO policies (slug, "providerId", name, category, description, "premiumStartsFrom", "coverAmount", "policyTerm", "eligibilityAge", "keyBenefits", exclusions, "documentsRequired", "isFeatured", "isActive", "createdAt", "updatedAt")
    VALUES (
      'tata-aig-travel-guard', 52, 'Travel Guard International', 'travel',
      'Comprehensive international travel insurance with medical emergency coverage.',
      350, '$50,000 – $500,000', 'Per trip', '1 – 70 years',
      ARRAY['Emergency medical cover','Trip cancellation','Lost baggage','Passport loss cover'],
      ARRAY['Pre-existing conditions','Adventure sports (without add-on)','Self-harm'],
      ARRAY['Passport copy','Ticket copy','Aadhaar'],
      false, true, now(), now()
    )
    ON CONFLICT (slug) DO UPDATE SET "providerId" = EXCLUDED."providerId", name = EXCLUDED.name
  `;
  console.log("✓ Travel Guard International");

  console.log("\nAll done!");
}

main().catch(console.error).finally(() => db.$disconnect());
