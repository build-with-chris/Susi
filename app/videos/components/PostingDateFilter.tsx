"use client";

import { useState } from "react";
import type { Video, VideoComment } from "@/types/database";
import { VideoList } from "./VideoList";

function toDateSortKey(value: string | null): string {
  if (!value || typeof value !== "string") return "9999-99-99";
  const part = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(part) ? part : "9999-99-99";
}

type SortMode = "rating-then-date" | "date-only";

/** Sortierung: zuerst Bewertung (rating_rank), dann frühestes Postingdatum. */
function sortByRatingThenDate<
  V extends { rating_rank: number; proposed_post_date: string | null }
>(videos: V[]): V[] {
  return [...videos].sort((a, b) => {
    if (a.rating_rank !== b.rating_rank) return a.rating_rank - b.rating_rank;
    return toDateSortKey(a.proposed_post_date).localeCompare(
      toDateSortKey(b.proposed_post_date)
    );
  });
}

/** Sortierung: nur nach frühestem Postingdatum. */
function sortByDateOnly<
  V extends { proposed_post_date: string | null }
>(videos: V[]): V[] {
  return [...videos].sort((a, b) =>
    toDateSortKey(a.proposed_post_date).localeCompare(
      toDateSortKey(b.proposed_post_date)
    )
  );
}

type PostingDateFilterProps = {
  lumenLetterVideos: Video[];
  mainVideos: Video[];
  commentsByVideo: Record<string, VideoComment[]>;
  source?: "supabase" | "local";
};

const PER_PAGE = 12;

export function PostingDateFilter({
  lumenLetterVideos,
  mainVideos,
  commentsByVideo,
  source = "supabase",
}: PostingDateFilterProps) {
  const [sortMode, setSortMode] = useState<SortMode>("rating-then-date");
  const [page, setPage] = useState(1);

  const allVideos = [...lumenLetterVideos, ...mainVideos];
  const sortedAll =
    sortMode === "rating-then-date"
      ? sortByRatingThenDate(allVideos)
      : sortByDateOnly(allVideos);

  const totalPages = Math.max(1, Math.ceil(sortedAll.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageVideos = sortedAll.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label
          htmlFor="sort-mode"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Sortierung
        </label>
        <select
          id="sort-mode"
          value={sortMode}
          onChange={(e) => {
            const next = e.target.value as SortMode;
            if (next === "rating-then-date" || next === "date-only") {
              setSortMode(next);
              setPage(1);
            }
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        >
          <option value="rating-then-date">
            Bewertung, dann frühestes Datum
          </option>
          <option value="date-only">Nur frühestes Datum zuerst</option>
        </select>
      </div>

      {allVideos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-zinc-600 dark:text-zinc-400">
            Noch keine Videos. Supabase befüllen oder{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
              npm run seed:videos
            </code>{" "}
            ausführen.
          </p>
        </div>
      ) : (
        <>
          <VideoList
            key={"all-" + sortMode + "-" + currentPage}
            videos={pageVideos}
            commentsByVideo={commentsByVideo}
            source="mixed"
          />

          {totalPages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              aria-label="Seitennavigation"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:pointer-events-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Zurück
              </button>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Seite {currentPage} von {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:pointer-events-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Weiter
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
