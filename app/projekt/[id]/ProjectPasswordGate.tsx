"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

function ProjectPasswordForm({
  projectId,
  projectTitle,
  onUnlocked,
}: {
  projectId: string;
  projectTitle: string;
  onUnlocked: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/project/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, password }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (res.ok) {
      onUnlocked();
    } else {
      setError(data.error || "Falsches Passwort");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Passwort erforderlich</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Dieses Projekt ist passwortgeschützt. Gib das Passwort ein, um fortzufahren.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Projektpasswort"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          autoFocus
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {submitting ? "Prüfe …" : "Entsperren"}
        </button>
      </form>
      <Link
        href="/"
        className="mt-6 block text-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        ← Zur Startseite
      </Link>
    </div>
  );
}

type ProjectPasswordGateProps = {
  projectId: string;
  projectTitle: string;
  children: React.ReactNode;
};

export function ProjectPasswordGate({ projectId, projectTitle, children }: ProjectPasswordGateProps) {
  const [unlockChecked, setUnlockChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);

  const checkUnlock = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/${projectId}/unlock`);
      const json = await res.json().catch(() => ({}));
      setUnlocked(!!json.unlocked);
      setPasswordProtected(!!json.passwordProtected);
    } catch {
      setUnlocked(false);
      setPasswordProtected(true);
    }
    setUnlockChecked(true);
  }, [projectId]);

  useEffect(() => {
    checkUnlock();
  }, [checkUnlock]);

  if (!unlockChecked) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Laden …</p>
      </div>
    );
  }

  if (passwordProtected && !unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-16">
        <ProjectPasswordForm
          projectId={projectId}
          projectTitle={projectTitle}
          onUnlocked={() => setUnlocked(true)}
        />
      </div>
    );
  }

  return <>{children}</>;
}
