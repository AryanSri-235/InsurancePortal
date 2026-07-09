"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProviderFaqProps {
  providerName: string;
  category: string;
}

export default function ProviderFaq({ providerName, category }: ProviderFaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      q: `Is ${providerName} a good insurance company?`,
      a: `${providerName} is one of India's leading IRDAI-registered insurance providers with a high claim settlement ratio. They are known for quick claim processing, strong network, and transparent policy terms. Our experts rate them highly for customer service.`,
    },
    {
      q: `How do I file a claim with ${providerName}?`,
      a: `You can file a claim with ${providerName} through their website, mobile app, or by calling their 24x7 toll-free number. Keep your policy number and relevant documents (hospital bills, FIR, etc.) ready. Cashless claims are settled directly with network hospitals/garages.`,
    },
    {
      q: `What is ${providerName}'s claim settlement ratio?`,
      a: `${providerName} has a high claim settlement ratio (check the stats bar above for the latest figure). This means for every 100 claims filed, they settle a high proportion — making them a reliable choice.`,
    },
    {
      q: `How long does ${providerName} take to settle claims?`,
      a: `${providerName} typically settles straightforward claims within 7–15 working days. Cashless health claims at network hospitals are approved within 2–4 hours. Complex claims may take up to 30 days depending on investigation requirements.`,
    },
    {
      q: `Can I port my existing policy to ${providerName}?`,
      a: `Yes, you can port your existing ${category} insurance policy to ${providerName} at the time of renewal. Portability preserves your waiting period credits and no-claim bonus. Contact our experts for a smooth porting process.`,
    },
    {
      q: `What documents do I need to buy a ${providerName} ${category} plan?`,
      a: `To purchase a ${providerName} plan online, you typically need: Photo ID (Aadhaar/PAN), Age proof, Address proof, Recent photographs, and for health insurance — a medical history declaration. No physical documents required for online purchase.`,
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-black mb-8">
          {providerName} — Frequently Asked Questions
        </h2>

        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-100 bg-white rounded-2xl mb-3 overflow-hidden"
            >
              <button
                className="w-full p-5 flex justify-between items-center hover:bg-gray-50 text-left"
                onClick={() => handleToggle(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold pr-4">{faq.q}</span>
                <ChevronDown
                  className="flex-shrink-0 transition-transform duration-200 w-5 h-5"
                  style={{
                    transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  aria-hidden="true"
                />
              </button>

              {openIndex === index && (
                <div className="p-5 pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Have more questions? Talk to our insurance experts — free!
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            Chat with Expert →
          </button>
        </div>
      </div>
    </section>
  );
}
