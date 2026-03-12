import Link from "next/link";
import { getProjects } from "@/lib/videos/queries";
import { ProjektListe } from "@/app/components/ProjektListe";

export const metadata = {
  title: "Start",
  description: "Susanne Hoyer Social Media Plan – Video-Übersicht",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Willkommen
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Social Media Posting Plan – Web App
        </p>

        {projects.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              Deine Projekte
            </h2>
            <ProjektListe projects={projects} />
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            Neues Projekt anlegen
          </h2>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Lege ein neues Projekt an, um Videos zu verwalten und zu planen.
            </p>
            <Link
              href="/projekt/neu"
              className="mt-4 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Neues Projekt anlegen
            </Link>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Kurz-Anleitung: Social Media Posting Plan (Web App)
          </h2>
          <ul className="mt-4 space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <strong className="font-medium text-zinc-900 dark:text-white">Video bewerten:</strong>{" "}
              Wähle eine Bewertung aus: Stark, Gut, Mittel oder Schlecht. Hier wird das zuletzt
              gewählte angezeigt – sprich der Nutzer, der es am Ende (zeitlich) bewertet hat.
            </li>
            <li>
              <strong className="font-medium text-zinc-900 dark:text-white">Posting-Datum ändern:</strong>{" "}
              Du kannst das Datum anpassen, wann das Video gepostet werden soll.
            </li>
            <li>
              <strong className="font-medium text-zinc-900 dark:text-white">Kommentar hinzufügen:</strong>{" "}
              Schreib kurz rein, was geändert werden muss (z. B. umschneiden, Text anpassen, …).
            </li>
            <li>
              <strong className="font-medium text-zinc-900 dark:text-white">Speichern:</strong>{" "}
              Änderungen werden automatisch gespeichert – außer bei der Caption (die musst du extra
              speichern).
            </li>
          </ul>
          <p className="mt-5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tipp: Läuft am besten auf dem Laptop
          </p>
        </section>
      </main>
    </div>
  );
}
