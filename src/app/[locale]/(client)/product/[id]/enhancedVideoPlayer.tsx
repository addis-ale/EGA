"use client";

import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EnhancedVideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  title?: string;
}

export function EnhancedVideoPlayer({
  videoSrc,
  posterSrc,
  title,
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if the URL is from YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Check if the URL is from GitHub
  const isGitHubUrl = (url: string): boolean => {
    return (
      url.includes("github.com") || url.includes("raw.githubusercontent.com")
    );
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Convert GitHub URL to raw content URL if necessary
  const getGitHubRawUrl = (url: string): string => {
    if (url.includes("raw.githubusercontent.com")) {
      return url; // Already a raw URL
    }
    return url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  };

  const isYoutube = isYouTubeUrl(videoSrc);
  const isGitHub = isGitHubUrl(videoSrc);
  const videoId = isYoutube ? getYouTubeVideoId(videoSrc) : null;
  const videoUrl = isGitHub ? getGitHubRawUrl(videoSrc) : videoSrc;

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);

    if (!isYoutube && videoRef.current) {
      // For direct video files (including GitHub-hosted)
      videoRef.current
        .play()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          setIsLoading(false);
          setIsPlaying(false);
        });
    } else {
      // For YouTube videos, loading state will be handled by iframe onload
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  // Reset playing state when component unmounts
  useEffect(() => {
    return () => {
      if (!isYoutube && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    };
  }, [isYoutube]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.hidden &&
        !isYoutube &&
        videoRef.current &&
        !videoRef.current.paused
      ) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isYoutube]);

  return (
    <div className="space-y-2 sm:space-y-3">
      {title && (
        <h3 className="text-base sm:text-lg font-medium text-white">{title}</h3>
      )}

      <Card className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden border-0 w-full">
        {isPlaying ? (
          isYoutube ? (
            // YouTube embed
            <div className="w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={() => setIsLoading(false)}
              ></iframe>
            </div>
          ) : (
            // Direct video file (including GitHub-hosted)
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              controls
              autoPlay
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsLoading(false)}
              crossOrigin="anonymous" // Add this for CORS support
            />
          )
        ) : (
          <>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  posterSrc ||
                  (isYoutube
                    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                    : "/placeholder.svg?height=720&width=1280")
                })`,
              }}
            ></div>
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
              onClick={handlePlay}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition-transform transform hover:scale-110">
                {isLoading ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-zinc-800 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-800 ml-1" />
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
