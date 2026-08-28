import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/enrollmentGuard";
import Review from "@/models/Review";
import Course from "@/models/Course";
import { recalculateCourseRating } from "@/lib/reviewStats";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/courses/[id]/reviews
 * Returns public reviews for a course populated with reviewer name.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Invalid course ID", 400);
    }

    await connectDB();

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return apiSuccess({
      reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    console.error("Error fetching course reviews:", error);
    return apiError(error.message || "Failed to fetch reviews", 500);
  }
}

/**
 * POST /api/courses/[id]/reviews
 * Creates a new course review for an enrolled user.
 * Body: { rating: number, comment: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to leave a review.", 401);
    }

    const { id: courseId } = await params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Invalid course ID", 400);
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return apiError("Course not found or is unavailable", 404);
    }

    // 1. Enforce paid enrollment check
    const isEnrolled = await hasPaidAccess(user._id, courseId, user.role);
    if (!isEnrolled) {
      return apiError("Enroll in this course to leave a review.", 403);
    }

    // 2. Enforce duplicate review check
    const existingReview = await Review.findOne({
      course: courseId,
      user: user._id,
    });

    if (existingReview) {
      return apiError("You have already reviewed this course.", 400);
    }

    const body = await req.json().catch(() => ({}));
    const { rating, comment } = body;

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return apiError("Rating must be an integer between 1 and 5.", 400);
    }

    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return apiError("Comment is required.", 400);
    }

    // 3. Create review document
    const review = await Review.create({
      course: courseId,
      user: user._id,
      rating: ratingNum,
      comment: comment.trim(),
    });

    // 4. Recalculate Course rating stats synchronously
    await recalculateCourseRating(courseId);

    const populatedReview = await Review.findById(review._id).populate("user", "name");

    return apiSuccess(
      {
        message: "Review submitted successfully",
        review: populatedReview,
      },
      201
    );
  } catch (error: any) {
    console.error("Error creating review:", error);
    return apiError(error.message || "Failed to submit review", 500);
  }
}
