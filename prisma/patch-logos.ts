import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LOGOS: Record<string, string> = {
  "lic":                "/providers-logo/lic-logo.png",
  "hdfc-life":          "/providers-logo/hdfc-life.png",
  "star-health":        "/providers-logo/star-health-insurance.png",
  "icici-lombard":      "/providers-logo/icici-lombard-logo.png",
  "sbi-life":           "/providers-logo/sbi-life-insurance-logo.png",
  "niva-bupa":          "/providers-logo/niva-bupa-health-insurance.png",
  "tata-aig":           "/providers-logo/tata-aig.png",
  "kotak-life":         "/providers-logo/kotak-life-insurance.png",
  "reliance-general":   "/providers-logo/reliance-general.png",
  "max-life":           "/providers-logo/max-life-insurance.png",
  "hdfc-ergo":          "/providers-logo/hdfc-ergo.png",
  "new-india-assurance":"/providers-logo/the-new-india-assurance.png",
  "pnb-metlife":        "/providers-logo/pnb-metlife.avif",
  "royal-sundaram":        "/providers-logo/royal-sundaram-logo.png",
  "bajaj-allianz":         "/providers-logo/bajaj-allianz-life-insurance-logo.png",
  "aditya-birla-sunlife":  "/providers-logo/birla-sunlife.png",
  "care-health":           "/providers-logo/care-health-insurance.png",
  "digit-insurance":       "/providers-logo/digit-insurance-logo.png",
  "edelweiss-tokio":       "/providers-logo/edelwelis-tokyo-life.png",
  "future-generali":       "/providers-logo/future-general-insurance.png",
};

async function main() {
  console.log("Patching provider logos...");
  for (const [slug, logoUrl] of Object.entries(LOGOS)) {
    const result = await prisma.provider.updateMany({ where: { slug }, data: { logoUrl } });
    console.log(`  ${result.count ? "✓" : "✗"} ${slug}`);
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
