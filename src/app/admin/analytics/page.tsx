"use client";

import React from "react";
import { useLMS } from "@/context/LMSContext";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  CreditCard,
  PieChart,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { courses, orders } = useLMS();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
          Financial & Growth Insights
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Revenue & Enrollment Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed breakdown of checkout conversions, category distribution, and revenue streams.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Average Order Value (AOV)"
          value="$89.50"
          growth="+8.2%"
          icon={DollarSign}
          colorTheme="brand"
        />
        <StatCard
          title="Checkout Conversion Rate"
          value="4.85%"
          growth="+1.2%"
          icon={TrendingUp}
          colorTheme="emerald"
        />
        <StatCard
          title="Course Completion Rate"
          value="78.4%"
          growth="+5.1%"
          icon={Award}
          colorTheme="purple"
        />
      </div>

      {/* Category Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Category Revenue Share
          </h3>
          <div className="space-y-4 pt-2">
            {[
              { cat: "Web Development", percent: 45, color: "bg-blue-600", rev: "$58,200" },
              { cat: "Artificial Intelligence", percent: 30, color: "bg-purple-600", rev: "$38,800" },
              { cat: "Cloud & DevOps", percent: 15, color: "bg-cyan-600", rev: "$19,400" },
              { cat: "UI/UX Design", percent: 10, color: "bg-pink-600", rev: "$12,900" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">{item.cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{item.rev}</span>
                    <span className="font-bold text-slate-900">{item.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Gateways Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Payment Method Split
          </h3>
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Stripe / Cards</h4>
                  <p className="text-[10px] text-slate-500">Direct Visa, Mastercard, AMEX</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-emerald-700">82% Volume</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">PayPal</h4>
                  <p className="text-[10px] text-slate-500">One-click instant PayPal balance</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-blue-700">18% Volume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
