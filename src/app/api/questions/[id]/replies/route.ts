import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Question from "@/models/Question";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * POST /api/questions/[id]/replies
 * Adds an admin reply to a question and notifies the student.
 * Body: { text: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to reply.", 401);
    }

    if (user.role !== "admin") {
      return apiError("Only administrators can reply to questions.", 403);
    }

    const { id: questionId } = await params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return apiError("Invalid question ID", 400);
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return apiError("Reply text is required.", 400);
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        $push: {
          replies: {
            user: user._id,
            text: text.trim(),
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate("user", "name")
      .populate("replies.user", "name");

    if (!updatedQuestion) {
      return apiError("Question not found", 404);
    }

    // Notify the question author (student)
    if (updatedQuestion.user?._id) {
      await Notification.create({
        recipient: updatedQuestion.user._id,
        type: "question_reply",
        message: "An instructor replied to your question in the classroom.",
        link: `/learn/${updatedQuestion.course}/${updatedQuestion.lesson}`,
      });
    }

    return apiSuccess({
      message: "Reply posted successfully",
      question: updatedQuestion,
    });
  } catch (error: any) {
    console.error("Error posting reply:", error);
    return apiError(error.message || "Failed to post reply", 500);
  }
}
