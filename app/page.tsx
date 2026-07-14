import HeroSection from "@/components/home/HeroSection";
import CategoryCards from "@/components/home/CategoryCards";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedPolicies from "@/components/home/FeaturedPolicies";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LeadCaptureStrip from "@/components/home/LeadCaptureStrip";
import FaqSection from "@/components/home/FaqSection";
import SectionDivider from "@/components/home/SectionDivider";
import { db } from "@/lib/db";

export const revalidate = 3600;

async function getFeaturedPolicies() {
  try {
    return await db.policy.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        provider: {
          select: { name: true, slug: true, logoUrl: true, claimSettlementRatio: true },
        },
      },
      take: 6,
    });
  } catch { return []; }
}

async function getProviders() {
  try {
    return await db.provider.findMany({
      where: { isActive: true },
      select: {
        id: true, name: true, slug: true,
        logoUrl: true, claimSettlementRatio: true, categories: true,
      },
      orderBy: { claimSettlementRatio: "desc" },
    });
  } catch { return []; }
}

async function getTestimonials() {
  try {
    return await db.testimonial.findMany({ where: { isActive: true }, take: 6 });
  } catch { return []; }
}

async function getFaqs() {
  try {
    return await db.faq.findMany({
      where: { category: "general" },
      orderBy: { sortOrder: "asc" },
      take: 8,
    });
  } catch { return []; }
}

export default async function HomePage() {
  const [policies, providers, testimonials, faqs] = await Promise.all([
    getFeaturedPolicies(),
    getProviders(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      {/* 1. Hero — headline, CTA, insurance type selector, partner logos */}
      <HeroSection partners={providers} />
      <SectionDivider />

      {/* 2. Insurance Category Cards */}
      <CategoryCards />
      <SectionDivider />

      {/* 3. Why Choose Us — USP columns */}
      <WhyChooseUs />
      <SectionDivider />

      {/* 4. How It Works — 3-step visual flow */}
      <HowItWorks />
      <SectionDivider />

      {/* 6. Featured / Popular Policies */}
      <FeaturedPolicies policies={policies} />
      <SectionDivider />

      {/* 7. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />
      <SectionDivider />

      {/* 8. Lead Capture Strip — full-width CTA form */}
      <LeadCaptureStrip />
      <SectionDivider />

      {/* 9. FAQ Accordion with JSON-LD schema */}
      <FaqSection faqs={faqs} />
    </>
  );
}
