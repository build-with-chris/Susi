/**
 * Synchronisiert Videos aus den Ordnern mit Supabase:
 * - Neue Dateien im Ordner → werden eingefügt (Caption aus Dateiname).
 * - Bereits vorhandene video_url → bleibt unverändert (Caption, Bewertung, Datum etc. bleiben erhalten).
 * - Dateien, die aus dem Ordner entfernt wurden → werden aus der DB gelöscht.
 *
 * Aufruf (aus Projektroot): npx tsx scripts/seed-videos-from-folder.ts
 * Vorher: .env.local mit NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import {
  getRatingFromCaption,
  RATING_UNKNOWN_RANK_CONST,
} from "../lib/videos/rating";
import type { VideoInsert } from "../types/database";

const FOLDER = "public/VideosSusiNeu";
const VIDEO_BASE_URL = "/VideosSusiNeu";

const LUNDL_FOLDER = "public/LundLVideos";
const LUNDL_VIDEO_BASE_URL = "/LundLVideos";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?([^"'\n]*)["']?\s*$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

function getVideoRecordsFromFolder(
  folder: string,
  baseUrl: string
): VideoInsert[] {
  const dir = path.join(process.cwd(), folder);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  const records: VideoInsert[] = [];
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mp4")) continue;
    const caption = file.replace(/\.mp4$/i, "").trim();
    const videoUrl = `${baseUrl}/${encodeURIComponent(file)}`;
    const { rating_tag, rating_rank } = getRatingFromCaption(caption);
    records.push({
      video_url: videoUrl,
      caption,
      title: caption || null,
      rating_tag: rating_tag || "(ohne Bewertung)",
      rating_rank: rating_rank === RATING_UNKNOWN_RANK_CONST ? 999 : rating_rank,
    });
  }
  return records.sort(
    (a, b) => (a.rating_rank ?? 999) - (b.rating_rank ?? 999)
  );
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || key.includes("<<")) {
    console.error(
      "Bitte .env.local mit NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY setzen."
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  async function syncFolder(
    folder: string,
    baseUrl: string,
    label: string
  ): Promise<void> {
    const records = getVideoRecordsFromFolder(folder, baseUrl);
    console.log("[" + label + "] Gefunden: " + records.length + " Videos in " + folder);

    const currentUrls = new Set(records.map((r) => r.video_url));

    const { data: existing } = await supabase
      .from("videos")
      .select("id, video_url")
      .like("video_url", baseUrl + "%");

    type ExistingRow = { id: string; video_url: string };
    const existingList: ExistingRow[] = (existing ?? []) as ExistingRow[];

    for (const row of existingList) {
      if (!currentUrls.has(row.video_url)) {
        await supabase.from("videos").delete().eq("id", row.id);
        console.log("[" + label + "] Entfernt (nicht mehr im Ordner): " + row.video_url);
      }
    }

    const existingUrls = new Set(existingList.map((r) => r.video_url));
    const toInsert = records.filter((r) => !existingUrls.has(r.video_url));

    if (toInsert.length > 0) {
      const { data, error } = await supabase
        .from("videos")
        .insert(toInsert)
        .select("id");
      if (error) {
        console.error("[" + label + "] Fehler beim Einfügen:", error.message);
        throw new Error(error.message);
      }
      console.log("[" + label + "] " + toInsert.length + " neue Videos eingefügt.");
    } else {
      console.log("[" + label + "] Keine neuen Videos (bestehende Captions/Bewertungen unverändert).");
    }
  }

  await syncFolder(FOLDER, VIDEO_BASE_URL, "VideosSusiNeu");
  await syncFolder(LUNDL_FOLDER, LUNDL_VIDEO_BASE_URL, "LundLVideos");
}

main();
