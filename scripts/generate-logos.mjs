// node scripts/generate-logos.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "../public/providers-logo");
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

// Each entry: slug, display name (line1 / line2), primary brand color, accent color, icon type
const PROVIDERS = [
  { slug:"bajaj-allianz",         l1:"Bajaj Allianz", l2:"General Insurance",   c1:"#E51937", c2:"#1D4D97", icon:"shield"  },
  { slug:"hdfc-ergo",             l1:"HDFC ERGO",     l2:"General Insurance",   c1:"#004B8D", c2:"#E31E24", icon:"shield"  },
  { slug:"icici-lombard",         l1:"ICICI Lombard", l2:"General Insurance",   c1:"#F58220", c2:"#1B2E73", icon:"shield"  },
  { slug:"tata-aig",              l1:"Tata AIG",      l2:"General Insurance",   c1:"#003087", c2:"#E31E24", icon:"shield"  },
  { slug:"new-india-assurance",   l1:"New India",     l2:"Assurance Co.",       c1:"#1A3C6E", c2:"#C8202F", icon:"star"    },
  { slug:"national-insurance",    l1:"National",      l2:"Insurance Co.",       c1:"#003580", c2:"#FFC72C", icon:"star"    },
  { slug:"united-india-insurance",l1:"United India",  l2:"Insurance Co.",       c1:"#1B2E73", c2:"#E31E24", icon:"star"    },
  { slug:"oriental-insurance",    l1:"Oriental",      l2:"Insurance Co.",       c1:"#184E9E", c2:"#F5A623", icon:"star"    },
  { slug:"sbi-general",           l1:"SBI General",   l2:"Insurance",           c1:"#22509A", c2:"#E31E24", icon:"shield"  },
  { slug:"go-digit",              l1:"Go Digit",      l2:"General Insurance",   c1:"#E84393", c2:"#1B2E73", icon:"zap"     },
  { slug:"niva-bupa",             l1:"Niva Bupa",     l2:"Health Insurance",    c1:"#D31A40", c2:"#002868", icon:"heart"   },
  { slug:"aditya-birla-health",   l1:"Aditya Birla",  l2:"Health Insurance",   c1:"#ED1C24", c2:"#1B2E73", icon:"heart"   },
  { slug:"care-health",           l1:"Care Health",   l2:"Insurance",           c1:"#00B0B9", c2:"#003087", icon:"heart"   },
  { slug:"cholamandalam-ms",      l1:"Chola MS",      l2:"General Insurance",   c1:"#F57F20", c2:"#1A3C6E", icon:"shield"  },
  { slug:"royal-sundaram",        l1:"Royal",         l2:"Sundaram",            c1:"#004B8D", c2:"#BE1E2D", icon:"shield"  },
  { slug:"iffco-tokio",           l1:"IFFCO-Tokio",   l2:"General Insurance",   c1:"#0066B3", c2:"#E31E24", icon:"shield"  },
  { slug:"zurich-kotak",          l1:"Zurich Kotak",  l2:"General Insurance",   c1:"#0066CC", c2:"#6C2382", icon:"shield"  },
  { slug:"manipal-cigna",         l1:"Manipal Cigna", l2:"Health Insurance",    c1:"#00A3E0", c2:"#004B8D", icon:"heart"   },
  { slug:"navi-general",          l1:"Navi",          l2:"General Insurance",   c1:"#6F57E8", c2:"#1B2E73", icon:"zap"     },
  { slug:"universal-sompo",       l1:"Universal",     l2:"Sompo",               c1:"#003087", c2:"#F5A623", icon:"shield"  },
  { slug:"liberty-general",       l1:"Liberty",       l2:"General Insurance",   c1:"#003088", c2:"#C8202F", icon:"shield"  },
  { slug:"zuno",                  l1:"Zuno",          l2:"General Insurance",   c1:"#6C3EEA", c2:"#1B2E73", icon:"zap"     },
  { slug:"shriram-general",       l1:"Shriram",       l2:"General Insurance",   c1:"#E31E24", c2:"#1A3C6E", icon:"shield"  },
  { slug:"magma-general",         l1:"Magma",         l2:"General Insurance",   c1:"#C01C25", c2:"#1A3C6E", icon:"shield"  },
  { slug:"raheja-qbe",            l1:"Raheja QBE",    l2:"General Insurance",   c1:"#004B8D", c2:"#F58220", icon:"shield"  },
  { slug:"europ-assist",          l1:"Europ",         l2:"Assistance",          c1:"#E4002B", c2:"#003087", icon:"globe"   },
  { slug:"indusind-general",      l1:"IndusInd",      l2:"General Insurance",   c1:"#1B3A6B", c2:"#E8A000", icon:"shield"  },
  { slug:"arogya-sanjeevani",     l1:"Arogya",        l2:"Sanjeevani",          c1:"#16a34a", c2:"#065f46", icon:"heart"   },
  { slug:"galaxy-health",         l1:"Galaxy",        l2:"Health Insurance",    c1:"#7c3aed", c2:"#4c1d95", icon:"heart"   },
  { slug:"general-central",       l1:"General",       l2:"Central Insurance",   c1:"#0284c7", c2:"#075985", icon:"shield"  },
  { slug:"covid-standard-health", l1:"COVID Standard",l2:"Health Policy",       c1:"#dc2626", c2:"#991b1b", icon:"heart"   },
];

