"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { StatCard } from "@/components/admin/StatCard";
import { CourseFormModal } from "@/components/admin/CourseFormModal";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { courses, orders, user } = useLMS();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.amount, 0) + 128400; // Simulated past baseline
  const totalStudents = 1420 + orders.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
            Management Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Instructor Studio & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, {user.name}. Here is your platform summary and active enrollments.
          </p>
        </div>

        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value={formatPrice(totalRevenue)}
          growth="+18.4%"
          icon={DollarSign}
          colorTheme="emerald"
        />
        <StatCard
          title="Enrolled Engineers"
          value={totalStudents.toLocaleString()}
          growth="+24.2%"
          icon={Users}
          colorTheme="brand"
        />
        <StatCard
          title="Active Masterclasses"
          value={courses.length}
          growth="+2 new"
          icon={BookOpen}
          colorTheme="purple"
        />
        <StatCard
          title="Completed Orders"
          value={orders.length + 842}
          growth="+12.5%"
          icon={ShoppingBag}
          colorTheme="amber"
        />
      </div>

      {/* Visual Analytics Chart Simulation & Course Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                12-Month Sales & Revenue Growth
              </h3>
              <p className="text-xs text-slate-400">
                Monthly gross breakdown from Stripe & Card checkouts
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              +32% YoY
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
            {[
              { month: "Mar", val: 45 },
              { month: "Apr", val: 52 },
              { month: "May", val: 68 },
              { month: "Jun", val: 74 },
              { month: "Jul", val: 60 },
              { month: "Aug", val: 82 },
              { month: "Sep", val: 95 },
              { month: "Oct", val: 88 },
              { month: "Nov", val: 110 },
              { month: "Dec", val: 135 },
              { month: "Jan", val: 120 },
              { month: "Feb", val: 145 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center h-36">
                  <div
                    style={{ height: `${(bar.val / 150) * 100}%` }}
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-brand-600 to-accent-500 group-hover:from-brand-500 group-hover:to-accent-400 transition-all duration-300 shadow-sm"
                    title={`$${bar.val * 1000}`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average monthly volume: <strong>$14,200</strong></span>
            <span>Peak Month: <strong>Feb ($145k)</strong></span>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-6 border space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Top Performing Courses
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-3">
            {courses.slice(0, 3).map((course, idx) => (
              <div key={course.id} className="pt-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-brand-500 text-xs">#{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {course.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {course.purchasedCount} students • {formatPrice(course.price)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-emerald-500 shrink-0">
                  {formatPrice(course.price * course.purchasedCount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card rounded-3xl p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Recent Enrolled Orders
          </h3>
          <Link
            href="/admin/analytics"
            className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
          >
            View Full Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Student</th>
                <th className="pb-3">Course</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-500">{ord.id}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                    {ord.userName}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {ord.courseTitle}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {formatPrice(ord.amount)}
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Builder Modal */}
      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </div>
  );
}
