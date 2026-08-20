"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLMS } from "@/context/LMSContext";
import {
  BookOpen,
  Search,
  ShoppingCart,
  Sun,
  Moon,
  ShieldCheck,
  User,
  GraduationCap,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  CheckCircle2,
  LogIn,
  LogOut,
  UserPlus,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    notifications,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    toggleUserRole,
    markNotificationAsRead,
    openAuthModal,
    logout,
    quickLoginAs,
  } = useLMS();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/courses");
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-accent-500 to-brand-500 bg-clip-text text-transparent">
                EduPulse
              </span>
              <span className="text-xs ml-1 font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                LMS
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, technologies, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 placeholder-slate-400 transition-all"
            />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link
              href="/courses"
              className={`hover:text-brand-600 transition-colors ${
                pathname === "/courses" ? "text-brand-600 font-bold" : ""
              }`}
            >
              Explore Courses
            </Link>

            <Link
              href="/my-courses"
              className={`hover:text-brand-600 transition-colors ${
                pathname === "/my-courses" ? "text-brand-600 font-bold" : ""
              }`}
            >
              My Learning
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 hover:bg-amber-100 transition-colors ${
                  pathname.startsWith("/admin") ? "ring-2 ring-amber-400" : ""
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Studio
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher (When Logged In) */}
            {user && (
              <button
                onClick={toggleUserRole}
                title="Click to toggle between Admin and Student role for testing"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm transition"
              >
                <ShieldCheck
                  className={`w-3.5 h-3.5 ${
                    user.role === "admin" ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
                Role: <span className="capitalize font-bold text-brand-600">{user.role}</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border p-3 shadow-2xl z-50 bg-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-sm">Notifications</span>
                    <span className="text-xs text-brand-500 font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-4 text-slate-400">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`py-2.5 px-2 text-xs cursor-pointer hover:bg-slate-50 rounded-lg transition ${
                            notif.status === "unread" ? "bg-brand-50/50 font-medium" : "text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-slate-800 font-semibold">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                          </div>
                          <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Sign In & Sign Out */}
            {user ? (
              /* ================= LOGGED IN USER MENU ================= */
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500 transition"
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-500"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border p-3 shadow-2xl z-50 bg-white">
                    {/* Header */}
                    <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            user.role === "admin"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-2 space-y-1 text-xs">
                      <Link
                        href="/my-courses"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold transition"
                      >
                        <BookOpen className="w-4 h-4 text-brand-600" />
                        <span>My Enrolled Courses ({user.enrolledCourseIds.length})</span>
                      </Link>

                      {user.role === "admin" ? (
                        <Link
                          href="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-amber-50 text-amber-700 font-semibold transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          <span>Admin Studio Dashboard</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            toggleUserRole();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-amber-50 text-amber-700 font-semibold transition text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Switch to Admin Studio</span>
                        </button>
                      )}
                    </div>

                    {/* Quick Switch Demo Accounts */}
                    <div className="pt-2 pb-1 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-2 mb-1.5">
                        Switch Demo Account:
                      </p>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            quickLoginAs("student");
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <span>🎓 Student (Maaz Ali)</span>
                        </button>
                        <button
                          onClick={() => {
                            quickLoginAs("admin");
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <span>🛡️ Admin (Alex Rivera)</span>
                        </button>
                      </div>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ================= LOGGED OUT BUTTONS (SIGN IN & SIGN UP) ================= */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal("signin")}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal("signup")}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 transition hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 border border-slate-200 focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm">
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold"
            >
              Explore Courses
            </Link>
            <Link
              href="/my-courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold"
            >
              My Learning
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-700 font-semibold"
              >
                Admin Studio
              </Link>
            )}

            {user ? (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleUserRole();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100"
                >
                  <span>Role: {user.role.toUpperCase()}</span>
                  <span className="text-brand-600 font-bold">Toggle Role</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-rose-50 text-rose-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal("signin");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 font-bold text-xs text-slate-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal("signup");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
