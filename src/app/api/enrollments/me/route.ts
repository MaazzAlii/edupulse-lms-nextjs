import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/enrollments/me
 * Retrieves current user's enrollment list or single course enrollment status via ?courseId=...
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to check enrollments.", 401);
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      const enrollment = await Enrollment.findOne({
        user: user._id,
        course: courseId,
      }).populate("course", "title thumbnailUrl price");

      return apiSuccess({
        enrollment: enrollment || null,
        isEnrolled: enrollment?.paymentStatus === "Paid",
        paymentStatus: enrollment?.paymentStatus || "None",
      });
    }

    // Return all user's enrollments
    const enrollments = await Enrollment.find({ user: user._id })
      .populate("course", "title thumbnailUrl price category")
      .sort({ enrolledAt: -1 });

    return apiSuccess({
      count: enrollments.length,
      enrollments,
    });
  } catch (error: any) {
    console.error("Error fetching user enrollments:", error);
    return apiError(error.message || "Failed to fetch enrollments", 500);
  }
}
