"use client";

import { useState } from "react";

interface CalculatorWidgetProps {
  category: string;
}

// --- TERM ---
const TERM_BASE: Record<string, [number, number]> = {
  "25L": [190, 220],
  "50L": [350, 420],
  "1Cr": [600, 750],
  "2Cr": [1100, 1400],
  "5Cr": [2400, 3200],
};

function termPremium(age: number, cover: string, smoker: boolean): [number, number] {
  const base = TERM_BASE[cover] ?? [0, 0];
  let [min, max] = base;
  if (age >= 31 && age <= 40) { min = Math.round(min * 1.3); max = Math.round(max * 1.3); }
  else if (age >= 41 && age <= 50) { min = Math.round(min * 1.8); max = Math.round(max * 1.8); }
  else if (age > 50) { min = Math.round(min * 2.2); max = Math.round(max * 2.2); }
  if (smoker) { min = Math.round(min * 1.6); max = Math.round(max * 1.6); }
  return [min, max];
}

// --- HEALTH ---
const HEALTH_BASE: Record<string, [number, number]> = {
  "3L": [5500, 7000],
  "5L": [7500, 9500],
  "10L": [11000, 14000],
  "15L": [14000, 18000],
  "25L": [19000, 24000],
};

function healthPremium(planType: string, members: number, cover: string, oldestAge: number): [number, number] {
  let [min, max] = HEALTH_BASE[cover] ?? [0, 0];
  // Scale by members
  const memberMult = planType === "Family Floater" ? 1 + (members - 1) * 0.3 : members;
  min = Math.round(min * memberMult);
  max = Math.round(max * memberMult);
  // Age adjustment
  if (oldestAge >= 45 && oldestAge < 55) { min = Math.round(min * 1.4); max = Math.round(max * 1.4); }
  else if (oldestAge >= 55) { min = Math.round(min * 2.0); max = Math.round(max * 2.0); }
  if (planType === "Senior") { min = Math.round(min * 1.8); max = Math.round(max * 1.8); }
  // Convert annual to monthly
  return [Math.round(min / 12), Math.round(max / 12)];
}

// --- MOTOR ---
function motorPremium(vehicleType: string, vehicleAge: string, idv: string, plan: string): [number, number] {
  if (plan === "Third-Party") {
    const annual = vehicleType === "Bike" ? 714 : 2094;
    return [Math.round(annual / 12), Math.round(annual / 12)];
  }
  // Comprehensive: IDV × (2-4%)
  const idvMidpoints: Record<string, number> = {
    "₹1-5L": 300000,
    "₹5-10L": 750000,
    "₹10L+": 1200000,
  };
  const idvVal = idvMidpoints[idv] ?? 300000;
  let rateMin = 0.02;
  let rateMax = 0.04;
  if (vehicleAge === "6-10") { rateMin = 0.015; rateMax = 0.025; }
  else if (vehicleAge === "10+") { rateMin = 0.01; rateMax = 0.02; }
  if (vehicleType === "Bike") { rateMin *= 0.5; rateMax *= 0.5; }
  const annual_min = Math.round(idvVal * rateMin);
  const annual_max = Math.round(idvVal * rateMax);
  return [Math.round(annual_min / 12), Math.round(annual_max / 12)];
}

// --- LIFE ---
function lifePremium(planType: string, age: number, annualBudget: string, payingTerm: number): { premRange: [number, number]; maturity: [number, number]; sumAssured: number } {
  const budgetMap: Record<string, number> = { "₹25K": 25000, "₹50K": 50000, "₹1L": 100000, "₹2L+": 200000 };
  const budget = budgetMap[annualBudget] ?? 25000;
  const totalPaid = budget * payingTerm;

  let saMultiplier = 10;
  if (planType === "Endowment") saMultiplier = 10;
  else if (planType === "Whole Life") saMultiplier = 15;
  else if (planType === "Money-Back") saMultiplier = 8;
  else if (planType === "ULIP") saMultiplier = 10;

  const sumAssured = budget * saMultiplier;

  let matMin = 0;
  let matMax = 0;
  if (planType === "ULIP") {
    // Conservative 8%, Moderate 12% CAGR on invested premium
    const invested = totalPaid * 0.85; // ~15% charges
    matMin = Math.round(invested * Math.pow(1.08, payingTerm));
    matMax = Math.round(invested * Math.pow(1.12, payingTerm));
  } else if (planType === "Endowment") {
    matMin = Math.round(totalPaid * 1.3);
    matMax = Math.round(totalPaid * 1.6);
  } else if (planType === "Money-Back") {
    matMin = Math.round(totalPaid * 1.2);
    matMax = Math.round(totalPaid * 1.4);
  } else {
    // Whole Life — no maturity, protection focused
    matMin = sumAssured;
    matMax = sumAssured;
  }

  const monthlyMin = Math.round(budget / 12);
  const monthlyMax = Math.round((budget * 1.1) / 12);
  return { premRange: [monthlyMin, monthlyMax], maturity: [matMin, matMax], sumAssured };
}

