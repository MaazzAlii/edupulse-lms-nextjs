"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { ILesson } from "@/types";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  Share2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Lock,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { courses, user, getCourseProgress, addReview, openAuthModal } = useLMS();

  const course = courses.find((c) => c.id === courseId);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<ILesson | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-slate-500 text-sm">The course you are looking for does not exist or has been removed.</p>
        <Link href="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Back to Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = user ? user.enrolledCourseIds.includes(course.id) : false;
  const progress = isEnrolled ? getCourseProgress(course.id) : 0;

  const totalLessons = course.sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );
  const totalMinutes = course.sections.reduce(
    (acc, sec) =>
      acc + sec.lessons.reduce((lAcc, les) => lAcc + les.videoLengthMinutes, 0),
    0
  );

  const handleEnrollClick = () => {
    if (!user) {
      openAuthModal("signin", () => {
        setIsCheckoutOpen(true);
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    if (!user) {
      openAuthModal("signin");
      return;
    }
    setIsSubmittingReview(true);
    addReview(course.id, reviewRating, reviewComment);
    setReviewComment("");
    setIsSubmittingReview(false);
  };

  return (
    <div className="pb-24">
      {/* Top Breadcrumb & Hero */}
      <section className="bg-slate-900 text-white pt-10 pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-400 font-semibold truncate">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Header info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  {course.level}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {course.description}
              </p>

              {/* Social proof stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white text-sm">{course.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({course.totalRatingsCount} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>{course.purchasedCount.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <span>{formatDuration(totalMinutes)} total</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="text-xs font-bold text-white">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Right Card / Enrollment Box */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 self-start">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer" onClick={() => setPreviewLesson(course.sections[0]?.lessons[0])}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition">
                  <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/75 text-white px-2 py-0.5 rounded font-semibold">
                  Watch Preview
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatPrice(course.price)}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(course.estimatedPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)}% OFF
                  </span>
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center justify-between">
                      <span>Course Progress</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <Link
                      href={`/learn/${course.id}`}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-xs shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Enroll Now — Instant Access</span>
                  </button>
                )}

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{totalLessons} HD video lessons ({formatDuration(totalMinutes)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>Full source code & downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>Lifetime unlimited access + future updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>Certificate of completion included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn (Benefits) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                What You Will Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content / Curriculum */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Course Curriculum
                </h2>
                <p className="text-xs text-slate-500">
                  {course.sections.length} sections • {totalLessons} lessons • {formatDuration(totalMinutes)} total length
                </p>
              </div>

              <CurriculumAccordion
                sections={course.sections}
                isEnrolled={isEnrolled}
                onPreviewLesson={(lesson) => setPreviewLesson(lesson)}
                onSelectLesson={(lesson) => {
                  if (isEnrolled) {
                    router.push(`/learn/${course.id}`);
                  }
                }}
              />
            </div>

            {/* Requirements / Prerequisites */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                Requirements & Prerequisites
              </h2>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                {course.prerequisites.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Instructor Profile Details */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                About Your Instructor
              </h2>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
                />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-xs text-brand-600 font-semibold">
                    {course.instructor.role}
                  </p>
                  <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Student Feedback & Reviews</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {course.reviews.length}
                  </span>
                </h2>
              </div>

              {/* Review Input for Enrolled Students */}
              {isEnrolled && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <h3 className="text-xs font-bold text-slate-800">
                    Leave a Course Review
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Write your honest review and what you learned..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 disabled:opacity-50 transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {course.reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet for this masterclass.</p>
                ) : (
                  course.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl glass-card border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user.avatar}
                            alt={rev.user.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {rev.user.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-9">
                        {rev.comment}
                      </p>
                      <span className="text-[10px] text-slate-400 pl-9 block">
                        {rev.createdAt}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        course={course}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          router.push(`/learn/${course.id}`);
        }}
      />

      {/* Video Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl glass-card rounded-3xl overflow-hidden border bg-black shadow-2xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Free Preview</span>
                <h3 className="text-xs font-bold">{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <VideoPlayer
                videoUrl={previewLesson.videoUrl}
                title={previewLesson.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
