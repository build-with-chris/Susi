"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProjektPasswortSetzenProps = {
  projectId: string;
  hasPassword: boolean;
};

export function ProjektPasswortSetzen({ projectId, hasPassword }: ProjektPasswortSetzenProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = newPassword.trim();
    if (!pwd) {
      setError("Bitte ein neues Passwort eingeben.");
      return;
    }
    if (hasPassword && !currentPassword.trim()) {
      setError("Bitte aktuelles Passwort zur Bestätigung eingeben.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/project/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        newPassword: pwd,
        currentPassword: hasPassword ? currentPassword.trim() : undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (res.ok) {
      setSuccess(true);
      setNewPassword("");
      setCurrentPassword("");
      router.refresh();
    } else {
      setError(data.error || "Fehler beim Speichern");
    }
  };

  if (success) {
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Passwort wurde gespeichert. Das Projekt ist jetzt passwortgeschützt.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
      {hasPassword && (
        <div>
          <label htmlFor="current-password" className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Aktuelles Passwort
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Aktuelles Passwort"
          />
        </div>
      )}
      <div>
        <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {hasPassword ? "Neues Passwort" : "Passwort setzen"}
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder={hasPassword ? "Neues Passwort" : "Projektpasswort"}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50"
      >
        {submitting ? "Speichern …" : hasPassword ? "Passwort ändern" : "Passwort setzen"}
      </button>
    </form>
  );
}
