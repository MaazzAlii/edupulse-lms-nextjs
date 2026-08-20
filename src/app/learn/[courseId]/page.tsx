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
  LogIn,
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
    openAuthModal,
  } = useLMS();

  const course = courses.find((c) => c.id === courseId);

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

  // If visitor is logged out
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 mx-auto flex items-center justify-center shadow-inner">
          <LogIn className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign In to Access Classroom
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please sign in to your EduPulse account to watch video lectures and track your progress in <strong>{course.title}</strong>.
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <button
            onClick={() => openAuthModal("signin")}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Classroom</span>
          </button>
          <Link
            href={`/courses/${course.id}`}
            className="block py-2.5 text-xs font-semibold text-slate-500 hover:text-brand-600"
          >
            ← View Course Details & Syllabus
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = user.enrolledCourseIds.includes(course.id);

  // If visitor arrives directly without enrollment
  if (!isEnrolled) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
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
        <Link
          href={`/courses/${course.id}`}
          className="block text-xs text-slate-500 hover:text-brand-500 pt-2 font-medium"
        >
          ← View Course Details
        </Link>
      </div>
    );
  }

  const currentLesson = activeLesson || course.sections[0]?.lessons[0];
  const progress = getCourseProgress(course.id);

  // Flatten lessons to handle Next / Previous navigation
  const allLessons: { lesson: ILesson; sectionId: string }[] = [];
  course.sections.forEach((sec) => {
    sec.lessons.forEach((les) => {
      allLessons.push({ lesson: les, sectionId: sec.id });
    });
  });

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === currentLesson?.id);
  const prevLessonItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLessonItem =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleLessonSelect = (lesson: ILesson, sectionId: string) => {
    setActiveLesson(lesson);
    setActiveSectionId(sectionId);
  };

  const handleNextLesson = () => {
    if (nextLessonItem) {
      handleLessonSelect(nextLessonItem.lesson, nextLessonItem.sectionId);
    }
  };

  const handlePrevLesson = () => {
    if (prevLessonItem) {
      handleLessonSelect(prevLessonItem.lesson, prevLessonItem.sectionId);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !currentLesson) return;
    addQuestion(course.id, activeSectionId || course.sections[0].id, currentLesson.id, questionText);
    setQuestionText("");
  };

  const handleAddReply = (questionId: string) => {
    const text = replyTexts[questionId];
    if (!text?.trim() || !currentLesson) return;
    addQuestionReply(
      course.id,
      activeSectionId || course.sections[0].id,
      currentLesson.id,
      questionId,
      text
    );
    setReplyTexts((prev) => ({ ...prev, [questionId]: "" }));
    setShowReplyInput((prev) => ({ ...prev, [questionId]: false }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Classroom Bar */}
      <div className="h-14 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Course</span>
          </Link>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Progress pill & Certificate indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Progress:</span>
            <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">{progress}%</span>
          </div>

          {progress === 100 && (
            <Link
              href="/my-courses"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Claim Certificate</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Learning Classroom: Video Player (Left) + Playlist Sidebar (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Responsive 16:9 Video Canvas */}
          <div className="bg-black p-2 sm:p-4 border-b border-slate-800">
            <div className="max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
              {currentLesson ? (
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Select a lesson from the syllabus playlist
                </div>
              )}
            </div>
          </div>

          {/* Action Bar (Lesson Title, Next/Prev, Mark Completed) */}
          <div className="bg-slate-950 px-4 sm:px-8 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {currentLesson?.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>{currentLesson?.videoLengthMinutes} Minutes</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mark Completed Button */}
              {currentLesson && (
                <button
                  onClick={() => toggleLessonCompletion(currentLesson.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    isLessonCompleted(currentLesson.id)
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isLessonCompleted(currentLesson.id)
                        ? "text-emerald-400 fill-emerald-400/20"
                        : "text-slate-400"
                    }`}
                  />
                  <span>
                    {isLessonCompleted(currentLesson.id)
                      ? "Completed"
                      : "Mark as Completed"}
                  </span>
                </button>
              )}

              {/* Prev / Next buttons */}
              <button
                onClick={handlePrevLesson}
                disabled={!prevLessonItem}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
                title="Previous Lesson"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextLesson}
                disabled={!nextLessonItem}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
                title="Next Lesson"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Classroom Tabs (Overview, Live Q&A, Notes, Resources) */}
          <div className="flex-1 bg-slate-900 p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: "overview", label: "Lesson Overview", icon: FileText },
                { id: "qa", label: "Live Q&A & Doubts", icon: MessageSquare },
                { id: "notes", label: "My Notes", icon: Sparkles },
                { id: "resources", label: "Code & Resources", icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      activeTab === tab.id
                        ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">Lesson Summary</h3>
                <p>{currentLesson?.description}</p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
                  <h4 className="font-bold text-white">Learning Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Understand Next.js 14 App Router server & client boundaries</li>
                    <li>Optimize data hydration with TypeScript strict safety</li>
                    <li>Manage token invalidations and cached API state</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Live Q&A */}
            {activeTab === "qa" && (
              <div className="space-y-6">
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-400" />
                    <span>Ask a Question to Instructor ({course.instructor.name})</span>
                  </h3>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe your question or error in this lesson..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Question
                  </button>
                </form>

                {/* Q&A Thread List */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  {(!currentLesson?.questions || currentLesson.questions.length === 0) ? (
                    <p className="text-xs text-slate-500 italic">
                      No questions asked yet in this lesson. Be the first to ask!
                    </p>
                  ) : (
                    currentLesson.questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={q.user.avatar}
                              alt={q.user.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-white">
                              {q.user.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{q.createdAt}</span>
                        </div>

                        <p className="text-xs text-slate-300 pl-9">{q.question}</p>

                        {/* Replies */}
                        {q.questionReplies && q.questionReplies.length > 0 && (
                          <div className="ml-9 space-y-2 pt-2 border-t border-slate-900">
                            {q.questionReplies.map((rep) => (
                              <div
                                key={rep.id}
                                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={rep.user.avatar}
                                    alt={rep.user.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className="text-[11px] font-bold text-brand-400">
                                    {rep.user.name}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 font-semibold">
                                    {rep.user.role}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 pl-7">{rep.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Button / Box */}
                        <div className="pl-9 pt-1">
                          {showReplyInput[q.id] ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Write your reply..."
                                value={replyTexts[q.id] || ""}
                                onChange={(e) =>
                                  setReplyTexts((prev) => ({
                                    ...prev,
                                    [q.id]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddReply(q.id)}
                                  className="px-3 py-1 rounded-lg bg-brand-600 text-white font-bold text-[10px]"
                                >
                                  Submit Reply
                                </button>
                                <button
                                  onClick={() =>
                                    setShowReplyInput((prev) => ({
                                      ...prev,
                                      [q.id]: false,
                                    }))
                                  }
                                  className="px-3 py-1 rounded-lg text-slate-400 hover:text-white text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setShowReplyInput((prev) => ({
                                  ...prev,
                                  [q.id]: true,
                                }))
                              }
                              className="text-[11px] font-semibold text-brand-400 hover:underline"
                            >
                              Reply to thread
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Notes */}
            {activeTab === "notes" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">Student Lesson Notes</h3>
                  <span className="text-[10px] text-slate-500">Auto-saved locally</span>
                </div>
                <textarea
                  rows={6}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            )}

            {/* Tab 4: Resources */}
            {activeTab === "resources" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white">Downloadable Attachments</h3>
                {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                  <div className="space-y-2">
                    {currentLesson.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500 transition text-xs group"
                      >
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-brand-400" />
                          <span className="font-semibold text-white group-hover:text-brand-400">
                            {res.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">External Resource ↗</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No attachments for this lesson.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Syllabus Playlist Sidebar */}
        <div className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-3.5rem)] shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
              Course Playlist
            </h3>
            <p className="text-xs text-slate-200 font-bold mt-0.5">{course.title}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 divide-y divide-slate-900">
            {course.sections.map((section, sIdx) => (
              <div key={section.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-300">
                  <span className="truncate">{section.title}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {section.lessons.length} lessons
                  </span>
                </div>

                <div className="space-y-1">
                  {section.lessons.map((lesson, lIdx) => {
                    const isActive = currentLesson?.id === lesson.id;
                    const isDone = isLessonCompleted(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson, section.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-3 text-xs ${
                          isActive
                            ? "bg-brand-600 text-white font-bold shadow-md shadow-brand-500/25"
                            : "hover:bg-slate-900 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLessonCompletion(lesson.id);
                            }}
                            className="shrink-0"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                isDone
                                  ? isActive
                                    ? "text-white fill-white/20"
                                    : "text-emerald-400 fill-emerald-400/20"
                                  : "text-slate-600"
                              }`}
                            />
                          </div>
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span
                          className={`text-[10px] shrink-0 ${
                            isActive ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {lesson.videoLengthMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
