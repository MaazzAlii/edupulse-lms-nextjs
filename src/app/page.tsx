"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
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
  averageRating?: number;
  numReviews?: number;
  createdAt: string;
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlLevel = searchParams.get("level") || "";
  const urlSort = searchParams.get("sort") || "newest";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedLevel, setSelectedLevel] = useState(urlLevel);
  const [selectedSort, setSelectedSort] = useState(urlSort);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(urlPage);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Wishlist state (set of wishlisted courseIds)
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  // Sync state if URL changes externally
  useEffect(() => {
    setKeywordInput(urlKeyword);
    setSelectedCategory(urlCategory);
    setSelectedLevel(urlLevel);
    setSelectedSort(urlSort);
    setPage(urlPage);
  }, [urlKeyword, urlCategory, urlLevel, urlSort, urlPage]);

  // Fetch user wishlist if authenticated
  useEffect(() => {
    async function fetchWishlist() {
      if (!isAuthenticated) return;
      try {
        const res = await fetch("/api/wishlist", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.wishlists)) {
          const ids = new Set<string>(
            data.wishlists
              .map((w: any) => w.course?._id?.toString())
              .filter(Boolean)
          );
          setWishlistedIds(ids);
        }
      } catch (err) {
        console.error("Failed to load user wishlist:", err);
      }
    }

    fetchWishlist();
  }, [isAuthenticated]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch courses with pagination and sorting
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (urlKeyword) params.set("keyword", urlKeyword);
      if (urlCategory) params.set("category", urlCategory);
      if (urlLevel) params.set("level", urlLevel);
      if (urlSort) params.set("sort", urlSort);
      params.set("page", urlPage.toString());
      params.set("limit", "9");

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/courses${queryString}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
        setTotal(data.total || data.courses.length);
        setPages(data.pages || 1);
      } else {
        setCourses([]);
        setTotal(0);
        setPages(1);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [urlKeyword, urlCategory, urlLevel, urlSort, urlPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateFilters = (opts: {
    keyword?: string;
    category?: string;
    level?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const k = opts.keyword !== undefined ? opts.keyword : keywordInput;
    const c = opts.category !== undefined ? opts.category : selectedCategory;
    const l = opts.level !== undefined ? opts.level : selectedLevel;
    const s = opts.sort !== undefined ? opts.sort : selectedSort;
    const p = opts.page !== undefined ? opts.page : 1; // reset page to 1 on filter change unless specified

    if (k.trim()) params.set("keyword", k.trim());
    if (c) params.set("category", c);
    if (l) params.set("level", l);
    if (s && s !== "newest") params.set("sort", s);
    if (p > 1) params.set("page", p.toString());

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ keyword: keywordInput, page: 1 });
  };

  const handleToggleWishlist = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/`);
      return;
    }

    const isWishlisted = wishlistedIds.has(courseId);

    try {
      if (isWishlisted) {
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
        await fetch(`/api/wishlist/${courseId}`, { method: "DELETE" });
      } else {
        setWishlistedIds((prev) => new Set(prev).add(courseId));
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const resetAllFilters = () => {
    setKeywordInput("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedSort("newest");
    router.push("/");
  };

  const hasActiveFilters = Boolean(urlKeyword || urlCategory || urlLevel || (urlSort && urlSort !== "newest"));

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
              onClick={() => updateFilters({ category: "", page: 1 })}
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
                onClick={() => updateFilters({ category: cat._id, page: 1 })}
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

          {/* Level Filter, Sort Dropdown & Reset */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-2.5 py-1.5 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
              <select
                value={selectedLevel}
                onChange={(e) => updateFilters({ level: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-2.5 py-1.5 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={selectedSort}
                onChange={(e) => updateFilters({ sort: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
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
              "Searching catalog..."
            ) : (
              <>
                Showing <strong className="text-foreground">{courses.length}</strong> of{" "}
                <strong className="text-foreground">{total}</strong>{" "}
                {total === 1 ? "course" : "courses"}
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
            {courses.map((course) => {
              const isSaved = wishlistedIds.has(course._id);

              return (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="group card-surface overflow-hidden flex flex-col card-surface-hover hover:border-primary/30 relative"
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

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => handleToggleWishlist(e, course._id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                          isSaved
                            ? "bg-red-500 text-white fill-red-500 scale-105"
                            : "bg-slate-900/70 text-slate-300 hover:text-red-400 hover:bg-slate-900"
                        }`}
                        title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                        />
                      </button>

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

                    <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">
                      {course.description}
                    </p>

                    {/* Rating display */}
                    <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold">
                      {course.numReviews && course.numReviews > 0 ? (
                        <>
                          <div className="flex items-center gap-1 text-gold bg-gold-tint px-2 py-0.5 rounded-md border border-gold/30">
                            <Star className="w-3.5 h-3.5 fill-gold" />
                            <span className="font-bold text-foreground">
                              {course.averageRating?.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-muted text-[11px]">
                            ({course.numReviews} {course.numReviews === 1 ? "review" : "reviews"})
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-muted font-normal italic">
                          No reviews yet
                        </span>
                      )}
                    </div>

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
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {pages > 1 && (
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
            <span className="text-xs text-muted font-medium">
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{pages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateFilters({ page: page - 1 })}
                disabled={page <= 1 || loading}
                className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:bg-black/5 transition disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateFilters({ page: p })}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                      p === page
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface text-muted hover:text-foreground hover:bg-black/5 border border-border"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => updateFilters({ page: page + 1 })}
                disabled={page >= pages || loading}
                className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:bg-black/5 transition disabled:opacity-40 flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
