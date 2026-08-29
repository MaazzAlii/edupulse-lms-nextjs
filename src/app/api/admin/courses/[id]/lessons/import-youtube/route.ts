import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";
import {
  extractPlaylistId,
  extractVideoId,
  fetchPlaylistItems,
  fetchVideoMeta,
  PlaylistItem,
} from "@/lib/youtube";

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

    const body = await req.json().catch(() => ({}));
    const url = body.url as string | undefined;
    const isPreview = Boolean(body.previewOnly || req.nextUrl.searchParams.get("preview") === "true");

    if (!url || typeof url !== "string" || !url.trim()) {
      return apiError("A valid YouTube video or playlist URL is required", 400);
    }

    const trimmedUrl = url.trim();
    const playlistId = extractPlaylistId(trimmedUrl);
    const singleVideoId = extractVideoId(trimmedUrl);

    if (!playlistId && !singleVideoId) {
      return apiError("Could not extract a valid YouTube video or playlist ID from URL", 400);
    }

    let itemsToProcess: PlaylistItem[] = [];

    if (playlistId) {
      itemsToProcess = await fetchPlaylistItems(playlistId);
      if (itemsToProcess.length === 0) {
        return apiError("No items found in the specified playlist or playlist is private", 404);
      }
    } else if (singleVideoId) {
      itemsToProcess = [
        {
          videoId: singleVideoId,
          title: "YouTube Video",
          position: 0,
        },
      ];
    }

    const videoIds = itemsToProcess.map((item) => item.videoId);
    const metaMap = await fetchVideoMeta(videoIds);

    const validVideos: Array<{
      videoId: string;
      title: string;
      durationSeconds: number;
    }> = [];
    const skipped: Array<{ title: string; reason: string }> = [];

    for (const item of itemsToProcess) {
      const meta = metaMap[item.videoId];
      const videoTitle = meta?.title || item.title || "Untitled Video";

      if (!meta || !meta.isAvailable) {
        skipped.push({
          title: videoTitle,
          reason: meta?.reason || "Video is private, deleted, or unavailable",
        });
      } else {
        validVideos.push({
          videoId: item.videoId,
          title: videoTitle,
          durationSeconds: meta.durationSeconds,
        });
      }
    }

    if (isPreview) {
      return apiSuccess({
        preview: true,
        items: validVideos,
        skipped,
      });
    }

    if (validVideos.length === 0) {
      return apiError(
        "No importable videos were found. All videos in the playlist are disabled for embedding, private, or unavailable.",
        400
      );
    }

    const lastLesson = await Lesson.findOne({ course: id }).sort({ order: -1 });
    let startOrder = lastLesson ? lastLesson.order + 1 : 1;

    const createdLessons = [];
    for (const video of validVideos) {
      const newLesson = await Lesson.create({
        course: course._id,
        title: video.title,
        order: startOrder++,
        videoProvider: "youtube",
        youtubeVideoId: video.videoId,
        videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        durationSeconds: video.durationSeconds,
        isPreview: false,
      });
      createdLessons.push(newLesson);
    }

    return apiSuccess({
      created: createdLessons,
      skipped,
    }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to import YouTube content", 500);
  }
}
