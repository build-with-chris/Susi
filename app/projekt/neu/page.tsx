"use client";

import { useState } from "react";
import Link from "next/link";
import { createProject } from "../actions";
import { UploadVideosToProject } from "../UploadVideosToProject";

export default function ProjektNeuPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await createProject(title);
    if (res.ok) {
      setProjectId(res.projectId);
      setStep(2);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Neues Projekt anlegen
        </h1>

        {step === 1 && (
          <form onSubmit={handleSubmitTitle} className="mt-8">
            <label htmlFor="project-title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Titel des Projekts
            </label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Susanne Hoyer Q1 2025"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Weiter – Videos & Bilder auswählen
            </button>
          </form>
        )}

        {step === 2 && projectId && (
          <UploadVideosToProject
            projectId={projectId}
            projectTitle={title}
            successHeading="Projekt angelegt"
            successMessage="Die Videos wurden hochgeladen. Das Projekt erscheint auf der Startseite unter „Deine Projekte“."
            successLink={`/projekt/${projectId}`}
            successLinkLabel={`Projekt „${title || "öffnen"}“ öffnen`}
            backLink="/"
            backLinkLabel="Zur Startseite"
            cancelHref="/projekt/neu"
            cancelLabel="Anderen Projekttitel eingeben"
          />
        )}
      </main>
    </div>
  );
}
