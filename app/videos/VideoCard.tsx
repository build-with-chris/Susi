"use client";

import { useRef, useState } from "react";
import type { Video } from "@/types/database";

type VideoCardProps = { video: Video };

function formatDisplayDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function VideoCard({ video }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const ratingLabel =
    video.rating_tag && video.rating_tag.trim() !== ""
      ? video.rating_tag
      : "(ohne Bewertung)";

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div
        className="relative block aspect-[9/16] w-full cursor-pointer bg-zinc-100 dark:bg-zinc-800"
        onClick={handlePlay}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePlay();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Video abspielen"
      >
        <video
          ref={videoRef}
          src={video.video_url}
          preload="auto"
          playsInline
          controls
          controlsList="nofullscreen"
          className="h-full w-full object-cover"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
        />
        {!playing && (
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
            aria-hidden
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <svg
                className="ml-1 h-6 w-6 text-zinc-900"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </span>
        )}
        <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {ratingLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          {ratingLabel}
        </p>
        <p className="mt-1 flex-1 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
          {video.caption || "—"}
        </p>
        {video.proposed_post_date && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Geplant: {formatDisplayDate(video.proposed_post_date)}
          </p>
        )}
      </div>
    </article>
  );
}
