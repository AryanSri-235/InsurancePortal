import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service | InsurancePortal" };

const sections = [
  { icon: "📄", title: "Acceptance of Terms", body: "By accessing or using InsurancePortal, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance." },
  { icon: "🔍", title: "Nature of Services", body: "InsurancePortal is an IRDAI-registered web aggregator (Reg. No. WBA000000). We provide insurance comparison and lead-referral services. We are not an insurer. Policies are issued directly by the respective insurance companies." },
  { icon: "👤", title: "Eligibility", body: "You must be at least 18 years of age and a resident of India to use our services. By using the platform, you confirm that the information you provide is accurate and truthful." },
  { icon: "✅", title: "User Obligations", body: "You agree to: provide accurate and complete information; not use the platform for any unlawful purpose; not attempt to hack, scrape, or disrupt our services; not impersonate any person or entity; and comply with all applicable Indian laws." },
  { icon: "🛡️", title: "Insurance Transactions", body: "InsurancePortal facilitates connections between users and insurers. The insurance contract is solely between you and the insurer. We are not liable for any acts, omissions, or decisions made by insurance companies, including claim decisions." },
  { icon: "💰", title: "Commission Disclosure", body: "As a web aggregator, we receive commission from insurers for referrals. This commission does not affect the premium you pay — it is borne by the insurer. We are required to disclose this under IRDAI regulations." },
  { icon: "©️", title: "Intellectual Property", body: "All content on InsurancePortal — including text, graphics, logos, and software — is our intellectual property or that of our licensors. You may not reproduce, distribute, or create derivative works without explicit written permission." },
  { icon: "⚖️", title: "Limitation of Liability", body: "InsurancePortal shall not be liable for any indirect, incidental, or consequential damages arising from use of our services. Our maximum liability in any claim shall not exceed the amount you paid us (which, for free users, is ₹0)." },
  { icon: "🏛️", title: "Governing Law", body: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra." },
  { icon: "📞", title: "Contact", body: "For legal enquiries: legal@insuranceportal.in · InsurancePortal, Mumbai, Maharashtra, India 400001." },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Terms of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">Last updated: January 1, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.04}s` }}
                className="animate-fade-in-up bg-white border-2 border-gray-100 rounded-3xl p-7 hover:border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg mb-2">{i + 1}. {s.title}</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact" className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200">
              Questions? Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
