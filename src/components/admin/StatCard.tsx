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
    brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <div className="glass-card rounded-2xl p-5 border flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
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
