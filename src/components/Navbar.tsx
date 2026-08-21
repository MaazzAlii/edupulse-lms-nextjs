"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, LogOut, LayoutDashboard, Shield, BookOpen, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:bg-primary-dark transition-colors">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary tracking-tight leading-none group-hover:text-primary-dark transition-colors">
                EduPulse
              </span>
              <span className="text-[11px] font-semibold text-gold tracking-widest uppercase mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth / User State */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-200/60 animate-pulse rounded-lg" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-tint text-gold border border-gold/30">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-tint/60 border border-primary/10">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-semibold text-foreground leading-tight max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted capitalize leading-none">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted hover:text-red hover:bg-red-tint rounded-lg transition-colors border border-transparent hover:border-red/20"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:bg-primary-tint/70 rounded-lg transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/20 hover:shadow-md transition-all active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
