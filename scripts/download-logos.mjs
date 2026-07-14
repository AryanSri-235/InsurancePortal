// Run: node scripts/download-logos.mjs
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, "../public/providers-logo");
if (!fs.existsSync(LOGOS_DIR)) fs.mkdirSync(LOGOS_DIR, { recursive: true });

// slug → array of URLs to try in order (first success wins)
const PROVIDERS = [
  { slug: "bajaj-allianz",        urls: ["https://logo.clearbit.com/bajajallianz.com", "https://www.bajajallianz.com/content/dam/bagic/images/logo.png"] },
  { slug: "hdfc-ergo",            urls: ["https://logo.clearbit.com/hdfcergo.com"] },
  { slug: "icici-lombard",        urls: ["https://logo.clearbit.com/icicilombard.com"] },
  { slug: "tata-aig",             urls: ["https://logo.clearbit.com/tataaig.com"] },
  { slug: "new-india-assurance",  urls: ["https://logo.clearbit.com/newindia.co.in"] },
  { slug: "national-insurance",   urls: ["https://logo.clearbit.com/nationalinsurance.nic.co.in"] },
  { slug: "united-india-insurance", urls: ["https://logo.clearbit.com/uiic.co.in"] },
  { slug: "oriental-insurance",   urls: ["https://logo.clearbit.com/orientalinsurance.org.in"] },
  { slug: "sbi-general",          urls: ["https://logo.clearbit.com/sbigeneral.in"] },
  { slug: "go-digit",             urls: ["https://logo.clearbit.com/godigit.com"] },
  { slug: "niva-bupa",            urls: ["https://logo.clearbit.com/nivabupa.com"] },
  { slug: "aditya-birla-health",  urls: ["https://logo.clearbit.com/adityabirlahealthinsurance.com", "https://logo.clearbit.com/adityabirlacapital.com"] },
  { slug: "care-health",          urls: ["https://logo.clearbit.com/careinsurance.com"] },
  { slug: "cholamandalam-ms",     urls: ["https://logo.clearbit.com/cholainsurance.com", "https://logo.clearbit.com/cholams.com"] },
  { slug: "royal-sundaram",       urls: ["https://logo.clearbit.com/royalsundaram.in"] },
  { slug: "iffco-tokio",          urls: ["https://logo.clearbit.com/iffcotokio.co.in"] },
  { slug: "zurich-kotak",         urls: ["https://logo.clearbit.com/kotakgeneral.com"] },
  { slug: "manipal-cigna",        urls: ["https://logo.clearbit.com/manipalcigna.com"] },
  { slug: "navi-general",         urls: ["https://logo.clearbit.com/navi.com"] },
  { slug: "universal-sompo",      urls: ["https://logo.clearbit.com/universalsompo.com"] },
  { slug: "liberty-general",      urls: ["https://logo.clearbit.com/libertyinsurance.in", "https://logo.clearbit.com/libertygeneralinsurance.com"] },
  { slug: "zuno",                 urls: ["https://logo.clearbit.com/zuno.in", "https://logo.clearbit.com/edelweissinsurance.com"] },
  { slug: "shriram-general",      urls: ["https://logo.clearbit.com/shriramgi.com"] },
  { slug: "magma-general",        urls: ["https://logo.clearbit.com/magmainsurance.co.in", "https://logo.clearbit.com/magmahdi.com"] },
  { slug: "raheja-qbe",           urls: ["https://logo.clearbit.com/rahejaQBE.com", "https://logo.clearbit.com/rahejaqbe.com"] },
  { slug: "europ-assist",         urls: ["https://logo.clearbit.com/europassistance.in", "https://logo.clearbit.com/europ-assistance.com"] },
  { slug: "indusind-general",     urls: ["https://logo.clearbit.com/indusind.com"] },
  // These are standard IRDAI products / demo entries — SVG placeholders generated below
  { slug: "arogya-sanjeevani",    urls: [] },
  { slug: "galaxy-health",        urls: [] },
  { slug: "general-central",      urls: [] },
  { slug: "covid-standard-health", urls: [] },
];

// For providers with no reliable URL, generate a simple SVG logo
const SVG_PLACEHOLDERS = {
  "arogya-sanjeevani":    { bg: "#16a34a", initials: "AS", label: "Arogya Sanjeevani" },
  "galaxy-health":        { bg: "#7c3aed", initials: "GH", label: "Galaxy Health" },
  "general-central":      { bg: "#0284c7", initials: "GC", label: "General Central" },
  "covid-standard-health":{ bg: "#dc2626", initials: "CH", label: "COVID Health" },
};

function makeSvg({ bg, initials, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="24" fill="${bg}"/>
  <text x="100" y="118" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="72" fill="white">${initials}</text>
</svg>`;
}

function fetchUrl(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { headers: { "User-Agent": "Mozilla/5.0 Chrome/120" }, timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (!loc) return reject(new Error("Redirect with no location"));
        return fetchUrl(loc.startsWith("http") ? loc : new URL(loc, url).href, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); res.resume(); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.includes("image") && !ct.includes("octet")) { reject(new Error(`Not an image: ${ct}`)); res.resume(); return; }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  console.log(`Downloading logos for ${PROVIDERS.length} providers...\n`);
  const results = { ok: [], failed: [] };

  for (const { slug, urls } of PROVIDERS) {
    const ext = SVG_PLACEHOLDERS[slug] ? "svg" : "png";
    const filename = `${slug}.${ext}`;
    const dest = path.join(LOGOS_DIR, filename);
    const logoUrl = `/providers-logo/${filename}`;

    // SVG placeholder
    if (SVG_PLACEHOLDERS[slug]) {
      fs.writeFileSync(dest, makeSvg(SVG_PLACEHOLDERS[slug]));
      await db.provider.update({ where: { slug }, data: { logoUrl } });
      console.log(`  ✓ ${slug}  (SVG placeholder)`);
      results.ok.push(slug);
      continue;
    }

    // Try each URL
    let downloaded = false;
    for (const url of urls) {
      try {
        await fetchUrl(url, dest);
        // Verify the file is non-trivial (> 500 bytes)
        const size = fs.statSync(dest).size;
        if (size < 500) { fs.unlinkSync(dest); throw new Error(`Too small (${size} bytes)`); }
        await db.provider.update({ where: { slug }, data: { logoUrl } });
        console.log(`  ✓ ${slug}  (${Math.round(size/1024)}KB from ${new URL(url).hostname})`);
        results.ok.push(slug);
        downloaded = true;
        break;
      } catch (e) {
        // Try next URL
      }
    }
    if (!downloaded) {
      // Generate initials SVG as fallback
      const name = slug.split("-").map(w => w[0]?.toUpperCase()).join("").slice(0, 2);
      const colors = ["#0f172a","#1e40af","#065f46","#7c2d12","#4c1d95","#1e3a5f"];
      const bg = colors[Math.abs(slug.split("").reduce((a,c) => a+c.charCodeAt(0),0)) % colors.length];
      const svgDest = path.join(LOGOS_DIR, `${slug}.svg`);
      fs.writeFileSync(svgDest, makeSvg({ bg, initials: name, label: slug }));
      await db.provider.update({ where: { slug }, data: { logoUrl: `/providers-logo/${slug}.svg` } });
      console.log(`  ~ ${slug}  (fallback SVG — no image found)`);
      results.failed.push(slug);
    }
  }

  console.log(`\n✓ ${results.ok.length} downloaded / ${results.failed.length} fallback SVG`);
  if (results.failed.length) console.log("  Fallbacks:", results.failed.join(", "));
}

main().catch(console.error).finally(() => db.$disconnect());
