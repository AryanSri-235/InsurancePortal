import { Provider } from "@prisma/client";
import Link from "next/link";
import { categoryLabel } from "@/lib/utils";

interface Props {
  provider: Provider;
  category: string;
  policyCount: number;
}

const categoryGradient: Record<string, string> = {
  term: "from-blue-500 to-blue-700",
  health: "from-green-500 to-green-700",
  motor: "from-blue-500 to-blue-700",
  life: "from-green-500 to-green-700",
};

const categoryInitialColor: Record<string, string> = {
  term: "text-blue-50",
  health: "text-green-50",
  motor: "text-blue-50",
  life: "text-green-50",
};

export default function ProviderHero({ provider, category, policyCount }: Props) {
  const gradient = categoryGradient[category] ?? "from-gray-500 to-gray-700";
  const initialColor = categoryInitialColor[category] ?? "text-gray-50";

  const initials = provider.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w.charAt(0))
    .join("");

  const showNetworkHospitals =
    provider.networkHospitals != null &&
    (category === "health" || category === "motor");

  return (
    <section className="bg-white border-b border-gray-100">
      {/* A) BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <nav className="text-sm text-gray-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <Link
            href={`/${category}-insurance`}
            className="hover:text-blue-600 transition-colors"
          >
            {categoryLabel(category)}
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-700 font-medium">{provider.name}</span>
        </nav>
      </div>

      {/* B) HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Logo / Avatar */}
          {provider.logoUrl ? (
            <img
              src={provider.logoUrl}
              alt={provider.name}
              width={200}
              height={80}
              className="object-contain flex-shrink-0"
            />
          ) : (
            <div
              className={`w-32 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
            >
              <span className={`font-black text-3xl ${initialColor}`}>
                {initials}
              </span>
            </div>
          )}

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              {provider.name}
            </h1>
            {provider.tagline && (
              <p className="text-gray-500 text-base mt-1">{provider.tagline}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                {categoryLabel(category)}
              </span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                IRDAI Approved
              </span>
            </div>
          </div>
        </div>

        {/* C) KEY STATS BAR */}
        <div className="flex gap-6 py-5 border-y border-gray-100 my-6 flex-wrap">
          {provider.claimSettlementRatio != null && (
            <div>
              <p className="text-xl font-black text-green-600">
                {provider.claimSettlementRatio}%
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Claim Settlement Ratio</p>
            </div>
          )}
          {provider.solvencyRatio != null && (
            <div>
              <p className="text-xl font-black text-blue-600">
                {provider.solvencyRatio}x
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Solvency Ratio</p>
            </div>
          )}
          {showNetworkHospitals && (
            <div>
              <p className="text-xl font-black text-blue-600">
                {provider.networkHospitals!.toLocaleString("en-IN")}+
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Network Hospitals</p>
            </div>
          )}
          <div>
            <p className="text-xl font-black text-blue-600">{policyCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Plans Available</p>
          </div>
          {provider.irdaiRegNo != null && (
            <div>
              <p className="text-xl font-black text-gray-600">
                {provider.irdaiRegNo}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">IRDAI Reg No</p>
            </div>
          )}
        </div>

        {/* D) CTA BUTTONS */}
        <div className="flex gap-3 flex-wrap">
          <a
            href="#plans"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            View All Plans
          </a>
          <Link
            href="/"
            className="border-2 border-blue-200 text-blue-600 bg-blue-50 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
