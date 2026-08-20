"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useLMS } from "@/context/LMSContext";
import { ShieldCheck, LogIn, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, quickLoginAs, openAuthModal, toggleUserRole } = useLMS();

  // If visitor is logged out or not an admin, show a friendly access helper
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Admin Studio Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {user
              ? `You are currently logged in as a Student (${user.name}). Switch to Admin mode or sign in as Admin to access Course CRUD, revenue charts, and user management.`
              : "Sign in with Admin credentials or use the 1-click Demo Admin login to access course authoring, user roles, and sales analytics."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <button
              onClick={toggleUserRole}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to Admin Mode</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => quickLoginAs("admin")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>1-Click Sign In as Admin</span>
              </button>
              <button
                onClick={() => openAuthModal("signin")}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Sign In with Email
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50">
        {children}
      </div>
    </div>
  );
}
