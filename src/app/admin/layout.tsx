"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Users,
  MessageSquare,
  ArrowLeft,
  GraduationCap,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">
            Verifying administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      exact: false,
    },
    {
      label: "Q&A Discussions",
      href: "/admin/questions",
      icon: MessageSquare,
      exact: false,
    },
  ];

  const isNavActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border md:min-h-screen flex flex-col shrink-0">
        {/* Admin Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground tracking-tight leading-tight">
                Admin Portal
              </h2>
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                EduPulse Core
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-gold" : "text-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="px-3 py-2 rounded-xl bg-primary-tint/40 border border-primary/10 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gold font-semibold uppercase">
                Administrator
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-primary hover:bg-primary-tint/60 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Storefront
            </span>
            <ExternalLink className="w-3 h-3 text-muted" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
