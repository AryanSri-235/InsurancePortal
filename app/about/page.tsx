import type { Metadata } from "next";
import Link from "next/link";
import { type LucideIcon, Award, Users, ClipboardList, Handshake, Target, Phone, BadgeCheck, Shield, Star, HeartHandshake, Clock, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | NPS Insurance Solutions",
  description: "NPS Insurance Solutions — founded and led by Neeraj Pratap Singh with 35+ years of experience in the insurance industry. Trusted by thousands of Indian families.",
};

const stats: { value: string; label: string; icon: LucideIcon; bg: string; color: string }[] = [
  { value: "35+", label: "Years of Experience", icon: Award,         bg: "bg-blue-50 border-blue-100",    color: "text-blue-600" },
  { value: "50+", label: "Insurance Partners",  icon: Handshake,     bg: "bg-indigo-50 border-indigo-100", color: "text-indigo-600" },
  { value: "6+",  label: "Insurance Types",     icon: ClipboardList, bg: "bg-emerald-50 border-emerald-100", color: "text-emerald-600" },
  { value: "100%",label: "Claim Support",       icon: BadgeCheck,    bg: "bg-violet-50 border-violet-100", color: "text-violet-600" },
];

const whyChoose: { icon: LucideIcon; title: string; desc: string; from: string; to: string; accent: string; iconBg: string }[] = [
  {
    icon: Award,
    title: "35+ Years of Proven Expertise",
    desc: "Decades of hands-on experience navigating the insurance landscape, market changes, and evolving customer needs.",
    from: "#3b82f6", to: "#6366f1", accent: "border-blue-200 hover:border-blue-300 hover:shadow-blue-100/80", iconBg: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Personalized Guidance",
    desc: "Every client receives tailored advice based on their unique life stage, financial goals, and risk profile.",
    from: "#10b981", to: "#14b8a6", accent: "border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100/80", iconBg: "bg-emerald-50",
  },
  {
    icon: ClipboardList,
    title: "Comprehensive Solutions",
    desc: "Life, health, motor, term plans, retirement and pension plans — all under one roof.",
    from: "#f97316", to: "#f59e0b", accent: "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/80", iconBg: "bg-orange-50",
  },
  {
    icon: HeartHandshake,
    title: "Client-First Approach",
    desc: "Honest, transparent advice with no pressure, no hidden terms — just solutions that genuinely fit your needs.",
    from: "#ec4899", to: "#f43f5e", accent: "border-pink-200 hover:border-pink-300 hover:shadow-pink-100/80", iconBg: "bg-pink-50",
  },
  {
    icon: Clock,
    title: "Long-Term Relationships",
    desc: "Many clients have stayed with us for years — a testament to the trust built through consistent, reliable service.",
    from: "#8b5cf6", to: "#a855f7", accent: "border-violet-200 hover:border-violet-300 hover:shadow-violet-100/80", iconBg: "bg-violet-50",
  },
  {
    icon: LifeBuoy,
    title: "End-to-End Support",
    desc: "From policy selection to claims assistance, we stand by our clients at every step.",
    from: "#0ea5e9", to: "#06b6d4", accent: "border-sky-200 hover:border-sky-300 hover:shadow-sky-100/80", iconBg: "bg-sky-50",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-5">
            NPS Insurance{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed max-w-2xl mx-auto">
            Your Trusted Partner in Insurance, Backed by 35+ Years of Experience.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ animationDelay: `${i * 0.08}s` }}
                  className={`animate-fade-in-up group border-2 rounded-2xl p-6 text-center card-hover ${s.bg}`}>
                  <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-6 h-6 mx-auto ${s.color}`} />
                  </div>
                  <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About NPS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-5">
                A Legacy Built on{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Trust
                </span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                NPS Insurance Solutions is founded and led by Neeraj Pratap Singh, a seasoned insurance professional with over 35 years of dedicated experience in the insurance industry. What began as a personal commitment to helping people protect what matters most has grown into a trusted name synonymous with reliability, integrity, and personalized service.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                With decades spent understanding the evolving needs of individuals, families, and businesses, NPS Insurance Solutions has built a legacy rooted in trust, transparency, and long-term client relationships.
              </p>
              <Link href="/#lead-form" className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                Get Free Quote →
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-10 text-center card-hover">
              <Shield className="w-16 h-16 text-blue-600 mb-5 mx-auto" />
              <p className="text-2xl font-black text-gray-900 mb-2">IRDAI Registered</p>
              <p className="text-gray-500 text-sm mb-1">Web Aggregator License No.</p>
              <p className="text-blue-600 font-bold text-lg">0006012K</p>
              <div className="mt-5 pt-5 border-t border-blue-100 text-xs text-gray-400">
                Regulated by the Insurance Regulatory and Development Authority of India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Neeraj ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Avatar card */}
            <div className="flex flex-col items-center text-center bg-white border-2 border-blue-100 rounded-3xl p-10 card-hover">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl mb-5 shadow-xl shadow-blue-200">
                NPS
              </div>
              <p className="text-2xl font-black text-gray-900 mb-1">Neeraj Pratap Singh</p>
              <p className="text-blue-600 font-semibold text-sm mb-4">Founder &amp; Principal Advisor</p>
              <div className="flex items-center gap-1.5 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-gray-400 text-sm italic">&ldquo;Insurance isn&apos;t just a policy — it&apos;s a promise.&rdquo;</p>
            </div>

            {/* Bio */}
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Leadership</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-5">
                35+ Years of{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dedication
                </span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                With a career spanning more than three and a half decades in the insurance sector, Neeraj Pratap Singh has guided thousands of clients through some of life&apos;s most important financial decisions — from securing their family&apos;s future to safeguarding their assets and investments.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                His deep industry knowledge, combined with a genuine commitment to client welfare, has made him a trusted advisor across generations of policyholders.
              </p>
              <p className="text-gray-500 leading-relaxed">
                His philosophy is simple: insurance isn&apos;t just a policy, it&apos;s a promise — and every recommendation is made with the client&apos;s best interest at heart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              What Makes Us{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Different</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChoose.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={v.title} style={{ animationDelay: `${i * 0.08}s` }}
                  className={`animate-fade-in-up group bg-white border-2 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default ${v.accent}`}>
                  <div className={`w-14 h-14 rounded-2xl ${v.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    <Icon className="w-7 h-7" style={{ color: v.from }} />
                  </div>
                  <div className="h-0.5 w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                    style={{ background: `linear-gradient(to right, ${v.from}, ${v.to})` }} />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Purpose</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Mission &amp;{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vision</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-10 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed">
                To simplify insurance for every individual and family by offering honest guidance, dependable service, and solutions that provide real financial security — building on the trust earned over 35+ years in this industry.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white card-hover">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">Our Vision</h3>
              <p className="text-blue-100 leading-relaxed">
                To be the most trusted insurance advisory name, known for putting people before policies and relationships before transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 lg:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Get Started</p>
            <h2 className="text-4xl font-black mb-3">Ready to protect what matters?</h2>
            <p className="text-blue-100 mb-8 text-lg">Talk to our expert advisor — free, honest guidance with no pressure.</p>
            <Link href="/#lead-form" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors duration-200 inline-block shadow-xl text-lg">
              Get Free Quote →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
