"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { updateProposedPostDate } from "../actions";

const DEBOUNCE_MS = 600;

type DateEditorProps = {
  videoId: string;
  proposedPostDate: string | null;
  labelId: string;
};

export function DateEditor({
  videoId,
  proposedPostDate,
  labelId,
}: DateEditorProps) {
  const router = useRouter();
  const [value, setValue] = useState<string>(() => {
    if (!proposedPostDate) return "";
    return proposedPostDate.includes("T")
      ? proposedPostDate.slice(0, 10)
      : proposedPostDate;
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const persist = useCallback(
    async (next: string) => {
      const trimmed = next.trim() || null;
      const current =
        proposedPostDate?.includes("T")
          ? proposedPostDate.slice(0, 10)
          : proposedPostDate ?? null;
      if (trimmed === current) return;
      setSaving(true);
      const result = await updateProposedPostDate(videoId, trimmed);
      setSaving(false);
      setDirty(false);
      if (result.ok) router.refresh();
    },
    [videoId, proposedPostDate, router]
  );

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => persist(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, dirty, persist]);

  return (
    <div>
      <label
        htmlFor={labelId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Vorgeschlagenes Postingdatum
      </label>
      <div className="flex items-center gap-2">
        <input
          id={labelId}
          type="date"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDirty(true);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
        {saving && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Wird gespeichert…
          </span>
        )}
      </div>
    </div>
  );
}
