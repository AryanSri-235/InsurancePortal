import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Blog | InsurancePortal" };

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <a href="/blog" className="text-sm text-blue-600 font-semibold hover:underline mb-8 inline-block">← Back to Blog</a>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Insurance Guide</span>
        <h1 className="text-4xl font-black text-gray-900 mt-4 mb-6 leading-tight">Article: {params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</h1>
        <p className="text-gray-400 text-sm mb-10">This article is coming soon. Check back later.</p>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-2">Ready to get covered?</h3>
          <p className="text-blue-100 mb-5">Compare 200+ plans from 50+ top insurers — free.</p>
          <a href="/#lead-form" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl inline-block hover:bg-blue-50 transition-colors">Get Free Quote →</a>
        </div>
      </div>
    </div>
  );
}
