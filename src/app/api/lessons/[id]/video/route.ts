import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";
import { uploadVideo, VideoUploadError } from "@/lib/videoUpload";
import { extractVideoId } from "@/lib/youtube";

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

    await connectDB();

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;
    const videoUrlFromForm = formData.get("videoUrl") as string | null;

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

    const extractedYtId = extractVideoId(finalVideoUrl);
    lesson.videoUrl = finalVideoUrl;
    if (extractedYtId) {
      lesson.videoProvider = "youtube";
      lesson.youtubeVideoId = extractedYtId;
    } else {
      lesson.videoProvider = "upload";
      lesson.youtubeVideoId = "";
    }

    await lesson.save();

    return apiSuccess({
      message: "Lesson video updated successfully",
      lesson,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to update lesson video", 500);
  }
}
