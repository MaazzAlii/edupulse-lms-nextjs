"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { formatPrice } from "@/lib/utils";
import {
  BookOpen,
  Award,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  Printer,
  X,
} from "lucide-react";
import { ICourse } from "@/types";

export default function MyCoursesPage() {
  const { courses, user, getCourseProgress } = useLMS();

  const enrolledCourses = courses.filter((c) =>
    user.enrolledCourseIds.includes(c.id)
  );

  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<ICourse | null>(
    null
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
          Student Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          My Enrolled Courses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Track your course completion, resume video lessons, and claim your verified certificates.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            You are not enrolled in any courses yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our curated engineering masterclasses and start learning today.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = getCourseProgress(course.id);
            const isCompleted = progress === 100;

            return (
              <div
                key={course.id}
                className="glass-card rounded-2xl overflow-hidden border flex flex-col justify-between group hover:shadow-2xl transition duration-300"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instructor: {course.instructor.name}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className={isCompleted ? "text-emerald-500 font-extrabold" : "text-brand-500"}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-brand-600 to-accent-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 flex gap-2">
                  <Link
                    href={`/learn/${course.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 transition"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{progress > 0 ? "Resume Learning" : "Start Course"}</span>
                  </Link>

                  {isCompleted && (
                    <button
                      onClick={() => setSelectedCertificateCourse(course)}
                      className="px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
                      title="View Certificate"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificateCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border-4 border-amber-400/80 space-y-6">
            <button
              onClick={() => setSelectedCertificateCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b pb-4">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-600 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Certificate of Completion
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                EduPulse Engineering Institute
              </h2>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-slate-500">This is proudly presented to</p>
              <h3 className="text-3xl font-extrabold text-brand-600 tracking-tight font-serif">
                {user.name}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                for successfully completing all curriculum modules and project milestones in
              </p>
              <p className="text-lg font-bold text-slate-900">
                "{selectedCertificateCourse.title}"
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="flex items-center justify-between pt-6 border-t text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-800">
                  {selectedCertificateCourse.instructor.name}
                </p>
                <span className="text-[10px]">Lead Instructor</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-slate-400">
                  ID: EDP-{Date.now().toString(36).toUpperCase()}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  ✓ Verified Credential
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
