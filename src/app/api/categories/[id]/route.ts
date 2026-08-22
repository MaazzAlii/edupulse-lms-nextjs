import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid category ID", 400);
    }

    await connectDB();

    const category = await Category.findById(id);
    if (!category) {
      return apiError("Category not found", 404);
    }

    // Check if any course references this category
    const courseCount = await Course.countDocuments({ category: id });
    if (courseCount > 0) {
      return apiError(
        `Cannot delete category "${category.name}" because ${courseCount} course(s) still reference it. Please reassign or delete those courses first.`,
        400
      );
    }

    await Category.findByIdAndDelete(id);

    return apiSuccess({ message: "Category deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete category", 500);
  }
}
