"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { ILesson, ISection } from "@/types";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  Download,
  Share2,
  Award,
  Sparkles,
  Send,
  HelpCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const {
    courses,
    user,
    toggleLessonCompletion,
    isLessonCompleted,
    getCourseProgress,
    addQuestion,
    addQuestionReply,
    enrollCourse,
  } = useLMS();

  const course = courses.find((c) => c.id === courseId);

  // If not enrolled yet, auto-enroll or redirect
  const isEnrolled = course ? user.enrolledCourseIds.includes(course.id) : false;

  // Active Lesson State
  const defaultLesson = course?.sections[0]?.lessons[0] || null;
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(defaultLesson);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    course?.sections[0]?.id || ""
  );

  // Active tab under video player: "overview" | "qa" | "notes" | "resources"
  const [activeTab, setActiveTab] = useState<"overview" | "qa" | "notes" | "resources">(
    "overview"
  );

  // Q&A form state
  const [questionText, setQuestionText] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});

  // Notes state
  const [studentNotes, setStudentNotes] = useState(
    "Key concepts learned in this lesson:\n- Server Actions vs Route Handlers\n- In-memory Redis session management"
  );

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <Link href="/courses" className="text-brand-500 font-bold text-xs">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  // If visitor arrives directly without enrollment, allow 1-click enroll for testing
  if (!isEnrolled) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Enrollment Required
        </h2>
        <p className="text-xs text-slate-500">
          You need to be enrolled in <strong>{course.title}</strong> to access the video player.
        </p>
        <button
          onClick={() => {
            enrollCourse(course.id);
          }}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-500/20"
        >
          Instant Enroll (Free Demo Access)
        </button>
      </div>
    );
  }

  const currentLesson = activeLesson || course.sections[0]?.lessons[0];
  const progress = getCourseProgress(course.id);
  const isCurrentCompleted = currentLesson ? isLessonCompleted(currentLesson.id) : false;

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !currentLesson) return;
    addQuestion(course.id, activeSectionId, currentLesson.id, questionText);
    setQuestionText("");
  };

  const handlePostReply = (questionId: string) => {
    const replyText = replyTexts[questionId];
    if (!replyText || !replyText.trim() || !currentLesson) return;
    addQuestionReply(
      course.id,
      activeSectionId,
      currentLesson.id,
      questionId,
      replyText
    );
    setReplyTexts({ ...replyTexts, [questionId]: "" });
    setShowReplyInput({ ...showReplyInput, [questionId]: false });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Classroom Bar */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-16 z-40 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/courses/${course.id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">
              Playing: <span className="font-semibold text-brand-600">{currentLesson?.title}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar & Certificate Indicator */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span>{progress}% Completed</span>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-slate-200 overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && (
            <Link
              href="/my-courses"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md animate-pulse"
            >
              <Award className="w-3.5 h-3.5" /> Claim Certificate
            </Link>
          )}
        </div>
      </div>

      {/* Main Video & Playlist Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Player & Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {currentLesson && (
              <VideoPlayer
                videoUrl={currentLesson.videoUrl}
                title={currentLesson.title}
                onLessonEnded={() => {
                  if (!isCurrentCompleted) {
                    toggleLessonCompletion(currentLesson.id);
                  }
                }}
              />
            )}

            {/* Lesson Action Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {currentLesson?.title}
                </h2>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {currentLesson?.videoLengthMinutes} minutes
                </span>
              </div>

              {currentLesson && (
                <button
                  onClick={() => toggleLessonCompletion(currentLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isCurrentCompleted
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentCompleted ? "Completed" : "Mark as Completed"}</span>
                </button>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 px-4 transition border-b-2 ${
                  activeTab === "overview"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Lesson Overview
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === "qa"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Q&A Discussion ({currentLesson?.questions?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === "notes"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Notes</span>
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === "resources"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resources</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-slate-900">
                    About this video lesson
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {currentLesson?.description ||
                      "In this lecture, we explore the core implementation and architecture design patterns."}
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800">Instructor Tip:</span>
                    <p className="text-slate-600 leading-relaxed">
                      Follow along in your IDE, pause frequently, and test each component before moving to the next module.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Q&A */}
              {activeTab === "qa" && (
                <div className="space-y-6">
                  {/* Ask Question Form */}
                  <form onSubmit={handlePostQuestion} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-brand-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ask a question about this timestamp/lesson
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="What are you stuck on?"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-500 transition flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" /> Post
                      </button>
                    </div>
                  </form>

                  {/* Questions List */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {(!currentLesson?.questions || currentLesson.questions.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No questions asked yet. Be the first to start a discussion!</p>
                    ) : (
                      currentLesson.questions.map((q) => (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={q.user.avatar}
                                alt={q.user.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {q.user.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{q.createdAt}</span>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 pl-8">
                            {q.question}
                          </p>

                          {/* Replies */}
                          {q.questionReplies && q.questionReplies.length > 0 && (
                            <div className="pl-8 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                              {q.questionReplies.map((r) => (
                                <div key={r.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                                      {r.user.name}
                                    </span>
                                    {r.user.role === "instructor" && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500">
                                        Instructor
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {r.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Trigger */}
                          <div className="pl-8 pt-1">
                            {showReplyInput[q.id] ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replyTexts[q.id] || ""}
                                  onChange={(e) =>
                                    setReplyTexts({ ...replyTexts, [q.id]: e.target.value })
                                  }
                                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border"
                                />
                                <button
                                  onClick={() => handlePostReply(q.id)}
                                  className="px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold"
                                >
                                  Reply
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setShowReplyInput({ ...showReplyInput, [q.id]: true })
                                }
                                className="text-[11px] text-brand-500 hover:underline font-semibold"
                              >
                                Reply to question
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Personal Code Notes
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">
                      Auto-saved
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    className="w-full p-3 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              )}

              {/* TAB 4: RESOURCES */}
              {activeTab === "resources" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Downloadable Assets & GitHub Repositories
                  </span>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/MaazzAlii/edupulse-lms-nextjs"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <Download className="w-4 h-4 text-brand-500" />
                        <span>Source Code Repository (GitHub)</span>
                      </div>
                      <span className="text-[10px] text-brand-500 font-bold">Open Link</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Curriculum Playlist */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-2xl glass-card border">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                Course Playlist & Syllabus
              </h3>

              <CurriculumAccordion
                sections={course.sections}
                activeLessonId={currentLesson?.id}
                isEnrolled={true}
                completedLessonIds={user.completedLessonIds}
                onToggleComplete={(lessonId) => toggleLessonCompletion(lessonId)}
                onSelectLesson={(lesson, sectionId) => {
                  setActiveLesson(lesson);
                  setActiveSectionId(sectionId);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
