"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Plus,
  Edit2,
  Trash2,
  Upload,
  RefreshCw,
  Eye,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Play,
  Film,
  Layers,
} from "lucide-react";

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
  instructor: string;
  level: string;
  price: number;
  isPublished: boolean;
}

interface LessonItem {
  _id: string;
  course: string;
  title: string;
  order: number;
  videoUrl: string;
  durationSeconds: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewLessonFormData {
  title: string;
  order: number | string;
  isPreview: boolean;
  videoFile: File | null;
}

interface EditLessonFormData {
  title: string;
  order: number | string;
  isPreview: boolean;
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`;
  }
  return null;
}

export default function AdminCourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [videoSourceType, setVideoSourceType] = useState<"file" | "url">("file");
  const [newLessonUrl, setNewLessonUrl] = useState<string>("");

  const [replaceSourceType, setReplaceSourceType] = useState<"file" | "url">("file");
  const [replaceVideoUrl, setReplaceVideoUrl] = useState<string>("");

  // Status alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Lesson Form
  const [newLessonData, setNewLessonData] = useState<NewLessonFormData>({
    title: "",
    order: "",
    isPreview: false,
    videoFile: null,
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Edit Metadata Modal
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditLessonFormData>({
    title: "",
    order: 1,
    isPreview: false,
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Replace Video Modal
  const [replacingLesson, setReplacingLesson] = useState<LessonItem | null>(null);
  const [replaceVideoFile, setReplaceVideoFile] = useState<File | null>(null);
  const [isReplacingVideo, setIsReplacingVideo] = useState<boolean>(false);

  // Delete Lesson Modal
  const [deletingLesson, setDeletingLesson] = useState<LessonItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchCourseAndLessons = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
        fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
      ]);

      const courseData = await courseRes.json();
      const lessonsData = await lessonsRes.json();

      if (!courseRes.ok || !courseData.success || !courseData.course) {
        setErrorMessage(courseData.message || "Failed to load course details.");
        return;
      }
      setCourse(courseData.course);

      if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
        setLessons(lessonsData.lessons);
        // Pre-fill next order for convenience
        const nextOrder =
          lessonsData.lessons.length > 0
            ? Math.max(...lessonsData.lessons.map((l: LessonItem) => l.order)) + 1
            : 1;
        setNewLessonData((prev) => ({
          ...prev,
          order: nextOrder,
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch course lessons.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId, fetchCourseAndLessons]);

  // Handle Add Lesson Submission
  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLessonData.title.trim()) {
      setErrorMessage("Please enter a lesson title.");
      return;
    }

    if (videoSourceType === "file") {
      if (!newLessonData.videoFile) {
        setErrorMessage("Please select a video file (MP4, WebM, or QuickTime).");
        return;
      }

      // Client-side quick checks
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedTypes.includes(newLessonData.videoFile.type)) {
        setErrorMessage("Invalid file format. Please upload an MP4, WebM, or QuickTime video.");
        return;
      }

      if (newLessonData.videoFile.size > 200 * 1024 * 1024) {
        const sizeMB = (newLessonData.videoFile.size / (1024 * 1024)).toFixed(2);
        setErrorMessage(`Video size (${sizeMB}MB) exceeds 200MB maximum limit.`);
        return;
      }
    } else {
      if (!newLessonUrl.trim()) {
        setErrorMessage("Please enter a valid video URL.");
        return;
      }
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("title", newLessonData.title.trim());
      formData.append("order", String(newLessonData.order || 1));
      formData.append("isPreview", String(newLessonData.isPreview));

      if (videoSourceType === "file" && newLessonData.videoFile) {
        formData.append("video", newLessonData.videoFile);
      } else {
        formData.append("videoUrl", newLessonUrl.trim());
      }

      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to create lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${data.lesson.title}" created successfully!`);

      // Reset form
      const nextOrder = (Number(newLessonData.order) || 1) + 1;
      setNewLessonData({
        title: "",
        order: nextOrder,
        isPreview: false,
        videoFile: null,
      });
      setNewLessonUrl("");
      setVideoSourceType("file");

