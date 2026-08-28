import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Question from "@/models/Question";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * DELETE /api/questions/[id]
 * Deletes a question (Author or Admin only).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to delete a question.", 401);
    }

    const { id: questionId } = await params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return apiError("Invalid question ID", 400);
    }

    await connectDB();

    const question = await Question.findById(questionId);
    if (!question) {
      return apiError("Question not found", 404);
    }

    const isAuthor = question.user.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return apiError("You do not have permission to delete this question.", 403);
    }

    await Question.findByIdAndDelete(questionId);

    return apiSuccess({
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting question:", error);
    return apiError(error.message || "Failed to delete question", 500);
  }
}
