import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { hasPaidAccess } from "@/lib/enrollmentGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Lesson not found", 404);
    }

    await connectDB();

    const lesson = await Lesson.findById(id).populate("course", "title slug isPublished");
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    const authUser = await getAuthUserFromRequest(req);
    const courseId = lesson.course?._id || lesson.course;

    const userHasAccess = authUser
      ? await hasPaidAccess(authUser._id, courseId, authUser.role)
      : false;

    const lessonObj = lesson.toObject();
    if (!userHasAccess && !lessonObj.isPreview) {
      lessonObj.videoUrl = "";
      lessonObj.youtubeVideoId = "";
    }

    return apiSuccess({ lesson: lessonObj });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch lesson", 500);
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
      return apiError("Invalid lesson ID", 400);
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return apiError("Lesson title cannot be empty", 400);
      }
      updateData.title = body.title.trim();
    }

    if (body.order !== undefined) {
      const orderNum = Number(body.order);
      if (isNaN(orderNum) || orderNum < 1) {
        return apiError("Order must be a positive number", 400);
      }
      updateData.order = orderNum;
    }

    if (body.isPreview !== undefined) {
      updateData.isPreview = Boolean(body.isPreview);
    }

    if (body.videoProvider !== undefined) {
      updateData.videoProvider = body.videoProvider;
    }

    if (body.youtubeVideoId !== undefined) {
      updateData.youtubeVideoId = body.youtubeVideoId;
    }

    if (body.videoUrl !== undefined) {
      updateData.videoUrl = body.videoUrl;
    }

    await connectDB();

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLesson) {
      return apiError("Lesson not found", 404);
    }

    return apiSuccess({ lesson: updatedLesson });
  } catch (error: any) {
    return apiError(error.message || "Failed to update lesson", 500);
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
      return apiError("Invalid lesson ID", 400);
    }

    await connectDB();

    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    return apiSuccess({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete lesson", 500);
  }
}
