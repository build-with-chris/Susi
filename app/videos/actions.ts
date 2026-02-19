"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { VideoCommentInsert, VideoUpdate } from "@/types/database";
import {
  getRatingFromCaption,
  replaceFirstRatingHashtag,
  RATING_UNKNOWN_RANK_CONST,
} from "@/lib/videos/rating";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveComment(
  videoId: string,
  comment: string,
  authorName?: string | null
): Promise<ActionResult> {
  const trimmed = comment?.trim();
  if (!trimmed) {
    return { ok: false, error: "Kommentar darf nicht leer sein." };
  }

  const supabase = await createClient();
  const row: VideoCommentInsert = {
    video_id: videoId,
    comment: trimmed,
    author_name: authorName ?? null,
  };
  // @ts-expect-error Supabase SSR client infers never for insert; runtime is correct
  const { error } = await supabase.from("video_comments").insert(row);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  return { ok: true };
}

export async function updateCaption(
  videoId: string,
  caption: string
): Promise<ActionResult> {
  const trimmed = caption?.trim() ?? "";
  const supabase = await createClient();
  const payload: VideoUpdate = { caption: trimmed };
  // @ts-expect-error Supabase SSR client infers never for update; runtime is correct
  const { error } = await supabase.from("videos").update(payload).eq("id", videoId);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  return { ok: true };
}

export async function updateProposedPostDate(
  videoId: string,
  proposedPostDate: string | null
): Promise<ActionResult> {
  const value =
    proposedPostDate && proposedPostDate.trim() !== ""
      ? proposedPostDate.trim()
      : null;

  const supabase = await createClient();
  const payload: VideoUpdate = { proposed_post_date: value };
  // @ts-expect-error Supabase SSR client infers never for update; runtime is correct
  const { error } = await supabase.from("videos").update(payload).eq("id", videoId);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  return { ok: true };
}

export async function updateRating(
  videoId: string,
  ratingTag: string | null,
  currentCaption: string
): Promise<ActionResult> {
  const tag = ratingTag?.trim() ?? "";
  const { rating_tag, rating_rank } =
    tag === ""
      ? { rating_tag: "", rating_rank: RATING_UNKNOWN_RANK_CONST }
      : getRatingFromCaption(tag);
  const newCaption = replaceFirstRatingHashtag(currentCaption, tag);

  const supabase = await createClient();
  const payload: VideoUpdate = {
    rating_tag,
    rating_rank,
    caption: newCaption,
  };
  // @ts-expect-error Supabase SSR client infers never for update; runtime is correct
  const { error } = await supabase.from("videos").update(payload).eq("id", videoId);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  return { ok: true };
}
