"use client";

import { useState } from "react";
import type { Video, VideoComment } from "@/types/database";
import { LumenLetterSection } from "./LumenLetterSection";
import { VideoList } from "./VideoList";

const ALL_VALUE = "";

function toDateKey(value: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const datePart = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
  return null;
}

function formatDateLabel(dateKey: string): string {
  try {
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateKey;
  }
}

function filterByPostingDate<V extends { proposed_post_date: string | null }>(
  videos: V[],
  dateKey: string | null
): V[] {
  if (!dateKey) return videos;
  return videos.filter((v) => toDateKey(v.proposed_post_date) === dateKey);
}

type PostingDateFilterProps = {
  lumenLetterVideos: Video[];
  mainVideos: Video[];
  commentsByVideo: Record<string, VideoComment[]>;
  source?: "supabase" | "local";
};

export function PostingDateFilter({
  lumenLetterVideos,
  mainVideos,
  commentsByVideo,
  source = "supabase",
}: PostingDateFilterProps) {
  const dateKeys = new Set<string>();
  for (const v of [...lumenLetterVideos, ...mainVideos]) {
    const key = toDateKey(v.proposed_post_date);
    if (key) dateKeys.add(key);
  }
  const sortedDates = Array.from(dateKeys).sort();

  const [selected, setSelected] = useState(ALL_VALUE);
  const filteredLumen = filterByPostingDate(
    lumenLetterVideos,
    selected || null
  );
  const filteredMain = filterByPostingDate(mainVideos, selected || null);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label
          htmlFor="posting-date-filter"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Postingtag
        </label>
        <select
          id="posting-date-filter"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        >
          <option value={ALL_VALUE}>Alle</option>
          {sortedDates.map((key) => (
            <option key={key} value={key}>
              {formatDateLabel(key)}
            </option>
          ))}
        </select>
      </div>

      {filteredLumen.length > 0 && (
        <LumenLetterSection
          videos={filteredLumen}
          commentsByVideo={commentsByVideo}
        />
      )}

      {filteredMain.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-zinc-600 dark:text-zinc-400">
            {mainVideos.length === 0
              ? "Noch keine Videos. Supabase befüllen oder "
              : "Keine Videos für diesen Postingtag."}
            {mainVideos.length === 0 && (
              <>
                <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
                  npm run seed:videos
                </code>{" "}
                ausführen.
              </>
            )}
          </p>
        </div>
      ) : (
        <VideoList
          videos={filteredMain}
          commentsByVideo={commentsByVideo}
          source={source}
        />
      )}
    </>
  );
}
