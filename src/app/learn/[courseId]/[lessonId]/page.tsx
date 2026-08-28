"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Lock,
  Film,
  BookOpen,
  Layers,
  GraduationCap,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
} from "lucide-react";

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
  instructor: string;
  price: number;
}

interface LessonItem {
  _id: string;
  course: string;
  title: string;
  order: number;
  videoUrl?: string;
  durationSeconds: number;
  isPreview: boolean;
}

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId, lessonId } = resolvedParams;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseAndLessons() {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
          fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();

        if (!courseRes.ok || !courseData.success || !courseData.course) {
          setError(courseData.message || "Course not found");
          return;
        }
        setCourse(courseData.course);

        if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
          setLessons(lessonsData.lessons);
          const found = lessonsData.lessons.find(
            (l: LessonItem) => l._id === lessonId
          );
          if (found) {
            setCurrentLesson(found);
          } else if (lessonsData.lessons.length > 0) {
            setCurrentLesson(lessonsData.lessons[0]);
          } else {
            setError("No lessons found for this course.");
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load player data");
      } finally {
        setLoading(false);
      }
    }

    if (courseId && lessonId) {
      fetchCourseAndLessons();
    }
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted">Loading lesson video player...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-tint text-red mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Lesson Unavailable
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            {error || "The requested lesson could not be found."}
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Course Overview</span>
          </Link>
        </div>
      </div>
    );
  }

  // Find index in lessons array for prev / next
  const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // Gating rule: lesson has a non-empty videoUrl returned by backend guard
  const isPlayable = Boolean(currentLesson.videoUrl && currentLesson.videoUrl.trim().length > 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Learning Bar */}
      <div className="border-b border-border bg-surface sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/courses/${courseId}`}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-black/5 transition-colors shrink-0"
              title="Return to Course Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <span className="text-[11px] font-bold text-primary block truncate uppercase tracking-wider">
                {course.title}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-foreground truncate">
                Lesson {currentLesson.order}: {currentLesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Prev Lesson Button */}
            {prevLesson ? (
              <Link
                href={`/learn/${courseId}/${prevLesson._id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground bg-background hover:bg-black/5 border border-border transition-colors"
                title={`Previous: ${prevLesson.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted bg-border/40 border border-border cursor-not-allowed opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {/* Next Lesson Button */}
            {nextLesson ? (
              <Link
                href={`/learn/${courseId}/${nextLesson._id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
                title={`Next: ${nextLesson.title}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted bg-border/40 border border-border cursor-not-allowed opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Video Screen or Locked Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-surface overflow-hidden p-2 sm:p-3 shadow-lg">
              {isPlayable ? (
                <div className="rounded-xl overflow-hidden bg-black shadow-2xl relative aspect-video flex items-center justify-center">
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    src={currentLesson.videoUrl}
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                </div>
              ) : (
                /* Locked State Placeholder */
                <div className="rounded-xl bg-gradient-to-b from-surface via-slate-900 to-background border border-border p-8 sm:p-12 text-center aspect-video flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 shadow-md shadow-amber-500/10">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Enrolled Students Only
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                    This lesson is locked
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                    Full video streaming access and learning resources for Lesson #{currentLesson.order} unlock immediately upon course enrollment.
                  </p>
                  <Link
                    href={`/courses/${courseId}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Enroll Now to Unlock Course ({course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`})</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Lesson Details Card */}
            <div className="card-surface p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-primary-tint text-primary text-xs font-bold">
                  Lesson #{currentLesson.order}
                </span>
                {currentLesson.isPreview ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-green-tint text-green text-xs font-bold border border-green/30">
                    Free Preview
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-border text-muted text-xs font-semibold">
                    Full Course Access
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Instructor: <strong className="text-foreground">{course.instructor}</strong> • Part of the{" "}
                <Link
                  href={`/courses/${courseId}`}
                  className="text-primary hover:underline font-semibold"
                >
                  {course.title}
                </Link>{" "}
                curriculum.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Curriculum Navigation */}
          <div className="lg:col-span-1">
            <div className="card-surface p-5 sm:p-6 space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Course Content
                </h3>
                <span className="text-xs text-muted font-medium">
                  {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                {lessons.map((lesson) => {
                  const isActive = lesson._id === currentLesson._id;

                  return (
                    <Link
                      key={lesson._id}
                      href={`/learn/${courseId}/${lesson._id}`}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 font-bold"
                          : "bg-surface hover:bg-primary-tint/30 text-foreground border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-primary-tint text-primary"
                          }`}
                        >
                          {lesson.order}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {lesson.isPreview ? (
                          <span
                            className={`p-1 rounded-md text-[10px] ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "text-green bg-green-tint border border-green/30"
                            }`}
                            title="Preview Available"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </span>
                        ) : (
                          <span
                            className={`p-1 rounded-md text-[10px] ${
                              isActive ? "text-white/80" : "text-muted"
                            }`}
                            title="Locked"
                          >
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
