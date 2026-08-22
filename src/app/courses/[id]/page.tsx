"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  AlertCircle,
} from "lucide-react";

interface CourseDetail {
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

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/courses/${courseId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (res.status === 404 || !data.success || !data.course) {
          setError("Course not found or is currently unavailable.");
          setCourse(null);
        } else {
          setCourse(data.course);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-tint text-red mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Course Not Found
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            {error ||
              "The course you are looking for does not exist or has been unpublished by the instructor."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Breadcrumb Banner */}
      <section className="bg-gradient-to-b from-primary-tint/50 via-surface to-background border-b border-border py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {course.category && (
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-primary-tint text-primary border border-primary/20">
                {course.category.name}
              </span>
            )}
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                course.level === "Beginner"
                  ? "bg-green-tint text-green border border-green/30"
                  : course.level === "Intermediate"
                  ? "bg-gold-tint text-gold border border-gold/30"
                  : "bg-red-tint text-red border border-red/30"
              }`}
            >
              {course.level}
            </span>
            {!course.isPublished && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gold-tint text-gold border border-gold/30">
                Draft (Admin Preview)
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight max-w-4xl">
            {course.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {course.instructor.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs text-muted block">Instructor</span>
                <span className="font-semibold text-foreground">
                  {course.instructor}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>
                Added on{" "}
                {new Date(course.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                About This Course
              </h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {course.description}
              </p>
            </div>

            {/* Curriculum Placeholder (Part 3 Scope) */}
            <div className="card-surface p-6 sm:p-8 border-dashed">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Course Curriculum
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-tint text-primary">
                  Part 3 Preview
                </span>
              </div>

              <div className="p-6 bg-primary-tint/30 rounded-xl border border-primary/10 text-center">
                <Sparkles className="w-8 h-8 text-gold mx-auto mb-2" />
                <h3 className="text-sm font-bold text-foreground mb-1">
                  Lessons coming in Part 3
                </h3>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Interactive lesson modules, video streaming, attachments, and
                  completion tracking will be integrated in Part 3.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column / Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-surface p-6 sm:p-7 shadow-xl shadow-primary/5 border-primary/20 space-y-6">
              {/* Media Preview if exists */}
              {course.thumbnailUrl ? (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-primary-tint/40 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-36 rounded-xl bg-primary-tint/40 flex flex-col items-center justify-center text-primary/60 border border-border">
                  <GraduationCap className="w-10 h-10 text-gold mb-1" />
                  <span className="text-xs font-semibold">Course Preview</span>
                </div>
              )}

              {/* Pricing Display */}
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Tuition & Access
                </span>
                <div className="flex items-baseline gap-2">
                  {course.price === 0 ? (
                    <span className="text-3xl font-black text-green">Free</span>
                  ) : (
                    <span className="text-3xl font-black text-foreground">
                      ${course.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-muted">one-time payment</span>
                </div>
              </div>

              {/* Visibly Disabled Enroll Button with explicit caption */}
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gray-200 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 shadow-none transition-none"
                  title="Payments coming in Part 4"
                >
                  <Lock className="w-4 h-4" />
                  <span>Enroll in Course</span>
                </button>
                <p className="text-[11px] text-center text-muted font-medium">
                  🔒 Payments & enrollment coming in Part 4
                </p>
              </div>

              {/* Course Highlights */}
              <div className="pt-4 border-t border-border space-y-3 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-semibold text-foreground">
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-semibold text-foreground">
                    {course.instructor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-foreground">
                    {course.category?.name || "General"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Access:</span>
                  <span className="font-semibold text-foreground">
                    Lifetime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
