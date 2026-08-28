import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

/**
 * Checks if a given user has paid access to a specific course.
 * Returns true if the user is an admin OR has a 'Paid' Enrollment for the course.
 *
 * @param userId - User ID string or ObjectId
 * @param courseId - Course ID string or ObjectId
 * @param userRole - Optional role of the user (e.g. 'admin')
 */
export async function hasPaidAccess(
  userId?: string | mongoose.Types.ObjectId,
  courseId?: string | mongoose.Types.ObjectId,
  userRole?: string
): Promise<boolean> {
  if (!userId || !courseId) {
    return false;
  }

  // Admins always have access to all courses
  if (userRole === "admin") {
    return true;
  }

  try {
    await connectDB();

    // Check if course is free (price === 0)
    const course = await Course.findById(courseId).select("price");
    if (course && course.price === 0) {
      return true;
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      paymentStatus: "Paid",
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking paid access guard:", error);
    return false;
  }
}
