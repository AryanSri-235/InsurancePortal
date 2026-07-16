"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: string | Date | null;
  author: string | null;
}

interface Props {
  initialPosts: Post[];
  fallbackPosts: Post[];
}

const categories = [
  "All",
  "Term Insurance",
  "Health Insurance",
  "Motor Insurance",
  "Life Insurance",
  "Car Insurance",
  "Two Wheeler Insurance",
  "Family Health Insurance",
  "Group Health Insurance",
  "Travel Insurance",
  "Home Insurance",
  "Term Insurance for Women",
  "Return of Premium Term Plans",
  "Guaranteed Return Plans",
  "Child Savings Plans",
  "Retirement Plans",
  "Guides"
];

const catColors: Record<string, string> = {
  "Term Insurance": "bg-blue-100 text-blue-700",
  "Health Insurance": "bg-emerald-100 text-emerald-700",
  "Motor Insurance": "bg-orange-100 text-orange-700",
  "Life Insurance": "bg-violet-100 text-violet-700",
  "Car Insurance": "bg-sky-100 text-sky-700",
  "Two Wheeler Insurance": "bg-amber-100 text-amber-700",
  "Family Health Insurance": "bg-teal-100 text-teal-700",
  "Group Health Insurance": "bg-cyan-100 text-cyan-700",
  "Travel Insurance": "bg-yellow-100 text-yellow-700",
  "Home Insurance": "bg-rose-100 text-rose-700",
  "Term Insurance for Women": "bg-pink-100 text-pink-700",
  "Return of Premium Term Plans": "bg-indigo-100 text-indigo-700",
  "Guaranteed Return Plans": "bg-green-100 text-green-700",
  "Child Savings Plans": "bg-fuchsia-100 text-fuchsia-700",
  "Retirement Plans": "bg-purple-100 text-purple-700",
  "Guides": "bg-gray-100 text-gray-700",
};

const catBar: Record<string, string> = {
  "Term Insurance": "from-blue-500 to-indigo-500",
  "Health Insurance": "from-emerald-500 to-teal-500",
  "Motor Insurance": "from-orange-500 to-amber-500",
  "Life Insurance": "from-violet-500 to-purple-500",
  "Car Insurance": "from-sky-500 to-blue-500",
  "Two Wheeler Insurance": "from-amber-500 to-orange-500",
  "Family Health Insurance": "from-teal-500 to-emerald-500",
  "Group Health Insurance": "from-cyan-500 to-blue-500",
  "Travel Insurance": "from-yellow-500 to-amber-500",
  "Home Insurance": "from-rose-500 to-pink-500",
  "Term Insurance for Women": "from-pink-500 to-rose-500",
  "Return of Premium Term Plans": "from-indigo-500 to-violet-500",
  "Guaranteed Return Plans": "from-green-500 to-emerald-500",
  "Child Savings Plans": "from-fuchsia-500 to-purple-500",
  "Retirement Plans": "from-purple-500 to-indigo-500",
  "Guides": "from-gray-400 to-gray-500",
};

export default function BlogListClient({ initialPosts, fallbackPosts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const postsToUse = initialPosts.length > 0 ? initialPosts : fallbackPosts;

  const filteredPosts = selectedCategory === "All"
    ? postsToUse
    : postsToUse.filter(post => post.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
              cat === selectedCategory
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-200 scale-105"
                : "bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold">No posts found in this category</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              className="group animate-fade-in-up bg-white border-2 border-gray-100 rounded-3xl overflow-hidden flex flex-col hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50/80 hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Colour bar */}
              <div className={`h-1.5 bg-gradient-to-r ${catBar[post.category ?? ""] ?? "from-blue-500 to-indigo-500"}`} />

              <div className="p-7 flex flex-col flex-1">
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${catColors[post.category ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                  {post.category}
                </span>
                <h2 className="font-black text-gray-900 text-xl leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">{post.excerpt}</p>
                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-700">{post.author ?? "InsurancePortal Team"}</p>
                    <p className="text-xs text-gray-400">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "Draft"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
