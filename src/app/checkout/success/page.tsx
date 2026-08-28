"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle, PlayCircle, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("courseId");

  const [status, setStatus] = useState<"polling" | "success" | "timeout" | "error">("polling");
  const [errorMessage, setErrorMessage] = useState("");
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      // If courseId isn't explicitly in params, we can still show a generic success state or polling state
      setStatus("success");
      return;
    }

    let attempts = 0;
    const maxAttempts = 8; // 8 * 2s = 16 seconds timeout
    let intervalId: NodeJS.Timeout;

    const checkEnrollment = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/enrollments/me?courseId=${courseId}`);
        const data = await res.json();

        if (data.success && data.paymentStatus === "Paid") {
          setStatus("success");
          clearInterval(intervalId);

          // Fetch first lesson if available
          try {
            const courseRes = await fetch(`/api/courses/${courseId}`);
            const courseData = await courseRes.json();
            if (courseData.success && courseData.course?.lessons?.length > 0) {
              setFirstLessonId(courseData.course.lessons[0]._id);
            }
          } catch (e) {
            console.error("Failed to fetch course details for redirect", e);
          }
          return;
        }

        if (attempts >= maxAttempts) {
          setStatus("timeout");
          clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error("Error polling enrollment status:", err);
        if (attempts >= maxAttempts) {
          setStatus("timeout");
          clearInterval(intervalId);
        }
      }
    };

    // Initial check right away
    checkEnrollment();

    // Poll every 2 seconds
    intervalId = setInterval(checkEnrollment, 2000);

    return () => clearInterval(intervalId);
  }, [courseId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        {status === "polling" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-slate-400 text-sm mb-4">
              We received your Stripe payment! Confirming your course enrollment...
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enrollment Confirmed!</h2>
            <p className="text-slate-300 text-sm mb-6">
              Thank you for your purchase. You now have full access to this course.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {courseId && firstLessonId ? (
                <Link
                  href={`/learn/${courseId}/${firstLessonId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  <PlayCircle className="w-5 h-5" /> Start Learning
                </Link>
              ) : courseId ? (
                <Link
                  href={`/courses/${courseId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  Go to Course Page <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {status === "timeout" && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Still Processing...</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your payment was received, but enrollment activation is taking a moment. Please refresh this page or check your dashboard shortly.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl border border-slate-700 transition"
              >
                Refresh Status
              </button>
              {courseId && (
                <Link
                  href={`/courses/${courseId}`}
                  className="w-full text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                >
                  Return to Course Page
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
