"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  growth: string;
  isPositive?: boolean;
  colorTheme?: "brand" | "emerald" | "amber" | "purple";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  growth,
  isPositive = true,
  colorTheme = "brand",
}) => {
  const themeColors = {
    brand: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="glass-card rounded-2xl p-5 border flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${themeColors[colorTheme]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span className={isPositive ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
            {growth}
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};
