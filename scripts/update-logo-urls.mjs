import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const MAP = [
  { slug: "bajaj-allianz",          file: "Bajaj_General_.jpg" },
  { slug: "hdfc-ergo",              file: "HDFC-Ergo-logo.png" },
  { slug: "icici-lombard",          file: "icici-lombard-logo.png" },
  { slug: "tata-aig",               file: "tata-aig.png" },
  { slug: "new-india-assurance",    file: "new-india-assurance-co.png" },
  { slug: "national-insurance",     file: "national-insurance.jpg" },
  { slug: "united-india-insurance", file: "United_India_Insurance.webp" },
  { slug: "oriental-insurance",     file: "oriental-insurance-co-logo.png" },
  { slug: "sbi-general",            file: "sbi-general.jpg" },
  { slug: "go-digit",               file: "digit-insurance-logo.png" },
  { slug: "niva-bupa",              file: "niva-bupa-health-insurance.png" },
  { slug: "aditya-birla-health",    file: "aditya-birla-capital.png" },
  { slug: "care-health",            file: "Care_health_insurance_logo.png" },
  { slug: "cholamandalam-ms",       file: "chola-ms.png" },
  { slug: "royal-sundaram",         file: "royal-sundaram-logo.png" },
  { slug: "iffco-tokio",            file: "iffco-tokio-general-insurance.jpg" },
  { slug: "zurich-kotak",           file: "zurich-kotak.jpg" },
  { slug: "manipal-cigna",          file: "manipal-cigna.png" },
  { slug: "navi-general",           file: "navi-insurance.jpg" },
  { slug: "universal-sompo",        file: "universal-sompo-general-insurance-co-ltd.avif" },
  { slug: "liberty-general",        file: "Liberty_General_Insurance.jpg" },
  { slug: "zuno",                   file: "zuno.png" },
  { slug: "shriram-general",        file: "shriramgeneralinsurance_logo.jpg" },
  { slug: "magma-general",          file: "magma-general-insurance.png" },
  { slug: "raheja-qbe",             file: "rraheja-qbe.jpg" },
  { slug: "europ-assist",           file: "europe-assist-charge-travel-plan.jpg" },
  { slug: "indusind-general",       file: "IndusInd_General_Insurance.avif" },
  { slug: "arogya-sanjeevani",      file: "aarogya_sanjeevni.png" },
  { slug: "galaxy-health",          file: "galaxy-health-insurnace.png" },
  { slug: "general-central",        file: "generral-central-insurance.png" },
  { slug: "covid-standard-health",  file: "covid-standard.jpg" },
];

async function main() {
  let ok = 0;
  for (const { slug, file } of MAP) {
    try {
      await db.provider.update({
        where: { slug },
        data: { logoUrl: `/providers-logo/${file}` },
      });
      console.log(`  ✓ ${slug}`);
      ok++;
    } catch (e) {
      console.log(`  ✗ ${slug} — ${e.message}`);
    }
  }
  console.log(`\nDone: ${ok}/${MAP.length} updated.`);
}

main().catch(console.error).finally(() => db.$disconnect());
