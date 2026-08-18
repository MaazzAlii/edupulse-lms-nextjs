"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { CourseCard } from "@/components/courses/CourseCard";
import { Category } from "@/types";
import {
  Sparkles,
  ArrowRight,
  Code,
  Brain,
  Palette,
  Cloud,
  Database,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  PlayCircle,
  Star,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function HomePage() {
  const { courses, setSelectedCategory } = useLMS();

  const featuredCourses = courses.slice(0, 4);

  const categoriesWithIcons: {
    title: Category;
    icon: any;
    color: string;
    bg: string;
  }[] = [
    {
      title: "Web Development",
      icon: Code,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Artificial Intelligence",
      icon: Brain,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      title: "UI/UX Design",
      icon: Palette,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      title: "Data Science",
      icon: Database,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Mobile App Dev",
      icon: Smartphone,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are the courses self-paced with lifetime access?",
      a: "Yes! Once you enroll in any course, you get lifetime unlimited access to all video lessons, future updates, downloadable project files, and the discussion Q&A forum.",
    },
    {
      q: "How does the interactive classroom and Q&A work?",
      a: "Inside each video lesson, you can post questions at specific timestamps. Instructors and peer students will reply directly, and you will receive notifications on your dashboard.",
    },
    {
      q: "Can I get a completion certificate?",
      a: "Upon completing 100% of the lessons in a course, you can instantly download a verifiable certificate of completion to share on LinkedIn or with employers.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a zero-risk 30-day money-back guarantee on all our masterclasses. If you are not satisfied, request a refund with a single click.",
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-purple-500/15 blur-[120px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Next-Generation Full-Stack LMS Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Master Industrial Engineering with{" "}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Project-Driven
            </span>{" "}
            Masterclasses.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Learn Next.js 14, TypeScript, AI Engineering, and Cloud DevOps from lead architects. Hands-on coding, video timestamps, and lifetime mentorship.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group transition-all duration-200 hover:scale-105"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/courses/course-1"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition"
            >
              <PlayCircle className="w-4 h-4 text-brand-600" />
              <span>Watch Free Preview</span>
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-2xl font-extrabold text-slate-900">
                50,000+
              </span>
              <p className="text-xs text-slate-500 mt-1">Active Engineers</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-2xl font-extrabold text-brand-600">
                4.9 ★
              </span>
              <p className="text-xs text-slate-500 mt-1">Average Rating</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-2xl font-extrabold text-slate-900">
                100%
              </span>
              <p className="text-xs text-slate-500 mt-1">Project-Based</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-2xl font-extrabold text-purple-600">
                Instant
              </span>
              <p className="text-xs text-slate-500 mt-1">Certificate Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
              Top Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Explore by Tech Category
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-brand-500 hover:text-brand-400 flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithIcons.map((cat) => {
            const Icon = cat.icon;
            const courseCount = courses.filter((c) => c.category === cat.title).length;

            return (
              <Link
                key={cat.title}
                href={`/courses?category=${encodeURIComponent(cat.title)}`}
                onClick={() => setSelectedCategory(cat.title)}
                className="glass-card p-5 rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition duration-200"
              >
                <div className={`p-3.5 rounded-2xl ${cat.bg} ${cat.color} mb-3 group-hover:scale-110 transition duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-slate-500 mt-1 font-medium">
                  {courseCount} {courseCount === 1 ? "Course" : "Courses"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Curated Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Masterclasses
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Browse All {courses.length} Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* PLATFORM ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-4">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Why EduPulse LMS?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Engineered for serious software professionals.
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                No boring slides or theoretical fluff. Every course builds a functional production system from scratch.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 w-fit">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Interactive Video Player
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Timestamped lessons, speed controls, downloadable resources, and live Q&A threads.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Verifiable Certificates
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Showcase your completed architectures directly on LinkedIn and your GitHub portfolio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Instructor Studio
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Built-in Admin dashboard for curriculum building, video uploads, and revenue analytics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Stripe Payment Flow
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seamless card & Stripe checkout with instant automated invoice generation and course unlock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-14 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to build next-level web applications?
          </h2>
          <p className="text-sm text-white/90 max-w-lg mx-auto">
            Join thousands of developers leveling up their stack today.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 transition"
          >
            Start Learning Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