      // Clear file input element
      const fileInput = document.getElementById("lesson-video-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during lesson creation.");
    } finally {
      setIsUploading(false);
    }
  };

  // Open Edit Metadata Modal
  const openEditModal = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setEditFormData({
      title: lesson.title,
      order: lesson.order,
      isPreview: lesson.isPreview,
    });
    setErrorMessage(null);
  };

  const handleEditLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    if (!editFormData.title.trim()) {
      setErrorMessage("Lesson title cannot be empty.");
      return;
    }

    try {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/lessons/${editingLesson._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editFormData.title.trim(),
          order: Number(editFormData.order),
          isPreview: editFormData.isPreview,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${data.lesson.title}" updated successfully.`);
      setEditingLesson(null);
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Replace Video Modal
  const openReplaceVideoModal = (lesson: LessonItem) => {
    setReplacingLesson(lesson);
    setReplaceVideoFile(null);
    setReplaceVideoUrl("");
    setReplaceSourceType("file");
    setErrorMessage(null);
  };

  const handleReplaceVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingLesson) return;

    if (replaceSourceType === "file" && !replaceVideoFile) {
      setErrorMessage("Please select a new video file.");
      return;
    }

    if (replaceSourceType === "url" && !replaceVideoUrl.trim()) {
      setErrorMessage("Please enter a valid video URL.");
      return;
    }

    try {
      setIsReplacingVideo(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      if (replaceSourceType === "file" && replaceVideoFile) {
        formData.append("video", replaceVideoFile);
      } else {
        formData.append("videoUrl", replaceVideoUrl.trim());
      }

      const res = await fetch(`/api/lessons/${replacingLesson._id}/video`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to replace lesson video.");
        return;
      }

      setSuccessMessage(`Video for "${replacingLesson.title}" replaced successfully!`);
      setReplacingLesson(null);
      setReplaceVideoFile(null);
      setReplaceVideoUrl("");
      setReplaceSourceType("file");
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while replacing video.");
    } finally {
      setIsReplacingVideo(false);
    }
  };

  // Handle Delete Lesson
  const handleDeleteLessonSubmit = async () => {
    if (!deletingLesson) return;

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/lessons/${deletingLesson._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to delete lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${deletingLesson.title}" deleted.`);
      setDeletingLesson(null);
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete lesson.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted">Loading course & lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Back Navigation & Course Header */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Curriculum Editor
              </span>
              {course?.isPublished ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-green-tint text-green border border-green/30">
                  Published
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gold-tint text-gold border border-gold/30">
                  Draft
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {course?.title || "Course Lessons"}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Upload videos, configure lesson order, and manage free preview access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-black/5 text-foreground border border-border transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Public View</span>
            </Link>
          </div>
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

      {/* Main Grid: Add Lesson Form + Lesson List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Lesson Form */}
        <div className="lg:col-span-1">
          <div className="card-surface p-6 sm:p-7 sticky top-24 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                <Plus className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Add New Lesson</h2>
                <p className="text-[11px] text-muted">Upload video to Vercel Blob</p>
              </div>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="space-y-4">
              {/* Lesson Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lesson Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={newLessonData.title}
                  onChange={(e) =>
                    setNewLessonData({ ...newLessonData, title: e.target.value })
                  }
                  placeholder="e.g. 01 - Architecture Overview"
                  required
                  disabled={isUploading}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
              </div>

              {/* Order and Preview Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Lesson Order # <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLessonData.order}
                    onChange={(e) =>
                      setNewLessonData({ ...newLessonData, order: e.target.value })
                    }
                    required
                    disabled={isUploading}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Access Level
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newLessonData.isPreview}
                      onChange={(e) =>
                        setNewLessonData({
                          ...newLessonData,
                          isPreview: e.target.checked,
                        })
                      }
                      disabled={isUploading}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Free Preview
                    </span>
                  </label>
                </div>
              </div>

              {/* Video Source Selection Toggle */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Video Source
                </label>
                <div className="flex rounded-xl bg-background p-1 border border-border mb-3">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("file")}
                    disabled={isUploading}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      videoSourceType === "file"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("url")}
                    disabled={isUploading}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      videoSourceType === "url"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    YouTube / URL
                  </button>
                </div>
              </div>

              {/* Video Input Conditionally Rendered */}
              {videoSourceType === "file" ? (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Video File (MP4, WebM, QuickTime, max 200MB) <span className="text-red">*</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-background/50">
                    <input
                      id="lesson-video-file-input"
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      required={videoSourceType === "file"}
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewLessonData({ ...newLessonData, videoFile: file });
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="lesson-video-file-input"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-tint text-primary flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      {newLessonData.videoFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-foreground truncate max-w-[220px]">
                            {newLessonData.videoFile.name}
                          </p>
                          <p className="text-[10px] text-muted">
                            {(newLessonData.videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Click to select video file
                          </p>
                          <p className="text-[10px] text-muted mt-0.5">
                            MP4, WebM or MOV up to 200MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Video URL (YouTube or raw video link) <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLessonUrl}
                    onChange={(e) => setNewLessonUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    required={videoSourceType === "url"}
                    disabled={isUploading}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                  <p className="text-[10px] text-muted mt-1">
                    Enter any public YouTube link or direct video address.
                  </p>
                </div>
              )}

              {/* Upload Progress Feedback Banner */}
              {isUploading && (
                <div className="p-3.5 rounded-xl bg-primary-tint text-primary border border-primary/20 flex items-center gap-3 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <div className="leading-tight">
                    <p className="font-bold">
                      {videoSourceType === "file" ? "Uploading video to Vercel Blob..." : "Creating lesson..."}
                    </p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Please keep this window open until complete.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isUploading ||
                  (videoSourceType === "file" && !newLessonData.videoFile) ||
                  (videoSourceType === "url" && !newLessonUrl.trim())
                }
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{videoSourceType === "file" ? "Uploading Video..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-gold" />
                    <span>
                      {videoSourceType === "file" ? "Create & Upload Lesson" : "Create Lesson"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Lessons List & Preview Players */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              Course Curriculum ({lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"})
            </h2>
            <button
              onClick={fetchCourseAndLessons}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 text-xs inline-flex items-center gap-1 transition-colors"
              title="Refresh lessons"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {lessons.length === 0 ? (
            <div className="card-surface p-12 text-center border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-primary-tint text-primary mx-auto flex items-center justify-center mb-3">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                No lessons created yet
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Use the form on the left to upload your first lesson video and establish the course curriculum.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="card-surface p-5 sm:p-6 transition-all hover:border-primary/30 space-y-4"
                >
                  {/* Top Bar of Lesson Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary-tint text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        #{lesson.order}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {lesson.title}
                        </h3>
                        <p className="text-[11px] text-muted">
                          Added {new Date(lesson.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {lesson.isPreview ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Free Preview
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          <Lock className="w-2.5 h-2.5" />
                          Enrolled Only
                        </span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
                        <Link
                          href={`/learn/${courseId}/${lesson._id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="Open in Player"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openReplaceVideoModal(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="Replace Video File"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                          title="Edit Lesson Metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingLesson(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red-tint transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Video Player Preview */}
                  {lesson.videoUrl ? (
                    <div className="rounded-xl overflow-hidden bg-black border border-border shadow-inner aspect-video max-h-[300px] flex items-center justify-center w-full">
                      {getYouTubeEmbedUrl(lesson.videoUrl) ? (
                        <iframe
                          className="w-full h-full object-contain border-0"
                          src={getYouTubeEmbedUrl(lesson.videoUrl) || ""}
                          title={lesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          preload="metadata"
                          className="w-full max-h-[300px] object-contain mx-auto"
                          src={lesson.videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-primary-tint/20 text-center border border-border">
                      <p className="text-xs text-muted">No video attached.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Metadata Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                Edit Lesson
              </h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lesson Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Order Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.order}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, order: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Preview Access
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editFormData.isPreview}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isPreview: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Free Preview
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  disabled={isUpdating}
                  className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replace Video Modal */}
      {replacingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Replace Video
              </h3>
              <button
                onClick={() => setReplacingLesson(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted mb-4">
              Specify a new video asset for <strong className="text-foreground">{replacingLesson.title}</strong>.
            </p>

            <form onSubmit={handleReplaceVideoSubmit} className="space-y-4">
              {/* Toggle Source Type */}
              <div className="flex rounded-xl bg-background p-1 border border-border">
                <button
                  type="button"
                  onClick={() => setReplaceSourceType("file")}
                  disabled={isReplacingVideo}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    replaceSourceType === "file"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setReplaceSourceType("url")}
                  disabled={isReplacingVideo}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    replaceSourceType === "url"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  YouTube / URL
                </button>
              </div>

              {/* Conditional Input Fields */}
              {replaceSourceType === "file" ? (
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-background/50">
                  <input
                    id="replace-video-file-input"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    required={replaceSourceType === "file"}
                    disabled={isReplacingVideo}
                    onChange={(e) => setReplaceVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="replace-video-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-tint text-primary flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    {replaceVideoFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground truncate max-w-[240px]">
                          {replaceVideoFile.name}
                        </p>
                        <p className="text-[10px] text-muted">
                          {(replaceVideoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Select replacement video
                        </p>
                        <p className="text-[10px] text-muted">
                          MP4, WebM or MOV up to 200MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Video URL <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={replaceVideoUrl}
                    onChange={(e) => setReplaceVideoUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    required={replaceSourceType === "url"}
                    disabled={isReplacingVideo}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>
              )}

              {isReplacingVideo && (
                <div className="p-3 rounded-xl bg-primary-tint text-primary border border-primary/20 flex items-center gap-2 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>
                    {replaceSourceType === "file"
                      ? "Uploading replacement video to Vercel Blob..."
                      : "Updating lesson video..."}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplacingLesson(null)}
                  disabled={isReplacingVideo}
                  className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isReplacingVideo ||
                    (replaceSourceType === "file" && !replaceVideoFile) ||
                    (replaceSourceType === "url" && !replaceVideoUrl.trim())
                  }
                  className="px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isReplacingVideo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{replaceSourceType === "file" ? "Uploading..." : "Updating..."}</span>
                    </>
                  ) : (
                    <span>
                      {replaceSourceType === "file" ? "Upload & Replace" : "Replace Video"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lesson Confirmation Modal */}
      {deletingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-red-tint text-red flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Delete Lesson?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-5">
              Are you sure you want to delete lesson #{deletingLesson.order}:{" "}
              <strong className="text-foreground">&quot;{deletingLesson.title}&quot;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingLesson(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLessonSubmit}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
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
