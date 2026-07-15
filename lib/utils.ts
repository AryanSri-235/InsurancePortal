export const VALID_CATEGORIES = [
  "term",
  "health",
  "motor",
  "life",
  "car",
  "two-wheeler",
  "family-health",
  "group-health",
  "travel",
  "home",
  "term-women",
  "term-rop",
  "guaranteed-return",
  "child-savings",
  "retirement"
] as const;

export type ValidCategory = (typeof VALID_CATEGORIES)[number];

const SEGMENT_TO_SLUG: Record<string, ValidCategory> = {
  // Term
  "term-insurance": "term",
  "term": "term",
  "term-insurance-women": "term-women",
  "women-term-insurance": "term-women",
  "term-women": "term-women",
  "return-of-premium-plans": "term-rop",
  "term-rop": "term-rop",

  // Health
  "health-insurance": "health",
  "health": "health",
  "family-health-insurance": "family-health",
  "family-health": "family-health",
  "group-health-insurance": "group-health",
  "group-health": "group-health",

  // Motor / Vehicle
  "motor-insurance": "motor",
  "motor": "motor",
  "car-insurance": "car",
  "car": "car",
  "two-wheeler-insurance": "two-wheeler",
  "two-wheeler": "two-wheeler",
  "bike-insurance": "two-wheeler",

  // Life / Investment
  "life-insurance": "life",
  "life": "life",
  "guaranteed-return-plans": "guaranteed-return",
  "guaranteed-return": "guaranteed-return",
  "child-savings-plans": "child-savings",
  "child-savings": "child-savings",
  "retirement-plans": "retirement",
  "retirement": "retirement",

  // Travel
  "travel-insurance": "travel",
  "travel": "travel",

  // Home
  "home-insurance": "home",
  "home": "home"
};

// Accepts both short and descriptive URL segments
export function isValidCategory(cat: string): boolean {
  return cat in SEGMENT_TO_SLUG;
}

// Resolves a URL segment (e.g. "home-insurance") to its canonical slug ("home")
export function resolveCategory(cat: string): ValidCategory | null {
  return SEGMENT_TO_SLUG[cat] ?? null;
}

export function categoryLabel(slug: string): string {
  const resolved = resolveCategory(slug) || slug;
  const map: Record<string, string> = {
    "term": "Term Insurance",
    "health": "Health Insurance",
    "motor": "Motor Insurance",
    "life": "Life Insurance",
    "car": "Car Insurance",
    "two-wheeler": "Two Wheeler Insurance",
    "family-health": "Family Health Insurance",
    "group-health": "Group Health Insurance",
    "travel": "Travel Insurance",
    "home": "Home Insurance",
    "term-women": "Term Insurance for Women",
    "term-rop": "Return of Premium Term Plans",
    "guaranteed-return": "Guaranteed Return Plans",
    "child-savings": "Child Savings Plans",
    "retirement": "Retirement Plans"
  };
  return map[resolved] ?? resolved;
}

export function formatCurrency(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
