"use client";

import { useState } from "react";
import { Provider } from "@prisma/client";

interface ProviderNetworkSearchProps {
  provider: Provider;
  category: string;
}

const CITIES_HEALTH = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Chandigarh",
];

const CITY_COUNTS: Record<string, number> = {
  "Delhi NCR": 320,
  Mumbai: 280,
  Bangalore: 210,
  Chennai: 190,
  Hyderabad: 175,
  Pune: 160,
  Kolkata: 150,
  Ahmedabad: 130,
  Jaipur: 110,
  Surat: 95,
  Lucknow: 90,
  Chandigarh: 80,
};

export default function ProviderNetworkSearch({
  provider,
  category,
}: ProviderNetworkSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (category !== "health" && category !== "motor") {
    return null;
  }

  const isHealth = category === "health";
  const networkLabel = isHealth ? "hospitals" : "garages";
  const headingLabel = isHealth ? "Hospitals" : "Garages";

  const filteredCities = CITIES_HEALTH.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Network {headingLabel}
        </h2>
        <p className="text-gray-500 mb-6">
          {provider.name} has{" "}
          {provider.networkHospitals?.toLocaleString("en-IN") ?? "4,000"}+
          cashless {networkLabel} across India
        </p>

        {/* Search Bar */}
        <div className="flex gap-3 max-w-lg mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or PIN code"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
            Search
          </button>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {filteredCities.map((city) => (
            <div
              key={city}
              className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 hover:border-blue-200 hover:bg-blue-50 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <p className="font-semibold text-gray-800 text-sm">{city}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {CITY_COUNTS[city]}+ {networkLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Note and CTA */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-400 italic">
            Actual hospital/garage count may vary. Call 1800-XXX-XXXX to
            confirm.
          </p>
          {isHealth && (
            <a
              href="#"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              View Full Hospital Network &rarr;
            </a>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="mt-6 bg-gray-100 border-2 border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center gap-2">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-gray-400 text-sm">Interactive map coming soon</span>
        </div>
      </div>
    </section>
  );
}
