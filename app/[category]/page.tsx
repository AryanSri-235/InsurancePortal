import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryPage, { generateMetadata as genMeta } from "@/components/category/CategoryPage";
import { CATEGORY_CONFIG, CategorySlug } from "@/lib/category-config";

interface Props {
  params: Promise<{ category: string }>;
}

// Maps both "term-insurance" and short "term" to the config slug
function resolveSlug(segment: string): CategorySlug | null {
  const direct: Record<string, CategorySlug> = {
    // existing
    "term-insurance": "term",
    "health-insurance": "health",
    "motor-insurance": "motor",
    "life-insurance": "life",
    term: "term",
    health: "health",
    motor: "motor",
    life: "life",
    // new
    "car-insurance": "car",
    car: "car",
    "two-wheeler-insurance": "two-wheeler",
    "two-wheeler": "two-wheeler",
    "bike-insurance": "two-wheeler",
    "family-health-insurance": "family-health",
    "family-health": "family-health",
    "group-health-insurance": "group-health",
    "group-health": "group-health",
    "travel-insurance": "travel",
    travel: "travel",
    "home-insurance": "home",
    home: "home",
    "term-insurance-women": "term-women",
    "women-term-insurance": "term-women",
    "term-women": "term-women",
    "return-of-premium-plans": "term-rop",
    "term-rop": "term-rop",
    "guaranteed-return-plans": "guaranteed-return",
    "guaranteed-return": "guaranteed-return",
    "child-savings-plans": "child-savings",
    "child-savings": "child-savings",
    "retirement-plans": "retirement",
    retirement: "retirement",
  };
  return direct[segment] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = resolveSlug(category);
  if (!slug) return {};
  return genMeta(CATEGORY_CONFIG[slug]);
}

export const revalidate = 3600;

export default async function CategoryRoute({ params }: Props) {
  const { category } = await params;
  const slug = resolveSlug(category);

  if (!slug) notFound();

  // Redirect only the original 4 short slugs to their canonical URLs
  const SHORT_SLUGS = new Set(["term", "health", "motor", "life"]);
  if (SHORT_SLUGS.has(category)) {
    redirect(CATEGORY_CONFIG[slug].route);
  }

  return <CategoryPage config={CATEGORY_CONFIG[slug]} />;
}
