export const VALID_CATEGORIES = ["term", "health", "motor", "life"] as const;
export type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Accepts both "term" and "term-insurance" URL segments
export function isValidCategory(cat: string): boolean {
  return (
    VALID_CATEGORIES.includes(cat as ValidCategory) ||
    VALID_CATEGORIES.some((v) => `${v}-insurance` === cat)
  );
}

// Resolves "term-insurance" → "term", "term" → "term"
export function resolveCategory(cat: string): ValidCategory | null {
  if (VALID_CATEGORIES.includes(cat as ValidCategory)) return cat as ValidCategory;
  const found = VALID_CATEGORIES.find((v) => `${v}-insurance` === cat);
  return found ?? null;
}

export function categoryLabel(slug: string): string {
  const map: Record<string, string> = {
    term: "Term Insurance",
    health: "Health Insurance",
    motor: "Motor Insurance",
    life: "Life Insurance",
  };
  return map[slug] ?? slug;
}

export function formatCurrency(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
