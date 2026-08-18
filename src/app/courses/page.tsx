"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLMS } from "@/context/LMSContext";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilter } from "@/components/courses/CourseFilter";
import { Category, CourseLevel } from "@/types";
import { BookOpen, Loader2 } from "lucide-react";

const ALL_CATEGORIES: (Category | "All")[] = [
  "All",
  "Web Development",
  "Artificial Intelligence",
  "Data Science",
  "Cloud & DevOps",
  "UI/UX Design",
  "Cybersecurity",
  "Mobile App Dev",
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as Category) || "All";
  const initialSearch = searchParams.get("search") || "";

  const { courses, selectedCategory, setSelectedCategory } = useLMS();

  const [category, setCategory] = useState<Category | "All">(initialCategory);
  const [level, setLevel] = useState<CourseLevel | "All">("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("popular");

  // Sync category with global LMS context if changed
  const handleCategoryChange = (cat: Category | "All") => {
    setCategory(cat);
    setSelectedCategory(cat);
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Category filter
        if (category !== "All" && course.category !== category) {
          return false;
        }
        // Level filter
        if (level !== "All" && course.level !== level) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = course.title.toLowerCase().includes(query);
          const matchDesc = course.description.toLowerCase().includes(query);
          const matchTags = course.tags.some((t) => t.toLowerCase().includes(query));
          const matchInstructor = course.instructor.name.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchTags && !matchInstructor) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.purchasedCount - a.purchasedCount;
        if (sortBy === "highest-rated") return b.rating - a.rating;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [courses, category, level, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
          Course Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Explore All Engineering Masterclasses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Filter by technical domain, experience level, or search for specialized tools and frameworks.
        </p>
      </div>

      {/* Filter Component */}
      <CourseFilter
        categories={ALL_CATEGORIES}
        selectedCategory={category}
        onSelectCategory={handleCategoryChange}
        selectedLevel={level}
        onSelectLevel={setLevel}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-3xl border space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No courses found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing the category filter, or exploring our full catalog.
          </p>
          <button
            onClick={() => {
              setCategory("All");
              setLevel("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}

