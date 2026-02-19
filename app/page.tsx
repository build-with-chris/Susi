import { getVideosOverview, getCommentsByVideoIds } from "@/lib/videos/queries";
import { getVideosFromLocalFolder } from "@/lib/videos/local-videos";
import { VideoList } from "@/app/videos/components/VideoList";

export const metadata = {
  title: "InstaGame",
  description: "Video-Übersicht sortiert nach Bewertungs-Hashtag",
};

export default async function Home() {
  const { videos: supabaseVideos, error } = await getVideosOverview();

  if (error) {
    const localVideos = getVideosFromLocalFolder();
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            Supabase nicht erreichbar ({error.message}). Videos werden aus dem
            lokalen Ordner <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-900/50">public/VideosSusiNeu</code>{" "}
            angezeigt. Kommentare &amp; Postingdatum brauchen eine gültige
            Supabase-Verbindung. Nach Änderung von .env.local Dev-Server neu starten.
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              InstaGame
            </h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Sortierung: Bewertungs-Hashtag → geplantes Datum → Erstellungsdatum.
            </p>
          </div>
          {localVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
              <p className="text-zinc-600 dark:text-zinc-400">
                Keine Videos in <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">public/VideosSusiNeu</code> gefunden.
              </p>
            </div>
          ) : (
            <VideoList
              videos={localVideos}
              commentsByVideo={{}}
              source="local"
            />
          )}
        </main>
      </div>
    );
  }

  const videoIds = supabaseVideos.map((v) => v.id);
  const commentsByVideo = await getCommentsByVideoIds(videoIds);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            InstaGame
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Sortierung: Bewertungs-Hashtag → geplantes Datum → Erstellungsdatum.
          </p>
        </div>

        {supabaseVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-zinc-600 dark:text-zinc-400">
              Noch keine Videos. Supabase befüllen oder{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">npm run seed:videos</code> ausführen.
            </p>
          </div>
        ) : (
          <VideoList
            videos={supabaseVideos}
            commentsByVideo={commentsByVideo}
            source="supabase"
          />
        )}
      </main>
    </div>
  );
}
