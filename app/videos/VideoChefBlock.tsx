"use client";

import { useState } from "react";
import type { Video, VideoComment } from "@/types/database";
import { VideoCard } from "./VideoCard";
import { CaptionEditor } from "./components/CaptionEditor";
import { CommentBox } from "./components/CommentBox";
import { DateEditor } from "./components/DateEditor";
import { RatingEditor } from "./components/RatingEditor";

type VideoChefBlockProps = {
  video: Video;
  comments: VideoComment[];
};

export function VideoChefBlock({ video, comments }: VideoChefBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const ratingLabel =
    video.rating_tag && video.rating_tag.trim() !== ""
      ? video.rating_tag
      : "(ohne Bewertung)";

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
      aria-labelledby={`video-${video.id}-title`}
    >
      <div className="mb-2">
        <span id={`video-${video.id}-title`} className="sr-only">
          Video {ratingLabel}
        </span>
        <VideoCard video={video} />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {expanded ? (
          <>
            Zuklappen
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </>
        ) : (
          <>
            Aufklappen
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-6 space-y-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <RatingEditor
            videoId={video.id}
            currentRatingTag={video.rating_tag ?? ""}
            currentCaption={video.caption ?? ""}
            labelId={`rating-${video.id}`}
          />
          <CaptionEditor
            videoId={video.id}
            initialCaption={video.caption ?? ""}
            labelId={`caption-${video.id}`}
          />
          <DateEditor
            videoId={video.id}
            proposedPostDate={video.proposed_post_date}
            labelId={`date-${video.id}`}
          />
          <CommentBox
            videoId={video.id}
            comments={comments}
            labelId={`comment-${video.id}`}
          />
        </div>
      )}
    </section>
  );
}