function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// ---- Sub-components ----

function TermCalculator() {
  const [age, setAge] = useState(30);
  const [cover, setCover] = useState("1Cr");
  const [term, setTerm] = useState(20);
  const [smoker, setSmoker] = useState(false);

  const [min, max] = termPremium(age, cover, smoker);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Age: <span className="text-blue-600">{age} years</span>
        </label>
        <input
          type="range"
          min={18}
          max={60}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>18</span><span>60</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Amount</label>
        <select
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {["25L", "50L", "1Cr", "2Cr", "5Cr"].map((c) => (
            <option key={c} value={c}>{c === "25L" ? "₹25 Lakh" : c === "50L" ? "₹50 Lakh" : c === "1Cr" ? "₹1 Crore" : c === "2Cr" ? "₹2 Crore" : "₹5 Crore"}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Term</label>
        <div className="flex gap-3">
          {[10, 20, 30, 40].map((t) => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${term === t ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {t} yr
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Smoker?</label>
        <div className="flex gap-3">
          {[false, true].map((val) => (
            <button
              key={String(val)}
              onClick={() => setSmoker(val)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${smoker === val ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <ResultBox min={min} max={max} unit="month" />
    </div>
  );
}

function HealthCalculator() {
  const [planType, setPlanType] = useState("Individual");
  const [members, setMembers] = useState(1);
  const [cover, setCover] = useState("5L");
  const [oldestAge, setOldestAge] = useState(30);

  const [min, max] = healthPremium(planType, members, cover, oldestAge);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
        <div className="flex gap-2">
          {["Individual", "Family Floater", "Senior"].map((p) => (
            <button
              key={p}
              onClick={() => setPlanType(p)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${planType === p ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Members</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMembers(Math.max(1, members - 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-gray-600 text-lg font-bold hover:border-blue-400 hover:text-blue-600 transition-all"
          >−</button>
          <span className="text-2xl font-bold text-blue-600 w-8 text-center">{members}</span>
          <button
            onClick={() => setMembers(Math.min(6, members + 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-gray-600 text-lg font-bold hover:border-blue-400 hover:text-blue-600 transition-all"
          >+</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sum Insured</label>
        <select
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {[["3L", "₹3 Lakh"], ["5L", "₹5 Lakh"], ["10L", "₹10 Lakh"], ["15L", "₹15 Lakh"], ["25L", "₹25 Lakh"]].map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Age of Oldest Member: <span className="text-blue-600">{oldestAge} years</span>
        </label>
        <input
          type="number"
          min={18}
          max={80}
          value={oldestAge}
          onChange={(e) => setOldestAge(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <ResultBox min={min} max={max} unit="month" />
    </div>
  );
}

function MotorCalculator() {
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleAge, setVehicleAge] = useState("0-1");
  const [idv, setIdv] = useState("₹1-5L");
  const [plan, setPlan] = useState("Comprehensive");

  const [min, max] = motorPremium(vehicleType, vehicleAge, idv, plan);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
        <div className="flex gap-3">
          {["Car", "Bike"].map((v) => (
            <button
              key={v}
              onClick={() => setVehicleType(v)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${vehicleType === v ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {v === "Car" ? "🚗 Car" : "🏍 Bike"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Age</label>
        <div className="flex gap-2">
          {[["0-1", "0–1 yr"], ["2-5", "2–5 yr"], ["6-10", "6–10 yr"], ["10+", "10+ yr"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setVehicleAge(val)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${vehicleAge === val ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">IDV Estimate</label>
        <select
          value={idv}
          onChange={(e) => setIdv(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {["₹1-5L", "₹5-10L", "₹10L+"].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
        <div className="flex gap-3">
          {["Third-Party", "Comprehensive"].map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${plan === p ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResultBox
        min={min}
        max={max}
        unit="month"
        note={plan === "Third-Party" ? "Third-party premium is fixed by IRDAI regulation." : undefined}
      />
    </div>
  );
}

function LifeCalculator() {
  const [planType, setPlanType] = useState("Endowment");
  const [age, setAge] = useState(30);
  const [budget, setBudget] = useState("₹50K");
  const [payingTerm, setPayingTerm] = useState(15);

  const { premRange, maturity, sumAssured } = lifePremium(planType, age, budget, payingTerm);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
        <div className="grid grid-cols-2 gap-2">
          {["ULIP", "Endowment", "Whole Life", "Money-Back"].map((p) => (
            <button
              key={p}
              onClick={() => setPlanType(p)}
              className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${planType === p ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Age: <span className="text-blue-600">{age} years</span>
        </label>
        <input
          type="range"
          min={18}
          max={55}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>18</span><span>55</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Premium Budget</label>
        <div className="flex gap-2">
          {["₹25K", "₹50K", "₹1L", "₹2L+"].map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${budget === b ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Paying Term</label>
        <div className="flex gap-3">
          {[10, 15, 20].map((t) => (
            <button
              key={t}
              onClick={() => setPayingTerm(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${payingTerm === t ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              {t} yr
            </button>
          ))}
        </div>
      </div>

      {/* Life result box — custom */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white space-y-2">
        <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Estimated Premium</p>
        <p className="text-2xl font-bold">
          ₹{premRange[0].toLocaleString("en-IN")}–₹{premRange[1].toLocaleString("en-IN")} / month
        </p>
        <div className="border-t border-blue-500 pt-3 mt-1 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">Sum Assured</span>
            <span className="font-semibold">{formatINR(sumAssured)}</span>
          </div>
          {planType !== "Whole Life" && (
            <div className="flex justify-between text-sm">
              <span className="text-blue-200">
                {planType === "ULIP" ? "Est. Maturity (Conservative–Moderate)" : "Est. Maturity"}
              </span>
              <span className="font-semibold">{formatINR(maturity[0])}–{formatINR(maturity[1])}</span>
            </div>
          )}
          {planType === "Whole Life" && (
            <p className="text-blue-200 text-xs">Whole Life provides lifelong protection — maturity paid on death/surrender.</p>
          )}
        </div>
        <p className="text-xs text-blue-200 pt-1">
          Actual premium depends on health declaration.{" "}
          <a href="/#lead-form" className="underline font-semibold text-white hover:text-blue-100">
            Get exact quote →
          </a>
        </p>
      </div>
    </div>
  );
}

function ResultBox({ min, max, unit, note }: { min: number; max: number; unit: string; note?: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white">
      <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Estimated Premium</p>
      <p className="text-2xl font-bold">
        ₹{min.toLocaleString("en-IN")}–₹{max.toLocaleString("en-IN")} / {unit}
      </p>
      {note && <p className="text-blue-200 text-xs mt-2">{note}</p>}
      <p className="text-xs text-blue-200 mt-2">
        Actual premium depends on health declaration.{" "}
        <a href="/#lead-form" className="underline font-semibold text-white hover:text-blue-100">
          Get exact quote →
        </a>
      </p>
    </div>
  );
}

// ---- Main Component ----

const CATEGORY_LABELS: Record<string, string> = {
  term: "Term",
  health: "Health",
  motor: "Motor",
  life: "Life",
};

export default function CalculatorWidget({ category }: CalculatorWidgetProps) {
  const cat = category.toLowerCase();
  const label = CATEGORY_LABELS[cat] ?? category;

  const renderCalculator = () => {
    switch (cat) {
      case "term":   return <TermCalculator />;
      case "health": return <HealthCalculator />;
      case "motor":  return <MotorCalculator />;
      case "life":   return <LifeCalculator />;
      default:       return <p className="text-gray-500 text-center py-8">Calculator not available for this category.</p>;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Free Calculator
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Quick Premium Estimate
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Get an instant ballpark for your {label} Insurance premium — no sign-up needed.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-8">
          {renderCalculator()}

          {/* Open full calculator link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a
              href={`/calculator?type=${cat}`}
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
            >
              Open Full Calculator
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
