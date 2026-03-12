"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  ProjectImageCommentInsert,
  ProjectImageInsert,
  ProjectImageUpdate,
  ProjectInsert,
  VideoInsert,
} from "@/types/database";
import {
  getRatingFromCaption,
  replaceFirstRatingHashtag,
  RATING_UNKNOWN_RANK_CONST,
} from "@/lib/videos/rating";

export type ProjektActionResult =
  | { ok: true; projectId: string }
  | { ok: false; error: string };

export async function createProject(title: string): Promise<ProjektActionResult> {
  const t = title?.trim();
  if (!t) {
    return { ok: false, error: "Bitte einen Projekttitel eingeben." };
  }

  const supabase = await createClient();
  const row: ProjectInsert = { title: t };
  // Typ-Assertion: @supabase/ssr leitet Database-Generic nicht weiter, Insert ist zur Laufzeit korrekt
  const { data, error } = await supabase.from("projects").insert(row as never).select("id").single();

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  revalidatePath("/projekt/neu");
  return { ok: true, projectId: (data as { id: string }).id };
}

export type AddVideoResult = { ok: true } | { ok: false; error: string };

export async function addVideoToProject(
  projectId: string,
  videoUrl: string,
  caption: string
): Promise<AddVideoResult> {
  if (!projectId || !videoUrl?.trim()) {
    return { ok: false, error: "projectId und videoUrl erforderlich." };
  }

  const cap = caption?.trim() || "";
  const { rating_tag, rating_rank } = getRatingFromCaption(cap);

  const supabase = await createClient();
  const row: VideoInsert = {
    project_id: projectId,
    video_url: videoUrl.trim(),
    caption: cap || "(ohne Caption)",
    rating_tag: rating_tag || "(ohne Bewertung)",
    rating_rank,
  };
  const { error } = await supabase.from("videos").insert(row as never);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  revalidatePath(`/projekt/${projectId}`);
  return { ok: true };
}

export type AddImageResult = { ok: true } | { ok: false; error: string };

export async function addImageToProject(
  projectId: string,
  imageUrl: string,
  caption: string
): Promise<AddImageResult> {
  if (!projectId || !imageUrl?.trim()) {
    return { ok: false, error: "projectId und imageUrl erforderlich." };
  }

  const cap = (caption?.trim() || "").replace(/\s+/g, " ") || "(ohne Beschreibung)";
  const { rating_tag, rating_rank } = getRatingFromCaption(cap);

  const supabase = await createClient();
  const row: ProjectImageInsert = {
    project_id: projectId,
    image_url: imageUrl.trim(),
    caption: cap,
    rating_tag: rating_tag || null,
    rating_rank,
  };
  const { error } = await supabase.from("project_images").insert(row as never);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  revalidatePath(`/projekt/${projectId}`);
  return { ok: true };
}

export type ImageActionResult = { ok: true } | { ok: false; error: string };

export async function updateImageCaption(
  imageId: string,
  caption: string
): Promise<ImageActionResult> {
  const trimmed = caption?.trim() ?? "";
  const supabase = await createClient();
  const payload: ProjectImageUpdate = { caption: trimmed };
  const { error } = await supabase.from("project_images").update(payload as never).eq("id", imageId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/projekt");
  return { ok: true };
}

export async function updateImageRating(
  imageId: string,
  ratingTag: string | null,
  currentCaption: string,
  authorName?: string | null
): Promise<ImageActionResult> {
  const tag = ratingTag?.trim() ?? "";
  const { rating_tag, rating_rank } =
    tag === ""
      ? { rating_tag: "", rating_rank: RATING_UNKNOWN_RANK_CONST }
      : getRatingFromCaption(tag);
  const newCaption = replaceFirstRatingHashtag(currentCaption, tag);

  const supabase = await createClient();
  const payload: ProjectImageUpdate = {
    rating_tag,
    rating_rank,
    caption: newCaption,
    rating_author_name: authorName?.trim() || null,
  };
  const { error } = await supabase.from("project_images").update(payload as never).eq("id", imageId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/projekt");
  return { ok: true };
}

export async function updateImageProposedPostDate(
  imageId: string,
  proposedPostDate: string | null
): Promise<ImageActionResult> {
  const value =
    proposedPostDate && proposedPostDate.trim() !== ""
      ? proposedPostDate.trim()
      : null;
  const supabase = await createClient();
  const payload: ProjectImageUpdate = { proposed_post_date: value };
  const { error } = await supabase.from("project_images").update(payload as never).eq("id", imageId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/projekt");
  return { ok: true };
}

export async function saveImageComment(
  imageId: string,
  comment: string,
  authorName?: string | null
): Promise<ImageActionResult> {
  const trimmed = comment?.trim();
  if (!trimmed) return { ok: false, error: "Kommentar darf nicht leer sein." };

  const supabase = await createClient();
  const row: ProjectImageCommentInsert = {
    image_id: imageId,
    comment: trimmed,
    author_name: authorName ?? null,
  };
  const { error } = await supabase.from("project_image_comments").insert(row as never);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/projekt");
  return { ok: true };
}

export type DeleteProjectResult = { ok: true } | { ok: false; error: string };

export async function deleteProject(projectId: string): Promise<DeleteProjectResult> {
  if (!projectId?.trim()) {
    return { ok: false, error: "Projekt-ID fehlt." };
  }

  const supabase = await createClient();

  // Bilder des Projekts in DB löschen (CASCADE löscht bei projects ohnehin, explizit für Klarheit)
  await supabase.from("project_images").delete().eq("project_id", projectId.trim());
  // Dateien im Storage unter projectId/ löschen (Videos + Bilder, Bucket: project-videos)
  const { data: files } = await supabase.storage
    .from("project-videos")
    .list(projectId.trim(), { limit: 1000 });
  if (files?.length) {
    const names = files.map((f) => f.name);
    await supabase.storage.from("project-videos").remove(names.map((name) => `${projectId.trim()}/${name}`));
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId.trim());

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  revalidatePath(`/projekt/${projectId}`);
  return { ok: true };
}
