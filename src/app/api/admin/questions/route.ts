import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Question from "@/models/Question";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/questions
 * Returns all student questions across all courses for admin moderation and replies.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return apiError("Admin authentication required.", 403);
    }

    await connectDB();

    const questions = await Question.find()
      .populate("user", "name email")
      .populate("course", "title slug")
      .populate("lesson", "title order")
      .populate("replies.user", "name")
      .sort({ createdAt: -1 });

    return apiSuccess({
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    console.error("Error fetching admin questions queue:", error);
    return apiError(error.message || "Failed to fetch admin questions", 500);
  }
}
