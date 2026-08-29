"use client";

import React, { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function YouTubePlayer({
  videoId,
  title = "YouTube Video Player",
  onEnded,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndedRef = useRef(onEnded);

  // Keep ref in sync to avoid re-attaching player listeners unnecessarily
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    let isMounted = true;

    function initPlayer() {
      if (!isMounted || !containerRef.current || !window.YT || !window.YT.Player) return;

      // Destroy existing player instance if any
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying YT player:", e);
        }
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) {
              if (onEndedRef.current) {
                onEndedRef.current();
              }
            }
          },
        },
      });
    }

    // Check if YouTube Iframe API script is already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Load Iframe API script if not already added to DOM
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      // Chain or set global callback
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousCallback === "function") {
          previousCallback();
        }
        initPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [videoId]);

  return (
    <div className="w-full h-full aspect-video bg-black relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" title={title} />
    </div>
  );
}
