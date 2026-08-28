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
                    <span className="text-muted">•</span>
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
