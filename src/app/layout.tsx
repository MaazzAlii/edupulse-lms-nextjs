import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LMSProvider } from "@/context/LMSContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduPulse LMS — Industrial Next.js 14 Learning Platform",
  description:
    "Full-Stack Learning Management System built with Next.js 14, TypeScript, Tailwind CSS, Stripe Payments, and Redis session caching.",
  keywords: [
    "LMS",
    "Next.js",
    "TypeScript",
    "Online Courses",
    "Web Development",
    "Full Stack",
    "Stripe",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900 antialiased selection:bg-brand-600 selection:text-white">
        <LMSProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LMSProvider>
      </body>
    </html>
  );
}
