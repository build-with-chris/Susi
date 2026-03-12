"use client";

import type { ProjectImage } from "@/types/database";

type ImageCardProps = { image: ProjectImage };

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

export function ImageCard({ image }: ImageCardProps) {
  const ratingLabel =
    image.rating_tag && image.rating_tag.trim() !== ""
      ? image.rating_tag
      : "(ohne Bewertung)";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <a
        href={image.image_url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[9/16] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        <img
          src={image.image_url}
          alt={image.caption || "Projektbild"}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {ratingLabel}
        </span>
      </a>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          {ratingLabel}
          {image.rating_author_name && (
            <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">
              · von {image.rating_author_name}
            </span>
          )}
        </p>
        <p className="mt-1 flex-1 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
          {image.caption || "—"}
        </p>
        {image.proposed_post_date && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Geplant: {formatDisplayDate(image.proposed_post_date)}
          </p>
        )}
      </div>
    </article>
  );
}
