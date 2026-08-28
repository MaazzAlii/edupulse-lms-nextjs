"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
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
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-muted">Loading your enrolled courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

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
