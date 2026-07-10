"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tweet = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener");
  };

  const linkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-gray-500">Share this article:</span>
      <button
        onClick={tweet}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
      >
        <XIcon />
        Twitter / X
      </button>
      <button
        onClick={linkedin}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
      >
        <LinkedinIcon />
        LinkedIn
      </button>
      <button
        onClick={copy}
        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${copied ? "bg-green-100 text-green-700" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
