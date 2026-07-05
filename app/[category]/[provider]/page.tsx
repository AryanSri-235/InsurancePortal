import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { isValidCategory, resolveCategory, categoryLabel } from "@/lib/utils";
import ProviderHero from "@/components/provider/ProviderHero";
import ProviderAbout from "@/components/provider/ProviderAbout";
import ProviderPlans from "@/components/provider/ProviderPlans";
import ProviderReviews from "@/components/provider/ProviderReviews";
import ProviderClaimProcess from "@/components/provider/ProviderClaimProcess";
import ProviderNetworkSearch from "@/components/provider/ProviderNetworkSearch";
import ProviderFaq from "@/components/provider/ProviderFaq";
import SectionDivider from "@/components/home/SectionDivider";

interface Props {
  params: Promise<{ category: string; provider: string }>;
}

async function getData(category: string, providerSlug: string) {
  const [provider, policies] = await Promise.all([
    db.provider.findUnique({ where: { slug: providerSlug } }),
    db.policy.findMany({
      where: { category, provider: { slug: providerSlug }, isActive: true },
      include: {
        provider: { select: { name: true, slug: true, claimSettlementRatio: true, logoUrl: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { premiumStartsFrom: "asc" }],
    }),
  ]);
  return { provider, policies };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, provider: providerSlug } = await params;
  if (!isValidCategory(category)) return {};
  try {
    const provider = await db.provider.findUnique({ where: { slug: providerSlug } });
    if (!provider) return {};
    return {
      title: `${provider.name} ${categoryLabel(category)} Plans — Compare & Buy`,
      description: `Compare all ${categoryLabel(category)} plans from ${provider.name}. Claim ratio: ${provider.claimSettlementRatio ?? "N/A"}%. Get expert advice for free.`,
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const providers = await db.provider.findMany({ where: { isActive: true } });
    const params: { category: string; provider: string }[] = [];
    for (const p of providers) {
      for (const cat of p.categories) {
        params.push({ category: cat, provider: p.slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function ProviderPage({ params }: Props) {
  const { category, provider: providerSlug } = await params;

  if (!isValidCategory(category)) notFound();
  const catSlug = resolveCategory(category)!;

  let provider, policies;
  try {
    ({ provider, policies } = await getData(catSlug, providerSlug));
  } catch {
    notFound();
  }

  if (!provider) notFound();

  const showNetworkSearch = catSlug === "health" || catSlug === "motor";

  return (
    <>
      <ProviderHero provider={provider} category={catSlug} policyCount={policies.length} />
      <SectionDivider />
      <ProviderAbout provider={provider} />
      <SectionDivider />
      <ProviderPlans policies={policies} category={catSlug} providerName={provider.name} />
      <SectionDivider />
      <ProviderReviews providerName={provider.name} />
      <SectionDivider />
      <ProviderClaimProcess provider={provider} category={catSlug} />
      <SectionDivider />
      <ProviderNetworkSearch provider={provider} category={catSlug} />
      {showNetworkSearch && <SectionDivider />}
      <ProviderFaq providerName={provider.name} category={catSlug} />
    </>
  );
}
