/**
 * Client-seitiges Herunterskalieren von Bildern auf HD (max 1920×1080) mit FFmpeg.wasm.
 * Akzeptiert PNG, JPG, WebP. Nur im Browser nutzen (wird von "use client"-Seiten dynamisch geladen).
 */

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const HD_MAX_WIDTH = 1920;
const HD_MAX_HEIGHT = 1080;

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function getExtension(file: File): string {
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
  if (ext && ["png", "jpg", "jpeg", "webp"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  return MIME_TO_EXT[file.type] ?? "jpg";
}

function getMime(ext: string): string {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

/**
 * Skaliert ein Bild im Browser auf max. HD (1920×1080), Seitenverhältnis bleibt erhalten.
 * Gibt den skalierten Inhalt als Blob zurück (upload-fähig).
 * Nutzt dieselbe FFmpeg-Instanz wie die Video-Konvertierung.
 */
export async function resizeImageToHd(
  ffmpeg: FFmpeg,
  file: File
): Promise<{ blob: Blob; contentType: string; extension: string }> {
  const ext = getExtension(file);
  const inputName = `img_in.${ext}`;
  const outputName = `img_out.${ext}`;

  const data = await fetchFile(file);
  await ffmpeg.writeFile(inputName, data);

  // Max 1920×1080, nur verkleinern (kein Upscaling), Seitenverhältnis beibehalten
  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    `scale=${HD_MAX_WIDTH}:${HD_MAX_HEIGHT}:force_original_aspect_ratio=decrease`,
    "-y",
    outputName,
  ]);

  const out = await ffmpeg.readFile(outputName);
  const bytes = out instanceof Uint8Array ? new Uint8Array(out) : new Uint8Array(0);
  const contentType = getMime(ext);
  const blob = new Blob([bytes], { type: contentType });

  await ffmpeg.deleteFile(inputName).catch(() => {});
  await ffmpeg.deleteFile(outputName).catch(() => {});

  return { blob, contentType, extension: ext };
}
