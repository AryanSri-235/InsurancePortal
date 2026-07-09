import { Provider } from "@prisma/client";
import { Check, Star, Award, BadgeCheck } from "lucide-react";

interface ProviderAboutProps {
  provider: Provider;
}

const milestones = [
  { year: "Est. 2000", label: "Founded" },
  { year: "2003", label: "IRDAI Registration" },
  { year: "2015", label: "Crossed 1 Crore Policies" },
  { year: "2018", label: "ISO Certified" },
];

const awards = [
  {
    icon: <Star className="w-5 h-5" />,
    text: "IRDA Best Insurer Award 2023",
    color: "bg-green-100 text-green-800 border border-green-200",
  },
  {
    icon: <Award className="w-5 h-5" />,
    text: "Economic Times Insurer of the Year",
    color: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    text: "ISO 9001:2015 Certified",
    color: "bg-green-100 text-green-800 border border-green-200",
  },
];

export default function ProviderAbout({ provider }: ProviderAboutProps) {
  const aboutParagraphs = provider.about
    ? provider.about.split("\n").filter((p) => p.trim().length > 0)
    : null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: About text + Milestones */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              About {provider.name}
            </h2>

            {aboutParagraphs ? (
              <div className="space-y-3 mb-8">
                {aboutParagraphs.map((para, idx) => (
                  <p key={idx} className="text-gray-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed mb-8">
                {provider.name} is an IRDAI-registered insurance company
                committed to providing comprehensive and affordable insurance
                solutions to millions of customers across India. With a strong
                focus on customer satisfaction and quick claim settlement, the
                company has established itself as one of the trusted names in
                the Indian insurance sector.
              </p>
            )}

            {/* Milestones Timeline */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Key Milestones
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {milestones.map((milestone, idx) => (
                    <div key={idx} className="relative flex items-start pl-12">
                      {/* Dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                          {milestone.year}
                        </span>
                        <p className="text-sm font-medium text-gray-700 mt-0.5">
                          {milestone.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Awards & Recognition card */}
          <div className="lg:col-span-1">
            <div className="border-2 border-gray-100 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Awards &amp; Recognition
              </h3>

              <div className="space-y-3 mb-6">
                {awards.map((award, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium w-full ${award.color}`}
                  >
                    <span>{award.icon}</span>
                    <span>{award.text}</span>
                  </span>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-base font-bold text-gray-800 mb-3">
                  Why Choose {provider.name}?
                </h4>
                <ul className="space-y-3">
                  {provider.claimSettlementRatio != null && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>
                        Claim settlement ratio:{" "}
                        <strong className="text-gray-800">
                          {provider.claimSettlementRatio}%
                        </strong>
                      </span>
                    </li>
                  )}

                  {provider.solvencyRatio != null && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>
                        Solvency ratio:{" "}
                        <strong className="text-gray-800">
                          {provider.solvencyRatio}x
                        </strong>
                      </span>
                    </li>
                  )}

                  {provider.networkHospitals != null && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>
                        Network:{" "}
                        <strong className="text-gray-800">
                          {provider.networkHospitals}+ hospitals
                        </strong>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
