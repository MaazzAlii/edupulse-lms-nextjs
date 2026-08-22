"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderTree,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: string;
  price: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [courseRes, catRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/categories"),
        ]);

        const courseData = await courseRes.json();
        const catData = await catRes.json();

        if (courseData.success && Array.isArray(courseData.courses)) {
          setCourses(courseData.courses);
        }
        if (catData.success && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;
  const totalCategories = categories.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-tint text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administration Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Dashboard & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Monitor learning content, catalog status, and course taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-foreground hover:bg-black/5 transition-all shadow-sm"
          >
            <FolderTree className="w-3.5 h-3.5 text-primary" />
            <span>Manage Categories</span>
          </Link>

          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            <span>Manage Courses</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Courses
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Total catalog items</p>
        </div>

        {/* Published Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-green uppercase tracking-wider">
              Published
            </span>
            <div className="w-9 h-9 rounded-xl bg-green-tint text-green flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green">
            {loading ? "..." : publishedCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Live in public catalog</p>
        </div>

        {/* Drafts */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Drafts
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-tint text-gold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold">
            {loading ? "..." : draftCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Unpublished courses</p>
        </div>

        {/* Categories */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCategories}
          </div>
          <p className="text-[11px] text-muted mt-1">Curated taxonomy tracks</p>
        </div>
      </div>

      {/* Recent Courses Table Preview */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Recent Courses
            </h2>
            <p className="text-xs text-muted">
              Latest additions to the LMS repository
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No courses created yet. Click &quot;Manage Courses&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <tr key={course._id} className="hover:bg-primary-tint/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {course.category?.name || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-muted">{course.instructor}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-2.5 h-2.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/courses/${course._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
