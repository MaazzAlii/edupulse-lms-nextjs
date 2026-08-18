import type { Metadata } from "next";
import "./globals.css";
import { LMSProvider } from "@/context/LMSContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen">
        <LMSProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LMSProvider>
      </body>
    </html>
  );
}
