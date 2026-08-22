import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Course not found", 404);
    }

    await connectDB();

    const course = await Course.findById(id).populate("category", "name slug");

    if (!course) {
      return apiError("Course not found", 404);
    }

    // If unpublished, only admins can view
    if (!course.isPublished) {
      const authUser = await getAuthUserFromRequest(req);
      if (authUser?.role !== "admin") {
        return apiError("Course not found", 404);
      }
    }

    return apiSuccess({ course });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch course", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid course ID", 400);
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.instructor !== undefined) updateData.instructor = body.instructor.trim();
    if (body.level !== undefined) updateData.level = body.level;
    if (body.price !== undefined) {
      if (Number(body.price) < 0) {
        return apiError("Price cannot be negative", 400);
      }
      updateData.price = Number(body.price);
    }
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl.trim();
    if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished);

    await connectDB();

    if (body.category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(body.category)) {
        return apiError("Invalid category ID format", 400);
      }
      const categoryDoc = await Category.findById(body.category);
      if (!categoryDoc) {
        return apiError("Category not found", 404);
      }
      updateData.category = categoryDoc._id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!updatedCourse) {
      return apiError("Course not found", 404);
    }

    return apiSuccess({ course: updatedCourse });
  } catch (error: any) {
    return apiError(error.message || "Failed to update course", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid course ID", 400);
    }

    await connectDB();

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    return apiSuccess({ message: "Course deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete course", 500);
  }
}
