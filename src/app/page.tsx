"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  BookOpen,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlLevel = searchParams.get("level") || "";

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedLevel, setSelectedLevel] = useState(urlLevel);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  // Sync state if URL changes externally
  useEffect(() => {
    setKeywordInput(urlKeyword);
    setSelectedCategory(urlCategory);
    setSelectedLevel(urlLevel);
  }, [urlKeyword, urlCategory, urlLevel]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Fetch courses whenever query params change
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (urlKeyword) params.set("keyword", urlKeyword);
      if (urlCategory) params.set("category", urlCategory);
      if (urlLevel) params.set("level", urlLevel);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/courses${queryString}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [urlKeyword, urlCategory, urlLevel]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateFilters = (newKeyword?: string, newCat?: string, newLvl?: string) => {
    const params = new URLSearchParams();
    const k = newKeyword !== undefined ? newKeyword : keywordInput;
    const c = newCat !== undefined ? newCat : selectedCategory;
    const l = newLvl !== undefined ? newLvl : selectedLevel;

    if (k.trim()) params.set("keyword", k.trim());
    if (c) params.set("category", c);
    if (l) params.set("level", l);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(keywordInput, undefined, undefined);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    updateFilters(undefined, catId, undefined);
  };

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    updateFilters(undefined, undefined, lvl);
  };

  const resetAllFilters = () => {
    setKeywordInput("");
    setSelectedCategory("");
    setSelectedLevel("");
    router.push("/");
  };

  const hasActiveFilters = Boolean(urlKeyword || urlCategory || urlLevel);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero / Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-tint/40 via-surface to-background border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Explore Top Tech & Business Programs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Master New Skills with{" "}
              <span className="text-primary underline decoration-gold/40 decoration-4 underline-offset-8">
                Industry Experts
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto">
              Discover accredited courses designed to accelerate your career.
              Learn at your own pace with hands-on projects and verified credentials.
            </p>

            {/* Search and Filters Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 bg-surface p-2 rounded-2xl border border-border shadow-lg shadow-primary/5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              >
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Search courses by title (e.g. React, Python)..."
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted/70 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filters Controls Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-primary" />
              Category:
            </span>

            <button
              onClick={() => handleCategoryChange("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedCategory
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat._id
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Level Filter & Reset */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-2.5 py-1.5 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
              <select
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-primary hover:bg-primary-tint transition-all"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between">
          <p className="text-xs text-muted font-medium">
            {loading ? (
              "Searching courses..."
            ) : (
              <>
                Showing <strong className="text-foreground">{courses.length}</strong>{" "}
                {courses.length === 1 ? "course" : "courses"}
                {hasActiveFilters && " for current filters"}
              </>
            )}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="card-surface overflow-hidden p-4 flex flex-col gap-4 animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200/80 rounded-xl" />
                <div className="h-4 bg-gray-200/80 rounded-md w-1/3" />
                <div className="h-6 bg-gray-200/80 rounded-md w-4/5" />
                <div className="h-10 bg-gray-200/80 rounded-md w-full" />
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-border/60">
                  <div className="h-4 bg-gray-200/80 rounded-md w-1/4" />
                  <div className="h-6 bg-gray-200/80 rounded-md w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="card-surface p-12 text-center my-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary-tint text-primary mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No courses found
            </h3>
            <p className="text-sm text-muted mb-6">
              We couldn&apos;t find any published courses matching your current search
              or filter criteria.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          /* Course Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="group card-surface overflow-hidden flex flex-col card-surface-hover hover:border-primary/30"
              >
                {/* Thumbnail / Header */}
                <div className="relative w-full h-48 bg-primary-tint/50 overflow-hidden flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  {/* Fallback pattern when no thumbnail */}
                  {!course.thumbnailUrl && (
                    <div className="flex flex-col items-center gap-2 text-primary/70 group-hover:scale-105 transition-transform duration-300">
                      <GraduationCap className="w-12 h-12 text-gold" />
                      <span className="text-xs font-bold tracking-wider uppercase text-primary/60">
                        {course.category?.name || "Course"}
                      </span>
                    </div>
                  )}

                  {/* Badges Overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {course.category && (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-surface/90 backdrop-blur-md text-primary shadow-sm border border-border">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm ${
                        course.level === "Beginner"
                          ? "bg-green-tint text-green border border-green/30"
                          : course.level === "Intermediate"
                          ? "bg-gold-tint text-gold border border-gold/30"
                          : "bg-red-tint text-red border border-red/30"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary-tint text-primary flex items-center justify-center font-bold text-[10px]">
                        {course.instructor.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[120px]">
                        {course.instructor}
                      </span>
                    </div>

                    <div className="text-right">
                      {course.price === 0 ? (
                        <span className="text-sm font-extrabold text-green">
                          Free
                        </span>
                      ) : (
                        <span className="text-base font-extrabold text-foreground">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
