import Link from "next/link";
import { getProjectById } from "@/lib/videos/queries";
import { UploadVideosToProject } from "../../UploadVideosToProject";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function VideosHinzufuegenPage({ params }: PageProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={`/projekt/${id}`}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          ← Zurück zum Projekt
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Videos hinzufügen
        </h1>

        <UploadVideosToProject
          projectId={id}
          projectTitle={project.title}
          successHeading="Videos hinzugefügt"
          successMessage="Die neuen Videos wurden zu 720p60 konvertiert und dem Projekt hinzugefügt."
          successLink={`/projekt/${id}`}
          successLinkLabel={`Zurück zu „${project.title}"`}
          backLink="/"
          backLinkLabel="Zur Startseite"
          cancelHref={`/projekt/${id}`}
          cancelLabel="Zurück zum Projekt"
        />
      </main>
    </div>
  );
}
