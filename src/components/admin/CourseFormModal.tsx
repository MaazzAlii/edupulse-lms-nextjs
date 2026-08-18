"use client";

import React, { useState, useEffect } from "react";
import { ICourse, Category, CourseLevel, ISection, ILesson } from "@/types";
import { useLMS } from "@/context/LMSContext";
import {
  X,
  Plus,
  Trash2,
  BookPlus,
  Video,
  Layers,
  Save,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: ICourse | null;
}

const CATEGORIES: Category[] = [
  "Web Development",
  "Artificial Intelligence",
  "Data Science",
  "Cloud & DevOps",
  "UI/UX Design",
  "Cybersecurity",
  "Mobile App Dev",
];

const LEVELS: CourseLevel[] = ["Beginner", "Intermediate", "Expert", "All Levels"];

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
}) => {
  const { createCourse, updateCourse, user } = useLMS();

  const [activeTab, setActiveTab] = useState<"details" | "curriculum" | "extra">("details");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Web Development");
  const [level, setLevel] = useState<CourseLevel>("Intermediate");
  const [price, setPrice] = useState(89);
  const [estimatedPrice, setEstimatedPrice] = useState(199);
  const [thumbnail, setThumbnail] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [sections, setSections] = useState<ISection[]>([
    {
      id: `sec-${Date.now()}`,
      title: "Section 1: Getting Started",
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: "01. Introduction to the course",
          description: "Overview and environment setup.",
          videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y",
          videoLengthMinutes: 15,
          isFreePreview: true,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title);
      setDescription(courseToEdit.description);
      setCategory(courseToEdit.category);
      setLevel(courseToEdit.level);
      setPrice(courseToEdit.price);
      setEstimatedPrice(courseToEdit.estimatedPrice);
      setThumbnail(courseToEdit.thumbnail);
      setDemoVideoUrl(courseToEdit.demoVideoUrl);
      setTagsInput(courseToEdit.tags.join(", "));
      setBenefits(courseToEdit.benefits.length > 0 ? courseToEdit.benefits : [""]);
      setPrerequisites(courseToEdit.prerequisites.length > 0 ? courseToEdit.prerequisites : [""]);
      setSections(courseToEdit.sections);
    } else {
      // Defaults for new course
      setTitle("");
      setDescription("");
      setCategory("Web Development");
      setLevel("Beginner");
      setPrice(49);
      setEstimatedPrice(99);
      setThumbnail("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop");
      setDemoVideoUrl("https://www.youtube.com/embed/kf6yyxMck8Y");
      setTagsInput("Web, Next.js, Coding");
      setBenefits(["Master complete full-stack web architecture", "Deploy with confidence to production"]);
      setPrerequisites(["Basic HTML/CSS and JavaScript"]);
      setSections([
        {
          id: `sec-${Date.now()}`,
          title: "Section 1: Architecture & Foundations",
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: "01. Welcome and Course Roadmap",
              description: "Getting ready for building the project.",
              videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y",
              videoLengthMinutes: 20,
              isFreePreview: true,
            },
          ],
        },
      ]);
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  // Curriculum handlers
  const addSection = () => {
    const newSec: ISection = {
      id: `sec-${Date.now()}`,
      title: `Section ${sections.length + 1}: New Section`,
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: "01. Lesson Title",
          description: "Lesson details and code files.",
          videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y",
          videoLengthMinutes: 15,
          isFreePreview: false,
        },
      ],
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (secId: string) => {
    setSections(sections.filter((s) => s.id !== secId));
  };

  const updateSectionTitle = (secId: string, newTitle: string) => {
    setSections(
      sections.map((s) => (s.id === secId ? { ...s, title: newTitle } : s))
    );
  };

  const addLesson = (secId: string) => {
    const newLesson: ILesson = {
      id: `les-${Date.now()}`,
      title: "New Video Lesson",
      description: "Video explanation and implementation.",
      videoUrl: "https://www.youtube.com/embed/kf6yyxMck8Y",
      videoLengthMinutes: 20,
      isFreePreview: false,
    };

    setSections(
      sections.map((s) =>
        s.id === secId ? { ...s, lessons: [...s.lessons, newLesson] } : s
      )
    );
  };

  const removeLesson = (secId: string, lesId: string) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lesId) }
          : s
      )
    );
  };

  const updateLessonField = (
    secId: string,
    lesId: string,
    field: keyof ILesson,
    val: any
  ) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lesId ? { ...l, [field]: val } : l
              ),
            }
          : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanBenefits = benefits.filter((b) => b.trim().length > 0);
    const cleanPrereqs = prerequisites.filter((p) => p.trim().length > 0);

    if (courseToEdit) {
      updateCourse(courseToEdit.id, {
        title,
        description,
        category,
        level,
        price: Number(price),
        estimatedPrice: Number(estimatedPrice),
        thumbnail,
        demoVideoUrl,
        tags,
        benefits: cleanBenefits,
        prerequisites: cleanPrereqs,
        sections,
      });
    } else {
      createCourse({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        category,
        level,
        price: Number(price),
        estimatedPrice: Number(estimatedPrice),
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
        demoVideoUrl: demoVideoUrl || "https://www.youtube.com/embed/kf6yyxMck8Y",
        tags,
        instructor: {
          name: user.name,
          role: "Lead Platform Instructor",
          avatar: user.avatar,
          bio: "Senior software engineer with enterprise full-stack experience.",
        },
        benefits: cleanBenefits,
        prerequisites: cleanPrereqs,
        sections,
        reviews: [],
        isPublished: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {courseToEdit ? "Edit Course Studio" : "Create New Masterclass"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure curriculum, videos, pricing, and student learning outcomes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 pt-4 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "details"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            1. Course Details & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "curriculum"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            2. Curriculum & Videos ({sections.length} Sections)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("extra")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "extra"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            3. Benefits & Prerequisites
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
          {/* TAB 1: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Next.js 14 & Cloud Deployments"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive description of the course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as CourseLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated / Strike Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preview / Demo Video URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/..."
                    value={demoVideoUrl}
                    onChange={(e) => setDemoVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Full Stack, TypeScript"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM */}
          {activeTab === "curriculum" && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Course Modules & Lessons
                </span>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold flex items-center gap-1.5 hover:bg-brand-500 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                        className="font-bold text-sm bg-transparent border-b border-dashed border-slate-400 focus:outline-none flex-1 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sec.id)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section Lessons */}
                    <div className="space-y-3 pl-4 border-l-2 border-brand-500/30">
                      {sec.lessons.map((les, lesIdx) => (
                        <div
                          key={les.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              value={les.title}
                              onChange={(e) =>
                                updateLessonField(sec.id, les.id, "title", e.target.value)
                              }
                              className="font-semibold text-xs bg-transparent border-b border-slate-300 dark:border-slate-700 flex-1 py-0.5 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(sec.id, les.id)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="Video URL (YouTube embed or MP4)"
                                value={les.videoUrl}
                                onChange={(e) =>
                                  updateLessonField(sec.id, les.id, "videoUrl", e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Duration (min)"
                                value={les.videoLengthMinutes}
                                onChange={(e) =>
                                  updateLessonField(
                                    sec.id,
                                    les.id,
                                    "videoLengthMinutes",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                              />
                              <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={les.isFreePreview || false}
                                  onChange={(e) =>
                                    updateLessonField(
                                      sec.id,
                                      les.id,
                                      "isFreePreview",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded"
                                />
                                Preview
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLesson(sec.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-brand-500 hover:text-white transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXTRA */}
          {activeTab === "extra" && (
            <div className="space-y-6 text-xs">
              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    What will students learn? (Benefits)
                  </label>
                  <button
                    type="button"
                    onClick={() => setBenefits([...benefits, ""])}
                    className="text-brand-500 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Point
                  </button>
                </div>
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const newB = [...benefits];
                        newB[i] = e.target.value;
                        setBenefits(newB);
                      }}
                      placeholder="e.g. Master Next.js 14 App Router"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Prerequisites */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Prerequisites / Requirements
                  </label>
                  <button
                    type="button"
                    onClick={() => setPrerequisites([...prerequisites, ""])}
                    className="text-brand-500 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Requirement
                  </button>
                </div>
                {prerequisites.map((p, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => {
                        const newP = [...prerequisites];
                        newP[i] = e.target.value;
                        setPrerequisites(newP);
                      }}
                      placeholder="e.g. Basic JavaScript knowledge"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setPrerequisites(prerequisites.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-accent-400 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {courseToEdit ? "Update Course" : "Publish Masterclass"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
