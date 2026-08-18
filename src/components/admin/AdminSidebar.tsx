"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookPlus,
  Users,
  BarChart3,
  GraduationCap,
  Layers,
  Settings,
  ArrowLeft,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Courses",
      href: "/admin/courses",
      icon: BookPlus,
    },
    {
      label: "Students & Roles",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Sales & Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Admin Badge */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
          <div className="flex items-center gap-2 font-bold text-xs">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>Instructor Studio</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1">
            Course creation, revenue, & platform control
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom return link */}
      <div className="pt-4 border-t border-slate-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-500 transition px-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Main Site
        </Link>
      </div>
    </aside>
  );
};
