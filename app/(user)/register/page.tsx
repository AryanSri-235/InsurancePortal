"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirm: "",
    dob: "", gender: "", city: "", pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      setErrors({ pincode: "Enter a valid 6-digit pincode" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email || undefined,
          password: form.password,
          dob: form.dob || undefined,
          gender: form.gender || undefined,
          city: form.city || undefined,
          pincode: form.pincode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Registration Failed", text: data.error, confirmButtonColor: "#2563eb" });
        if (res.status === 409) setStep(1);
        return;
      }
      await Swal.fire({ icon: "success", title: `Welcome, ${data.user.name}!`, text: "Your account has been created successfully.", confirmButtonColor: "#2563eb", timer: 2500, showConfirmButton: false });
      router.push("/account");
      router.refresh();
    } catch {
      Swal.fire({ icon: "error", title: "Oops!", text: "Network error. Please try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
            <Link href="/" className="inline-flex mb-6">
              <div className="bg-white rounded-lg px-3 py-1.5">
                <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-blue-100 text-sm mt-1">Compare and buy insurance in minutes</p>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mt-5">
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${step === 1 ? "bg-white text-blue-600" : "bg-white/20 text-white"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? "bg-blue-600 text-white" : "bg-white/30 text-white"}`}>1</span>
                Account Info
              </div>
              <div className="h-px flex-1 bg-white/30" />
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${step === 2 ? "bg-white text-blue-600" : "bg-white/20 text-white"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? "bg-blue-600 text-white" : "bg-white/30 text-white"}`}>2</span>
                Personal Info
              </div>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="px-8 py-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  placeholder="rajesh@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`w-full pr-11 pl-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
                    className={`w-full pr-11 pl-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.confirm ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Continue â†’
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
              </p>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              <p className="text-sm text-gray-500">These details help us personalise your insurance recommendations.</p>

              {/* DOB */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  onChange={(e) => set("dob", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <div className="flex gap-3">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => set("gender", g.value)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.gender === g.value ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
                <input
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.pincode ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  â† Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : "Create Account"}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                By registering, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
                &amp;{" "}
                <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


