"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
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
  Award,
  Check,
  MessageSquare,
  Send,
  Trash2,
  CornerDownRight,
} from "lucide-react";
import { computeProgress } from "@/lib/progress";

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

interface QuestionReply {
  _id?: string;
  user: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;
}

interface QuestionItem {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  question: string;
  replies: QuestionReply[];
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

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  }
  return null;
}

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId, lessonId } = resolvedParams;
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Progress & Enrollment state
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);

  // Q&A State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionInput, setQuestionInput] = useState<string>("");
  const [questionSubmitting, setQuestionSubmitting] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Admin reply inputs map (questionId -> text)
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replySubmittingId, setReplySubmittingId] = useState<string | null>(null);

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

  // Fetch student enrollment & progress data
  useEffect(() => {
    async function checkEnrollmentAndProgress() {
      if (!isAuthenticated || !courseId) return;
      try {
        const res = await fetch(`/api/enrollments/me?courseId=${courseId}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.paymentStatus === "Paid") {
          setIsEnrolled(true);
          if (data.enrollment && Array.isArray(data.enrollment.completedLessons)) {
            setCompletedLessonIds(data.enrollment.completedLessons.map((id: any) => id.toString()));
          }
        }
      } catch (e) {
        console.error("Failed to check enrollment progress:", e);
      }
    }

    checkEnrollmentAndProgress();
  }, [isAuthenticated, courseId]);

  // Fetch lesson questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!lessonId) return;
      try {
        const res = await fetch(`/api/lessons/${lessonId}/questions`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        }
      } catch (e) {
        console.error("Failed to fetch questions:", e);
      }
    }

    fetchQuestions();
  }, [lessonId]);

  // Toggle lesson completion state
  const handleToggleComplete = async () => {
    if (!currentLesson || !isEnrolled) return;
    const isCompleted = completedLessonIds.includes(currentLesson._id);

    try {
      setProgressLoading(true);
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson._id,
          completed: !isCompleted,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (!isCompleted) {
          setCompletedLessonIds((prev) => [...prev, currentLesson._id]);
        } else {
          setCompletedLessonIds((prev) => prev.filter((id) => id !== currentLesson._id));
        }
      }
    } catch (e) {
      console.error("Failed to toggle completion:", e);
    } finally {
      setProgressLoading(false);
    }
  };

  // Submit Q&A Question
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !currentLesson) return;

    try {
      setQuestionSubmitting(true);
      setQuestionError(null);

      const res = await fetch(`/api/lessons/${currentLesson._id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setQuestionError(data.message || "Failed to post question");
        return;
      }

      setQuestionInput("");
      setQuestions((prev) => [data.question, ...prev]);
    } catch (err: any) {
      setQuestionError(err.message || "Failed to post question");
    } finally {
      setQuestionSubmitting(false);
    }
  };

  // Submit Admin Reply
  const handleReplySubmit = async (questionId: string) => {
    const text = replyInputs[questionId] || "";
    if (!text.trim()) return;

    try {
      setReplySubmittingId(questionId);
      const res = await fetch(`/api/questions/${questionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? data.question : q))
        );
        setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
      }
    } catch (e) {
      console.error("Failed to post reply:", e);
    } finally {
      setReplySubmittingId(null);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      }
    } catch (e) {
      console.error("Failed to delete question:", e);
    }
  };

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

  // Compute overall progress
  const progressPercent = computeProgress(completedLessonIds.length, lessons.length);
  const isCurrentCompleted = completedLessonIds.includes(currentLesson._id);
  const canAskQuestion = currentLesson.isPreview || isEnrolled;

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
          {/* Main Content: Video Screen & Q&A Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* 100% Completion Banner */}
            {isEnrolled && progressPercent === 100 && (
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-gold/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground">
                      Course Complete! 🎉
                    </h3>
                    <p className="text-xs text-muted">
                      Congratulations! You have completed 100% of this course curriculum.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/certificate/${courseId}`}
                  className="px-4 py-2 bg-gold hover:bg-gold-dark text-slate-950 font-bold text-xs rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>View Certificate</span>
                </Link>
              </div>
            )}

            <div className="card-surface overflow-hidden p-2 sm:p-3 shadow-lg">
              {isPlayable ? (
                <div className="rounded-xl overflow-hidden bg-black shadow-2xl relative aspect-video flex items-center justify-center">
                  {currentLesson.videoUrl && getYouTubeEmbedUrl(currentLesson.videoUrl) ? (
                    <iframe
                      className="w-full h-full object-contain border-0"
                      src={getYouTubeEmbedUrl(currentLesson.videoUrl) || ""}
                      title={currentLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                      src={currentLesson.videoUrl}
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  )}
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

            {/* Lesson Details Card & Mark Complete Action */}
            <div className="card-surface p-6 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
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

                {/* Mark as Complete Toggle */}
                {isEnrolled && (
                  <button
                    onClick={handleToggleComplete}
                    disabled={progressLoading}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isCurrentCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    }`}
                  >
                    {progressLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isCurrentCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isCurrentCompleted ? "Completed ✓" : "Mark as Complete"}</span>
                  </button>
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

            {/* Q&A / Discussions Panel */}
            <div className="card-surface p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Lesson Q&A & Discussions ({questions.length})</span>
                </h3>
              </div>

              {/* Ask Question Form */}
              {canAskQuestion ? (
                <form onSubmit={handleQuestionSubmit} className="space-y-3">
                  {questionError && (
                    <div className="p-3 bg-red-tint/50 border border-red/30 rounded-xl text-red text-xs font-medium">
                      {questionError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question about this lesson..."
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      required
                      className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition"
                    />
                    <button
                      type="submit"
                      disabled={questionSubmitting}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 transition"
                    >
                      {questionSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Ask</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-surface border border-border rounded-xl text-xs text-muted text-center">
                  Enroll in this course to participate in lesson Q&A discussions.
                </div>
              )}

              {/* Questions List */}
              {questions.length === 0 ? (
                <p className="text-xs text-muted italic text-center py-6">
                  No questions asked yet for this lesson.
                </p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => {
                    const isAuthor = q.user?._id === user?._id;
                    const isAdmin = user?.role === "admin";

                    return (
                      <div
                        key={q._id}
                        className="p-4 bg-surface border border-border rounded-2xl space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                              {q.user?.name ? q.user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-foreground block">
                                {q.user?.name || "Student"}
                              </span>
                              <span className="text-[10px] text-muted">
                                {getRelativeTime(q.createdAt)}
                              </span>
                            </div>
                          </div>

                          {(isAuthor || isAdmin) && (
                            <button
                              onClick={() => handleDeleteQuestion(q._id)}
                              className="text-muted hover:text-red p-1 rounded-lg transition"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                          {q.question}
                        </p>

                        {/* Threaded Replies */}
                        {q.replies && q.replies.length > 0 ? (
                          <div className="space-y-2 pl-4 border-l-2 border-primary/30 pt-1">
                            {q.replies.map((reply, idx) => (
                              <div key={idx} className="p-3 bg-background/80 rounded-xl space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-primary flex items-center gap-1">
                                    <CornerDownRight className="w-3 h-3" />
                                    {reply.user?.name || "Instructor"}
                                  </span>
                                  <span className="text-[10px] text-muted">
                                    {getRelativeTime(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                  {reply.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted italic pl-4 border-l-2 border-border">
                            No replies yet
                          </div>
                        )}

                        {/* Admin Inline Reply Box */}
                        {isAdmin && (
                          <div className="pt-2 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Write admin reply..."
                              value={replyInputs[q._id] || ""}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [q._id]: e.target.value,
                                }))
                              }
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                            <button
                              onClick={() => handleReplySubmit(q._id)}
                              disabled={replySubmittingId === q._id}
                              className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                            >
                              {replySubmittingId === q._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Reply"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Curriculum Navigation & Progress Bar */}
          <div className="lg:col-span-1">
            <div className="card-surface p-5 sm:p-6 space-y-4 sticky top-20">
              {/* Sidebar Header & Progress Bar */}
              <div className="space-y-3 pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Course Content
                  </h3>
                  <span className="text-xs text-muted font-medium">
                    {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </div>

                {isEnrolled && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted">Your Progress</span>
                      <span className="text-primary">{completedLessonIds.length} of {lessons.length} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
                {lessons.map((lesson) => {
                  const isActive = lesson._id === currentLesson._id;
                  const isLessonDone = completedLessonIds.includes(lesson._id);

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
                              : isLessonDone
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-primary-tint text-primary"
                          }`}
                        >
                          {isLessonDone ? <Check className="w-3 h-3" /> : lesson.order}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {isLessonDone && !isActive && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
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
