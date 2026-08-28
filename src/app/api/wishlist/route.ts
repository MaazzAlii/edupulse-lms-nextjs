import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Wishlist from "@/models/Wishlist";
import Course from "@/models/Course";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/wishlist
 * Returns current authenticated user's wishlisted courses.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    const wishlists = await Wishlist.find({ user: user._id })
      .populate({
        path: "course",
        populate: { path: "category", select: "name slug" },
      })
      .sort({ createdAt: -1 });

    const validWishlists = wishlists.filter((w) => w.course && (w.course as any).isPublished);

    return apiSuccess({
      wishlists: validWishlists,
      count: validWishlists.length,
    });
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return apiError(error.message || "Failed to fetch wishlist", 500);
  }
}

/**
 * POST /api/wishlist
 * Adds a course to current user's wishlist.
 * Body: { courseId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    const body = await req.json().catch(() => ({}));
    const { courseId } = body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return apiError("Valid courseId is required.", 400);
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return apiError("Course is unavailable for wishlisting.", 404);
    }

    const item = await Wishlist.findOneAndUpdate(
      { user: user._id, course: courseId },
      { user: user._id, course: courseId },
      { upsert: true, new: true }
    ).populate({
      path: "course",
      populate: { path: "category", select: "name slug" },
    });

    return apiSuccess(
      {
        message: "Added to wishlist",
        wishlist: item,
      },
      201
    );
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);
    return apiError(error.message || "Failed to add to wishlist", 500);
  }
}
