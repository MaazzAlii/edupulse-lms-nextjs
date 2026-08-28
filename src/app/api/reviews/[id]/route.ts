import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Review from "@/models/Review";
import { recalculateCourseRating } from "@/lib/reviewStats";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * PUT /api/reviews/[id]
 * Updates a review (Author can update rating/comment; Admin can update adminReply).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to update a review.", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid review ID", 400);
    }

    await connectDB();

    const review = await Review.findById(id);
    if (!review) {
      return apiError("Review not found", 404);
    }

    const isAuthor = review.user.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return apiError("You do not have permission to edit this review.", 403);
    }

    const body = await req.json().catch(() => ({}));
    const updateData: Record<string, any> = {};

    // Admin reply update
    if (isAdmin && body.adminReply !== undefined) {
      updateData.adminReply = String(body.adminReply).trim();
    }

    // Author rating/comment update
    if (isAuthor) {
      if (body.rating !== undefined) {
        const ratingNum = Number(body.rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
          return apiError("Rating must be an integer between 1 and 5.", 400);
        }
        updateData.rating = ratingNum;
      }

      if (body.comment !== undefined) {
        if (typeof body.comment !== "string" || !body.comment.trim()) {
          return apiError("Comment cannot be empty.", 400);
        }
        updateData.comment = body.comment.trim();
      }
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("user", "name");

    // Recalculate course ratings if rating was modified
    await recalculateCourseRating(review.course);

    return apiSuccess({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return apiError(error.message || "Failed to update review", 500);
  }
}

/**
 * DELETE /api/reviews/[id]
 * Deletes a review (Author or Admin only).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to delete a review.", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid review ID", 400);
    }

    await connectDB();

    const review = await Review.findById(id);
    if (!review) {
      return apiError("Review not found", 404);
    }

    const isAuthor = review.user.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return apiError("You do not have permission to delete this review.", 403);
    }

    const courseId = review.course;
    await Review.findByIdAndDelete(id);

    // Recalculate course ratings after deletion
    await recalculateCourseRating(courseId);

    return apiSuccess({
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return apiError(error.message || "Failed to delete review", 500);
  }
}
