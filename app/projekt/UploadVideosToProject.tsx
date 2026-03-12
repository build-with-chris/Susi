"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { addImageToProject, addVideoToProject } from "./actions";

const ACCEPT_VIDEO = "video/mp4,video/quicktime,video/webm";
const ACCEPT_IMAGE = "image/png,image/jpeg,image/webp";
const ACCEPT_MEDIA = `${ACCEPT_VIDEO},${ACCEPT_IMAGE}`;
const BUCKET = "project-videos";

function isImageFile(file: File): boolean {
  const t = file.type?.toLowerCase() || "";
  return t.startsWith("image/") && ["image/png", "image/jpeg", "image/webp"].includes(t);
}

const getPublicUrl = (path: string): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return "";
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${path}`;
};

export type UploadVideosToProjectProps = {
  projectId: string;
  projectTitle: string;
  /** Überschrift auf der Erfolgsseite */
  successHeading: string;
  /** Text unter der Überschrift */
  successMessage: string;
  /** Primärer Link nach Erfolg (z. B. Projekt öffnen) */
  successLink: string;
  successLinkLabel: string;
  /** Optional: zweiter Link (z. B. Zur Startseite) */
  backLink?: string;
  backLinkLabel?: string;
  /** Link zurück / Abbrechen (z. B. Zurück zum Projekt) */
  cancelHref: string;
  cancelLabel: string;
};

export function UploadVideosToProject({
  projectId,
  projectTitle,
  successHeading,
  successMessage,
  successLink,
  successLinkLabel,
  backLink,
  backLinkLabel,
  cancelHref,
  cancelLabel,
}: UploadVideosToProjectProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [done, setDone] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[type="file"]') as HTMLInputElement;
    const files = input?.files;
    if (!files?.length) {
      setError("Bitte mindestens eine Datei (Video oder Bild) auswählen.");
      return;
    }

    setError(null);
    setUploading(true);
    const supabase = createClient();

    try {
      setUploadProgress("FFmpeg wird geladen…");
      const { loadFFmpeg, transcodeTo720p60 } = await import("@/lib/transcode-video");
      const { resizeImageToHd } = await import("@/lib/transcode-image");
      const ffmpeg = await loadFFmpeg();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const baseName = safeName.replace(/\.[^.]+$/, "") || "media";
        const caption = baseName.replace(/_/g, " ");

        if (isImageFile(file)) {
          setUploadProgress(`Skaliere Bild auf HD: ${file.name} (${i + 1}/${files.length})`);
          const { blob, contentType, extension } = await resizeImageToHd(ffmpeg, file);
          const outFileName = `${baseName}.${extension}`;
          const path = `${projectId}/${outFileName}`;

          setUploadProgress(`Lade hoch: ${file.name} (${i + 1}/${files.length})`);
          const { error: uploadErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, blob, { upsert: true, contentType });

          if (uploadErr) {
            setError(`Upload fehlgeschlagen: ${uploadErr.message}`);
            setUploading(false);
            return;
          }

          const publicUrl = getPublicUrl(path);
          const addRes = await addImageToProject(projectId, publicUrl, caption);
          if (!addRes.ok) {
            setError(`Bild anlegen fehlgeschlagen: ${addRes.error}`);
            setUploading(false);
            return;
          }
        } else {
          const outFileName = `${baseName}.mp4`;
          setUploadProgress(`Konvertiere zu 720p60: ${file.name} (${i + 1}/${files.length})`);
          const blob = await transcodeTo720p60(ffmpeg, file, (ev) => {
            const pct = Math.round(ev.progress * 100);
            setUploadProgress(`Konvertiere zu 720p60: ${file.name} – ${pct} %`);
          });

          setUploadProgress(`Lade hoch: ${file.name} (${i + 1}/${files.length})`);
          const path = `${projectId}/${outFileName}`;
          const { error: uploadErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, blob, { upsert: true, contentType: "video/mp4" });

          if (uploadErr) {
            setError(`Upload fehlgeschlagen: ${uploadErr.message}`);
            setUploading(false);
            return;
          }

          const publicUrl = getPublicUrl(path);
          const addRes = await addVideoToProject(projectId, publicUrl, caption);
          if (!addRes.ok) {
            setError(`Video anlegen fehlgeschlagen: ${addRes.error}`);
            setUploading(false);
            return;
          }
        }
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Konvertierung oder Upload fehlgeschlagen.");
    } finally {
      setUploadProgress("");
      setUploading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">{successHeading}</h2>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">{successMessage}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href={successLink}
            className="text-sm font-medium text-green-700 underline dark:text-green-300"
          >
            {successLinkLabel}
          </Link>
          {backLink && backLinkLabel && (
            <Link
              href={backLink}
              className="text-sm font-medium text-green-700 underline dark:text-green-300"
            >
              {backLinkLabel}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Projekt: <strong className="text-zinc-900 dark:text-white">{projectTitle}</strong>
      </p>
      <form onSubmit={handleUpload} className="mt-6">
        <label htmlFor="media-files" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Videos und Bilder auswählen (MP4, MOV, WebM / PNG, JPG, WebP)
        </label>
        <input
          id="media-files"
          name="files"
          type="file"
          accept={ACCEPT_MEDIA}
          multiple
          className="mt-1 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-300"
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Videos werden im Browser zu 720p60 (MP4) konvertiert, Bilder auf HD (max. 1920×1080) herunterskaliert.
          Beim ersten Upload wird FFmpeg (~31 MB) geladen.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900"
          >
            {uploading ? "Wird hochgeladen…" : "Videos & Bilder hochladen"}
          </button>
          {uploadProgress && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{uploadProgress}</span>
          )}
        </div>
      </form>
      <Link href={cancelHref} className="mt-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
        ← {cancelLabel}
      </Link>
    </div>
  );
}
