import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/users
 * Returns a paginated, searchable list of users with enrollment counts.
 * Requires Admin authentication.
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword")?.trim();
    const role = searchParams.get("role")?.trim();
    const status = searchParams.get("status")?.trim();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: Record<string, any> = {};

    // Keyword search on name or email
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // Role filter
    if (role && (role === "student" || role === "admin")) {
      query.role = role;
    }

    // Active status filter
    if (status === "active") {
      query.isActive = true;
    } else if (status === "suspended") {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const rawUsers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compute enrollmentCount for each user on this page
    const users = await Promise.all(
      rawUsers.map(async (u) => {
        const enrollmentCount = await Enrollment.countDocuments({
          user: u._id,
        });
        const userObj = u.toObject();
        return {
          ...userObj,
          enrollmentCount,
        };
      })
    );

    const pages = Math.ceil(total / limit) || 1;

    return apiSuccess({
      users,
      total,
      page,
      pages,
      limit,
    });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return apiError(error.message || "Failed to fetch users", 500);
  }
}
