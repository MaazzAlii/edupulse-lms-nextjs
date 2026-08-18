"use client";

import React from "react";
import { Category, CourseLevel } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface CourseFilterProps {
  categories: (Category | "All")[];
  selectedCategory: Category | "All";
  onSelectCategory: (cat: Category | "All") => void;
  selectedLevel: CourseLevel | "All";
  onSelectLevel: (level: CourseLevel | "All") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const levels: (CourseLevel | "All")[] = [
    "All",
    "Beginner",
    "Intermediate",
    "Expert",
    "All Levels",
  ];

  return (
    <div className="space-y-6 mb-10">
      {/* Search & Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title, keywords, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 shadow-2xs"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => onSelectLevel(e.target.value as CourseLevel | "All")}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 shadow-2xs font-medium"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 shadow-2xs font-medium"
            >
              <option value="popular">Most Popular</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-2xs ${
                isSelected
                  ? "bg-brand-600 text-white shadow-brand-500/20 scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
