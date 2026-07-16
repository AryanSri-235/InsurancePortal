"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlogForm, { BlogFormData } from "../BlogForm";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: BlogFormData) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create blog post");
      router.push("/admin/blog");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">Blog Posts</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">New Blog Post</span>
      </div>

      <BlogForm
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Create Post"
      />
    </div>
  );
}
