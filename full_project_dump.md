
--- FILE: package.json ---
{
  "name": "edupulse-lms",
  "version": "1.0.0",
  "private": true,
  "description": "âš¡ EduPulse LMS â€” Full-Stack Next.js 15 Learning Management System with Complete Authentication, MongoDB Mongoose, and Protected Routes",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "dependencies": {
    "@vercel/blob": "^2.8.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.453.0",
    "mongoose": "^8.5.2",
    "next": "^15.1.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^3.10.1",
    "resend": "^6.24.0",
    "stripe": "^22.6.0",
    "tailwind-merge": "^2.5.4",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@playwright/test": "^1.62.1",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.17.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.1.7",
    "playwright": "^1.62.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3"
  }
}


--- FILE: tsconfig.json ---
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}


--- FILE: .env.example ---
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
BLOB_READ_WRITE_TOKEN=
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_placeholder


--- FILE: next.config.mjs ---
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setting DNS servers is not allowed
}

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; img-src 'self' data: blob: https:; media-src 'self' blob: https: https://*.public.blob.vercel-storage.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ws: wss: https://api.stripe.com https://*.public.blob.vercel-storage.com;",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;


--- FILE: tailwind.config.ts ---
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        surface: "var(--surface)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          tint: "var(--primary-tint)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          tint: "var(--gold-tint)",
        },
        green: {
          DEFAULT: "var(--green)",
          tint: "var(--green-tint)",
        },
        red: {
          DEFAULT: "var(--red)",
          tint: "var(--red-tint)",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Times New Roman", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "IBM Plex Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;


--- FILE: postcss.config.mjs ---
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;


--- FILE: vercel.json ---
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "crons": [
    {
      "path": "/api/cron/cleanup-notifications",
      "schedule": "0 0 * * *"
    }
  ]
}


--- FILE: src/app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #faf8f6;
  --foreground: #221b20;
  --muted: #7a7078;
  --border: #e8e1e4;
  --surface: #ffffff;
  --primary: #6b2d5c;
  --primary-dark: #4f2144;
  --primary-tint: #f3e8f0;
  --gold: #c9972a;
  --gold-tint: #faf1dd;
  --green: #2e8b57;
  --green-tint: #e6f4ec;
  --red: #c0392b;
  --red-tint: #fbe9e7;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}

/* Glassmorphism & Cards */
.card-surface {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 4px 20px -2px rgba(107, 45, 92, 0.05);
}

.card-surface-hover {
  transition: all 0.2s ease-in-out;
}
.card-surface-hover:hover {
  border-color: rgba(107, 45, 92, 0.3);
  box-shadow: 0 10px 25px -5px rgba(107, 45, 92, 0.1);
  transform: translateY(-2px);
}


--- FILE: src/app/layout.tsx ---
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EduPulse LMS â€” Modern Next.js 15 Learning Platform",
  description:
    "Full-Stack Learning Management System built with Next.js 15, TypeScript, MongoDB Mongoose, JWT Authentication, and Protected Routes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}


--- FILE: src/app/page.tsx ---
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


--- FILE: src/app/robots.ts ---
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://edupulse.vercel.app");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/courses/"],
      disallow: [
        "/admin/",
        "/dashboard",
        "/my-courses",
        "/wishlist",
        "/api/",
        "/certificate/",
        "/checkout/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


--- FILE: src/app/sitemap.ts ---
import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://edupulse.vercel.app");

  try {
    await connectDB();
    const courses = await Course.find({ isPublished: true }).select("_id updatedAt");

    const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
      url: `${baseUrl}/courses/${course._id}`,
      lastModified: course.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      ...courseEntries,
    ];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}


--- FILE: src/context/AuthContext.tsx ---
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Registration failed" };
      }

      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "An unexpected error occurred" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Login failed" };
      }

      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


--- FILE: src/lib/db.ts ---
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // If MONGO_URI is missing, throw an error in server context when called
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env or .env.local"
    );
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;


--- FILE: src/lib/auth.ts ---
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";

export const AUTH_COOKIE = "lms_token";

/**
 * For use inside Route Handlers. Reads cookie from NextRequest,
 * verifies token, and retrieves the User document from DB.
 * Returns null if user is not found or is suspended (isActive === false).
 */
export async function getAuthUserFromRequest(
  req: NextRequest
): Promise<IUser | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isActive === false) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * For use inside Server Components and Server Actions.
 * In Next.js 15, cookies() is asynchronous.
 * Returns null if user is not found or is suspended (isActive === false).
 */
export async function getServerUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isActive === false) return null;

    return user;
  } catch {
    return null;
  }
}


--- FILE: src/lib/jwt.ts ---
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_jwt_secret_key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export interface JWTPayload {
  id: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}


--- FILE: src/lib/adminGuard.ts ---
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError } from "@/lib/response";
import { IUser } from "@/models/User";

export async function requireAdmin(
  req: NextRequest
): Promise<IUser | NextResponse> {
  const user = await getAuthUserFromRequest(req);

  if (!user) {
    return apiError("Not authenticated", 401);
  }

  if (user.role !== "admin") {
    return apiError("Admin access required", 403);
  }

  return user;
}


--- FILE: src/lib/enrollmentGuard.ts ---
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

/**
 * Checks if a given user has paid access to a specific course.
 * Returns true if the user is an admin OR has a 'Paid' Enrollment for the course.
 *
 * @param userId - User ID string or ObjectId
 * @param courseId - Course ID string or ObjectId
 * @param userRole - Optional role of the user (e.g. 'admin')
 */
export async function hasPaidAccess(
  userId?: string | mongoose.Types.ObjectId,
  courseId?: string | mongoose.Types.ObjectId,
  userRole?: string
): Promise<boolean> {
  if (!userId || !courseId) {
    return false;
  }

  // Admins always have access to all courses
  if (userRole === "admin") {
    return true;
  }

  try {
    await connectDB();

    // Check if course is free (price === 0)
    const course = await Course.findById(courseId).select("price");
    if (course && course.price === 0) {
      return true;
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      paymentStatus: "Paid",
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking paid access guard:", error);
    return false;
  }
}


--- FILE: src/lib/stripe.ts ---
import Stripe from "stripe";

export class StripeConfigurationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "StripeConfigurationError";
    this.statusCode = statusCode;
  }
}

let stripeInstance: Stripe | null = null;

/**
 * Returns a configured Stripe instance.
 * Throws a clear runtime error if STRIPE_SECRET_KEY is missing.
 */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new StripeConfigurationError(
      "Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in environment variables.",
      500
    );
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any, // Pin to modern API version
      typescript: true,
    });
  }

  return stripeInstance;
}


