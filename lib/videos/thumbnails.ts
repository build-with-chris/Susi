/**
 * Thumbnail-URL aus Video-URL ableiten (YouTube, Vimeo, lokale MP4) oder null → UI nutzt Placeholder.
 * Lokale Videos: optionales Vorschaubild unter gleichem Pfad mit .jpg statt .mp4 (z. B. /VideosSusiNeu/Clip.mp4 → /VideosSusiNeu/Clip.jpg).
 */

export function getThumbnailUrl(videoUrl: string): string | null {
  if (!videoUrl || typeof videoUrl !== "string") return null;

  // Lokale Videos (z. B. /VideosSusiNeu/...mp4): Vorschaubild = gleicher Pfad mit .jpg
  if (
    videoUrl.startsWith("/VideosSusiNeu/") &&
    videoUrl.toLowerCase().endsWith(".mp4")
  ) {
    return videoUrl.replace(/\.mp4$/i, ".jpg");
  }

  try {
    const url = new URL(videoUrl, "https://example.com");

    // YouTube: watch?v=ID oder youtu.be/ID
    if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
      const id = url.searchParams.get("v");
      if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }

    // Vimeo: Thumbnails brauchen API → null, UI nutzt Placeholder
    if (url.hostname === "vimeo.com") return null;
  } catch {
    // Ungültige URL
  }
  return null;
}

/**
 * Gibt Thumbnail-URL oder undefined zurück (für img src mit Fallback).
 */
export function getVideoThumbnailOrNull(videoUrl: string): string | null {
  return getThumbnailUrl(videoUrl);
}
