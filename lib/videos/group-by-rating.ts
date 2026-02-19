import type { Video } from "@/types/database";

/** Gruppiert bereits sortierte Videos in aufeinanderfolgende Blöcke gleicher Bewertung. */
export function groupVideosByRating(videos: Video[]): { label: string; videos: Video[] }[] {
  if (videos.length === 0) return [];

  const groups: { label: string; videos: Video[] }[] = [];
  let currentLabel =
    videos[0].rating_tag?.trim() !== ""
      ? videos[0].rating_tag
      : "(ohne Bewertung)";
  let current: Video[] = [];

  for (const video of videos) {
    const tag =
      video.rating_tag?.trim() !== ""
        ? video.rating_tag
        : "(ohne Bewertung)";
    if (tag !== currentLabel) {
      groups.push({ label: currentLabel, videos: current });
      currentLabel = tag;
      current = [];
    }
    current.push(video);
  }
  if (current.length > 0) {
    groups.push({ label: currentLabel, videos: current });
  }
  return groups;
}
