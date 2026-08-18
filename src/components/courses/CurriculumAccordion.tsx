"use client";

import React, { useState } from "react";
import { ISection, ILesson } from "@/types";
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle, Lock, Eye } from "lucide-react";

interface CurriculumAccordionProps {
  sections: ISection[];
  activeLessonId?: string;
  onSelectLesson?: (lesson: ILesson, sectionId: string) => void;
  isEnrolled?: boolean;
  completedLessonIds?: string[];
  onToggleComplete?: (lessonId: string) => void;
  onPreviewLesson?: (lesson: ILesson) => void;
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({
  sections,
  activeLessonId,
  onSelectLesson,
  isEnrolled = false,
  completedLessonIds = [],
  onToggleComplete,
  onPreviewLesson,
}) => {
  // By default, open all sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      initial[sec.id] = true;
    });
    return initial;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="space-y-3">
      {sections.map((section, sectionIndex) => {
        const isOpen = openSections[section.id] ?? true;
        const totalMinutes = section.lessons.reduce(
          (acc, l) => acc + l.videoLengthMinutes,
          0
        );

        return (
          <div
            key={section.id}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">
                  {sectionIndex + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {section.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {section.lessons.length} lessons • {totalMinutes} mins
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Lessons List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {section.lessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.id;
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isLocked = !isEnrolled && !lesson.isFreePreview;

                  return (
                    <div
                      key={lesson.id}
                      className={`px-5 py-3.5 flex items-center justify-between text-xs transition ${
                        isActive
                          ? "bg-brand-50/80 dark:bg-brand-950/40 border-l-4 border-brand-500 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (!isLocked && onSelectLesson) {
                            onSelectLesson(lesson, section.id);
                          }
                        }}
                        className={`flex items-center gap-3 flex-1 ${
                          !isLocked ? "cursor-pointer" : "cursor-not-allowed opacity-75"
                        }`}
                      >
                        {/* Checkbox or Play Icon */}
                        {isEnrolled && onToggleComplete ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson.id);
                            }}
                            className={`p-1 rounded-full transition ${
                              isCompleted
                                ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <PlayCircle className={`w-4 h-4 ${isActive ? "text-brand-500" : "text-slate-400"}`} />
                        )}

                        <span
                          className={`text-slate-800 dark:text-slate-200 ${
                            isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-slate-400 text-[11px]">
                          {lesson.videoLengthMinutes} mins
                        </span>

                        {lesson.isFreePreview && !isEnrolled && onPreviewLesson && (
                          <button
                            onClick={() => onPreviewLesson(lesson)}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Preview
                          </button>
                        )}

                        {isLocked && (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
