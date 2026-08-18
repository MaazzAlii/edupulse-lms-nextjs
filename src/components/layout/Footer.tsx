"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Heart, Github, Twitter, Linkedin, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                EduPulse LMS
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Industrial-grade Learning Management System powered by Next.js 14, TypeScript, Stripe, and Redis. Accelerate your engineering career today.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/MaazzAlii/edupulse-lms-nextjs"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:scale-105 transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:scale-105 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:scale-105 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/courses" className="hover:text-brand-500 transition">All Courses</Link>
              </li>
              <li>
                <Link href="/courses?category=Web+Development" className="hover:text-brand-500 transition">Web Development</Link>
              </li>
              <li>
                <Link href="/courses?category=Artificial+Intelligence" className="hover:text-brand-500 transition">Artificial Intelligence</Link>
              </li>
              <li>
                <Link href="/courses?category=Cloud+%26+DevOps" className="hover:text-brand-500 transition">Cloud & DevOps</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/my-courses" className="hover:text-brand-500 transition">My Learning</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-500 transition">Instructor Studio</Link>
              </li>
              <li>
                <Link href="/admin/courses" className="hover:text-brand-500 transition">Course Builder</Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-brand-500 transition">Revenue Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Get notified when new engineering courses drop.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button className="px-3 py-2 text-xs font-bold rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EduPulse LMS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with Next.js 14, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
