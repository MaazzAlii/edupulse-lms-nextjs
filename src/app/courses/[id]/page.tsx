"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  Play,
  AlertCircle,
  Video,
  CheckCircle2,
  Loader2,
  X,
  CreditCard,
  PlayCircle,
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

interface LessonSummary {
  _id: string;
  title: string;
  order: number;
  isPreview: boolean;
  durationSeconds: number;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Enrollment & Checkout state
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showCancelledBanner, setShowCancelledBanner] = useState<boolean>(
    searchParams.get("checkout") === "cancelled"
  );

  useEffect(() => {
    async function loadCourseAndLessons() {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
          fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();

        if (courseRes.status === 404 || !courseData.success || !courseData.course) {
          setError("Course not found or is currently unavailable.");
          setCourse(null);
        } else {
          setCourse(courseData.course);
        }

        if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
          setLessons(lessonsData.lessons);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourseAndLessons();
    }
  }, [courseId]);

  // Check enrollment status if user is authenticated
  useEffect(() => {
    async function checkEnrollment() {
      if (!isAuthenticated || !courseId) return;
      try {
        const res = await fetch(`/api/enrollments/me?courseId=${courseId}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.paymentStatus === "Paid") {
          setIsEnrolled(true);
        }
      } catch (e) {
        console.error("Failed to check enrollment status:", e);
      }
    }

    checkEnrollment();
  }, [isAuthenticated, courseId]);

  const handleEnrollClick = async () => {
    setCheckoutError(null);

    // 1. If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    // 2. Trigger Checkout API
    try {
      setCheckoutLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.message === "You already own this course.") {
          setIsEnrolled(true);
        }
        setCheckoutError(data.message || "Failed to initiate checkout.");
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setCheckoutError("No checkout redirect URL received.");
      }
    } catch (err: any) {
      setCheckoutError(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

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

  const firstLesson = lessons.length > 0 ? lessons[0] : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Checkout Cancelled Banner */}
      {showCancelledBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 py-3 px-4 text-center text-sm font-medium flex items-center justify-center gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Checkout cancelled — you were not charged.</span>
          <button
            onClick={() => setShowCancelledBanner(false)}
            className="p-1 hover:bg-amber-500/20 rounded-md transition text-amber-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

            {/* Curriculum View */}
            <div className="card-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Course Curriculum
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-tint text-primary">
                  {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>

              {lessons.length === 0 ? (
                <div className="p-8 bg-primary-tint/20 rounded-xl border border-border text-center">
                  <Video className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    Curriculum In Progress
                  </h3>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    The lessons for this course are currently being published by the instructor.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        lesson.isPreview || isEnrolled
                          ? "bg-surface hover:bg-primary-tint/30 border-border hover:border-primary/40 cursor-pointer"
                          : "bg-surface/50 border-border/60 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            lesson.isPreview || isEnrolled
                              ? "bg-primary text-white shadow-sm"
                              : "bg-border text-muted"
                          }`}
                        >
                          #{lesson.order}
                        </div>
                        <span
                          className={`text-sm font-semibold truncate ${
                            lesson.isPreview || isEnrolled ? "text-foreground" : "text-muted"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.isPreview ? (
                          <Link
                            href={`/learn/${course._id}/${lesson._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-tint text-green hover:bg-green/20 border border-green/30 transition-colors shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Preview</span>
                          </Link>
                        ) : isEnrolled ? (
                          <Link
                            href={`/learn/${course._id}/${lesson._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </Link>
                        ) : (
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-border/50 text-muted select-none"
                            title="Enroll to unlock"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column / Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-surface p-6 sm:p-7 shadow-xl shadow-primary/5 border-primary/20 space-y-6">
              {/* Media Preview */}
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

              {/* Checkout Error Message */}
              {checkoutError && (
                <div className="p-3 bg-red-tint/50 border border-red/30 rounded-xl text-red text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Real Enroll / Start Learning Button */}
              <div className="space-y-2">
                {isEnrolled ? (
                  firstLesson ? (
                    <Link
                      href={`/learn/${course._id}/${firstLesson._id}`}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <PlayCircle className="w-5 h-5" />
                      <span>Start Learning Now</span>
                    </Link>
                  ) : (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center">
                      ✓ You own this course
                    </div>
                  )
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    disabled={checkoutLoading}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preparing Checkout...</span>
                      </>
                    ) : course.price === 0 ? (
                      <>
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span>Enroll for Free</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Enroll in Course (${course.price.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                )}
                {!isEnrolled && (
                  <p className="text-[11px] text-center text-muted font-medium">
                    ⚡ Instant access • Secure 256-bit Stripe checkout
                  </p>
                )}
              </div>

              {/* Course Highlights */}
              <div className="pt-4 border-t border-border space-y-3 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Curriculum:</span>
                  <span className="font-semibold text-foreground">
                    {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                  </span>
                </div>
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
