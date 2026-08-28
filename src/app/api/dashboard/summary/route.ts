import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { computeProgress } from "@/lib/progress";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/dashboard/summary
 * Single endpoint returning student learning progress, continue learning target, and purchase history.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    // Fetch all user enrollments populated with course details
    const enrollments = await Enrollment.find({ user: user._id })
      .populate({
        path: "course",
        populate: { path: "category", select: "name slug" },
      })
      .sort({ updatedAt: -1 });

    const paidEnrollments = enrollments.filter(
      (e) => e.paymentStatus === "Paid" && e.course && (e.course as any).isPublished
    );

    // Compute progress for each paid enrollment
    const enrollmentSummaries = await Promise.all(
      paidEnrollments.map(async (e) => {
        const courseId = (e.course as any)._id;
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const completedCount = e.completedLessons ? e.completedLessons.length : 0;
        const progressPercent = computeProgress(completedCount, totalLessons);

        // Find next incomplete lesson
        let nextLessonId: string | null = null;
        if (totalLessons > 0) {
          const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
          const completedSet = new Set((e.completedLessons || []).map((id) => id.toString()));
          const incomplete = lessons.find((l) => !completedSet.has(l._id.toString()));
          nextLessonId = incomplete ? incomplete._id.toString() : lessons[0]._id.toString();
        }

        return {
          _id: e._id,
          course: e.course,
          progressPercent,
          completedLessonsCount: completedCount,
          totalLessons,
          completedAt: e.completedAt || null,
          updatedAt: e.updatedAt,
          enrolledAt: e.enrolledAt,
          nextLessonId,
        };
      })
    );

    const inProgressCount = enrollmentSummaries.filter(
      (s) => s.progressPercent > 0 && s.progressPercent < 100
    ).length;
    const completedCount = enrollmentSummaries.filter(
      (s) => s.progressPercent === 100
    ).length;

    // Pick most recently updated incomplete/active enrollment for "Continue Learning"
    const continueLearningTarget =
      enrollmentSummaries.find((s) => s.progressPercent < 100) ||
      enrollmentSummaries[0] ||
      null;

    // Purchase history (all user enrollments)
    const purchaseHistory = enrollments.map((e) => ({
      _id: e._id,
      courseTitle: (e.course as any)?.title || "Course",
      courseId: (e.course as any)?._id || "",
      amount: e.amount || 0,
      paymentStatus: e.paymentStatus,
      enrolledAt: e.enrolledAt,
      isCompleted: Boolean(e.completedAt),
    }));

    return apiSuccess({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalEnrolled: enrollmentSummaries.length,
        inProgressCount,
        completedCount,
      },
      enrollments: enrollmentSummaries,
      continueLearning: continueLearningTarget,
      purchaseHistory,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard summary:", error);
    return apiError(error.message || "Failed to load student dashboard", 500);
  }
}
