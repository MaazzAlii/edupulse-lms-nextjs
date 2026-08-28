"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password submit error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <span className="font-bold text-xl text-primary">EduPulse</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-xs text-muted">
            Enter your account email address and we&apos;ll send you a password reset link.
          </p>
        </div>

        {/* Form Container */}
        <div className="card-surface p-6 sm:p-8 space-y-6 border border-border shadow-xl">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-tint text-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Reset Link Sent
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, you will receive an email with instructions to reset your password shortly. Check your spam folder if it doesn&apos;t arrive in 2 minutes.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Password Reset Link</span>
              </button>
            </form>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Remember your password? Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
