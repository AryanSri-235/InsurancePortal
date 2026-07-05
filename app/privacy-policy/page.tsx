import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy | InsurancePortal" };

const sections = [
  { icon: "📋", title: "Information We Collect", body: "We collect information you provide directly: name, email, phone, date of birth, and insurance preferences. We also automatically collect device and usage data such as IP address, browser type, pages visited, and referral URLs for analytics and improvement." },
  { icon: "🎯", title: "How We Use Your Information", body: "Your information is used to: provide insurance comparison services; connect you with relevant insurers; personalise your experience; respond to your enquiries; send policy reminders and relevant offers (with consent); comply with legal obligations; and improve our platform." },
  { icon: "🤝", title: "Information Sharing", body: "We share your information with: (a) IRDAI-registered insurers when you request a quote; (b) service providers assisting us in operating the platform; (c) legal authorities when required by law. We do NOT sell your personal data to third parties." },
  { icon: "🔐", title: "Data Security", body: "We implement 256-bit SSL encryption, secure data centres, and strict access controls to protect your personal information. While no system is 100% secure, we take all reasonable steps to protect your data from unauthorised access or disclosure." },
  { icon: "🍪", title: "Cookies", body: "We use cookies and similar technologies to remember your preferences, analyse traffic, and improve our services. You can control cookie settings through your browser. Disabling cookies may affect some functionality." },
  { icon: "✅", title: "Your Rights", body: "You have the right to: access the personal data we hold; request correction of inaccurate data; request deletion of your data (subject to legal obligations); withdraw consent for marketing; and lodge a complaint with the relevant data protection authority." },
  { icon: "📅", title: "Data Retention", body: "We retain your personal information as long as necessary to provide our services and comply with legal obligations. Lead and enquiry data is typically retained for 3 years. You may request deletion at any time by contacting us." },
  { icon: "📞", title: "Contact Us", body: "For privacy-related queries, please contact our Data Protection Officer at: privacy@insuranceportal.in or write to InsurancePortal, Mumbai, Maharashtra, India 400001." },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Privacy{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">Last updated: January 1, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary card */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-7 mb-10 flex gap-4">
            <span className="text-3xl flex-shrink-0">🛡️</span>
            <div>
              <p className="font-black text-gray-900 mb-1">The short version</p>
              <p className="text-sm text-blue-800 leading-relaxed">
                We collect only what&apos;s needed to help you find insurance. We never sell your data. You can request deletion anytime. This policy explains everything in full.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.05}s` }}
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
