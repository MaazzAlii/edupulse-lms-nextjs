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
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    cart,
    notifications,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    toggleUserRole,
    markNotificationAsRead,
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
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:text-slate-100 placeholder-slate-400 transition-all"
            />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link
              href="/courses"
              className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                pathname === "/courses" ? "text-brand-600 dark:text-brand-400 font-semibold" : ""
              }`}
            >
              Explore Courses
            </Link>
            <Link
              href="/my-courses"
              className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                pathname === "/my-courses" ? "text-brand-600 dark:text-brand-400 font-semibold" : ""
              }`}
            >
              My Learning
            </Link>

            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors ${
                  pathname.startsWith("/admin") ? "ring-1 ring-amber-500" : ""
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Studio
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher (Admin / Student Demo) */}
            <button
              onClick={toggleUserRole}
              title="Click to toggle between Admin and Student role for testing"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${user.role === "admin" ? "text-emerald-500" : "text-slate-400"}`} />
              Role: <span className="capitalize font-bold text-brand-600 dark:text-brand-400">{user.role}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border p-3 shadow-2xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-sm">Notifications</span>
                    <span className="text-xs text-brand-500 font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-4 text-slate-400">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`py-2.5 px-2 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition ${
                            notif.status === "unread" ? "bg-brand-50/50 dark:bg-brand-950/30 font-medium" : "text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-brand-500"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border p-3 shadow-2xl z-50">
                  <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <Link
                      href="/my-courses"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <BookOpen className="w-4 h-4 text-brand-500" />
                      My Enrolled Courses ({user.enrolledCourseIds.length})
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm">
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Explore Courses
            </Link>
            <Link
              href="/my-courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              My Learning
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-500 font-semibold"
              >
                Admin Studio
              </Link>
            )}
            <button
              onClick={() => {
                toggleUserRole();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              <span>Current Role: {user.role}</span>
              <span className="text-brand-500">Switch Role</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
