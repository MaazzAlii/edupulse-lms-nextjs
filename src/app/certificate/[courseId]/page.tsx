"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  Printer,
  ArrowLeft,
  GraduationCap,
  Loader2,
  CheckCircle2,
  Shield,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { computeProgress } from "@/lib/progress";

interface CourseInfo {
  _id: string;
  title: string;
  instructor: string;
  category?: {
    name: string;
  };
}

interface EnrollmentInfo {
  _id: string;
  paymentStatus: string;
  completedLessons: string[];
  completedAt?: string | null;
  updatedAt: string;
  enrolledAt: string;
}

export default function CourseCertificatePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId } = resolvedParams;
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentInfo | null>(null);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/certificate/${courseId}`);
    }
  }, [authLoading, isAuthenticated, courseId, router]);

  useEffect(() => {
    async function loadCertificateData() {
      if (!isAuthenticated || !courseId) return;

      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonsRes, enrollmentRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
          fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
          fetch(`/api/enrollments/me?courseId=${courseId}`, { cache: "no-store" }),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();
        const enrollmentData = await enrollmentRes.json();

        if (!courseRes.ok || !courseData.success || !courseData.course) {
          setError("Course details could not be found.");
          return;
        }
        setCourse(courseData.course);

        const lessonCount =
          lessonsData.success && Array.isArray(lessonsData.lessons)
            ? lessonsData.lessons.length
            : 0;
        setTotalLessons(lessonCount);

        if (
          !enrollmentRes.ok ||
          !enrollmentData.success ||
          !enrollmentData.enrollment ||
          enrollmentData.paymentStatus !== "Paid"
        ) {
          // Not enrolled or unpaid -> redirect to course detail
          router.replace(`/courses/${courseId}`);
          return;
        }

        const enr = enrollmentData.enrollment;
        setEnrollment(enr);

        const completedCount = Array.isArray(enr.completedLessons)
          ? enr.completedLessons.length
          : 0;
        const progress = computeProgress(completedCount, lessonCount);

        // Access guard: If course is not 100% completed, redirect back to classroom player
        if (progress < 100) {
          const firstLessonId =
            lessonsData.lessons && lessonsData.lessons.length > 0
              ? lessonsData.lessons[0]._id
              : "";
          router.replace(
            firstLessonId
              ? `/learn/${courseId}/${firstLessonId}`
              : `/courses/${courseId}`
          );
          return;
        }
      } catch (err: any) {
        setError(err.message || "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadCertificateData();
    }
  }, [isAuthenticated, courseId, router]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-muted">
            Generating your official completion certificate...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course || !enrollment || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="card-surface p-8">
            <AlertCircle className="w-10 h-10 text-red mx-auto mb-3" />
            <h2 className="text-lg font-bold text-foreground mb-2">
              Certificate Unavailable
            </h2>
            <p className="text-xs text-muted mb-6">{error || "Certificate requirements not met."}</p>
            <Link
              href={`/courses/${courseId}`}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completionDate = enrollment.completedAt
    ? new Date(enrollment.completedAt)
    : new Date(enrollment.updatedAt);

  const formattedDate = completionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* Control Header Bar */}
      <div className="print:hidden bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-8 flex items-center justify-between">
        <Link
          href={`/learn/${courseId}/${totalLessons > 0 ? "1" : ""}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Classroom</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Certificate Frame */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 print:p-0 print:m-0">
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .certificate-container {
              border: 12px double #d4af37 !important;
              box-shadow: none !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              page-break-inside: avoid;
            }
          }
        `}</style>

        <div className="certificate-container w-full max-w-4xl bg-slate-900 border-8 border-double border-amber-500/60 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center my-6">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <GraduationCap className="w-96 h-96 text-amber-400" />
          </div>

          {/* Certificate Header Badge */}
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3 border-2 border-white/20">
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-amber-400 block mb-1">
              EduPulse Academy • Official Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              Certificate of Completion
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mb-6 relative z-10">
            This is proudly presented to
          </p>

          {/* Student Name */}
          <div className="mb-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight underline decoration-amber-500/40 underline-offset-8">
              {user.name}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 relative z-10">
            for successfully completing 100% of the prescribed curriculum and lesson requirements for the course
          </p>

          {/* Course Title */}
          <div className="mb-10 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight px-4 py-2 inline-block bg-slate-800/80 border border-slate-700 rounded-2xl shadow-inner">
              {course.title}
            </h3>
          </div>

          {/* Signature & Date Footer Grid */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 items-end relative z-10 max-w-2xl mx-auto">
            {/* Instructor Signature */}
            <div className="text-center">
              <div className="font-serif italic text-lg text-amber-400 mb-1 border-b border-slate-700 pb-1 inline-block px-4">
                {course.instructor}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Course Instructor
              </span>
            </div>

            {/* Completion Date */}
            <div className="text-center">
              <div className="font-bold text-sm text-white mb-1 border-b border-slate-700 pb-1 inline-block px-4">
                {formattedDate}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Date Issued
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
