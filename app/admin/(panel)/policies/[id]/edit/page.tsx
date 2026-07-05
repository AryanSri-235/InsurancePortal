"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import PolicyForm, { PolicyFormData } from "@/components/admin/PolicyForm";

interface FullPolicy extends PolicyFormData {
  id: number;
  provider: { name: string };
}

export default function EditPolicyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<FullPolicy | null>(null);
  const [providers, setProviders] = useState<{ id: number; name: string; categories: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/policies/${id}`).then(r => r.json()),
      fetch("/api/admin/providers").then(r => r.json()),
    ]).then(([policyRes, provRes]) => {
      if (policyRes.success) setPolicy(policyRes.data);
      if (provRes.success) setProviders(provRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: PolicyFormData) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/policies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id), ...data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update policy");
      router.push("/admin/policies");
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

  if (!policy) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-semibold">Policy not found</p>
        <Link href="/admin/policies" className="text-blue-600 text-sm mt-2 inline-block hover:underline">← Back to Policies</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/policies" className="text-gray-400 hover:text-gray-600 transition-colors">Policies</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate">{policy.name}</span>
      </div>

      <PolicyForm
        providers={providers}
        initialData={policy}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Save Changes"
      />
    </div>
  );
}
