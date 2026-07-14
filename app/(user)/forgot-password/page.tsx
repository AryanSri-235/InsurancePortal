"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type Step = "phone" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null); // dev only

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Swal.fire({ icon: "warning", title: "Invalid Number", text: "Enter a valid 10-digit Indian mobile number.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Error", text: data.error, confirmButtonColor: "#2563eb" });
        return;
      }
      if (data._devOtp) setDevOtp(data._devOtp); // dev hint
      setStep("otp");
    } finally {
      setLoading(false);
    }
  }

  async function verifyAndReset(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      Swal.fire({ icon: "warning", title: "Invalid OTP", text: "Enter the 6-digit OTP sent to your mobile.", confirmButtonColor: "#2563eb" });
      return;
    }
    if (newPassword.length < 8) {
      Swal.fire({ icon: "warning", title: "Weak Password", text: "Password must be at least 8 characters.", confirmButtonColor: "#2563eb" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "Mismatch", text: "Passwords do not match.", confirmButtonColor: "#2563eb" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({ icon: "error", title: "Failed", text: data.error, confirmButtonColor: "#2563eb" });
        return;
      }
      await Swal.fire({ icon: "success", title: "Password Updated!", text: "You can now login with your new password.", confirmButtonColor: "#2563eb" });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
            <Link href="/" className="inline-flex mb-6">
              <div className="bg-white rounded-lg px-3 py-1.5">
                <img src="/logo-zoomed.png" alt="NPS Insurance.Life" className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-blue-100 text-sm mt-1">
              {step === "phone" && "We'll send an OTP to your registered mobile"}
              {step === "otp" && `OTP sent to +91 ${phone}`}
              {step === "password" && "Enter your new password"}
            </p>

            {/* Step dots */}
            <div className="flex items-center gap-2 mt-5">
              {(["phone", "otp", "password"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all ${step === s ? "bg-white w-4" : "bg-white/40"}`} />
                  {i < 2 && <div className="h-px w-6 bg-white/30" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step: Phone */}
          {step === "phone" && (
            <form onSubmit={requestOtp} className="px-8 py-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</> : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
              </p>
            </form>
          )}

          {/* Step: OTP + New Password */}
          {step === "otp" && (
            <form onSubmit={verifyAndReset} className="px-8 py-8 space-y-5">
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-xs text-yellow-800">
                  <span className="font-bold">Dev mode OTP:</span> {devOtp} <span className="text-yellow-600">(remove in production)</span>
                </div>
              )}

              {/* OTP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-center text-lg"
                  required
                />
                <button type="button" onClick={() => setStep("phone")} className="text-xs text-blue-600 hover:underline mt-1.5 block">
                  Change number
                </button>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


