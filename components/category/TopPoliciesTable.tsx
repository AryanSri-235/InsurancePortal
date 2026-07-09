import { Policy, Provider } from "@prisma/client";
import Link from "next/link";
import { Trophy, Tag } from "lucide-react";

type PolicyWithProvider = Policy & {
  provider: Pick<Provider, "name" | "slug" | "claimSettlementRatio" | "logoUrl">;
};

interface Props {
  policies: PolicyWithProvider[];
  category: string;
}

const CAT_LABEL: Record<string, string> = {
  term: "Term Insurance", health: "Health Insurance",
  motor: "Motor Insurance", life: "Life Insurance",
};

const CAT_LEFT_BORDER: Record<string, string> = {
  term: "border-l-blue-500", health: "border-l-green-500",
  motor: "border-l-blue-500", life: "border-l-green-500",
};

const CAT_PROVIDER_PILL: Record<string, string> = {
  term: "bg-blue-50 text-blue-700 border border-blue-100",
  health: "bg-green-50 text-green-700 border border-green-100",
  motor: "bg-blue-50 text-blue-700 border border-blue-100",
  life: "bg-green-50 text-green-700 border border-green-100",
};

const CAT_BTN: Record<string, string> = {
  term: "bg-blue-600 hover:bg-blue-700",
  health: "bg-green-600 hover:bg-green-700",
  motor: "bg-blue-600 hover:bg-blue-700",
  life: "bg-green-600 hover:bg-green-700",
};

function formatAmount(value: number | string | null | undefined): string {
  if (value == null || value === "") return "N/A";
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  if (isNaN(num)) return String(value);
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(0)} Cr`;
  if (num >= 100_000)    return `₹${(num / 100_000).toFixed(0)} Lakh`;
  if (num >= 1_000)      return `₹${(num / 1_000).toFixed(0)}K`;
  return `₹${num}`;
}

export default function TopPoliciesTable({ policies, category }: Props) {
  const list = policies.slice(0, 8);
  const leftBorder = CAT_LEFT_BORDER[category] ?? "border-l-blue-500";
  const providerPill = CAT_PROVIDER_PILL[category] ?? "bg-blue-50 text-blue-700 border border-blue-100";
  const btn = CAT_BTN[category] ?? "bg-blue-600 hover:bg-blue-700";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Best Plans</p>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Top {CAT_LABEL[category] ?? "Insurance"} Policies
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sorted by popularity and claim settlement ratio
          </p>
        </div>

        {/* Policy cards */}
        <div className="flex flex-col gap-3">
          {list.map((policy, index) => {
            // Strict: only index 0 = Most Popular, index 1 = Best Value, rest = nothing
            const tag = index === 0 ? "popular" : index === 1 ? "value" : null;
            const policySlug = (policy as { slug: string }).slug;

            return (
              <div
                key={policy.id}
                className={`flex items-center gap-4 bg-white border-2 border-gray-100 border-l-4 ${leftBorder} rounded-2xl p-5 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200`}
              >
                {/* LEFT — policy info */}
                <div className="flex-1 min-w-0">
                  {/* Name row with tag inline */}
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <h3 className="font-black text-base text-gray-900 leading-tight">
                      {policy.name}
                    </h3>
                    {tag === "popular" && (
                      <span className="inline-flex items-center gap-1 flex-shrink-0 text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        <Trophy className="w-3 h-3" /> Most Popular
                      </span>
                    )}
                    {tag === "value" && (
                      <span className="inline-flex items-center gap-1 flex-shrink-0 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        <Tag className="w-3 h-3" /> Best Value
                      </span>
                    )}
                  </div>

                  {/* Provider pill */}
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${providerPill}`}>
                    {policy.provider.name}
                  </span>

                  {/* Specs row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    {policy.coverAmount && (
                      <span>
                        Cover{" "}
                        <span className="font-semibold text-gray-800">
                          {formatAmount(policy.coverAmount)}
                        </span>
                      </span>
                    )}
                    {policy.premiumStartsFrom != null && (
                      <span>
                        Premium{" "}
                        <span className="font-semibold text-gray-800">
                          ₹{policy.premiumStartsFrom.toLocaleString("en-IN")}/mo
                        </span>
                      </span>
                    )}
                    {policy.policyTerm && (
                      <span>
                        Term{" "}
                        <span className="font-semibold text-gray-800">{policy.policyTerm}</span>
                      </span>
                    )}
                    {policy.eligibilityAge && (
                      <span>
                        Age{" "}
                        <span className="font-semibold text-gray-800">{policy.eligibilityAge}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT — CSR + button stacked */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2.5">
                  {policy.provider.claimSettlementRatio != null && (
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-green-200 whitespace-nowrap">
                      {policy.provider.claimSettlementRatio}% CSR
                    </span>
                  )}
                  <Link
                    href={`/${category}-insurance/${policy.provider.slug}/${policySlug}`}
                    className={`inline-flex items-center gap-1.5 ${btn} text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm`}
                  >
                    Know More →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
