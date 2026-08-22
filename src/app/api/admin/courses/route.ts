import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

// GET /api/admin/courses - Admin only: Returns all courses (published + drafts)
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const courses = await Course.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess({ courses });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch admin courses", 500);
  }
}
