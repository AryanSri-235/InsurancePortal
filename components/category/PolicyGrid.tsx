import Link from "next/link";
import { Policy, Provider } from "@prisma/client";
import { Check, Star } from "lucide-react";

type PolicyWithProvider = Policy & {
  provider: Pick<Provider, "name" | "slug" | "claimSettlementRatio">;
};

const CAT: Record<string, {
  bar: string; providerPill: string; border: string; shadow: string;
  btnFrom: string; btnTo: string; btnShadow: string;
  avatarBg: string; avatarText: string;
}> = {
  term: {
    bar: "from-blue-500 to-blue-600",
    providerPill: "bg-blue-50 text-blue-700 border border-blue-100",
    border: "hover:border-blue-200 hover:shadow-blue-100/80",
    shadow: "shadow-blue-100",
    btnFrom: "from-blue-600", btnTo: "to-blue-700", btnShadow: "shadow-blue-200",
    avatarBg: "bg-blue-50 border-blue-200", avatarText: "text-blue-600",
  },
  health: {
    bar: "from-green-500 to-green-600",
    providerPill: "bg-green-50 text-green-700 border border-green-100",
    border: "hover:border-green-200 hover:shadow-green-100/80",
    shadow: "shadow-green-100",
    btnFrom: "from-green-600", btnTo: "to-green-700", btnShadow: "shadow-green-200",
    avatarBg: "bg-green-50 border-green-200", avatarText: "text-green-600",
  },
  motor: {
    bar: "from-blue-500 to-blue-600",
    providerPill: "bg-blue-50 text-blue-700 border border-blue-100",
    border: "hover:border-blue-200 hover:shadow-blue-100/80",
    shadow: "shadow-blue-100",
    btnFrom: "from-blue-600", btnTo: "to-blue-700", btnShadow: "shadow-blue-200",
    avatarBg: "bg-blue-50 border-blue-200", avatarText: "text-blue-600",
  },
  life: {
    bar: "from-green-500 to-green-600",
    providerPill: "bg-green-50 text-green-700 border border-green-100",
    border: "hover:border-green-200 hover:shadow-green-100/80",
    shadow: "shadow-green-100",
    btnFrom: "from-green-600", btnTo: "to-green-700", btnShadow: "shadow-green-200",
    avatarBg: "bg-green-50 border-green-200", avatarText: "text-green-600",
  },
};

export default function PolicyGrid({ policies, category }: { policies: PolicyWithProvider[]; category: string }) {
  if (policies.length === 0) return null;

  const catSlug = category.replace("-insurance", "");
  const c = CAT[catSlug] ?? CAT.term;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {policies.map((policy, i) => (
        <div
          key={policy.id}
          style={{ animationDelay: `${i * 0.07}s` }}
          className={`animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col ${c.border}`}
        >
          {/* Gradient top bar */}
          <div className={`h-1.5 bg-gradient-to-r ${c.bar}`} />

          <div className="p-7 flex flex-col flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Provider initial avatar */}
                <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300 ${c.avatarBg} ${c.avatarText}`}>
                  {policy.provider.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1 ${c.providerPill}`}>
                    {policy.provider.name}
                  </span>
                  <h3 className="font-black text-gray-900 text-base leading-tight">{policy.name}</h3>
                </div>
              </div>
              {policy.isFeatured && (
                <span className="inline-flex items-center gap-1 flex-shrink-0 bg-green-50 text-green-700 border-2 border-green-200 text-xs font-black px-2.5 py-1 rounded-xl whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" /> Top Pick
                </span>
              )}
            </div>

            {policy.description && (
              <p className="text-sm text-gray-500 mb-5 leading-relaxed line-clamp-2">{policy.description}</p>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {policy.premiumStartsFrom && (
                <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 group-hover:border-gray-200 transition-colors">
                  <p className="text-xs text-gray-400 mb-1">Premium from</p>
                  <p className="text-sm font-black text-gray-900">
                    ₹{policy.premiumStartsFrom.toLocaleString("en-IN")}
                    <span className="text-xs font-medium text-gray-400">/mo</span>
                  </p>
                </div>
              )}
              {policy.coverAmount && (
                <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 group-hover:border-gray-200 transition-colors">
                  <p className="text-xs text-gray-400 mb-1">Cover</p>
                  <p className="text-sm font-black text-gray-900">{policy.coverAmount}</p>
                </div>
              )}
              {policy.provider.claimSettlementRatio && (
                <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Claim Ratio</p>
                  <p className="text-sm font-black text-green-700">{policy.provider.claimSettlementRatio}%</p>
                </div>
              )}
              {policy.eligibilityAge && (
                <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 group-hover:border-gray-200 transition-colors">
                  <p className="text-xs text-gray-400 mb-1">Age</p>
                  <p className="text-sm font-black text-gray-900">{policy.eligibilityAge}</p>
                </div>
              )}
            </div>

            {/* Key benefits */}
            {policy.keyBenefits.length > 0 && (
              <ul className="space-y-2 mb-6 flex-1">
                {policy.keyBenefits.slice(0, 3).map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <Link
              href={`/${catSlug}-insurance/${policy.provider.slug}/${policy.slug}`}
              className={`btn-shine mt-auto block w-full text-center bg-gradient-to-r ${c.btnFrom} ${c.btnTo} text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg ${c.btnShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
