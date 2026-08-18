"use client";

import React, { useState } from "react";
import { useLMS } from "@/context/LMSContext";
import { IUser } from "@/types";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Trash2,
  Mail,
  Calendar,
  BookOpen,
  Search,
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentUser } = useLMS();

  // Local users list for demo
  const [usersList, setUsersList] = useState<IUser[]>([
    {
      id: "user-1",
      name: "Maaz Ali",
      email: "maaz.ali@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "admin",
      enrolledCourseIds: ["course-1", "course-2"],
      completedLessonIds: ["les-1-1", "les-1-2"],
      createdAt: "2025-01-01",
    },
    {
      id: "user-2",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      role: "user",
      enrolledCourseIds: ["course-1"],
      completedLessonIds: ["les-1-1"],
      createdAt: "2025-01-14",
    },
    {
      id: "user-3",
      name: "David Miller",
      email: "david.m@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      role: "user",
      enrolledCourseIds: ["course-2", "course-3"],
      completedLessonIds: [],
      createdAt: "2025-01-28",
    },
    {
      id: "user-4",
      name: "Elena Rostova",
      email: "elena.r@example.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      role: "user",
      enrolledCourseIds: ["course-1"],
      completedLessonIds: ["les-1-1"],
      createdAt: "2025-02-02",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === "admin" ? "user" : "admin" }
          : u
      )
    );
  };

  const deleteUser = (userId: string, name: string) => {
    if (confirm(`Remove account for ${name}?`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
          Access Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Registered Engineers & Roles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage platform accounts, student enrollments, and grant instructor/admin privileges.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 border flex items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {filteredUsers.length} Students Total
        </span>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl p-6 border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">User Profile</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Enrolled Courses</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3 text-right">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {u.name}
                        </p>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === "admin"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                          : "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                    {u.enrolledCourseIds.length} Masterclasses
                  </td>

                  <td className="py-4 text-slate-500">{u.createdAt}</td>

                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleRole(u.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white font-bold text-[11px] transition flex items-center gap-1"
                        title="Toggle role between Admin and User"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Make {u.role === "admin" ? "User" : "Admin"}</span>
                      </button>

                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                        title="Remove user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
