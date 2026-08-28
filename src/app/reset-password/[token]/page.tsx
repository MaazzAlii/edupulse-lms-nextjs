"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { refresh } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        await refresh();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <span className="font-bold text-xl text-primary">EduPulse</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-muted">
            Enter and confirm your new account password below.
          </p>
        </div>

        {/* Form Container */}
        <div className="card-surface p-6 sm:p-8 space-y-6 border border-border shadow-xl">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-tint text-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Password Reset Complete!
              </h2>
              <p className="text-xs text-muted">
                Your password has been updated. Logging you into your dashboard...
              </p>
              <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{error}</p>
                    {error.includes("expired") || error.includes("invalid") ? (
                      <Link
                        href="/forgot-password"
                        className="text-[11px] underline font-bold block mt-1 text-primary"
                      >
                        Request a new reset link &rarr;
                      </Link>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
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
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>Update Password & Sign In</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
