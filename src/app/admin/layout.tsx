"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50 dark:bg-[#070A11]">
        {children}
      </div>
    </div>
  );
}
