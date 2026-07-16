"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BlogForm, { BlogFormData } from "../BlogForm";

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setPost(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: BlogFormData) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id), ...data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update blog post");
      router.push("/admin/blog");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-semibold">Blog post not found</p>
        <Link href="/admin/blog" className="text-blue-600 text-sm mt-2 inline-block hover:underline">← Back to Blog Posts</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">Blog Posts</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate">{post.title}</span>
      </div>

      <BlogForm
        initialData={post}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Save Changes"
      />
    </div>
  );
}
