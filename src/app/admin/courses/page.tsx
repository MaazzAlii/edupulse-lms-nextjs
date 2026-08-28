"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  DollarSign,
  GraduationCap,
  Video,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number | string;
  thumbnailUrl: string;
}

const initialFormState: CourseFormData = {
  title: "",
  description: "",
  category: "",
  instructor: "",
  level: "Beginner",
  price: 0,
  thumbnailUrl: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete State
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toggle Publish loading tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesRes, catRes] = await Promise.all([
        fetch("/api/admin/courses", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);

      const coursesData = await coursesRes.json();
      const catData = await catRes.json();

      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      ...initialFormState,
      category: categories.length > 0 ? categories[0]._id : "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?._id || "",
      instructor: course.instructor,
      level: course.level,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl || "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.instructor.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const endpoint = editingCourse
        ? `/api/courses/${editingCourse._id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        instructor: formData.instructor.trim(),
        level: formData.level,
        price: Number(formData.price),
        thumbnailUrl: formData.thumbnailUrl.trim(),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Operation failed");
        return;
      }

      setSuccessMessage(
        editingCourse
          ? `Course "${data.course.title}" updated successfully.`
          : `Course "${data.course.title}" created successfully as Draft.`
      );

      closeModal();
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      setTogglingId(course._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const newStatus = !course.isPublished;
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update publication status");
        return;
      }

      setSuccessMessage(
        `Course "${course.title}" is now ${
          newStatus ? "Published (Public)" : "Draft (Hidden)"
        }.`
      );

      // Local state update for snappy UI
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isPublished: newStatus } : c))
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/courses/${courseToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to delete course");
        setCourseToDelete(null);
        return;
      }

      setSuccessMessage(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Manage Courses
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Create, configure, publish, and update course offerings.
          </p>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              All Courses Repository
            </h2>
            <p className="text-xs text-muted">
              {courses.length} total courses registered
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Toggle Publish</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    No courses found. Click &quot;Create New Course&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-primary-tint/20 transition-colors"
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="font-bold text-foreground truncate">
                        {course.title}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {course.slug}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary-tint text-primary">
                        {course.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Instructor */}
                    <td className="py-3.5 px-4 text-muted font-medium">
                      {course.instructor}
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>

                    {/* Publish/Unpublish Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={togglingId === course._id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          course.isPublished
                            ? "bg-gold-tint text-gold hover:bg-gold/20"
                            : "bg-green-tint text-green hover:bg-green/20"
                        }`}
                        title={
                          course.isPublished
                            ? "Click to unpublish (switch to draft)"
                            : "Click to publish (make public)"
                        }
                      >
                        {togglingId === course._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : course.isPublished ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-gold" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-green" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/courses/${course._id}/lessons`}
                          className="p-1.5 rounded-lg text-primary hover:text-white hover:bg-primary transition-colors bg-primary-tint"
                          title="Manage Lessons & Videos"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/courses/${course._id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="View Course Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCourseToDelete(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red-tint transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-surface p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                  <GraduationCap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingCourse ? "Edit Course" : "Create New Course"}
                  </h3>
                  <p className="text-xs text-muted">
                    {editingCourse
                      ? "Update existing course attributes"
                      : "New courses default to Draft mode until published"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Modern Full-Stack Development with Next.js"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Description <span className="text-red">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Comprehensive description of what students will master..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Category and Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category <span className="text-red">*</span>
                  </label>
                  {categories.length === 0 ? (
                    <div className="text-xs text-red p-2 bg-red-tint rounded-lg">
                      No categories found. Please create a category first.
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Instructor Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Jenkins"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Level, Price, Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-muted text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Thumbnail Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || categories.length === 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-gold" />
                      <span>{editingCourse ? "Update Course" : "Save Course"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Course?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{courseToDelete.title}&quot;
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
