"use client";

import { useState } from "react";
import type { ProjectImage, ProjectImageComment } from "@/types/database";
import { ImageCard } from "./components/ImageCard";
import { ImageCaptionEditor } from "./components/ImageCaptionEditor";
import { ImageCommentBox } from "./components/ImageCommentBox";
import { ImageDateEditor } from "./components/ImageDateEditor";
import { ImageRatingEditor } from "./components/ImageRatingEditor";

type ImageChefBlockProps = {
  image: ProjectImage;
  comments: ProjectImageComment[];
};

export function ImageChefBlock({ image, comments }: ImageChefBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const ratingLabel =
    image.rating_tag && image.rating_tag.trim() !== ""
      ? image.rating_tag
      : "(ohne Bewertung)";

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
      aria-labelledby={`image-${image.id}-title`}
    >
      <div className="mb-2">
        <span id={`image-${image.id}-title`} className="sr-only">
          Bild {ratingLabel}
        </span>
        <ImageCard image={image} />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
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
          <ImageRatingEditor
            imageId={image.id}
            currentRatingTag={image.rating_tag ?? ""}
            currentCaption={image.caption ?? ""}
            currentRatingAuthorName={image.rating_author_name}
            labelId={`rating-${image.id}`}
          />
          <ImageCaptionEditor
            imageId={image.id}
            initialCaption={image.caption ?? ""}
            labelId={`caption-${image.id}`}
          />
          <ImageDateEditor
            imageId={image.id}
            proposedPostDate={image.proposed_post_date}
            labelId={`date-${image.id}`}
          />
          <ImageCommentBox
            imageId={image.id}
            comments={comments}
            labelId={`comment-${image.id}`}
          />
          <div className="border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Bild herunterladen</p>
            <a
              href={image.image_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Bild herunterladen
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
