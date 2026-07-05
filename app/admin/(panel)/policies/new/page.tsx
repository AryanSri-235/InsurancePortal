"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PolicyForm, { PolicyFormData } from "@/components/admin/PolicyForm";

export default function NewPolicyPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<{ id: number; name: string; categories: string[] }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/providers")
      .then(r => r.json())
      .then(d => { if (d.success) setProviders(d.data); });
  }, []);

  async function handleSubmit(data: PolicyFormData) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create policy");
      router.push("/admin/policies");
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
        <Link href="/admin/policies" className="text-gray-400 hover:text-gray-600 transition-colors">Policies</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">New Policy</span>
      </div>

      <PolicyForm
        providers={providers}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel="Create Policy"
      />
    </div>
  );
}
