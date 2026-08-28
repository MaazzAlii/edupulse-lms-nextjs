import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Course from "@/models/Course";

/**
 * Recalculates denormalized averageRating and numReviews on Course document
 * based on all existing reviews for that course.
 */
export async function recalculateCourseRating(
  courseId: string | mongoose.Types.ObjectId
): Promise<{ averageRating: number; numReviews: number }> {
  try {
    await connectDB();

    const courseObjId =
      typeof courseId === "string"
        ? new mongoose.Types.ObjectId(courseId)
        : courseId;

    const stats = await Review.aggregate([
      { $match: { course: courseObjId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    let averageRating = 0;
    let numReviews = 0;

    if (stats.length > 0) {
      // Round to 1 decimal place (e.g. 4.7)
      averageRating = Math.round(stats[0].averageRating * 10) / 10;
      numReviews = stats[0].numReviews;
    }

    await Course.findByIdAndUpdate(courseId, {
      averageRating,
      numReviews,
    });

    return { averageRating, numReviews };
  } catch (error) {
    console.error("Error recalculating course rating stats:", error);
    return { averageRating: 0, numReviews: 0 };
  }
}
