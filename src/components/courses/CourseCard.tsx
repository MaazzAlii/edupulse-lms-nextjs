"use client";

import React from "react";
import Link from "next/link";
import { ICourse } from "@/types";
import { useLMS } from "@/context/LMSContext";
import { formatPrice } from "@/lib/utils";
import { Star, Users, PlayCircle, BookOpen, Clock, ArrowRight } from "lucide-react";

interface CourseCardProps {
  course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { user, getCourseProgress } = useLMS();
  const isEnrolled = user ? user.enrolledCourseIds.includes(course.id) : false;
  const progress = isEnrolled ? getCourseProgress(course.id) : 0;

  // Calculate total lessons and estimated duration
  const totalLessons = course.sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );
  const totalMinutes = course.sections.reduce(
    (acc, sec) =>
      acc + sec.lessons.reduce((lAcc, les) => lAcc + les.videoLengthMinutes, 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={course.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop";
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/90 text-slate-800 backdrop-blur-md shadow-sm border border-slate-200/60">
          {course.category}
        </span>

        {/* Level Pill */}
        <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-brand-600 text-white shadow-sm">
          {course.level}
        </span>

        {/* Enrolled Badge Overlay */}
        {isEnrolled && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-lg p-2 border border-emerald-500/30 shadow-sm flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Enrolled
            </span>
            <span className="text-[11px] font-bold text-slate-800">{progress}% Complete</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {totalHours} hrs
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5" /> {totalLessons} lessons
            </span>
          </div>

          {/* Title */}
          <Link href={`/courses/${course.id}`} className="block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-900 dark:text-slate-100">
              {course.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Footer info: Instructor, Rating & Price */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            {/* Instructor */}
            <div className="flex items-center gap-2">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                {course.instructor.name}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {course.rating.toFixed(1)}
              </span>
              <span className="text-slate-400">({course.totalRatingsCount})</span>
            </div>
          </div>

          {/* Price & CTA Button */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {formatPrice(course.price)}
              </span>
              {course.estimatedPrice > course.price && (
                <span className="ml-2 text-xs text-slate-400 line-through">
                  {formatPrice(course.estimatedPrice)}
                </span>
              )}
            </div>

            {isEnrolled ? (
              <Link
                href={`/learn/${course.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                Learn <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={`/courses/${course.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-brand-500/20"
              >
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
