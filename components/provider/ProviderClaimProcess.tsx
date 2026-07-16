import { Provider } from "@prisma/client";
import { Check, Phone, Mail } from "lucide-react";

interface Props {
  provider: Provider;
  category: string;
}

const steps = [
  {
    number: 1,
    title: "Intimate the Claim",
    description:
      "Call the toll-free number or register online within 24–48 hours of the incident. Keep your policy number ready.",
  },
  {
    number: 2,
    title: "Submit Documents",
    description:
      "Provide claim form, policy copy, and supporting documents (hospital bills, FIR, repair estimates) as applicable.",
  },
  {
    number: 3,
    title: "Survey & Assessment",
    description:
      "A claims assessor verifies the incident and submitted documents within 3–7 working days.",
  },
  {
    number: 4,
    title: "Claim Settlement",
    description:
      "Approved amount is credited to your account or settled directly with hospital/garage within 15 days.",
  },
];

const documentsByCategory: Record<string, string[]> = {
  health: [
    "Policy document",
    "Duly filled claim form",
    "Hospital discharge summary",
    "Original bills & receipts",
    "Doctor's prescription",
    "Investigation reports",
    "Photo ID proof",
  ],
  motor: [
    "Policy document",
    "Duly filled claim form",
    "RC book copy",
    "Driving licence copy",
    "FIR (for theft/third-party)",
    "Repair estimate/bills",
    "Photos of damage",
  ],
  term: [
    "Policy document",
    "Death certificate",
    "Medical records",
    "Claimant's photo ID",
    "Bank account details",
    "Post-mortem report (if applicable)",
  ],
  life: [
    "Policy document",
    "Death certificate",
    "Medical records",
    "Claimant's photo ID",
    "Bank account details",
    "Post-mortem report (if applicable)",
  ],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProviderClaimProcess({ provider, category }: Props) {
  const documents =
    documentsByCategory[category] ?? documentsByCategory["health"];
  const providerSlug = slugify(provider.name);
  const claimsEmail = `claims@${providerSlug}.com`;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — How to File a Claim */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-8">
              Claim Process
            </h2>

            <ol className="relative">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                return (
                  <li key={step.number} className="flex gap-4">
                    {/* Step number + dashed connector */}
                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {step.number}
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 border-l-2 border-dashed border-blue-300 my-1" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT — Two sub-cards */}
          <div className="flex flex-col gap-6">
            {/* Card A: Documents Required */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Documents Required
              </h3>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-3">
                    {/* Checkbox-style icon */}
                    <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                      <Check className="w-3 h-3 text-blue-600" />
                    </span>
                    <span className="text-sm text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card B: Claim Helpline */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
                24x7 Claim Support
              </p>
              <h3 className="text-lg font-bold mb-4">Claim Helpline</h3>

              <div className="space-y-3">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </span>
                  <span className="text-sm font-medium">
                    +91 80761 75709
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </span>
                  <span className="text-sm font-medium break-all">
                    {claimsEmail}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-blue-200">
                Average response time: 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
