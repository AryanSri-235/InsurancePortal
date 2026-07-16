"use client";

import Link from "next/link";
import { Copy, Share2 } from "lucide-react";

interface Props {
  policyName: string;
  category: string;
  policyId: number;
  brochureUrl?: string | null;
}

export default function PolicySidebar({ policyName, category, policyId, brochureUrl }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-600 text-white rounded-2xl p-5 sticky top-20 text-center">
        <h3 className="font-bold text-base mb-1">Get a Free Quote</h3>
        <p className="text-blue-100 text-xs mb-4">for {policyName}</p>
        <Link
          href="/"
          className="block w-full bg-white text-blue-600 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md text-center"
        >
          Get Free Quote →
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1 w-full text-left">
          <Copy className="w-4 h-4" />
          Add to Compare
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1 w-full text-left">
          <Share2 className="w-4 h-4" />
          Share Plan
        </button>
      </div>
    </div>
  );
}
