export interface PlaylistItem {
  videoId: string;
  title: string;
  position: number;
}

export interface VideoMeta {
  videoId: string;
  title: string;
  durationSeconds: number;
  embeddable: boolean;
  isAvailable: boolean;
  reason?: string;
}

/**
 * Extract YouTube 11-character video ID from standard YouTube URLs.
 */
export function extractVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  if (match && match[1].length === 11) {
    return match[1];
  }
  return null;
}

/**
 * Extract YouTube playlist ID from list parameter in URLs.
 */
export function extractPlaylistId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const urlObj = new URL(url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`);
    const listParam = urlObj.searchParams.get("list");
    if (listParam && listParam.trim().length > 0) {
      return listParam.trim();
    }
  } catch {
    const match = url.match(/[?&]list=([^#&?]+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Parse ISO 8601 duration (e.g., PT1H2M3S, PT15M33S) into total seconds.
 */
export function parseIsoDuration(duration: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function getApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "YouTube API key (YOUTUBE_API_KEY) is missing. Please configure it in your environment variables."
    );
  }
  return apiKey.trim();
}

/**
 * Fetch items in a YouTube playlist (capped at first 50 items for MVP).
 */
export function fetchPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
  const apiKey = getApiKey();
  const endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${encodeURIComponent(
    playlistId
  )}&key=${encodeURIComponent(apiKey)}`;

  return fetch(endpoint)
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errData) => {
          throw new Error(
            errData.error?.message || `YouTube API returned status ${res.status}`
          );
        });
      }
      return res.json();
    })
    .then((data) => {
      if (!data.items || !Array.isArray(data.items)) {
        return [];
      }
      return data.items
        .map((item: any, idx: number) => ({
          videoId: item.snippet?.resourceId?.videoId || "",
          title: item.snippet?.title || "Untitled Video",
          position: item.snippet?.position ?? idx,
        }))
        .filter((item: PlaylistItem) => item.videoId.length === 11);
    });
}

/**
 * Batch fetch metadata for up to 50 video IDs.
 */
export function fetchVideoMeta(videoIds: string[]): Promise<Record<string, VideoMeta>> {
  if (videoIds.length === 0) return Promise.resolve({});
  const apiKey = getApiKey();
  const idsParam = videoIds.slice(0, 50).map((id) => encodeURIComponent(id)).join(",");
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&id=${idsParam}&key=${encodeURIComponent(
    apiKey
  )}`;

  return fetch(endpoint)
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errData) => {
          throw new Error(
            errData.error?.message || `YouTube API returned status ${res.status}`
          );
        });
      }
      return res.json();
    })
    .then((data) => {
      const result: Record<string, VideoMeta> = {};
      const foundItemsMap: Record<string, any> = {};

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          foundItemsMap[item.id] = item;
        }
      }

      for (const videoId of videoIds) {
        const item = foundItemsMap[videoId];
        if (!item) {
          result[videoId] = {
            videoId,
            title: "Private or Deleted Video",
            durationSeconds: 0,
            embeddable: false,
            isAvailable: false,
            reason: "Video is private, deleted, or unavailable on YouTube",
          };
          continue;
        }

        const embeddable = Boolean(item.status?.embeddable);
        const privacyStatus = item.status?.privacyStatus;
        const isPublicOrUnlisted = privacyStatus === "public" || privacyStatus === "unlisted";
        const durationSeconds = parseIsoDuration(item.contentDetails?.duration || "");
        const title = item.snippet?.title || "Untitled Video";

        let reason: string | undefined;
        let isAvailable = true;

        if (!embeddable) {
          isAvailable = false;
          reason = "Embedding is disabled by the video owner";
        } else if (!isPublicOrUnlisted) {
          isAvailable = false;
          reason = `Video privacy status is ${privacyStatus || "restricted"}`;
        }

        result[videoId] = {
          videoId,
          title,
          durationSeconds,
          embeddable: isAvailable,
          isAvailable,
          reason,
        };
      }

      return result;
    });
}
