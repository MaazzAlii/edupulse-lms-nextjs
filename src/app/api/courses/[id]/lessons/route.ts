import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { hasPaidAccess } from "@/lib/enrollmentGuard";
import { apiError, apiSuccess } from "@/lib/response";
import { uploadVideo, VideoUploadError } from "@/lib/videoUpload";

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

    const course = await Course.findById(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    // If unpublished, only admins can view
    if (!course.isPublished && !isAdmin) {
      return apiError("Course not found", 404);
    }

    const userHasAccess = authUser
      ? await hasPaidAccess(authUser._id, id, authUser.role)
      : false;

    const rawLessons = await Lesson.find({ course: id }).sort({ order: 1 });

    // Sanitize videoUrl unless user has paid access, is admin, or lesson is preview
    const lessons = rawLessons.map((lesson) => {
      const lessonObj = lesson.toObject();
      if (!userHasAccess && !lessonObj.isPreview) {
        lessonObj.videoUrl = "";
      }
      return lessonObj;
    });

    return apiSuccess({ lessons });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch lessons", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Course not found", 404);
    }

    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const orderStr = formData.get("order") as string | null;
    const isPreviewStr = formData.get("isPreview") as string | null;
    const videoFile = formData.get("video") as File | null;
    const videoUrlFromForm = formData.get("videoUrl") as string | null;

    if (!title || !title.trim()) {
      return apiError("Lesson title is required", 400);
    }

    let finalVideoUrl = "";
    if (videoUrlFromForm && videoUrlFromForm.trim()) {
      finalVideoUrl = videoUrlFromForm.trim();
    } else {
      if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
        return apiError("Either a video file or a video URL is required", 400);
      }

      let uploadResult;
      try {
        uploadResult = await uploadVideo(videoFile);
        finalVideoUrl = uploadResult.url;
      } catch (uploadErr: any) {
        if (uploadErr instanceof VideoUploadError) {
          return apiError(uploadErr.message, uploadErr.statusCode);
        }
        return apiError(uploadErr.message || "Video upload failed", 500);
      }
    }

    let order = 1;
    if (orderStr !== null && orderStr !== undefined && orderStr !== "") {
      order = Number(orderStr);
      if (isNaN(order)) order = 1;
    } else {
      // Auto-assign next order number if not specified
      const lastLesson = await Lesson.findOne({ course: id }).sort({ order: -1 });
      if (lastLesson) {
        order = lastLesson.order + 1;
      }
    }

    const isPreview = isPreviewStr === "true" || isPreviewStr === "1";

    const lesson = await Lesson.create({
      course: course._id,
      title: title.trim(),
      order,
      isPreview,
      videoUrl: finalVideoUrl,
      durationSeconds: 0,
    });

    return apiSuccess({ lesson }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create lesson", 500);
  }
}
