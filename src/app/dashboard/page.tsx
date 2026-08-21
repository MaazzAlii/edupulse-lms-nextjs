"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  User,
  Mail,
  Shield,
  Key,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  LogOut,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 card-surface p-8 max-w-sm text-center shadow-lg">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              Verifying Authentication
            </h2>
            <p className="text-xs text-muted mt-1">
              Checking HTTP-Only cookie session tokens...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-tint text-green text-xs font-semibold mb-2 border border-green/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Protected Route Access Granted</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            User Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">
            Welcome back, <span className="font-semibold text-primary">{user.name}</span>! Your session is verified.
          </p>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red/30 bg-red-tint text-red font-semibold text-xs hover:bg-red hover:text-white transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="card-surface p-6 md:col-span-2 shadow-md">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-md shadow-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === "admin"
                      ? "bg-gold-tint text-gold border border-gold/40"
                      : "bg-primary-tint text-primary border border-primary/30"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {user.role.toUpperCase()}
                </span>
                <span className="text-[11px] text-muted font-mono">
                  ID: {user._id}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Account Attributes & Security Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Full Name
                </div>
                <div className="text-sm font-bold text-foreground mt-1">
                  {user.name}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Email Address
                </div>
                <div className="text-sm font-bold text-foreground mt-1 truncate">
                  {user.email}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  Assigned Role
                </div>
                <div className="text-sm font-bold text-foreground capitalize mt-1">
                  {user.role}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-green" />
                  Auth Method
                </div>
                <div className="text-sm font-bold text-foreground mt-1">
                  HTTP-Only JWT Cookie
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Foundation Status Sidebar */}
        <div className="space-y-6">
          <div className="card-surface p-6 shadow-md bg-gradient-to-br from-primary-tint/60 to-surface">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Foundation Verified</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Your session cookie is active, validated, and state is preserved across page refreshes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Mongoose Connection:</span>
                <span className="font-semibold text-green">Connected</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Auth Cookie:</span>
                <span className="font-semibold text-green font-mono">lms_token</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Next Part:</span>
                <span className="font-semibold text-primary">Part 2: Courses</span>
              </div>
            </div>
          </div>

          <div className="card-surface p-6 shadow-md">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-3">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>Enrolled Courses</span>
            </div>
            <p className="text-xs text-muted mb-4">
              Course catalog and enrollment features will become active in Part 2 and Part 4.
            </p>
            <div className="p-4 rounded-xl border border-dashed border-border text-center bg-background/50">
              <span className="text-xs text-muted">No enrollments yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
