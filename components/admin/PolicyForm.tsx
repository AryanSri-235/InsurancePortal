"use client";

import { useState, useEffect } from "react";
import { X, XCircle, Loader2 } from "lucide-react";

export interface PolicyFormData {
  name: string;
  slug: string;
  providerId: number;
  category: string;
  subCategory: string;
  description: string;
  premiumStartsFrom: number | "";
  coverAmount: string;
  policyTerm: string;
  eligibilityAge: string;
  keyBenefits: string[];
  exclusions: string[];
  documentsRequired: string[];
  isFeatured: boolean;
  isActive: boolean;
}

const EMPTY: PolicyFormData = {
  name: "", slug: "", providerId: 0, category: "term", subCategory: "",
  description: "", premiumStartsFrom: "", coverAmount: "", policyTerm: "",
  eligibilityAge: "", keyBenefits: [], exclusions: [], documentsRequired: [],
  isFeatured: false, isActive: true,
};

const CATEGORIES = [
  "term",
  "life",
  "health",
  "motor",
  "travel",
  "home",
  "personal-accident",
  "fire",
  "marine",
  "pension",
  "commercial",
  "crop",
  "cyber",
];

const CAT_LABELS: Record<string, string> = {
  "term":              "Term Insurance",
  "life":              "Life Insurance",
  "health":            "Health Insurance",
  "motor":             "Motor Insurance",
  "travel":            "Travel Insurance",
  "home":              "Home Insurance",
  "personal-accident": "Personal Accident",
  "fire":              "Fire Insurance",
  "marine":            "Marine Insurance",
  "pension":           "Pension / Retirement",
  "commercial":        "Commercial / Business",
  "crop":              "Crop Insurance",
  "cyber":             "Cyber Insurance",
};

const CAT_SUB: Record<string, string[]> = {
  term:              ["Pure Term", "Return of Premium", "Increasing Cover"],
  life:              ["Whole Life", "ULIP", "Endowment", "Money Back"],
  health:            ["Individual", "Family Floater", "Senior Citizen", "Critical Illness", "Group Health"],
  motor:             ["Comprehensive", "Third Party", "Own Damage", "Electric Vehicle"],
  travel:            ["Domestic", "International", "Student", "Senior Citizen Travel", "Group Travel"],
  home:              ["Building", "Contents", "Building + Contents"],
  "personal-accident": ["Individual", "Group", "Workmen Compensation"],
  fire:              ["Standard Fire", "Industrial All Risk", "Consequential Loss"],
  marine:            ["Cargo", "Hull", "Inland Transit"],
  pension:           ["Immediate Annuity", "Deferred Annuity", "NPS Tier I", "NPS Tier II"],
  commercial:        ["General Liability", "Professional Indemnity", "Directors & Officers"],
  crop:              ["PMFBY", "Weather Based", "Horticulture"],
  cyber:             ["Individual", "Business", "Data Breach"],
};

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-800 placeholder-gray-400";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ListEditor({
  label, values, onChange, placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setDraft("");
    }
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-gray-700">{v}</span>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={placeholder}
            className={inputCls}
          />
          <button
            type="button"
            onClick={add}
            className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  providers: { id: number; name: string; categories: string[] }[];
  initialData?: Partial<PolicyFormData>;
  onSubmit: (data: PolicyFormData) => void;
  saving: boolean;
  error: string;
  submitLabel: string;
}

export default function PolicyForm({ providers, initialData, onSubmit, saving, error, submitLabel }: Props) {
  const [form, setForm] = useState<PolicyFormData>({ ...EMPTY, ...initialData });
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);

  useEffect(() => {
    if (initialData) setForm({ ...EMPTY, ...initialData });
  }, [initialData]);

  function set<K extends keyof PolicyFormData>(key: K, value: PolicyFormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleNameChange(name: string) {
    set("name", name);
    if (!slugEdited) set("slug", toSlug(name));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      premiumStartsFrom: form.premiumStartsFrom === "" ? 0 : Number(form.premiumStartsFrom),
      providerId: Number(form.providerId),
    });
  }

  const subCategories = CAT_SUB[form.category] ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs font-bold">1</span>
          Basic Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Policy Name *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. HDFC Click 2 Protect Life"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>URL Slug *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">/</span>
              <input
                required
                type="text"
                value={form.slug}
                onChange={e => { setSlugEdited(true); set("slug", e.target.value); }}
                placeholder="hdfc-click-2-protect-life"
                className={`${inputCls} pl-6`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Provider *</label>
            <select
              required
              value={form.providerId || ""}
              onChange={e => set("providerId", Number(e.target.value))}
              className={inputCls}
            >
              <option value="">Select a provider...</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Category *</label>
            <select
              required
              value={form.category}
              onChange={e => { set("category", e.target.value); set("subCategory", ""); }}
              className={inputCls}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CAT_LABELS[c] ?? c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Sub-Category</label>
            <select
              value={form.subCategory}
              onChange={e => set("subCategory", e.target.value)}
              className={inputCls}
            >
              <option value="">None</option>
              {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Brief description shown on the policy page..."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Pricing & coverage */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center text-xs font-bold">2</span>
          Pricing & Coverage
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Premium Starts From (₹/mo)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min={0}
                value={form.premiumStartsFrom}
                onChange={e => set("premiumStartsFrom", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="499"
                className={`${inputCls} pl-7`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Cover Amount</label>
            <input
              type="text"
              value={form.coverAmount}
              onChange={e => set("coverAmount", e.target.value)}
              placeholder="₹1 Cr"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Policy Term</label>
            <input
              type="text"
              value={form.policyTerm}
              onChange={e => set("policyTerm", e.target.value)}
              placeholder="10 – 40 years"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Eligibility Age</label>
            <input
              type="text"
              value={form.eligibilityAge}
              onChange={e => set("eligibilityAge", e.target.value)}
              placeholder="18 – 65 years"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded flex items-center justify-center text-xs font-bold">3</span>
          Benefits, Exclusions & Documents
        </h2>

        <ListEditor
          label="Key Benefits"
          values={form.keyBenefits}
          onChange={v => set("keyBenefits", v)}
          placeholder="e.g. Death benefit paid to nominee"
        />

        <div className="border-t border-gray-100" />

        <ListEditor
          label="Exclusions"
          values={form.exclusions}
          onChange={v => set("exclusions", v)}
          placeholder="e.g. Pre-existing conditions in first 2 years"
        />

        <div className="border-t border-gray-100" />

        <ListEditor
          label="Documents Required"
          values={form.documentsRequired}
          onChange={v => set("documentsRequired", v)}
          placeholder="e.g. Aadhaar card"
        />
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-4">
          <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-xs font-bold">4</span>
          Visibility
        </h2>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("isActive", !form.isActive)}
              className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${form.isActive ? "bg-emerald-500" : "bg-gray-200"}`}
              style={{ height: "22px" }}
            >
              <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-[18px]" : ""}`}
                style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Active</p>
              <p className="text-xs text-gray-400">Show on the public site</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("isFeatured", !form.isFeatured)}
              className={`relative w-10 rounded-full transition-colors cursor-pointer ${form.isFeatured ? "bg-amber-400" : "bg-gray-200"}`}
              style={{ height: "22px" }}
            >
              <span className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "translate-x-[18px]" : ""}`}
                style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Featured</p>
              <p className="text-xs text-gray-400">Show in homepage featured section</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pb-6">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2 shadow-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : submitLabel}
        </button>
        <a href="/admin/policies" className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2.5">
          Cancel
        </a>
      </div>
    </form>
  );
}
