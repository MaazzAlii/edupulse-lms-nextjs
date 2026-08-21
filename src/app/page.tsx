import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  Database,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Part 1: Full-Stack Foundation Ready</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
            Next.js 15 LMS{" "}
            <span className="text-primary underline decoration-gold/40 decoration-4 underline-offset-8">
              Foundation
            </span>{" "}
            & Auth Engine
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Welcome to the base architectural layer of EduPulse LMS. Built with
            Next.js 15 App Router, MongoDB Mongoose, secure HTTP-Only JWT cookies,
            and role-aware navigation.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark shadow-md shadow-primary/25 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-primary bg-surface hover:bg-primary-tint/50 border border-border shadow-sm hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <KeyRound className="w-4 h-4 text-gold" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-muted hover:text-foreground bg-surface hover:bg-black/5 border border-border transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4 text-primary" />
              <span>Test Protected Route</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-12 bg-surface/60 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              What We Built in Part 1
            </h2>
            <p className="text-sm text-muted mt-2">
              All 5 Mongoose schemas, token infrastructure, and auth flows are active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card-surface p-6 card-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-tint text-primary flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Secure JWT & Cookies
              </h3>
              <p className="text-sm text-muted mb-4">
                HttpOnly, SameSite cookie authentication protecting credentials
                against XSS and unauthorized access across server & client.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Bcrypt 10 rounds password hashing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Stateless signed JWT verification
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="card-surface p-6 card-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-gold-tint text-gold flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                5 Mongoose Schemas
              </h3>
              <p className="text-sm text-muted mb-4">
                Full database model layer initialized: User, Category, Course,
                Lesson, and unique compound-indexed Enrollment.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Global cached DB connection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Hot-reload resilient model exports
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="card-surface p-6 card-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-tint text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Protected Dashboard
              </h3>
              <p className="text-sm text-muted mb-4">
                Client & Server auth guards verifying sessions before rendering
                protected views and preventing layout shift.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Seamless automatic redirect to /login
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green" />
                  Live session state in React Context
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <footer className="py-8 text-center text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EduPulse LMS. Part 1 — Foundation Completed.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-green font-medium">
              <span className="w-2 h-2 rounded-full bg-green animate-ping" />
              API Routes Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
