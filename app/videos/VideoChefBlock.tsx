"use client";

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
  const ratingLabel =
    video.rating_tag && video.rating_tag.trim() !== ""
      ? video.rating_tag
      : "(ohne Bewertung)";

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
      aria-labelledby={`video-${video.id}-title`}
    >
      <div className="mb-4">
        <span id={`video-${video.id}-title`} className="sr-only">
          Video {ratingLabel}
        </span>
        <VideoCard video={video} />
      </div>

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
    </section>
  );
}
