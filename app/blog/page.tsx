import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Insurance Blog | InsurancePortal",
  description: "Expert tips, guides and news on term, health, life and motor insurance in India.",
};

const categories = ["All", "Term Insurance", "Health Insurance", "Motor Insurance", "Life Insurance", "Guides"];

const catColors: Record<string, string> = {
  "Term Insurance": "bg-blue-100 text-blue-700",
  "Health Insurance": "bg-emerald-100 text-emerald-700",
  "Motor Insurance": "bg-orange-100 text-orange-700",
  "Life Insurance": "bg-violet-100 text-violet-700",
  "Guides": "bg-gray-100 text-gray-700",
};

const fallbackPosts = [
  { id: 1, slug: "term-insurance-guide", title: "Complete Guide to Term Insurance in India 2026", excerpt: "Everything you need to know about term plans — how to choose the right cover amount, policy term, and riders for your family.", category: "Term Insurance", publishedAt: new Date("2026-06-01"), author: "Priya Sharma" },
  { id: 2, slug: "health-insurance-cashless", title: "How Cashless Health Insurance Works at Hospitals", excerpt: "Step-by-step walkthrough of the cashless claim process — from pre-authorisation to discharge. No paperwork surprises.", category: "Health Insurance", publishedAt: new Date("2026-05-20"), author: "Rajesh Mehta" },
  { id: 3, slug: "motor-ncb-guide", title: "No-Claim Bonus: How to Protect and Maximise Your NCB", excerpt: "NCB can reduce your motor premium by up to 50%. Here's how to protect it and what happens if you switch insurers.", category: "Motor Insurance", publishedAt: new Date("2026-05-10"), author: "Amit Verma" },
  { id: 4, slug: "ulip-vs-term", title: "ULIP vs Term Insurance: Which is Better for You?", excerpt: "ULIPs combine insurance with investment. Is that actually a good deal? We do the numbers.", category: "Life Insurance", publishedAt: new Date("2026-04-28"), author: "Sunita Patel" },
  { id: 5, slug: "tax-benefits-80c", title: "Tax Benefits Under Section 80C and 80D Explained", excerpt: "Term premiums under 80C, health premiums under 80D — here's how to claim both and save more.", category: "Guides", publishedAt: new Date("2026-04-15"), author: "Priya Sharma" },
  { id: 6, slug: "claim-settlement-ratio", title: "Claim Settlement Ratio: What It Means and Why It Matters", excerpt: "The most important number when comparing insurers — yet most people ignore it. Here's what a 'good' ratio looks like.", category: "Guides", publishedAt: new Date("2026-04-01"), author: "Rajesh Mehta" },
];

const catBar: Record<string, string> = {
  "Term Insurance": "from-blue-500 to-indigo-500",
  "Health Insurance": "from-emerald-500 to-teal-500",
  "Motor Insurance": "from-orange-500 to-amber-500",
  "Life Insurance": "from-violet-500 to-purple-500",
  "Guides": "from-gray-400 to-gray-500",
};

export default async function BlogPage() {
  let posts = fallbackPosts;
  try {
    const dbPosts = await db.blogPost.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, take: 12 });
    if (dbPosts.length > 0) posts = dbPosts as typeof fallbackPosts;
  } catch {}

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

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <span key={cat}
                className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 cursor-default ${
                  cat === "All"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-200"
                    : "bg-white border-gray-100 text-gray-600"
                }`}>
                {cat}
              </span>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                className="animate-fade-in-up group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Colour bar */}
                <div className={`h-1.5 bg-gradient-to-r ${catBar[post.category] ?? "from-blue-500 to-indigo-500"}`} />

                <div className="p-7 flex flex-col flex-1">
                  <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${catColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                  <h2 className="font-black text-gray-900 text-xl leading-snug mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-700">{post.author}</p>
                      <p className="text-xs text-gray-400">{new Date(post.publishedAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all duration-200 inline-block">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden">
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
