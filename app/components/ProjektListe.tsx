"use client";

import Link from "next/link";
import type { Project } from "@/types/database";

type ProjektListeProps = { projects: Project[] };

export function ProjektListe({ projects }: ProjektListeProps) {
  return (
    <ul className="mt-3 space-y-2">
      {projects.map((p) => (
        <li key={p.id}>
          <Link
            href={`/projekt/${p.id}`}
            className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:border-zinc-600 dark:active:bg-zinc-600"
          >
            <span className="flex items-center gap-2 font-medium">
              {p.title}
              {typeof p.password_hash === "string" && p.password_hash.trim() !== "" && (
                <span className="text-zinc-400" title="Passwortgeschützt">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              )}
            </span>
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
