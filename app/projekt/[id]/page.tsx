import Link from "next/link";
import {
  getProjectById,
  getVideosByProjectId,
  getImagesByProjectId,
  getCommentsByVideoIds,
} from "@/lib/videos/queries";
import { PostingDateFilter } from "@/app/videos/components/PostingDateFilter";
import { ProjektLoeschenButton } from "./ProjektLoeschenButton";
import { ProjectPasswordGate } from "./ProjectPasswordGate";
import { ProjektPasswortSetzen } from "./ProjektPasswortSetzen";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  return {
    title: project?.title ?? "Projekt",
    description: project ? `Videos von ${project.title}` : "Projekt nicht gefunden",
  };
}

export default async function ProjektDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <h1 className="text-lg font-semibold">Projekt nicht gefunden</h1>
            <p className="mt-1 text-sm">Die angeforderte Projektseite existiert nicht oder wurde gelöscht.</p>
          </div>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Zur Startseite
          </Link>
        </main>
      </div>
    );
  }

  const [videos, images] = await Promise.all([
    getVideosByProjectId(id),
    getImagesByProjectId(id),
  ]);
  const videoIds = videos.map((v) => v.id);
  const commentsByVideo = await getCommentsByVideoIds(videoIds);

  return (
    <ProjectPasswordGate projectId={id} projectTitle={project.title}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            ← Zur Startseite
          </Link>
          <div className="mb-8 mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {videos.length} {videos.length === 1 ? "Video" : "Videos"}
                {images.length > 0 && ` · ${images.length} ${images.length === 1 ? "Bild" : "Bilder"}`}
              </p>
            </div>
            <Link
              href={`/projekt/${id}/videos-hinzufuegen`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Videos & Bilder hinzufügen
            </Link>
          </div>

          <PostingDateFilter
            lumenLetterVideos={[]}
            mainVideos={videos}
            commentsByVideo={commentsByVideo}
            source="supabase"
          />

          {images.length > 0 && (
            <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Bilder</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((img) => (
                  <li key={img.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <a
                      href={img.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || "Projektbild"}
                        className="h-auto w-full object-cover"
                      />
                    </a>
                    {img.caption && (
                      <p className="p-2 text-xs text-zinc-600 dark:text-zinc-400">{img.caption}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Passwortschutz</h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Optional: Projekt mit Passwort schützen. Wer den Link hat, muss das Passwort eingeben.
            </p>
            <div className="mt-3">
              <ProjektPasswortSetzen
                projectId={id}
                hasPassword={typeof project.password_hash === "string" && project.password_hash.trim() !== ""}
              />
            </div>
          </section>

          <section className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Gefahrenzone</h2>
            <div className="mt-3">
              <ProjektLoeschenButton projectId={id} projectTitle={project.title} />
            </div>
          </section>
        </main>
      </div>
    </ProjectPasswordGate>
  );
}
