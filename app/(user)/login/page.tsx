"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Phone, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("phone");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [timer,   setTimer]   = useState(0);
  const [verificationId, setVerificationId] = useState("");
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer <= 0) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timer]);

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit Indian mobile number."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      setVerificationId(data.verificationId);
      setStep("otp");
      setTimer(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      console.error("Message Central sendOtp error:", err);
      setError("Failed to send OTP. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[i]) { const n = [...otp]; n[i] = ""; setOtp(n); }
      else inputRefs.current[i - 1]?.focus();
    }
  }

  function handleOtpChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const n = [...otp]; n[i] = digit; setOtp(n);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 6) { setOtp(digits); inputRefs.current[5]?.focus(); e.preventDefault(); }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    if (!verificationId) { setError("No active OTP session. Please request OTP again."); return; }
    
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/verify-otp", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ phone, otp: code, verificationId }) 
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed"); return; }
      if (data.isNewUser) { router.push("/complete-profile"); }
      else               { router.push("/account"); router.refresh(); }
    } catch (err: any) {
      console.error("verifyOtp error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm hover:shadow transition-all duration-200 hover:-translate-x-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating insurance icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-16 left-16 w-24 h-24 text-blue-400/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <svg className="absolute top-12 right-24 w-20 h-20 text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
        </svg>
        <svg className="absolute bottom-24 left-20 w-28 h-28 text-orange-400/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6.99zM6.85 6h10.29l1.08 4H5.77L6.85 6zM19 17H5v-5h14v5z" /><circle cx="7.5" cy="14.5" r="1.5" /><circle cx="16.5" cy="14.5" r="1.5" />
        </svg>
        <svg className="absolute bottom-20 right-16 w-24 h-24 text-violet-400/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 12c0-6.08-4.51-11.12-10.38-11.93L12 0l-.62.07C5.51.88 1 5.92 1 12h11v5c0 1.1-.9 2-2 2a2 2 0 01-2-2H6a4 4 0 004 4 4 4 0 004-4v-5h9z" />
        </svg>
        <svg className="absolute top-1/2 -translate-y-1/2 left-8 w-16 h-16 text-blue-400/15" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 13l-3-3 1.41-1.41L10 11.17l5.59-5.59L17 7l-7 7z" />
        </svg>
        <svg className="absolute top-1/3 right-10 w-20 h-20 text-indigo-400/15" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z" />
        </svg>
      </div>

      {/* Gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-200/60 border border-blue-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600" />

          {/* Header */}
          <div className="px-8 pt-7 pb-6 relative overflow-hidden">
            <div className="relative z-10">
              <Link href="/" className="inline-flex mb-5">
                <img src="/logo-chatgpt.png" alt="NPS Insurance" className="h-24 w-auto object-contain" />
              </Link>
              {step === "phone" ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
                  <p className="text-gray-500 text-sm mt-1">Login or create your account with OTP</p>
                </>
              ) : (
                <>
                  <button onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm mb-3 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Change number
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
                  <p className="text-gray-500 text-sm mt-1">Sent to <span className="font-semibold text-gray-700">+91 {phone}</span></p>
                </>
              )}
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600" />

          <div className="px-8 py-8">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {(["phone", "otp"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s ? "bg-blue-600 text-white" : i < ["phone","otp"].indexOf(step) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < ["phone","otp"].indexOf(step) ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < 1 && <div className={`h-0.5 w-8 rounded ${step !== "phone" ? "bg-blue-600" : "bg-gray-200"}`} />}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-1">{step === "phone" ? "Enter number" : "Enter OTP"}</span>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
            )}

            {/* Step 1: Phone */}
            {step === "phone" && (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm font-semibold text-gray-500">
                      <Phone className="w-3.5 h-3.5 mr-1.5" />+91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">We&apos;ll send a 6-digit OTP to verify your number</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</> : "Send OTP →"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> &amp; <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
                </p>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <form onSubmit={verifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">Enter 6-digit OTP</label>
                  <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${digit ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 focus:border-blue-400"}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="btn-shine w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify & Continue →"}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-400">Resend OTP in <span className="font-semibold text-gray-600">{timer}s</span></p>
                  ) : (
                    <button type="button" onClick={() => sendOtp()} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-semibold mx-auto">
                      <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
