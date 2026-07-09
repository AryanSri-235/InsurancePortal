"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Login Failed", text: data.error, confirmButtonColor: "#2563eb" });
        return;
      }
      await Swal.fire({ icon: "success", title: `Welcome back, ${data.user.name}!`, text: "You are now logged in.", confirmButtonColor: "#2563eb", timer: 2000, showConfirmButton: false });
      router.push("/account");
      router.refresh();
    } catch {
      Swal.fire({ icon: "error", title: "Oops!", text: "Network error. Please try again.", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
            <Link href="/" className="inline-flex mb-6">
              <div className="bg-white rounded-lg px-3 py-1.5">
                <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-blue-100 text-sm mt-1">Login to manage your insurance policies</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By logging in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
          &amp;{" "}
          <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}


