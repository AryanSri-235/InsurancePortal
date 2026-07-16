import type { Metadata } from "next";
import { db } from "@/lib/db";
import NewsletterForm from "@/components/NewsletterForm";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Insurance Blog | InsurancePortal",
  description: "Expert tips, guides and news on term, health, life and motor insurance in India.",
};

const fallbackPosts = [
  { id: 1, slug: "term-insurance-guide", title: "Complete Guide to Term Insurance in India 2026", excerpt: "Everything you need to know about term plans — how to choose the right cover amount, policy term, and riders for your family.", category: "Term Insurance", publishedAt: new Date("2026-06-01"), author: "Priya Sharma" },
  { id: 2, slug: "health-insurance-cashless", title: "How Cashless Health Insurance Works at Hospitals", excerpt: "Step-by-step walkthrough of the cashless claim process — from pre-authorisation to discharge. No paperwork surprises.", category: "Health Insurance", publishedAt: new Date("2026-05-20"), author: "Rajesh Mehta" },
  { id: 3, slug: "motor-ncb-guide", title: "No-Claim Bonus: How to Protect and Maximise Your NCB", excerpt: "NCB can reduce your motor premium by up to 50%. Here's how to protect it and what happens if you switch insurers.", category: "Motor Insurance", publishedAt: new Date("2026-05-10"), author: "Amit Verma" },
  { id: 4, slug: "ulip-vs-term", title: "ULIP vs Term Insurance: Which is Better for You?", excerpt: "ULIPs combine insurance with investment. Is that actually a good deal? We do the numbers.", category: "Life Insurance", publishedAt: new Date("2026-04-28"), author: "Sunita Patel" },
  { id: 5, slug: "tax-benefits-80c", title: "Tax Benefits Under Section 80C and 80D Explained", excerpt: "Term premiums under 80C, health premiums under 80D — here's how to claim both and save more.", category: "Guides", publishedAt: new Date("2026-04-15"), author: "Priya Sharma" },
  { id: 6, slug: "claim-settlement-ratio", title: "Claim Settlement Ratio: What It Means and Why It Matters", excerpt: "The most important number when comparing insurers — yet most people ignore it. Here's what a 'good' ratio looks like.", category: "Guides", publishedAt: new Date("2026-04-01"), author: "Rajesh Mehta" },
];

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (e) {
    console.error("Failed to fetch blog posts:", e);
  }

  const serializedPosts = posts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    author: p.author,
  }));

  const serializedFallback = fallbackPosts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    publishedAt: p.publishedAt.toISOString(),
    author: p.author,
  }));

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Insurance Insights</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            The Insurance{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-gray-500 text-lg">Expert guides, tips, and plain-English explanations — no jargon.</p>
        </div>
      </section>

      {/* Interactive Posts Grid with Client Filter */}
      <section className="py-20 bg-gray-50">
        <BlogListClient initialPosts={serializedPosts} fallbackPosts={serializedFallback} />
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 lg:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Stay Informed</p>
            <h2 className="text-4xl font-black mb-3">Get Tips in Your Inbox</h2>
            <p className="text-blue-100 mb-8">Weekly guides on saving money and choosing the right insurance plan.</p>
            <div className="max-w-md mx-auto">
              <NewsletterForm
                source="blog"
                inputClass="flex-1 bg-white/10 border-2 border-white/20 text-white text-sm px-4 py-3 rounded-xl placeholder-blue-200 focus:outline-none focus:border-white/50 transition-colors"
                buttonClass="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
