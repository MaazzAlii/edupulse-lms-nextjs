"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Loader2,
  ArrowRight,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldCheck,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface MonthlyMetric {
  month: string;
  count: number;
  revenue: number;
}

interface TopCourseItem {
  _id: string;
  title: string;
  instructor: string;
  price: number;
  enrollmentsCount: number;
  totalRevenue: number;
  isPublished: boolean;
}

interface AnalyticsData {
  totals: {
    totalRevenue: number;
    totalEnrollments: number;
    totalUsers: number;
    totalCourses: number;
  };
  monthlySignups: MonthlyMetric[];
  monthlyEnrollments: MonthlyMetric[];
  topCourses: TopCourseItem[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/analytics", { cache: "no-store" });
        const resData = await res.json();
        if (res.ok && resData.success) {
          setData(resData);
        } else {
          setError(resData.message || "Failed to load analytics");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm font-medium text-muted">
          Compiling business intelligence & revenue analytics...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card-surface p-8 max-w-lg mx-auto text-center border-red/30">
        <p className="text-sm text-red font-medium mb-4">
          {error || "Analytics unavailable"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const { totals, monthlySignups, monthlyEnrollments, topCourses } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-tint text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Executive Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Revenue & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Real-time enrollment volume, revenue trends, student signups, and top performing courses.
          </p>
        </div>
      </div>

      {/* Headline KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            ${totals.totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-muted mt-1">Verified Stripe payouts</p>
        </div>

        {/* Total Paid Enrollments */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Paid Enrollments
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totals.totalEnrollments}
          </div>
          <p className="text-[11px] text-muted mt-1">Unlocked course licenses</p>
        </div>

        {/* Total Users */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totals.totalUsers}
          </div>
          <p className="text-[11px] text-muted mt-1">Registered users</p>
        </div>

        {/* Total Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-tint text-gold flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {totals.totalCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Active courses in catalog</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Monthly Revenue ($)</span>
              </h2>
              <p className="text-xs text-muted">12-month gross revenue trend</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnrollments}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#3D1E6D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly User Signups Chart */}
        <div className="card-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-indigo-400" />
                <span>Monthly Student Signups</span>
              </h2>
              <p className="text-xs text-muted">12-month user registration growth</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySignups}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [value, "Signups"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: "#6366F1", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Selling Courses Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              <span>Top 5 Performing Courses</span>
            </h2>
            <p className="text-xs text-muted">
              Highest grossing and enrolled catalog titles
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Course Title</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Paid Enrollments</th>
                <th className="py-3.5 px-4">Total Revenue</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No paid course enrollments recorded yet.
                  </td>
                </tr>
              ) : (
                topCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-primary-tint/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-muted">{c.instructor}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-foreground">
                      {c.enrollmentsCount}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${c.totalRevenue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/courses`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
