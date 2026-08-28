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
              Welcome back, {user?.name || "Student"}! 👋
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
                Instructor: {continueLearning.course.instructor} •{" "}
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
