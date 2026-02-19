import * as fs from "fs";
import * as path from "path";
import { getRatingFromCaption } from "./rating";
import type { Video } from "@/types/database";

const FOLDER = "public/VideosSusiNeu";
const BASE_URL = "/VideosSusiNeu";

const LUNDL_FOLDER = "public/LundLVideos";
const LUNDL_BASE_URL = "/LundLVideos";

/**
 * Liest alle .mp4 aus public/LundLVideos für die Sektion "Lumen und Letter" (ganz oben).
 */
export function getLumenLetterVideosFromFolder(): Video[] {
  const dir = path.join(process.cwd(), LUNDL_FOLDER);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".mp4"));
  const now = new Date().toISOString();

  return files.map((file) => {
    const caption = file.replace(/\.mp4$/i, "").trim();
    const { rating_tag, rating_rank } = getRatingFromCaption(caption);
    return {
      id: `lundl-${encodeURIComponent(file)}`,
      title: caption || null,
      video_url: `${LUNDL_BASE_URL}/${encodeURIComponent(file)}`,
      caption: caption || "",
      rating_tag: rating_tag || "(ohne Bewertung)",
      rating_rank: rating_rank ?? 999,
      proposed_post_date: null,
      created_at: now,
      updated_at: now,
    };
  });
}

/**
 * Liest alle .mp4 aus public/VideosSusiNeu und gibt sie als Video-ähnliche Liste zurück
 * (für Anzeige ohne Supabase / Fallback).
 */
export function getVideosFromLocalFolder(): Video[] {
  const dir = path.join(process.cwd(), FOLDER);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".mp4"));
  const now = new Date().toISOString();

  const videos: Video[] = files.map((file) => {
    const caption = file.replace(/\.mp4$/i, "").trim();
    const { rating_tag, rating_rank } = getRatingFromCaption(caption);
    return {
      id: `local-${encodeURIComponent(file)}`,
      title: caption || null,
      video_url: `${BASE_URL}/${encodeURIComponent(file)}`,
      caption: caption || "",
      rating_tag: rating_tag || "(ohne Bewertung)",
      rating_rank: rating_rank ?? 999,
      proposed_post_date: null,
      created_at: now,
      updated_at: now,
    };
  });

  return videos.sort((a, b) => a.rating_rank - b.rating_rank);
}
