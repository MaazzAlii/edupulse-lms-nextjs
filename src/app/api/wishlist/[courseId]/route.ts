import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Wishlist from "@/models/Wishlist";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * DELETE /api/wishlist/[courseId]
 * Removes a course from current user's wishlist.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    const { courseId } = await params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Invalid course ID", 400);
    }

    await connectDB();

    await Wishlist.findOneAndDelete({
      user: user._id,
      course: courseId,
    });

    return apiSuccess({
      message: "Removed from wishlist",
    });
  } catch (error: any) {
    console.error("Error removing from wishlist:", error);
    return apiError(error.message || "Failed to remove from wishlist", 500);
  }
}
