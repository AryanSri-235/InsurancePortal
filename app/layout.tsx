import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InsurancePortal — Compare & Buy Insurance Online",
    template: "%s | InsurancePortal",
  },
  description:
    "Compare term, life, health, and motor insurance from 50+ top insurers. Get the best policy at the lowest premium. 100% free. Trusted by 1 lakh+ Indians.",
  keywords: ["insurance", "term insurance", "health insurance", "car insurance", "compare insurance India"],
  openGraph: {
    siteName: "InsurancePortal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
