import Link from "next/link";
import { getProjects } from "@/lib/videos/queries";

export const metadata = {
  title: "Start",
  description: "Susanne Hoyer Social Media Plan – Video-Übersicht",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
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
            <ul className="mt-3 space-y-2">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projekt/${p.id}`}
                    className="inline-flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:border-zinc-600"
                  >
                    <span className="font-medium">{p.title}</span>
                    <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
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

        <section className="mt-10">
          <Link
            href="/susanne-hoyer"
            className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Projekt „Susanne Hoyer“ öffnen
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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
