import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, ClipboardList, Shield, Handshake, CircleDollarSign, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = { title: "Disclaimer | InsurancePortal" };

const sections: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Landmark, title: "IRDAI Registration", body: "InsurancePortal is registered with the Insurance Regulatory and Development Authority of India (IRDAI) as a Web Aggregator under License No. WBA000000. Our registration authorises us to facilitate the solicitation and purchase of insurance products from IRDAI-registered insurers." },
  { icon: ClipboardList, title: "Nature of Information", body: "The content on this website — including premium estimates, plan comparisons, claim ratios, and editorial content — is for general informational purposes only. It does not constitute professional insurance, financial, legal, or tax advice. Premium estimates are indicative and may vary based on underwriting decisions by insurers." },
  { icon: Shield, title: "No Guarantee of Coverage", body: "Displaying a plan on InsurancePortal does not guarantee that you will be offered that plan or approved for coverage. All policies are subject to the insurer's underwriting process, terms and conditions, and applicable laws." },
  { icon: Handshake, title: "Third-Party Insurers", body: "Insurance policies featured on this platform are products of third-party IRDAI-registered insurers. InsurancePortal is not responsible for the terms, conditions, exclusions, or claim decisions of any insurer. Please read the policy brochure carefully before purchase." },
  { icon: CircleDollarSign, title: "Commission Disclosure", body: "InsurancePortal receives commission from insurance companies for referrals. This is in accordance with IRDAI regulations and is borne by the insurer — it does not increase the premium paid by the policyholder." },
  { icon: AlertTriangle, title: "Statutory Warning", body: "Insurance is the subject matter of solicitation. Please read all documents carefully. The purchase of an insurance product should be based on your individual needs and the advice of a qualified professional where necessary." },
];

export default function DisclaimerPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Disclaimer</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">Last updated: January 1, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-10">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ animationDelay: `${i * 0.05}s` }}
                  className="animate-fade-in-up bg-white border-2 border-gray-100 rounded-3xl p-7 hover:border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-black text-gray-900 text-lg mb-2">{s.title}</h2>
                      <p className="text-gray-500 leading-relaxed text-sm">{s.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory box */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-7 mb-10">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-black text-gray-900 mb-2">Statutory Disclaimer</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Insurance is the subject matter of solicitation. Visitors are hereby informed that their information submitted on the website may be shared with insurers. The product information for comparison displayed on this website is of the insurers with whom our company has an agreement. Product information is authentic and solely based on the information received from the Insurer.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200">
              Questions? Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
