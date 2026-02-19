/**
 * Liest alle .mp4 aus public/VideosSusiNeu, leitet rating_tag/rating_rank
 * aus dem Dateinamen ab und fügt die Videos in Supabase ein.
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

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?([^"'\n]*)["']?\s*$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

function getVideoRecords(): VideoInsert[] {
  const dir = path.join(process.cwd(), FOLDER);
  if (!fs.existsSync(dir)) {
    throw new Error(`Ordner nicht gefunden: ${dir}`);
  }
  const files = fs.readdirSync(dir);
  const records: VideoInsert[] = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mp4")) continue;
    const caption = file.replace(/\.mp4$/i, "").trim();
    const videoUrl = `${VIDEO_BASE_URL}/${encodeURIComponent(file)}`;
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

  const records = getVideoRecords();
  console.log(`Gefunden: ${records.length} Videos in ${FOLDER}`);

  const supabase = createClient(url, key);

  // Vorher alle Einträge aus diesem Ordner entfernen, damit keine Duplikate entstehen
  const { data: existing } = await supabase
    .from("videos")
    .select("id")
    .like("video_url", `${VIDEO_BASE_URL}%`);
  if (existing && existing.length > 0) {
    for (const row of existing) {
      await supabase.from("videos").delete().eq("id", (row as { id: string }).id);
    }
    console.log(`${existing.length} bestehende Einträge aus ${VIDEO_BASE_URL} entfernt.`);
  }

  const { data, error } = await supabase.from("videos").insert(records).select("id");
  if (error) {
    console.error("Fehler beim Einfügen:", error.message);
    process.exit(1);
  }
  console.log(`Erfolgreich ${(data?.length ?? 0)} Videos in Supabase eingefügt.`);
}

main();
