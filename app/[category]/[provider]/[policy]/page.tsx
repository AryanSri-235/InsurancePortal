import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { db } from "@/lib/db";
import { isValidCategory, resolveCategory, categoryLabel } from "@/lib/utils";
import PolicyTabs from "@/components/policy/PolicyTabs";
import PolicySidebar from "@/components/policy/PolicySidebar";
import PolicyGrid from "@/components/category/PolicyGrid";

interface Props {
  params: Promise<{ category: string; provider: string; policy: string }>;
}

async function getData(category: string, providerSlug: string, policySlug: string) {
  const [policy, similar] = await Promise.all([
    db.policy.findFirst({
      where: {
        slug: policySlug,
        category,
        provider: { slug: providerSlug },
        isActive: true,
      },
      include: {
        provider: true,
        riders: true,
      },
    }),
    db.policy.findMany({
      where: { category, isActive: true, slug: { not: policySlug } },
      include: {
        provider: { select: { name: true, slug: true, claimSettlementRatio: true } },
      },
      orderBy: { isFeatured: "desc" },
      take: 3,
    }),
  ]);
  return { policy, similar };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, provider: providerSlug, policy: policySlug } = await params;
  if (!isValidCategory(category)) return {};
  const catSlugMeta = resolveCategory(category)!;
  try {
    const policy = await db.policy.findFirst({
      where: { slug: policySlug, category: catSlugMeta, provider: { slug: providerSlug } },
      include: { provider: { select: { name: true } } },
    });
    if (!policy) return {};
    return {
      title: `${policy.name} by ${policy.provider.name} — ${categoryLabel(category)} Plan Details`,
      description: policy.description ?? `Compare ${policy.name} by ${policy.provider.name}. Premium from ₹${policy.premiumStartsFrom?.toLocaleString("en-IN") ?? "N/A"}/month. ${policy.coverAmount ?? ""} cover.`,
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const policies = await db.policy.findMany({
      where: { isActive: true },
      include: { provider: { select: { slug: true } } },
    });
    return policies.map((p) => ({
      category: p.category,
      provider: p.provider.slug,
      policy: p.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function PolicyDetailPage({ params }: Props) {
  const { category, provider: providerSlug, policy: policySlug } = await params;

  if (!isValidCategory(category)) notFound();
  const catSlug = resolveCategory(category)!;

  let policy, similar;
  try {
    ({ policy, similar } = await getData(catSlug, providerSlug, policySlug));
  } catch {
    notFound();
  }

  if (!policy) notFound();

  return (
    <>
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href={`/${category}-insurance`} className="hover:text-white">{categoryLabel(category)}</Link>
            <span>›</span>
            <Link href={`/${category}-insurance/${providerSlug}`} className="hover:text-white">{policy.provider.name}</Link>
            <span>›</span>
            <span className="text-white">{policy.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-500/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
                  {categoryLabel(category)}
                </span>
                {policy.isFeatured && (
                  <span className="bg-green-400/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current inline" /> Featured Plan
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1">{policy.name}</h1>
              <p className="text-slate-300 text-sm">by {policy.provider.name}</p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4">
              {policy.premiumStartsFrom && (
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold">₹{policy.premiumStartsFrom.toLocaleString("en-IN")}/mo</p>
                  <p className="text-slate-400 text-xs">Premium from</p>
                </div>
              )}
              {policy.coverAmount && (
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold">{policy.coverAmount}</p>
                  <p className="text-slate-400 text-xs">Cover</p>
                </div>
              )}
              {policy.provider.claimSettlementRatio && (
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold text-green-400">{policy.provider.claimSettlementRatio}%</p>
                  <p className="text-slate-400 text-xs">Claim Ratio</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Tabs — left 2/3 */}
          <div className="lg:col-span-2">
            <PolicyTabs policy={policy} />
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="lg:col-span-1">
            <PolicySidebar
              policyName={policy.name}
              category={category}
              policyId={policy.id}
              brochureUrl={policy.brochureUrl}
            />
          </div>
        </div>

        {/* Similar plans */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Similar {categoryLabel(category)} Plans</h2>
            <PolicyGrid policies={similar} category={category} />
          </div>
        )}

        {/* Back link */}
        <div className="mt-10">
          <Link
            href={`/${category}-insurance/${providerSlug}`}
            className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {policy.provider.name} Plans
          </Link>
        </div>
      </div>
    </>
  );
}
