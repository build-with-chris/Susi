"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "../actions";

type ProjektLoeschenButtonProps = {
  projectId: string;
  projectTitle: string;
};

export function ProjektLoeschenButton({ projectId, projectTitle }: ProjektLoeschenButtonProps) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAbort = () => {
    setStep(0);
    setError(null);
  };

  const handleConfirmFirst = () => setStep(1);
  const handleConfirmSecond = async () => {
    setLoading(true);
    setError(null);
    const res = await deleteProject(projectId);
    if (res.ok) {
      router.push("/");
      router.refresh();
      return;
    }
    setError(res.error);
    setLoading(false);
  };

  if (step === 0) {
    return (
      <button
        type="button"
        onClick={handleConfirmFirst}
        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        Projekt löschen
      </button>
    );
  }

  if (step === 1) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="text-sm font-medium">Möchten Sie das Projekt „{projectTitle}“ wirklich löschen?</p>
        <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90">
          Die zugehörigen Videodateien im Speicher werden gelöscht. Videoeinträge in der Datenbank werden vom Projekt getrennt.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAbort}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            Ja, weiter zur Bestätigung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
      <p className="text-sm font-medium">Letzte Bestätigung</p>
      <p className="mt-1 text-xs text-red-800 dark:text-red-300/90">
        Diese Aktion kann nicht rückgängig gemacht werden. Das Projekt wird endgültig gelöscht.
      </p>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAbort}
          disabled={loading}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleConfirmSecond}
          disabled={loading}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Wird gelöscht…" : "Ja, Projekt endgültig löschen"}
        </button>
      </div>
    </div>
  );
}
