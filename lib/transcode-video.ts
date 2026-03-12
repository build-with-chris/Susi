/**
 * Client-seitiges Transcodieren von Videos zu 720p60 mit FFmpeg.wasm.
 * Nur im Browser nutzen (wird von "use client"-Seiten dynamisch geladen).
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;

export type FFmpegProgress = { progress: number; time: number };

/**
 * Lädt FFmpeg.wasm (einmalig, danach gecacht).
 * ~31 MB – nur aufrufen, wenn Transcoding benötigt wird.
 */
export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
  });
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

/**
 * Konvertiert eine Videodatei im Browser zu 720p60 (MP4, H.264, AAC).
 * Gibt den konvertierten Inhalt als Blob zurück (upload-fähig).
 */
export async function transcodeTo720p60(
  ffmpeg: FFmpeg,
  file: File,
  onProgress?: (event: FFmpegProgress) => void
): Promise<Blob> {
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "mp4" : "mp4";
  const inputName = `input.${ext}`;
  const outputName = "output.mp4";

  if (onProgress) {
    ffmpeg.on("progress", onProgress);
  }
  try {
    const data = await fetchFile(file);
    await ffmpeg.writeFile(inputName, data);
    // 720p, 60 fps, H.264, AAC; scale=-2:720 erhält Seitenverhältnis
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vf",
      "scale=-2:720",
      "-r",
      "60",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-y",
      outputName,
    ]);
    const out = await ffmpeg.readFile(outputName);
    const bytes = out instanceof Uint8Array ? new Uint8Array(out) : new Uint8Array(0);
    const blob = new Blob([bytes], { type: "video/mp4" });
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
    return blob;
  } finally {
    if (onProgress) {
      ffmpeg.off("progress", onProgress);
    }
  }
}
