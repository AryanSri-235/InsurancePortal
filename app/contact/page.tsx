"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { type LucideIcon, Phone, Mail, MessageCircle, MapPin, CheckCircle, Zap } from "lucide-react";

const channels: { icon: LucideIcon; title: string; detail: string; sub: string; color: string; iconBg: string; from: string; to: string }[] = [
  { icon: Phone, title: "Call Us", detail: "+91 80761 75709", sub: "Mon–Sat · 9 AM–7 PM", color: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80", iconBg: "bg-blue-50", from: "#3b82f6", to: "#6366f1" },
  { icon: Mail, title: "Email Us", detail: "inquery@npsinsurance.in", sub: "Response within 24 hours", color: "border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100/80", iconBg: "bg-emerald-50", from: "#10b981", to: "#14b8a6" },
  { icon: MessageCircle, title: "WhatsApp", detail: "Chat on WhatsApp", sub: "Typical reply in < 5 min", color: "border-green-200 hover:border-green-300 hover:shadow-green-100/80", iconBg: "bg-green-50", from: "#22c55e", to: "#16a34a" },
  { icon: MapPin, title: "Office", detail: "Mumbai, Maharashtra", sub: "India 400001", color: "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/80", iconBg: "bg-orange-50", from: "#f97316", to: "#f59e0b" },
];

const subjects = ["Term Insurance Query", "Health Insurance Query", "Motor Insurance Query", "Life Insurance Query", "Claim Assistance", "Policy Renewal", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Server error");
      }
      setSent(true);
    } catch (err: unknown) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            We&apos;re{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Here to Help</span>
          </h1>
          <p className="text-gray-500 text-lg">Talk to a certified insurance advisor — free, no obligation, no spam.</p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {channels.map((c, i) => (
              <div key={c.title} style={{ animationDelay: `${i * 0.08}s` }}
                className={`animate-fade-in-up group bg-white border-2 rounded-3xl p-6 text-center card-hover hover:shadow-2xl transition-all duration-300 ${c.color}`}>
                <div className={`w-12 h-12 mx-auto rounded-2xl ${c.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon className="w-6 h-6" style={{ color: c.from }} />
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{c.title}</p>
                <p className="text-blue-600 font-semibold text-xs mb-1">{c.detail}</p>
                <p className="text-gray-400 text-xs">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* Form */}
            <div className="lg:col-span-3 bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/60">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="text-blue-600 font-semibold text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Send a Message</p>
                  <h2 className="text-3xl font-black text-gray-900 mb-7">How can we help?</h2>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                        <input name="name" required value={form.name} onChange={handle}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                          placeholder="Rajesh Kumar" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone</label>
                        <input name="phone" value={form.phone} onChange={handle}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                          placeholder="98XXXXXXXX" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
                      <input name="email" type="email" required value={form.email} onChange={handle}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                        placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">What&apos;s this about?</label>
                      <select name="subject" value={form.subject} onChange={handle}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors bg-white">
                        <option value="">Select a topic</option>
                        {subjects.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Message *</label>
                      <textarea name="message" required rows={4} value={form.message} onChange={handle}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors resize-none placeholder-gray-400"
                        placeholder="Tell us how we can help..." />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full btn-shine bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-100">
                      {loading ? "Sending..." : "Send Message →"}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-7 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <p className="font-black text-xl mb-2">Need a callback?</p>
                <p className="text-blue-100 text-sm mb-5">Leave your number and an advisor will call within 30 minutes.</p>
                <Link href="/#lead-form" className="bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl inline-block hover:bg-blue-50 transition-colors shadow-lg">
                  Request Callback →
                </Link>
              </div>

              <div className="bg-white border-2 border-gray-100 rounded-3xl p-7">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-4">Office Hours</p>
                <div className="space-y-3">
                  {[
                    { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
                    { day: "Saturday", hours: "9:00 AM – 4:00 PM" },
                    { day: "Sunday", hours: "Closed" },
                    { day: "Claim Support", hours: "24 × 7" },
                  ].map(r => (
                    <div key={r.day} className="flex justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <span className="text-gray-500 font-medium">{r.day}</span>
                      <span className="font-bold text-gray-900">{r.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6">
                <p className="font-bold text-gray-900 mb-2"><Zap className="w-4 h-4 inline mr-1" /> Fastest way to get help</p>
                <p className="text-sm text-gray-500">Call us directly on <span className="font-bold text-blue-600">+91 80761 75709</span>. Average wait time: under 2 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
