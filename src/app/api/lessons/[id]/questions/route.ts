import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/enrollmentGuard";
import Lesson from "@/models/Lesson";
import Question from "@/models/Question";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/lessons/[id]/questions
 * Fetch questions for a lesson populated with user names.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return apiError("Invalid lesson ID", 400);
    }

    await connectDB();

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    const questions = await Question.find({ lesson: lessonId })
      .populate("user", "name")
      .populate("replies.user", "name")
      .sort({ createdAt: -1 });

    return apiSuccess({
      questions,
      count: questions.length,
    });
  } catch (error: any) {
    console.error("Error fetching lesson questions:", error);
    return apiError(error.message || "Failed to fetch questions", 500);
  }
}

/**
 * POST /api/lessons/[id]/questions
 * Post a new question for a lesson.
 * Body: { question: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to ask a question.", 401);
    }

    const { id: lessonId } = await params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return apiError("Invalid lesson ID", 400);
    }

    await connectDB();

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    // Access check: User must have paid access OR lesson is preview
    const isAllowed =
      lesson.isPreview || (await hasPaidAccess(user._id, lesson.course, user.role));

    if (!isAllowed) {
      return apiError("You must enroll in this course to ask questions.", 403);
    }

    const body = await req.json().catch(() => ({}));
    const { question: questionText } = body;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return apiError("Question content is required.", 400);
    }

    const newQuestion = await Question.create({
      lesson: lesson._id,
      course: lesson.course,
      user: user._id,
      question: questionText.trim(),
      replies: [],
    });

    const populatedQuestion = await Question.findById(newQuestion._id)
      .populate("user", "name")
      .populate("replies.user", "name");

    return apiSuccess(
      {
        message: "Question posted successfully",
        question: populatedQuestion,
      },
      201
    );
  } catch (error: any) {
    console.error("Error posting question:", error);
    return apiError(error.message || "Failed to post question", 500);
  }
}
