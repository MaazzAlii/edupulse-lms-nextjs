import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { computeProgress } from "@/lib/progress";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * PUT /api/courses/[id]/progress
 * Updates student lesson completion status for a course.
 * Body: { lessonId: string, completed: boolean }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to update progress.", 401);
    }

    const { id: courseId } = await params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Invalid course ID", 400);
    }

    const body = await req.json().catch(() => ({}));
    const { lessonId, completed } = body;

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return apiError("Valid lessonId is required.", 400);
    }

    if (typeof completed !== "boolean") {
      return apiError("Completed status boolean is required.", 400);
    }

    await connectDB();

    // 1. Verify enrollment exists and user has access
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
      paymentStatus: "Paid",
    });

    if (!enrollment) {
      return apiError("You are not enrolled in this course.", 403);
    }

    // 2. Verify lesson belongs to this course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.course.toString() !== courseId) {
      return apiError("Lesson does not belong to this course.", 400);
    }

    // 3. Count total lessons in course to compute percentage
    const totalLessonsCount = await Lesson.countDocuments({ course: courseId });

    let updatedDoc;

    if (completed) {
      // Add lesson to completedLessons set
      updatedDoc = await Enrollment.findByIdAndUpdate(
        enrollment._id,
        { $addToSet: { completedLessons: lesson._id } },
        { new: true }
      );
    } else {
      // Pull lesson from completedLessons
      updatedDoc = await Enrollment.findByIdAndUpdate(
        enrollment._id,
        { $pull: { completedLessons: lesson._id } },
        { new: true }
      );
    }

    if (!updatedDoc) {
      return apiError("Failed to update enrollment progress.", 500);
    }

    const completedCount = updatedDoc.completedLessons.length;
    const progressPercent = computeProgress(completedCount, totalLessonsCount);

    // If reached 100% completion, set completedAt date if not already set
    if (progressPercent === 100 && !updatedDoc.completedAt) {
      const finalDoc = await Enrollment.findByIdAndUpdate(
        updatedDoc._id,
        { $set: { completedAt: new Date() } },
        { new: true }
      );
      if (finalDoc) {
        updatedDoc = finalDoc;
      }
    }

    return apiSuccess({
      message: completed ? "Lesson marked as complete" : "Lesson unmarked",
      enrollment: updatedDoc,
      completedLessons: updatedDoc.completedLessons,
      completedCount,
      totalLessonsCount,
      progressPercent,
      isCourseCompleted: progressPercent === 100,
    });
  } catch (error: any) {
    console.error("Error updating lesson progress:", error);
    return apiError(error.message || "Failed to update progress", 500);
  }
}
