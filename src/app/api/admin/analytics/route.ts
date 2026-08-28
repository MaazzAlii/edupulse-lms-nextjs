import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { getLast12MonthsData } from "@/lib/analytics";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/analytics
 * Returns overall revenue metrics, monthly trends, and top selling courses.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return apiError("Admin authentication required.", 403);
    }

    await connectDB();

    // 1. Monthly Signups (User registrations)
    const monthlySignups = await getLast12MonthsData(User, "createdAt");

    // 2. Monthly Paid Enrollments & Revenue
    const monthlyEnrollments = await getLast12MonthsData(Enrollment, "enrolledAt", {
      paymentStatus: "Paid",
    });

    // 3. Overall Totals
    const [totalUsers, totalCourses, paidEnrollmentsCount, revenueResult] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments({ paymentStatus: "Paid" }),
      Enrollment.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? Math.round(revenueResult[0].totalRevenue * 100) / 100 : 0;

    // 4. Top 5 Courses by Paid Enrollments
    const topCoursesAggregate = await Enrollment.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: "$course",
          enrollmentsCount: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { enrollmentsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          _id: 1,
          enrollmentsCount: 1,
          totalRevenue: 1,
          title: "$courseInfo.title",
          price: "$courseInfo.price",
          instructor: "$courseInfo.instructor",
          isPublished: "$courseInfo.isPublished",
        },
      },
    ]);

    return apiSuccess({
      totals: {
        totalRevenue,
        totalEnrollments: paidEnrollmentsCount,
        totalUsers,
        totalCourses,
      },
      monthlySignups,
      monthlyEnrollments,
      topCourses: topCoursesAggregate,
    });
  } catch (error: any) {
    console.error("Error generating admin analytics:", error);
    return apiError(error.message || "Failed to generate analytics", 500);
  }
}
