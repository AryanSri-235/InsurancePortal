import { Metadata } from "next";
import { db } from "@/lib/db";
import { CategoryConfig } from "@/lib/category-config";
import CategoryHero from "./CategoryHero";
import InsuranceExplainer from "./InsuranceExplainer";
import ProviderGrid from "./ProviderGrid";
import TopPoliciesTable from "./TopPoliciesTable";
import CategoryFaq from "./CategoryFaq";
import RelatedBlogs from "./RelatedBlogs";
import SectionDivider from "@/components/home/SectionDivider";

interface Props {
  config: CategoryConfig;
}

async function getData(slug: string, parentCategory?: string) {
  const dbSlug = parentCategory ?? slug;
  try {
    const [providers, policies] = await Promise.all([
      db.provider.findMany({
        where: { isActive: true, categories: { has: dbSlug } },
        orderBy: { claimSettlementRatio: "desc" },
      }),
      db.policy.findMany({
        where: { isActive: true, category: dbSlug },
        include: {
          provider: {
            select: {
              name: true,
              slug: true,
              claimSettlementRatio: true,
              logoUrl: true,
            },
          },
        },
        take: 10,
      }),
    ]);
    return { providers, policies };
  } catch {
    return { providers: [], policies: [] };
  }
}

async function getCategorySpecificComponent(slug: string, parentCategory?: string) {
  const lookup = parentCategory ?? slug;
  switch (lookup) {
    case "term": return (await import("./term/TermSpecific")).default;
    case "health": return (await import("./health/HealthSpecific")).default;
    case "motor": return (await import("./motor/MotorSpecific")).default;
    case "life": return (await import("./life/LifeSpecific")).default;
    default: return null;
  }
}

export function generateMetadata(config: CategoryConfig): Metadata {
  return { title: config.metaTitle, description: config.metaDescription };
}

export default async function CategoryPage({ config }: Props) {
  const { providers, policies } = await getData(config.slug, config.parentCategory);
  const CategorySpecific = await getCategorySpecificComponent(config.slug, config.parentCategory);
  const themeSlug = config.parentCategory ?? config.slug;

  return (
    <>
      {/* 1. CategoryHero */}
      <CategoryHero config={config} />

      <SectionDivider />

      {/* 2. InsuranceExplainer */}
      <InsuranceExplainer slug={config.slug} />

      <SectionDivider />

      {/* 3. ProviderGrid */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Compare Insurers</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Top{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {config.label} Providers
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              {providers.length > 0 ? providers.length : "Leading"} insurers — ranked by claim settlement ratio
            </p>
          </div>
          <ProviderGrid providers={providers} category={themeSlug} />
        </div>
      </section>

      <SectionDivider />

      {/* 4. TopPoliciesTable */}
      <TopPoliciesTable policies={policies} category={themeSlug} />

      <SectionDivider />

      {/* 5. Category-specific section */}
      {CategorySpecific && (
        <>
          <CategorySpecific />
          <SectionDivider />
        </>
      )}

      {/* 8. CategoryFaq */}
      <CategoryFaq faqs={config.faqs} title={`${config.label} FAQs`} />

      <SectionDivider />

      {/* 9. RelatedBlogs */}
      <RelatedBlogs category={themeSlug} />
    </>
  );
}
