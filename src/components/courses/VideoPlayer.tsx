"use client";

import React, { useState } from "react";
import { Play, Volume2, Maximize, CheckCircle2, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onLessonEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  onLessonEnded,
}) => {
  const isEmbed = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo.com");

  // Format embed URL for autoplay and cleanliness
  let embedUrl = videoUrl;
  if (videoUrl.includes("watch?v=")) {
    embedUrl = videoUrl.replace("watch?v=", "embed/");
  }

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
      {isEmbed ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover border-0"
        />
      ) : (
        <video
          src={videoUrl}
          controls
          onEnded={onLessonEnded}
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
