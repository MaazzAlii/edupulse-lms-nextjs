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
