"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  const { error } = await supabase.from("video_comments").insert({
    video_id: videoId,
    comment: trimmed,
    author_name: authorName ?? null,
  });

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
  const { error } = await supabase
    .from("videos")
    .update({ caption: trimmed })
    .eq("id", videoId);

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
  const { error } = await supabase
    .from("videos")
    .update({ proposed_post_date: value })
    .eq("id", videoId);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  return { ok: true };
}