--- FILE: src/lib/email.ts ---
import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("âš ï¸ RESEND_API_KEY is missing. Email dispatch will be simulated in server logs.");
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Sends a transactional email asynchronously without blocking or throwing errors.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient();
    const from = process.env.EMAIL_FROM || "EduPulse Academy <onboarding@resend.dev>";

    if (!resend) {
      console.log(`[SIMULATED EMAIL] To: ${to} | Subject: "${subject}"`);
      return { success: true, id: "simulated_email_id" };
    }

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error(`âŒ Resend Email Error sending to ${to}:`, response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`âœ… Email sent successfully to ${to} (ID: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.error(`âŒ Exception sending email to ${to}:`, err.message || err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}


--- FILE: src/lib/emailTemplates.ts ---
/**
 * Transactional Email HTML Templates
 * Styled with inline CSS for cross-client compatibility.
 */

export function welcomeEmailTemplate(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to EduPulse Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #e2e8f0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Empowering Your Learning Journey</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Welcome to the Future of Learning, ${name}! ðŸ‘‹</h2>
              <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                We are thrilled to have you join our global student community. At EduPulse, you get access to expert-led tech tracks, interactive video classrooms, and printable verified certificates upon completion.
              </p>
              
              <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #D4AF37; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">âš¡ Quick Start Tips</p>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">Browse our curated course catalog</li>
                  <li style="margin-bottom: 6px;">Enroll in free or premium interactive video tracks</li>
                  <li>Track your progress on your personal Student Dashboard</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #3D1E6D; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px; border: 1px solid #D4AF37;">
                      Explore Course Catalog &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function orderConfirmationEmailTemplate(opts: {
  name: string;
  courseTitle: string;
  amount: number;
  date: string;
  courseId: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";
  const learnUrl = `${appUrl}/courses/${opts.courseId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enrollment Confirmation - EduPulse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #10b981; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">âœ… Enrollment & Order Confirmed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Thank You for Your Order, ${opts.name}!</h2>
              <p style="margin: 0 0 25px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Your payment was processed successfully. Full unlimited access to your new course has been unlocked on your account.
              </p>
              
              <!-- Order Receipt Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 15px 20px; background-color: #1e293b; border-b: 1px solid #334155; font-size: 12px; font-weight: 700; color: #D4AF37; text-transform: uppercase;">
                    Order Receipt Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px; color: #94a3b8; font-size: 13px;">Course Title:</td>
                        <td style="padding-bottom: 12px; color: #f8fafc; font-size: 13px; font-weight: 700; text-align: right;">${opts.courseTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; color: #94a3b8; font-size: 13px;">Amount Paid:</td>
                        <td style="padding-bottom: 12px; color: #10b981; font-size: 14px; font-weight: 800; text-align: right;">${opts.amount === 0 ? "Free" : `$${opts.amount.toFixed(2)}`}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px;">Transaction Date:</td>
                        <td style="color: #f8fafc; font-size: 13px; font-weight: 600; text-align: right;">${opts.date}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${learnUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px;">
                      Start Learning Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function passwordResetEmailTemplate(opts: {
  name: string;
  resetUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - EduPulse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3D1E6D; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 26px; font-weight: 800;">EduPulse Academy</h1>
              <p style="margin: 5px 0 0 0; color: #ef4444; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">ðŸ” Account Security Request</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
              <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Hi ${opts.name}, we received a request to reset the password for your EduPulse account. Click the button below to set a new password.
              </p>
              
              <div style="background-color: #0f172a; border-radius: 12px; padding: 15px 20px; border: 1px solid #334155; margin-bottom: 25px;">
                <p style="margin: 0; color: #f59e0b; font-weight: 600; font-size: 13px;">
                  âš ï¸ This security link will expire in <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${opts.resetUrl}" target="_blank" style="display: inline-block; background-color: #ef4444; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 10px;">
                      Reset Password Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} EduPulse Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}


--- FILE: src/lib/progress.ts ---
/**
 * Computes the percentage of completed lessons for a course.
 *
 * @param completedCount - Number of completed lessons
 * @param totalCount - Total number of published lessons in the course
 * @returns Progress percentage as an integer between 0 and 100
 */
export function computeProgress(completedCount: number, totalCount: number): number {
  if (!totalCount || totalCount <= 0) {
    return 0;
  }
  const percentage = Math.round((completedCount / totalCount) * 100);
  return Math.min(100, Math.max(0, percentage));
}


--- FILE: src/lib/rateLimit.ts ---
import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitStore>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  ipStore.forEach((store, ip) => {
    if (now > store.resetTime) {
      ipStore.delete(ip);
    }
  });
}, 10 * 60 * 1000);

/**
 * In-memory IP Rate Limiter
 * @param req NextRequest
 * @param maxHits Limit of max requests allowed (default 10)
 * @param windowMs Time window in ms (default 15 minutes)
 */
export function checkRateLimit(
  req: NextRequest,
  maxHits: number = 10,
  windowMs: number = 15 * 60 * 1000
): { isAllowed: boolean; remainingHits: number } {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const now = Date.now();
  const store = ipStore.get(ip);

  if (!store || now > store.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { isAllowed: true, remainingHits: maxHits - 1 };
  }

  if (store.count >= maxHits) {
    return { isAllowed: false, remainingHits: 0 };
  }

  store.count += 1;
  ipStore.set(ip, store);
  return { isAllowed: true, remainingHits: maxHits - store.count };
}


--- FILE: src/lib/response.ts ---
import { NextResponse } from "next/server";

export function apiError(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function apiSuccess(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}


--- FILE: src/lib/reviewStats.ts ---
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Course from "@/models/Course";

/**
 * Recalculates denormalized averageRating and numReviews on Course document
 * based on all existing reviews for that course.
 */
export async function recalculateCourseRating(
  courseId: string | mongoose.Types.ObjectId
): Promise<{ averageRating: number; numReviews: number }> {
  try {
    await connectDB();

    const courseObjId =
      typeof courseId === "string"
        ? new mongoose.Types.ObjectId(courseId)
        : courseId;

    const stats = await Review.aggregate([
      { $match: { course: courseObjId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    let averageRating = 0;
    let numReviews = 0;

    if (stats.length > 0) {
      // Round to 1 decimal place (e.g. 4.7)
      averageRating = Math.round(stats[0].averageRating * 10) / 10;
      numReviews = stats[0].numReviews;
    }

    await Course.findByIdAndUpdate(courseId, {
      averageRating,
      numReviews,
    });

    return { averageRating, numReviews };
  } catch (error) {
    console.error("Error recalculating course rating stats:", error);
    return { averageRating: 0, numReviews: 0 };
  }
}


--- FILE: src/lib/validation.ts ---
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const checkoutSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1, "Comment is required").max(2000, "Comment is too long"),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required").max(3000, "Question is too long"),
});


--- FILE: src/lib/videoUpload.ts ---
import { put } from "@vercel/blob";

export class VideoUploadError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "VideoUploadError";
    this.statusCode = statusCode;
  }
}

const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

/**
 * Uploads a video file to Vercel Blob storage.
 * Performs validation for MIME type, size, and environment configuration.
 */
export async function uploadVideo(
  file: File
): Promise<{ url: string; size: number }> {
  if (!file) {
    throw new VideoUploadError("No video file provided", 400);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new VideoUploadError(
      `Invalid video file type: "${file.type || "unknown"}". Allowed types are video/mp4, video/webm, and video/quicktime.`,
      400
    );
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new VideoUploadError(
      `File size (${sizeInMB}MB) exceeds the maximum limit of 200MB.`,
      400
    );
  }

  // Verify Blob token is configured
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new VideoUploadError(
      "Vercel Blob storage is not configured. BLOB_READ_WRITE_TOKEN environment variable is missing.",
      500
    );
  }

  // Sanitize filename: replace spaces and unsafe characters with hyphen
  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  const pathname = `lessons/${Date.now()}-${sanitizedName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });

    return {
      url: blob.url,
      size: file.size,
    };
  } catch (err: any) {
    if (err instanceof VideoUploadError) throw err;
    throw new VideoUploadError(
      `Failed to upload video to Vercel Blob: ${err.message || err}`,
      500
    );
  }
}


--- FILE: src/lib/analytics.ts ---
import mongoose, { Model } from "mongoose";
import { connectDB } from "@/lib/db";

export interface MonthlyMetric {
  month: string; // e.g. "Sep 2025"
  count: number;
  revenue: number;
}

/**
 * Aggregates monthly metric counts and revenue over the last 12 months
 * filling in zero-activity months automatically.
 */
export async function getLast12MonthsData(
  model: Model<any>,
  dateField: string,
  matchFilter: Record<string, any> = {}
): Promise<MonthlyMetric[]> {
  await connectDB();

  const now = new Date();
  // Start date = 11 months ago on the 1st of that month
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const aggregateResult = await model.aggregate([
    {
      $match: {
        [dateField]: { $gte: twelveMonthsAgo },
        ...matchFilter,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: `$${dateField}` },
          month: { $month: `$${dateField}` },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  // Create lookup map keyed by "YYYY-M"
  const statsMap: Record<string, { count: number; revenue: number }> = {};
  aggregateResult.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    statsMap[key] = {
      count: item.count || 0,
      revenue: item.revenue || 0,
    };
  });

  const monthsData: MonthlyMetric[] = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Fill 12 monthly slots
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const key = `${year}-${monthIdx + 1}`;
    const label = `${monthNames[monthIdx]} ${year.toString().slice(-2)}`;

    const found = statsMap[key] || { count: 0, revenue: 0 };
    monthsData.push({
      month: label,
      count: found.count,
      revenue: Math.round(found.revenue * 100) / 100,
    });
  }

  return monthsData;
}


--- FILE: src/models/User.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin";
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;


--- FILE: src/models/Category.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

export default Category;


--- FILE: src/models/Course.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl: string;
  isPublished: boolean;
  averageRating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;


--- FILE: src/models/Lesson.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  title: string;
  order: number;
  videoUrl: string;
  durationSeconds: number;
  isPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
      default: 1,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on course and order
lessonSchema.index({ course: 1, order: 1 });

const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;


--- FILE: src/models/Enrollment.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: "Pending" | "Paid";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  completedLessons: mongoose.Types.ObjectId[];
  completedAt?: Date | null;
  enrolledAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    stripeSessionId: {
      type: String,
      default: "",
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "enrolledAt", updatedAt: true },
  }
);

// Unique compound index so a user can only have one enrollment per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;


--- FILE: src/models/Review.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    adminReply: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user can only leave one review per course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;


--- FILE: src/models/Question.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReply {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  question: string;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    text: {
      type: String,
      required: [true, "Reply text is required"],
      trim: true,
      maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const questionSchema = new Schema<IQuestion>(
  {
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      maxlength: [2000, "Question cannot exceed 2000 characters"],
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ lesson: 1, createdAt: -1 });
questionSchema.index({ course: 1, createdAt: -1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", questionSchema);

export default Question;


--- FILE: src/models/Notification.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: "new_enrollment" | "new_question" | "question_reply";
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    type: {
      type: String,
      enum: ["new_enrollment", "new_question", "question_reply"],
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "Notification link is required"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;


--- FILE: src/models/Wishlist.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1, course: 1 }, { unique: true });

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;


--- FILE: src/app/api/auth/register/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { welcomeEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return apiError("Please provide name, email, and password", 400);
    }

    if (password.length < 6) {
      return apiError("Password must be at least 6 characters long", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return apiError("An account with this email already exists", 400);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "student",
    });

    // Send Welcome Email (non-blocking)
    sendEmail({
      to: user.email,
      subject: "Welcome to EduPulse Academy! ðŸš€",
      html: welcomeEmailTemplate(user.name),
    }).catch((err) => console.error("Welcome email send error:", err));

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = apiSuccess(
      {
        message: "Account created successfully",
        user: userResponse,
      },
      201
    );

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return apiError(error.message || "Failed to register user", 500);
  }
}


--- FILE: src/app/api/auth/login/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check (10 attempts per 15 min)
    const rateLimit = checkRateLimit(req, 10, 15 * 60 * 1000);
    if (!rateLimit.isAllowed) {
      return apiError("Too many login attempts. Please try again in 15 minutes.", 429);
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));
    
    // 2. Zod input validation
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Select password explicitly since it has select: false on schema
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return apiError("Invalid email or password", 401);
    }

    // Check if account is suspended
    if (user.isActive === false) {
      return apiError("Your account has been suspended â€” contact support", 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = apiSuccess({
      message: "Logged in successfully",
      user: userResponse,
    });

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return apiError(error.message || "Failed to log in", 500);
  }
}


--- FILE: src/app/api/auth/logout/route.ts ---
import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = apiSuccess({
    message: "Logged out successfully",
  });

  // Clear HTTP-only auth cookie
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}


--- FILE: src/app/api/auth/me/route.ts ---
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return apiError("Not authenticated", 401);
    }

    return apiSuccess({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Auth check error:", error);
    return apiError(error.message || "Authentication check failed", 500);
  }
}


--- FILE: src/app/api/auth/forgot-password/route.ts ---
import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { passwordResetEmailTemplate } from "@/lib/emailTemplates";
import { apiSuccess } from "@/lib/response";

/**
 * POST /api/auth/forgot-password
 * Generates SHA-256 hashed password reset token (15-min expiry) and emails link.
 * Always returns generic response to prevent account enumeration leaks.
 */
export async function POST(req: NextRequest) {
  const genericResponse = apiSuccess({
    message: "If an account exists for that email address, a password reset link has been sent.",
  });

  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return genericResponse;
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (user && user.isActive) {
      // Generate 32-byte random hex token
      const rawToken = crypto.randomBytes(32).toString("hex");

      // Hash token for database storage
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await user.save();

      const reqHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
      const reqProto = req.headers.get("x-forwarded-proto") || "https";
      const requestOrigin = reqHost ? `${reqProto}://${reqHost}` : req.nextUrl.origin;

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
          ? process.env.NEXT_PUBLIC_APP_URL
          : requestOrigin || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password/${rawToken}`;

      // Dispatch password reset email (non-blocking)
      sendEmail({
        to: user.email,
        subject: "Password Reset Request â€” EduPulse Academy",
        html: passwordResetEmailTemplate({
          name: user.name,
          resetUrl,
        }),
      }).catch((err) => console.error("Forgot password email send error:", err));
    }

    return genericResponse;
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return genericResponse;
  }
}


--- FILE: src/app/api/categories/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// GET /api/categories - Public: Returns all categories sorted by name
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return apiSuccess({ categories });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch categories", 500);
  }
}

// POST /api/categories - Admin only: Creates a new category
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return apiError("Category name is required", 400);
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    if (!slug) {
      return apiError("Invalid category name resulting in empty slug", 400);
    }

    await connectDB();

    // Check if category name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: trimmedName }, { slug }],
    });

    if (existingCategory) {
      return apiError("A category with this name or slug already exists", 400);
    }

    const newCategory = await Category.create({
      name: trimmedName,
      slug,
    });

    return apiSuccess({ category: newCategory }, 201);
  } catch (error: any) {
    if (error.code === 11000) {
      return apiError("Category name or slug already exists", 400);
    }
    return apiError(error.message || "Failed to create category", 500);
  }
}


--- FILE: src/app/api/courses/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function generateUniqueCourseSlug(title: string): Promise<string> {
  const baseSlug = slugify(title) || "course";
  let slug = baseSlug;
  let counter = 1;

  while (await Course.exists({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// GET /api/courses - Public Catalog: Filter by keyword, category, level, sort, page, limit.
// Admin users can see draft courses; non-admins/anonymous only see isPublished: true
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword")?.trim();
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();
    const sort = searchParams.get("sort")?.trim() || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "9", 10));

    // Check if requester is admin
    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    const filter: Record<string, any> = {};

    // Non-admins only see published courses
    if (!isAdmin) {
      filter.isPublished = true;
    }

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (level && ["Beginner", "Intermediate", "Advanced"].includes(level)) {
      filter.level = level;
    }

    // Determine sort options
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { averageRating: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const total = await Course.countDocuments(filter);
    const pages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return apiSuccess({
      courses,
      total,
      page,
      pages,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch courses", 500);
  }
}

// POST /api/courses - Admin only: Creates a new course (default isPublished: false)
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const {
      title,
      description,
      category,
      instructor,
      level = "Beginner",
      price = 0,
      thumbnailUrl = "",
    } = body;

    if (!title || !description || !category || !instructor) {
      return apiError(
        "Title, description, category, and instructor are required fields",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return apiError("Invalid category ID format", 400);
    }

    await connectDB();

    // Validate category exists in DB
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return apiError("Category not found", 404);
    }

    if (price < 0) {
      return apiError("Price cannot be negative", 400);
    }

    const slug = await generateUniqueCourseSlug(title);

    const course = await Course.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      category: categoryDoc._id,
      instructor: instructor.trim(),
      level,
      price: Number(price),
      thumbnailUrl: thumbnailUrl?.trim() || "",
      isPublished: false,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "category",
      "name slug"
    );

    return apiSuccess({ course: populatedCourse }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create course", 500);
  }
}


--- FILE: src/app/api/checkout/route.ts ---
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { getStripe } from "@/lib/stripe";
import { apiError, apiSuccess } from "@/lib/response";
import { checkoutSchema } from "@/lib/validation";

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for purchasing a course, or enrolls user directly if course is free.
 * Requires authentication (User or Admin).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from HTTP-only JWT cookie
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to enroll in a course.", 401);
    }

    // 2. Parse & Zod validate request body
    const body = await req.json().catch(() => ({}));
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { courseId } = parsed.data;

    // 3. Connect DB and fetch course
    await connectDB();
    const course = await Course.findById(courseId);

    if (!course || !course.isPublished) {
      return apiError("Course not found or is not available for purchase.", 404);
    }

    // 4. Check if user already owns this course with 'Paid' status
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentStatus: "Paid",
    });

    if (existingEnrollment) {
      return apiError("You already own this course.", 400);
    }

    // Determine absolute application base URL for redirects (supports dynamic Vercel host & NEXT_PUBLIC_APP_URL)
    const reqHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const reqProto = req.headers.get("x-forwarded-proto") || "https";
    const requestOrigin = reqHost ? `${reqProto}://${reqHost}` : req.nextUrl.origin;

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL
        : requestOrigin || "http://localhost:3000";

    // 5. Handle Free Course (price === 0): Skip Stripe
    if (course.price === 0) {
      await Enrollment.findOneAndUpdate(
        { user: user._id, course: course._id },
        {
          amount: 0,
          paymentStatus: "Paid",
          stripeSessionId: "free_course_bypass",
        },
        { upsert: true, new: true }
      );

      // Find first lesson for direct learning redirect if available
      const firstLesson = await Lesson.findOne({ course: course._id }).sort({ order: 1 });
      const redirectUrl = firstLesson
        ? `${baseUrl}/learn/${course._id}/${firstLesson._id}`
        : `${baseUrl}/courses/${course._id}?enrolled=true`;

      return apiSuccess({
        redirectUrl,
        message: "Enrolled in free course successfully.",
      });
    }

    // 6. Handle Paid Course: Create Stripe Checkout Session
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description
                ? course.description.slice(0, 500)
                : undefined,
              images: course.thumbnailUrl ? [course.thumbnailUrl] : undefined,
            },
            unit_amount: Math.round(course.price * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}`,
      cancel_url: `${baseUrl}/courses/${course._id}?checkout=cancelled`,
    });

    // 7. Upsert Pending Enrollment row in DB
    await Enrollment.findOneAndUpdate(
      { user: user._id, course: course._id },
      {
        amount: course.price,
        paymentStatus: "Pending",
        stripeSessionId: session.id,
      },
      { upsert: true, new: true }
    );

    return apiSuccess({
      redirectUrl: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return apiError(
      error.message || "Failed to create checkout session",
      error.statusCode || 500
    );
  }
}


--- FILE: src/app/api/checkout/verify/route.ts ---
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import Notification from "@/models/Notification";
import { getStripe } from "@/lib/stripe";
import { apiError, apiSuccess } from "@/lib/response";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmailTemplate } from "@/lib/emailTemplates";

/**
 * GET /api/checkout/verify?session_id=...
 * Directly verifies Stripe checkout session status with Stripe API.
 * If payment is paid, activates enrollment in DB immediately (failsafe for webhooks).
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to verify checkout.", 401);
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return apiError("Missing session_id parameter.", 400);
    }

    await connectDB();

    // Retrieve checkout session directly from Stripe API
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return apiError("Checkout session not found on Stripe.", 404);
    }

    const userId = session.metadata?.userId || user._id.toString();
    const courseId = session.metadata?.courseId;

    if (!courseId) {
      return apiError("Course metadata missing from checkout session.", 400);
    }

    // If Stripe confirms payment status is 'paid'
    if (session.payment_status === "paid") {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || "";

      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      // Check if already marked Paid in DB to prevent duplicate emails/notifications
      const existing = await Enrollment.findOne({ user: userId, course: courseId });
      const isAlreadyPaid = existing?.paymentStatus === "Paid";

      const updatedEnrollment = await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        {
          paymentStatus: "Paid",
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: session.id,
          amount: amountTotal,
        },
        { upsert: true, new: true }
      );

      // If enrollment wasn't previously marked Paid, send notification & confirmation email
      if (!isAlreadyPaid) {
        const [buyerUser, courseDoc, adminUsers] = await Promise.all([
          User.findById(userId),
          Course.findById(courseId),
          User.find({ role: "admin" }),
        ]);

        if (adminUsers.length > 0) {
          const buyerName = buyerUser ? buyerUser.name : "A student";
          const courseTitle = courseDoc ? courseDoc.title : "a course";

          await Notification.insertMany(
            adminUsers.map((adm) => ({
              recipient: adm._id,
              type: "new_enrollment",
              message: `${buyerName} enrolled in "${courseTitle}" ($${amountTotal.toFixed(2)})`,
              link: "/admin",
            }))
          ).catch((e) => console.error("Notification insert error:", e));
        }

        if (buyerUser && courseDoc) {
          sendEmail({
            to: buyerUser.email,
            subject: `Order Confirmation â€” ${courseDoc.title}`,
            html: orderConfirmationEmailTemplate({
              name: buyerUser.name,
              courseTitle: courseDoc.title,
              amount: amountTotal,
              date: new Date().toLocaleDateString(),
              courseId: courseDoc._id.toString(),
            }),
          }).catch((err) => console.error("Order confirmation email error:", err));
        }
      }

      return apiSuccess({
        verified: true,
        paymentStatus: "Paid",
        courseId,
        enrollment: updatedEnrollment,
      });
    }

    return apiSuccess({
      verified: false,
      paymentStatus: session.payment_status,
      courseId,
    });
  } catch (error: any) {
    console.error("Error verifying checkout session:", error);
    return apiError(error.message || "Failed to verify checkout session", 500);
  }
}


--- FILE: src/app/api/webhooks/stripe/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmailTemplate } from "@/lib/emailTemplates";
import Stripe from "stripe";

// Force Node.js runtime for raw request body parsing & crypto verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Stripe Webhook Error: Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe Webhook Error: STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Read raw body string (do NOT call req.json())
    const rawBody = await req.text();
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Stripe Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle specific webhook event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      console.error(
        "Stripe Webhook Error: Missing metadata (userId or courseId) in checkout session",
        session.id
      );
      return NextResponse.json(
        { error: "Missing session metadata" },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || "";

      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      // Update or create enrollment to Paid status
      const updatedEnrollment = await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        {
          paymentStatus: "Paid",
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: session.id,
          amount: amountTotal,
        },
        { upsert: true, new: true }
      );

      // Notify all admin users of the new paid course enrollment
      const [buyerUser, courseDoc, adminUsers] = await Promise.all([
        User.findById(userId),
        Course.findById(courseId),
        User.find({ role: "admin" }),
      ]);

      if (adminUsers.length > 0) {
        const buyerName = buyerUser ? buyerUser.name : "A student";
        const courseTitle = courseDoc ? courseDoc.title : "a course";

        await Notification.insertMany(
          adminUsers.map((adm) => ({
            recipient: adm._id,
            type: "new_enrollment",
            message: `${buyerName} enrolled in "${courseTitle}" ($${amountTotal.toFixed(2)})`,
            link: "/admin",
          }))
        );
      }

      // Send Order Confirmation Email to Buyer (non-blocking)
      if (buyerUser && courseDoc) {
        sendEmail({
          to: buyerUser.email,
          subject: `Order Confirmation â€” ${courseDoc.title}`,
          html: orderConfirmationEmailTemplate({
            name: buyerUser.name,
            courseTitle: courseDoc.title,
            amount: amountTotal,
            date: new Date().toLocaleDateString(),
            courseId: courseDoc._id.toString(),
          }),
        }).catch((err) => console.error("Order confirmation email error:", err));
      }

      console.log(
        `âœ… Successfully processed payment for user ${userId} on course ${courseId}. Enrollment ID: ${updatedEnrollment._id}`
      );
    } catch (dbError: any) {
      console.error("Error updating enrollment status in database:", dbError);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  // Return 200 fast to acknowledge receipt to Stripe
  return NextResponse.json({ received: true }, { status: 200 });
}


--- FILE: src/app/api/enrollments/me/route.ts ---
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/enrollments/me
 * Retrieves current user's enrollment list or single course enrollment status via ?courseId=...
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to check enrollments.", 401);
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      const enrollment = await Enrollment.findOne({
        user: user._id,
        course: courseId,
      }).populate("course", "title thumbnailUrl price");

      return apiSuccess({
        enrollment: enrollment || null,
        isEnrolled: enrollment?.paymentStatus === "Paid",
        paymentStatus: enrollment?.paymentStatus || "None",
      });
    }

    // Return all user's enrollments
    const enrollments = await Enrollment.find({ user: user._id })
      .populate("course", "title thumbnailUrl price category")
      .sort({ enrolledAt: -1 });

    return apiSuccess({
      count: enrollments.length,
      enrollments,
    });
  } catch (error: any) {
    console.error("Error fetching user enrollments:", error);
    return apiError(error.message || "Failed to fetch enrollments", 500);
  }
}


--- FILE: src/app/api/notifications/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/notifications
 * Fetch user notifications and unread count.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: user._id,
      isRead: false,
    });

    return apiSuccess({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return apiError(error.message || "Failed to fetch notifications", 500);
  }
}


--- FILE: src/app/api/notifications/read-all/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * PUT /api/notifications/read-all
 * Mark all notifications for the current user as read.
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    await Notification.updateMany(
      { recipient: user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return apiSuccess({
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return apiError(error.message || "Failed to mark notifications read", 500);
  }
}


--- FILE: src/app/api/wishlist/route.ts ---
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Wishlist from "@/models/Wishlist";
import Course from "@/models/Course";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/wishlist
 * Returns current authenticated user's wishlisted courses.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    const wishlists = await Wishlist.find({ user: user._id })
      .populate({
        path: "course",
        populate: { path: "category", select: "name slug" },
      })
      .sort({ createdAt: -1 });

    const validWishlists = wishlists.filter((w) => w.course && (w.course as any).isPublished);

    return apiSuccess({
      wishlists: validWishlists,
      count: validWishlists.length,
    });
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return apiError(error.message || "Failed to fetch wishlist", 500);
  }
}

/**
 * POST /api/wishlist
 * Adds a course to current user's wishlist.
 * Body: { courseId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    const body = await req.json().catch(() => ({}));
    const { courseId } = body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Valid courseId is required.", 400);
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return apiError("Course is unavailable for wishlisting.", 404);
    }

    const item = await Wishlist.findOneAndUpdate(
      { user: user._id, course: courseId },
      { user: user._id, course: courseId },
      { upsert: true, new: true }
    ).populate({
      path: "course",
      populate: { path: "category", select: "name slug" },
    });

    return apiSuccess(
      {
        message: "Added to wishlist",
        wishlist: item,
      },
      201
    );
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);
    return apiError(error.message || "Failed to add to wishlist", 500);
  }
}


--- FILE: src/app/api/dashboard/summary/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { computeProgress } from "@/lib/progress";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/dashboard/summary
 * Single endpoint returning student learning progress, continue learning target, and purchase history.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    // Fetch all user enrollments populated with course details
    const enrollments = await Enrollment.find({ user: user._id })
      .populate({
        path: "course",
        populate: { path: "category", select: "name slug" },
      })
      .sort({ updatedAt: -1 });

    const paidEnrollments = enrollments.filter(
      (e) => e.paymentStatus === "Paid" && e.course && (e.course as any).isPublished
    );

    // Compute progress for each paid enrollment
    const enrollmentSummaries = await Promise.all(
      paidEnrollments.map(async (e) => {
        const courseId = (e.course as any)._id;
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const completedCount = e.completedLessons ? e.completedLessons.length : 0;
        const progressPercent = computeProgress(completedCount, totalLessons);

        // Find next incomplete lesson
        let nextLessonId: string | null = null;
        if (totalLessons > 0) {
          const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
          const completedSet = new Set((e.completedLessons || []).map((id) => id.toString()));
          const incomplete = lessons.find((l) => !completedSet.has(l._id.toString()));
          nextLessonId = incomplete ? incomplete._id.toString() : lessons[0]._id.toString();
        }

        return {
          _id: e._id,
          course: e.course,
          progressPercent,
          completedLessonsCount: completedCount,
          totalLessons,
          completedAt: e.completedAt || null,
          updatedAt: e.updatedAt,
          enrolledAt: e.enrolledAt,
          nextLessonId,
        };
      })
    );

    const inProgressCount = enrollmentSummaries.filter(
      (s) => s.progressPercent > 0 && s.progressPercent < 100
    ).length;
    const completedCount = enrollmentSummaries.filter(
      (s) => s.progressPercent === 100
    ).length;

    // Pick most recently updated incomplete/active enrollment for "Continue Learning"
    const continueLearningTarget =
      enrollmentSummaries.find((s) => s.progressPercent < 100) ||
      enrollmentSummaries[0] ||
      null;

    // Purchase history (all user enrollments)
    const purchaseHistory = enrollments.map((e) => ({
      _id: e._id,
      courseTitle: (e.course as any)?.title || "Course",
      courseId: (e.course as any)?._id || "",
      amount: e.amount || 0,
      paymentStatus: e.paymentStatus,
      enrolledAt: e.enrolledAt,
      isCompleted: Boolean(e.completedAt),
    }));

    return apiSuccess({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalEnrolled: enrollmentSummaries.length,
        inProgressCount,
        completedCount,
      },
      enrollments: enrollmentSummaries,
      continueLearning: continueLearningTarget,
      purchaseHistory,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard summary:", error);
    return apiError(error.message || "Failed to load student dashboard", 500);
  }
}


--- FILE: src/app/api/admin/analytics/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { getLast12MonthsData } from "@/lib/analytics";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/analytics
 * Returns overall revenue metrics, monthly trends, and top selling courses.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return apiError("Admin authentication required.", 403);
    }

    await connectDB();

    // 1. Monthly Signups (User registrations)
    const monthlySignups = await getLast12MonthsData(User, "createdAt");

    // 2. Monthly Paid Enrollments & Revenue
    const monthlyEnrollments = await getLast12MonthsData(Enrollment, "enrolledAt", {
      paymentStatus: "Paid",
    });

    // 3. Overall Totals
    const [totalUsers, totalCourses, paidEnrollmentsCount, revenueResult] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments({ paymentStatus: "Paid" }),
      Enrollment.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? Math.round(revenueResult[0].totalRevenue * 100) / 100 : 0;

    // 4. Top 5 Courses by Paid Enrollments
    const topCoursesAggregate = await Enrollment.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: "$course",
          enrollmentsCount: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { enrollmentsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          _id: 1,
          enrollmentsCount: 1,
          totalRevenue: 1,
          title: "$courseInfo.title",
          price: "$courseInfo.price",
          instructor: "$courseInfo.instructor",
          isPublished: "$courseInfo.isPublished",
        },
      },
    ]);

    return apiSuccess({
      totals: {
        totalRevenue,
        totalEnrollments: paidEnrollmentsCount,
        totalUsers,
        totalCourses,
      },
      monthlySignups,
      monthlyEnrollments,
      topCourses: topCoursesAggregate,
    });
  } catch (error: any) {
    console.error("Error generating admin analytics:", error);
    return apiError(error.message || "Failed to generate analytics", 500);
  }
}


--- FILE: src/app/api/admin/courses/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

// GET /api/admin/courses - Admin only: Returns all courses (published + drafts)
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const courses = await Course.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess({ courses });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch admin courses", 500);
  }
}


--- FILE: src/app/api/admin/questions/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Question from "@/models/Question";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/questions
 * Returns all student questions across all courses for admin moderation and replies.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return apiError("Admin authentication required.", 403);
    }

    await connectDB();

    const questions = await Question.find()
      .populate("user", "name email")
      .populate("course", "title slug")
      .populate("lesson", "title order")
      .populate("replies.user", "name")
      .sort({ createdAt: -1 });

    return apiSuccess({
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    console.error("Error fetching admin questions queue:", error);
    return apiError(error.message || "Failed to fetch admin questions", 500);
  }
}


--- FILE: src/app/api/admin/users/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/users
 * Returns a paginated, searchable list of users with enrollment counts.
 * Requires Admin authentication.
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword")?.trim();
    const role = searchParams.get("role")?.trim();
    const status = searchParams.get("status")?.trim();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: Record<string, any> = {};

    // Keyword search on name or email
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // Role filter
    if (role && (role === "student" || role === "admin")) {
      query.role = role;
    }

    // Active status filter
    if (status === "active") {
      query.isActive = true;
    } else if (status === "suspended") {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const rawUsers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compute enrollmentCount for each user on this page
    const users = await Promise.all(
      rawUsers.map(async (u) => {
        const enrollmentCount = await Enrollment.countDocuments({
          user: u._id,
        });
        const userObj = u.toObject();
        return {
          ...userObj,
          enrollmentCount,
        };
      })
    );

    const pages = Math.ceil(total / limit) || 1;

    return apiSuccess({
      users,
      total,
      page,
      pages,
      limit,
    });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return apiError(error.message || "Failed to fetch users", 500);
  }
}


--- FILE: src/app/api/cron/cleanup-notifications/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/cron/cleanup-notifications
 * Cron job to clean up read notifications older than 30 days.
 * Protected via Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev_cron_secret_key_123";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return apiError("Unauthorized cron invocation", 401);
    }

    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      isRead: true,
      createdAt: { $lt: thirtyDaysAgo },
    });

    return apiSuccess({
      message: "Notification cleanup completed successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error running notification cleanup cron:", error);
    return apiError(error.message || "Cron execution failed", 500);
  }
}


--- FILE: src/components/Navbar.tsx ---
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Shield,
  BookOpen,
  User,
  Heart,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-all print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:bg-primary-dark transition-colors">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary tracking-tight leading-none group-hover:text-primary-dark transition-colors">
                EduPulse
              </span>
              <span className="text-[11px] font-semibold text-gold tracking-widest uppercase mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              Courses
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/my-courses"
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive("/my-courses")
                      ? "bg-primary-tint text-primary font-semibold"
                      : "text-muted hover:text-foreground hover:bg-black/5"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  My Courses
                </Link>

                <Link
                  href="/wishlist"
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive("/wishlist")
                      ? "bg-primary-tint text-primary font-semibold"
                      : "text-muted hover:text-foreground hover:bg-black/5"
                  }`}
                >
                  <Heart className="w-4 h-4 text-red-400" />
                  Wishlist
                </Link>
              </>
            )}
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/admin")
                    ? "bg-gold-tint text-gold font-semibold"
                    : "text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                <Shield className="w-4 h-4 text-gold" />
                Admin Portal
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Auth / User State */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-200/60 animate-pulse rounded-lg" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell Component */}
              <NotificationBell />

              {isAdmin && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-tint text-gold border border-gold/30">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-tint/60 border border-primary/10">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-semibold text-foreground leading-tight max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted capitalize leading-none">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted hover:text-red hover:bg-red-tint rounded-lg transition-colors border border-transparent hover:border-red/20"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:bg-primary-tint/70 rounded-lg transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/20 hover:shadow-md transition-all active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


--- FILE: src/components/NotificationBell.tsx ---
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  CheckCheck,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface NotificationItem {
  _id: string;
  type: "new_enrollment" | "new_question" | "question_reply";
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [isAuthenticated]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, link: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    } finally {
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await fetch("/api/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all read:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-black/5 transition relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red text-white text-[10px] font-black flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl z-50 overflow-hidden space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-extrabold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition"
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  className={`p-3.5 flex items-start gap-3 text-xs transition-colors block ${
                    n.isRead
                      ? "hover:bg-black/5 opacity-75"
                      : "bg-primary-tint/30 hover:bg-primary-tint/50 font-medium"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-surface border border-border text-primary shrink-0 mt-0.5">
                    {n.type === "new_enrollment" && <BookOpen className="w-3.5 h-3.5 text-green" />}
                    {n.type === "new_question" && <HelpCircle className="w-3.5 h-3.5 text-gold" />}
                    {n.type === "question_reply" && <MessageSquare className="w-3.5 h-3.5 text-primary" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs leading-snug break-words">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-muted block mt-1">
                      {getRelativeTime(n.createdAt)}
                    </span>
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/login/page.tsx ---
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 mb-4">
            <GraduationCap className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted mt-2">
            Sign in to access your dashboard and courses
          </p>
        </div>

        {/* Card */}
        <div className="card-surface p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-tint border border-red/30 flex items-start gap-3 text-red">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/register/page.tsx ---
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 mb-4">
            <GraduationCap className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted mt-2">
            Join EduPulse LMS to start your learning journey
          </p>
        </div>

        {/* Card */}
        <div className="card-surface p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-tint border border-red/30 flex items-start gap-3 text-red">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/forgot-password/page.tsx ---
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password submit error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <span className="font-bold text-xl text-primary">EduPulse</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-xs text-muted">
            Enter your account email address and we&apos;ll send you a password reset link.
          </p>
        </div>

        {/* Form Container */}
        <div className="card-surface p-6 sm:p-8 space-y-6 border border-border shadow-xl">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-tint text-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Reset Link Sent
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, you will receive an email with instructions to reset your password shortly. Check your spam folder if it doesn&apos;t arrive in 2 minutes.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Password Reset Link</span>
              </button>
            </form>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Remember your password? Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/dashboard/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  Award,
  Receipt,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Sparkles,
  Shield,
  TrendingUp,
} from "lucide-react";

interface EnrollmentItem {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    category?: {
      name: string;
    };
    instructor: string;
  };
  progressPercent: number;
  completedLessonsCount: number;
  totalLessons: number;
  completedAt?: string;
  nextLessonId?: string;
  enrolledAt: string;
}

interface PurchaseItem {
  _id: string;
  courseTitle: string;
  courseId: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  enrolledAt: string;
  isCompleted: boolean;
}

interface DashboardSummary {
  user: {
    name: string;
    email: string;
    role: string;
  };
  stats: {
    totalEnrolled: number;
    inProgressCount: number;
    completedCount: number;
  };
  enrollments: EnrollmentItem[];
  continueLearning?: EnrollmentItem | null;
  purchaseHistory: PurchaseItem[];
}

export default function StudentDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadDashboard() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard/summary", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          setSummary(data);
        } else {
          setError(data.message || "Failed to load dashboard");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [isAuthenticated]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm font-medium text-muted">
          Loading your learning dashboard...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="card-surface p-8 max-w-md mx-auto my-12 text-center text-red">
        <p className="text-xs font-semibold mb-4">{error || "Failed to load dashboard"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, enrollments, continueLearning, purchaseHistory } = summary;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="card-surface p-6 sm:p-8 bg-gradient-to-r from-primary-tint/60 via-surface to-surface border border-border relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-tint text-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Student Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Welcome back, {user?.name || "Student"}! ðŸ‘‹
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Track your course progress, continue where you left off, and view certificates.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-gold" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Enrolled */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Enrolled Courses
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.totalEnrolled}
          </div>
          <p className="text-[11px] text-muted mt-0.5">Active course licenses</p>
        </div>

        {/* In Progress */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold-tint text-gold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold">
            {stats.inProgressCount}
          </div>
          <p className="text-[11px] text-muted mt-0.5">Ongoing curriculum tracks</p>
        </div>

        {/* Completed */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-green uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-green-tint text-green flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green">
            {stats.completedCount}
          </div>
          <p className="text-[11px] text-muted mt-0.5">Certificates earned</p>
        </div>
      </div>

      {/* Continue Learning Spotlight Card */}
      {continueLearning && (
        <div className="card-surface p-6 bg-gradient-to-r from-primary-tint/30 to-surface border-2 border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-gold" />
              Continue Learning Target
            </span>
            <span className="text-xs font-extrabold text-foreground">
              {continueLearning.progressPercent}% Completed
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <h2 className="text-lg font-extrabold text-foreground">
                {continueLearning.course.title}
              </h2>
              <p className="text-xs text-muted">
                Instructor: {continueLearning.course.instructor} â€¢{" "}
                {continueLearning.completedLessonsCount} of {continueLearning.totalLessons}{" "}
                lessons finished
              </p>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${continueLearning.progressPercent}%` }}
                />
              </div>
            </div>

            {continueLearning.nextLessonId && (
              <Link
                href={`/learn/${continueLearning.course._id}/${continueLearning.nextLessonId}`}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 inline-flex items-center gap-2 shrink-0 transition"
              >
                <span>Resume Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* All Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>My Learning Track</span>
          </h2>
        </div>

        {enrollments.length === 0 ? (
          <div className="card-surface p-12 text-center max-w-md mx-auto">
            <GraduationCap className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-foreground mb-1">
              No enrolled courses yet
            </h3>
            <p className="text-xs text-muted mb-6">
              Browse our course catalog to start learning and earning certificates.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => {
              const isFinished = item.progressPercent === 100;

              return (
                <div
                  key={item._id}
                  className="card-surface overflow-hidden flex flex-col border border-border hover:border-primary/30 transition"
                >
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {item.course.category?.name || "Course"}
                      </span>
                      {isFinished && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-green-tint text-green border border-green/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-foreground line-clamp-2">
                      {item.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted">Progress</span>
                        <span className="text-foreground">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isFinished ? "bg-green" : "bg-primary"
                          }`}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-2">
                      {isFinished ? (
                        <Link
                          href={`/certificate/${item.course._id}`}
                          className="w-full px-3 py-2 bg-gold-tint hover:bg-gold-tint/80 text-gold border border-gold/30 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Get Certificate</span>
                        </Link>
                      ) : (
                        item.nextLessonId && (
                          <Link
                            href={`/learn/${item.course._id}/${item.nextLessonId}`}
                            className="w-full px-3 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Continue Course</span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase & Receipt History */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Purchase & License History</span>
            </h2>
            <p className="text-xs text-muted">
              Receipts and order logs for your enrolled courses
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchaseHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                purchaseHistory.map((p) => (
                  <tr key={p._id} className="hover:bg-primary-tint/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground max-w-xs truncate">
                      {p.courseTitle}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {new Date(p.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {p.amount === 0 ? "Free" : `$${p.amount.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-tint text-green border border-green/30">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.isCompleted ? (
                        <Link
                          href={`/certificate/${p.courseId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-gold hover:underline"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                        </Link>
                      ) : (
                        <span className="text-muted text-[11px]">Enrolled</span>
                      )}
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


--- FILE: src/app/my-courses/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Loader2,
  Calendar,
  Award,
} from "lucide-react";
import { computeProgress } from "@/lib/progress";

interface EnrolledCourse {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  price: number;
  instructor?: string;
  category?: {
    _id: string;
    name: string;
  };
}

interface EnrollmentRecord {
  _id: string;
  course: EnrolledCourse;
  amount: number;
  paymentStatus: "Pending" | "Paid";
  completedLessons?: string[];
  completedAt?: string | null;
  enrolledAt: string;
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [courseLessonsCountMap, setCourseLessonsCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/my-courses");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchMyEnrollments() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/enrollments/me", { cache: "no-store" });
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.enrollments)) {
          // Filter only Paid enrollments for My Courses view
          const paidEnrollments = data.enrollments.filter(
            (e: EnrollmentRecord) => e.paymentStatus === "Paid" && e.course
          );
          setEnrollments(paidEnrollments);

          // Fetch lesson counts for each enrolled course
          const counts: Record<string, number> = {};
          await Promise.all(
            paidEnrollments.map(async (e: EnrollmentRecord) => {
              try {
                const lessonsRes = await fetch(`/api/courses/${e.course._id}/lessons`, { cache: "no-store" });
                const lessonsData = await lessonsRes.json();
                if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
                  counts[e.course._id] = lessonsData.lessons.length;
                }
              } catch (err) {
                console.error(`Failed to fetch lesson count for course ${e.course._id}`, err);
              }
            })
          );
          setCourseLessonsCountMap(counts);
        } else {
          setError(data.message || "Failed to load enrolled courses.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load enrolled courses.");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchMyEnrollments();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-muted">Loading your enrolled courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-primary-tint/40 via-surface to-background border-b border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                My Enrolled Courses
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                Welcome back, {user?.name}! Continue learning from your unlocked curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error ? (
          <div className="card-surface p-8 text-center max-w-lg mx-auto border-red/30">
            <p className="text-sm text-red font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md"
            >
              Retry
            </button>
          </div>
        ) : enrollments.length === 0 ? (
          /* Empty State */
          <div className="card-surface p-12 text-center max-w-md mx-auto my-8 border-dashed border-2">
            <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              No Enrolled Courses Yet
            </h2>
            <p className="text-xs sm:text-sm text-muted mb-6 leading-relaxed">
              Explore our full course catalog and enroll to unlock video lessons and start learning today.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Course Cards Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {enrollments.length} {enrollments.length === 1 ? "Active Course" : "Active Courses"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map(({ course, enrolledAt, completedLessons = [], _id: enrollmentId }) => {
                const totalLessons = courseLessonsCountMap[course._id] || 0;
                const completedCount = completedLessons.length;
                const progressPercent = computeProgress(completedCount, totalLessons);
                const isCompleted = progressPercent === 100;

                return (
                  <div
                    key={enrollmentId}
                    className="card-surface rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all flex flex-col justify-between group shadow-md"
                  >
                    <div>
                      {/* Media Thumbnail */}
                      {course.thumbnailUrl ? (
                        <div className="w-full h-44 overflow-hidden bg-black/5 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary-tint/60 to-surface flex flex-col items-center justify-center text-primary border-b border-border">
                          <GraduationCap className="w-10 h-10 text-gold mb-1" />
                          <span className="text-xs font-semibold">Enrolled Course</span>
                        </div>
                      )}

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          {course.category && (
                            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-primary-tint text-primary border border-primary/20">
                              {course.category.name}
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-gold-tint text-gold border border-gold/30 flex items-center gap-1">
                              <Award className="w-3 h-3" /> 100% Done
                            </span>
                          )}
                        </div>

                        <h2 className="text-base font-extrabold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h2>

                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] font-semibold text-muted">
                            <span>Progress</span>
                            <span className="text-foreground">
                              {completedCount} of {totalLessons} ({progressPercent}%)
                            </span>
                          </div>
                          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                isCompleted ? "bg-gold" : "bg-indigo-500"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted pt-1">
                          <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>
                            Enrolled {new Date(enrolledAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-5 pt-0 space-y-2">
                      {isCompleted && (
                        <Link
                          href={`/certificate/${course._id}`}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gold hover:bg-gold-dark text-slate-950 flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          <Award className="w-4 h-4" />
                          <span>Get Certificate</span>
                        </Link>
                      )}

                      <Link
                        href={`/courses/${course._id}`}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{isCompleted ? "Review Course" : "Continue Learning"}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


--- FILE: src/app/wishlist/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  BookOpen,
  GraduationCap,
  Trash2,
  ArrowRight,
  Loader2,
  Star,
  ShoppingBag,
} from "lucide-react";

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
  averageRating?: number;
  numReviews?: number;
}

interface WishlistItem {
  _id: string;
  course: Course;
  createdAt: string;
}

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/wishlist");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setWishlists(data.wishlists || []);
      } else {
        setError(data.message || "Failed to load wishlist");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleRemove = async (courseId: string) => {
    try {
      setWishlists((prev) => prev.filter((w) => w.course?._id !== courseId));
      await fetch(`/api/wishlist/${courseId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Saved Courses
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Manage your saved learning tracks and enroll when you are ready.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-xs font-semibold rounded-xl text-foreground hover:bg-black/5 transition"
        >
          <BookOpen className="w-4 h-4 text-primary" />
          <span>Browse Catalog</span>
        </Link>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface p-4 h-64 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="card-surface p-8 text-center text-red text-xs max-w-md mx-auto">
          {error}
        </div>
      ) : wishlists.length === 0 ? (
        <div className="card-surface p-12 text-center max-w-md mx-auto my-8">
          <Heart className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-foreground mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-muted mb-6">
            Click the heart icon on any course card in the catalog to save it for later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Courses</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((w) => {
            const course = w.course;
            if (!course) return null;

            return (
              <div
                key={w._id}
                className="card-surface overflow-hidden flex flex-col border border-border hover:border-primary/30 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 bg-primary-tint/50 overflow-hidden flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-12 h-12 text-gold opacity-60" />
                  )}

                  <button
                    onClick={() => handleRemove(course._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white hover:text-red-400 backdrop-blur-md transition shadow-md"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {course.category?.name || "General"}
                  </span>

                  <h3 className="text-sm font-bold text-foreground line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-base font-extrabold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </span>

                    <Link
                      href={`/courses/${course._id}`}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl inline-flex items-center gap-1 transition shadow-sm"
                    >
                      <span>View & Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/checkout/success/page.tsx ---
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle, PlayCircle, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const initialCourseId = searchParams.get("courseId");

  const [status, setStatus] = useState<"polling" | "success" | "timeout" | "error">("polling");
  const [errorMessage, setErrorMessage] = useState("");
  const [courseId, setCourseId] = useState<string | null>(initialCourseId);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const verifyAndCheck = async () => {
      // 1. Direct Stripe verification via server if sessionId is available
      if (sessionId) {
        try {
          const verifyRes = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
          const verifyData = await verifyRes.json();

          if (verifyData.success && verifyData.paymentStatus === "Paid") {
            if (!isSubscribed) return;
            const targetCourseId = verifyData.courseId || initialCourseId;
            if (targetCourseId) setCourseId(targetCourseId);
            setStatus("success");

            if (targetCourseId) {
              try {
                const courseRes = await fetch(`/api/courses/${targetCourseId}`);
                const courseData = await courseRes.json();
                if (courseData.success && courseData.course?.lessons?.length > 0) {
                  if (isSubscribed) setFirstLessonId(courseData.course.lessons[0]._id);
                }
              } catch (e) {
                console.error("Failed to fetch course details for redirect", e);
              }
            }
            return;
          }
        } catch (e) {
          console.error("Direct session verification error:", e);
        }
      }

      // 2. Fallback polling if verify endpoint didn't immediately confirm
      const targetCourseId = courseId || initialCourseId;
      if (!targetCourseId) {
        if (isSubscribed) setStatus("success");
        return;
      }

      let attempts = 0;
      const maxAttempts = 6;
      let intervalId: NodeJS.Timeout;

      const checkEnrollment = async () => {
        attempts++;
        try {
          const res = await fetch(`/api/enrollments/me?courseId=${targetCourseId}`);
          const data = await res.json();

          if (data.success && data.paymentStatus === "Paid") {
            if (!isSubscribed) return;
            setStatus("success");
            clearInterval(intervalId);

            try {
              const courseRes = await fetch(`/api/courses/${targetCourseId}`);
              const courseData = await courseRes.json();
              if (courseData.success && courseData.course?.lessons?.length > 0) {
                if (isSubscribed) setFirstLessonId(courseData.course.lessons[0]._id);
              }
            } catch (e) {
              console.error("Failed to fetch course details for redirect", e);
            }
            return;
          }

          if (attempts >= maxAttempts) {
            if (isSubscribed) setStatus("timeout");
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error polling enrollment status:", err);
          if (attempts >= maxAttempts) {
            if (isSubscribed) setStatus("timeout");
            clearInterval(intervalId);
          }
        }
      };

      checkEnrollment();
      intervalId = setInterval(checkEnrollment, 2000);
    };

    verifyAndCheck();

    return () => {
      isSubscribed = false;
    };
  }, [sessionId, initialCourseId, courseId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        {status === "polling" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-slate-400 text-sm mb-4">
              We received your Stripe payment! Confirming your course enrollment...
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enrollment Confirmed!</h2>
            <p className="text-slate-300 text-sm mb-6">
              Thank you for your purchase. You now have full access to this course.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {courseId && firstLessonId ? (
                <Link
                  href={`/learn/${courseId}/${firstLessonId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  <PlayCircle className="w-5 h-5" /> Start Learning
                </Link>
              ) : courseId ? (
                <Link
                  href={`/courses/${courseId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  Go to Course Page <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {status === "timeout" && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Still Processing...</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your payment was received, but enrollment activation is taking a moment. Please refresh this page or check your dashboard shortly.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl border border-slate-700 transition"
              >
                Refresh Status
              </button>
              {courseId && (
                <Link
                  href={`/courses/${courseId}`}
                  className="w-full text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                >
                  Return to Course Page
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}


--- FILE: src/app/admin/layout.tsx ---
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  GraduationCap,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">
            Verifying administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: TrendingUp,
      exact: false,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      exact: false,
    },
    {
      label: "Q&A Discussions",
      href: "/admin/questions",
      icon: MessageSquare,
      exact: false,
    },
  ];

  const isNavActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border md:min-h-screen flex flex-col shrink-0">
        {/* Admin Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground tracking-tight leading-tight">
                Admin Portal
              </h2>
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                EduPulse Core
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-gold" : "text-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="px-3 py-2 rounded-xl bg-primary-tint/40 border border-primary/10 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gold font-semibold uppercase">
                Administrator
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-primary hover:bg-primary-tint/60 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Storefront
            </span>
            <ExternalLink className="w-3 h-3 text-muted" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}


--- FILE: src/app/admin/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderTree,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  Users,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: string;
  price: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [courseRes, catRes, userRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/categories"),
          fetch("/api/admin/users?limit=1"),
        ]);

        const courseData = await courseRes.json();
        const catData = await catRes.json();
        const userData = await userRes.json();

        if (courseData.success && Array.isArray(courseData.courses)) {
          setCourses(courseData.courses);
        }
        if (catData.success && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        }
        if (userData.success && typeof userData.total === "number") {
          setTotalUsers(userData.total);
        }
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;
  const totalCategories = categories.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-tint text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administration Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Dashboard & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Monitor learning content, catalog status, users, and course taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Revenue Analytics</span>
          </Link>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-foreground hover:bg-black/5 transition-all shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Manage Users</span>
          </Link>

          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            <span>Manage Courses</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalUsers}
          </div>
          <p className="text-[11px] text-muted mt-1">Students & Admins</p>
        </div>

        {/* Total Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Courses
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Total catalog items</p>
        </div>

        {/* Published Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-green uppercase tracking-wider">
              Published
            </span>
            <div className="w-9 h-9 rounded-xl bg-green-tint text-green flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green">
            {loading ? "..." : publishedCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Live in public catalog</p>
        </div>

        {/* Drafts */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Drafts
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-tint text-gold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold">
            {loading ? "..." : draftCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Unpublished courses</p>
        </div>

        {/* Categories */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCategories}
          </div>
          <p className="text-[11px] text-muted mt-1">Curated taxonomy tracks</p>
        </div>
      </div>

      {/* Recent Courses Table Preview */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Recent Courses
            </h2>
            <p className="text-xs text-muted">
              Latest additions to the LMS repository
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No courses created yet. Click &quot;Manage Courses&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <tr key={course._id} className="hover:bg-primary-tint/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {course.category?.name || "â€”"}
                    </td>
                    <td className="py-3.5 px-4 text-muted">{course.instructor}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-2.5 h-2.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/courses/${course._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
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


--- FILE: src/app/admin/analytics/page.tsx ---
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


--- FILE: src/app/admin/categories/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Notifications / Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirm delete dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to create category");
        return;
      }

      setSuccessMessage(`Category "${data.category.name}" created successfully!`);
      setNewCategoryName("");
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Plainly display backend error (e.g. courses still reference it)
        setErrorMessage(data.message || "Failed to delete category");
        setCategoryToDelete(null);
        return;
      }

      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <FolderTree className="w-3.5 h-3.5" />
          Category Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Course Categories
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Organize courses into structured topics and disciplines.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Create Form & Categories Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="card-surface p-6">
          <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add New Category
          </h2>
          <p className="text-xs text-muted mb-4">
            Category slug will be generated automatically on submission.
          </p>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label
                htmlFor="categoryName"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Category Name <span className="text-red">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Cloud Computing"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newCategoryName.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-gold" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories Table Column */}
        <div className="lg:col-span-2 card-surface overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Existing Categories
              </h2>
              <p className="text-xs text-muted">
                {categories.length} total active categories
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No categories found. Create your first category using the form.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-primary-tint/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted bg-surface px-2 py-0.5 rounded border border-border">
                          <Hash className="w-2.5 h-2.5" />
                          {cat.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted">
                        {new Date(cat.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          disabled={deletingId === cat._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red hover:bg-red-tint transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Category?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete category{" "}
              <strong className="text-foreground">
                &quot;{categoryToDelete.name}&quot;
              </strong>
              ? If any courses are assigned to this category, deletion will be
              prevented by the server.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/admin/courses/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  DollarSign,
  GraduationCap,
  Video,
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
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number | string;
  thumbnailUrl: string;
}

const initialFormState: CourseFormData = {
  title: "",
  description: "",
  category: "",
  instructor: "",
  level: "Beginner",
  price: 0,
  thumbnailUrl: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete State
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toggle Publish loading tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesRes, catRes] = await Promise.all([
        fetch("/api/admin/courses", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);

      const coursesData = await coursesRes.json();
      const catData = await catRes.json();

      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      ...initialFormState,
      category: categories.length > 0 ? categories[0]._id : "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?._id || "",
      instructor: course.instructor,
      level: course.level,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl || "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.instructor.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const endpoint = editingCourse
        ? `/api/courses/${editingCourse._id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        instructor: formData.instructor.trim(),
        level: formData.level,
        price: Number(formData.price),
        thumbnailUrl: formData.thumbnailUrl.trim(),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Operation failed");
        return;
      }

      setSuccessMessage(
        editingCourse
          ? `Course "${data.course.title}" updated successfully.`
          : `Course "${data.course.title}" created successfully as Draft.`
      );

      closeModal();
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      setTogglingId(course._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const newStatus = !course.isPublished;
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update publication status");
        return;
      }

      setSuccessMessage(
        `Course "${course.title}" is now ${
          newStatus ? "Published (Public)" : "Draft (Hidden)"
        }.`
      );

      // Local state update for snappy UI
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isPublished: newStatus } : c))
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/courses/${courseToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to delete course");
        setCourseToDelete(null);
        return;
      }

      setSuccessMessage(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Manage Courses
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Create, configure, publish, and update course offerings.
          </p>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              All Courses Repository
            </h2>
            <p className="text-xs text-muted">
              {courses.length} total courses registered
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Toggle Publish</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    No courses found. Click &quot;Create New Course&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-primary-tint/20 transition-colors"
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="font-bold text-foreground truncate">
                        {course.title}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {course.slug}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary-tint text-primary">
                        {course.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Instructor */}
                    <td className="py-3.5 px-4 text-muted font-medium">
                      {course.instructor}
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>

                    {/* Publish/Unpublish Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={togglingId === course._id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          course.isPublished
                            ? "bg-gold-tint text-gold hover:bg-gold/20"
                            : "bg-green-tint text-green hover:bg-green/20"
                        }`}
                        title={
                          course.isPublished
                            ? "Click to unpublish (switch to draft)"
                            : "Click to publish (make public)"
                        }
                      >
                        {togglingId === course._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : course.isPublished ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-gold" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-green" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/courses/${course._id}/lessons`}
                          className="p-1.5 rounded-lg text-primary hover:text-white hover:bg-primary transition-colors bg-primary-tint"
                          title="Manage Lessons & Videos"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/courses/${course._id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="View Course Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCourseToDelete(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red-tint transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-surface p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                  <GraduationCap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingCourse ? "Edit Course" : "Create New Course"}
                  </h3>
                  <p className="text-xs text-muted">
                    {editingCourse
                      ? "Update existing course attributes"
                      : "New courses default to Draft mode until published"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Modern Full-Stack Development with Next.js"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Description <span className="text-red">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Comprehensive description of what students will master..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Category and Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category <span className="text-red">*</span>
                  </label>
                  {categories.length === 0 ? (
                    <div className="text-xs text-red p-2 bg-red-tint rounded-lg">
                      No categories found. Please create a category first.
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Instructor Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Jenkins"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Level, Price, Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-muted text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Thumbnail Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || categories.length === 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-gold" />
                      <span>{editingCourse ? "Update Course" : "Save Course"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Course?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{courseToDelete.title}&quot;
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/admin/questions/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  BookOpen,
  User,
  Send,
  Loader2,
  Trash2,
  CornerDownRight,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface AdminQuestionReply {
  _id?: string;
  user?: {
    name: string;
  };
  text: string;
  createdAt: string;
}

interface AdminQuestionItem {
  _id: string;
  course?: {
    _id: string;
    title: string;
    slug: string;
  };
  lesson?: {
    _id: string;
    title: string;
    order: number;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  question: string;
  replies?: AdminQuestionReply[];
  createdAt: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Admin reply inputs (questionId -> text)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/questions", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        setError(data.message || "Failed to load admin questions queue.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSendReply = async (questionId: string) => {
    const text = replyTexts[questionId] || "";
    if (!text.trim()) return;

    try {
      setSubmittingId(questionId);
      const res = await fetch(`/api/questions/${questionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReplyTexts((prev) => ({ ...prev, [questionId]: "" }));
        fetchQuestions();
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      }
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Q&A Queue & Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Student Questions Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Review and reply to student questions across all courses and video lessons.
          </p>
        </div>
      </div>

      {/* Main Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card-surface p-12 text-center text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-xs font-medium">Loading student questions queue...</p>
          </div>
        ) : error ? (
          <div className="card-surface p-8 text-center text-red text-xs">
            {error}
          </div>
        ) : questions.length === 0 ? (
          <div className="card-surface p-12 text-center text-muted">
            <MessageSquare className="w-10 h-10 text-gold mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-foreground mb-1">
              No questions found
            </h3>
            <p className="text-xs text-muted">
              All student inquiries across your course catalog have been answered.
            </p>
          </div>
        ) : (
          questions.map((q) => {
            const hasReply = q.replies && q.replies.length > 0;

            return (
              <div
                key={q._id}
                className="card-surface p-5 sm:p-6 space-y-4 border border-border hover:border-primary/30 transition-all"
              >
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {q.course?.title || "Unknown Course"}
                    </span>
                    <span className="text-muted">â€¢</span>
                    <span className="text-foreground font-semibold">
                      Lesson #{q.lesson?.order}: {q.lesson?.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasReply ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-tint text-green border border-green/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Answered
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-tint text-gold border border-gold/30 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Pending Reply
                      </span>
                    )}

                    {q.course?._id && q.lesson?._id && (
                      <Link
                        href={`/learn/${q.course._id}/${q.lesson._id}`}
                        target="_blank"
                        className="text-muted hover:text-primary p-1 transition"
                        title="View Lesson Player Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="text-muted hover:text-red p-1 transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                      {q.user?.name ? q.user.name.charAt(0).toUpperCase() : "S"}
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {q.user?.name || "Student"}{" "}
                      <span className="text-muted font-normal">({q.user?.email})</span>
                    </span>
                    <span className="text-[10px] text-muted ml-auto">
                      {new Date(q.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed pl-8 whitespace-pre-line">
                    {q.question}
                  </p>
                </div>

                {/* Existing Replies */}
                {hasReply && (
                  <div className="pl-8 space-y-2">
                    {q.replies?.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-primary-tint/20 border border-primary/20 rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-primary font-bold">
                          <span className="flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            {r.user?.name || "Instructor"}
                          </span>
                          <span className="text-[10px] text-muted font-normal">
                            {new Date(r.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Input */}
                <div className="pt-2 flex items-center gap-2 pl-8">
                  <input
                    type="text"
                    placeholder="Type official instructor reply..."
                    value={replyTexts[q._id] || ""}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({
                        ...prev,
                        [q._id]: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleSendReply(q._id)}
                    disabled={submittingId === q._id}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    {submittingId === q._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


--- FILE: src/app/admin/users/page.tsx ---
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


