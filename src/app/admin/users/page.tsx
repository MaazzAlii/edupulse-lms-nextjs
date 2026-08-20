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
  UserPlus,
} from "lucide-react";

export default function AdminUsersPage() {
  const { usersList, switchUser, toggleUserRole, user: currentUser, openAuthModal } = useLMS();

  const [search, setSearch] = useState("");

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
            Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Registered Engineers & Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage platform accounts, student enrollments, and grant instructor/admin privileges.
          </p>
        </div>

        <button
          onClick={() => openAuthModal("signup")}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-2 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
          />
        </div>
        <span className="text-xs text-slate-600 font-semibold">
          {filteredUsers.length} Students Total
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-3">User Profile</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Enrolled Courses</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3 text-right">Switch / Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className={`hover:bg-slate-50/80 transition ${isCurrent ? "bg-brand-50/30" : ""}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">{u.name}</p>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded bg-brand-600 text-white text-[9px] font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.role === "admin"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 font-semibold text-slate-700">
                      {u.enrolledCourseIds.length} Masterclasses
                    </td>

                    <td className="py-4 text-slate-500">{u.createdAt?.slice(0, 10)}</td>

                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isCurrent && (
                          <button
                            onClick={() => switchUser(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                            title="Switch active session to this user"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Login As</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
