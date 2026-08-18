"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLMS } from "@/context/LMSContext";
import { CourseFormModal } from "@/components/admin/CourseFormModal";
import { ICourse } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminCoursesPage() {
  const { courses, deleteCourse, updateCourse } = useLMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<ICourse | null>(null);
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (course: ICourse) => {
    setCourseToEdit(course);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCourseToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteCourse(id);
    }
  };

  const handleTogglePublish = (course: ICourse) => {
    updateCourse(course.id, { isPublished: !course.isPublished });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
            Curriculum Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Course Management Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create new courses, edit syllabus modules, upload video lectures, and publish masterclasses.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
          />
        </div>

        <div className="text-xs text-slate-600 font-semibold">
          Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of{" "}
          <strong className="text-slate-900">{courses.length}</strong> masterclasses
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-3">Course</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Lessons</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Enrollments</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => {
                const totalLessons = course.sections.reduce(
                  (acc, s) => acc + s.lessons.length,
                  0
                );

                return (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-14 h-10 rounded-lg object-cover"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {course.title}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {course.instructor.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {course.category}
                      </span>
                    </td>

                    <td className="py-4 font-semibold text-slate-700">
                      {totalLessons} lessons
                    </td>

                    <td className="py-4 font-extrabold text-slate-900">
                      {formatPrice(course.price)}
                    </td>

                    <td className="py-4 font-semibold text-brand-600">
                      {course.purchasedCount} students
                    </td>

                    <td className="py-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition border ${
                          course.isPublished
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-brand-600 hover:bg-slate-200 transition"
                          title="View Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition"
                          title="Edit Course"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseToEdit={courseToEdit}
      />
    </div>
  );
}
