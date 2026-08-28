import { put } from "@vercel/blob";

export class VideoUploadError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "VideoUploadError";
    this.statusCode = statusCode;
  }
}

const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

/**
 * Uploads a video file to Vercel Blob storage.
 * Performs validation for MIME type, size, and environment configuration.
 */
export async function uploadVideo(
  file: File
): Promise<{ url: string; size: number }> {
  if (!file) {
    throw new VideoUploadError("No video file provided", 400);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new VideoUploadError(
      `Invalid video file type: "${file.type || "unknown"}". Allowed types are video/mp4, video/webm, and video/quicktime.`,
      400
    );
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new VideoUploadError(
      `File size (${sizeInMB}MB) exceeds the maximum limit of 200MB.`,
      400
    );
  }

  // Verify Blob token is configured
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new VideoUploadError(
      "Vercel Blob storage is not configured. BLOB_READ_WRITE_TOKEN environment variable is missing.",
      500
    );
  }

  // Sanitize filename: replace spaces and unsafe characters with hyphen
  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  const pathname = `lessons/${Date.now()}-${sanitizedName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });

    return {
      url: blob.url,
      size: file.size,
    };
  } catch (err: any) {
    if (err instanceof VideoUploadError) throw err;
    throw new VideoUploadError(
      `Failed to upload video to Vercel Blob: ${err.message || err}`,
      500
    );
  }
}
