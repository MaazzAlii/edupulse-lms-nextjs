"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  BookOpen,
  Calendar,
  CreditCard,
  User as UserIcon,
} from "lucide-react";

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  isActive: boolean;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EnrollmentDetail {
  _id: string;
  course?: {
    _id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string;
    price: number;
  };
  amount: number;
  paymentStatus: "Pending" | "Paid";
  enrolledAt: string;
}

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [keyword, setKeyword] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Action / Confirmation Modal states
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [actionType, setActionType] = useState<"role" | "suspend" | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // User Detail / Enrollment History Modal states
  const [detailUser, setDetailUser] = useState<UserRecord | null>(null);
  const [detailEnrollments, setDetailEnrollments] = useState<EnrollmentDetail[]>([]);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (keyword.trim()) params.set("keyword", keyword.trim());
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(data.users);
        setTotal(data.total);
        setPages(data.pages);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Open User Detail Modal
  const openDetailModal = async (u: UserRecord) => {
    setDetailUser(u);
    setDetailEnrollments([]);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${u._id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDetailEnrollments(data.enrollments || []);
      }
    } catch (e) {
      console.error("Failed to load user enrollment history", e);
    } finally {
      setDetailLoading(false);
    }
  };

  // Trigger Role or Suspend action API
  const handleExecuteAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      setActionLoading(true);
      setActionError(null);

      const updatePayload: { role?: string; isActive?: boolean } = {};

      if (actionType === "role") {
        updatePayload.role = selectedUser.role === "admin" ? "student" : "admin";
      } else if (actionType === "suspend") {
        updatePayload.isActive = !selectedUser.isActive;
      }

      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Failed to update user");
        return;
      }

      // Success
      setSelectedUser(null);
      setActionType(null);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || "An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            User Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            User Accounts & Roles
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Search users, manage system roles, monitor course enrollments, and manage account statuses.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Enrollments</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No user accounts match your search filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrentAdminSelf = currentAdmin?._id.toString() === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-primary-tint/20 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">
                              {u.name}{" "}
                              {isCurrentAdminSelf && (
                                <span className="text-[10px] text-gold font-bold bg-gold-tint px-1.5 py-0.5 rounded border border-gold/30">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-muted text-[11px] block">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-tint text-primary border border-primary/20">
                            <UserIcon className="w-3 h-3" />
                            Student
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-tint text-red border border-red/30">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Enrollment Count */}
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {u.enrollmentCount} {u.enrollmentCount === 1 ? "course" : "courses"}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-muted">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Enrollments Detail */}
                          <button
                            onClick={() => openDetailModal(u)}
                            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                            title="View Enrollment History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Role Change Button */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("role");
                              setActionError(null);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.role === "admin"
                                ? "text-gold hover:bg-gold-tint"
                                : "text-muted hover:text-primary hover:bg-primary-tint"
                            }`}
                            title={u.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                          >
                            <Shield className="w-4 h-4" />
                          </button>

                          {/* Suspend / Reactivate Button */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("suspend");
                              setActionError(null);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.isActive
                                ? "text-muted hover:text-red hover:bg-red-tint"
                                : "text-green hover:bg-green-tint"
                            }`}
                            title={u.isActive ? "Suspend Account" : "Reactivate Account"}
                          >
                            {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted">
          <span>
            Showing {users.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
            {Math.min(page * 10, total)} of {total} users
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2 rounded-xl bg-background border border-border disabled:opacity-40 hover:bg-black/5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-foreground">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages || loading}
              className="p-2 rounded-xl bg-background border border-border disabled:opacity-40 hover:bg-black/5 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Action Modal (Role Change or Suspend) */}
      {selectedUser && actionType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {actionType === "role" ? (
                  <>
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <span>Change System Role</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>{selectedUser.isActive ? "Suspend User Account" : "Reactivate User Account"}</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <p className="text-sm text-slate-300 leading-relaxed">
              {actionType === "role" ? (
                <>
                  Are you sure you want to change{" "}
                  <strong className="text-white">{selectedUser.name}</strong>&apos;s role from{" "}
                  <strong className="uppercase text-indigo-400">{selectedUser.role}</strong> to{" "}
                  <strong className="uppercase text-indigo-400">
                    {selectedUser.role === "admin" ? "student" : "admin"}
                  </strong>
                  ?
                </>
              ) : (
                <>
                  Are you sure you want to{" "}
                  <strong className={selectedUser.isActive ? "text-amber-400" : "text-emerald-400"}>
                    {selectedUser.isActive ? "suspend" : "reactivate"}
                  </strong>{" "}
                  <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})?
                  {selectedUser.isActive && (
                    <span className="block mt-2 text-xs text-slate-400">
                      Suspended users immediately lose access to API routes and cannot log in.
                    </span>
                  )}
                </>
              )}
            </p>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setActionType(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md transition ${
                  actionType === "suspend" && selectedUser.isActive
                    ? "bg-red-600 hover:bg-red-500 shadow-red-600/20"
                    : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                }`}
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Change</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Enrollment History Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-400" />
                  <span>{detailUser.name}</span>
                </h3>
                <p className="text-xs text-slate-400">{detailUser.email}</p>
              </div>
              <button
                onClick={() => setDetailUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Enrollment History ({detailEnrollments.length})</span>
              </h4>

              {detailLoading ? (
                <div className="py-8 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Loading enrollment history...</span>
                </div>
              ) : detailEnrollments.length === 0 ? (
                <div className="p-6 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400">
                  This user has not enrolled in any courses yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {detailEnrollments.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">
                          {item.course?.title || "Unknown Course"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Enrolled on{" "}
                          {new Date(item.enrolledAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-200">
                          {item.amount === 0 ? "Free" : `$${item.amount.toFixed(2)}`}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setDetailUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