// SVG icons (paths)
const ICONS = {
  shield: `<path d="M20 4 L36 9 L36 22 C36 30 28 36 20 36 C12 36 4 30 4 22 L4 9 Z" fill="white" opacity="0.9"/>
           <path d="M14 20 L18 24 L26 16" stroke="{C2}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  heart: `<path d="M20 32 C20 32 6 22 6 14 C6 9.6 9.6 6 14 6 C16.5 6 18.8 7.2 20 9.2 C21.2 7.2 23.5 6 26 6 C30.4 6 34 9.6 34 14 C34 22 20 32 20 32 Z" fill="white" opacity="0.9"/>`,
  star: `<polygon points="20,4 24,15 36,15 27,22 30,34 20,27 10,34 13,22 4,15 16,15" fill="white" opacity="0.9"/>`,
  zap: `<path d="M22 4 L10 22 L19 22 L18 36 L30 18 L21 18 Z" fill="white" opacity="0.9"/>`,
  globe: `<circle cx="20" cy="20" r="14" fill="none" stroke="white" stroke-width="2" opacity="0.9"/>
          <ellipse cx="20" cy="20" rx="7" ry="14" fill="none" stroke="white" stroke-width="1.5" opacity="0.9"/>
          <line x1="6" y1="20" x2="34" y2="20" stroke="white" stroke-width="1.5" opacity="0.9"/>
          <line x1="20" y1="6" x2="20" y2="34" stroke="white" stroke-width="1.5" opacity="0.9"/>`,
};

function makeSVG({ l1, l2, c1, c2, icon }) {
  const iconSvg = (ICONS[icon] || ICONS.shield).replaceAll("{C2}", c2);
  // Shorten l1 for font sizing
  const fs1 = l1.length > 12 ? 15 : l1.length > 9 ? 17 : 20;
  const fs2 = 11;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 72">
  <!-- White background -->
  <rect width="220" height="72" rx="10" fill="white"/>
  <!-- Left accent panel -->
  <rect width="60" height="72" rx="10" fill="${c1}"/>
  <rect x="50" width="10" height="72" fill="${c1}"/>
  <!-- Icon in accent panel -->
  <g transform="translate(10, 16)">${iconSvg}</g>
  <!-- Right: company name -->
  <text x="72" y="34" font-family="'Arial Black',Arial,sans-serif" font-weight="900" font-size="${fs1}" fill="${c1}" letter-spacing="-0.3">${l1}</text>
  <text x="72" y="52" font-family="Arial,sans-serif" font-size="${fs2}" fill="#64748b" letter-spacing="0.3">${l2}</text>
  <!-- Bottom accent line -->
  <rect x="60" y="66" width="154" height="3" rx="1.5" fill="${c1}" opacity="0.15"/>
</svg>`;
}

async function main() {
  console.log(`Generating SVG logos for ${PROVIDERS.length} providers...\n`);
  let ok = 0;
  for (const p of PROVIDERS) {
    const filename = `${p.slug}.svg`;
    const dest = path.join(DIR, filename);
    fs.writeFileSync(dest, makeSVG(p), "utf-8");
    await db.provider.update({ where: { slug: p.slug }, data: { logoUrl: `/providers-logo/${filename}` } });
    console.log(`  ✓ ${p.slug}`);
    ok++;
  }
  console.log(`\nDone — ${ok} SVG logos generated and DB updated.`);
}

main().catch(console.error).finally(() => db.$disconnect());
