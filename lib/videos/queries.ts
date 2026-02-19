import { createClient } from "@/lib/supabase/server";
import type { Video, VideoComment } from "@/types/database";

const VIDEOS_PAGE_SIZE = 18;
const VIDEOS_FETCH_LIMIT = 60;

function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key && !key.includes("<<"));
}

/**
 * Lädt Videos mit Sortierung, pro video_url nur ein Eintrag (keine Duplikate).
 * - Primär: rating_rank aufsteigend
 * - Sekundär: proposed_post_date aufsteigend (NULLS LAST)
 * - Tertiär: created_at absteigend
 * Bei fehlenden Env-Variablen wird ein Fehler zurückgegeben (kein Throw), damit die Seite z. B. lokale Videos anzeigen kann.
 */
export async function getVideosOverview(): Promise<{
  videos: Video[];
  error: Error | null;
}> {
  if (!hasSupabaseEnv()) {
    return {
      videos: [],
      error: new Error("Supabase-Env fehlt (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)"),
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("rating_rank", { ascending: true })
    .order("proposed_post_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(VIDEOS_FETCH_LIMIT);

  if (error) {
    return { videos: [], error };
  }

  const rows = (data ?? []) as Video[];
  const seen = new Set<string>();
  const unique: Video[] = [];
  for (const v of rows) {
    if (seen.has(v.video_url)) continue;
    seen.add(v.video_url);
    unique.push(v);
    if (unique.length >= VIDEOS_PAGE_SIZE) break;
  }
  return { videos: unique, error: null };
}

/**
 * Lädt alle Kommentare für die gegebenen Video-IDs, gruppiert nach video_id.
 * Pro Video: neueste zuerst (created_at absteigend).
 */
export async function getCommentsByVideoIds(
  videoIds: string[]
): Promise<Record<string, VideoComment[]>> {
  if (videoIds.length === 0 || !hasSupabaseEnv()) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("video_comments")
    .select("*")
    .in("video_id", videoIds)
    .order("created_at", { ascending: false });

  if (error) return {};

  const byVideo: Record<string, VideoComment[]> = {};
  for (const id of videoIds) byVideo[id] = [];
  for (const row of (data ?? []) as VideoComment[]) {
    byVideo[row.video_id].push(row);
  }
  return byVideo;
}

const LUNDL_VIDEO_BASE_URL = "/LundLVideos";

/**
 * Lädt alle Videos aus der DB, deren video_url mit /LundLVideos/ beginnt (Lumen und Letter).
 */
export async function getLumenLetterVideosFromSupabase(): Promise<Video[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .like("video_url", `${LUNDL_VIDEO_BASE_URL}%`);

  if (error) return [];
  return (data ?? []) as Video[];
}
