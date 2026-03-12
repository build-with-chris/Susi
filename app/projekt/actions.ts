"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectImageInsert, ProjectInsert, VideoInsert } from "@/types/database";
import { getRatingFromCaption } from "@/lib/videos/rating";

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

  const supabase = await createClient();
  const row: ProjectImageInsert = {
    project_id: projectId,
    image_url: imageUrl.trim(),
    caption: (caption?.trim() || "").replace(/\s+/g, " ") || "(ohne Beschreibung)",
  };
  const { error } = await supabase.from("project_images").insert(row as never);

  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/");
  revalidatePath(`/projekt/${projectId}`);
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
