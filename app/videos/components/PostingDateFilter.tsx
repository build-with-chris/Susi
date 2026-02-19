"use client";

import type { Video, VideoComment } from "@/types/database";
import { LumenLetterSection } from "./LumenLetterSection";
import { VideoList } from "./VideoList";

function toSortKey(value: string | null): string {
  if (!value || typeof value !== "string") return "9999-99-99";
  const part = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(part) ? part : "9999-99-99";
}

function sortByEarliestPostDate<V extends { proposed_post_date: string | null }>(
  videos: V[]
): V[] {
  return [...videos].sort(
    (a, b) => toSortKey(a.proposed_post_date).localeCompare(toSortKey(b.proposed_post_date))
  );
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
  const sortedLumen = sortByEarliestPostDate(lumenLetterVideos);
  const sortedMain = sortByEarliestPostDate(mainVideos);

  return (
    <>
      {sortedLumen.length > 0 && (
        <LumenLetterSection
          videos={sortedLumen}
          commentsByVideo={commentsByVideo}
        />
      )}

      {sortedMain.length === 0 ? (
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
        <VideoList
          videos={sortedMain}
          commentsByVideo={commentsByVideo}
          source={source}
        />
      )}
    </>
  );
}
